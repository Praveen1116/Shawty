from fastapi import FastAPI
from pydantic import BaseModel, HttpUrl
from fastapi.responses import JSONResponse, RedirectResponse
from app.short_code import generate_short_code

app = FastAPI()

class URLRequest(BaseModel):
    original_url: HttpUrl

@app.get("/",)
def home():
    return JSONResponse(
        status_code=200,
        content={"message": "Shawty running fine"}
    )

@app.get("/healthcheck")
def health():
    return JSONResponse(
        status_code=200,
        content={"message": "Health is fine!"}
    )

@app.get("/{short_code}")
def redirect_url(short_code: str):
    if short_code in url_storage:
        original_url = url_storage[short_code]

        return RedirectResponse(
            status_code=302,
            url=original_url
        )
    else:
        return JSONResponse(
            status_code=404,
            content={"message": "Short URL not found"}
        )

@app.post("/api/v1/urls")
def create_short_url(request: URLRequest):
    short_code = generate_short_code()

    url_storage[short_code] = str(request.original_url)

    return JSONResponse(
        status_code=201,
        content={
            "original_url": str(request.original_url),
            "short_code": short_code
        }
    )

url_storage = {}
