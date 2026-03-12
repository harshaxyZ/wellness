# Wellness Session Management Platform

A production-ready full-stack platform for managing and moderating wellness sessions, built with Next.js, Node.js, and MongoDB.

## Features

- **Robust Authentication**: JWT-based auth with secure password hashing (Bcrypt).
- **Session Management**: Full CRUD operations for wellness programs.
- **Advanced Editor**: Session builder with a **5-second debounced autosave** system.
- **Admin Dashboard**: 
  - Real-time analytics charts using Recharts.
  - User management (Block/Delete).
  - Session moderation (Approve/Reject).
- **Modern UI**: Dark mode, responsive design, and SaaS aesthetic using ShadCN UI and TailwindCSS.
- **Security**: Helmet, Rate Limiting, CORS, and role-based authorization.

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- ShadCN UI
- TanStack Query
- Axios

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT (Authentication)
- Bcrypt (Hashing)
- Express-rate-limit & Helmet (Security)

## Setup Instructions

### 1. MongoDB Setup
Ensure you have MongoDB installed and running locally on `mongodb://localhost:27017/wellness-platform`.

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wellness-platform
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
NODE_ENV=development
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend` folder:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Sessions
- `GET /api/sessions` - Get user's sessions
- `POST /api/sessions` - Create new draft
- `GET /api/sessions/:id` - Get session details
- `PUT /api/sessions/:id` - Update session
- `PATCH /api/sessions/:id/autosave` - Specialized autosave endpoint

## Admin Panel Access

By default, all registered users have the `user` role. To access the Admin Dashboard:

1.  Register an account through the app.
2.  Open your MongoDB shell or a tool like MongoDB Compass.
3.  In the `wellness-platform` database, find your user in the `users` collection.
4.  Change the `role` field from `"user"` to `"admin"`.
5.  Log out and log back in. The **Admin** section will now be visible in the sidebar.

Through the Admin Dashboard, you can:
- **Overview**: View platform-wide analytics and charts.
- **Users**: Block or delete users (Admins cannot be blocked/deleted).
- **Moderation**: Approve draft sessions or move published sessions back to draft.
