import pytest
from pydantic import ValidationError
from app.main import URLRequest

def test_valid_url():
    request = URLRequest(original_url="https://example.com")

    assert str(request.original_url) == "https://example.com/"

def test_invalid_url():
    with pytest.raises(ValidationError):
        URLRequest(original_url="not-a-valid-url")