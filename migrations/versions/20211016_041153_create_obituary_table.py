"""create obituary table

Revision ID: eb6879a62eaa
Revises: 36ac5976637a
Create Date: 2021-10-16 04:11:53.961744

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'eb6879a62eaa'
down_revision = '36ac5976637a'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('obits',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),

        # Obituary User Provided Data
        sa.Column('first_name', sa.String(length=50), nullable=False),
        sa.Column('middle_name', sa.String(length=50), nullable=False),
        sa.Column('last_name', sa.String(length=50), nullable=False),
        sa.Column('nick_name', sa.String(length=50), nullable=True),
        sa.Column('short_message', sa.String(length=100), nullable=True),
        sa.Column('long_message', sa.Text(), nullable=True),
        sa.Column('obit_image', sa.String(), nullable=False),
        sa.Column('birth_date', sa.Date(), nullable=False),
        sa.Column('death_date', sa.Date(), nullable=False),

        #Obituary generated Data
        sa.Column('end_date', sa.DateTime(), nullable=False),
        sa.Column('start_date', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        
        #Finance Related
        sa.Column('balance', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('funding_goal', sa.Numeric(precision=10, scale=2), nullable=False),

        #Obituary AddOns
        sa.Column('onlineService', sa.Boolean(), nullable=False, default=False),
        sa.Column('memorialStartDate', sa.DateTime(), nullable=True),
        sa.Column('memorialEndDate', sa.DateTime(), nullable=True),
        sa.Column('financialAssistance', sa.Boolean(), nullable=False, default=False),
        sa.Column('bankClientName', sa.String(length=50), nullable=True),
        sa.Column('bankName', sa.String(length=50), nullable=True),
        sa.Column('bankAccountNumber', sa.String(length=50), nullable=True),

        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
        )


def downgrade():
    op.drop_table('obits')
