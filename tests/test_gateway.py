import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from backend.api_gateway.main import app
from backend.api_gateway.auth import hash_password, verify_password, create_access_token

client = TestClient(app)

def test_password_hashing():
    pwd = "securepassword123"
    hashed = hash_password(pwd)
    assert hashed != pwd
    assert verify_password(pwd, hashed) is True
    assert verify_password("wrong_pwd", hashed) is False

def test_access_token_creation():
    data = {"sub": "testuser", "role": "developer"}
    token = create_access_token(data)
    assert isinstance(token, str)
    assert len(token) > 20

def test_gateway_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert response.json()["service"] == "api-gateway"
