"""add_recording_id_to_ai_insights

Revision ID: add_recording_id_insights
Revises: add_text_library
Create Date: 2026-03-17 00:01:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'add_recording_id_insights'
down_revision: Union[str, None] = 'add_text_library'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'ai_insights',
        sa.Column(
            'recording_id',
            postgresql.UUID(as_uuid=True),
            nullable=True,
        )
    )
    op.create_foreign_key(
        'fk_ai_insights_recording_id',
        'ai_insights',
        'recordings',
        ['recording_id'],
        ['id'],
        ondelete='SET NULL',
    )
    op.create_index(
        'ix_ai_insights_recording_id',
        'ai_insights',
        ['recording_id'],
    )


def downgrade() -> None:
    op.drop_index('ix_ai_insights_recording_id', table_name='ai_insights')
    op.drop_constraint('fk_ai_insights_recording_id', 'ai_insights', type_='foreignkey')
    op.drop_column('ai_insights', 'recording_id')
