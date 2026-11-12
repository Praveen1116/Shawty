"""create urls table

Revision ID: 55109ab07760
Revises: 
Create Date: 2026-11-12 00:16:21.669585

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '55109ab07760'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'urls',
        sa.Column('short_code', sa.String(length=6), nullable=False),
        sa.Column('original_url', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.CheckConstraint("short_code ~ '^[A-Za-z0-9]{6}$'", name='valid_short_code'),
        sa.PrimaryKeyConstraint('short_code')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('urls')
