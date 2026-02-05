# Project Startup Guide

## Prerequisites
- Node.js installed
- MongoDB installed and running locally
- **Database URL**: The backend uses `mongodb://localhost:27017/siddha` by default. You can change this in `backend/.env` if needed.

## Backend Setup
The backend is now consolidated into a single file for simplicity.

1. Navigate to the `backend` folder:
   ```bash
   cd siddha/backend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   *or*
   ```bash
   npm start
   ```

**Note**: The server will automatically create a default Admin user if one does not exist:
- **Email**: `admin@siddhaveda.com`
- **Password**: `admin123`

## Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd siddha/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Project Structure
- **Backend**: All logic is in `backend/server.js`.
- **Frontend Admin**: Admin Dashboard files are located in `frontend/src/admin/`.
- **Authentication**: Uses a hardcoded secret key for simplicity as requested.

## Features
- **Unified Server**: Single file backend for easy management.
- **Auto-Admin Creation**: Admin account created automatically on first run.
- **Role-Based Access**: Students go to User Dashboard, Admins go to Intelligence Dashboard.
