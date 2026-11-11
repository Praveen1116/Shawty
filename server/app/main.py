from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, HttpUrl
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, OperationalError

from app.short_code import generate_short_code
from app.database import get_db_session
from app.models import URL

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
async def redirect_url(short_code: str, session: AsyncSession = Depends(get_db_session)):
    try:
        stmt = select(URL).where(URL.short_code == short_code)
        result = await session.execute(stmt)
        url_entry = result.scalar_one_or_none()

    except OperationalError:
        raise HTTPException(status_code=503, detail="Database temporarily unavailable")


    if url_entry:
        return RedirectResponse(status_code=302, url=url_entry.original_url)

    return JSONResponse(
        status_code=404,
        content={"message": "Short URL not found"}
    )

@app.post("/api/v1/urls")
async def create_short_url(request: URLRequest, session: AsyncSession = Depends(get_db_session)):
    for attempt in range(3):
        try:
            short_code = generate_short_code()
            new_url = URL(short_code=short_code,
                          original_url = str(request.original_url)
                          )

            session.add(new_url)

            await session.commit()
            break

        except IntegrityError:
            await session.rollback()

            if attempt == 2:
                raise

        except OperationalError:
            await session.rollback()
            raise HTTPException(
                status_code=503,
                detail="Database temporarily unavailable"
            )

    return JSONResponse(
        status_code=201,
        content={
            "original_url": str(request.original_url),
            "short_code": short_code
        }
    )
