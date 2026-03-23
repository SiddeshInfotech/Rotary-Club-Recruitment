from fastapi import Depends, Header, HTTPException, status

from core.config import settings


async def verify_service_api_key(x_service_api_key: str | None = Header(default=None)):
    # If no key configured, skip verification to keep local development friction low.
    if not settings.service_api_key:
        return

    if not x_service_api_key or x_service_api_key != settings.service_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "UNAUTHORIZED", "message": "Invalid or missing service API key"},
        )


ServiceAuthDependency = Depends(verify_service_api_key)
