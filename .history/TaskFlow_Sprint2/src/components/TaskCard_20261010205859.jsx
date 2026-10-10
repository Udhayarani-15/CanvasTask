
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

const statusClasses = {
  TODO: "status-todo",
  "IN PROGRESS": "status-progress",
  REVIEW: "status-review",
  DONE: "status-done",
};

const priorityClasses = {
  LOW: "priority-low",
  MEDIUM: "priority-medium",
  HIGH: "priority-high",
};

function TaskCard({ task, onEdit, onDelete }) {
  const priority = task.priority || "MEDIUM";

  return (
    <article
      className={`task-card ${priorityClasses[priority] || priorityClasses.MEDIUM}`}
    >
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
          <h3 className="task-name mb-0">{task.name}</h3>

          <span
            className={`status-badge ${statusClasses[task.status] || "status-todo"}`}
          >
            {task.status}
          </span>
        </div>

        <p className="task-description">{task.description}</p>

        <div className="priority-label mb-3">
          Priority: <strong>{priority}</strong>
        </div>

        <hr />

        <div className="task-meta mb-3">
          <div className="mb-2">
            <span className="meta-label">Assigned to</span>
            <div className="meta-value">{task.assignedTo}</div>
          </div>

          <div>
            <span className="meta-label">Due date</span>
            <div className="meta-value">{formatDate(task.dueDate)}</div>
          </div>
        </div>

        <div className="mt-auto d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm flex-grow-1"
            onClick={() => onEdit(task)}
          >
            Edit
          </button>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm flex-grow-1"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
