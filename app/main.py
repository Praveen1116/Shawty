from fastapi import FastAPI
from pydantic import BaseModel, HttpUrl
from fastapi.responses import JSONResponse
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
    return JSONResponse(
        status_code=200,
        content={"short_code": short_code}
    )

@app.post("/api/v1/urls")
def create_short_url(request: URLRequest):
    short_code = generate_short_code()
    return JSONResponse(
        status_code=201,
        content={
            "original_url": str(request.original_url),
            "short_code": short_code
        }
    )