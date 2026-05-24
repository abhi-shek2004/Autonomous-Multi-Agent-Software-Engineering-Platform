import time
from typing import List
from uuid import UUID
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.common.config import settings
from backend.common.models import init_db, get_db, User, Project, Workflow, AgentTask, GeneratedFile, Metric
from backend.common.schemas import (
    UserCreate, UserResponse, Token, ProjectCreate, ProjectResponse,
    WorkflowCreate, WorkflowResponse, WorkflowDetailsResponse
)
from backend.api_gateway.auth import (
    hash_password, verify_password, create_access_token, get_current_user, RoleChecker
)
import redis

app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis Rate Limiter Connection with Fallback
try:
    r_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    r_client.ping()
    print("[API Gateway] Connected to Redis successfully.")
except Exception as e:
    print(f"[API Gateway] Redis warning: {e}. Falling back to in-memory rate limiting.")
    r_client = None

# In-memory rate limiting fallback database
local_rate_limit_db = {}

# Startup Database Init
@app.on_event("startup")
def startup_event():
    init_db()

# Rate Limiter Middleware
@app.middleware("http")
async def rate_limiter_middleware(request: Request, call_next):
    client_ip = request.client.host
    limit = 60  # requests per minute
    current_time = int(time.time())
    window = current_time // 60
    
    key = f"rate:{client_ip}:{window}"
    
    if r_client:
        try:
            current_hits = r_client.get(key)
            if current_hits and int(current_hits) >= limit:
                return HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Rate limit exceeded. Please try again in a minute."
                )
            r_client.incr(key)
            r_client.expire(key, 60)
        except Exception:
            pass
    else:
        # Fallback to local dict
        if key not in local_rate_limit_db:
            local_rate_limit_db[key] = 0
        if local_rate_limit_db[key] >= limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded (in-memory limit). Please try again in a minute."
            )
        local_rate_limit_db[key] += 1
        
    response = await call_next(request)
    return response

# ==========================================
# AUTHENTICATION ROUTERS
# ==========================================

@app.post("/api/auth/register", response_model=UserResponse, status_code=status.HTTP_211_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user_in.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed = hash_password(user_in.password)
    new_user = User(
        username=user_in.username,
        hashed_password=hashed,
        role=user_in.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/auth/token", response_model=Token)
def login_for_access_token(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_in.username).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# ==========================================
# PROJECT ROUTERS
# ==========================================

@app.post("/api/projects", response_model=ProjectResponse)
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_project = Project(
        name=project_in.name,
        description=project_in.description,
        github_url=project_in.github_url
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@app.get("/api/projects", response_model=List[ProjectResponse])
def list_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Project).all()

@app.get("/api/projects/{project_id}", response_model=ProjectResponse)
def get_project_details(project_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

# ==========================================
# WORKFLOW ROUTERS
# ==========================================

@app.post("/api/workflows", response_model=WorkflowResponse)
def start_workflow(workflow_in: WorkflowCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == workflow_in.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    new_workflow = Workflow(
        project_id=workflow_in.project_id,
        status="pending",
        current_step="Ingestion",
        graph_state={"requirements": workflow_in.requirements}
    )
    db.add(new_workflow)
    db.commit()
    db.refresh(new_workflow)
    
    # Trigger Orchestrator task asynchronously via Celery (integrated in next phases)
    # We will trigger the actual workflow job run here or proxy it.
    try:
        import httpx
        httpx.post(f"{settings.ORCHESTRATOR_URL}/api/orchestrator/trigger", json={
            "workflow_id": str(new_workflow.id),
            "requirements": workflow_in.requirements
        })
    except Exception as e:
        print(f"[API Gateway] Orchestrator microservice request warning: {e}. Active workflow will be launched asynchronously via local runner or celery queue.")
        
    return new_workflow

@app.get("/api/workflows/{workflow_id}", response_model=WorkflowDetailsResponse)
def get_workflow_details(workflow_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Get associated sub-entities
    tasks = db.query(AgentTask).filter(AgentTask.workflow_id == workflow_id).all()
    files = db.query(GeneratedFile).filter(GeneratedFile.workflow_id == workflow_id).all()
    metrics = db.query(Metric).filter(Metric.workflow_id == workflow_id).all()
    
    # Pack into response
    response_details = WorkflowDetailsResponse.model_validate(workflow)
    response_details.tasks = tasks
    response_details.files = files
    response_details.metrics = metrics
    
    return response_details

@app.get("/api/workflows/project/{project_id}", response_model=List[WorkflowResponse])
def get_project_workflows(project_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Workflow).filter(Workflow.project_id == project_id).all()

# Healthcheck
@app.get("/health")
def healthcheck():
    return {"status": "healthy", "service": "api-gateway"}
