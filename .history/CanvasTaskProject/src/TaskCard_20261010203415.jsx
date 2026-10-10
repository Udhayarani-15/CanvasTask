
import React, { useState } from "react";
import "./TaskCard.css";

function TaskCard() {
  const [priority, setPriority] = useState("MEDIUM");

  return (
    <div
      className={`task-card ${
        priority === "URGENT" ? "urgent" : ""
      }`}
    >
      <h2>Complete Sprint 2 Task</h2>

      <p>
        Finish the assigned task and test the application.
      </p>

      <label htmlFor="priority">
        Task Priority:
      </label>

      <select
        id="priority"
        value={priority}
        onChange={(event) =>
          setPriority(event.target.value)
        }
      >
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="URGENT">URGENT</option>
      </select>

      <p>
        Current Priority: <strong>{priority}</strong>
      </p>
    </div>
  );
}

export default TaskCard;
