from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db_session
from unittest.mock import MagicMock,  AsyncMock
from sqlalchemy.exc import OperationalError
import psycopg

client = TestClient(app)

def test_create_short_url():
    response = client.post(
        "/api/v1/urls",
        json={"original_url": "https://exampletest.com"}
    )

    assert response.status_code == 201

    data = response.json()

    assert data["original_url"] == "https://exampletest.com/"
    assert len(data["short_code"]) == 6


def test_create_short_url_with_invalid_url():
    response = client.post(
        "/api/v1/urls",
        json={"original_url": "not-a-valid-url"}
    )

    assert response.status_code == 422

def test_redirect_existing_short_code():
    create_response = client.post(
        "/api/v1/urls",
        json={"original_url": "https://exampletest.com"}
    )

    short_code = create_response.json()["short_code"]

    response = client.get(
        f"/{short_code}",
        follow_redirects=False
    )

    assert response.status_code == 302
    assert response.headers["location"] == "https://exampletest.com/"


def test_redirect_nonexistent_short_code():
    response = client.get(
        "/ZZZZZZ",
        follow_redirects=False
    )

    assert response.status_code == 404
    assert response.json() == {
        "message": "Short URL not found"
    }


def test_create_short_url_database_unavailable():
    mock_session = MagicMock()
    mock_session.commit = AsyncMock(
        side_effect=OperationalError("Database unavailable", None, None)
    )
    mock_session.rollback = AsyncMock()

    async def override_get_db_session():
        yield mock_session

    app.dependency_overrides[get_db_session] = override_get_db_session

    try:
        response = client.post(
            "/api/v1/urls",
            json={"original_url": "https://exampletest.com"}
        )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 503
    assert response.json() == {
        "detail": "Database temporarily unavailable"
    }