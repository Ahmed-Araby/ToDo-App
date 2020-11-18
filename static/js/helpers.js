function addToDoItem(item, htmlElement)
{
    /*
        add item -- coming form the data base
        to Html element

        this function is used by app_toDoItems.js -- function () file
        and app_toDoLists.js file function -- ()
    */

    var checked = "";
    if (item.completed === true)
        checked = "checked";
    var node = `
          <li>
                <input type="checkbox" id = 'item-check' ${checked}>

                <span id="item-desc">${item.desc}</span>

                <input id = 'item-id' type="hidden" value="${item.id}">
                <input id='item-desc-in' type="hidden" value ="${item.desc}">
                <input id='update-btn' type="hidden" value="Update" onclick="update_item(event)">

                <input class='delete-btn' type="submit" value="&cross;" onclick="delete_item(event)">

                <br> <br> <br>
          </li>`;

   htmlElement.innerHTML += node;
}

function initial_operations()
{
    var li = document.getElementById('toDoLists');
    if(li.children.length > 0)
        li.children[0].classList.add('selected_list');

    // empty the inputs

    return ;
}

initial_operations();
