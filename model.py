from flask import Flask , render_template, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import  Migrate
import sys

# data base info
IP = "127.0.0.1";
PORT = "5432";
DB_NAME  = 'todoapp';
DB_URI = 'postgresql://postgres:0173706505aA@' \
         + IP + ":" + PORT + "/" + DB_NAME;

# build objects
app = Flask(__name__);
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URI;
db =  SQLAlchemy(app, session_options={'expire_on_commit': True});

# migrations
migrate = Migrate(app, db);

class todos(db.Model):
    __tablename__ = 'todos';
    id = db.Column(db.Integer, primary_key = True);
    desc = db.Column(db.String(), nullable = False);
    completed = db.Column(db.Boolean, nullable = False, default = False);

    def __repr__(self):
        return "id : {} --- desc : {} ".format(self.id, self.desc);

#db.create_all() # replaced with migrations

# C in CRUD
def save_toDo_item(desc):

    error_happens = False;
    retObj = None;
    try:
        toDoItem = todos(desc = desc);
        db.session.add(toDoItem);
        db.session.commit();
        """
        why Iam Able to reference the object here without the 
        expire problem, but when I return it I face this expire problem !!!?????
        """
        retObj = todos(id = toDoItem.id, desc = toDoItem.desc)

    except:
        error_happens = True;
        db.session.rollback();
        print(sys.exc_info());  # what is this
    finally:
        db.session.close()
    if error_happens:
        abort(500);
    return retObj;


# R in CRUD
def get_toDO_items():
    todoItems = db.session.query(todos).all();
    return todoItems;


# U in CRUD
def update_toDO_item(item):
    error_happens = False;
    try:
        toDo_Item = db.session.query(todos).get(item['id']);
        toDo_Item.desc = item['new_description'];

        """
            what is there is no user with this id 
            in the data base !!????
        """

        db.session.commit();
    except:
        db.session.rollback();
        error_happens = True;
    finally:
        db.session.close();
    if error_happens:
        abort(500);
    return True;



# the D in CRUD
def delete_toDO_item(item):
    error_happens = False;
    try:
        toDo_item = db.session.query(todos).filter(todos.id == item['id']).delete();
        db.session.commit();
    except:
        db.session.rollback();
        error_happens = True;
    finally:
        db.session.close();
    if error_happens:
        abort(500);
    return True;