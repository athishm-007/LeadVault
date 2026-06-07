const saveBtn = document.getElementById("save-btn");
const leadList = document.getElementById("lead-list");
const deleteBtn = document.getElementById("delete-btn");
const leadsFromStorage = JSON.parse(localStorage.getItem("leads"));
let leads = [];

//load existing leads

if(leadsFromStorage){

leads = leadsFromStorage;
renderLeads(leads);

}

//save current website

saveBtn.addEventListener("click",function(){

chrome.tabs.query({active:true,currentWindow:true}, function(tabs){

leads.push(tabs[0].url);

localStorage.setItem("leads", JSON.stringify(leads));

renderLeads(leads);

});

});

//render leads

function renderLeads(leadsArray){

let listItems = "";
for(let i=0; i<leadsArray.length; i++){

listItems += `
<li>
<a target="_blank" href="${leadsArray[i]}">
${leadsArray[i]}
</a>
</li>
`;}

leadList.innerHTML = listItems;

}

//delete lead

deleteBtn.addEventListener("click",function(){
localStorage.clear();
leads = [];
renderLeads(leads);
});
