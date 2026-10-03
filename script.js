// ===============================
// GET HTML ELEMENTS
// ===============================

const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const dateInput = document.getElementById("dateInput");

const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");

const searchInput = document.getElementById("searchInput");

const allBtn = document.getElementById("allBtn");
const pendingBtn = document.getElementById("pendingBtn");
const completedBtn = document.getElementById("completedBtn");

const themeBtn = document.getElementById("themeBtn");


// ===============================
// LOAD SAVED DATA
// ===============================

let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

let currentFilter = "all";


// ===============================
// LOAD SAVED THEME
// ===============================

let darkMode =
    localStorage.getItem("darkMode") === "true";

if (darkMode) {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
}


// ===============================
// SAVE TASKS
// ===============================

function saveTasks() {

    localStorage.setItem(
        "studyTasks",
        JSON.stringify(tasks)
    );

}


// ===============================
// ADD TASK
// ===============================

addTaskBtn.addEventListener("click", function () {

    const taskName = taskInput.value.trim();

    const subject = subjectInput.value.trim();

    const date = dateInput.value;


    if (
        taskName === "" ||
        subject === "" ||
        date === ""
    ) {

        alert("Please fill all fields!");

        return;
    }


    const task = {

        id: Date.now(),

        name: taskName,

        subject: subject,

        date: date,

        completed: false

    };


    tasks.push(task);

    saveTasks();


    taskInput.value = "";

    subjectInput.value = "";

    dateInput.value = "";


    displayTasks();

});


// ===============================
// FILTER BUTTONS
// ===============================

allBtn.addEventListener("click", function () {

    currentFilter = "all";

    updateActiveButton();

    displayTasks();

});


pendingBtn.addEventListener("click", function () {

    currentFilter = "pending";

    updateActiveButton();

    displayTasks();

});


completedBtn.addEventListener("click", function () {

    currentFilter = "completed";

    updateActiveButton();

    displayTasks();

});


// ===============================
// ACTIVE FILTER
// ===============================

function updateActiveButton() {

    allBtn.classList.toggle(
        "active",
        currentFilter === "all"
    );

    pendingBtn.classList.toggle(
        "active",
        currentFilter === "pending"
    );

    completedBtn.classList.toggle(
        "active",
        currentFilter === "completed"
    );

}


// ===============================
// DISPLAY TASKS
// ===============================

function displayTasks() {

    taskList.innerHTML = "";


    const searchText =
        searchInput.value.toLowerCase().trim();


    const filteredTasks = tasks.filter(function (task) {


        const matchesSearch =

            task.name
                .toLowerCase()
                .includes(searchText)

            ||

            task.subject
                .toLowerCase()
                .includes(searchText);


        const matchesFilter =

            currentFilter === "all"

            ||

            (
                currentFilter === "pending"
                &&
                !task.completed
            )

            ||

            (
                currentFilter === "completed"
                &&
                task.completed
            );


        return matchesSearch && matchesFilter;

    });


    if (filteredTasks.length === 0) {

        const message = document.createElement("p");

        message.style.textAlign = "center";

        message.style.color =
            darkMode ? "#cbd5e1" : "#777";


        message.textContent =
            tasks.length === 0
                ? "No tasks yet. Add your first study task! 📚"
                : "No matching tasks found 📚";


        taskList.appendChild(message);

        updateProgress();

        return;
    }


    filteredTasks.forEach(function (task) {


        const taskElement =
            document.createElement("div");


        taskElement.className = "task";


        if (task.completed) {

            taskElement.classList.add("completed");

        }


        const info =
            document.createElement("div");


        info.className = "task-info";


        const title =
            document.createElement("h3");


        title.textContent = task.name;


        const subject =
            document.createElement("p");


        subject.textContent =
            "📚 Subject: " + task.subject;


        const date =
            document.createElement("p");


        date.textContent =
            "📅 Date: " + task.date;


        info.append(
            title,
            subject,
            date
        );


        const buttons =
            document.createElement("div");


        buttons.className = "task-buttons";


        const completeButton =
            document.createElement("button");


        completeButton.className =
            "complete-btn";


        completeButton.textContent =
            task.completed
                ? "↩️ Undo"
                : "✅ Done";


        completeButton.addEventListener(
            "click",
            function () {

                completeTask(task.id);

            }
        );


        const deleteButton =
            document.createElement("button");


        deleteButton.className =
            "delete-btn";


        deleteButton.textContent =
            "🗑️ Delete";


        deleteButton.addEventListener(
            "click",
            function () {

                deleteTask(task.id);

            }
        );


        buttons.append(
            completeButton,
            deleteButton
        );


        taskElement.append(
            info,
            buttons
        );


        taskList.appendChild(
            taskElement
        );

    });


    updateProgress();

}


// ===============================
// COMPLETE / UNDO
// ===============================

function completeTask(id) {

    tasks.forEach(function (task) {

        if (task.id === id) {

            task.completed =
                !task.completed;

        }

    });


    saveTasks();

    displayTasks();

}


// ===============================
// DELETE TASK
// ===============================

function deleteTask(id) {

    tasks = tasks.filter(function (task) {

        return task.id !== id;

    });


    saveTasks();

    displayTasks();

}


// ===============================
// UPDATE PROGRESS
// ===============================

function updateProgress() {

    if (tasks.length === 0) {

        progress.style.width = "0%";

        progressText.textContent =
            "0% Completed";

        return;
    }


    const completedCount =
        tasks.filter(function (task) {

            return task.completed;

        }).length;


    const percentage =
        Math.round(
            (completedCount / tasks.length) * 100
        );


    progress.style.width =
        percentage + "%";


    progressText.textContent =
        percentage + "% Completed";

}


// ===============================
// SEARCH
// ===============================

searchInput.addEventListener(
    "input",
    displayTasks
);


// ===============================
// DARK MODE
// ===============================

themeBtn.addEventListener(
    "click",
    function () {

        darkMode =
            !darkMode;


        document.body.classList.toggle(
            "dark",
            darkMode
        );


        themeBtn.textContent =
            darkMode
                ? "☀️"
                : "🌙";


        localStorage.setItem(
            "darkMode",
            darkMode
        );


        displayTasks();

    }
);


// ===============================
// INITIAL DISPLAY
// ===============================

updateActiveButton();

displayTasks();