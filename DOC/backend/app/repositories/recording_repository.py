from sqlalchemy import select, update, delete, func, and_, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.recording import Recording, RecordingStatus
from typing import Optional, List
import uuid


class RecordingRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        student_id: uuid.UUID,
        story_id: uuid.UUID,
        duration_seconds: float,
        audio_file_path: Optional[str] = None,
        audio_url: Optional[str] = None,
        transcription: Optional[str] = None,
        status: RecordingStatus = RecordingStatus.completed,
        created_by: Optional[uuid.UUID] = None,
    ) -> Recording:
        recording = Recording(
            student_id=student_id,
            story_id=story_id,
            duration_seconds=duration_seconds,
            audio_file_path=audio_file_path,
            audio_url=audio_url,
            transcription=transcription,
            status=status,
            created_by=created_by,
        )
        self.session.add(recording)
        await self.session.flush()
        await self.session.refresh(recording)
        return recording

    async def get_by_id(self, recording_id: uuid.UUID) -> Optional[Recording]:
        result = await self.session.execute(
            select(Recording)
            .options(
                selectinload(Recording.analysis),
                selectinload(Recording.story),
            )
            .where(Recording.id == recording_id)
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        student_id: Optional[uuid.UUID] = None,
        story_id: Optional[uuid.UUID] = None,
        status: Optional[RecordingStatus] = None,
    ) -> List[Recording]:
        query = select(Recording).options(
            selectinload(Recording.analysis),
            selectinload(Recording.story),
        )
        
        conditions = []
        
        if student_id:
            conditions.append(Recording.student_id == student_id)
        
        if story_id:
            conditions.append(Recording.story_id == story_id)
        
        if status:
            conditions.append(Recording.status == status)
        
        if conditions:
            query = query.where(and_(*conditions))
        
        query = query.order_by(Recording.recorded_at.desc())
        
        result = await self.session.execute(query)
        return result.scalars().all()

    async def update(
        self,
        recording_id: uuid.UUID,
        transcription: Optional[str] = None,
        status: Optional[RecordingStatus] = None,
        audio_file_path: Optional[str] = None,
        audio_url: Optional[str] = None,
        updated_by: Optional[uuid.UUID] = None,
    ) -> Optional[Recording]:
        update_data = {}
        
        if transcription is not None:
            update_data["transcription"] = transcription
        if status is not None:
            update_data["status"] = status
        if audio_file_path is not None:
            update_data["audio_file_path"] = audio_file_path
        if audio_url is not None:
            update_data["audio_url"] = audio_url
        if updated_by is not None:
            update_data["updated_by"] = updated_by
        
        if not update_data:
            return await self.get_by_id(recording_id)
        
        await self.session.execute(
            update(Recording)
            .where(Recording.id == recording_id)
            .values(**update_data)
        )
        await self.session.flush()
        return await self.get_by_id(recording_id)

    async def delete(self, recording_id: uuid.UUID) -> bool:
        result = await self.session.execute(
            delete(Recording).where(Recording.id == recording_id)
        )
        return result.rowcount > 0

