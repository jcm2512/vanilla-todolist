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

// Functions

// UPDATE LOCALSTORAGE VALUES
function updateLocalStorage(value){
  localStorage.setItem("todos", JSON.stringify(value));
}

// ADD TODO
function addTodo(event) {
  // Prevent form from submitting
  event.preventDefault();
  // Todo DIV
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  // Create LI
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  // ADD TO LOCAL STORAGE
  saveLocal(todoInput.value);
  // CHECK MARK BUTTON
  const completedButton = document.createElement("button");
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);
  // TRASH BUTTON
  const trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
  // APPEND TO LIST
  todoList.appendChild(todoDiv);
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
    updateLocalTodos(todo)
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
  todos.push({task: todo, completed: false});
  updateLocalStorage(todos);
}

function getTodos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  reload(todos)
}

function reload(todos){
  todos.forEach(function (listItem) {
    // Todo DIV
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    // Create LI
    const newTodo = document.createElement("li");
    newTodo.innerText = listItem.task;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    // UPDATE CLASSLIST
    if(listItem.completed){
      todoDiv.classList.add("completed")
    }

    // CHECK MARK BUTTON
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    // TRASH BUTTON
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    // APPEND TO LIST
    todoList.appendChild(todoDiv);
  });
}

function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const task = todo.childNodes[0].innerText;
 
  const results = todos.filter(obj => {
    return obj.task !== task
  })
  updateLocalStorage(results);
}

function updateLocalTodos(todo) {
  let todos = JSON.parse(localStorage.getItem("todos"));
  const task = todo.childNodes[0].innerText;
  let obj = todos.find(item => item.task == task);
  if (obj){obj.completed = !obj.completed}
  todos = sortLocalStorage(todos)
  updateLocalStorage(todos);
  todoList.innerHTML = ""
  reload(todos)
}

function sortLocalStorage(todos) {
  let complete = todos.filter(obj => obj.completed == true);
  let incomplete = todos.filter(obj => obj.completed == false);
  let result = incomplete.concat(complete)
  return result
}