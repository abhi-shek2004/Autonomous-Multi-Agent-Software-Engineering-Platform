from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict
from backend.sandbox.executor import SandboxExecutor

app = FastAPI(title="AMASEP Sandbox Executor Service", version="1.0.0")
executor = SandboxExecutor()

class FilePayload(BaseModel):
    path: str
    content: str

class TestExecutionRequest(BaseModel):
    files: List[FilePayload]

class CleanupRequest(BaseModel):
    workspace_path: str

@app.post("/api/sandbox/execute")
def run_sandbox_tests(req: TestExecutionRequest):
    try:
        files_dict = [{"path": f.path, "content": f.content} for f in req.files]
        result = executor.run_tests(files_dict)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Sandbox execution failed: {str(e)}"
        )

@app.post("/api/sandbox/cleanup")
def cleanup_sandbox_workspace(req: CleanupRequest):
    try:
        executor.clean_workspace(req.workspace_path)
        return {"message": "Workspace cleaned successfully."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Workspace cleanup failed: {str(e)}"
        )

@app.get("/health")
def healthcheck():
    return {
        "status": "healthy",
        "service": "sandbox-service"
    }
