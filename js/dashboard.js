/* ==========================================
   Goal Tracker - dashboard.js (Part 4A)
========================================== */

const streakElement =
document.getElementById("streak");

const activeElement =
document.getElementById("activeGoals");

const completedElement =
document.getElementById("completedGoals");

const daysLeftElement =
document.getElementById("daysLeft");

const progressElement =
document.getElementById("progressPercent");

const progressBar =
document.getElementById("progressBar");

const goalContainer =
document.getElementById("goalContainer");


/* -----------------------------
   Load Dashboard
----------------------------- */

function loadDashboard(){

    const data = dashboardData();

    streakElement.textContent =
        data.streak + " Days";

    activeElement.textContent =
        data.active;

    completedElement.textContent =
        data.completed;

    daysLeftElement.textContent =
        data.nearestDays + " Days";

    progressElement.textContent =
        data.progress + "%";

    progressBar.style.width =
        data.progress + "%";

}


/* -----------------------------
   Render Goal List
----------------------------- */

function renderGoals(){

    const goals = getGoals();

    goalContainer.innerHTML = "";

    if(goals.length===0){

        goalContainer.innerHTML =

        `<div class="empty">

            No goals added yet.

        </div>`;

        return;

    }

    goals.sort((a,b)=>{

        return getGoalTarget(a)
            -
        getGoalTarget(b);

    });

    goals.forEach(goal=>{

        const card =
        document.createElement("div");

        card.className =
        "goal-card fade-in";

        const status =
        goal.completed ?

        "Completed"

        :

        "Active";

        const badge =
        goal.completed ?

        "completed-status"

        :

        "active-status";

        card.innerHTML =

        `

        <h3>${goal.title}</h3>

        <p>

        ${goal.description}

        </p>

        <p>

        📂 ${goal.category}

        </p>

        <p>

        ⏳ ${getCountdownText(goal)}

        </p>

        <p>

        📈 Progress :
        ${getGoalProgress(goal)}%

        </p>

        <div class="progress">

            <div
            class="progress-bar"

            style="width:
            ${getGoalProgress(goal)}%;
            ">

            </div>

        </div>

        <span
        class="goal-status ${badge}">

        ${status}

        </span>

        `;

        goalContainer.appendChild(card);

    });

}


/* -----------------------------
   Refresh Dashboard
----------------------------- */

function refreshDashboard(){

    loadDashboard();

    renderGoals();

}


/* -----------------------------
   Page Loaded
----------------------------- */

document.addEventListener(

"DOMContentLoaded",

function(){

    refreshDashboard();

}

);
/* ==========================================
   Goal Tracker - dashboard.js (Part 4B)
   Live Updates & Dashboard Utilities
========================================== */

/* -----------------------------
   Update Countdown Timers
----------------------------- */

function updateCountdowns() {

    const cards = document.querySelectorAll(".goal-card");

    const goals = getGoals().sort((a, b) => {

        return getGoalTarget(a) - getGoalTarget(b);

    });

    cards.forEach((card, index) => {

        if (!goals[index]) return;

        const p = card.querySelectorAll("p");

        if (p.length >= 3) {

            p[2].innerHTML =
                "⏳ " + getCountdownText(goals[index]);

        }

    });

}

/* -----------------------------
   Auto Refresh Every Second
----------------------------- */

setInterval(function () {

    updateCountdowns();

}, 1000);

/* -----------------------------
   Refresh Dashboard Every Minute
----------------------------- */

setInterval(function () {

    refreshDashboard();

}, 60000);

/* -----------------------------
   Refresh When Tab Becomes Active
----------------------------- */

document.addEventListener("visibilitychange", function () {

    if (!document.hidden) {

        refreshDashboard();

    }

});

/* -----------------------------
   Goal Completed Animation
----------------------------- */

function animateProgress() {

    const bars = document.querySelectorAll(".progress-bar");

    bars.forEach(bar => {

        const width = bar.style.width;

        bar.style.width = "0%";

        setTimeout(() => {

            bar.style.width = width;

        }, 200);

    });

}

/* -----------------------------
   Welcome Greeting
----------------------------- */

function updateGreeting() {

    const title = document.querySelector(".welcome h2");

    if (!title) return;

    const hour = new Date().getHours();

    let text = "Welcome 👋";

    if (hour < 12) {

        text = "Good Morning ☀️";

    } else if (hour < 17) {

        text = "Good Afternoon 🌤";

    } else {

        text = "Good Evening 🌙";

    }

    title.textContent = text;

}

/* -----------------------------
   Dark Mode
----------------------------- */

function loadTheme() {

    const theme = localStorage.getItem("theme");

    if (theme === "dark") {

        document.body.classList.add("dark");

    }

}

function toggleTheme() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

    } else {

        localStorage.setItem("theme", "light");

    }

}

/* -----------------------------
   Auto Complete Expired Goals
----------------------------- */

function checkExpiredGoals() {

    const expired = getExpiredGoals();

    expired.forEach(goal => {

        if (!goal.completed) {

            console.log(
                goal.title + " target date reached."
            );

        }

    });

}

/* -----------------------------
   Dashboard Initialization
----------------------------- */

function initializeDashboard() {

    loadTheme();

    updateGreeting();

    refreshDashboard();

    animateProgress();

    checkExpiredGoals();

}

document.addEventListener(

    "DOMContentLoaded",

    initializeDashboard

);
