// Function that turns task data into html
const createTaskHtml = (
    id,
    taskName,
    taskDescription,
    assignTo,
    dueDate,
    status
  ) =>
    // this is how the task input will be displayed in the cardTemplate.innterhtml
    `<div class="card shadow p-2 mb-4 bg-white m-2" style="width: 18rem" data-task-id=${id}>
            <div class="card-body" >
              <h5 class="card-title">${taskName}</h5>
              <p class="card-text">
                ${taskDescription}
              </p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="assigned-to-label list-group-item">
               Assigned to:
                <span class="assignee">${assignTo}</span>
              </li>
              <li class="list-group-item due-date-label">
                Due date:
                <span class="due-date">${dueDate}</span>
              </li>
              <li class="list-group-item status-label">
                Status:
                <span class="status">${status}</span>
              </li>
            </ul>
         <div class="card-body">
       
        <button class="btn btn-success done-button ${
          status === "DONE" ? "invisible" : "visible"
        }">Done</button>
              <button type="button" class="btn btn-danger delete-button ">Delete</button>
              <button type="button" class="btn btn-primary edit-button" data-toggle="modal" data-target="#createTaskModal"id="editTaskButton">Edit</button>
            </div>
          </div>
        </div>`;
  
  // TaskManager claas that manages the tasks
  class TaskManager {
    constructor(currentId = "0") {
      this._tasks = [];
      this._currentId = currentId;
    }
    //This is a method to add tasks to the task manager
    addTask(taskName, taskDescription, assignedTo, dueDate, status = "TO DO") {
      const newTask = {
        id: this._currentId++,
        taskName: taskName,
        taskDescription: taskDescription,
        assignedTo: assignedTo,
        dueDate: dueDate,
        status: status,
      };
      this._tasks.push(newTask);
    }
    // Deletes task from the task planner
    deleteTask(taskId) {
      const newTasks = [];
      {
        //gets the task in the loop, stores it in the variable
        for (let i = 0; i < this._tasks.length; i++) {
          let task = this._tasks[i];
           //checks if the task.id isn't equal to the taskid that is a parameter
          if (task.id !== taskId) {
            //if task.id isn't equal to the taskid it pushes the task int othe newtasks array
            newTasks.push(task);
          }
        }
         //Sets this tasks to new tasks
        this._tasks = newTasks;
      }
    }
    //a create method that gets task by the id
    getTaskById(taskId) {
      let foundTask;
  
      for (let i = 0; i < this._tasks.length; i++) {
        const task = this._tasks[i];
        if (taskId === task.id) {
          foundTask = task;
        }
      }
      return foundTask;
    }
  
    //render method to display tasks on the website
    render() {
      // variable that stores task to html
      const tasksHtmlList = [];
  
     // Loop over tasks to create html & store in array
      for (let i = 0; i < this._tasks.length; i++) {
       // Store the current task in a variable
        const newTask = this._tasks[i];
  
         // Create date variable to store formatted date
        const date = new Date(newTask.dueDate);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let formattedDate = `${day}/${month}/${year}`;
  
       // Create variable to store the html of current task
        const taskHtml = createTaskHtml(
          newTask.id,
          newTask.taskName,
          newTask.taskDescription,
          newTask.assignedTo,
          formattedDate,
          newTask.status
        );
        tasksHtmlList.push(taskHtml);
      }
      // Create a variable to join task to html string
      const tasksHtml = tasksHtmlList.join("\n");
      cardContainer.innerHTML = tasksHtml; //cardTemplate
    }
  
  // Method to save tasks to localStorage
    save() {
      let tasksJson = JSON.stringify(this._tasks);
     localStorage.setItem("tasks", tasksJson);
     let currentId = String(this._currentId);
    localStorage.setItem("currentId", currentId);
    }
     // Method to load saved tasks from localStorage
    load() {
      if (localStorage.getItem("tasks")) {
        const tasksJson = localStorage.getItem("tasks");
        this._tasks = JSON.parse(tasksJson);
      }
      if (localStorage.getItem("currentId")) {
        const currentId = localStorage.getItem("currentId"); 
        this._currentId = Number(currentId); 
      }
    }
  }
  
  // Module exports
  if (typeof module != "undefined") {
    module.exports = TaskManager;
  }