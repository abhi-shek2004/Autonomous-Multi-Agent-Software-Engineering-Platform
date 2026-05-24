import asyncio
from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, END
from backend.common.models import SessionLocal, Workflow, AgentTask, GeneratedFile, Metric
from backend.orchestrator.agents import get_agent_by_role
from backend.orchestrator.sockets import socket_manager

class WorkflowState(TypedDict):
    workflow_id: str
    requirements: str
    current_step: str
    prd: str
    architecture: str
    source_code: List[Dict[str, str]]
    tests: List[Dict[str, str]]
    security_report: str
    review_score: float
    review_feedback: str
    test_results: Dict[str, Any]
    healed: bool
    iterations: int
    docker_config: str
    documentation: str

# Helper to save agent activities & emit WebSocket logs
def persist_and_stream(workflow_id: str, role: str, thought: str, output: str, quality_score: float = None):
    # 1. Update Database
    db = SessionLocal()
    try:
        # Save AgentTask
        task = AgentTask(
            workflow_id=workflow_id,
            agent_role=role,
            task_description=f"Generate {role} details",
            status="completed",
            output=output,
            code_quality_score=quality_score
        )
        db.add(task)
        
        # Determine file type
        file_type = "source_code"
        if role == "Software Architect":
            file_type = "architecture"
        elif role == "Test Engineer":
            file_type = "test"
        elif role == "DevOps Engineer":
            file_type = "docker"
        elif role == "Documentation Agent":
            file_type = "documentation"
            
        # Save GeneratedFile (if structural text output is produced)
        if output and role not in ["Product Manager", "Reviewer", "Security Engineer"]:
            gen_file = GeneratedFile(
                workflow_id=workflow_id,
                file_path=f"simulated_{role.lower().replace(' ', '_')}.txt",
                file_content=output,
                file_type=file_type
            )
            db.add(gen_file)
            
        # Update Workflow state
        wf = db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if wf:
            wf.current_step = role
            # Sync graph state
            if not wf.graph_state:
                wf.graph_state = {}
            wf.graph_state[role] = {"thought": thought, "status": "completed"}
            db.add(wf)
            
        db.commit()
    except Exception as e:
        print(f"[Graph Core DB Exception] {e}")
        db.rollback()
    finally:
        db.close()
        
    # 2. WebSocket live emit
    loop = asyncio.get_event_loop()
    if loop.is_running():
        loop.create_task(socket_manager.broadcast_to_workflow(workflow_id, {
            "type": "agent_activity",
            "role": role,
            "thought": thought,
            "output": output,
            "quality_score": quality_score
        }))

# Node 1: Product Manager
def product_manager_node(state: WorkflowState) -> WorkflowState:
    agent = get_agent_by_role("Product Manager")
    res = agent.execute_task("Analyze requirements and break down into PRD specs.", {"requirements": state["requirements"]})
    
    persist_and_stream(state["workflow_id"], "Product Manager", res["thought"], res["output"])
    
    return {
        **state,
        "prd": res["output"],
        "current_step": "Product Manager"
    }

# Node 2: Software Architect
def architect_node(state: WorkflowState) -> WorkflowState:
    agent = get_agent_by_role("Software Architect")
    res = agent.execute_task("Generate codebase folder layout and PostgreSQL models.", {"requirements": state["prd"]})
    
    persist_and_stream(state["workflow_id"], "Software Architect", res["thought"], res["output"])
    
    return {
        **state,
        "architecture": res["output"],
        "current_step": "Software Architect"
    }

# Node 3: Backend & Frontend Engineers (Code Gen)
def code_generator_node(state: WorkflowState) -> WorkflowState:
    be_agent = get_agent_by_role("Backend Engineer")
    fe_agent = get_agent_by_role("Frontend Engineer")
    
    be_res = be_agent.execute_task("Generate FastAPI backend services.", {"requirements": state["architecture"]})
    persist_and_stream(state["workflow_id"], "Backend Engineer", be_res["thought"], be_res["output"])
    
    fe_res = fe_agent.execute_task("Generate React React UI dashboard.", {"requirements": state["architecture"]})
    persist_and_stream(state["workflow_id"], "Frontend Engineer", fe_res["thought"], fe_res["output"])
    
    files = [
        {"path": "models.py", "content": be_res["output"]},
        {"path": "Dashboard.jsx", "content": fe_res["output"]}
    ]
    
    return {
        **state,
        "source_code": files,
        "current_step": "Code Generation"
    }

# Node 4: Reviewer
def reviewer_node(state: WorkflowState) -> WorkflowState:
    agent = get_agent_by_role("Reviewer")
    res = agent.execute_task(
        "Audit generated Backend/Frontend structures. Enforce high standard score.",
        {"requirements": state["requirements"], "healing_run": state["healed"]}
    )
    
    # Logic to set score. If healed (after debugging), give high score, else initial fail score
    score = 95.0 if state["healed"] else 75.0
    
    persist_and_stream(state["workflow_id"], "Reviewer", res["thought"], res["output"], quality_score=score)
    
    return {
        **state,
        "review_score": score,
        "review_feedback": res["output"],
        "current_step": "Reviewer"
    }

# Node 5: Security Scanner
def security_node(state: WorkflowState) -> WorkflowState:
    agent = get_agent_by_role("Security Engineer")
    res = agent.execute_task("Assess security vulnerability risk score.", {"requirements": state["requirements"]})
    
    persist_and_stream(state["workflow_id"], "Security Engineer", res["thought"], res["output"])
    
    return {
        **state,
        "security_report": res["output"],
        "current_step": "Security Scan"
    }

# Node 6: Test Generator
def test_generator_node(state: WorkflowState) -> WorkflowState:
    agent = get_agent_by_role("Test Engineer")
    res = agent.execute_task("Build automated pytest templates for backend.", {"requirements": state["requirements"]})
    
    persist_and_stream(state["workflow_id"], "Test Engineer", res["thought"], res["output"])
    
    tests = [
        {"path": "test_auth.py", "content": res["output"]}
    ]
    
    return {
        **state,
        "tests": tests,
        "current_step": "Test Generation"
    }

# Node 7: Sandbox Execution Engine
def sandbox_tester_node(state: WorkflowState) -> WorkflowState:
    # Compile files (source + tests) and post to local isolated sandbox executor
    # For simulation safety: if healed is False, simulate standard pytest execution failure. 
    # If healed is True, simulate passing test results!
    time.sleep(1.5)
    
    success = state["healed"]
    if not success:
        stdout = "================== FAILURES ==================\n___ test_user_creation ___\n> assert response.status_code == 201\nE assert 500 == 201\nE - 500\nE + 201\n================ 1 failed in 0.12s ================"
        stderr = "CRITICAL: Incomplete Exception Handling caused HTTP 500 Internals."
    else:
        stdout = "================== PASSES ==================\n___ test_user_creation ___\n1 passed in 0.08s\n================ 1 passed in 0.08s ================"
        stderr = ""
        
    test_results = {
        "success": success,
        "stdout": stdout,
        "stderr": stderr
    }
    
    # Save sandbox execution metrics
    db = SessionLocal()
    try:
        metric = Metric(
            workflow_id=state["workflow_id"],
            metric_name="pytest_coverage",
            metric_value=92.0 if success else 45.0
        )
        db.add(metric)
        db.commit()
    except Exception as e:
        db.rollback()
    finally:
        db.close()
        
    loop = asyncio.get_event_loop()
    if loop.is_running():
        loop.create_task(socket_manager.broadcast_to_workflow(state["workflow_id"], {
            "type": "sandbox_execution",
            "results": test_results
        }))
        
    return {
        **state,
        "test_results": test_results,
        "current_step": "Sandbox Testing"
    }

# Node 8: Debugger
def debugger_node(state: WorkflowState) -> WorkflowState:
    agent = get_agent_by_role("Debugging Agent")
    res = agent.execute_task(
        "Apply code fixes to address credentials exception and Pytest traceback failures.",
        {"traceback": state["test_results"]["stdout"]}
    )
    
    persist_and_stream(state["workflow_id"], "Debugging Agent", res["thought"], res["output"])
    
    # Inject healed source file
    fixed_files = state["source_code"].copy()
    fixed_files.append({"path": "auth_fixed.py", "content": res["output"]})
    
    return {
        **state,
        "source_code": fixed_files,
        "healed": True,
        "iterations": state["iterations"] + 1,
        "current_step": "Debugging"
    }

# Node 9: DevOps Deployment
def devops_node(state: WorkflowState) -> WorkflowState:
    agent = get_agent_by_role("DevOps Engineer")
    res = agent.execute_task("Generate container specs and multi-stage Dockerfiles.", {"requirements": state["requirements"]})
    
    persist_and_stream(state["workflow_id"], "DevOps Engineer", res["thought"], res["output"])
    
    return {
        **state,
        "docker_config": res["output"],
        "current_step": "DevOps Deployment"
    }

# Node 10: Documentation
def documentation_node(state: WorkflowState) -> WorkflowState:
    agent = get_agent_by_role("Documentation Agent")
    res = agent.execute_task("Create production deployment README and system specifications.", {"requirements": state["requirements"]})
    
    persist_and_stream(state["workflow_id"], "Documentation Agent", res["thought"], res["output"])
    
    # Update Workflow state to complete
    db = SessionLocal()
    try:
        wf = db.query(Workflow).filter(Workflow.id == state["workflow_id"]).first()
        if wf:
            wf.status = "completed"
            db.add(wf)
            db.commit()
    except Exception as e:
        db.rollback()
    finally:
        db.close()
        
    loop = asyncio.get_event_loop()
    if loop.is_running():
        loop.create_task(socket_manager.broadcast_to_workflow(state["workflow_id"], {
            "type": "workflow_completed",
            "workflow_id": state["workflow_id"]
        }))
        
    return {
        **state,
        "documentation": res["output"],
        "current_step": "Documentation Complete"
    }

# Conditional Transition Logic
def review_decision_edge(state: WorkflowState):
    """Router deciding whether to debug/fix or proceed to security scans."""
    if state["review_score"] < 80.0 and state["iterations"] < 2:
        return "debugger"
    return "security"

def test_decision_edge(state: WorkflowState):
    """Router deciding whether to self-heal or deploy."""
    if not state["test_results"]["success"] and state["iterations"] < 2:
        return "debugger"
    return "devops"

# Build StateGraph Engine
def compile_workflow_graph() -> StateGraph:
    builder = StateGraph(WorkflowState)
    
    # Add Nodes
    builder.add_node("product_manager", product_manager_node)
    builder.add_node("architect", architect_node)
    builder.add_node("code_generator", code_generator_node)
    builder.add_node("reviewer", reviewer_node)
    builder.add_node("security", security_node)
    builder.add_node("test_generator", test_generator_node)
    builder.add_node("sandbox_tester", sandbox_tester_node)
    builder.add_node("debugger", debugger_node)
    builder.add_node("devops", devops_node)
    builder.add_node("documentation", documentation_node)
    
    # Configure Structural Flow Transitions
    builder.set_entry_point("product_manager")
    builder.add_edge("product_manager", "architect")
    builder.add_edge("architect", "code_generator")
    builder.add_edge("code_generator", "reviewer")
    
    # Add conditional router edge for Review Quality
    builder.add_conditional_edges(
        "reviewer",
        review_decision_edge,
        {
            "debugger": "debugger",
            "security": "security"
        }
    )
    
    builder.add_edge("security", "test_generator")
    builder.add_edge("test_generator", "sandbox_tester")
    
    # Add conditional router edge for Test Execution success
    builder.add_conditional_edges(
        "sandbox_tester",
        test_decision_edge,
        {
            "debugger": "debugger",
            "devops": "devops"
        }
    )
    
    # Loop debugger outputs back to Reviewer auditing
    builder.add_edge("debugger", "reviewer")
    
    builder.add_edge("devops", "documentation")
    builder.add_edge("documentation", END)
    
    return builder.compile()

# Master function to invoke the LangGraph execution flow
async def execute_agent_workflow(workflow_id: str, requirements: str):
    graph = compile_workflow_graph()
    
    initial_state = {
        "workflow_id": workflow_id,
        "requirements": requirements,
        "current_step": "Ingestion",
        "prd": "",
        "architecture": "",
        "source_code": [],
        "tests": [],
        "security_report": "",
        "review_score": 0.0,
        "review_feedback": "",
        "test_results": {},
        "healed": False,
        "iterations": 0,
        "docker_config": "",
        "documentation": ""
    }
    
    print(f"[LangGraph Engine] Launching workflow executor graph for ID: {workflow_id}")
    
    # Update status in db to running
    db = SessionLocal()
    try:
        wf = db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if wf:
            wf.status = "running"
            db.add(wf)
            db.commit()
    except Exception as e:
        db.rollback()
    finally:
        db.close()
        
    # Start graph execution run
    try:
        await asyncio.to_thread(graph.invoke, initial_state)
    except Exception as e:
        print(f"[LangGraph Engine] Run Critical Error: {e}")
        db = SessionLocal()
        try:
            wf = db.query(Workflow).filter(Workflow.id == workflow_id).first()
            if wf:
                wf.status = "failed"
                db.add(wf)
                db.commit()
        except Exception:
            db.rollback()
        finally:
            db.close()
            
        loop = asyncio.get_event_loop()
        if loop.is_running():
            await socket_manager.broadcast_to_workflow(workflow_id, {
                "type": "workflow_failed",
                "error": str(e)
            })
