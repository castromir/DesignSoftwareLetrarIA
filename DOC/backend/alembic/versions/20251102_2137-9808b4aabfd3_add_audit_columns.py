"""Add audit columns

Revision ID: 9808b4aabfd3
Revises: 07d58ae723be
Create Date: 2025-11-02 21:37:17.674750

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9808b4aabfd3'
down_revision: Union[str, None] = '07d58ae723be'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

