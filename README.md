# 🌓 Task Manager App (React Native + Node.js + MongoDB)

A simple **Task Management App** built using **React Native (Expo)** for the frontend and **Node.js + Express + MongoDB** for the backend.  
It allows users to manage daily tasks with features like **Add, Edit, Delete, Complete, and Filter** — all in a **Dark Premium (Midnight + Gold)** theme.

---

## ⚙️ Tech Stack
- **Frontend:** React Native (Expo)  
- **Backend:** Node.js + Express  
- **Database:** MongoDB (via Mongoose)  
- **Animation:** Lottie React Native  
- **Auth:** JWT-based Authentication  
- **Storage:** AsyncStorage (for token handling)

---

## 🧩 Features

### 🅐 Authentication  
- User Signup & Login (with password hashing)  
- JWT authentication using tokens stored securely in AsyncStorage  
- Auto-login with splash screen  

---

### 🅑 Task Management  
- Add, Edit, and Delete Tasks  
- Mark tasks as Completed  
- Search and Filter by title or status  
- Real-time backend filtering with query parameters  
- Animated success (Lottie gold check) when a task is completed  

---

### 🅒 UI & Theme  
- Midnight black + gold “premium” theme  
- Responsive and minimal layout  
- Floating “Add Task” button  
- Custom bottom bar navigation (Home, Profile, Stats, Logout)  

---

## ✨ Extra Features
- Task statistics panel (Total, Pending, Completed)  
- Smooth gold animation when marking tasks complete  
- Local error handling & toasts for better UX  
- Added, Edit, and Delete Tasks  
- MongoDB persistence instead of temporary in-memory storage  

---
### 🔗 Links

🎥 **[Watch Demo Video Here](https://drive.google.com/file/d/1TZJorwTL4Ms0REwrfrK6VTM29bW7IFxx/view?usp=drive_link)**  

🗄️ **[MongoDB Images (Database Preview)](https://drive.google.com/drive/folders/1RchmnPFz3YCdcA2HaDUFq0NN-Jlnyt1E?usp=sharing)**

## ⚙️ Setup Instructions

### 🖥️ Backend Setup
```bash
cd TaskMApp_Backend
npm install

Create a .env file:
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key

Then run:
node server.js
Backend runs at 👉 http://localhost:3000

📱 Frontend Setup (Expo)
cd TaskMApp
npm install
npx expo start


Update API base URL in /src/services/api.js:

const BASE_URL = "http://YOUR_IP:3000/api";



👨‍💻 Developed By
Sudhanshu Dwivedi
🎓 B.Tech CSE (Data Science) | ABESIT
💡 Passionate about clean UI, problem-solving, and full-stack development.
