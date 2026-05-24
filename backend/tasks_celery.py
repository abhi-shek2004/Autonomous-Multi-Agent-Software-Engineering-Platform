import asyncio
from backend.celery_app import celery_app
from backend.orchestrator.graph import execute_agent_workflow

@celery_app.task(name="tasks_celery.run_agent_workflow")
def run_agent_workflow(workflow_id: str, requirements: str):
    """Bridge sync Celery worker with async LangGraph workflow invocation loop."""
    print(f"[Celery Worker] Starting long-running task for workflow: {workflow_id}")
    
    # Establish new event loop since celery worker thread may not have one running
    loop = asyncio.get_event_loop()
    if loop.is_closed():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
    try:
        loop.run_until_complete(execute_agent_workflow(workflow_id, requirements))
    except Exception as e:
        print(f"[Celery Worker] Task run error: {e}")
    finally:
        # We don't close loop here to allow consecutive runs
        pass
        
    return {"status": "completed", "workflow_id": workflow_id}
