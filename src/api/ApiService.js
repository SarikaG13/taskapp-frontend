import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://taskapp-backend-1-ryqr.onrender.com";

class ApiService {

  static async registerUser(body) {
    return axios.post(`${BASE_URL}/auth/register`, body)
      .then(r => r.data)
      .catch(e => e.response?.data);
  }

  static async loginUser(body) {
    return axios.post(`${BASE_URL}/auth/login`, body)
      .then(r => r.data)
      .catch(e => e.response?.data);
  }

  static saveToken(token) {
    localStorage.setItem("token", token);
  }

  static getToken() {
    return localStorage.getItem("token");
  }

  static isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  static logout() {
    localStorage.removeItem("token");
  }

  static getHeader() {
    const token = ApiService.getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  }

  static async createTask(body) {
    return axios.post(`${BASE_URL}/api/tasks`, body, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.data
    })).catch(e => ({
      statusCode: e.response?.status || 500,
      message: e.response?.data?.message || e.message
    }));
  }

  static async updateTask(task) {
    if (!task?.id) {
      console.error("❌ Cannot update task: task.id is missing");
      return { statusCode: 400, message: "Task ID must not be null" };
    }

    const payload = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      completed: task.completed,
      dueDate: task.dueDate
    };

    return axios.put(`${BASE_URL}/api/tasks/${task.id}`, payload, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.data
    })).catch(e => ({
      statusCode: e.response?.status || 500,
      message: e.response?.data?.message || e.message
    }));
  }

  static async getAllMyTasks() {
    return axios.get(`${BASE_URL}/api/tasks/all`, {
      headers: ApiService.getHeader()
    }).then(r => r.data).catch(e => e.response?.data);
  }

  static async getTaskById(taskId) {
    return axios.get(`${BASE_URL}/api/tasks/task/${taskId}`, {
      headers: ApiService.getHeader()
    }).then(r => r.data).catch(e => e.response?.data);
  }

  static async deleteTask(taskId) {
    return axios.delete(`${BASE_URL}/api/tasks/task/${taskId}`, {
      headers: ApiService.getHeader()
    }).then(r => r.data).catch(e => e.response?.data);
  }

  static async getMyTasksByCompletionStatus(completed) {
    return axios.get(`${BASE_URL}/api/tasks/status`, {
      headers: ApiService.getHeader(),
      params: { completed }
    }).then(r => r.data).catch(e => e.response?.data);
  }

  static async getMyTasksByPriority(priority) {
    return axios.get(`${BASE_URL}/api/tasks/priority`, {
      headers: ApiService.getHeader(),
      params: { priority }
    }).then(r => r.data).catch(e => e.response?.data);
  }

  //  KPI AND SEARCH 
  static async getTaskSummary() {
    return axios.get(`${BASE_URL}/api/tasks/summary`, {
      headers: ApiService.getHeader()
    }).then(r => r.data).catch(e => e.response?.data);
  }

  static async getReminderStatus() {
    return axios.get(`${BASE_URL}/api/tasks/reminder-status`, {
      headers: ApiService.getHeader()
    }).then(r => r.data).catch(e => e.response?.data || { message: e.message });
  }

  static async findByTitle(title) {
    return axios.get(`${BASE_URL}/api/tasks/search`, {
      headers: ApiService.getHeader(),
      params: { title }
    }).then(r => r.data).catch(e => e.response?.data);
  }

  static async getTasksDueTodayAndOverdue() {
    return axios.get(`${BASE_URL}/api/tasks/overdue`, {
      headers: ApiService.getHeader()
    }).then(r => r.data).catch(e => e.response?.data);
  }

  // SUBTASK CRUD
  static async createSubtask(subtaskPayload) {
    if (!subtaskPayload?.taskId) {
      console.error("❌ Cannot create subtask: taskId is missing");
      return { statusCode: 400, message: "Task ID must not be null" };
    }

    return axios.post(`${BASE_URL}/api/subtasks`, subtaskPayload, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.data
    })).catch(e => ({
      statusCode: e.response?.status || 500,
      message: e.response?.data?.message || e.message
    }));
  }

  static async updateSubtask(subtaskId, payload) {
    return axios.put(`${BASE_URL}/api/subtasks/${subtaskId}`, payload, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.data
    })).catch(e => ({
      statusCode: e.response?.status || 500,
      message: e.response?.data?.message || e.message
    }));
  }

  static async deleteSubtask(subtaskId) {
  return axios.delete(`${BASE_URL}/api/subtasks/${subtaskId}`, {
    headers: ApiService.getHeader()
  }).then(r => ({
    statusCode: r.status,
    data: r.status === 204 ? null : r.data 
  })).catch(e => ({
    statusCode: e.response?.status || 500,
    message: e.response?.data?.message || e.message
  }));
}

  static async getSubtasksByTaskId(taskId) {
    return axios.get(`${BASE_URL}/api/subtasks/task/${taskId}/subtasks`, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.data
    })).catch(e => ({
      statusCode: e.response?.status || 500,
      message: e.response?.data?.message || e.message
    }));
  }

  static async toggleSubtaskCompletion(subtaskId) {
    return axios.put(`${BASE_URL}/api/subtasks/toggle/${subtaskId}`, null, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.data
    })).catch(e => ({
      statusCode: e.response?.status || 500,
      message: e.response?.data?.message || e.message
    }));
  }
}

export default ApiService;