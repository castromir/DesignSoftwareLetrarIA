from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.repositories.trail_repository import TrailRepository, TrailStoryRepository
from app.schemas.trail import (
    TrailCreate,
    TrailUpdate,
    TrailResponse,
    TrailListResponse,
    TrailStoryCreate,
    TrailStoryUpdate,
    TrailStoryResponse,
)
from app.models.trail import TrailDifficulty
from typing import Optional
import uuid


class TrailService:
    def __init__(self, session: AsyncSession):
        self.trail_repository = TrailRepository(session)
        self.story_repository = TrailStoryRepository(session)

    async def create_trail(
        self, data: TrailCreate, created_by_id: uuid.UUID
    ) -> TrailResponse:
        trail_data = {
            "title": data.title,
            "description": data.description,
            "difficulty": data.difficulty,
            "is_default": data.is_default,
            "age_range_min": data.age_range_min,
            "age_range_max": data.age_range_max,
            "created_by": created_by_id,
        }

        trail = await self.trail_repository.create(trail_data)

        stories = []
        if data.stories:
            stories_data = [
                {
                    "trail_id": trail.id,
                    "title": story.title,
                    "subtitle": story.subtitle,
                    "content": story.content,
                    "letters_focus": story.letters_focus,
                    "phonemes_focus": story.phonemes_focus,
                    "order_position": story.order_position,
                    "difficulty": story.difficulty,
                    "word_count": story.word_count,
                    "estimated_time": story.estimated_time,
                    "created_by": created_by_id,
                }
                for story in data.stories
            ]
            created_stories = await self.story_repository.create_batch(stories_data)
            stories = [
                TrailStoryResponse(
                    id=str(s.id),
                    trail_id=str(s.trail_id),
                    title=s.title,
                    subtitle=s.subtitle,
                    content=s.content,
                    letters_focus=s.letters_focus,
                    phonemes_focus=s.phonemes_focus,
                    order_position=s.order_position,
                    difficulty=s.difficulty,
                    word_count=s.word_count,
                    estimated_time=s.estimated_time,
                    created_by=str(s.created_by) if s.created_by else None,
                    created_at=s.created_at,
                    updated_by=str(s.updated_by) if s.updated_by else None,
                    updated_at=s.updated_at,
                )
                for s in created_stories
            ]

        trail_stories = await self.story_repository.get_all_by_trail(trail.id)
        all_stories = [
            TrailStoryResponse(
                id=str(s.id),
                trail_id=str(s.trail_id),
                title=s.title,
                subtitle=s.subtitle,
                content=s.content,
                letters_focus=s.letters_focus,
                phonemes_focus=s.phonemes_focus,
                order_position=s.order_position,
                difficulty=s.difficulty,
                word_count=s.word_count,
                estimated_time=s.estimated_time,
                created_by=str(s.created_by) if s.created_by else None,
                created_at=s.created_at,
                updated_by=str(s.updated_by) if s.updated_by else None,
                updated_at=s.updated_at,
            )
            for s in trail_stories
        ]

        return TrailResponse(
            id=str(trail.id),
            title=trail.title,
            description=trail.description,
            difficulty=trail.difficulty,
            is_default=trail.is_default,
            age_range_min=trail.age_range_min,
            age_range_max=trail.age_range_max,
            created_by=str(trail.created_by) if trail.created_by else None,
            created_at=trail.created_at,
            updated_by=str(trail.updated_by) if trail.updated_by else None,
            updated_at=trail.updated_at,
            stories=all_stories,
        )

    async def get_all_trails(
        self,
        created_by: Optional[uuid.UUID] = None,
        difficulty: Optional[TrailDifficulty] = None,
        is_default: Optional[bool] = None,
        age_range_min: Optional[int] = None,
        age_range_max: Optional[int] = None,
    ) -> TrailListResponse:
        # First try with age filters
        trails = await self.trail_repository.get_all(
            created_by=created_by,
            difficulty=difficulty,
            is_default=is_default,
            age_range_min=age_range_min,
            age_range_max=age_range_max,
        )
        
        # If no trails found with age filter and age was specified, try without age filter
        if len(trails) == 0 and (age_range_min is not None or age_range_max is not None) and is_default:
            trails = await self.trail_repository.get_all(
                created_by=created_by,
                difficulty=difficulty,
                is_default=is_default,
                age_range_min=None,
                age_range_max=None,
            )
        
        total = await self.trail_repository.count_all(
            created_by=created_by,
            difficulty=difficulty,
            is_default=is_default,
        )

        trails_response = []
        for trail in trails:
            trail_stories = await self.story_repository.get_all_by_trail(trail.id)
            stories = [
                TrailStoryResponse(
                    id=str(s.id),
                    trail_id=str(s.trail_id),
                    title=s.title,
                    subtitle=s.subtitle,
                    content=s.content,
                    letters_focus=s.letters_focus,
                    phonemes_focus=s.phonemes_focus,
                    order_position=s.order_position,
                    difficulty=s.difficulty,
                    word_count=s.word_count,
                    estimated_time=s.estimated_time,
                    created_by=str(s.created_by) if s.created_by else None,
                    created_at=s.created_at,
                    updated_by=str(s.updated_by) if s.updated_by else None,
                    updated_at=s.updated_at,
                )
                for s in trail_stories
            ]
            trails_response.append(
                TrailResponse(
                    id=str(trail.id),
                    title=trail.title,
                    description=trail.description,
                    difficulty=trail.difficulty,
                    is_default=trail.is_default,
                    age_range_min=trail.age_range_min,
                    age_range_max=trail.age_range_max,
                    created_by=str(trail.created_by) if trail.created_by else None,
                    created_at=trail.created_at,
                    updated_by=str(trail.updated_by) if trail.updated_by else None,
                    updated_at=trail.updated_at,
                    stories=stories,
                )
            )

        return TrailListResponse(total=total, trails=trails_response)

    async def get_trail_by_id(
        self, trail_id: uuid.UUID | str
    ) -> TrailResponse:
        if isinstance(trail_id, str):
            trail_id = uuid.UUID(trail_id)
        trail = await self.trail_repository.get_by_id(trail_id)
        if not trail:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trilha não encontrada",
            )

        trail_stories = await self.story_repository.get_all_by_trail(trail.id)
        stories = [
            TrailStoryResponse(
                id=str(s.id),
                trail_id=str(s.trail_id),
                title=s.title,
                subtitle=s.subtitle,
                content=s.content,
                letters_focus=s.letters_focus,
                phonemes_focus=s.phonemes_focus,
                order_position=s.order_position,
                difficulty=s.difficulty,
                word_count=s.word_count,
                estimated_time=s.estimated_time,
                created_by=str(s.created_by) if s.created_by else None,
                created_at=s.created_at,
                updated_by=str(s.updated_by) if s.updated_by else None,
                updated_at=s.updated_at,
            )
            for s in trail_stories
        ]

        return TrailResponse(
            id=str(trail.id),
            title=trail.title,
            description=trail.description,
            difficulty=trail.difficulty,
            is_default=trail.is_default,
            age_range_min=trail.age_range_min,
            age_range_max=trail.age_range_max,
            created_by=str(trail.created_by) if trail.created_by else None,
            created_at=trail.created_at,
            updated_by=str(trail.updated_by) if trail.updated_by else None,
            updated_at=trail.updated_at,
            stories=stories,
        )

    async def update_trail(
        self,
        trail_id: uuid.UUID,
        data: TrailUpdate,
        updated_by_id: uuid.UUID,
    ) -> TrailResponse:
        existing_trail = await self.trail_repository.get_by_id(trail_id)
        if not existing_trail:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trilha não encontrada",
            )

        if existing_trail.created_by != updated_by_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Você não tem permissão para editar esta trilha",
            )

        update_data = data.model_dump(exclude_unset=True)
        update_data["updated_by"] = updated_by_id

        trail = await self.trail_repository.update(trail_id, update_data)
        if not trail:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trilha não encontrada",
            )

        trail_stories = await self.story_repository.get_all_by_trail(trail.id)
        stories = [
            TrailStoryResponse(
                id=str(s.id),
                trail_id=str(s.trail_id),
                title=s.title,
                subtitle=s.subtitle,
                content=s.content,
                letters_focus=s.letters_focus,
                phonemes_focus=s.phonemes_focus,
                order_position=s.order_position,
                difficulty=s.difficulty,
                word_count=s.word_count,
                estimated_time=s.estimated_time,
                created_by=str(s.created_by) if s.created_by else None,
                created_at=s.created_at,
                updated_by=str(s.updated_by) if s.updated_by else None,
                updated_at=s.updated_at,
            )
            for s in trail_stories
        ]

        return TrailResponse(
            id=str(trail.id),
            title=trail.title,
            description=trail.description,
            difficulty=trail.difficulty,
            is_default=trail.is_default,
            age_range_min=trail.age_range_min,
            age_range_max=trail.age_range_max,
            created_by=str(trail.created_by) if trail.created_by else None,
            created_at=trail.created_at,
            updated_by=str(trail.updated_by) if trail.updated_by else None,
            updated_at=trail.updated_at,
            stories=stories,
        )

    async def delete_trail(self, trail_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        existing_trail = await self.trail_repository.get_by_id(trail_id)
        if not existing_trail:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trilha não encontrada",
            )

        if existing_trail.created_by != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Você não tem permissão para excluir esta trilha",
            )

        deleted = await self.trail_repository.delete(trail_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trilha não encontrada",
            )
        return True

    async def create_story(
        self, data: TrailStoryCreate, created_by_id: uuid.UUID
    ) -> TrailStoryResponse:
        story_data = {
            "trail_id": uuid.UUID(data.trail_id),
            "title": data.title,
            "subtitle": data.subtitle,
            "content": data.content,
            "letters_focus": data.letters_focus,
            "phonemes_focus": data.phonemes_focus,
            "order_position": data.order_position,
            "difficulty": data.difficulty,
            "word_count": data.word_count,
            "estimated_time": data.estimated_time,
            "created_by": created_by_id,
        }

        story = await self.story_repository.create(story_data)

        return TrailStoryResponse(
            id=str(story.id),
            trail_id=str(story.trail_id),
            title=story.title,
            subtitle=story.subtitle,
            content=story.content,
            letters_focus=story.letters_focus,
            phonemes_focus=story.phonemes_focus,
            order_position=story.order_position,
            difficulty=story.difficulty,
            word_count=story.word_count,
            estimated_time=story.estimated_time,
            created_by=str(story.created_by) if story.created_by else None,
            created_at=story.created_at,
            updated_by=str(story.updated_by) if story.updated_by else None,
            updated_at=story.updated_at,
        )

    async def update_story(
        self,
        story_id: uuid.UUID,
        data: TrailStoryUpdate,
        updated_by_id: uuid.UUID,
    ) -> TrailStoryResponse:
        existing_story = await self.story_repository.get_by_id(story_id)
        if not existing_story:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="História não encontrada",
            )

        if existing_story.created_by != updated_by_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Você não tem permissão para editar esta história",
            )

        update_data = data.model_dump(exclude_unset=True)
        if "trail_id" in update_data and update_data["trail_id"]:
            update_data["trail_id"] = uuid.UUID(update_data["trail_id"])
        update_data["updated_by"] = updated_by_id

        story = await self.story_repository.update(story_id, update_data)
        if not story:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="História não encontrada",
            )

        return TrailStoryResponse(
            id=str(story.id),
            trail_id=str(story.trail_id),
            title=story.title,
            subtitle=story.subtitle,
            content=story.content,
            letters_focus=story.letters_focus,
            phonemes_focus=story.phonemes_focus,
            order_position=story.order_position,
            difficulty=story.difficulty,
            word_count=story.word_count,
            estimated_time=story.estimated_time,
            created_by=str(story.created_by) if story.created_by else None,
            created_at=story.created_at,
            updated_by=str(story.updated_by) if story.updated_by else None,
            updated_at=story.updated_at,
        )

    async def delete_story(self, story_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        existing_story = await self.story_repository.get_by_id(story_id)
        if not existing_story:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="História não encontrada",
            )

        if existing_story.created_by != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Você não tem permissão para excluir esta história",
            )

        deleted = await self.story_repository.delete(story_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="História não encontrada",
            )
        return True

