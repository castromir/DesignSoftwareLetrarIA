from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.repositories.text_library_repository import TextLibraryRepository
from app.schemas.text_library import (
    TextLibraryCreate,
    TextLibraryUpdate,
    TextLibraryResponse,
    TextLibraryListResponse,
)
from app.models.trail import TrailDifficulty
from typing import Optional, List
import uuid


class TextLibraryService:
    def __init__(self, session: AsyncSession):
        self.text_library_repository = TextLibraryRepository(session)

    async def create_text(
        self, data: TextLibraryCreate, created_by_id: uuid.UUID
    ) -> TextLibraryResponse:
        text_data = {
            "title": data.title,
            "subtitle": data.subtitle,
            "content": data.content,
            "difficulty": data.difficulty,
            "age_range_min": data.age_range_min,
            "age_range_max": data.age_range_max,
            "letters_focus": data.letters_focus,
            "tags": data.tags,
            "word_count": data.word_count,
            "is_public": data.is_public,
            "created_by": created_by_id,
        }

        text = await self.text_library_repository.create(text_data)

        return TextLibraryResponse(
            id=str(text.id),
            title=text.title,
            subtitle=text.subtitle,
            content=text.content,
            difficulty=text.difficulty,
            age_range_min=text.age_range_min,
            age_range_max=text.age_range_max,
            letters_focus=text.letters_focus,
            tags=text.tags,
            word_count=text.word_count,
            is_public=text.is_public,
            created_by=str(text.created_by) if text.created_by else None,
            created_at=text.created_at,
            updated_by=str(text.updated_by) if text.updated_by else None,
            updated_at=text.updated_at,
        )

    async def get_all_texts(
        self,
        created_by: Optional[uuid.UUID] = None,
        difficulty: Optional[TrailDifficulty] = None,
        is_public: Optional[bool] = None,
        age_range_min: Optional[int] = None,
        age_range_max: Optional[int] = None,
        letters_focus: Optional[List[str]] = None,
    ) -> TextLibraryListResponse:
        texts = await self.text_library_repository.get_all(
            created_by=created_by,
            difficulty=difficulty,
            is_public=is_public,
            age_range_min=age_range_min,
            age_range_max=age_range_max,
            letters_focus=letters_focus,
        )
        total = await self.text_library_repository.count_all(
            created_by=created_by,
            difficulty=difficulty,
            is_public=is_public,
        )

        return TextLibraryListResponse(
            total=total,
            texts=[
                TextLibraryResponse(
                    id=str(t.id),
                    title=t.title,
                    subtitle=t.subtitle,
                    content=t.content,
                    difficulty=t.difficulty,
                    age_range_min=t.age_range_min,
                    age_range_max=t.age_range_max,
                    letters_focus=t.letters_focus,
                    tags=t.tags,
                    word_count=t.word_count,
                    is_public=t.is_public,
                    created_by=str(t.created_by) if t.created_by else None,
                    created_at=t.created_at,
                    updated_by=str(t.updated_by) if t.updated_by else None,
                    updated_at=t.updated_at,
                )
                for t in texts
            ],
        )

    async def get_text_by_id(
        self, text_id: uuid.UUID | str, user_id: Optional[uuid.UUID] = None
    ) -> TextLibraryResponse:
        if isinstance(text_id, str):
            text_id = uuid.UUID(text_id)
        text = await self.text_library_repository.get_by_id(text_id)
        if not text:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Texto não encontrado",
            )

        if not text.is_public and (not user_id or text.created_by != user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Você não tem permissão para acessar este texto",
            )

        return TextLibraryResponse(
            id=str(text.id),
            title=text.title,
            subtitle=text.subtitle,
            content=text.content,
            difficulty=text.difficulty,
            age_range_min=text.age_range_min,
            age_range_max=text.age_range_max,
            letters_focus=text.letters_focus,
            tags=text.tags,
            word_count=text.word_count,
            is_public=text.is_public,
            created_by=str(text.created_by) if text.created_by else None,
            created_at=text.created_at,
            updated_by=str(text.updated_by) if text.updated_by else None,
            updated_at=text.updated_at,
        )

    async def update_text(
        self,
        text_id: uuid.UUID,
        data: TextLibraryUpdate,
        updated_by_id: uuid.UUID,
    ) -> TextLibraryResponse:
        existing_text = await self.text_library_repository.get_by_id(text_id)
        if not existing_text:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Texto não encontrado",
            )

        if existing_text.created_by != updated_by_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Você não tem permissão para editar este texto",
            )

        update_data = data.model_dump(exclude_unset=True)
        update_data["updated_by"] = updated_by_id

        text = await self.text_library_repository.update(text_id, update_data)
        if not text:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Texto não encontrado",
            )

        return TextLibraryResponse(
            id=str(text.id),
            title=text.title,
            subtitle=text.subtitle,
            content=text.content,
            difficulty=text.difficulty,
            age_range_min=text.age_range_min,
            age_range_max=text.age_range_max,
            letters_focus=text.letters_focus,
            tags=text.tags,
            word_count=text.word_count,
            is_public=text.is_public,
            created_by=str(text.created_by) if text.created_by else None,
            created_at=text.created_at,
            updated_by=str(text.updated_by) if text.updated_by else None,
            updated_at=text.updated_at,
        )

    async def delete_text(self, text_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        existing_text = await self.text_library_repository.get_by_id(text_id)
        if not existing_text:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Texto não encontrado",
            )

        if existing_text.created_by != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Você não tem permissão para excluir este texto",
            )

        deleted = await self.text_library_repository.delete(text_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Texto não encontrado",
            )
        return True

