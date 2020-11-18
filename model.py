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
    list_fk = db.Column(db.Integer, db.ForeignKey('todo_list.id'), nullable = False); # bu default is nullable = False as we specify the foreign key constraint.

    def __repr__(self):
        return "id : {} --- desc : {} ".format(self.id, self.desc);

class todo_list(db.Model):
    __tablename__ = 'todo_list';
    id = db.Column(db.Integer, primary_key = True);
    name = db.Column(db.String(), nullable = False);
    # parent table
    todos = db.relationship('todos', backref='list', lazy=True, cascade='all, delete-orphan');

    def __repr__(self):
        return "id {}, name {}".format(self.id, self.name);

#db.create_all() # replaced with migrations






# C in CRUD
def save_toDo_item(data):
    desc = data['description'];
    list_id = data['list_id'];

    error_happens = False;
    retObj = None;
    try:
        toDoItem = todos(desc = desc, list_fk=list_id);
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
def get_toDO_items(listId):
    error_happens = False;

    try:
        todoItems = db.session.query(todos).filter_by(list_fk=listId).order_by('id').all();
    except:
        error_happens = True; #abort(500); # does this block the close !!???
    finally:
        db.session.close();
    if error_happens:
        abort(500);
    return todoItems;

# U in CRUD
def update_toDO_item(item):
    error_happens = False;
    try:

        """
        id in the table is integer
        print("************ ", type(item['id']));
        how ever being string we can select using it 
        I guess postgres will do the casting
        """
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


def update_toDo_item_state(id, compleation_state):
    error_happens = False;

    try:
        toDo_item = db.session.query(todos).get(id);
        toDo_item.completed = compleation_state;
        db.session.commit();
    except:
        """
            why do we need to do rollback !!???
        """

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



############################################################################################################
# CRUD Operations on the List table

def save_toDo_list(data):
    listObj = todo_list(name=data['name']);
    newListObj = {};
    error_happens = False;

    try:
        db.session.add(listObj);
        db.session.commit();
        newListObj['name'] = listObj.name;
        newListObj['id'] = listObj.id;
    except:
        error_happens = True;
        db.session.rollback();
    finally:
        db.session.close();

    if error_happens:
        return {};
    return newListObj;


def get_toDo_lists():
    try:
        list = db.session.query(todo_list).all();
    except:
        abort(500);
    finally:
        db.session.close();
    return list;


def delete_toDo_list(data):
    response = {'success':False};
    try:
        db.session.query(todo_list).filter_by(id=data['id']).delete();
        db.session.commit();
        response['success'] = True;
    except:
        db.session.rollback();
    finally:
        db.session.close();
    return response;