# DSA Sheet Web Application - Implementation Plan

## Context
Building a full-stack DSA Sheet web app for a Technical Lead assignment. The app lets students browse DSA topics/problems, access learning resources (YouTube, LeetCode, articles), track difficulty levels, and save progress via checkboxes. Must be deployed on AWS.

## Tech Stack
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (access + refresh tokens) + bcrypt for password hashing

## Project Structure
```
Assignment/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Login, Register, Dashboard, SheetPage
│   │   ├── context/           # AuthContext
│   │   ├── api/               # Axios instance + API calls
│   │   └── App.jsx
│   └── tailwind.config.js
├── server/                    # Express backend
│   ├── models/                # Mongoose schemas (User, Topic, Problem, Progress)
│   ├── routes/                # Auth, Topics, Problems, Progress routes
│   ├── middleware/            # Auth middleware (JWT verify)
│   ├── controllers/           # Route handlers
│   ├── data/                  # Seed data (DSA topics + problems)
│   └── server.js
├── docs/
│   ├── SYSTEM_DESIGN.md       # HLD document
│   └── DATABASE_SCHEMA.md     # LLD document
└── README.md
```

## Database Schema (MongoDB)

### Users Collection
```
{ _id, name, email, password (hashed), createdAt }
```

### Topics Collection
```
{ _id, name, slug, description, order }
```
e.g., Arrays, Linked Lists, Trees, Graphs, DP, etc.

### Problems Collection
```
{ _id, topicId (ref), title, difficulty (Easy|Medium|Hard),
  youtubeUrl, leetcodeUrl, articleUrl, order }
```

### UserProgress Collection
```
{ _id, userId (ref), problemId (ref), completed (bool), completedAt }
```
Compound index on (userId, problemId) for fast lookups.

## Key API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/auth/me | Get current user |
| GET | /api/topics | List all topics with problem counts |
| GET | /api/topics/:id/problems | Get problems for a topic |
| PUT | /api/progress/:problemId | Toggle problem completion |
| GET | /api/progress | Get all progress for current user |

## Implementation Steps

### Step 1: Backend Setup
- Initialize Node.js project in `server/`
- Set up Express, MongoDB connection, env config
- Create Mongoose models (User, Topic, Problem, UserProgress)
- Implement auth routes (register, login, me) with JWT + bcrypt
- Implement topic/problem CRUD routes
- Implement progress toggle route
- Add auth middleware

### Step 2: Seed Data
- Create seed script with ~10 DSA topics and ~80-100 problems
- Include real YouTube, LeetCode, and article links for each problem
- Topics: Arrays, Strings, Linked Lists, Stacks & Queues, Trees, Graphs, Dynamic Programming, Greedy, Backtracking, Bit Manipulation

### Step 3: Frontend Setup
- Initialize React + Vite project in `client/`
- Install & configure Tailwind CSS
- Set up React Router, Axios instance, Auth context

### Step 4: Frontend Pages
- **Login/Register pages** — form with validation, JWT stored in localStorage
- **Dashboard** — grid/list of all DSA topics with progress summary per topic
- **Topic Detail page** — table of problems with difficulty badges, resource links (YouTube/LeetCode/Article icons), and checkboxes
- **Progress persistence** — checkbox toggles call API, state updates optimistically

### Step 5: UI Polish
- Responsive design (mobile-friendly)
- Difficulty color coding (Green/Yellow/Red)
- Progress bars per topic on dashboard
- Clean navigation with logout

### Step 6: Documentation
- System Design Document (HLD) — architecture diagram (text), request flow, auth flow, scalability notes for 10k-50k users
- Database Schema Document (LLD) — collections, relationships, indexes

### Step 7: Deployment Prep
- Add build scripts, environment variable handling
- Document AWS deployment steps in README

## Verification
1. Start backend: `cd server && npm run dev` — server runs on port 5000
2. Start frontend: `cd client && npm run dev` — app runs on port 5173
3. Register a new user, login, browse topics, check off problems
4. Refresh/re-login — progress should persist
5. Test responsive design on mobile viewport
