const saveBtn = document.getElementById("save-btn");
const leadList = document.getElementById("lead-list");
const deleteBtn = document.getElementById("delete-btn");
const leadsFromStorage = JSON.parse(localStorage.getItem("leads"));
const searchInput = document.getElementById("search");
const deleteLastBtn = document.getElementById("delete-last-btn");
const filterCategory = document.getElementById("filter-category");
let leads = [];

//load existing leads

if(leadsFromStorage){

leads = leadsFromStorage;
renderLeads(leads);

}

//save current website

saveBtn.addEventListener("click",function(){

chrome.tabs.query({active:true,currentWindow:true}, function(tabs){

const lead = {

    id: Date.now(),

    title: tabs[0].title,

    url: tabs[0].url,

    date: new Date().toLocaleDateString(),

    notes: "",

    category: "General"

};

leads.push(lead);
localStorage.setItem("leads", JSON.stringify(leads));

renderLeads(leads);

});

});

//search leads

searchInput.addEventListener("input", function(){

const filtered = leads.filter(lead =>

lead.title.toLowerCase().includes(
this.value.toLowerCase()
)

);

renderLeads(filtered);

});

//render leads

function renderLeads(leadsArray){

let listItems = "";
for(let i = 0; i < leadsArray.length; i++){

    listItems += `
<li>

    <strong>
        ${leadsArray[i].title}
    </strong>

    <br>

    <a target="_blank"
       href="${leadsArray[i].url}">
       ${leadsArray[i].url}
    </a>

    <br>

    <small>
        ${leadsArray[i].date}
    </small>

    <br>

<select
    id="category-${leadsArray[i].id}"
    data-id="${leadsArray[i].id}"
    class="category-select"
>

    <option value="General"
    ${leadsArray[i].category === "General" ? "selected" : ""}>
    General
    </option>

    <option value="Client"
    ${leadsArray[i].category === "Client" ? "selected" : ""}>
    Client
    </option>

    <option value="Research"
    ${leadsArray[i].category === "Research" ? "selected" : ""}>
    Research
    </option>

    <option value="Startup Idea"
    ${leadsArray[i].category === "Startup Idea" ? "selected" : ""}>
    Startup Idea
    </option>

    <option value="Development"
    ${leadsArray[i].category === "Development" ? "selected" : ""}>
    Development
    </option>

</select>

    <br><br>

    <textarea
        id="note-${leadsArray[i].id}"
        placeholder="Add notes..."
    >${leadsArray[i].notes}</textarea>

    <br>

    <button
    class="save-note-btn"
    data-id="${leadsArray[i].id}">
    Save Note
</button>

<button
    class="delete-single-btn"
    data-id="${leadsArray[i].id}">
    Delete
</button>

</li>
`;
}

leadList.innerHTML = listItems;

const categorySelects =
document.querySelectorAll(".category-select");

categorySelects.forEach(select => {

    select.addEventListener(
        "change",
        function(){

            const id =
            Number(
                this.dataset.id
            );

            saveCategory(id);

        }
    );

});

const saveNoteButtons =
document.querySelectorAll(".save-note-btn");

saveNoteButtons.forEach(btn => {

    btn.addEventListener(
        "click",
        function(){

            const id =
            Number(
                this.dataset.id
            );

            saveNote(id);

        }
    );

});

const deleteButtons =
document.querySelectorAll(
    ".delete-single-btn"
);

deleteButtons.forEach(btn => {

    btn.addEventListener(
        "click",
        function(){

            const id =
            Number(
                this.dataset.id
            );

            deleteLead(id);

        }
    );

});

document.getElementById("lead-count").textContent =leadsArray.length;

}

//delete single lead

window.deleteLead = function(id){

    leads = leads.filter(
        lead => lead.id !== id
    );

    localStorage.setItem(
        "leads",
        JSON.stringify(leads)
    );

    renderLeads(leads);

}

//save note

window.saveNote = function(id){

    const noteText =
    document.getElementById(
        `note-${id}`
    ).value;

    const lead =
    leads.find(
        lead => lead.id === id
    );

    if(lead){

        lead.notes = noteText;

        localStorage.setItem(
            "leads",
            JSON.stringify(leads)
        );

    }

}

//save category

window.saveCategory = function(id){

    const category =
    document.getElementById(
        `category-${id}`
    ).value;

    const lead =
    leads.find(
        lead => lead.id === id
    );

    if(lead){

        lead.category = category;

console.log("Saving:", category);

localStorage.setItem(
    "leads",
    JSON.stringify(leads)
);

console.log(
JSON.parse(
localStorage.getItem("leads")
)
);

    }

}

//filter by category

filterCategory.addEventListener(
    "change",
    filterLeads
);

function filterLeads(){

    const category =
    filterCategory.value;

    if(category === "All"){

        renderLeads(leads);

        return;
    }

    const filtered =
    leads.filter(
        lead => lead.category === category
    );

    renderLeads(filtered);
}

//delete lead

deleteBtn.addEventListener("click",function(){
localStorage.clear();
leads = [];
renderLeads(leads);
});

//delete last lead

deleteLastBtn.addEventListener("click",function(){
if(leads.length > 0){
    leads.pop();
    localStorage.setItem("leads", JSON.stringify(leads));
    renderLeads(leads);
}
});
