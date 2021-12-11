// Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

// Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);
filterOption.addEventListener("input", filterTodo); // For mobile

// Functions
function appHeight() {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
}
window.addEventListener("resize", appHeight);
appHeight();

// UPDATE LOCALSTORAGE VALUES
function updateLocalStorage(value) {
  localStorage.setItem("todos", JSON.stringify(value));
}

// ADD TODO
function addTodo(event) {
  // Prevent form from submitting
  event.preventDefault();

  // Prevent empty todos being added
  if (!/\S/.test(todoInput.value)) {
    return null;
  }

  // ADD TO LOCAL STORAGE
  saveLocal(todoInput.value);

  // Set Todo List
  getTodos();
  todoInput.value = "";
}

function deleteCheck(event) {
  const trigger = event.target;
  const todo = trigger.parentElement;
  // DELETE TODO
  if (trigger.classList[0] === "trash-btn") {
    // animation
    todo.classList.add("trash");
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }
  // CHECK MARK
  if (trigger.classList[0] === "complete-btn") {
    todo.classList.toggle("completed");
    updateLocalTodos(todo);
  }
}

function filterTodo(event) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
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

function saveLocal(todo) {
  // Check if data exists
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push({ task: todo, completed: false });
  updateLocalStorage(todos);
}

function getTodos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos = sortLocalStorage(todos);
  updateLocalStorage(todos);
  reload(todos);
}

function setList() {
  let list = [];
  const todos = localStorage.getItem("todos");
  if (todos !== null) {
    list = JSON.parse(todos);
  }
  return list;
}

function reload(todos) {
  todoList.innerHTML = "";
  todos.forEach(function (listItem) {
    function markComplete() {
      todoDiv.classList.add("completed");
      completedButton.innerHTML = '<i class="far fa-check-square"></i>';
    }
    // CREATE DIV
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

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
    let ui = new Hammer(todoDiv)
    ui.on("swipeleft", function(){updateLocalTodos(todoDiv)})
    ui.on("swiperight", function(){removeLocalTodos(todoDiv)})
  });
}

function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const task = todo.querySelector(".todo-item").innerText;

  const results = todos.filter((obj) => {
    return obj.task !== task;
  });
  updateLocalStorage(results);
  reload(results)
}

function updateLocalTodos(todo) {
  let todos = setList();
  const task = todo.querySelector(".todo-item").innerText;
  let obj = todos.find((item) => item.task == task);
  if (obj) {
    obj.completed = !obj.completed;
  }
  todos = sortLocalStorage(todos);
  updateLocalStorage(todos);

  reload(todos);
}

function sortLocalStorage(todos) {
  let complete = todos.filter((obj) => obj.completed == true);
  let incomplete = todos.filter((obj) => obj.completed == false);
  let result = incomplete.concat(complete);
  return result;
}
