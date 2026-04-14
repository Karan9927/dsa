# Database Schema Document (LLD) - DSA Sheet Web Application

## Database: MongoDB (NoSQL Document Store)
## ODM: Mongoose

---

## 1. Collections Overview

```
┌──────────┐       ┌──────────┐       ┌──────────────┐
│  Users   │       │  Topics  │       │   Problems   │
│          │       │          │◄──────│              │
│  _id     │       │  _id     │  1:N  │  topicId     │
│  name    │       │  name    │       │  title       │
│  email   │       │  slug    │       │  difficulty  │
│  password│       │  desc    │       │  youtubeUrl  │
│          │       │  order   │       │  leetcodeUrl │
└────┬─────┘       └──────────┘       │  articleUrl  │
     │                                │  order       │
     │                                └──────┬───────┘
     │                                       │
     │         ┌───────────────┐             │
     └────────►│ UserProgress  │◄────────────┘
        1:N    │               │     N:1
               │  userId       │
               │  problemId    │
               │  completed    │
               │  completedAt  │
               └───────────────┘
```

## 2. Collection Schemas

### 2.1 Users

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Primary key |
| `name` | String | Required, trimmed | User's display name |
| `email` | String | Required, unique, lowercase | Login identifier |
| `password` | String | Required, min 6 chars, `select: false` | bcrypt-hashed password |
| `createdAt` | Date | Default: `Date.now` | Account creation timestamp |

**Mongoose Schema:**
```javascript
{
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, minlength: 6, select: false },
  createdAt: { type: Date, default: Date.now }
}
```

**Pre-save Hook:** Hashes password with bcrypt (12 salt rounds) on create/update.

---

### 2.2 Topics

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Primary key |
| `name` | String | Required, trimmed | Topic display name (e.g., "Dynamic Programming") |
| `slug` | String | Required, unique | URL-friendly identifier (e.g., "dynamic-programming") |
| `description` | String | Default: `''` | Brief topic description |
| `order` | Number | Default: `0` | Display sort order |

**Mongoose Schema:**
```javascript
{
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  order:       { type: Number, default: 0 }
}
```

---

### 2.3 Problems

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Primary key |
| `topicId` | ObjectId | Required, ref: 'Topic' | Foreign key to Topics collection |
| `title` | String | Required, trimmed | Problem name (e.g., "Two Sum") |
| `difficulty` | String | Required, enum: Easy/Medium/Hard | Difficulty level |
| `youtubeUrl` | String | Default: `''` | YouTube tutorial link |
| `leetcodeUrl` | String | Default: `''` | LeetCode/Codeforces practice link |
| `articleUrl` | String | Default: `''` | Article/theory reference link |
| `order` | Number | Default: `0` | Display sort order within topic |

**Mongoose Schema:**
```javascript
{
  topicId:     { type: ObjectId, ref: 'Topic', required: true },
  title:       { type: String, required: true, trim: true },
  difficulty:  { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  youtubeUrl:  { type: String, default: '' },
  leetcodeUrl: { type: String, default: '' },
  articleUrl:  { type: String, default: '' },
  order:       { type: Number, default: 0 }
}
```

---

### 2.4 UserProgress

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Primary key |
| `userId` | ObjectId | Required, ref: 'User' | Foreign key to Users |
| `problemId` | ObjectId | Required, ref: 'Problem' | Foreign key to Problems |
| `completed` | Boolean | Default: `false` | Whether problem is marked done |
| `completedAt` | Date | Default: `null` | Timestamp of completion |

**Mongoose Schema:**
```javascript
{
  userId:      { type: ObjectId, ref: 'User', required: true },
  problemId:   { type: ObjectId, ref: 'Problem', required: true },
  completed:   { type: Boolean, default: false },
  completedAt: { type: Date, default: null }
}
```

---

## 3. Relationships

| Relationship | Type | Description |
|-------------|------|-------------|
| Topic → Problems | One-to-Many | Each topic contains multiple problems |
| User → UserProgress | One-to-Many | Each user has progress records |
| Problem → UserProgress | One-to-Many | Each problem can be tracked by multiple users |
| (User, Problem) → UserProgress | Unique pair | One progress record per user per problem |

---

## 4. Indexing Strategy

| Collection | Index | Type | Purpose |
|-----------|-------|------|---------|
| Users | `{ email: 1 }` | Unique | Fast login lookups by email |
| Topics | `{ slug: 1 }` | Unique | URL-based topic lookups |
| Problems | `{ topicId: 1, order: 1 }` | Compound | Fetch problems by topic, sorted |
| UserProgress | `{ userId: 1, problemId: 1 }` | Compound, Unique | Fast progress lookups, prevent duplicates |

### Index Rationale
- **Users.email:** Every login requires an email lookup — must be indexed and unique.
- **Problems.topicId + order:** The most common query fetches all problems for a topic, sorted by order. The compound index serves both the filter and sort.
- **UserProgress.userId + problemId:** This is queried on every page load (to show checkmarks) and on every toggle. The compound unique index ensures fast lookups and prevents duplicate progress records.

---

## 5. Data Volume Estimates (10k-50k users)

| Collection | Estimated Documents | Avg Doc Size | Total Size |
|-----------|-------------------|-------------|------------|
| Users | 10k - 50k | ~200 bytes | 2MB - 10MB |
| Topics | 10 | ~150 bytes | ~1.5KB |
| Problems | 80 - 100 | ~300 bytes | ~30KB |
| UserProgress | 800k - 5M | ~100 bytes | 80MB - 500MB |

**Key Insight:** UserProgress is the largest collection (users x problems). The compound index is critical for performance at scale.

---

## 6. Query Patterns

### Most Frequent Queries
1. **Dashboard load:** Aggregate problem counts per topic for a user
   ```
   Topics.find().sort({ order: 1 })
   Problems.countDocuments({ topicId })
   UserProgress.countDocuments({ userId, problemId: { $in: [...] }, completed: true })
   ```

2. **Topic detail load:** Fetch problems with user's completion status
   ```
   Problems.find({ topicId }).sort({ order: 1 })
   UserProgress.find({ userId, problemId: { $in: [...] }, completed: true })
   ```

3. **Toggle progress:** Upsert a single progress record
   ```
   UserProgress.findOne({ userId, problemId })
   // toggle completed field or create new
   ```
