"""add_text_library_table

Revision ID: add_text_library
Revises: 172fcb1e2362
Create Date: 2025-11-06 02:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'add_text_library'
down_revision: Union[str, None] = '172fcb1e2362'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    traildifficulty_enum = postgresql.ENUM('beginner', 'intermediate', 'advanced', name='traildifficulty', create_type=False)
    traildifficulty_enum.create(op.get_bind(), checkfirst=True)
    
    op.create_table(
        'text_library',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('subtitle', sa.String(length=255), nullable=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('difficulty', traildifficulty_enum, nullable=False),
        sa.Column('age_range_min', sa.Integer(), nullable=True),
        sa.Column('age_range_max', sa.Integer(), nullable=True),
        sa.Column('letters_focus', postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column('tags', postgresql.JSONB(), nullable=True),
        sa.Column('word_count', sa.Integer(), nullable=True),
        sa.Column('is_public', sa.Boolean(), nullable=True, server_default='true'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ondelete='SET NULL'),
    )
    
    op.create_index(
        'idx_text_library_title_gin',
        'text_library',
        ['title'],
        postgresql_using='gin',
        postgresql_ops={'title': 'gin_trgm_ops'}
    )


def downgrade() -> None:
    op.drop_index('idx_text_library_title_gin', table_name='text_library')
    op.drop_table('text_library')

