# DSA Sheet Web Application - Progress Tracker

## Project Status: In Development

---

## Completed Tasks

### Backend
- [x] Express.js server setup with MongoDB connection
- [x] User model with bcrypt password hashing
- [x] Topic model with slug-based identification
- [x] Problem model with difficulty levels and resource URLs
- [x] UserProgress model with compound index (userId + problemId)
- [x] JWT authentication (register, login, /me endpoint)
- [x] Auth middleware for protected routes
- [x] Topics API with problem counts and user progress aggregation
- [x] Problems API with per-user completion status
- [x] Progress toggle API (mark/unmark problems)
- [x] Seed script with 10 topics and 80+ real DSA problems

### Frontend
- [x] React + Vite project setup
- [x] Tailwind CSS integration
- [x] Linear-inspired design system applied (DESIGN.md)
- [x] Auth context with JWT token management
- [x] Axios instance with auth interceptor (auto-attach token, 401 redirect)
- [x] Protected route component
- [x] Login page with form validation
- [x] Register page with form validation
- [x] Dashboard page with topic grid and overall progress
- [x] Topic detail page with problem table, checkboxes, and resource links
- [x] Responsive navbar with user info and logout
- [x] Difficulty badges (Easy/Medium/Hard color-coded)
- [x] Resource links (YouTube, LeetCode, Article)
- [x] Progress persistence across sessions

### Design & Documentation
- [x] DESIGN.md - Linear-inspired design system
- [x] IMPLEMENTATION_PLAN.md - Full project plan
- [x] PROGRESS.md - This file

---

## Pending Tasks

### Documentation
- [ ] System Design Document (HLD) - `docs/SYSTEM_DESIGN.md`
- [ ] Database Schema Document (LLD) - `docs/DATABASE_SCHEMA.md`

### Deployment
- [ ] Deploy backend to AWS (EC2/Elastic Beanstalk)
- [ ] Deploy frontend to AWS (S3 + CloudFront)
- [ ] Set up MongoDB Atlas for production database
- [ ] Configure environment variables for production
- [ ] Share live AWS deployment link

### Video Deliverable
- [ ] Record 2-5 min walkthrough video
  - [ ] Application flow demo
  - [ ] Key features overview
  - [ ] Progress tracking functionality

---

## Tech Stack Summary
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Design | Linear-inspired dark theme |

## Project Structure
```
Assignment/
├── client/          # React frontend
├── server/          # Express backend
├── docs/            # HLD & LLD documents
├── DESIGN.md        # Styling guide
├── PROGRESS.md      # This file
└── IMPLEMENTATION_PLAN.md
```
