"""initial schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-18 17:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # owners
    op.create_table(
        "owners",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("contact", sa.String(100), nullable=False),
        sa.Column("aadhar", sa.String(20), nullable=True),
        sa.Column("address", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )

    # pets
    op.create_table(
        "pets",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("owner_id", sa.String(36), sa.ForeignKey("owners.id", ondelete="CASCADE"), nullable=False),
        sa.Column("species", sa.String(50), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("breed", sa.String(255), nullable=False),
        sa.Column("dob", sa.Date(), nullable=False),
        sa.Column("place", sa.String(255), nullable=False),
        sa.Column("height", sa.Float(), nullable=False),
        sa.Column("weight", sa.Float(), nullable=False),
        sa.Column("gender", sa.String(20), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_pets_owner_id", "pets", ["owner_id"])
    op.create_index("ix_pets_species", "pets", ["species"])
    op.create_index("ix_pets_name", "pets", ["name"])

    # health_details
    op.create_table(
        "health_details",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("pet_id", sa.String(36), sa.ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("grooming", sa.Text(), nullable=True),
        sa.Column("routine", sa.String(100), nullable=True),
        sa.Column("last_visit", sa.Date(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )

    # vaccines
    op.create_table(
        "vaccines",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("pet_id", sa.String(36), sa.ForeignKey("pets.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_vaccines_pet_id", "vaccines", ["pet_id"])

    # allergies
    op.create_table(
        "allergies",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("pet_id", sa.String(36), sa.ForeignKey("pets.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_allergies_pet_id", "allergies", ["pet_id"])

    # diseases
    op.create_table(
        "diseases",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("pet_id", sa.String(36), sa.ForeignKey("pets.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_diseases_pet_id", "diseases", ["pet_id"])

    # medications
    op.create_table(
        "medications",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("pet_id", sa.String(36), sa.ForeignKey("pets.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_medications_pet_id", "medications", ["pet_id"])

    # food
    op.create_table(
        "food",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("pet_id", sa.String(36), sa.ForeignKey("pets.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_food_pet_id", "food", ["pet_id"])

    # pet_categories
    op.create_table(
        "pet_categories",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("pet_id", sa.String(36), sa.ForeignKey("pets.id", ondelete="CASCADE"), nullable=False),
        sa.Column("category_type", sa.String(50), nullable=False),
        sa.Column("category_value", sa.String(100), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_pet_categories_pet_id", "pet_categories", ["pet_id"])
    op.create_index("ix_pet_categories_type_val", "pet_categories", ["category_type", "category_value"])

    # documents
    op.create_table(
        "documents",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("pet_id", sa.String(36), sa.ForeignKey("pets.id", ondelete="CASCADE"), nullable=False),
        sa.Column("document_type", sa.String(100), nullable=False),
        sa.Column("original_filename", sa.String(500), nullable=False),
        sa.Column("stored_filename", sa.String(500), nullable=False),
        sa.Column("file_path", sa.String(1000), nullable=False),
        sa.Column("mime_type", sa.String(100), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("uploaded_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_documents_pet_id", "documents", ["pet_id"])


def downgrade() -> None:
    op.drop_table("documents")
    op.drop_table("pet_categories")
    op.drop_table("food")
    op.drop_table("medications")
    op.drop_table("diseases")
    op.drop_table("allergies")
    op.drop_table("vaccines")
    op.drop_table("health_details")
    op.drop_table("pets")
    op.drop_table("owners")
