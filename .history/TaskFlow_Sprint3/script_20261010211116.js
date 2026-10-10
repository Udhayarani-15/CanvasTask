
document.addEventListener("DOMContentLoaded", function () {
  // 1. Task class: represents one task
  class Task {
    constructor(id, name, description, assignedTo, dueDate, status) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.assignedTo = assignedTo;
      this.dueDate = dueDate;
      this.status = status;
    }
  }

  // 2. TaskManager class: manages the task array
  class TaskManager {
    constructor() {
      this.tasks = [
        new Task(
          1,
          "Design Login Page",
          "Create a responsive login page using Bootstrap.",
          "Udhaya",
          "2026-10-15",
          "TODO"
        ),
        new Task(
          2,
          "Build Dashboard",
          "Develop the main dashboard layout.",
          "Arun",
          "2026-10-16",
          "IN PROGRESS"
        ),
        new Task(
          3,
          "Create Database Schema",
          "Plan the tables and relationships.",
          "Priya",
          "2026-10-17",
          "REVIEW"
        ),
        new Task(
          4,
          "Test Registration Form",
          "Check form validation and error messages.",
          "Kavin",
          "2026-10-18",
          "DONE"
        ),
        new Task(
          5,
          "Write Project Documentation",
          "Document the features and project setup.",
          "Udhaya",
          "2026-10-20",
          "TODO"
        ),
      ];

      // Always generate a unique, incrementing ID
      this.nextId =
        Math.max(0, ...this.tasks.map((task) => task.id)) + 1;
    }

    // Add a new task to the array
    addTask(name, description, assignedTo, dueDate, status) {
      const task = new Task(
        this.nextId++,
        name,
        description,
        assignedTo,
        dueDate,
        status
      );

      this.tasks.push(task);
      return task;
    }

    // Find a task using its ID
    getTaskById(id) {
      return this.tasks.find((task) => task.id === id);
    }

    // Update a task using its ID
    updateTask(id, details) {
      const task = this.getTaskById(id);

      if (!task) return false;

      task.name = details.name;
      task.description = details.description;
      task.assignedTo = details.assignedTo;
      task.dueDate = details.dueDate;
      task.status = details.status;

      return true;
    }

    // Delete the task object from the array
    deleteTask(id) {
      const originalLength = this.tasks.length;

      this.tasks = this.tasks.filter((task) => task.id !== id);

      return this.tasks.length < originalLength;
    }

    // Return all tasks
    getAllTasks() {
      return this.tasks;
    }
  }

  // 3. Create the TaskManager object
  const taskManager = new TaskManager();

  // 4. Get HTML elements
  const taskForm = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");
  const taskIdInput = document.getElementById("taskId");
  const nameInput = document.getElementById("taskName");
  const descriptionInput = document.getElementById("description");
  const assignedToInput = document.getElementById("assignedTo");
  const dueDateInput = document.getElementById("dueDate");
  const statusInput = document.getElementById("status");

  const submitButton = document.getElementById("submitButton");
  const resetButton = document.getElementById("resetButton");
  const focusFormButton = document.getElementById("focusForm");
  const statusFilter = document.getElementById("filterStatus");

  const formHeading = document.getElementById("formHeading");
  const formAlert = document.getElementById("formAlert");

  const totalCount = document.getElementById("totalCount");
  const todoCount = document.getElementById("todoCount");
  const progressCount = document.getElementById("progressCount");
  const doneCount = document.getElementById("doneCount");

  // 5. Format date for display
  function formatDate(dateString) {
    if (!dateString) return "Not set";

    return new Date(dateString + "T00:00:00").toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  // 6. Get today's date
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // 7. Show validation messages
  function showError(message) {
    formAlert.textContent = message;
    formAlert.classList.remove("d-none");
  }

  function clearError() {
    formAlert.textContent = "";
    formAlert.classList.add("d-none");
  }

  // 8. Reset form
  function resetForm() {
    taskForm.reset();
    taskIdInput.value = "";
    submitButton.textContent = "Add task";
    formHeading.textContent = "Create a task";
    clearError();

    taskForm.querySelectorAll(".is-invalid").forEach((field) => {
      field.classList.remove("is-invalid");
    });
  }

  // 9. Update task statistics
  function updateStatistics() {
    const tasks = taskManager.getAllTasks();

    totalCount.textContent = tasks.length;
    todoCount.textContent = tasks.filter(
      (task) => task.status === "TODO"
    ).length;

    progressCount.textContent = tasks.filter(
      (task) => task.status === "IN PROGRESS"
    ).length;

    doneCount.textContent = tasks.filter(
      (task) => task.status === "DONE"
    ).length;
  }

  // 10. Render task cards
  function renderTasks() {
    const selectedStatus = statusFilter.value;

    const filteredTasks = taskManager
      .getAllTasks()
      .filter(
        (task) =>
          selectedStatus === "ALL" ||
          task.status === selectedStatus
      );

    taskList.replaceChildren();

    if (filteredTasks.length === 0) {
      const column = document.createElement("div");
      column.className = "col-12";

      const message = document.createElement("div");
      message.className = "empty-state";
      message.textContent = "No tasks found for this status.";

      column.appendChild(message);
      taskList.appendChild(column);
    }

    filteredTasks.forEach((task) => {
      const column = document.createElement("div");
      column.className = "col-12";

      const card = document.createElement("article");
      card.className = "task-card";

      const body = document.createElement("div");
      body.className = "card-body";

      const header = document.createElement("div");
      header.className =
        "d-flex justify-content-between align-items-start gap-2 mb-3";

      const title = document.createElement("h3");
      title.className = "task-name mb-0";
      title.textContent = task.name;

      const badge = document.createElement("span");
      badge.className = "status-badge";

      const statusClasses = {
        TODO: "status-todo",
        "IN PROGRESS": "status-progress",
        REVIEW: "status-review",
        DONE: "status-done",
      };

      badge.classList.add(statusClasses[task.status] || "status-todo");
      badge.textContent = task.status;

      header.append(title, badge);

      const description = document.createElement("p");
      description.className = "task-description";
      description.textContent = task.description;

      const assigned = document.createElement("p");
      assigned.className = "mb-2";
      assigned.textContent = "Assigned to: " + task.assignedTo;

      const dueDate = document.createElement("p");
      dueDate.className = "mb-3";
      dueDate.textContent = "Due date: " + formatDate(task.dueDate);

      const actions = document.createElement("div");
      actions.className = "d-flex gap-2 mt-3";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "btn btn-outline-primary btn-sm";
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editTask(task.id));

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "btn btn-outline-danger btn-sm";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteTask(task.id));

      actions.append(editButton, deleteButton);
      body.append(header, description, assigned, dueDate, actions);
      card.appendChild(body);
      column.appendChild(card);
      taskList.appendChild(column);
    });

    updateStatistics();
  }

  // 11. Validate form data
  function validateForm() {
    clearError();

    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    const assignedTo = assignedToInput.value.trim();
    const dueDate = dueDateInput.value;
    const status = statusInput.value;

    if (name.length < 3 || name.length > 80) {
      showError("Task name must contain 3–80 characters.");
      nameInput.focus();
      return false;
    }

    if (description.length < 5 || description.length > 300) {
      showError("Description must contain 5–300 characters.");
      descriptionInput.focus();
      return false;
    }

    if (assignedTo.length < 2 || assignedTo.length > 60) {
      showError("Enter a valid team member name.");
      assignedToInput.focus();
      return false;
    }

    if (!dueDate || dueDate < getTodayDate()) {
      showError("Choose today or a future due date.");
      dueDateInput.focus();
      return false;
    }

    if (!["TODO", "IN PROGRESS", "REVIEW", "DONE"].includes(status)) {
      showError("Please select a valid task status.");
      statusInput.focus();
      return false;
    }

    return true;
  }

  // 12. Add a new task or update an existing task
  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) return;

    const details = {
      name: nameInput.value.trim(),
      description: descriptionInput.value.trim(),
      assignedTo: assignedToInput.value.trim(),
      dueDate: dueDateInput.value,
      status: statusInput.value,
    };

    const editingId = Number(taskIdInput.value);

    if (taskIdInput.value !== "") {
      const updated = taskManager.updateTask(editingId, details);

      if (!updated) {
        showError("Task not found. Please try again.");
        return;
      }
    } else {
      taskManager.addTask(
        details.name,
        details.description,
        details.assignedTo,
        details.dueDate,
        details.status
      );
    }

    resetForm();
    renderTasks();
  });

  // 13. Edit a task
  function editTask(id) {
    const task = taskManager.getTaskById(id);

    if (!task) return;

    taskIdInput.value = task.id;
    nameInput.value = task.name;
    descriptionInput.value = task.description;
    assignedToInput.value = task.assignedTo;
    dueDateInput.value = task.dueDate;
    statusInput.value = task.status;

    submitButton.textContent = "Update task";
    formHeading.textContent = "Edit task";
    clearError();

    document.getElementById("formPanel").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    nameInput.focus();
  }

  // 14. Delete a task by its unique ID
  function deleteTask(id) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!shouldDelete) return;

    const deleted = taskManager.deleteTask(id);

    if (!deleted) {
      showError("Task not found.");
      return;
    }

    if (Number(taskIdInput.value) === id) {
      resetForm();
    }

    renderTasks();
  }

  // 15. Clear button
  resetButton.addEventListener("click", resetForm);

  // 16. Create task button
  focusFormButton.addEventListener("click", function () {
    resetForm();

    document.getElementById("formPanel").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    nameInput.focus();
  });

  // 17. Filter tasks by status
  statusFilter.addEventListener("change", renderTasks);

  // 18. Initial page display
  renderTasks();
});
