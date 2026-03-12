# Wellness Session Management Platform (Firebase Edition)

A production-ready full-stack platform for managing and moderating wellness sessions, migrated to **Firebase** for serverless scalability.

## Features

- **Firebase Authentication**: Secure login/register with ID token verification.
- **Firestore Database**: Real-time NoSQL database for users and sessions.
- **Session Management**: Full CRUD operations with a **5-second debounced autosave**.
- **Admin Dashboard**: Analytics, user management, and session moderation.
- **Modern UI**: Dark mode, responsive design with ShadCN UI and TailwindCSS.

## Tech Stack

### Frontend
- Next.js 14, TypeScript, TailwindCSS, ShadCN UI, TanStack Query, Firebase Client SDK.

### Backend
- Node.js & Express.js, Firebase Admin SDK (Firestore & Auth).

## Setup Instructions

### 1. Firebase Project Setup
1.  Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Authentication**: Enable Email/Password provider.
3.  **Enable Firestore**: Create a database in "Production Mode".
4.  **Backend (Admin SDK)**: 
    - Go to Project Settings -> Service Accounts -> Generate new private key.
    - Copy the JSON and minify it to a single string for the `.env` file.
5.  **Frontend (Client SDK)**:
    - Go to Project Settings -> General -> Your apps -> Add Web App.
    - Copy the `firebaseConfig` object for your `.env.local`.

### 2. Backend Setup
```bash
cd backend
npm install
```
Create `.env`:
```
PORT=5000
FIREBASE_SERVICE_ACCOUNT='{"type": "service_account", ...}'
NODE_ENV=development
```
Run: `npm run dev`

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Run: `npm run dev`

## Admin Panel Access
1.  Register an account.
2.  In Firestore, find your user document in the `users` collection.
3.  Change `role` to `"admin"`.
4.  Login again to see the Admin Sidebar.
