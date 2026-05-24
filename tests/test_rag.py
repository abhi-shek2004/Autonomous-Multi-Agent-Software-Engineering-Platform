import pytest
import os
import tempfile
from backend.rag_service.indexer import CodeIndexer
from backend.rag_service.vector_store import VectorStore

def test_indexer_ast_parsing():
    indexer = CodeIndexer()
    python_code = """
class DataModel:
    def __init__(self):
        pass

def process_records(data):
    return len(data)
"""
    # Write to a temporary file
    with tempfile.TemporaryDirectory() as tmpdir:
        file_path = os.path.join(tmpdir, "test_file.py")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(python_code)
            
        chunks = indexer.index_directory(tmpdir)
        # Should parse slide chunks and functions
        assert len(chunks) > 0
        
        # Verify function parsed specifically
        functional_chunks = [c for c in chunks if "functional" in c["type"]]
        assert len(functional_chunks) >= 2
        assert any("process_records" in c["type"] for c in functional_chunks)

def test_vector_store_fallback():
    # FAISS dimension 1536
    store = VectorStore(dimension=1536)
    
    docs = [
        {"content": "def create_user(db, user): return db.add(user)", "file_path": "auth.py"},
        {"content": "import react from 'react'", "file_path": "index.js"}
    ]
    
    store.add_documents(docs)
    assert store.index.ntotal == 2
    
    # Perform semantic search query
    results = store.search("user creation", top_k=1)
    assert len(results) == 1
    assert "auth.py" in results[0]["file_path"]
