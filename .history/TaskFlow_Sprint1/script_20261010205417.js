document.addEventListener("DOMContentLoaded", function () {
  // Get form and page elements
  const taskForm = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");
  const submitButton = document.getElementById("submitButton");
  const cancelButton = document.getElementById("cancelButton");
  const statusFilter = document.getElementById("statusFilter");

  const totalTasks = document.getElementById("totalTasks");
  const todoTasks = document.getElementById("todoTasks");
  const progressTasks = document.getElementById("progressTasks");
  const doneTasks = document.getElementById("doneTasks");

  let tasks = [
    {
      id: 1,
      name: "Design Login Page",
      description: "Create a responsive login page using Bootstrap.",
      assignedTo: "Udhaya",
      dueDate: "2026-10-15",
      status: "TODO",
    },
    {
      id: 2,
      name: "Build Dashboard",
      description: "Develop the main dashboard layout.",
      assignedTo: "Arun",
      dueDate: "2026-10-16",
      status: "IN PROGRESS",
    },
    {
      id: 3,
      name: "Create Database Schema",
      description: "Plan the tables and relationships.",
      assignedTo: "Priya",
      dueDate: "2026-10-17",
      status: "REVIEW",
    },
    {
      id: 4,
      name: "Test Registration Form",
      description: "Check form validation and error messages.",
      assignedTo: "Kavin",
      dueDate: "2026-10-18",
      status: "DONE",
    },
    {
      id: 5,
      name: "Write Project Documentation",
      description: "Document the features and project setup.",
      assignedTo: "Udhaya",
      dueDate: "2026-10-20",
      status: "TODO",
    },
  ];

  let editingTaskId = null;

  // Form field elements
  const nameInput = document.getElementById("taskName");
  const descriptionInput = document.getElementById("taskDescription");
  const assignedToInput = document.getElementById("assignedTo");
  const dueDateInput = document.getElementById("dueDate");
  const statusInput = document.getElementById("taskStatus");

  // Display a readable date
  function formatDate(dateString) {
    if (!dateString) return "Not set";

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // Convert status into a Bootstrap badge color
  function getStatusClass(status) {
    switch (status) {
      case "TODO":
        return "text-bg-secondary";
      case "IN PROGRESS":
        return "text-bg-primary";
      case "REVIEW":
        return "text-bg-warning";
      case "DONE":
        return "text-bg-success";
      default:
        return "text-bg-secondary";
    }
  }

  // Display tasks on the page
  function renderTasks() {
    const selectedStatus = statusFilter ? statusFilter.value : "ALL";

    const filteredTasks = tasks.filter(function (task) {
      return selectedStatus === "ALL" || task.status === selectedStatus;
    });

    taskList.innerHTML = "";

    if (filteredTasks.length === 0) {
      taskList.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info">
                        No tasks found for this status.
                    </div>
                </div>
            `;
    }

    filteredTasks.forEach(function (task) {
      const cardColumn = document.createElement("div");
      cardColumn.className = "col-12 col-md-6 col-lg-4";

      cardColumn.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between
                                    align-items-start gap-2 mb-3">
                            <h5 class="card-title mb-0"></h5>
                            <span class="badge ${getStatusClass(task.status)}">
                                ${task.status}
                            </span>
                        </div>

                        <p class="card-text task-description"></p>

                        <hr>

                        <p class="mb-2">
                            <strong>Assigned To:</strong>
                            <span class="assigned-person"></span>
                        </p>

                        <p class="mb-3">
                            <strong>Due Date:</strong>
                            ${formatDate(task.dueDate)}
                        </p>

                        <div class="mt-auto d-flex gap-2">
                            <button type="button"
                                    class="btn btn-outline-primary btn-sm edit-btn">
                                Edit
                            </button>

                            <button type="button"
                                    class="btn btn-outline-danger btn-sm delete-btn">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;

      // Use textContent for user-entered text
      cardColumn.querySelector(".card-title").textContent = task.name;
      cardColumn.querySelector(".task-description").textContent =
        task.description;
      cardColumn.querySelector(".assigned-person").textContent =
        task.assignedTo;

      cardColumn
        .querySelector(".edit-btn")
        .addEventListener("click", function () {
          editTask(task.id);
        });

      cardColumn
        .querySelector(".delete-btn")
        .addEventListener("click", function () {
          deleteTask(task.id);
        });

      taskList.appendChild(cardColumn);
    });

    updateStatistics();
  }

  // Update task counters
  function updateStatistics() {
    if (totalTasks) {
      totalTasks.textContent = tasks.length;
    }

    if (todoTasks) {
      todoTasks.textContent = tasks.filter(
        (task) => task.status === "TODO",
      ).length;
    }

    if (progressTasks) {
      progressTasks.textContent = tasks.filter(
        (task) => task.status === "IN PROGRESS",
      ).length;
    }

    if (doneTasks) {
      doneTasks.textContent = tasks.filter(
        (task) => task.status === "DONE",
      ).length;
    }
  }

  // Remove old validation messages
  function clearValidation() {
    const fields = [
      nameInput,
      descriptionInput,
      assignedToInput,
      dueDateInput,
      statusInput,
    ];

    fields.forEach(function (field) {
      if (!field) return;

      field.classList.remove("is-invalid");

      const feedback = field.parentElement.querySelector(".invalid-feedback");

      if (feedback) {
        feedback.textContent = "";
      }
    });
  }

  // Validate one form field
  function validateField(field, message) {
    if (!field) return true;

    const value = field.value.trim();
    let errorMessage = "";

    if (value === "") {
      errorMessage = message;
    } else if (field === nameInput && value.length < 3) {
      errorMessage = "Task name must contain at least 3 characters.";
    } else if (field === descriptionInput && value.length < 5) {
      errorMessage = "Description must contain at least 5 characters.";
    } else if (field === assignedToInput && value.length < 2) {
      errorMessage = "Please enter a valid team member name.";
    } else if (field === dueDateInput && value < getTodayDate()) {
      errorMessage = "Due date cannot be in the past.";
    }

    if (errorMessage) {
      field.classList.add("is-invalid");

      let feedback = field.parentElement.querySelector(".invalid-feedback");

      if (!feedback) {
        feedback = document.createElement("div");
        feedback.className = "invalid-feedback";
        field.parentElement.appendChild(feedback);
      }

      feedback.textContent = errorMessage;
      return false;
    }

    field.classList.remove("is-invalid");
    return true;
  }

  // Get today's date in YYYY-MM-DD format
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // Validate all required fields
  function validateForm() {
    clearValidation();

    const checks = [
      validateField(nameInput, "Please enter a task name."),
      validateField(descriptionInput, "Please enter a task description."),
      validateField(assignedToInput, "Please enter the assigned team member."),
      validateField(dueDateInput, "Please select a due date."),
      validateField(statusInput, "Please select a task status."),
    ];

    return checks.every(Boolean);
  }

  // Reset the form after saving
  function resetForm() {
    taskForm.reset();
    clearValidation();
    editingTaskId = null;

    if (submitButton) {
      submitButton.textContent = "Add Task";
    }

    if (cancelButton) {
      cancelButton.classList.add("d-none");
    }
  }

  // Add a new task or update an existing task
  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const taskData = {
      name: nameInput.value.trim(),
      description: descriptionInput.value.trim(),
      assignedTo: assignedToInput.value.trim(),
      dueDate: dueDateInput.value,
      status: statusInput.value,
    };

    if (editingTaskId !== null) {
      tasks = tasks.map(function (task) {
        if (task.id === editingTaskId) {
          return {
            ...task,
            ...taskData,
          };
        }

        return task;
      });
    } else {
      const newTask = {
        id: Date.now(),
        ...taskData,
      };

      tasks.push(newTask);
    }

    resetForm();
    renderTasks();
  });

  // Load a task into the form for editing
  function editTask(taskId) {
    const task = tasks.find(function (item) {
      return item.id === taskId;
    });

    if (!task) return;

    editingTaskId = task.id;

    nameInput.value = task.name;
    descriptionInput.value = task.description;
    assignedToInput.value = task.assignedTo;
    dueDateInput.value = task.dueDate;
    statusInput.value = task.status;

    clearValidation();

    if (submitButton) {
      submitButton.textContent = "Update Task";
    }

    if (cancelButton) {
      cancelButton.classList.remove("d-none");
    }

    taskForm.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    nameInput.focus();
  }

  // Delete a task
  function deleteTask(taskId) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!shouldDelete) return;

    tasks = tasks.filter(function (task) {
      return task.id !== taskId;
    });

    if (editingTaskId === taskId) {
      resetForm();
    }

    renderTasks();
  }

  // Cancel editing
  if (cancelButton) {
    cancelButton.addEventListener("click", resetForm);
  }

  // Filter tasks by status
  if (statusFilter) {
    statusFilter.addEventListener("change", renderTasks);
  }

  // Validate fields as the user types
  [
    nameInput,
    descriptionInput,
    assignedToInput,
    dueDateInput,
    statusInput,
  ].forEach(function (field) {
    if (!field) return;

    field.addEventListener("input", function () {
      validateField(field, "This field is required.");
    });

    field.addEventListener("change", function () {
      validateField(field, "This field is required.");
    });
  });

  // Initial display
  renderTasks();
});
