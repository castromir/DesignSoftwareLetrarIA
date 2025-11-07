from datetime import timedelta

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.repositories.user_repository import UserRepository
from app.schemas.auth import TokenData
from app.utils.jwt import create_access_token
from app.utils.password import verify_password


class AuthService:
    def __init__(self, session: AsyncSession):
        self.user_repository = UserRepository(session)

    async def authenticate_user(self, email: str, password: str) -> dict:
        user = await self.user_repository.get_by_email(email)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Block login when the user account is inactive.
        # The `active` attribute is expected to exist on the User model.
        # If the backend uses a different field name, adapt accordingly.
        if getattr(user, "active", None) is not None and not bool(user.active):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Conta inativa. Entre em contato com o administrador.",
            )

        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email,
                "role": user.role.value,
                # include active flag in token payload to allow downstream checks
                "active": bool(getattr(user, "active", True)),
            },
            expires_delta=access_token_expires,
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "name": user.name,
                "role": user.role.value,
                "active": bool(getattr(user, "active", True)),
            },
        }
