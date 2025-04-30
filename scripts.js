const messageBox = document.getElementById("message-box");
const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById("todo-list");

function addTask() {
  const taskText = todoInput.value.trim();
  if (taskText === "") {
    showMessage("Please enter task!");
    return;
  }
  hideMessage(); // clear any old messages

  //   create new li item with checkbox text and delete button
  const listItem = document.createElement("li");
  listItem.className = "flex items-center justify-between";
  //creation of checkbox for completion
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", toggleComplete);
  //   task data
  const taskSpan = document.createElement("span");
  taskSpan.textContent = taskText;
  // creation of delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", deleteTask);

  //   group checkbox and task data
  const leftContainer = document.createElement("div");
  leftContainer.appendChild(checkbox);
  leftContainer.appendChild(taskSpan);
  //   grouping leftcontainer with deleteButton
  listItem.appendChild(leftContainer);
  listItem.appendChild(deleteButton);
  //   putting list item into todo list
  todoList.appendChild(listItem);
  todoInput.value = ""; // clear the input value after adding
}

function deleteTask(e) {
  const listItem = e.target.closest("li");
  listItem.remove();
}

// message handling

function hideMessage() {
  messageBox.style.display = "none";
  messageBox.textContent = "";
}

function showMessage(message) {
  messageBox.textContent = message;
  messageBox.style.display = "block";
}

// toggle complete --> strikes out completed task
function toggleComplete(e) {
  const listItem = e.target.closest("li");
  const taskSpan = listItem.querySelector("span");
  listItem.classList.toggle("completed");

  if (listItem.classList.contains("completed")) {
    taskSpan.classList.add("line-through", "text-gray-400");
  } else {
    taskSpan.classList.remove("line-through", "text-gray-400");
  }
}

//user interaction

addButton.addEventListener("click", addTask);
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});
