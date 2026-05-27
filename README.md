# TaskFlow — Task Management Web Application

> A full-stack task manager built with React.js + Node.js + Express + MongoDB

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, React Router v6, Context API, Axios   |
| Backend    | Node.js, Express.js, JWT, express-validator      |
| Database   | MongoDB + Mongoose                              |
| Auth       | JWT (Bearer tokens), bcryptjs                   |
| DevOps     | Docker, Docker Compose, Nginx                   |
| Testing    | Jest, Supertest                                 |
| Deployment | Render / Railway / Vercel (see below)           |

---

## Features

### Frontend
- 🔐 Login & Signup with form validation
- 📋 Dashboard with task list, stats, and completion rate
- ➕ Create / ✏️ Edit / 🗑️ Delete tasks
- ✅ Toggle task status (Pending ↔ Completed)
- 🔍 Real-time search with debounce
- 🎛️ Filter by status (All / Pending / Completed) + priority
- 📄 Pagination with configurable page size
- 🌙 Dark / Light mode toggle
- 📱 Fully responsive (mobile + desktop)
- ⚡ Skeleton loading states
- 🏷️ Task tags, due dates, priority levels

### Backend
- 🔑 JWT authentication with 7-day expiry
- 🛡️ Protected routes, role-based access (user / admin)
- 📦 Full CRUD REST API for tasks
- 🔍 Server-side search, filtering, sorting, pagination
- 🚦 Rate limiting (100 req/15min general, 20 req/hr for auth)
- 🪖 Security headers via Helmet
- ✅ Input validation with express-validator
- 🧯 Centralized error handling
- 📊 Task stats aggregation

---

## Project Structure

```
taskflow/
├── docker-compose.yml
├── TaskFlow.postman_collection.json
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   ├── jest.config.js
│   └── src/
│       ├── server.js
│       ├── config/
│       │   └── db.js
│       ├── models/
│       │   ├── User.js
│       │   └── Task.js
│       ├── controllers/
│       │   ├── authController.js
│       │   └── taskController.js
│       ├── middleware/
│       │   ├── auth.js
│       │   ├── validate.js
│       │   └── errorHandler.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   └── taskRoutes.js
│       └── __tests__/
│           └── auth.test.js
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── src/
        ├── App.js
        ├── index.js
        ├── index.css
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── TaskContext.jsx
        │   └── ThemeContext.jsx
        ├── hooks/
        │   ├── useForm.js
        │   └── useDebounce.js
        ├── services/
        │   └── api.js
        ├── utils/
        │   └── validation.js
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── Dashboard.jsx
        │   └── *.css
        └── components/
            ├── auth/ProtectedRoute.jsx
            ├── layout/Navbar.jsx
            └── tasks/
                ├── StatsBar.jsx
                ├── TaskFilters.jsx
                ├── TaskCard.jsx
                ├── TaskModal.jsx
                └── Pagination.jsx
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm or yarn

### 1. Clone the repo

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env 
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_very_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

```bash
npm install
npm run dev     # development with nodemon
# or
npm start       # production
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start       # runs on http://localhost:3000
```

### 4. Run with Docker (Recommended)

```bash
# From project root
docker-compose up --build

# Frontend → http://localhost:3000
# Backend  → http://localhost:5000
# MongoDB  → localhost:27017
```

---

## API Reference

> Import `TaskFlow.postman_collection.json` into Postman for interactive docs.

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint          | Access  | Description         |
|--------|-------------------|---------|---------------------|
| POST   | /auth/register    | Public  | Register new user   |
| POST   | /auth/login       | Public  | Login user          |
| GET    | /auth/me          | Private | Get current user    |
| PUT    | /auth/profile     | Private | Update profile      |

**Register / Login response:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": { "_id": "...", "name": "Jane", "email": "jane@example.com", "role": "user" }
}
```

**Use token in subsequent requests:**
```
Authorization: Bearer <token>
```

---

### Task Endpoints

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | /tasks                | Get all tasks (filters + paginate) |
| POST   | /tasks                | Create a new task                  |
| GET    | /tasks/:id            | Get single task                    |
| PUT    | /tasks/:id            | Update task                        |
| PATCH  | /tasks/:id/toggle     | Toggle pending ↔ completed         |
| DELETE | /tasks/:id            | Delete single task                 |
| DELETE | /tasks                | Delete all completed tasks         |

**GET /tasks — Query Parameters:**

| Param    | Type   | Default      | Description                            |
|----------|--------|--------------|----------------------------------------|
| status   | string | all          | `all` \| `pending` \| `completed`     |
| priority | string | —            | `high` \| `medium` \| `low`           |
| search   | string | —            | Search in title & description          |
| page     | number | 1            | Page number                            |
| limit    | number | 10           | Items per page (max 50)               |
| sort     | string | -createdAt   | Field to sort by (prefix `-` for desc)|

**GET /tasks response:**
```json
{
  "success": true,
  "tasks": [...],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "stats": { "pending": 28, "completed": 14, "total": 42 }
}
```

**Task object:**
```json
{
  "_id": "64f...",
  "title": "Build the landing page",
  "description": "Design and code the new homepage",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-06-01T00:00:00.000Z",
  "tags": ["design", "frontend"],
  "user": "64e...",
  "createdAt": "2026-05-27T10:00:00.000Z",
  "updatedAt": "2026-05-27T10:00:00.000Z"
}
```

---

## Running Tests

```bash
cd backend
npm test              # run all tests
npm test -- --coverage  # with coverage report
```

---

## Deployment

### Backend → Render
1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo, set root directory to `backend/`
3. Build command: `npm install`
4. Start command: `node src/server.js`
5. Add environment variables (MONGODB_URI, JWT_SECRET, etc.)

### Frontend → Vercel
1. Import project on [vercel.com](https://vercel.com)
2. Set root directory to `frontend/`
3. Add env variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`
4. Deploy

### Database → MongoDB Atlas
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Copy the connection string to your backend's `MONGODB_URI`

---

## Database Design

### Users Collection
```
_id, name, email (unique), password (hashed), role (user|admin), avatar, createdAt, updatedAt
```

### Tasks Collection
```
_id, title, description, status (pending|completed), priority (low|medium|high),
dueDate, tags[], user (ref: User), createdAt, updatedAt

Indexes:
  - { user, status }       → fast filter queries
  - { user, createdAt }    → fast sort queries
  - { title, description } → text search
```

---

## Assumptions Made

1. **Single-user task ownership** — users can only see/manage their own tasks. No task sharing.
2. **JWT stored in localStorage** — acceptable for this scope; production apps may prefer httpOnly cookies.
3. **MongoDB** chosen as the database for flexible schema and ease of setup.
4. **No email verification** — registration is immediate for demo purposes.
5. **Soft deletes not implemented** — tasks are hard-deleted for simplicity.
6. **Timezone** — dates stored in UTC, displayed in user's locale.

---

## Environment Variables Reference

| Variable        | Required | Description                          |
|-----------------|----------|--------------------------------------|
| PORT            | No       | Server port (default: 5000)          |
| MONGODB_URI     | Yes      | MongoDB connection string            |
| JWT_SECRET      | Yes      | Secret key for signing JWTs          |
| JWT_EXPIRES_IN  | No       | Token expiry (default: 7d)           |
| NODE_ENV        | No       | development / production             |
| FRONTEND_URL    | No       | CORS allowed origin                  |

---

## License

MIT
