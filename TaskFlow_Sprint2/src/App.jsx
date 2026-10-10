
import { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import TaskCard from "./components/TaskCard";

const STORAGE_KEY = "taskflow_tasks";

const initialTasks = [
  {
    id: 1,
    name: "Design Login Page",
    description: "Create a responsive login page using Bootstrap.",
    assignedTo: "Udhaya",
    dueDate: "2026-10-15",
    status: "TODO",
    priority: "HIGH",
  },
  {
    id: 2,
    name: "Build Dashboard",
    description: "Develop the main dashboard layout.",
    assignedTo: "Arun",
    dueDate: "2026-10-16",
    status: "IN PROGRESS",
    priority: "MEDIUM",
  },
  {
    id: 3,
    name: "Create Database Schema",
    description: "Plan the tables and relationships.",
    assignedTo: "Priya",
    dueDate: "2026-10-17",
    status: "REVIEW",
    priority: "LOW",
  },
  {
    id: 4,
    name: "Test Registration Form",
    description: "Check form validation and error messages.",
    assignedTo: "Kavin",
    dueDate: "2026-10-18",
    status: "DONE",
    priority: "MEDIUM",
  },
];

const emptyForm = {
  name: "",
  description: "",
  assignedTo: "",
  dueDate: "",
  status: "TODO",
  priority: "MEDIUM",
};

const statuses = ["TODO", "IN PROGRESS", "REVIEW", "DONE"];

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function readTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === null ? initialTasks : JSON.parse(saved);
  } catch {
    return initialTasks;
  }
}

function App() {
  const [tasks, setTasks] = useState(readTasks);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const statistics = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((task) => task.status === "TODO").length,
      progress: tasks.filter(
        (task) => task.status === "IN PROGRESS"
      ).length,
      done: tasks.filter((task) => task.status === "DONE").length,
    }),
    [tasks]
  );

  const filteredTasks = useMemo(
    () =>
      tasks.filter(
        (task) => filter === "ALL" || task.status === filter
      ),
    [tasks, filter]
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();
    const assignedTo = form.assignedTo.trim();

    if (name.length < 3 || name.length > 80) {
      setError("Task name must contain 3–80 characters.");
      return;
    }

    if (description.length < 5 || description.length > 300) {
      setError("Description must contain 5–300 characters.");
      return;
    }

    if (assignedTo.length < 2 || assignedTo.length > 60) {
      setError("Enter a valid team member name.");
      return;
    }

    if (!form.dueDate || form.dueDate < getToday()) {
      setError("Please select today or a future due date.");
      return;
    }

    if (!statuses.includes(form.status)) {
      setError("Please select a valid status.");
      return;
    }

    if (!["LOW", "MEDIUM", "HIGH"].includes(form.priority)) {
      setError("Please select a valid priority.");
      return;
    }

    const taskData = {
      ...form,
      name,
      description,
      assignedTo,
    };

    if (editingId !== null) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingId
            ? { ...task, ...taskData }
            : task
        )
      );
    } else {
      setTasks((previous) => [
        { id: Date.now(), ...taskData },
        ...previous,
      ]);
    }

    resetForm();
  }

  function handleEdit(task) {
    setForm({
      name: task.name,
      description: task.description,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority || "MEDIUM",
    });

    setEditingId(task.id);
    setError("");

    document.getElementById("formPanel")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setTasks((previous) => previous.filter((task) => task.id !== id));

    if (editingId === id) {
      resetForm();
    }
  }

  return (
    <>
      <nav className="navbar bg-white border-bottom">
        <div className="container py-2">
          <a
            className="navbar-brand fw-bold d-flex align-items-center"
            href="#"
          >
            <span className="brand-icon">T</span>
            TaskFlow
          </a>

          <span className="badge rounded-pill text-bg-light border px-3 py-2">
            Sprint 1 · Task Manager
          </span>
        </div>
      </nav>

      <main className="container pb-5">
        <section className="hero">
          <div className="eyebrow mb-2">PLAN · TRACK · COMPLETE</div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
            <div>
              <h1 className="display-5 fw-bold mb-2">
                Team task board
              </h1>
              <p className="muted mb-0">
                Create tasks, assign ownership, and track priorities.
              </p>
            </div>

            <button
              className="btn btn-brand px-4 py-2"
              onClick={() => {
                resetForm();
                document.getElementById("formPanel")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              + Create a task
            </button>
          </div>
        </section>

        <section className="row g-3 mb-4">
          {[
            ["Total tasks", statistics.total],
            ["To do", statistics.todo],
            ["In progress", statistics.progress],
            ["Completed", statistics.done],
          ].map(([label, value]) => (
            <div className="col-6 col-lg-3" key={label}>
              <div className="surface stat">
                <div className="stat-label">{label}</div>
                <div className="stat-number">{value}</div>
              </div>
            </div>
          ))}
        </section>

        <div className="row g-4 align-items-start">
          <div className="col-lg-4" id="formPanel">
            <section className="surface p-3 p-md-4">
              <h2 className="section-title mb-1">
                {editingId !== null ? "Edit task" : "Create a task"}
              </h2>

              <p className="muted small mb-4">
                Enter the task details below.
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="name">
                    Task name *
                  </label>
                  <input
                    className="form-control"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    maxLength={80}
                    minLength={3}
                    placeholder="e.g. Build navigation bar"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="description">
                    Description *
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows={3}
                    value={form.description}
                    onChange={handleChange}
                    maxLength={300}
                    minLength={5}
                    placeholder="Describe the task"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="assignedTo">
                    Assigned to *
                  </label>
                  <input
                    className="form-control"
                    id="assignedTo"
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleChange}
                    maxLength={60}
                    minLength={2}
                    placeholder="Team member name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="dueDate">
                    Due date *
                  </label>
                  <input
                    className="form-control"
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    min={getToday()}
                    value={form.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="status">
                    Status *
                  </label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label" htmlFor="priority">
                    Priority *
                  </label>
                  <select
                    className="form-select"
                    id="priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    required
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>

                  <div className="form-text">
                    Priority determines the task card color.
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-brand flex-grow-1"
                    type="submit"
                  >
                    {editingId !== null ? "Update task" : "Add task"}
                  </button>

                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={resetForm}
                  >
                    Clear
                  </button>
                </div>
              </form>
            </section>
          </div>

          <div className="col-lg-8">
            <section>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-3">
                <div>
                  <h2 className="section-title mb-1">Task list</h2>
                  <p className="muted small mb-0">
                    Manage your tasks and their priorities.
                  </p>
                </div>

                <select
                  className="form-select filter-select"
                  aria-label="Filter tasks by status"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                >
                  <option value="ALL">All statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row g-3">
                {filteredTasks.length === 0 ? (
                  <div className="col-12">
                    <div className="empty-state">
                      No tasks found. Create a task to get started.
                    </div>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div className="col-12 col-md-6" key={task.id}>
                      <TaskCard
                        task={task}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>

        <footer className="text-center">
          TaskFlow · Built with React, Bootstrap and JavaScript.
        </footer>
      </main>
    </>
  );
}

export default App;
