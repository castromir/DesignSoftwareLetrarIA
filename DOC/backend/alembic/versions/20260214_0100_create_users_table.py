"""create_users_table

Revision ID: 20260214_0100_create_users
Revises: 172fcb1e2362
Create Date: 2026-02-14 01:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '20260214_0100_create_users'
down_revision: Union[str, None] = '172fcb1e2362'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    userrole_enum = postgresql.ENUM('admin', 'professional', name='userrole', create_type=False)
    userrole_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('role', userrole_enum, nullable=False),
        sa.Column('function', sa.String(length=255), nullable=True),
        sa.Column('username', sa.String(length=255), nullable=True, unique=True),
        sa.Column('google_id', sa.String(length=255), nullable=True, unique=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=True),
    )

    op.create_index('idx_users_email', 'users', ['email'])
    op.create_index('idx_users_role', 'users', ['role'])
    op.create_index('idx_users_username', 'users', ['username'])


def downgrade() -> None:
    op.drop_index('idx_users_username', table_name='users')
    op.drop_index('idx_users_role', table_name='users')
    op.drop_index('idx_users_email', table_name='users')
    op.drop_table('users')
    userrole_enum = postgresql.ENUM('admin', 'professional', name='userrole')
    userrole_enum.drop(op.get_bind(), checkfirst=True)

