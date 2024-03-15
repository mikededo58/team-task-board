let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

function generateTaskId() {
  //generating a unuiue task id to attach to object
  if (nextId === null) {
    // if no id exist, add ID going up by one for each task mae
    nextId = 1;
  } else {
    nextId++;
  }

  localStorage.setItem("nextId", JSON.stringify(nextId)); // putting tasl from "nextid" in local storage with JOSON to store it as a string
  return nextId;
}

function createTaskCard(task) {
  // creating task to make a task card using bootstrap
  const taskCard = $("<div>") //assging a dom element
    .addClass("card w-75 task-card draggable my-3") // adding properties to the card
    .attr("data-task-id", task.id); //assigning attribute to id within the task object in the id parameter
  const cardHeader = $("<div>").addClass("card-header h4").text(task.title); // adding element to class to the cardheader
  const cardBody = $("<div>").addClass("card-body");
  //adding element to class to the cardheader
  const cardDescription = $("<p>").addClass("card-text").text(task.description);
  //adding element to class to the cardheader
  const cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
  //adding element to class to the cardheader
  const cardDeleteBtn = $("<button>") // creating the delte card funtion on the button
    .addClass("btn btn-danger delete")
    .text("Delete")
    .attr("data-task-id", task.id);
  cardDeleteBtn.on("click", handleDeleteTask);

  if (task.dueDate && task.status !== "done") {
    const now = dayjs(); // setting up the due date that will appear on the card
    const taskDueDate = dayjs(task.dueDate, "DD/MM/YYYY");
    if (now.isSame(taskDueDate, "day")) {
      taskCard.addClass("bg-warning text-white"); // asssining different colors to the background on the task card based on the due date
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass("bg-danger text-white");
      cardDeleteBtn.addClass("border-light");
    }
  }

  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn); // appending elements
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}

function renderTaskList() {
  // getting the task and rendering it to the board
  if (!taskList) {
    taskList = []; //definig the object
  }

  const todoList = $("#todo-cards"); // assinging a var to an element in the todo lane
  todoList.empty();

  const inProgressList = $("#in-progress-cards"); // assining a var to the element in the inprogress lane
  inProgressList.empty();

  const doneList = $("#done-cards"); // assining var to the element to the done lane
  doneList.empty();

  for (let task of taskList) {
    // creating element to appened to the proper lane based on status
    if (task.status === "to-do") {
      todoList.append(createTaskCard(task));
    } else if (task.status === "in-progress") {
      inProgressList.append(createTaskCard(task));
    } else if (task.status === "done") {
      doneList.append(createTaskCard(task));
    }
  }

  $(".draggable").draggable({
    // making the crad draggable using JQERY function
    opacity: 0.7,
    zIndex: 100,

    helper: function (e) {
      const original = $(e.target).hasClass("ui-draggable")
        ? $(e.target)
        : $(e.target).closest(".ui-draggable");
      return original.clone().css({
        maxWidth: original.outerWidth(),
      });
    },
  });
}

function handleAddTask(event) {
  // function to add the task once the todo button is clicked
  event.preventDefault();

  const task = {
    // creating the keys of an object in the array
    id: generateTaskId(),
    title: $("#taskTitle").val(),
    description: $("#taskDescription").val(),
    dueDate: $("#taskDueDate").val(),
    status: "to-do",
  };

  taskList.push(task); // pusing the input from the card into local storage
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
  $("#taskTitle").val("");
  $("#taskDescription").val("");
  $("#taskDueDate").val("");
}

function handleDeleteTask(event) {
  // this is the function to delete a task from the board
  event.preventDefault();

  const taskId = $(this).attr("data-task-id");

  taskList = taskList.filter((task) => task.id !== parseInt(taskId)); // making sure the task IF is number
  localStorage.setItem("tasks", JSON.stringify(taskList)); // communicating with local storage to store as a string for JSON
  renderTaskList();
}

function handleDrop(event, ui) {
  // creating a function to drop item into the proper lane
  const taskId = ui.draggable[0].dataset.taskId; // calling the draggabile function made above
  const newStatus = event.target.id; // assinging a new var when the 'event' happenes

  for (let task of taskList) {
    // updating the new task
    if (task.id === parseInt(taskId)) {
      task.status = newStatus;
    }
  }

  localStorage.setItem("tasks", JSON.stringify(taskList)); //updating moved task in local storage
  renderTaskList();
}

$(document).ready(function () {
  // function calling local storage to create the card once it submited
  renderTaskList();

  $("#taskForm").on("submit", handleAddTask);

  $(".lane").droppable({
    // calling the jquery draggable function
    accept: ".draggable",
    drop: handleDrop,
  });

  $("#taskDueDate").datepicker({
    // using the jquery date selector function
    changeMonth: true,
    changeYear: true,
  });
});
