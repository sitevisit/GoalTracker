/* ==========================================
   Goal Tracker - stats.js
========================================== */

/* Elements */

const totalGoalsEl=document.getElementById("totalGoals");
const activeGoalsEl=document.getElementById("activeGoals");
const completedGoalsEl=document.getElementById("completedGoals");
const expiredGoalsEl=document.getElementById("expiredGoals");
const streakEl=document.getElementById("currentStreak");
const progressEl=document.getElementById("overallProgress");
const successEl=document.getElementById("successRate");
const longestGoalEl=document.getElementById("longestGoal");
const shortestGoalEl=document.getElementById("shortestGoal");
const statsTable=document.getElementById("statsTable");

/* -------------------------
   Load Statistics
------------------------- */

function loadStatistics(){

    const stats=getStatistics();

    totalGoalsEl.textContent=stats.total;

    activeGoalsEl.textContent=stats.active;

    completedGoalsEl.textContent=stats.completed;

    expiredGoalsEl.textContent=stats.expired;

    streakEl.textContent=stats.streak+" Days";

    progressEl.textContent=stats.progress+"%";

    successEl.textContent=stats.successRate+"%";

    const longest=getLongestGoal();

    const shortest=getShortestGoal();

    longestGoalEl.textContent=
        longest ? longest.title : "No Data";

    shortestGoalEl.textContent=
        shortest ? shortest.title : "No Data";

}

/* -------------------------
   Goal Summary Table
------------------------- */

function loadTable(){

    const goals=getGoals();

    statsTable.innerHTML="";

    if(goals.length===0){

        statsTable.innerHTML=`

        <tr>

        <td colspan="4"
        style="text-align:center;padding:20px;">

        No goals available.

        </td>

        </tr>

        `;

        return;

    }

    goals.sort((a,b)=>{

        return getGoalTarget(a)-getGoalTarget(b);

    });

    goals.forEach(goal=>{

        const row=document.createElement("tr");

        row.innerHTML=`

        <td>${goal.title}</td>

        <td>

        ${goal.completed
            ? "✅ Completed"
            : "🟢 Active"}

        </td>

        <td>

        ${getGoalProgress(goal)}%

        </td>

        <td>

        ${goal.completed
            ? "-"
            : getDaysLeft(goal)+" Days"}

        </td>

        `;

        statsTable.appendChild(row);

    });

}

/* -------------------------
   Refresh
------------------------- */

function refreshStatistics(){

    loadStatistics();

    loadTable();

}

/* -------------------------
   Auto Refresh
------------------------- */

setInterval(function(){

    refreshStatistics();

},60000);

/* -------------------------
   Refresh when tab returns
------------------------- */

document.addEventListener(

"visibilitychange",

function(){

    if(!document.hidden){

        refreshStatistics();

    }

});

/* -------------------------
   Page Loaded
------------------------- */

document.addEventListener(

"DOMContentLoaded",

function(){

    refreshStatistics();

});
