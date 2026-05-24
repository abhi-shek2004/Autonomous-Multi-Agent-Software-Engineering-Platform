import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, status
from pydantic import BaseModel
from backend.orchestrator.sockets import socket_manager
from backend.orchestrator.graph import execute_agent_workflow
from backend.tasks_celery import run_agent_workflow
from backend.common.config import settings

app = FastAPI(title="AMASEP Agent Orchestrator Service", version="1.0.0")

class TriggerRequest(BaseModel):
    workflow_id: str
    requirements: str

@app.post("/api/orchestrator/trigger")
def trigger_orchestrator(req: TriggerRequest):
    """Enqueues workflow via Celery background runner, falling back to direct background thread if Celery/Redis is offline."""
    try:
        # 1. Attempt enqueuing via Celery
        run_agent_workflow.delay(req.workflow_id, req.requirements)
        print(f"[Orchestrator API] Enqueued workflow {req.workflow_id} via Celery.")
        return {"status": "enqueued", "engine": "celery", "workflow_id": req.workflow_id}
    except Exception as ce:
        print(f"[Orchestrator API] Celery queuing failed ({ce}). Launching via direct asyncio task fallback.")
        
        # 2. Resilient local fallback task launching
        try:
            loop = asyncio.get_event_loop()
            loop.create_task(execute_agent_workflow(req.workflow_id, req.requirements))
            return {"status": "running", "engine": "local_fallback", "workflow_id": req.workflow_id}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to initiate workflow: {str(e)}"
            )

@app.websocket("/ws/workflow/{workflow_id}")
async def websocket_endpoint(websocket: WebSocket, workflow_id: str):
    await socket_manager.connect(websocket, workflow_id)
    try:
        # Hold connection open and stream logs/agent state updates
        while True:
            # Keep-alive heartbeat read
            data = await websocket.receive_text()
            # Respond to client-sent heartbeat/ping messages
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        socket_manager.disconnect(websocket, workflow_id)
    except Exception as e:
        print(f"[WebSocket Loop Warning] {e}")
        socket_manager.disconnect(websocket, workflow_id)

@app.get("/health")
def healthcheck():
    return {
        "status": "healthy",
        "service": "orchestrator-service"
    }
