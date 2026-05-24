import os
import re
from typing import List, Dict, Any

class CodeIndexer:
    def __init__(self, chunk_size: int = 40, overlap: int = 10):
        self.chunk_size = chunk_size  # Number of lines per chunk
        self.overlap = overlap        # Line overlap between chunks
        self.ignored_dirs = {
            ".git", "node_modules", "venv", ".venv", "env", "__pycache__", 
            "dist", "build", ".pytest_cache", ".idea", ".vscode"
        }
        self.supported_extensions = {
            ".py", ".js", ".jsx", ".ts", ".tsx", ".html", ".css", 
            ".json", ".yaml", ".yml", ".sql", ".sh", ".dockerfile", "Dockerfile"
        }

    def _parse_functions(self, file_content: str, ext: str) -> List[Dict[str, Any]]:
        """Extracts functions using simple AST regex markers to isolate functional segments."""
        functions = []
        lines = file_content.splitlines()
        
        if ext == ".py":
            # Match python functions
            pattern = re.compile(r"^\s*(def|class)\s+(\w+)")
            for i, line in enumerate(lines):
                match = pattern.match(line)
                if match:
                    # Capture functional block (up to 30 lines after definition)
                    block = "\n".join(lines[i:i+30])
                    functions.append({
                        "name": match.group(2),
                        "type": match.group(1),
                        "content": block,
                        "start_line": i + 1,
                        "end_line": min(i + 30, len(lines))
                    })
        elif ext in {".js", ".jsx", ".ts", ".tsx"}:
            # Match javascript functions
            pattern = re.compile(r"^\s*(function|const|class)\s+(\w+)")
            for i, line in enumerate(lines):
                match = pattern.match(line)
                if match:
                    block = "\n".join(lines[i:i+30])
                    functions.append({
                        "name": match.group(2),
                        "type": match.group(1),
                        "content": block,
                        "start_line": i + 1,
                        "end_line": min(i + 30, len(lines))
                    })
        return functions

    def index_directory(self, root_dir: str) -> List[Dict[str, Any]]:
        """Walks directory and compiles chunk metadata for indexing."""
        chunks = []
        if not os.path.exists(root_dir):
            print(f"[RAG Indexer] Error: directory {root_dir} does not exist.")
            return chunks

        for root, dirs, files in os.walk(root_dir):
            # Prune ignored folders
            dirs[:] = [d for d in dirs if d not in self.ignored_dirs]
            
            for file in files:
                ext = os.path.splitext(file)[1]
                if ext not in self.supported_extensions and file not in self.supported_extensions:
                    continue
                    
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                except Exception as e:
                    print(f"[RAG Indexer] Skipped {file_path} due to read error: {e}")
                    continue

                lines = content.splitlines()
                total_lines = len(lines)
                
                # Index by sliding window line chunks
                i = 0
                while i < total_lines:
                    end_idx = min(i + self.chunk_size, total_lines)
                    chunk_text = "\n".join(lines[i:end_idx])
                    
                    if chunk_text.strip():
                        chunks.append({
                            "file_path": file_path,
                            "filename": file,
                            "content": chunk_text,
                            "start_line": i + 1,
                            "end_line": end_idx,
                            "type": "block"
                        })
                    
                    i += (self.chunk_size - self.overlap)
                    if i >= total_lines or self.chunk_size >= total_lines:
                        break

                # Index major functions and structures specifically
                funcs = self._parse_functions(content, ext)
                for fn in funcs:
                    chunks.append({
                        "file_path": file_path,
                        "filename": file,
                        "content": fn["content"],
                        "start_line": fn["start_line"],
                        "end_line": fn["end_line"],
                        "type": f"functional:{fn['type']}:{fn['name']}"
                    })

        return chunks
