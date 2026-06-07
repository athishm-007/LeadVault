const saveBtn = document.getElementById("save-btn");
const leadList = document.getElementById("lead-list");

let leads = [];

//load existing leads

chrome.localstorage.getitem(
["leads"],
(data)=>{

if(data.leads){

leads = data.leads;

renderLeads();

}

});

//save current website

saveBtn.addEventListener(
"click",
()=>{

chrome.tabs.query(
{
active:true,
currentWindow:true
},
(tabs)=>{

const lead = {
title: tabs[0].title,
url: tabs[0].url
};

leads.push(lead);

chrome.localstorage.setitem({
leads: leads
});

renderLeads();

});

});

//render leads

function renderLeads(){

leadList.innerHTML = "";

leads.forEach(
(lead,index)=>{

leadList.innerHTML += `
<li>

<a href="${lead.url}" target="_blank">
${lead.title}
</a>

<br><br>

<button onclick="deleteLead(${index})">
Delete
</button>

</li>
`;

});

}

//delete lead

window.deleteLead = function(index){

leads.splice(index,1);

chrome.localstorage.setitem({
leads: leads
});

renderLeads();

}