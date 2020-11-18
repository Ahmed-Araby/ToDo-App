from model import *
from flask import jsonify

@app.route('/index/<list_id>', methods=['GET'])
def get_list_items(list_id):
    todos = get_toDO_items(list_id);
    todosArr = [];
    for todo in todos:
        tmpObj = {"id":todo.id, "desc":todo.desc, "completed":todo.completed};
        todosArr.append(tmpObj);

    return jsonify(todosArr);

@app.route('/create/todolist', methods=['POST'])
def post_create_list():
    data = request.get_json();
    toDo_list = save_toDo_list(data);
    print(toDo_list);
    return jsonify(toDo_list);

@app.route('/delete/todolist', methods=['POST'])
def post_delete_list():
    data = request.get_json();
    response = delete_toDo_list(data);
    return jsonify(response);