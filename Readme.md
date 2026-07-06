# Bulletin Board Backend

REST API for the Campus Bulletin Board application.

The backend provides authentication, notice management, event management, validation, and PostgreSQL database integration.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Redis
- JWT Authentication
- bcrypt
- cookie-parser

## Features

### Authentication

- User Login
- JWT Authentication
- Cookie-based Authentication
- Admin Middleware
- Token Blocklist using Redis

### Notices

- Create Notice (Admin)
- List Notices
- Get Notice by ID
- Search Notices
- Category Filter
- Pagination

### Events

- Create Event (Admin)
- List Events
- Get Event by ID
- Search Events
- Category Filter
- Date Range Filter
- Pagination

## Project Structure

```
src/
|- config/
|- controllers/
|- middleware/
|- routes/
|- utils/
|- index.js
```

## Installation

```bash
git clone https://github.com/anusthetic/Bulletin_Board

cd backend

npm install
```

Create a `.env` file.

```env
PORT=3000

DATABASE_URL=<postgresSQL-connection-string>

JWT_SECRET_KEY=<jwt-secret>

REDIS_PASS=<your-redis-pass>

REDIS_HOST=<your-redis-host>

REDIS_PORT=<your-redis-port>

CORS_ORIGIN=<frontend-origin>

caCertificate=<path-or-certificate-content>

```
> **Note:** `CA_CERTIFICATE` is only required if your PostgreSQL provider requires an SSL/TLS certificate. If you're using a local PostgreSQL instance, you can omit this variable.

Run the server.

```bash
nodemon sec/index.js
```

## API Overview

### Authentication

```
POST /user/register
POST /user/login
POST /user/logout
GET  /user/listUsers
GET /user/check
```

### Notices

```
POST /notices/createNotice
GET /notices/listNotices
GET /notices/:id
```

### Events

```
POST /events/createEvent
GET /events/listEvents
GET /events/:id
```

## Validation

The backend validates:

- Required fields
- Invalid dates
- Pagination parameters
- Date ranges
- Authentication
- Authorization

## Security

- JWT Authentication
- HTTP-only Cookies
- Password Hashing using bcrypt
- Redis Token Blocklist
- Protected Admin Routes

## Future Improvements

- Role management
- Refresh Tokens
- File Uploads
- Email Notifications
- Logging & Monitoring

---

## Notes

- API responses follow a consistent JSON structure.
- PostgreSQL is used for persistent storage.
- Redis is used for token invalidation after logout.





# Bulletin Board Frontend

A modern React-based frontend for the Campus Bulletin Board application. It allows users to browse campus notices and events, while administrators can create new notices and events through a clean and responsive interface.

## Tech Stack

- React
- React Router DOM
- Redux Toolkit
- React Hook Form
- Tailwind CSS
- DaisyUI
- Axios
- Vite

## Features

### User Features

- Browse campus notices
- Browse campus events
- Search notices/events by keyword
- Filter by category
- Infinite scrolling
- Notice detail page
- Event detail page
- Dark/Light theme support

### Admin Features

- Create Notice
- Create Event
- Authentication
- Protected Routes

## Project Structure

```
src/
|- api.js
|- authSlice.js
|- assets/
|- components/
|- pages/
|- store/
|- utils/
|- App.jsx
|- main.jsx
```

## Installation

```bash
git clone https://github.com/anusthetic/Bulletin_Board

cd frontend/vite-project

npm install
```

Create a `.env` file.

```env
VITE_API_URL=http://localhost:3000
```

Start the development server.

```bash
npm run dev
```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Design Decisions

- Responsive UI built with Tailwind CSS.
- DaisyUI components for consistent styling.
- React Hook Form for efficient form handling.
- Redux Toolkit for authentication state.
- Axios client with centralized API configuration.
- Reusable components to minimize duplication.

## Future Improvements

- Rich text editor for notices
- Image upload support
- Pagination controls
- Notification system
- Better admin dashboard

---

## Notes

- The implementation focuses on clean component structure and maintainability.
- Bonus features such as infinite scrolling, dark mode, and responsive UI have been included beyond the minimum requirements.
