/* ==========================================
   Goal Tracker - goals.js (Part 1)
========================================== */

const modal=document.getElementById("goalModal");
const openBtn=document.getElementById("openModal");
const closeBtn=document.getElementById("closeModal");
const form=document.getElementById("goalForm");
const goalList=document.getElementById("goalList");

let editingGoalId=null;

/* -----------------------------
   Open Modal
----------------------------- */

openBtn.onclick=()=>{

    editingGoalId=null;

    form.reset();

    document.getElementById("modalTitle").innerText="Add Goal";

    setCurrentDateTime();

    modal.style.display="flex";

};

/* -----------------------------
   Close Modal
----------------------------- */

closeBtn.onclick=()=>{

    modal.style.display="none";

};

window.onclick=(e)=>{

    if(e.target===modal){

        modal.style.display="none";

    }

};

/* -----------------------------
   Current Date Time
----------------------------- */

function setCurrentDateTime(){

    const now=new Date();

    const date=now.toISOString().split("T")[0];

    const time=now.toTimeString().slice(0,5);

    startDate.value=date;

    startTime.value=time;

    targetDate.value=date;

    targetTime.value=time;

}

/* -----------------------------
   Save Goal
----------------------------- */

form.addEventListener("submit",function(e){

    e.preventDefault();

    const data={

        title:title.value.trim(),

        description:description.value.trim(),

        category:category.value,

        priority:priority.value,

        startDate:startDate.value,

        startTime:startTime.value,

        targetDate:targetDate.value,

        targetTime:targetTime.value,

        notes:notes.value.trim()

    };

    if(editingGoalId){

        updateGoal(editingGoalId,data);

    }else{

        addGoal(data);

    }

    modal.style.display="none";

    renderGoalList();

});

/* -----------------------------
   Edit Goal
----------------------------- */

function editGoal(id){

    const goal=findGoal(id);

    if(!goal) return;

    editingGoalId=id;

    modal.style.display="flex";

    document.getElementById("modalTitle").innerText="Edit Goal";

    title.value=goal.title;

    description.value=goal.description;

    category.value=goal.category;

    priority.value=goal.priority;

    startDate.value=goal.startDate;

    startTime.value=goal.startTime;

    targetDate.value=goal.targetDate;

    targetTime.value=goal.targetTime;

    notes.value=goal.notes;

}
/* ==========================================
   Goal Tracker - goals.js (Part 2)
   Render, Delete, Complete, Search & Filter
========================================== */

/* -----------------------------
   Render Goal List
----------------------------- */

function renderGoalList(list = null) {

    const goals = list || getGoals();

    goalList.innerHTML = "";

    if (goals.length === 0) {

        goalList.innerHTML =
        `<div class="empty">
            No goals found.
        </div>`;

        return;
    }

    goals.sort((a, b) => {

        return getGoalTarget(a) - getGoalTarget(b);

    });

    goals.forEach(goal => {

        const card = document.createElement("div");

        card.className = "goal-card fade-in";

        const status = goal.completed
            ? "Completed"
            : "Active";

        const badge = goal.completed
            ? "completed-status"
            : "active-status";

        card.innerHTML = `

        <h3>${goal.title}</h3>

        <p>${goal.description}</p>

        <p><strong>Category:</strong> ${goal.category}</p>

        <p><strong>Priority:</strong> ${goal.priority}</p>

        <p><strong>Start:</strong>
        ${goal.startDate}
        ${goal.startTime}</p>

        <p><strong>Target:</strong>
        ${goal.targetDate}
        ${goal.targetTime}</p>

        <p><strong>Days Left:</strong>
        ${getDaysLeft(goal)}</p>

        <p><strong>Progress:</strong>
        ${getGoalProgress(goal)}%</p>

        <div class="progress">
            <div class="progress-bar"
            style="width:${getGoalProgress(goal)}%;">
            </div>
        </div>

        <span class="goal-status ${badge}">
            ${status}
        </span>

        <br><br>

        <button
        class="btn btn-primary"
        onclick="editGoal(${goal.id})">
        Edit
        </button>

        <button
        class="btn btn-success"
        onclick="toggleComplete(${goal.id})">
        ${goal.completed ? "Undo" : "Complete"}
        </button>

        <button
        class="btn btn-danger"
        onclick="removeGoal(${goal.id})">
        Delete
        </button>

        `;

        goalList.appendChild(card);

    });

}

/* -----------------------------
   Delete Goal
----------------------------- */

function removeGoal(id) {

    if (!confirm("Delete this goal?"))
        return;

    deleteGoal(id);

    renderGoalList();

}

/* -----------------------------
   Complete / Undo
----------------------------- */

function toggleComplete(id) {

    const goal = findGoal(id);

    if (!goal) return;

    if (goal.completed) {

        uncompleteGoal(id);

    } else {

        completeGoal(id);

    }

    renderGoalList();

}

/* -----------------------------
   Search
----------------------------- */

const searchBox =
document.getElementById("searchGoal");

searchBox.addEventListener("input", () => {

    const text = searchBox.value.trim();

    renderGoalList(searchGoals(text));

});

/* -----------------------------
   Filter
----------------------------- */

const filterBox =
document.getElementById("filterGoal");

filterBox.addEventListener("change", () => {

    renderGoalList(
        filterGoals(filterBox.value)
    );

});
/* ==========================================
   Goal Tracker - goals.js (Part 3)
   Validation, Initialization & Utilities
========================================== */

/* -----------------------------
   Validate Goal Dates
----------------------------- */

function validateGoal() {

    const start = new Date(
        startDate.value + "T" + startTime.value
    );

    const target = new Date(
        targetDate.value + "T" + targetTime.value
    );

    if (target <= start) {

        alert("Target date & time must be after the start date & time.");

        return false;

    }

    return true;

}

/* -----------------------------
   Override Form Submit
----------------------------- */

form.addEventListener("submit", function (e) {

    if (!validateGoal()) {

        e.preventDefault();

        return;

    }

});

/* -----------------------------
   Reset Search & Filter
----------------------------- */

function resetFilters() {

    if (searchBox)
        searchBox.value = "";

    if (filterBox)
        filterBox.value = "all";

    renderGoalList();

}

/* -----------------------------
   Auto Refresh Every Minute
----------------------------- */

setInterval(function () {

    renderGoalList();

}, 60000);

/* -----------------------------
   Refresh When Tab Returns
----------------------------- */

document.addEventListener(
    "visibilitychange",
    function () {

        if (!document.hidden) {

            renderGoalList();

        }

    }
);

/* -----------------------------
   Keyboard Shortcuts
----------------------------- */

document.addEventListener("keydown", function (e) {

    /* ESC closes modal */

    if (e.key === "Escape") {

        modal.style.display = "none";

    }

    /* Ctrl + N opens Add Goal */

    if (e.ctrlKey && e.key.toLowerCase() === "n") {

        e.preventDefault();

        openBtn.click();

    }

});

/* -----------------------------
   Initialize Page
----------------------------- */

function initializeGoalsPage() {

    setCurrentDateTime();

    renderGoalList();

}

/* -----------------------------
   Run on Load
----------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    initializeGoalsPage
);
