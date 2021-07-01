// new TaskManager.
const taskManager = new TaskManager();

// Loads tasks from storage.
taskManager.load();

//Selects the card container to be displayed.
// used before the render method is used.
const cardContainer = document.querySelector("#card-container");

// Renders the tasks on website.
taskManager.render();

// Select the task form for inputting new tasks.
const newTaskForm = document.querySelector("#newTaskForm");

// Select date field in form.
const newTaskDueDate = document.querySelector("#newTaskDueDate");



// Event listener for add task button.
const createTaskButton = document.querySelector("#createTaskButton");
createTaskButton.addEventListener("click", () => {
  taskFormMode = "add";
  taskModalTitle.innerHTML = "Create Task";
});

// Select New Task form inputs.
const newTaskNameInput = document.querySelector("#newTaskNameInput");
const newTaskAssignedTo = document.querySelector("#newTaskAssignedTo");
const newTaskDescription = document.querySelector("#newTaskDescription");
const newTaskStatus = document.querySelector("#newTaskStatus");
const formErrorMessage = document.querySelector("#formErrorMessage");

// Select task modal window.
let taskModal = document.getElementById("createTaskModal");

// Add event listener for form submission.
newTaskForm.addEventListener("submit", (event) => {
  
  // Store values of form inputs.
  const taskName = newTaskNameInput.value;
  const assignedTo = newTaskAssignedTo.value;
  const taskDescription = newTaskDescription.value;
  const status = newTaskStatus.value;
  const dueDate = newTaskDueDate.value;

  //  Whenever invalid input displays error message.
  if (!validFormFieldInput(taskName)) {
    errorMessage("task name");
  } else if (!validFormFieldInput(assignedTo)) {
    errorMessage("assignee");
  } else if (!validFormFieldInput(taskDescription)) {
    errorMessage("description");
  } else if (!validFormFieldInput(dueDate)) {
    errorMessage("date");
  } else {
    formErrorMessage.style.display = "none";
    // Sends validated values to TaskManager.
    if (taskFormMode === "add") {
      taskManager.addTask(
        taskName,
        taskDescription,
        assignedTo,
        dueDate,
        status
      );
    }

    if (taskFormMode === "edit") {
      taskManager.editTask(
        editedTask,
        taskName,
        taskDescription,
        assignedTo,
        dueDate,
        status
      );
      // Switches form mode to 'add'.
      taskFormMode = "add";
    
      taskModalTitle.innerHTML = "Create Task";
      // Closes form model when task is confirmed with no errors and save button is clicked.
      $("#createTaskModal").modal("toggle");
    }

    // Calls taskManager.save and saves the task to localStorage.
    taskManager.save();
    // taskManager render pushes tasks to the html.

    taskManager.render();

   // Resets the form.
    newTaskForm.reset();
  }
});

// Function for the error message.
function errorMessage(input) {
  formErrorMessage.innerHTML = `Invalid ${input}. Please correct.`;
  formErrorMessage.style.display = "block";
  formErrorMessage.style.color = "text-danger";
}
// Validates data, makes sure string or null is not empty.
function validFormFieldInput(data) {
  return data !== null && data !== "";
}

// limits the due date for future dates only.
newTaskDueDate.addEventListener("click", function () {
  let today = new Date();
  let dateToday = String(today.getDate()).padStart(2, "0");
  let monthToday = String(today.getMonth() + 1).padStart(2, "0"); 
  let yearToday = today.getFullYear();
  let minDate = `${yearToday}-${monthToday}-${dateToday}`;
  newTaskDueDate.min = minDate;
});

// task button for Done/edit/delete (eventlistner).
cardContainer.addEventListener("click", (event) => {
  const parentTask = event.target.parentElement.parentElement;
  const taskId = Number(parentTask.dataset.taskId);

  //When clicked marks as done
  if (event.target.classList.contains("done-button")) {
    const task = taskManager.getTaskById(taskId);
    task.status = "done";
  }
 // Open edit mode when edit-button clicked. (Edits don't work)
  if (event.target.classList.contains("edit-button")) {
  // Switches form to edit (Edits don't work)
    taskFormMode = "edit";
    // switches title model to edit (Edits don't work)
    taskModalTitle.innerHTML = "Edit Task";
    editedTask = taskManager.getTaskById(taskId);
   
    // Fill task form fields with stored values. fills form 
    newTaskNameInput.value = editedTask.taskName;
    newTaskDescription.value = editedTask.taskDescription;
    newTaskAssignedTo.value = editedTask.assignedTo;
    newTaskDueDate.value = editedTask.dueDate;
    newTaskStatus.value = editedTask.status;
  }

  // When the delte button is clicked it will delete the task
  if (event.target.classList.contains("delete-button")) {
    taskManager.deleteTask(taskId);
  }

  // Saves and then renders any changes
  taskManager.save();
  taskManager.render();
});