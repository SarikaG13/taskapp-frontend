import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../api/ApiService";
import "./TaskPage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faCheckCircle, faClock, faFire } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [error, setError] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [completionFilter, setCompletionFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [taskSummary, setTaskSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = ApiService.isAuthenticated();

  const fetchOverdueTasks = async () => {
    try {
      const res = await ApiService.getTasksDueTodayAndOverdue();
      if (res.statusCode === 200) {
        setTasks(res.data);
        toast.success("Showing overdue tasks");
      }
    } catch (error) {
      toast.error("Failed to fetch overdue tasks");
    }
  };

  const isTaskOverdue = (task) => {
    if (task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const fetchAllTasks = useCallback(async () => {
  setLoading(true);
  try {
    const [tasksRes, summaryRes] = await Promise.all([
      ApiService.getAllMyTasks(),
      ApiService.getTaskSummary()
    ]);

    if (!Array.isArray(tasksRes.data?.data)) {
      console.error("🚨 tasksRes.data.data is not an array:", tasksRes.data);
      setTasks([]);
      setFilteredTasks([]);
      setError("Invalid task data received.");
      return;
    }

    setTasks(tasksRes.data.data);
    setFilteredTasks(tasksRes.data.data);
    setError('');

    if (summaryRes.statusCode === 200) {
      setTaskSummary(summaryRes.data);
    } else {
      toast.error("Failed to fetch task summary");
    }
  } catch (error) {
    setError(error.response?.data?.message || 'Error during initial fetch');
  } finally {
    setLoading(false);
  }
}, []);

  const handleSearch = async () => {
    setError('');
    try {
      const res = await ApiService.findByTitle(searchQuery);
      if (res.statusCode === 200) {
        setFilteredTasks(res.data);
      } else {
        setError(res.message || 'Error searching tasks');
        setFilteredTasks([]);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error during search');
      setFilteredTasks([]);
    }
  };

  const applyFilters = useCallback(async () => {
    try {
      let result = [...tasks];
      setError('');

      if (completionFilter !== 'ALL') {
        const isCompleted = completionFilter === 'TRUE';
        const res = await ApiService.getMyTasksByCompletionStatus(isCompleted);
        if (res.statusCode === 200) {
          result = res.data;
        }
      }

      if (priorityFilter !== 'ALL') {
        const res = await ApiService.getMyTasksByPriority(priorityFilter);
        if (res.statusCode === 200) {
          if (completionFilter !== 'ALL') {
            const priorityTasks = res.data;
            result = result.filter(task => priorityTasks.some(pt => pt.id === task.id));
          } else {
            result = res.data;
          }
        }
      }

      setFilteredTasks(result);
    } catch (error) {
      setError(error.response?.data?.message || 'Error applying filters');
    }
  }, [priorityFilter, completionFilter, tasks]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllTasks();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, fetchAllTasks]);

  useEffect(() => {
    if (tasks.length > 0 || priorityFilter !== 'ALL' || completionFilter !== 'ALL') {
      applyFilters();
    }
  }, [priorityFilter, completionFilter, tasks, applyFilters]);

  const toggleComplete = async (taskId, currentCompletedStatus) => {
    try {
      const newStatus = !currentCompletedStatus;

      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        toast.error("Task not found");
        return;
      }

      const payload = {
        id: taskId,
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        completed: newStatus
      };

      const res = await ApiService.updateTask(payload);

      if (res.statusCode === 200) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: newStatus } : t));
        setFilteredTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: newStatus } : t));
        toast.success("Task status updated");
      } else {
        setError(res.message || 'Failed to update task status.');
        toast.error("Failed to update task status");
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating task status.');
      toast.error("Error updating task status");
    }
  };

  const resetFiltersAndSearch = () => {
    setPriorityFilter('ALL');
    setCompletionFilter('ALL');
    setSearchQuery('');
    setError('');
    fetchAllTasks();
  };
    
  return (
  <div className="tasks-container">
    <div className="tasks-header">
      <h2>My Tasks</h2>
      <Link to="/tasks/add" className="add-task-button">
        + Add New Task
      </Link>
    </div>

    {error && <div className="error-message">{error}</div>}

  {taskSummary && (
  <div className="dashboard-summary">
    <div className="summary-row">
      <div className="summary-card total">
        <h3>Total Tasks</h3>
        <p><FontAwesomeIcon icon={faListCheck} /> {taskSummary.totalTasks}</p>
      </div>
      <div className="summary-card completed">
        <h3>Completed</h3>
        <p><FontAwesomeIcon icon={faCheckCircle} /> {taskSummary.completedTasks}</p>
      </div>
      <div className="summary-card pending">
        <h3>Pending</h3>
        <p><FontAwesomeIcon icon={faClock} /> {taskSummary.pendingTasks}</p>
      </div>
      <div className="summary-card high-priority">
        <h3>High Priority</h3>
        <p><FontAwesomeIcon icon={faFire} /> {taskSummary.highPriorityTasks}</p>
      </div>
    </div>

    <div className="summary-row">
      <div className="summary-card donut-card">
        <h3>Overall Progress</h3>
        <div className="donut-wrapper">
          <CircularProgressbar
            value={taskSummary.completionPercentage}
            text={`${Math.round(taskSummary.completionPercentage)}%`}
            styles={buildStyles({
              pathColor: '#00c851',
              textColor: '#333',
              trailColor: '#eee',
              textSize: '16px',
              strokeLinecap: 'round',
              pathTransitionDuration: 0.5,
              pathTransition: "stroke-dashoffset 0.5s ease-in-out",
            })}
          />
        </div>
      </div>
    </div>
  </div>
  )}

    <div className="tasks-filters">
      <div className="filter-group">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="filter-group">
        <label htmlFor="priority-filter">Priority:</label>
        <select
          id="priority-filter"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="completion-filter">Status:</label>
        <select
          id="completion-filter"
          value={completionFilter}
          onChange={(e) => setCompletionFilter(e.target.value)}
        >
          <option value="ALL">All Tasks</option>
          <option value="TRUE">Completed</option>
          <option value="FALSE">Pending</option>
        </select>
      </div>
    </div>

    <div className="tasks-list">
    {filteredTasks.length === 0 ? (
    <div className="no-tasks">
      <p>No tasks found matching your filters.</p>
      <button
        className="reset-filters-button"
        onClick={resetFiltersAndSearch}
      >
        Reset Filters
      </button>
      <button onClick={fetchOverdueTasks} className="filter-button">
        Show Overdue Tasks
      </button>
    </div>
    ) : (
    [...filteredTasks]
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .map(task => (
        <div
          key={task.id}
          className={`task-card ${task.completed ? 'completed' : ''} ${isTaskOverdue(task) ? 'overdue' : ''}`}
        >
          <div className="task-content">
            <div className="task-header">
              <h3>{task.title}</h3>
              <span className={`priority-badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
              {isTaskOverdue(task) && <span className="overdue-label">Overdue</span>}
            </div>
            <p className="task-description">{task.description}</p>
            <div className="task-meta">
              <span className="due-date">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
              <span className="created-at">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="task-actions">
            <button
              onClick={() => toggleComplete(task.id, task.completed)}
              className={`complete-button ${task.completed ? 'completed' : ''}`}
            >
              {task.completed ? '✓ Completed' : 'Mark Complete'}
            </button>
            <Link
              to={`/tasks/edit/${task.id}`}
              className="edit-button"
            >
              Edit
            </Link>
          </div>
        </div>
      ))
  )}
</div>
  </div>
);

}

export default TasksPage;