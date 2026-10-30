from fastapi import FastAPI
from fastapi.responses import JSONResponse
app = FastAPI()

@app.get("/",)
def home():
    return JSONResponse(
        status_code=201,
        content={"message": "Shawty running fine"}
    )

@app.get("/healthcheck")
def health():
    return JSONResponse(
        status_code=201,
        content={"message": "Health is fine!"}
    )