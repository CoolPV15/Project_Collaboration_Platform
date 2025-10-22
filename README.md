# Project Collaboration Platform
A platform designed for people to form teams and collaborate on various projects built using React as the frontend and Django to handle the backend with Postgres as the database. 
Django API handles the authentication (registration,login,logout) using JSON web tokens. (JWT)
## 🚀 Features
- User registration & login with JWT authentication
- RESTful API using Django REST Framework
- PostgreSQL as the database
- React frontend styled with Tailwind CSS
- Axios for API calls
  
## 🛠️ Prerequisites / Environment Setup

Make sure you have the following installed:

- **Git** – [Download](https://git-scm.com/downloads)
- **Node.js** (≥ 18.x) & **npm** – [Download](https://nodejs.org/)
- **Python** (≥ 3.11) – [Download](https://www.python.org/downloads/)
- **PostgreSQL** – [Download](https://www.postgresql.org/download/)
- **pip** and **virtualenv** for Python dependencies

## 📦 Tech Stack

| Layer         | Technology                    |
|---------------|------------------------------|
| Frontend      | React 19.1.1 + Tailwind CSS   |
| Backend API   | Django 5.2.6 + Django REST Framework |
| Auth          | JWT Authentication            |
| Database      | PostgreSQL                    |
| HTTP Client   | Axios                         |

### Frontend (React)

1. Open a new terminal and go to the frontend directory:
    ```bash
    cd collab-app
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the React development server:
    ```bash
    npm run dev
    ```
By default, the React app runs on `http://localhost:5173/`.
### Backend (Django)
1. Clone the repository:
    ```bash
    git clone https://github.com/CoolPV15/Project_Collaboration_Platform.git
    cd Project_Collaboration_Platform/projecto
    ```
2. Create and activate a virtual environment:
    ```bash
    # Windows
    python -m venv venv
    venv\Scripts\activate
    ```
5. Apply migrations:
    ```bash
    python manage.py migrate
    ```
6. Run the backend server:
    ```bash
    python manage.py runserver
    ```

By default, the API runs on `http://127.0.0.1:8000/`.

---

## ⚙️ Configuration Notes

- Tailwind CSS is already configured in `tailwind.config.js`.
- JWT tokens are stored securely in local storage 
