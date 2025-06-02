"""add dates to reading assignment

Revision ID: add_dates_to_reading_assignment
Revises: 
Create Date: 2024-03-21
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic
revision = 'add_dates_to_reading_assignment'
down_revision = None  # Mettez None si c'est votre première migration
branch_labels = None
depends_on = None

def upgrade():
    # Ajouter les colonnes start_date et end_date
    op.add_column('reading_assignment', sa.Column('start_date', sa.DateTime(), nullable=True))
    op.add_column('reading_assignment', sa.Column('end_date', sa.DateTime(), nullable=True))

def downgrade():
    # Supprimer les colonnes si nécessaire
    op.drop_column('reading_assignment', 'start_date')
    op.drop_column('reading_assignment', 'end_date')
