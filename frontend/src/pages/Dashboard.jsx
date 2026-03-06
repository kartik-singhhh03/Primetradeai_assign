import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data.data);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingTask) {
        await updateTask(editingTask.id, form);
        setEditingTask(null);
      } else {
        await createTask(form);
      }
      setForm({ title: "", description: "" });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setForm({ title: task.title, description: task.description || "" });
  };

  const handleToggle = async (task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
      fetchTasks();
    } catch {
      setError("Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      fetchTasks();
    } catch {
      setError("Failed to delete task");
    }
  };

  const handleCancel = () => {
    setEditingTask(null);
    setForm({ title: "", description: "" });
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>My Tasks</h1>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="dashboard-body">
        <div className="task-form-card">
          <h3>{editingTask ? "Edit Task" : "New Task"}</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
            />
            <div className="form-actions">
              <button type="submit">
                {editingTask ? "Update" : "Add Task"}
              </button>
              {editingTask && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="task-list">
          {loading ? (
            <p className="muted">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="muted">No tasks yet. Add one above.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`task-card ${task.completed ? "completed" : ""}`}
              >
                <div className="task-info">
                  <h4>{task.title}</h4>
                  {task.description && <p>{task.description}</p>}
                </div>
                <div className="task-actions">
                  <button
                    className="btn-toggle"
                    onClick={() => handleToggle(task)}
                    title={task.completed ? "Mark incomplete" : "Mark complete"}
                  >
                    {task.completed ? "↩ Undo" : "✓ Done"}
                  </button>
                  <button className="btn-edit" onClick={() => handleEdit(task)}>
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
