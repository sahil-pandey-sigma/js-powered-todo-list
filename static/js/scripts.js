const messageBox = document.getElementById("message-box");
const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById("todo-list");

// fetch the initial list of tasks from the server when the page loads
function loadTasks() {
  fetch("/todos")
    .then((response) => response.json())
    .then((tasks) => {
      tasks.forEach((task) => {
        const listItem = createTaskElement(task);
        todoList.appendChild(listItem);
      });
    })
    .catch((error) => console.error("Error loading tasks: ", error));
}
// the above function fetch the todo array from the backend server, then .then (.then handles promise) converts teh response in json file, then .then takes all the tasks and iterate over them using forEach ethod , creates listItem (li) and then append it in to the todoList

//  create the list item element for the task

function createTaskElement(task) {
  const listItem = document.createElement("li");
  listItem.className = "flex items-center justify-between";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.addEventListener("change", () => toggleComplete(task.id, checkbox));

  // task data
  const taskSpan = document.createElement("span");
  taskSpan.textContent = task.text;

  // creation of delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", () => deleteTask(task.id, listItem));

  // grouping left container with delete button
  const leftContainer = document.createElement("div");
  leftContainer.appendChild(checkbox);
  leftContainer.appendChild(taskSpan);

  // Grouping left container with delete button
  listItem.appendChild(leftContainer);
  listItem.appendChild(deleteButton);

  return listItem;
}
// Adding new task

function addTask() {
  const taskText = todoInput.value.trim();
  if (taskText === "") {
    showMessage("Please enter some task!");
    return;
  }
  hideMessage();

  const newTask = {
    id: Date.now(),
    text: taskText,
  };
  fetch("/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "added") {
        const listItem = createTaskElement({
          id: data.id,
          text: taskText,
          completed: false,
        });
        todoList.appendChild(listItem);
      }
    })
    .catch((error) => {
      console.error("Error adding task: ", error);
    });
  todoInput.value = "";
}
// Delete task from the server side

function deleteTask(taskId, listItem) {
  fetch("/todos", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: taskId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "deleted") {
        listItem.remove();
      }
    })
    .catch((error) => {
      console.error("Error deleting task:", error);
    });
}

// toggle task completion on the server
function toggleComplete(taskId, checkbox) {
  fetch("/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: taskId,
      completed: checkbox.checked,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (checkbox.checked) {
        checkbox.closest("li").classList.add("completed");
      } else {
        checkbox.closest("li").classList.remove("completed");
      }
    })
    .catch((error) => {
      console.error("Error updating task completion: ", error);
    });
}

// message handling
function hideMessage() {
  messageBox.style.display = "none";
  messageBox.textContent = "";
}

// function showmessage

function showMessage(message) {
  messageBox.textContent = message;
  messageBox.style.display = "block";
}

// user interaction
addButton.addEventListener("click", addTask);
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

document.addEventListener("DOMContentLoaded", loadTasks);
