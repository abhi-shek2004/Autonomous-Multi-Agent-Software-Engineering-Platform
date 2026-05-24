from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import List, Optional, Any

# Authentication
class UserCreate(BaseModel):
    username: str
    password: str
    role: Optional[str] = "developer"

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: UUID
    username: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

# Projects
class ProjectCreate(BaseModel):
    name: str = Field(..., example="Autonomous Agent E-Commerce Core")
    description: Optional[str] = Field(None, example="An autonomous microservice representing product catalog and orders.")
    github_url: Optional[str] = Field(None, example="https://github.com/example/e-commerce")

class ProjectResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    github_url: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Generated Files
class GeneratedFileCreate(BaseModel):
    file_path: str
    file_content: str
    file_type: str

class GeneratedFileResponse(BaseModel):
    id: UUID
    workflow_id: UUID
    file_path: str
    file_content: str
    file_type: str
    created_at: datetime

    class Config:
        from_attributes = True

# Agent Tasks
class AgentTaskResponse(BaseModel):
    id: UUID
    workflow_id: UUID
    agent_role: str
    task_description: str
    status: str
    output: Optional[str]
    code_quality_score: Optional[float]
    executed_at: datetime

    class Config:
        from_attributes = True

# Metrics
class MetricCreate(BaseModel):
    metric_name: str
    metric_value: float

class MetricResponse(BaseModel):
    id: UUID
    workflow_id: UUID
    metric_name: str
    metric_value: float
    recorded_at: datetime

    class Config:
        from_attributes = True

# Workflows
class WorkflowCreate(BaseModel):
    project_id: UUID
    requirements: str = Field(..., example="Build a scalable user management microservice in FastAPI with JWT authentication and PostgreSQL storage.")

class WorkflowResponse(BaseModel):
    id: UUID
    project_id: UUID
    status: str
    current_step: str
    graph_state: Optional[Any]
    started_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True

class WorkflowDetailsResponse(WorkflowResponse):
    tasks: List[AgentTaskResponse] = []
    files: List[GeneratedFileResponse] = []
    metrics: List[MetricResponse] = []
    
    class Config:
        from_attributes = True
