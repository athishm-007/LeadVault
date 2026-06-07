const leadsFromStorage = JSON.parse(localStorage.getItem("leads")) || [];

const contactsFromStorage = JSON.parse(localStorage.getItem("contacts")) || [];

const ideasFromStorage = JSON.parse(localStorage.getItem("ideas")) || [];

const notesFromStorage = JSON.parse(localStorage.getItem("youtubeNotes")) || [];

let leads = leadsFromStorage;
let contacts = contactsFromStorage;
let ideas = ideasFromStorage;
let notes = notesFromStorage;

let currentTab = "leads";

document.getElementById("export-pdf-btn").addEventListener("click", exportPDF);

renderCurrentTab();

updateDashboardCounts();

function updateDashboardCounts() {

    document.getElementById("lead-count").textContent = leads.length;

    document.getElementById("contact-count").textContent = contacts.length;

    document.getElementById("idea-count").textContent = ideas.length;

    document.getElementById("notes-count").textContent = notes.length;

}

//save leads

function saveLeads() {
    localStorage.setItem("leads", JSON.stringify(leads));
}

//save contacts

function saveContacts() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

//save ideas

function saveIdeas() {
    localStorage.setItem("ideas", JSON.stringify(ideas));
}

//save notes

function saveNotes() {
    localStorage.setItem("youtubeNotes", JSON.stringify(notes));
}

//render leads

function renderLeads(leadsArray) {
    let listItems = "";
    for (let i = 0; i < leadsArray.length; i++) {
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

    const leadList =
        document.getElementById("lead-list");

    if (!leadList) {
        return;
    }

    leadList.innerHTML = listItems;

    const categorySelects = document.querySelectorAll(".category-select");

    categorySelects.forEach((select) => {
        select.addEventListener("change", function () {
            const id = Number(this.dataset.id);

            saveCategory(id);
        });
    });

    const saveNoteButtons = document.querySelectorAll(".save-note-btn");

    saveNoteButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const id = Number(this.dataset.id);

            saveNote(id);
        });
    });

    const deleteButtons = document.querySelectorAll(".delete-single-btn");

    deleteButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const id = Number(this.dataset.id);

            deleteLead(id);
        });
    });

    document.getElementById("lead-count").textContent = leadsArray.length;
}

//delete single lead

window.deleteLead = function (id) {
    leads = leads.filter((lead) => lead.id !== id);

    saveLeads();

    renderLeads(leads);

    updateDashboardCounts();
};

//save note

window.saveNote = function (id) {
    const noteText = document.getElementById(`note-${id}`).value;

    const lead = leads.find((lead) => lead.id === id);

    if (lead) {
        lead.notes = noteText;

        saveLeads();
    }
};

//save category

window.saveCategory = function (id) {
    const category = document.getElementById(`category-${id}`).value;

    const lead = leads.find((lead) => lead.id === id);

    if (lead) {
        lead.category = category;

        saveLeads();
    }
};

//tab listener

//leads:

document.getElementById("leads-tab").addEventListener("click", function () {
    currentTab = "leads";

    renderCurrentTab();
});

//contacts:

document.getElementById("contacts-tab").addEventListener("click", function () {
    currentTab = "contacts";

    renderCurrentTab();
});

//ideas:

document.getElementById("ideas-tab").addEventListener("click", function () {
    currentTab = "ideas";

    renderCurrentTab();
});

//notes:

document.getElementById("notes-tab").addEventListener("click", function () {
    currentTab = "notes";

    renderCurrentTab();
});

//render current tab

function renderCurrentTab() {
    if (currentTab === "leads") {
        renderLeadsPage();
    } else if (currentTab === "contacts") {
        renderContactsPage();
    } else if (currentTab === "ideas") {
        renderIdeasPage();
    } else if (currentTab === "notes") {
        renderNotesPage();
    }

    updateActiveTab();
}

//render leads page

function renderLeadsPage() {
    document.getElementById("content-area").innerHTML = `

        <select id="filter-category">

            <option value="All">All</option>
            <option value="Client">Client</option>
            <option value="Research">Research</option>
            <option value="Startup Idea">Startup Idea</option>
            <option value="Development">Development</option>
            <option value="General">General</option>

        </select>

        <input
            type="text"
            id="search"
            placeholder="Search Leads..."
        >

        <div class="buttons">

            <button id="save-btn">
                Save Current Website
            </button>

            <button id="delete-btn">
                Delete All Leads
            </button>

        </div>

        <ul id="lead-list"></ul>

    `;

    attachLeadEvents();

    renderLeads(leads);
}

//render contacts page

function renderContactsPage() {
    document.getElementById("content-area").innerHTML = `

        <h2>Contacts</h2>

        <input
            id="contact-name"
            placeholder="Name"
        >

        <input
            id="contact-email"
            placeholder="Email"
        >

        <input
            id="contact-phone"
            placeholder="Phone"
        >

        <textarea
            id="contact-notes"
            placeholder="Notes"
        ></textarea>

        <button
            id="add-contact-btn"
        >
            Add Contact
        </button>

        <button id="delete-all-contacts-btn">
            Delete All Contacts
        </button>

        <ul id="contact-list"></ul>

    `;

    attachContactEvents();

    renderContacts();
}

//render ideas page

function renderIdeasPage() {
    document.getElementById("content-area").innerHTML = `

        <h2>Startup Ideas</h2>

        <input
            id="idea-title"
            placeholder="Idea Title"
        >

        <textarea
            id="idea-problem"
            placeholder="Problem"
        ></textarea>

        <textarea
            id="idea-solution"
            placeholder="Solution"
        ></textarea>

        <input
            id="idea-market"
            placeholder="Target Market"
        >

        <select id="idea-status">

            <option>Idea</option>

            <option>Researching</option>

            <option>Building</option>

            <option>Launched</option>

        </select>

        <button id="add-idea-btn">

            Add Idea

        </button>

        <button id="delete-all-ideas-btn">
            Delete All Ideas
        </button>

        <ul id="idea-list"></ul>

    `;

    attachIdeaEvents();

    renderIdeas();
}

//render notes page

function renderNotesPage() {
    document.getElementById("content-area").innerHTML = `

        <h2>YouTube Notes</h2>

        <input
            id="video-title"
            placeholder="Video Title"
        >

        <input
            id="channel-name"
            placeholder="Channel Name"
        >

        <input
            id="video-url"
            placeholder="Video URL"
        >

        <textarea
            id="video-notes"
            placeholder="Notes"
        ></textarea>

        <button
            id="add-note-btn"
        >
            Save Note
        </button>

        <button id="delete-all-notes-btn">
            Delete All Notes
        </button>

        <ul id="notes-list"></ul>

    `;

    attachNotesEvents();

    renderNotes();
}

//attach events to leads page elements

function attachLeadEvents() {
    const saveBtn = document.getElementById("save-btn");

    const deleteBtn = document.getElementById("delete-btn");

    const searchInput = document.getElementById("search");

    const filterCategory = document.getElementById("filter-category");

    //save current website

    saveBtn.addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const lead = {
                id: Date.now(),

                title: tabs[0].title,

                url: tabs[0].url,

                date: new Date().toLocaleDateString(),

                notes: "",

                category: "General",
            };

            const exists =
                leads.some(
                    item =>
                        item.url === tabs[0].url
                );

            if (exists) {

                alert(
                    "Lead already exists"
                );

                return;
            }

            leads.push(lead);
            saveLeads();

            renderLeads(leads);

            updateDashboardCounts();
        });
    });

    //search leads

    searchInput.addEventListener("input", function () {
        const filtered = leads.filter((lead) =>
            lead.title.toLowerCase().includes(this.value.toLowerCase()),
        );

        renderLeads(filtered);
    });

    //filter by category

    filterCategory.addEventListener("change", filterLeads);

    //delete lead

    deleteBtn.addEventListener(
        "click",
        function () {

            if (
                confirm(
                    "Delete all leads?"
                )
            ) {

                leads = [];

                saveLeads();

                renderLeads(leads);

                updateDashboardCounts();

            }

        }
    );
}

//function to filter leads by category

function filterLeads() {
    const filterCategory = document.getElementById("filter-category");

    const category = filterCategory.value;

    if (category === "All") {
        renderLeads(leads);
        return;
    }

    const filtered = leads.filter((lead) => lead.category === category);

    renderLeads(filtered);
}

//function to update active tab styling

function updateActiveTab() {
    document.querySelectorAll(".tabs button").forEach((btn) => {
        btn.classList.remove("active");
    });

    document.getElementById(`${currentTab}-tab`).classList.add("active");
}

//attach events to contacts page elements

function attachContactEvents() {
    document
        .getElementById("add-contact-btn")
        .addEventListener("click", addContact);

    document
        .getElementById("delete-all-contacts-btn")
        .addEventListener(
            "click",
            deleteAllContacts
        );
}

//function to add contact

function addContact() {
    const contact = {
        id: Date.now(),

        name: document.getElementById("contact-name").value,

        email: document.getElementById("contact-email").value,

        phone: document.getElementById("contact-phone").value,

        notes: document.getElementById("contact-notes").value,
    };

    if (!contact.name || !contact.email) {
        alert("Name and Email are required");
        return;
    }

    contact.email = contact.email.trim();

    const emailPattern =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(ontact.email)) {
        alert("Enter a valid email address");
        return;
    }

    const exists = contacts.some(
        c =>
            c.email.toLowerCase() ===
            contact.email.toLowerCase()
    );

    if (exists) {
        alert("Contact already exists");
        return;
    }

    contacts.push(contact);

    saveContacts();

    renderContacts();

    document.getElementById("contact-name").value = "";

    document.getElementById("contact-email").value = "";

    document.getElementById("contact-phone").value = "";

    document.getElementById("contact-notes").value = "";

    updateDashboardCounts();
}

//function to render contacts

function renderContacts() {
    let html = "";

    contacts.forEach((contact) => {
        html += `
        <li>

            <strong>${contact.name}</strong>

            <br>

            ${contact.email}

            <br>

            ${contact.phone}

            <br><br>

            <button
                class="delete-contact-btn"
                data-id="${contact.id}"
            >
                Delete
            </button>

        </li>
`;
    });

    document.getElementById("contact-list").innerHTML = html;

    document.querySelectorAll(".delete-contact-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            deleteContact(Number(this.dataset.id));
        });
    });

    document.getElementById("contact-count").textContent = contacts.length;
}

//function to delete contact

function deleteContact(id) {
    contacts = contacts.filter((contact) => contact.id !== id);

    saveContacts();

    renderContacts();

    updateDashboardCounts();
}

//attach events to ideas page elements

function attachIdeaEvents() {
    document.getElementById("add-idea-btn").addEventListener("click", addIdea);

    document.getElementById("delete-all-ideas-btn").addEventListener("click", deleteAllIdeas);
}

//function to add idea

function addIdea() {
    const idea = {
        id: Date.now(),

        title: document.getElementById("idea-title").value,

        problem: document.getElementById("idea-problem").value,

        solution: document.getElementById("idea-solution").value,

        market: document.getElementById("idea-market").value,

        status: document.getElementById("idea-status").value,
    };

    if (!idea.title) {
        alert("Idea title required");

        return;
    }

    const exists = ideas.some(
        i =>
            i.title.toLowerCase() ===
            idea.title.toLowerCase()
    );

    if (exists) {
        alert("Idea already exists");
        return;
    }

    ideas.push(idea);

    saveIdeas();

    renderIdeas();

    document.getElementById("idea-title").value = "";

    document.getElementById("idea-problem").value = "";

    document.getElementById("idea-solution").value = "";

    document.getElementById("idea-market").value = "";

    document.getElementById("idea-status").value = "Idea";

    updateDashboardCounts();
}

//function to render ideas

function renderIdeas() {
    let html = "";

    ideas.forEach((idea) => {
        html += `

        <li>

    <strong>
        ${idea.title}
    </strong>

    <br>

    Status:
    ${idea.status}

    <br>

    Market:
    ${idea.market}

    <br><br>

    <button
        class="delete-idea-btn"
        data-id="${idea.id}"
    >
        Delete
    </button>

</li>

        `;
    });

    document.getElementById("idea-list").innerHTML = html;

    document.querySelectorAll(".delete-idea-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            deleteIdea(Number(this.dataset.id));
        });
    });

    document.getElementById("idea-count").textContent = ideas.length;
}

//function to delete idea

function deleteIdea(id) {
    ideas = ideas.filter((idea) => idea.id !== id);

    saveIdeas();

    renderIdeas();

    updateDashboardCounts();
}

//attach events to notes page elements

function attachNotesEvents() {
    document.getElementById("add-note-btn").addEventListener("click", addNotes);

    document.getElementById("delete-all-notes-btn").addEventListener("click", deleteAllNotes);
}

//function to add notes

function addNotes() {
    const note = {
        id: Date.now(),

        title: document.getElementById("video-title").value,

        channel: document.getElementById("channel-name").value,

        videoUrl: document.getElementById("video-url").value,

        notes: document.getElementById("video-notes").value,
    };

    if (!note.title) {
        alert("Video title required");

        return;
    }

    const exists =
        note.videoUrl &&
        notes.some(
            n => n.videoUrl === note.videoUrl
        );

    if (exists) {
        alert("Note already exists");
        return;
    }

    notes.push(note);

    saveNotes();

    renderNotes();

    document.getElementById("video-title").value = "";

    document.getElementById("channel-name").value = "";

    document.getElementById("video-url").value = "";

    document.getElementById("video-notes").value = "";

    updateDashboardCounts();
}

//function to render notes

function renderNotes() {
    let html = "";

    notes.forEach((note) => {
        html += `

        <li>

    <strong>
        ${note.title}
    </strong>

    <br>

    ${note.channel}

    <br><br>

    <a
        href="${note.videoUrl}"
        target="_blank"
    >
        Open Video
    </a>

    <br><br>

    <button
        class="delete-note-btn"
        data-id="${note.id}"
    >
        Delete
    </button>

</li>

        `;
    });

    document.getElementById("notes-list").innerHTML = html;

    document.querySelectorAll(".delete-note-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            deleteNote(Number(this.dataset.id));
        });
    });

    document.getElementById("notes-count").textContent = notes.length;
}

//function to delete note

function deleteNote(id) {
    notes = notes.filter((note) => note.id !== id);

    saveNotes();

    renderNotes();

    updateDashboardCounts();
}

//function to export PDF

function exportPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text(
        "LeadVault Report",
        20,
        y
    );

    y += 20;
    y = checkPage(doc, y);
    // LEADS

    doc.setFontSize(14);

    doc.text(
        "Leads",
        20,
        y
    );

    y += 10;
    y = checkPage(doc, y);
    leads.forEach(lead => {

        doc.text(
            `${lead.title}`,
            20,
            y
        );

        y += 8;
        y = checkPage(doc, y);
        const splitUrl =
            doc.splitTextToSize(
                lead.url,
                160
            );

        doc.text(
            splitUrl,
            25,
            y
        );

        y += splitUrl.length * 6;

        y += 12;
        y = checkPage(doc, y);
    });

    // CONTACTS

    y += 10;
    y = checkPage(doc, y);
    doc.text(
        "Contacts",
        20,
        y
    );

    y += 10;
    y = checkPage(doc, y);
    contacts.forEach(contact => {

        doc.text(
            `${contact.name} | ${contact.email}`,
            20,
            y
        );

        y += 10;
        y = checkPage(doc, y);
    });

    // IDEAS

    y += 10;
    y = checkPage(doc, y);
    doc.text(
        "Startup Ideas",
        20,
        y
    );

    y += 10;
    y = checkPage(doc, y);
    ideas.forEach(idea => {

        doc.text(
            `${idea.title} (${idea.status})`,
            20,
            y
        );

        y += 10;
        y = checkPage(doc, y);
    });

    // NOTES

    y += 10;
    y = checkPage(doc, y);
    doc.text(
        "YouTube Notes",
        20,
        y
    );

    y += 10;
    y = checkPage(doc, y);
    notes.forEach(note => {

        doc.text(
            `${note.title} - ${note.channel}`,
            20,
            y
        );

        y += 10;
        y = checkPage(doc, y);
    });

    doc.save(
        "LeadVault-Report.pdf"
    );

}

function checkPage(doc, y) {

    if (y > 270) {

        doc.addPage();

        return 20;

    }

    return y;

}

//function to delete all contacts

function deleteAllContacts() {

    if (
        confirm(
            "Delete all contacts?"
        )
    ) {

        contacts = [];

        saveContacts();

        renderContacts();

        updateDashboardCounts();

    }

}

//function to delete all ideas

function deleteAllIdeas() {

    if (
        confirm(
            "Delete all ideas?"
        )
    ) {

        ideas = [];

        saveIdeas();

        renderIdeas();

        updateDashboardCounts();

    }

}

//function to delete all notes

function deleteAllNotes() {

    if (
        confirm(
            "Delete all notes?"
        )
    ) {

        notes = [];

        saveNotes();

        renderNotes();

        updateDashboardCounts();

    }

}