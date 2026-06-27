
/* ==========================================
   Goal Tracker - settings.js
========================================== */

/* Elements */

const themeBtn = document.getElementById("themeBtn");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
const clearBtn = document.getElementById("clearBtn");

const summaryTotal = document.getElementById("summaryTotal");
const summaryCompleted = document.getElementById("summaryCompleted");
const summaryStreak = document.getElementById("summaryStreak");
const summaryProgress = document.getElementById("summaryProgress");

/* -------------------------
   Theme
------------------------- */

function loadTheme(){

    const theme = localStorage.getItem("theme");

    if(theme === "dark"){

        document.body.classList.add("dark");

    }

}

function toggleTheme(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

    }else{

        localStorage.setItem("theme","light");

    }

}

themeBtn.addEventListener("click",toggleTheme);

/* -------------------------
   Export
------------------------- */

exportBtn.addEventListener("click",function(){

    exportGoals();

});

/* -------------------------
   Import
------------------------- */

importFile.addEventListener("change",function(){

    if(this.files.length>0){

        importGoals(this.files[0]);

    }

});

/* -------------------------
   Clear All
------------------------- */

clearBtn.addEventListener("click",function(){

    clearAllGoals();

});

/* -------------------------
   Summary
------------------------- */

function loadSummary(){

    const stats = getStatistics();

    summaryTotal.textContent = stats.total;

    summaryCompleted.textContent = stats.completed;

    summaryStreak.textContent =
        stats.streak + " Days";

    summaryProgress.textContent =
        stats.progress + "%";

}

/* -------------------------
   Refresh
------------------------- */

function refreshSettings(){

    loadTheme();

    loadSummary();

}

/* -------------------------
   Auto Refresh
------------------------- */

setInterval(function(){

    loadSummary();

},60000);

/* -------------------------
   Refresh When Tab Returns
------------------------- */

document.addEventListener(

"visibilitychange",

function(){

    if(!document.hidden){

        loadSummary();

    }

});

/* -------------------------
   Page Loaded
------------------------- */

document.addEventListener(

"DOMContentLoaded",

function(){

    refreshSettings();

});
