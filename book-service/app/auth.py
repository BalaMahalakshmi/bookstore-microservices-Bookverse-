import os

from dotenv import load_dotenv

from fastapi import (
    Depends,
    HTTPException,
    Header,
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials,
)

from jose import JWTError, jwt

load_dotenv()


SECRET_KEY = os.getenv("SECRET_KEY")

INTERNAL_SERVICE_TOKEN = os.getenv("INTERNAL_SERVICE_TOKEN")


if not INTERNAL_SERVICE_TOKEN:
    raise RuntimeError("INTERNAL_SERVICE_TOKEN environment variable is required")


if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is required")


ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256",
)


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        username: str = payload.get("sub")
        role: str = payload.get("role", "user")

        if username is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token",
            )

        return {
            "username": username,
            "role": role,
        }

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )


async def require_admin(
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return current_user


async def verify_internal_service(
    x_internal_service_token: str | None = Header(default=None),
):
    if not INTERNAL_SERVICE_TOKEN:
        raise HTTPException(
            status_code=500,
            detail="Internal service token is not configured",
        )

    if x_internal_service_token != INTERNAL_SERVICE_TOKEN:
        raise HTTPException(
            status_code=403,
            detail="Invalid internal service token",
        )

    return True
