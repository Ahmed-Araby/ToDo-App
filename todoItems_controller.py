from model import *
from flask import jsonify

# main page
@app.route('/', methods=['GET'])
@app.route('/index', methods=['GET'])
def get_index():
    lists = get_toDo_lists();
    todoItems = [];
    if len(lists) != 0:
        first_id = lists[0].id;
        todoItems = get_toDO_items(first_id);

    return render_template('/index.html', lists=lists, todoItems=todoItems);


# add new to do item
@app.route('/create/todoitem', methods=['POST'])
def post_create():
    data = request.get_json();
    todoItem = save_toDo_item(data)
    return jsonify({"id": todoItem.id,
                    "desc": todoItem.desc,
                    "completed": todoItem.completed,
                    "list_fk": todoItem.list_fk
                    });


@app.route('/update/todoitem/desc', methods=['POST'])
def post_update_description():
    item = request.get_json();  # convert json into python object
    success = update_toDO_item(item);

    """
    there is no difference on sending with jsonfy 
    or not.
    """

    return jsonify({"success": success});


@app.route('/update/todoitem/state', methods=['POST'])
def post_update_state():
    obj = request.get_json();
    id = obj['id'];

    """
        true = mean completed 
        false = mean un selected = not competed.
    """

    completion_state = obj['state'];
    success = update_toDo_item_state(id, completion_state);
    return jsonify({"success": success});


@app.route('/delete/todoitem', methods=['POST'])
def post_delete():
    item = request.get_json();
    success = delete_toDO_item(item);
    return jsonify({"success": success});

