"""create_pg_trgm_extension

Revision ID: 20260214_0200_create_pg_trgm_extension
Revises: 20260214_0100_create_users
Create Date: 2026-02-14 02:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '20260214_0200_pg_trgm'
down_revision: Union[str, None] = '20260214_0100_create_users'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;")


def downgrade() -> None:
    op.execute("DROP EXTENSION IF EXISTS pg_trgm;")

