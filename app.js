// Globals
let todos = getLocalStorage("todos").items;
let id = getLocalStorage("todos").id;

// Selectors
const input = document.querySelector(".todo-input");
const addButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

// Event Listeners
document.addEventListener("DOMContentLoaded", load(todos));
addButton.addEventListener("click", addTodo);
todoList.addEventListener("click", itemAction);
filterOption.addEventListener("click", filterTodo);
filterOption.addEventListener("input", filterTodo); // For mobile

// Functions //

// Fix height to include menu controls
function appHeight() {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
}
window.addEventListener("resize", appHeight);
appHeight();

// ADD TODO
function addTodo(event) {
  // PREVENT DEFAULT FORM SUBMISSION
  event.preventDefault();

  // PREVENT EMPTY STRINGS
  if (!/\S/.test(input.value)) {
    return null;
  }

  // ADD TO LOCAL STORAGE
  todos.push({ task: input.value, completed: false, id: id });
  localStorage.setItem("todos", JSON.stringify(todos));

  // CREATE HTML ELEMENTS
  load(todos);

  // CLEAR INPUT
  input.value = "";
}

function getLocalStorage(data) {
  let array = [];
  let id = 1;
  const localdata = localStorage.getItem(data);
  if (localdata !== null && localdata !== "[]") {
    array = JSON.parse(localdata);
    id = array[array.length - 1].id + 1;
  }
  return { items: array, id: id };
}

function itemAction(event) {
  const item = event.target.parentElement;
  // DELETE
  if (event.target.classList[0] === "trash-btn") {
    item.classList.add("trash");
    removeLocalTodos(item);
  }
  // CHECK
  if (event.target.classList[0] === "complete-btn") {
    item.classList.toggle("completed");
    markCompleted(item);
  }
}

function filterTodo(event) {
  todoList.childNodes.forEach(function (todo) {
    switch (event.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}

function load(todos) {
  todos = getLocalStorage("todos").items;
  id = getLocalStorage("todos").id;
  // todos = sortLocalStorage(todos);

  todoList.innerHTML = "";
  todos.forEach(function (listItem) {
    // CREATE DIV
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.id = listItem.id;

    // CHECK MARK BUTTON
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="far fa-square"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    // TODO
    const newTodo = document.createElement("li");
    newTodo.innerText = listItem.task;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    // TRASH BUTTON
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-times"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    // APPEND TO LIST
    todoList.appendChild(todoDiv);

    // UPDATE CLASSLIST
    if (listItem.completed) {
      todoDiv.classList.add("completed");
      completedButton.innerHTML = '<i class="far fa-check-square"></i>';
    }

    // UI TRIGGERS
    let ui = new Hammer(todoDiv);
    ui.on("swipeleft", function () {
      markCompleted(todoDiv);
    });
    ui.on("swiperight", function () {
      removeLocalTodos(todoDiv);
    });
  });
}

function removeLocalTodos(todo) {

  todos = todos.filter((obj) => {
    return String(obj.id) !== todo.id;
  });

  todo.addEventListener("transitionend", function () {
    todo.remove();
    localStorage.setItem("todos", JSON.stringify(todos));
    load(todos);
  });
}

function markCompleted(todo) {
  let obj = todos.find((item) => item.id == todo.id);
  if (obj) {
    obj.completed = !obj.completed;
  }
  localStorage.setItem("todos", JSON.stringify(todos));
  load(todos);
}

function sortLocalStorage(todos) {
  let complete = todos.filter((obj) => obj.completed == true);
  let incomplete = todos.filter((obj) => obj.completed == false);
  let result = incomplete.concat(complete);
  return result;
}
