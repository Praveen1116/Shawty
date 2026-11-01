from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from fastapi.responses import JSONResponse, RedirectResponse
from app.short_code import generate_short_code
from app.database import get_db_connection

import psycopg

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
async def redirect_url(short_code: str):
    connection = None

    try:
        connection = await get_db_connection()

        async with connection.cursor() as cursor:
            await cursor.execute(
                """
                SELECT original_url
                FROM urls
                WHERE short_code = %s
                """,
                (short_code,)
            )

            result = await cursor.fetchone()

    except psycopg.OperationalError:
        raise HTTPException(
            status_code=503,
            detail="Database temporarily unavailable"
        )

    finally:
        if connection is not None:
            await connection.close()

    if result:
        original_url = result[0]

        return RedirectResponse(
            status_code=302,
            url = original_url
        )

    return JSONResponse(
        status_code=404,
        content={"message": "Short URL not found"}
    )

@app.post("/api/v1/urls")
async def create_short_url(request: URLRequest):
    for attempt in range(3):
        connection = None

        try:
            short_code = generate_short_code()
            connection = await get_db_connection()

            async with connection.cursor() as cursor:
                await cursor.execute(
                    """
                    INSERT INTO urls (short_code, original_url)
                    VALUES(%s, %s)
                    """,
                    (short_code, str(request.original_url))
                )

            await connection.commit()
            break

        except psycopg.errors.UniqueViolation:
            if attempt == 2:
                raise

        except psycopg.OperationalError:
            raise HTTPException(
                status_code=503,
                detail="Database temporarily unavailable"
            )

        finally:
            if connection is not None:
                await connection.close()

    return JSONResponse(
        status_code=201,
        content={
            "original_url": str(request.original_url),
            "short_code": short_code
        }
    )
