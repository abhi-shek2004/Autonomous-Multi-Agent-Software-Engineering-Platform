import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Autonomous Multi-Agent Software Engineering Platform"
    
    # Secret Key for JWT Signing
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-production-grade-jwt-signing-key-1337-amasep")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/amasep")
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # OpenAI API
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Mode Settings
    SIMULATION_MODE: bool = os.getenv("SIMULATION_MODE", "true").lower() == "true"
    
    # Microservice URLs (For gateway routing)
    GATEWAY_URL: str = os.getenv("GATEWAY_URL", "http://localhost:8000")
    ORCHESTRATOR_URL: str = os.getenv("ORCHESTRATOR_URL", "http://localhost:8001")
    RAG_URL: str = os.getenv("RAG_URL", "http://localhost:8002")
    SANDBOX_URL: str = os.getenv("SANDBOX_URL", "http://localhost:8003")

    class Config:
        case_sensitive = True

settings = Settings()
