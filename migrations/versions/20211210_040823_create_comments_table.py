"""create comments table

Revision ID: e70f2a8fd428
Revises: 5d2cc406a7ee
Create Date: 2021-12-10 04:08:23.757796

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e70f2a8fd428'
down_revision = '5d2cc406a7ee'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('comments',
    sa.Column('id', sa.Integer, primary_key=True),
    sa.Column('obit_id', sa.Integer, sa.ForeignKey('obits.id'), nullable=False),
    sa.Column('author', sa.String(255), nullable=False),
    sa.Column('comment', sa.String(255), nullable=False),
    sa.Column('created_at', sa.DateTime, nullable=False),
    sa.Column('updated_at', sa.DateTime, nullable=False),
    )

def downgrade():
    op.drop_table('comments')