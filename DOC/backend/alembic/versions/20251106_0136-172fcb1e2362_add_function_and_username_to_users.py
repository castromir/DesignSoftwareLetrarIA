"""add_function_and_username_to_users

Revision ID: 172fcb1e2362
Revises: 9808b4aabfd3
Create Date: 2025-11-06 01:36:29.454121

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '172fcb1e2362'
down_revision: Union[str, None] = '9808b4aabfd3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

