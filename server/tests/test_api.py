from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch,  AsyncMock
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
    with patch(
        "app.main.get_db_connection",
        new_callable=AsyncMock,
        side_effect=psycopg.OperationalError("Database unavailable")
    ):
        response = client.post(
            "/api/v1/urls",
            json={"original_url": "https://exampletest.com"}
        )

    assert response.status_code == 503
    assert response.json() == {
        "detail": "Database temporarily unavailable"
    }