import uuid
from datetime import datetime
from sqlalchemy import create_engine, Column, String, DateTime, Float, ForeignKey, Text, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from backend.common.config import settings

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="developer")  # developer, admin, architect
    created_at = Column(DateTime, default=datetime.utcnow)

class Project(Base):
    __tablename__ = "projects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    github_url = Column(String, nullable=True)
    status = Column(String, default="active")  # active, archived
    created_at = Column(DateTime, default=datetime.utcnow)
    
    workflows = relationship("Workflow", back_populates="project", cascade="all, delete-orphan")

class Workflow(Base):
    __tablename__ = "workflows"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, default="pending")  # pending, running, completed, failed
    current_step = Column(String, default="Ingestion")
    graph_state = Column(JSON, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    project = relationship("Project", back_populates="workflows")
    tasks = relationship("AgentTask", back_populates="workflow", cascade="all, delete-orphan")
    files = relationship("GeneratedFile", back_populates="workflow", cascade="all, delete-orphan")
    metrics = relationship("Metric", back_populates="workflow", cascade="all, delete-orphan")

class AgentTask(Base):
    __tablename__ = "agent_tasks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False)
    agent_role = Column(String, nullable=False)  # Product Manager, Architect, etc.
    task_description = Column(Text, nullable=False)
    status = Column(String, default="pending")  # pending, executing, completed, failed
    output = Column(Text, nullable=True)
    code_quality_score = Column(Float, nullable=True)
    executed_at = Column(DateTime, default=datetime.utcnow)
    
    workflow = relationship("Workflow", back_populates="tasks")

class GeneratedFile(Base):
    __tablename__ = "generated_files"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False)
    file_path = Column(String, nullable=False)
    file_content = Column(Text, nullable=False)
    file_type = Column(String, nullable=False)  # source_code, architecture, test, documentation, docker
    created_at = Column(DateTime, default=datetime.utcnow)
    
    workflow = relationship("Workflow", back_populates="files")

class Metric(Base):
    __tablename__ = "metrics"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id = Column(UUID(as_uuid=True), ForeignKey("workflows.id", ondelete="CASCADE"), nullable=False)
    metric_name = Column(String, nullable=False)  # cpu_usage, duration, quality_score, coverage
    metric_value = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    
    workflow = relationship("Workflow", back_populates="metrics")

# Database session setup
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
