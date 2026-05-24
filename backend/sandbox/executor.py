import os
import shutil
import subprocess
import tempfile
import sys
from typing import List, Dict, Any

class SandboxExecutor:
    def __init__(self, workspace_base: str = None):
        if workspace_base:
            self.workspace_base = workspace_base
        else:
            # Create a dedicated temp workspace within user's app workspace
            # NEVER use /tmp outside workspace. Let's place it inside current directory.
            cwd = os.getcwd()
            self.workspace_base = os.path.join(cwd, "sandbox_workspace")
        
        os.makedirs(self.workspace_base, exist_ok=True)

    def write_files(self, workspace_path: str, files: List[Dict[str, str]]):
        """Writes structural code files to a target sandbox folder."""
        for file in files:
            file_path = file.get("path", "")
            content = file.get("content", "")
            
            if not file_path:
                continue
                
            # Construct absolute target path in sandbox environment
            full_path = os.path.join(workspace_path, file_path)
            
            # Create parent directories if they don't exist
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            
            with open(full_path, "w", encoding="utf-8") as f:
                f.write(content)

    def run_tests(self, files: List[Dict[str, str]]) -> Dict[str, Any]:
        """Prepares a workspace, writes tests & source files, and executes pytest."""
        # Create a unique temporary directory inside the workspace_base
        temp_dir = tempfile.mkdtemp(dir=self.workspace_base)
        
        try:
            # Write all code files and test suites
            self.write_files(temp_dir, files)
            
            # Identify test files to run (usually files containing test_*.py or *_test.py)
            test_files = []
            for file in files:
                file_path = file.get("path", "")
                if "test_" in file_path or "_test" in file_path:
                    test_files.append(file_path)
            
            # Execute pytest as subprocess
            cmd = [sys.executable, "-m", "pytest", "-v"]
            if test_files:
                cmd.extend(test_files)
                
            print(f"[Sandbox Executor] Executing command: {' '.join(cmd)} in {temp_dir}")
            
            result = subprocess.run(
                cmd,
                cwd=temp_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=15  # 15 seconds timeout to prevent hanging
            )
            
            passed = result.returncode == 0
            
            return {
                "success": passed,
                "exit_code": result.returncode,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "workspace": temp_dir
            }
            
        except subprocess.TimeoutExpired as e:
            return {
                "success": False,
                "exit_code": -1,
                "stdout": e.stdout.decode() if e.stdout else "",
                "stderr": "Execution Timeout Expired. Process took longer than 15 seconds.",
                "workspace": temp_dir
            }
        except Exception as e:
            return {
                "success": False,
                "exit_code": -2,
                "stdout": "",
                "stderr": f"Error running sandbox execution: {str(e)}",
                "workspace": temp_dir
            }
        finally:
            # Keep directories intact temporarily for debug review if they failed,
            # otherwise remove them to save memory.
            pass

    def clean_workspace(self, workspace_path: str):
        """Cleans up a used workspace path to conserve disk space."""
        if os.path.exists(workspace_path) and workspace_path.startswith(self.workspace_base):
            shutil.rmtree(workspace_path, ignore_errors=True)
            print(f"[Sandbox Executor] Cleaned up workspace: {workspace_path}")
