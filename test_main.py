from fastapi.testclient import TestClient
from main import app
from pydantic import BaseModel
import pytest

# Initialize test client
client = TestClient(app)

# Test data
SAMPLE_FRUIT = {"name": "apple"}
INVALID_FRUIT = {"name": 123}  # Wrong data type


def test_get_fruits_empty():
    """Test GET /fruits with empty database"""
    response = client.get("/fruits")
    assert response.status_code == 200
    assert response.json() == {"fruits": []}

def test_add_and_get_fruit():
    """Test full cycle: POST then GET"""
    # Add fruit
    post_response = client.post("/fruits", json=SAMPLE_FRUIT)
    assert post_response.status_code == 200
    assert post_response.json() == SAMPLE_FRUIT
    
    # Verify GET shows the added fruit
    get_response = client.get("/fruits")
    assert get_response.status_code == 200
    assert SAMPLE_FRUIT in get_response.json()["fruits"]

def test_invalid_fruit_data():
    response = client.post("/fruits", json=INVALID_FRUIT)
    assert response.status_code == 422
    assert "should be a valid string" in response.text.lower()

def test_cors_headers():
    """Test CORS headers are present"""
    origin = "http://localhost:5173"
    response = client.options(
        "/fruits",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "POST"
        }
    )
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers
    assert origin in response.headers["access-control-allow-origin"]

# Fixture to reset state between tests
@pytest.fixture(autouse=True)
def reset_db():
    from main import memory_db
    memory_db["fruits"] = []
    yield