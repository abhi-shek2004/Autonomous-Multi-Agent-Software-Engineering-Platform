from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from backend.rag_service.vector_store import VectorStore
from backend.rag_service.indexer import CodeIndexer

app = FastAPI(title="AMASEP RAG Service", version="1.0.0")
vector_store = VectorStore()
indexer = CodeIndexer()

class IngestRequest(BaseModel):
    directory_path: str

class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 4

@app.post("/api/rag/ingest", status_code=status.HTTP_201_CREATED)
def ingest_directory(req: IngestRequest):
    try:
        chunks = indexer.index_directory(req.directory_path)
        if not chunks:
            return {"message": "No code artifacts or supported files found to index.", "chunks_count": 0}
            
        vector_store.add_documents(chunks)
        return {
            "message": "Repository successfully ingested.",
            "chunks_count": len(chunks),
            "directory": req.directory_path
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to ingest directory: {str(e)}"
        )

@app.post("/api/rag/search")
def search_codebase(req: SearchRequest):
    try:
        results = vector_store.search(req.query, top_k=req.top_k)
        return {"results": results}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Semantic search failed: {str(e)}"
        )

@app.post("/api/rag/clear")
def clear_index():
    try:
        vector_store.clear()
        return {"message": "RAG database cleared successfully."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to clear vector store: {str(e)}"
        )

@app.get("/health")
def healthcheck():
    return {
        "status": "healthy",
        "service": "rag-service",
        "indexed_chunks": len(vector_store.metadata)
    }
