import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../api/ApiService";
import './TaskForm.css';
import toast from 'react-hot-toast';

const TaskFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    completed: false
  });

  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [reminderStatus, setReminderStatus] = useState(false);

  const canAddSubtasks = !!formData.id;

  useEffect(() => {
    if (isEdit && id) {
      ApiService.getTaskById(id).then((res) => {
        if (res.statusCode === 200 && res.data) {
          const data = res.data;
          setFormData({
            id: data.id,
            title: data.title || '',
            description: data.description || '',
            dueDate: data.dueDate?.split("T")[0] || '',
            priority: data.priority || 'MEDIUM',
            completed: data.completed || false
          });
          if (data.id) loadSubtasks(data.id);
        } else {
          toast.error(res.message || "Failed to load task.");
        }
      }).catch(() => {
        toast.error("Error loading task.");
      });
    }
  }, [id, isEdit]);

  const loadSubtasks = async (taskId) => {
    try {
      const res = await ApiService.getSubtasksByTaskId(taskId);
      if (res.statusCode === 200 && Array.isArray(res.data)) {
        setSubtasks(res.data);
      } else {
        console.error("🚨 Invalid subtasks response:", res);
        setSubtasks([]);
        toast.error(res.message || "Failed to load subtasks.");
      }
    } catch (err) {
      console.error("❌ Error loading subtasks:", err);
      toast.error("Error loading subtasks");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.title || formData.title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (!formData.description || formData.description.trim().length < 5) {
      toast.error("Description must be at least 5 characters");
      setLoading(false);
      return;
    }

    if (!formData.dueDate) {
      toast.error("Due date is required");
      setLoading(false);
      return;
    }

    const { reminderSent, ...dataToSend } = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      completed: !!formData.completed
    };

    try {
      const response = isEdit
        ? await ApiService.updateTask(dataToSend)
        : await ApiService.createTask(dataToSend);

      if (response?.statusCode === 200 && response?.data) {
        toast.success(`Task ${isEdit ? "updated" : "created"} successfully!`);

        if (!isEdit && response.data.id) {
        const newTaskId = response.data.id;
        toast.success("Task created! Redirecting to edit mode...");
        navigate(`/tasks/${newTaskId}`);
        return;
      }

        navigate("/tasks");
      } else {
        toast.error(response?.message || "Failed to save task.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving task.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  try {
    const res = await ApiService.deleteTask(formData.id);
    if (res.statusCode === 200) {
      toast.success("Task deleted successfully");
      navigate("/tasks"); 
    } else {
      toast.error(res.message || "Failed to delete task");
    }
  } catch (err) {
    toast.error("Error deleting task");
    console.error(err);
  }
};

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    setError('');

    const taskId = formData.id || localStorage.getItem("lastCreatedTaskId");
    if (!newSubtaskTitle.trim()) {
      toast.error("Subtask title cannot be empty.");
      return;
    }

    if (!taskId || taskId === "undefined") {
      toast.error("Task ID is missing. Save the task first.");
      return;
    }

    const subtaskPayload = {
      taskId,
      title: newSubtaskTitle.trim(),
      completed: false
    };

    try {
      const res = await ApiService.createSubtask(subtaskPayload);
      if (res.statusCode === 201 || res.statusCode === 200) {
        setNewSubtaskTitle('');
        await loadSubtasks(taskId);
        toast.success("Subtask added!");
      } else {
        toast.error(res.message || "Failed to add subtask.");
      }
    } catch {
      toast.error("Error adding subtask.");
    }
  };

  const handleEditSubtask = async (subtaskId, currentTitle) => {
    const newTitle = prompt("Edit subtask title:", currentTitle);
    if (!newTitle || newTitle.trim() === currentTitle) return;

    try {
      const res = await ApiService.updateSubtask(subtaskId, {
        title: newTitle.trim()
      });
      if (res.statusCode === 200) {
        await loadSubtasks(formData.id);
        toast.success("Subtask updated!");
      } else {
        toast.error(res.message || "Failed to update subtask.");
      }
    } catch {
      toast.error("Error updating subtask.");
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    const confirmDelete = window.confirm("Delete this subtask?");
    if (!confirmDelete) return;

    try {
      const res = await ApiService.deleteSubtask(subtaskId);
      if (res.statusCode === 200 || res.statusCode === 204) {
        await loadSubtasks(formData.id);
        toast.success("Subtask deleted.");
      } else {
        toast.error(res.message || "Failed to delete subtask.");
      }
    } catch {
      toast.error("Error deleting subtask.");
    }
  };

  const toggleSubtaskCompletion = async (subtaskId) => {
    try {
      const res = await ApiService.toggleSubtaskCompletion(subtaskId);
      if (res.statusCode === 200) {
        await loadSubtasks(formData.id);
        if (formData.id) {
          const updatedTask = await ApiService.getTaskById(formData.id);
          if (updatedTask.statusCode === 200 && updatedTask.data) {
            setFormData(prev => ({
              ...prev,
              completed: updatedTask.data.completed || false
            }));
          }
        }
      } else {
        toast.error(res.message || "Failed to toggle subtask.");
      }
    } catch {
      toast.error("Error toggling subtask.");
    }
  };

return (
  <div className="task-form-container">
    <div className="section-card">
      <h2>{isEdit ? "Edit Task" : "Add New Task"}</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group full-width">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
            autoFocus
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            rows="4"
          ></textarea>
        </div>

        <div className="form-row three-column">
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group center-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="form-group checkbox-group right-group">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
            />
            <label htmlFor="completed">Completed</label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="highlighted-button primary">
            <i className="fas fa-save"></i> {isEdit ? "Update Task" : "Create Task"}
          </button>
          <div className="cancel-right">
            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="highlighted-button neutral"
            >
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
          {isEdit && (
          <div className="delete-right">
            <button
              type="button"
              onClick={handleDeleteTask}
              className="highlighted-button danger"
            >
              <i className="fas fa-trash"></i> Delete Task
            </button>
          </div>
        )}
        </div>
      </form>
    </div>

    <div className="section-card">
      <h3>Subtasks</h3>

      <div className="subtask-list">
        {subtasks.length === 0 && <p>No subtasks yet. Add one below 👇</p>}
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="subtask-item">
            <input
              type="checkbox"
              id={`subtask-${subtask.id}`}
              checked={subtask.completed}
              onChange={() => toggleSubtaskCompletion(subtask.id)}
            />
            <label htmlFor={`subtask-${subtask.id}`} className="subtask-label">
              <span className={subtask.completed ? "completed-text" : ""}>
                {subtask.title}
              </span>
            </label>
            <button
              type="button"
              className="highlighted-button info"
              onClick={() => handleEditSubtask(subtask.id, subtask.title)}
            >
              <i className="fas fa-edit"></i> Edit
            </button>
            <button
              type="button"
              className="highlighted-button danger"
              onClick={() => handleDeleteSubtask(subtask.id)}
            >
              <i className="fas fa-trash"></i> Delete
            </button>
          </div>
        ))}
      </div>

      <div className="add-subtask">
        <input
          type="text"
          placeholder="Add a new subtask"
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          disabled={!canAddSubtasks}
        />
        <button
          type="button"
          onClick={handleAddSubtask}
          disabled={!canAddSubtasks}
          className="highlighted-button success"
        >
          <i className="fas fa-plus"></i> Add
        </button>
      </div>

      {!canAddSubtasks && (
        <p className="subtask-warning">
          ⚠️ Save the task before adding subtasks.
        </p>
      )}

      <div className="mark-complete-below">
        <button
          type="button"
          className="highlighted-button success"
          onClick={async () => {
            for (const sub of subtasks) {
              if (!sub.completed) {
                await ApiService.toggleSubtaskCompletion(sub.id);
              }
            }
            await loadSubtasks(formData.id);
            toast.success("All subtasks marked complete");
          }}
        >
          ✅ Mark All Complete
        </button>
      </div>
    </div>

    <div className="section-card">
      <button
        type="button"
        className="highlighted-button warning"
        onClick={() => setShowStatus((prev) => !prev)}
      >
        <i className="fas fa-bell"></i> {showStatus ? "Hide Reminder Status" : "Show Reminder Status"}
      </button>

      {showStatus && (
      <div className="reminder-status-block">
        <h4>📬 Reminder Status</h4>
        {!Array.isArray(reminderStatus) || reminderStatus.length === 0 ? (
          <p className="empty-reminder-msg">📭 No reminders processed yet.</p>
        ) : (
          <ul>
            {reminderStatus.map((status, idx) => (
              <li key={idx}>
                {status.taskTitle} —{" "}
                {status.sent
                  ? "✅ Sent"
                  : status.reason
                  ? `⚠️ Skipped (${status.reason})`
                  : "⏳ Pending"}
              </li>
            ))}
          </ul>
        )}
      </div>
    )}
    </div>
  </div>
);

};

export default TaskFormPage;
