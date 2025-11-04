import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://taskapp-backend-1-ryqr.onrender.com";

class ApiService {
  static handleError(e) {
    console.error("❌ API Error:", e.response || e.message);
    return {
      statusCode: e.response?.status || 500,
      message: e.response?.data?.message || e.message,
      data: null
    };
  }

  // AUTH
  static async registerUser(body) {
    return axios.post(`${BASE_URL}/api/auth/register`, body)
      .then(r => ({
        statusCode: r.status,
        data: r.data
      }))
      .catch(ApiService.handleError);
  }

  static async loginUser(body) {
    return axios.post(`${BASE_URL}/api/auth/login`, body)
      .then(r => ({
        statusCode: r.status,
        data: r.data.data
      }))
      .catch(ApiService.handleError);
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

  // TASKS
  static async createTask(body) {
    return axios.post(`${BASE_URL}/api/tasks`, body, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.data.data
    })).catch(ApiService.handleError);
  }

  static async updateTask(task) {
    if (!task?.id) {
      return { statusCode: 400, message: "Task ID must not be null", data: null };
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
      data: r.data.data
    })).catch(ApiService.handleError);
  }

  static async getAllMyTasks() {
    return axios.get(`${BASE_URL}/api/tasks/all`, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.data.data
    })).catch(ApiService.handleError);
  }

  static async getTaskById(taskId) {
    return axios.get(`${BASE_URL}/api/tasks/${taskId}`, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.data.data
    })).catch(ApiService.handleError);
  }

  static async deleteTask(taskId) {
    return axios.delete(`${BASE_URL}/api/tasks/task/${taskId}`, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.status === 204 ? null : r.data
    })).catch(ApiService.handleError);
  }

  static async getMyTasksByCompletionStatus(completed) {
    return axios.get(`${BASE_URL}/api/tasks/status`, {
      headers: ApiService.getHeader(),
      params: { completed }
    }).then(r => ({
      statusCode: r.status,
      data: r.data.data
    })).catch(ApiService.handleError);
  }

  static async getMyTasksByPriority(priority) {
    return axios.get(`${BASE_URL}/api/tasks/priority`, {
      headers: ApiService.getHeader(),
      params: { priority }
    }).then(r => ({
      statusCode: r.status,
      data: r.data.data
    })).catch(ApiService.handleError);
  }

  static async getTaskSummary() {
    return axios.get(`${BASE_URL}/api/tasks/summary`, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.data.data
    })).catch(ApiService.handleError);
  }

  static async refreshTaskSummary(setTaskSummary) {
    try {
      const res = await ApiService.getTaskSummary();
      if (res.statusCode === 200) {
        setTaskSummary(res.data);
      }
    } catch (e) {
      console.error("Failed to refresh summary:", e);
    }
  }

  static async getReminderStatus() {
    return axios.get(`${BASE_URL}/api/tasks/reminder-status`, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.data.data
    })).catch(ApiService.handleError);
  }

  static async findByTitle(title) {
    return axios.get(`${BASE_URL}/api/tasks/search`, {
      headers: ApiService.getHeader(),
      params: { title }
    }).then(r => ({
      statusCode: r.status,
      data: r.data.data
    })).catch(ApiService.handleError);
  }

  static async getTasksDueTodayAndOverdue() {
    return axios.get(`${BASE_URL}/api/tasks/overdue`, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.data.data
    })).catch(ApiService.handleError);
  }

  // SUBTASKS
  static async createSubtask(subtaskPayload) {
    if (!subtaskPayload?.taskId) {
      return { statusCode: 400, message: "Task ID must not be null", data: null };
    }

    return axios.post(`${BASE_URL}/api/subtasks`, subtaskPayload, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.data.data
    })).catch(ApiService.handleError);
  }

  static async updateSubtask(subtaskId, payload) {
    return axios.put(`${BASE_URL}/api/subtasks/${subtaskId}`, payload, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.data.data
    })).catch(ApiService.handleError);
  }

  static async deleteSubtask(subtaskId) {
    return axios.delete(`${BASE_URL}/api/subtasks/${subtaskId}`, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.status === 204 ? null : r.data
    })).catch(ApiService.handleError);
  }

  static async getSubtasksByTaskId(taskId) {
    return axios.get(`${BASE_URL}/api/subtasks/task/${taskId}/subtasks`, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.data.data
    })).catch(ApiService.handleError);
  }

  static async toggleSubtaskCompletion(subtaskId) {
    return axios.put(`${BASE_URL}/api/subtasks/toggle/${subtaskId}`, null, {
      headers: ApiService.getHeader()
    }).then(r => ({
      statusCode: r.status,
      data: r.data.data
    })).catch(ApiService.handleError);
  }
}

export default ApiService;