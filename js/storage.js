/* ==========================================
   Goal Tracker - storage.js (Part 3A)
   Handles Local Storage and Goal Management
========================================== */

const STORAGE_KEY = "goalTrackerGoals";

/* ------------------------------
   Load Goals
------------------------------ */
function loadGoals() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return [];
    }

    try {
        return JSON.parse(data);
    } catch (e) {
        console.error("Unable to load goals.", e);
        return [];
    }
}

/* ------------------------------
   Save Goals
------------------------------ */
function saveGoals(goals) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

/* ------------------------------
   Get All Goals
------------------------------ */
function getGoals() {
    return loadGoals();
}

/* ------------------------------
   Generate Unique ID
------------------------------ */
function generateGoalId() {
    return Date.now() + Math.floor(Math.random() * 10000);
}

/* ------------------------------
   Add Goal
------------------------------ */
function addGoal(goalData) {

    const goals = getGoals();

    const goal = {
        id: generateGoalId(),

        title: goalData.title || "",

        description: goalData.description || "",

        category: goalData.category || "General",

        priority: goalData.priority || "Medium",

        startDate: goalData.startDate,

        startTime: goalData.startTime,

        targetDate: goalData.targetDate,

        targetTime: goalData.targetTime,

        createdAt: new Date().toISOString(),

        completed: false,

        completedAt: null,

        notes: goalData.notes || ""
    };

    goals.push(goal);

    saveGoals(goals);

    return goal;
}

/* ------------------------------
   Find Goal
------------------------------ */
function findGoal(id) {

    const goals = getGoals();

    return goals.find(goal => goal.id == id);
}

/* ------------------------------
   Edit Goal
------------------------------ */
function updateGoal(id, updatedData) {

    const goals = getGoals();

    const index = goals.findIndex(goal => goal.id == id);

    if (index === -1) return false;

    goals[index] = {
        ...goals[index],
        ...updatedData
    };

    saveGoals(goals);

    return true;
}

/* ------------------------------
   Delete Goal
------------------------------ */
function deleteGoal(id) {

    let goals = getGoals();

    goals = goals.filter(goal => goal.id != id);

    saveGoals(goals);
}

/* ------------------------------
   Mark Completed
------------------------------ */
function completeGoal(id) {

    const goals = getGoals();

    const goal = goals.find(g => g.id == id);

    if (!goal) return;

    goal.completed = true;

    goal.completedAt = new Date().toISOString();

    saveGoals(goals);
}

/* ------------------------------
   Mark Active Again
------------------------------ */
function uncompleteGoal(id) {

    const goals = getGoals();

    const goal = goals.find(g => g.id == id);

    if (!goal) return;

    goal.completed = false;

    goal.completedAt = null;

    saveGoals(goals);
}

/* ------------------------------
   Active Goals
------------------------------ */
function getActiveGoals() {

    return getGoals().filter(goal => !goal.completed);

}

/* ------------------------------
   Completed Goals
------------------------------ */
function getCompletedGoals() {

    return getGoals().filter(goal => goal.completed);

}

/* ------------------------------
   Total Goals
------------------------------ */
function totalGoals() {

    return getGoals().length;

      }
/* ==========================================
   Goal Tracker - storage.js (Part 3B-1)
   Countdown, Progress & Nearest Goal
========================================== */

/* ------------------------------
   Convert Goal DateTime
------------------------------ */
function getGoalTarget(goal){

    return new Date(`${goal.targetDate}T${goal.targetTime}`);

}

function getGoalStart(goal){

    return new Date(`${goal.startDate}T${goal.startTime}`);

}

/* ------------------------------
   Milliseconds Remaining
------------------------------ */
function millisecondsLeft(goal){

    return getGoalTarget(goal)-new Date();

}

/* ------------------------------
   Days Left
------------------------------ */
function getDaysLeft(goal){

    const ms=millisecondsLeft(goal);

    if(ms<=0) return 0;

    return Math.ceil(ms/(1000*60*60*24));

}

/* ------------------------------
   Hours Left
------------------------------ */
function getHoursLeft(goal){

    const ms=millisecondsLeft(goal);

    if(ms<=0) return 0;

    return Math.floor(ms/(1000*60*60));

}

/* ------------------------------
   Minutes Left
------------------------------ */
function getMinutesLeft(goal){

    const ms=millisecondsLeft(goal);

    if(ms<=0) return 0;

    return Math.floor(ms/(1000*60));

}

/* ------------------------------
   Countdown Object
------------------------------ */
function getCountdown(goal){

    let diff=millisecondsLeft(goal);

    if(diff<=0){

        return{

            days:0,

            hours:0,

            minutes:0,

            seconds:0

        };

    }

    const days=Math.floor(diff/86400000);

    diff-=days*86400000;

    const hours=Math.floor(diff/3600000);

    diff-=hours*3600000;

    const minutes=Math.floor(diff/60000);

    diff-=minutes*60000;

    const seconds=Math.floor(diff/1000);

    return{

        days,

        hours,

        minutes,

        seconds

    };

}

/* ------------------------------
   Countdown Text
------------------------------ */
function getCountdownText(goal){

    const c=getCountdown(goal);

    return `${c.days}d ${c.hours}h ${c.minutes}m ${c.seconds}s`;

}

/* ------------------------------
   Goal Duration
------------------------------ */
function getGoalDuration(goal){

    return getGoalTarget(goal)-getGoalStart(goal);

}

/* ------------------------------
   Elapsed Time
------------------------------ */
function getElapsedTime(goal){

    return new Date()-getGoalStart(goal);

}

/* ------------------------------
   Progress %
------------------------------ */
function getGoalProgress(goal){

    if(goal.completed)

        return 100;

    const duration=getGoalDuration(goal);

    const elapsed=getElapsedTime(goal);

    if(duration<=0)

        return 0;

    let percent=(elapsed/duration)*100;

    if(percent<0)

        percent=0;

    if(percent>100)

        percent=100;

    return Math.round(percent);

}

/* ------------------------------
   Overall Progress
------------------------------ */
function getOverallProgress(){

    const goals=getGoals();

    if(goals.length===0)

        return 0;

    let total=0;

    goals.forEach(goal=>{

        total+=getGoalProgress(goal);

    });

    return Math.round(total/goals.length);

}

/* ------------------------------
   Nearest Goal
------------------------------ */
function getNearestGoal(){

    const active=getActiveGoals();

    if(active.length===0)

        return null;

    active.sort((a,b)=>{

        return getGoalTarget(a)-getGoalTarget(b);

    });

    return active[0];

}

/* ------------------------------
   Nearest Goal Days
------------------------------ */
function nearestGoalDays(){

    const goal=getNearestGoal();

    if(!goal)

        return 0;

    return getDaysLeft(goal);

}

/* ------------------------------
   Expired Goals
------------------------------ */
function getExpiredGoals(){

    return getActiveGoals().filter(goal=>{

        return millisecondsLeft(goal)<=0;

    });

}

/* ------------------------------
   Running Goals
------------------------------ */
function getRunningGoals(){

    return getActiveGoals().filter(goal=>{

        return millisecondsLeft(goal)>0;

    });

}
/* ==========================================
   Goal Tracker - storage.js (Part 3B-2)
   Streak, Statistics, Export & Import
========================================== */

/* ------------------------------
   Current Streak
------------------------------ */

function getCurrentStreak(){

    const goals = getCompletedGoals();

    if(goals.length===0) return 0;

    const completedDays = new Set();

    goals.forEach(goal=>{

        if(goal.completedAt){

            const d = new Date(goal.completedAt);

            completedDays.add(d.toDateString());

        }

    });

    let streak = 0;

    let today = new Date();

    while(true){

        const key = today.toDateString();

        if(completedDays.has(key)){

            streak++;

            today.setDate(today.getDate()-1);

        }else{

            break;

        }

    }

    return streak;

}

/* ------------------------------
   Statistics
------------------------------ */

function getStatistics(){

    const total = totalGoals();

    const active = getActiveGoals().length;

    const completed = getCompletedGoals().length;

    const expired = getExpiredGoals().length;

    const progress = getOverallProgress();

    const streak = getCurrentStreak();

    const successRate =
        total===0 ? 0 :
        Math.round((completed/total)*100);

    return{

        total,
        active,
        completed,
        expired,
        progress,
        streak,
        successRate

    };

}

/* ------------------------------
   Longest Goal
------------------------------ */

function getLongestGoal(){

    const goals=getGoals();

    if(goals.length===0) return null;

    return goals.reduce((a,b)=>{

        return getGoalDuration(a)>
               getGoalDuration(b)
               ? a : b;

    });

}

/* ------------------------------
   Shortest Goal
------------------------------ */

function getShortestGoal(){

    const goals=getGoals();

    if(goals.length===0) return null;

    return goals.reduce((a,b)=>{

        return getGoalDuration(a)<
               getGoalDuration(b)
               ? a : b;

    });

}

/* ------------------------------
   Export JSON
------------------------------ */

function exportGoals(){

    const data=JSON.stringify(getGoals(),null,2);

    const blob=new Blob(
        [data],
        {type:"application/json"}
    );

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download="goal-tracker-backup.json";

    a.click();

    URL.revokeObjectURL(url);

}

/* ------------------------------
   Import JSON
------------------------------ */

function importGoals(file){

    const reader=new FileReader();

    reader.onload=function(e){

        try{

            const goals=
                JSON.parse(e.target.result);

            if(Array.isArray(goals)){

                saveGoals(goals);

                alert("Goals imported successfully.");

                location.reload();

            }else{

                alert("Invalid backup file.");

            }

        }catch{

            alert("Unable to import file.");

        }

    };

    reader.readAsText(file);

}

/* ------------------------------
   Clear All Data
------------------------------ */

function clearAllGoals(){

    if(confirm("Delete all goals?")){

        localStorage.removeItem(STORAGE_KEY);

        location.reload();

    }

}

/* ------------------------------
   Search Goals
------------------------------ */

function searchGoals(keyword){

    keyword=keyword.toLowerCase();

    return getGoals().filter(goal=>{

        return goal.title
            .toLowerCase()
            .includes(keyword)

        ||

        goal.description
            .toLowerCase()
            .includes(keyword)

        ||

        goal.category
            .toLowerCase()
            .includes(keyword);

    });

}

/* ------------------------------
   Filter Goals
------------------------------ */

function filterGoals(status){

    switch(status){

        case "active":

            return getActiveGoals();

        case "completed":

            return getCompletedGoals();

        case "expired":

            return getExpiredGoals();

        default:

            return getGoals();

    }

}

/* ------------------------------
   Dashboard Data
------------------------------ */

function dashboardData(){

    return{

        total:totalGoals(),

        active:getActiveGoals().length,

        completed:getCompletedGoals().length,

        streak:getCurrentStreak(),

        progress:getOverallProgress(),

        nearest:getNearestGoal(),

        nearestDays:nearestGoalDays()

    };

}
