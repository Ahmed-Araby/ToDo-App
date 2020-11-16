/*
create new --- todo item
*/

document.getElementById('sub').addEventListener('click', function(e){
    e.preventDefault();

    url = '/create';
    descInput = document.getElementById('description');
    desc = descInput.value;
    /*
    fetch will return a promise.
    */
    fetch( url, {
            method:'POST',
            body: JSON.stringify({
              "description":desc
            }),
            headers:{'Content-Type':'application/json'}
                }
        ).then(function(response){
                return response.json();  // promise !!???************
            }).then(function(response){
                    /*
                    we wait for the response to make
                    sure that the server did the commit
                    then we can put the data we entered in the list of
                    items in our view
                    */
                      node = `
                              <div class="item">
                                 <input type="hidden" value="${response.id}">
                                 <li>${response.desc} </li>
                              </div>`;

                      document.getElementById('items').innerHTML  += (node);
                      descInput.value = ""; // using closure.
                    }
                );
});


function delete_item(event)
{
    console.log("deleting");
    var li = event.target.parentElement;
    var ol = li.parentElement;

    var item_id = li.querySelector('#item-id').value;

    // send ajax post request
        var URL = '/delete';
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

function update_item(event)
{
    var li = event.target.parentElement;
    var new_description = li.querySelector('#item-desc-in').value;
    var id = li.querySelector('#item-id').value;

    var URL = '/update';
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

document.getElementById('items').addEventListener('dblclick', function(event){
    x = event.target;

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
