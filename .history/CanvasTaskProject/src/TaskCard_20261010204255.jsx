
import { useState } from "react";
import "./TaskCard.css";

function TaskCard({ task, onDelete }) {
  const [priority, setPriority] = useState("MEDIUM");

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  return (
    <div
      className={`task-card ${
        priority === "URGENT" ? "urgent" : ""
      }`}
    >
      <div className="task-header">
        <h3>{task.title}</h3>

        <button
          className="delete-button"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.title}`}
        >
          Delete
        </button>
      </div>

      <p className="task-description">
        {task.description}
      </p>

      <div className="priority-section">
        <label htmlFor={`priority-${task.id}`}>
          Task Priority:
        </label>

        <select
          id={`priority-${task.id}`}
          value={priority}
          onChange={handlePriorityChange}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="URGENT">URGENT</option>
        </select>
      </div>

      <p className="current-priority">
        Current Priority: <strong>{priority}</strong>
      </p>
    </div>
  );
}

export default TaskCard;
