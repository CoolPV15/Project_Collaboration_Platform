# 🌐 Project Collaboration Platform (Projecto)
![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwindcss)
![Django](https://img.shields.io/badge/Backend-Django-green?logo=django)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens)

A **project collaboration platform** designed for people to form teams and work together on projects.  
Users can **create projects, join teams, manage collaboration requests, and collaborate efficiently**.  

Built using:
- **React** (Frontend)
- **Tailwind CSS** (Styling)
- **Django REST Framework** (Backend)
- **PostgreSQL** (Database)
- **JWT** (Authentication)
---

## ✨ Key Features

### 👤 User & Authentication
* **Secure Access:** Register, login, and logout using JWT authentication.
* **Session Management:** Automatic token refresh and secure session handling.
* **Dashboard:** Personalized user-specific dashboard.

### 📁 Project Management
* **Create Projects:** Easily start new projects.
* **Join Teams:** Browse and submit requests to join existing projects.
* **Manage Requests:** Project owners can accept or reject team member requests.
* **Overview:** View joined projects and track pending requests.

---

## 🛠️ Prerequisites / Environment Setup

Make sure you have the following installed:

- **Git** – [Download](https://git-scm.com/downloads)
- **Node.js** (≥ 18.x) & **npm** – [Download](https://nodejs.org/)
- **Python** (≥ 3.11) – [Download](https://www.python.org/downloads/)
- **PostgreSQL** – [Download](https://www.postgresql.org/download/)
- **pip** and **virtualenv** for Python dependencies

## 🧩 Tech Stack

| **Layer** | **Technology** |
| :--- | :--- |
| **Frontend** | React 19.1.1 + Tailwind CSS |
| **Backend** | Django 5.2.6 + Django REST Framework |
| **Authentication** | JWT (SimpleJWT) |
| **Database** | PostgreSQL |
| **API Client** | Axios |

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/CoolPV15/Project_Collaboration_Platform.git
cd Project_Collaboration_Platform
```

## Frontend Setup (React)
1️⃣ Navigate to the frontend folder:
```bash
cd collab-app
```

2️⃣ Install dependencies
#### Windows/macOS/Linux:
```bash
npm install
npm install axios
```

3️⃣ Start development server
```bash
npm run dev
```

Frontend runs at: 👉 http://localhost:5173/

## Backend Setup (Django)
1️⃣ Navigate to backend:
```bash
cd projecto
```

2️⃣ Create & activate virtual environment
#### macOS
```bash
python3 -m venv venv
source venv/bin/activate
```
#### Windows
```bash
python -m venv venv
venv\Scripts\activate
```

3️⃣ Install backend dependencies:
```bash
pip install -r requirements.txt
```

4️⃣ Apply migrations:
```bash
python manage.py migrate
```

5️⃣ Start backend server:
```bash
python manage.py runserver
```

Backend runs at: 👉 http://127.0.0.1:8000/

## Database Setup (PostgreSQL)
1️⃣ Create Database
```bash
CREATE DATABASE projectodb;
```

2️⃣ Update your settings.py:
```bash
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "projectodb",
        "USER": "<your_username>",
        "PASSWORD": "<your_password>",
        "HOST": "localhost",
        "PORT": "5432",
    }
}
```

## 🔐 Authentication Flow (JWT)

The backend issues two tokens for secure session handling:

| Token | Purpose |
| :--- | :--- |
| **Access Token** | Used for authenticated API requests |
| **Refresh Token** | Generates new access tokens |

**Storage:**
Tokens are stored in `localStorage` as `access_token` and `refresh_token`.

**Request Header:**
Each protected request must include the following header:
```http
Authorization: Bearer <access_token>
```

## 📡 API Overview

### 🔑 Authentication Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/accounts/` | Register new user |
| `POST` | `/api/token/` | Generates a token |
| `POST` | `/api/token/verify/` | Verify a token |
| `POST` | `/api/token/refresh/` | Refresh the token |
| `GET` | `/api/account/home/` | Retrieves User Details |
| `POST` | `/api/logout/` | Invalidate session |

### 📁 Project Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/jprojectleads/` | Creates a new project |
| `GET` | `/api/jprojectleads/` | Fetches all projects created by a user |
| `GET` | `/api/projects/` | Displays projects to join |
| `POST` | `/api/projectrequest/` | Submit join request |
| `GET` | `/api/projectrequestdisplay/` | Displays join request to owner 
| `POST` | `/api/projectmembers/` | Adds a new member to the project |
| `POST` | `/api/projectrejectedview/` | Adds rejected user requests |
| `GET` | `/api/joinedprojects/` | Fetch projects user has joined |
| `GET` | `/api/projectmembersdisplay/` | Get project members |
| `GET` | `/api/pendingprojects/` | Fetch pending join requests |
| `DELETE` | `/api/projectrequest/` | Deletes a request |
---

## 📁 Folder Structure

```text
Project_Collaboration_Platform/
│
├── collab-app/          # Frontend (React)
│   ├── src/    
│   ├── public/
│   └── package.json
│
├── projecto/            # Backend (Django)
│   ├── accounts/
│   ├── projects/
│   ├── projecto/
│   ├── manage.py
│
└── README.md
```

## 📜 License

This project is open-source and available under the MIT License.