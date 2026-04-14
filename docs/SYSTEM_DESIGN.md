# System Design Document (HLD) - DSA Sheet Web Application

> **Design Target: 10,000 – 50,000 Active Users**

---

## 1. Architecture Overview

```
                         ┌──────────────────────────┐
                         │      Users (Browsers)     │
                         │    10k – 50k active        │
                         └────────────┬───────────────┘
                                      │ HTTPS
                                      ▼
                         ┌──────────────────────────┐
                         │    AWS CloudFront (CDN)    │
                         │  Static assets (React SPA) │
                         │  Edge-cached globally      │
                         └────────────┬───────────────┘
                                      │
                    ┌─────────────────┴────────────────────┐
                    │                                       │
              ┌─────▼───────┐                     ┌────────▼──────────┐
              │  S3 Bucket   │                     │   AWS ALB          │
              │  (Frontend)  │                     │  (Load Balancer)   │
              │  Static SPA  │                     └────────┬──────────┘
              └──────────────┘                              │
                                          ┌─────────────────┼──────────────────┐
                                          │                  │                   │
                                   ┌──────▼──────┐  ┌───────▼──────┐  ┌────────▼──────┐
                                   │  EC2 #1      │  │  EC2 #2      │  │  EC2 #3       │
                                   │  Node.js     │  │  Node.js     │  │  Node.js      │
                                   │  Express     │  │  Express     │  │  Express      │
                                   └──────┬───────┘  └───────┬──────┘  └────────┬──────┘
                                          │                  │                   │
                                          └──────────┬───────┘───────────────────┘
                                                     │
                                          ┌──────────▼──────────┐
                                          │  ElastiCache Redis  │
                                          │  (Session-less      │
                                          │   caching layer)    │
                                          └──────────┬──────────┘
                                                     │
                                          ┌──────────▼──────────┐
                                          │   MongoDB Atlas     │
                                          │  (M30 Auto-scaling) │
                                          │  Primary + Replicas │
                                          └─────────────────────┘
```

### Component Responsibilities

| Component | Role | Why |
|-----------|------|-----|
| **CloudFront** | CDN for static React bundle | Serves frontend from edge locations worldwide, offloads 90%+ of requests |
| **S3** | Hosts built React SPA files | Cheap, durable, no server needed for frontend |
| **ALB** | Distributes API traffic across EC2 instances | Health checks, sticky sessions not needed (stateless JWT) |
| **EC2 (x2-3)** | Runs Node.js Express API | Horizontally scaled, each handles ~15-20k concurrent connections |
| **Redis (ElastiCache)** | Caches topic lists, rate limiting store | Topic data rarely changes — cache TTL of 5 min eliminates repeated DB reads |
| **MongoDB Atlas** | Persistent data store | Auto-scaling, managed backups, read replicas for query distribution |

---

## 2. Request Flow

### Authentication Flow
```
Client                    ALB                    EC2 (Express)              MongoDB
  │                        │                          │                        │
  │── POST /api/auth/login ──▶                        │                        │
  │                        │──── route to instance ──▶│                        │
  │                        │                          │── findOne({email}) ───▶│
  │                        │                          │◀── user document ──────│
  │                        │                          │                        │
  │                        │                          │ bcrypt.compare()       │
  │                        │                          │ jwt.sign({id})         │
  │                        │                          │                        │
  │◀──────────────── { token, user } ─────────────────│                        │
  │                                                                            │
  │ localStorage.setItem('token', token)                                       │
  │ All future requests: Authorization: Bearer <token>                         │
```

### Dashboard Load Flow (Optimized for Scale)
```
Client                    Express                       MongoDB
  │                          │                              │
  │── GET /api/topics ──────▶│                              │
  │   (Bearer token)         │                              │
  │                          │── verify JWT ────────────────│
  │                          │                              │
  │                          │── Check Redis cache ──▶ HIT? │
  │                          │   (topic list)          │    │
  │                          │                         │    │
  │                          │   MISS: Run 2 parallel queries:
  │                          │                              │
  │                          │── Query 1: Topics aggregate ─▶│ $lookup problems
  │                          │── Query 2: User progress ────▶│ $group by topic
  │                          │                              │
  │                          │◀── merge results ────────────│
  │                          │── Set Redis cache (5 min TTL) │
  │                          │                              │
  │◀──── topics[] with counts ──────────────────────────────│
```

**Key optimization:** Dashboard loads in **2 aggregation queries** instead of the naive N+1 approach (which would fire 30+ queries for 10 topics).

### Progress Toggle Flow
```
Client                    Express                       MongoDB
  │                          │                              │
  │── PUT /progress/:id ───▶│                              │
  │                          │── findOne({userId, problemId})▶│
  │                          │◀── progress doc or null ─────│
  │                          │                              │
  │                          │── toggle completed ──────────▶│ (upsert)
  │                          │── invalidate Redis cache ────│
  │                          │                              │
  │◀──── updated progress ──│                              │
  │                          │                              │
  │ Optimistic UI update     │                              │
  │ (checkbox toggles        │                              │
  │  instantly, no reload)   │                              │
```

---

## 3. Authentication Mechanism

| Aspect | Implementation | Reasoning |
|--------|---------------|-----------|
| **Method** | JWT (JSON Web Token) | Stateless — no server-side session storage, scales horizontally |
| **Algorithm** | HS256 | Symmetric, fast for single-service architecture |
| **Expiry** | 7 days | Balance between security and UX |
| **Storage** | localStorage | Simple; protected by CSP headers via Helmet.js |
| **Hashing** | bcrypt (12 rounds) | Industry standard, intentionally slow to resist brute force |
| **Password field** | `select: false` in Mongoose | Never returned in queries unless explicitly requested |

### Security Layers
1. **Helmet.js** — 11 HTTP security headers (CSP, X-Frame-Options, HSTS, etc.)
2. **Rate limiting** — 100 req/15min globally, 20 req/15min for login/register
3. **Body size limit** — 10kb max payload to prevent abuse
4. **CORS** — restricted to frontend origin only
5. **bcrypt** — password hashing with 12 salt rounds (~250ms per hash)

---

## 4. Scalability Design (10k – 50k Active Users)

### Load Estimation

| Metric | 10k Users | 50k Users |
|--------|-----------|-----------|
| **Concurrent users** (10% active) | 1,000 | 5,000 |
| **Requests/second** (avg 1 req/10s) | 100 RPS | 500 RPS |
| **Peak RPS** (3x avg) | 300 RPS | 1,500 RPS |
| **DB reads/sec** | 200 | 1,000 |
| **DB writes/sec** (progress toggles) | 20 | 100 |
| **UserProgress documents** | 800k | 4M |
| **Storage** | ~100 MB | ~500 MB |

### Strategy by Layer

#### Frontend (Handled by CDN — no scaling concern)
- React SPA served from **CloudFront** edge locations
- Assets cached globally with long TTLs
- Only API calls hit the backend — **zero server load for page loads**

#### API Layer (Horizontal Scaling)
```
10k users → 1 EC2 t3.medium   (2 vCPU, 4GB RAM)  — handles 100 RPS easily
25k users → 2 EC2 t3.medium   behind ALB          — handles 300 RPS
50k users → 3 EC2 t3.medium   behind ALB          — handles 500+ RPS
```
- **Stateless JWT** — any instance can serve any request (no sticky sessions)
- **ALB health checks** — auto-removes unhealthy instances
- **Auto Scaling Group** — spins up/down EC2 instances based on CPU/request count

#### Database Layer (Vertical + Read Scaling)
```
10k users → MongoDB Atlas M10   (2GB RAM, 2 vCPUs)
25k users → MongoDB Atlas M20   (4GB RAM, 2 vCPUs) + 1 read replica
50k users → MongoDB Atlas M30   (8GB RAM, 2 vCPUs) + 2 read replicas
```

#### Caching Layer (Eliminates Redundant Reads)
- **Redis (ElastiCache)** for:
  - Topic list cache (5 min TTL) — topics rarely change
  - Rate limiting counters (shared across EC2 instances)
- **Impact:** Reduces DB reads by ~80% for dashboard loads

### Implemented Optimizations (in code)

| Optimization | Before | After | Impact |
|-------------|--------|-------|--------|
| Dashboard queries | 30+ queries (N+1) | 2 aggregation queries | **15x fewer DB calls** |
| Mongoose hydration | Full Mongoose docs | `.lean()` plain objects | **2-5x faster reads** |
| Query execution | Sequential | `Promise.all()` parallel | **~50% latency reduction** |
| Response size | Raw JSON | Gzip compressed | **~70% smaller payloads** |
| Connection pool | 5 (default) | 10-50 configurable | **10x more concurrent DB connections** |
| Auth abuse | No limit | 20 attempts/15min | **Brute force protection** |
| API abuse | No limit | 100 requests/15min | **DDoS mitigation** |

### Bottleneck Analysis

| Component | Bottleneck at | Solution |
|-----------|--------------|----------|
| Single EC2 | ~15k users | Add ALB + 2nd EC2 |
| MongoDB reads | ~25k users | Add Redis cache + read replicas |
| MongoDB writes | ~100k users | Shard UserProgress collection |
| JWT validation | Not a bottleneck | CPU-only, no DB call |
| Static assets | Not a bottleneck | Fully served by CDN |

---

## 5. API Design

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|-----------|-------------|
| POST | `/api/auth/register` | No | 20/15min | Create new user account |
| POST | `/api/auth/login` | No | 20/15min | Login, returns JWT |
| GET | `/api/auth/me` | Yes | 100/15min | Get current user info |
| GET | `/api/topics` | Yes | 100/15min | List topics with progress (2 aggregation queries) |
| GET | `/api/topics/:id/problems` | Yes | 100/15min | Get problems with user progress (parallel queries) |
| PUT | `/api/progress/:problemId` | Yes | 100/15min | Toggle problem completion |
| GET | `/api/progress` | Yes | 100/15min | Get all completed problems |

### Response Format
```json
// Success
{ "token": "...", "user": { "id": "...", "name": "...", "email": "..." } }

// Error
{ "message": "Invalid email or password" }

// Rate limited
{ "message": "Too many requests, please try again later." }
```

---

## 6. Data Flow for Progress Tracking

```
┌─────────┐    checkbox click    ┌──────────┐    PUT /progress/:id    ┌──────────┐
│  React   │ ──────────────────▶ │  Axios   │ ─────────────────────▶ │ Express  │
│  State   │                     │ (+ JWT)  │                        │ Server   │
└────┬─────┘                     └──────────┘                        └────┬─────┘
     │                                                                     │
     │ optimistic update                                                   │
     │ (UI toggles immediately)                                            │
     │                                                              ┌──────▼──────┐
     │                                                              │  MongoDB    │
     │                                                              │  upsert     │
     │                                                              │  progress   │
     │                                                              └──────┬──────┘
     │                                                                     │
     │◀──────────────────── confirmation response ─────────────────────────│
     │
     │ If error: revert optimistic update
```

### Why Progress Persists Across Sessions
1. Each checkbox toggle **writes to MongoDB** (not just localStorage)
2. On login → dashboard fetches **user-specific progress** from DB
3. **Compound unique index** on `(userId, problemId)` ensures one record per user per problem
4. Progress is tied to the authenticated user — works on any device

---

## 7. Trade-offs & Decisions

| Decision | Chosen | Alternative | Why |
|----------|--------|-------------|-----|
| **Auth** | JWT in localStorage | HTTP-only cookies | Simpler for SPA; CSP headers mitigate XSS |
| **Database** | MongoDB | PostgreSQL | Document model fits nested topics/problems naturally; flexible schema |
| **Caching** | Redis (recommended) | In-memory | Shared across EC2 instances; survives restarts |
| **Progress writes** | Per-click DB write | Batch/debounce | Real-time accuracy; write volume is low (~20-100/sec) |
| **Frontend hosting** | S3 + CloudFront | EC2 serving static | 10x cheaper, infinitely scalable, zero maintenance |
| **Scaling** | Horizontal (ALB + EC2) | Vertical (bigger instance) | Linear cost scaling; no single point of failure |
| **Query strategy** | Aggregation pipeline | N+1 with caching | Fewer DB round-trips; works without cache layer |
| **Password hashing** | bcrypt (12 rounds) | Argon2 | bcryptjs has zero native dependencies; 12 rounds = ~250ms |
