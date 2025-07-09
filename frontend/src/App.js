import React, { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // base url убираем, всегда работаем с относительными путями
  const apiPrefix = "/api";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch(`${apiPrefix}/tasks`)
      .then((res) => res.json())
      .then(setTasks)
      .catch((err) => console.error("API fetch error:", err));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    fetch(`${apiPrefix}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask }),
    })
      .then(() => {
        setNewTask("");
        fetchTasks();
      })
      .catch((err) => console.error("Add task error:", err));
  };

  const deleteTask = (id) => {
    fetch(`${apiPrefix}/tasks/${id}`, { method: "DELETE" })
      .then(fetchTasks)
      .catch((err) => console.error("Delete task error:", err));
  };

  const toggleDone = (id, currentDone) => {
    fetch(`${apiPrefix}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !currentDone }),
    })
      .then(fetchTasks)
      .catch((err) => console.error("Toggle done error:", err));
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
