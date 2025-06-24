import React, { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch(`${apiUrl}/tasks`)
      .then((res) => res.json())
      .then(setTasks)
      .catch((err) => console.error("API fetch error:", err));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    fetch(`${apiUrl}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask }),
    })
      .then(() => {
        setNewTask("");
        fetchTasks();
      });
  };

  const deleteTask = (id) => {
    fetch(`${apiUrl}/tasks/${id}`, { method: "DELETE" })
      .then(fetchTasks);
  };

  // === PATCH ===
  const toggleDone = (id, currentDone) => {
    fetch(`${apiUrl}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !currentDone }),
    })
      .then(fetchTasks);
  };

  return (
    <div>
      <h1>TODO-лист (FastAPI + React)</h1>
      <form onSubmit={addTask}>
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Новая задача"
        />
        <button type="submit">Добавить</button>
      </form>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <input
              type="checkbox"
              checked={!!t.done}
              onChange={() => toggleDone(t.id, t.done)}
              style={{ marginRight: 8 }}
            />
            {t.title} [{t.done ? "✓" : " "}]
            <button onClick={() => deleteTask(t.id)} style={{ marginLeft: 8 }}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
