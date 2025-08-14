
function clearList() {
    if (confirm("kya aap such me list clear karna chahate hai....!")) {
        console.log('clearing list');
        localStorage.clear();
        renderTable();
    }
}

function update() {
    console.log("Updating list...");
    let tit = document.getElementById('title').value.trim();

    // only add if field are not empty
    if (tit) {
        let itemJsonArray = JSON.parse(localStorage.getItem("itemsJson") || '[]');
        //last up.
        itemJsonArray.push({
            text: tit,
            checked: false,
            createdAt: Date.now()
        });
        localStorage.setItem("itemsJson", JSON.stringify(itemJsonArray));
        //clear fields
        document.getElementById('title').value = "";
        renderTable();
    }
}

function renderTable() {
     console.log("table rendered");
    // Populate tha table
    let titleBody = document.getElementById("titleBody");
    let itemJsonArray = JSON.parse(localStorage.getItem('itemsJson') || '[]');
    let str = "";
    // last added
    let unchecked = itemJsonArray.filter(item => !item.checked);
    let checked = itemJsonArray.filter(item => item.checked);

    unchecked.sort((a, b) => a.createdAt - b.createdAt);
    checked.sort((a, b) => a.createdAt - b.createdAt);
    itemJsonArray = [...unchecked, ...checked];

    itemJsonArray.forEach((element, index) => {

        const isChecked = element.checked ? "checked" : "";
        const rowClass = element.checked ? "class='checked-item'" : "";
        str += `
        <tr>
            <th ${rowClass} scope="row">
                <input type="checkbox" id="opt-${index}" ${isChecked}>
                <label for="opt-${index}"></label>
            </th>
            <td>
                <span class="table-item">${element.text}</span>
                <span class="table-btn"><button class="btn" onclick="Deleted(${element.createdAt})">delete</button></span>
            </td>
        </tr>`;
    });
    titleBody.innerHTML = str;

    //Attach change event to all checkboxes
    itemJsonArray.forEach((_, index) => {
        const checkbox = document.getElementById(`opt-${index}`);
        if (checkbox) {
            checkbox.addEventListener("change", function () {
                let currentItems = JSON.parse(localStorage.getItem("itemsJson") || '[]');
                currentItems[index].checked = this.checked;

                let unchecked = currentItems.filter(item => !item.checked);
                let checked = currentItems.filter(item => item.checked);

                unchecked.sort((a, b) => a.createdAt - b.createdAt);
                checked.sort((a, b) => a.createdAt - b.createdAt);
                let sorted = [...unchecked, ...checked];
                localStorage.setItem("itemsJson", JSON.stringify(sorted));
                renderTable();
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const add = document.getElementById("addbtn");
    add.addEventListener("click", update);
    update();
    renderTable();
    enterKeyEvent()
});
function Deleted(createdAt) {
    console.log("Deleting item with createdAt:", createdAt);
    let itemJsonArrayStr = localStorage.getItem('itemsJson');
    let itemJsonArray = JSON.parse(itemJsonArrayStr || '[]');
    itemJsonArray = itemJsonArray.filter(item => item.createdAt !== createdAt);

    // itemJsonArray.splice(itemIndex, 1);
    localStorage.setItem('itemsJson', JSON.stringify(itemJsonArray));
    renderTable();
}

function enterKeyEvent() {
    let tit = document.getElementById("title");
    
    tit.addEventListener("keydown", (e) => {
        if(e.key == "Enter"){
           console.log(`Pressed "${e.key}"`);
           update();
           renderTable();
        }
    }); 
}
