"""empty message

Revision ID: 564c2288a2fc
Revises: 7b8686fbf175
Create Date: 2020-11-17 22:57:58.524385

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '564c2288a2fc'
down_revision = '7b8686fbf175'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('todo_list',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )

    """
    I left the foreign key to be nullable 
    to be able to build as for the first time it will
    have null for the exist records.
    """

    op.add_column('todos', sa.Column('list_fk', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'todos', 'todo_list', ['list_fk'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'todos', type_='foreignkey')
    op.drop_column('todos', 'list_fk')
    op.drop_table('todo_list')
    # ### end Alembic commands ###
