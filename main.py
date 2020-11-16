from model import  *
from flask import jsonify


# main page
@app.route('/', methods = ['GET'])
def get_index():
    todoItems = get_toDO_items();
    return render_template('index.html', todoItems = todoItems);


# add new to do item
@app.route('/create', methods = ['POST'])
def post_create():
    data = request.get_json();
    desc = data['description'];
    todoItem = save_toDo_item(desc)

    return jsonify({"id":todoItem.id, "desc":todoItem.desc});


@app.route('/update', methods = ['POST'])
def post_update():
    item = request.get_json();  # convert json into python object
    success = update_toDO_item(item);
    """
    there is no difference on sending with jsonfy 
    or not.
    """
    return jsonify({"success":success});

@app.route('/delete', methods = ['POST'])
def post_delete():
    item = request.get_json();
    success = delete_toDO_item(item);
    return jsonify({"success":success});

app.run(debug=True);

