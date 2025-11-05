![React](https://img.shields.io/badge/Frontend-React-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-yellow)
![Render](https://img.shields.io/badge/Deployed%20On-Render-purple)
![Live Demo](https://img.shields.io/badge/Live-Demo-green)
![License](https://img.shields.io/badge/License-MIT-lightgrey)
![GitHub last commit](https://img.shields.io/github/last-commit/SarikaG13/taskapp-frontend)
![Repo size](https://img.shields.io/github/repo-size/SarikaG13/taskapp-frontend)

A fullstack task management application built with React and Spring Boot.  
Supports JWT authentication, email reminders, SQL persistence, and modular architecture.  
Deployed on Render with separate frontend and backend services.

---📘 Task App Manager - Frontend — React + JWT + Render


**Live Demo:**: https://taskapp-frontend-8x0n.onrender.com  
**Backend API**: https://taskapp-backend-1-ryqr.onrender.com

### 🚀 Tech Stack

React (CRA)  
React Router v6  
JWT Authentication  
Axios  
react-hot-toast  
Render (static site deployment)

### 📁 Folder Structure

public/
├── robots.txt
├── manifest.json

src/
├── api/             # Axios-based ApiService with JWT headers
│   └── ApiService.js
├── common/          # Shared components
│   ├── ErrorBoundary.jsx
│   ├── Footer.jsx
│   └── Navbar.jsx
├── pages/           # Route-based views
│   ├── Guard.js
│   ├── HomePage.jsx
│   ├── Login.jsx / Login.css
│   ├── Register.jsx
│   ├── TaskFormPage.jsx / TaskForm.css
│   ├── TaskPage.jsx
│   ├── PrivacyPage.jsx / TermsPage.jsx
├── App.js           # Route layout
├── App.css
├── App.test.js
└── static.json 

✅ Follows enterprise-grade separation of concerns
✅ Supports protected routing via Guard.js
✅ Error handling via ErrorBoundary.jsx


### 🔐 Auth Flow

- JWT is stored in localStorage after login/register.  
- Protected routes use Guard.js.  
- Axios attaches Authorization: Bearer <token> to every request.

### ✅ Features

- ✅ Task CRUD with priority, due date, completion toggle
- ✅ Subtask management (add/edit/delete/toggle)
- ✅ Email reminder integration via backend scheduler
- ✅ Search, filter by priority/status
- ✅ Circular progress summary widget
- ✅ Responsive UI with toast feedback
- ✅ Error boundaries and route guards

### 🧪 Installation

1. Clone the repo  
   `git clone https://github.com/SarikaG13/taskapp-frontend.git`  
   `cd taskapp-frontend`

2. Create `.env`  
   `REACT_APP_API_BASE_URL=https://taskapp-backend-1-ryqr.onrender.com`

3. Install dependencies  
   `npm install`

4. Run locally  
   `npm start`

5. Build for production  
   `npm run build`
   
🧪 Postman + API Flo

Includes:
- /auth/register
- /auth/login
- /api/tasks
- /api/subtasks
- /api/tasks/summary
- /api/tasks/reminder-status


### 👥 Contributors

**Sarika G** — Aspiring Junior Fullstack Developer & Architect

### 🧠 Future Enhancements
 
- Drag-and-drop task reordering  
- Slack/Telegram reminder integration
