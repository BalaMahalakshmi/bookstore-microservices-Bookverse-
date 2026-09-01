import os

import httpx
from fastapi import HTTPException

BOOK_SERVICE_URL = os.getenv(
    "BOOK_SERVICE_URL",
    "http://localhost:8001",
)

INTERNAL_SERVICE_TOKEN = os.getenv("INTERNAL_SERVICE_TOKEN")


async def reserve_books(items: list[dict]):
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:

            response = await client.post(
                f"{BOOK_SERVICE_URL}/internal/books/reserve",
                headers={
                    "X-Internal-Service-Token": INTERNAL_SERVICE_TOKEN,
                    "Content-Type": "application/json",
                },
                json={
                    "items": items,
                },
            )

    except httpx.RequestError:
        raise HTTPException(
            status_code=503,
            detail="Book service unavailable",
        )

    if response.status_code != 200:
        try:
            detail = response.json().get(
                "detail",
                "Unable to reserve books",
            )
        except Exception:
            detail = "Unable to reserve books"

        raise HTTPException(
            status_code=response.status_code,
            detail=detail,
        )

    return response.json()


async def release_books(items: list[dict]):
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:

            response = await client.post(
                f"{BOOK_SERVICE_URL}/internal/books/release",
                headers={
                    "X-Internal-Service-Token": INTERNAL_SERVICE_TOKEN,
                    "Content-Type": "application/json",
                },
                json={
                    "items": items,
                },
            )

    except httpx.RequestError:
        raise HTTPException(
            status_code=503,
            detail="Book service unavailable",
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=503,
            detail="Unable to release books",
        )

    return response.json()
