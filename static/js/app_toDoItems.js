function normalize_view(listItem)
{
    /*return the html view to the normal state
        and change the item name
        on success */

    // get reference to html elemetns
    var li = listItem
    var update_btn = li.querySelector('#update-btn');
    var item_desc_in = li.querySelector('#item-desc-in');
    var item_desc = li.querySelector('#item-desc');

    // change the html structure.
    item_desc.style.display = 'inline';
    item_desc.innerText = item_desc_in.value;
    item_desc_in.type = 'hidden';
    update_btn.type = 'hidden';
    return ;

}



function addNewToDoItem(event)
{
    /*
        create new todo Item
        save it to the DB
        add it to the VIEW.
        USing AJAX not reloading.
    */

    event.preventDefault();
    var selected_list = document.getElementsByClassName('selected_list')[0];
    var list_id = selected_list.dataset.listid;
    var form = event.target;
    var URL = form.action;
    var descInput = document.getElementById('new-toDoItem');
    var desc = descInput.value;

    fetch( URL, {
                 method:'POST',
                 body: JSON.stringify({
                 "description":desc,
                 "list_id":list_id
                }),
                 headers:{'Content-Type':'application/json'}
                }
        ).then(function(response){
                return response.json();
            }).then(function(response){
                  var li = document.getElementById('toDoItems');
                  addToDoItem(response, li)
                  descInput.value = ""; // using closure.
            }).catch(function(error){
                  console.log("errro happens in adding new todo item");
            });
}



function delete_item(event)
{
    console.log("deleting");
    var li = event.target.parentElement;
    var ol = li.parentElement;

    var item_id = li.querySelector('#item-id').value;

    // send ajax post request
        var URL = '/delete/todoitem';
    var RequestPromise = fetch(
            URL,
            {
                method:"POST",
                body: JSON.stringify({"id":item_id}),
                headers:  {"Content-type": "application/json; charset=UTF-8"}   // read more about the char set
            });

    RequestPromise.then(function(response){
                return response.json();  // will return promise.
            }).then(function(response){
                ol.removeChild(li);
            }).catch(function(error){
                console.log('failure');
                console.log(error);
            });
    return ;
}


function update_item(event)
{
    var li = event.target.parentElement;
    var new_description = li.querySelector('#item-desc-in').value;
    var id = li.querySelector('#item-id').value;

    var URL = '/update/todoitem/desc';
    var RequestPromise = fetch(
            URL,
            {
                method:"POST",
                body: JSON.stringify({"id":id, "new_description":new_description}),
                headers:  {"Content-type": "application/json; charset=UTF-8"}
            });

    RequestPromise.then(function(response){
                return response.json();  // will return promise.
            }).then(function(response){

               /*
                    best practive for the response
                    that the sever should return !!!???

                    I guess I should wait for
                    the response to be complete !!!
               */

                normalize_view(li);
            }).catch(function(error){
                /*
                leave the view as it's
                when this could happen !!???
                , how to use the error !!!???
                */

                console.log('failure');
                console.log(error);
            });
}

document.getElementById('toDoItems').addEventListener('click', function(event){

    /*
    handle click on the check box for marking or
    un marking the toDo item
    the only event I need to handle in the toDOItems list using CLick event.
    */

    if (event.target.tagName == "INPUT" && event.target.type == 'checkbox'){
        var li = event.target.parentElement;
        var item_id = li.querySelector('#item-id').value;
        var URL = '/update/todoitem/state';
        var data = {"state":event.target.checked, "id":item_id};

        var requestPromise = fetch(
                            URL,
                            {
                                method:'POST',
                                body: JSON.stringify(data),
                                headers:{"Content-type": "application/json; charset=UTF-8"}
                            }
                            );

        requestPromise.then(function(response){
                return response.json();  // will return promise.
            }).then(function(response){
                // leave it as it's
                return true;
            }).catch(function(error){
                console.log("failure");
                event.target.checked = ! event.target.checked;
            });

    }
    else
        return ;
});

document.getElementById('toDoItems').addEventListener('dblclick', function(event){

    if(event.target.tagName !='SPAN')
        return ;
    /*
        IF THE target is not the span
        ignore the event !!!
    */

    // get reference to html elemetns
    var li = event.target.parentElement;
    var update_btn = li.querySelector('#update-btn');
    var item_desc_in = li.querySelector('#item-desc-in');
    var item_desc = li.querySelector('#item-desc');

    // change the html structure.
    item_desc.style.display = 'none';
    item_desc_in.type = 'text';
    update_btn.type = 'button';
    return ;
});
