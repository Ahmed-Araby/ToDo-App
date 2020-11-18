function populate_todo_items(items)
{
       /*
       fill the items ul
       with the todo items of
       the newly selected todo list.
       */

       // empty the current list
       var li = document.getElementById('toDoItems');
       li.innerHTML = "";

       // put the new elements
       for(const item of items)
            addToDoItem(item, li)
       return ;
}


document.getElementById('toDoLists').addEventListener('dblclick', function(event){
    console.log("dbl click");
    if(event.target.tagName !='SPAN')
        return ;

    var li = event.target.parentElement;
    var list_id = li.dataset.listid;

    // swap active list
    var prev_selected_list = document.getElementsByClassName('selected_list')[0];
    prev_selected_list.classList = [];
    li.classList.add('selected_list');

    // send fetch request.
    var URL = '/index/' + list_id;
    var requestPromise = fetch(URL); // get request;
    requestPromise.then(function(response){
            return response.json();
    }).then(function(response){
            console.log("success");
            populate_todo_items(response);
    }).catch(function(error){
        console.log("error happens");
    });
    return ;
});

document.getElementById('toDoLists').addEventListener('click', function(event){
    var target = event.target;
    if(target.tagName !='INPUT' && target.type !='checkbox')
        return ;
    console.log(target);

    /*
    this will trigger the click function also
    handle click only on the checkbox
    */
});

function addNewToDoList(event)
{

    event.preventDefault();

    console.log('add new toDoList');
    var textInput = document.getElementById('new-toDoList');
    var listName = textInput.value;
    var ul = document.getElementById('toDoLists');
    var form = event.target;
    var URL = form.action;

    // send fetch request.
    var requestPromise = fetch(URL, {
                                        method:"POST",
                                        body:JSON.stringify({"name":listName}),
                                        headers:{'Content-Type':'application/json'}
                                    }).then(function(response){
                                        return response.json();
                                    }).then(function(response){
                                        console.log('success on adding new to do list');
                                        console.log(response);
                                        add_toDo_list(response, ul);
                                    }).catch(function(error){
                                        console.log("error in saving new toDo list");
                                    });
    return ;
}

function delete_toDoList(event)
{
    // delete it from the data base
    var li = event.target.parentElement;
    var id = li.dataset.listid;
    var URL = '/delete/todolist';
    var className = li.className;

    // send fetch request.
    var requestPromise = fetch(URL, {
                                        method:"POST",
                                        body:JSON.stringify({"id":id}),
                                        headers:{'Content-Type':'application/json'}
                                    }).then(function(response){
                                        return response.json();
                                    }).then(function(response){
                                        console.log('success on deleting to do list');

                                        if(response.success == true){
                                            var ul = li.parentElement;
                                            console.log("in here");
                                            console.log(className == "selected_list" );
                                            console.log(ul.children.length );
                                            // in case this was the selected one
                                            if(className == "selected_list" && ul.children.length >2){
                                                // selected a new one
                                                // triger the event programatically
                                                console.log("choose new selected_list --- ");
                                                const event = new Event('dblclick');
                                                ul.children[1].children[1].dispatchEvent(event);
                                            }
                                            // order is important
                                            ul.removeChild(li);

                                        }
                                        else
                                            console.log("app.js -- erorr in server side 500");
                                    }).catch(function(error){
                                        console.log("error in deleting toDo list");
                                    });
    return ;
}

function add_toDo_list(response, htmlElement)
{
    var node = `<li data-listid="${response.id}">
                        <input type="checkbox" id="toDoList-check">
                        <span> ${response.name} </span>
                        <input class='delete-btn' type="button" value="&cross;" onclick="delete_toDoList(event)">
                        <br> <br> <br>
                </li>`;
    htmlElement.innerHTML +=node;
    return ;
}