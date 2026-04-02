# 📝 Blog Platform (Spring Boot + React + MongoDB)

A full-stack blog platform with authentication, posts, comments, likes, follows, and moderation features.

---

##  Tech Stack

### Backend

* Java + Spring Boot
* Spring Security (JWT Authentication)
* MongoDB
* Maven

### Frontend

* React (Vite)
* Axios
* Context API (Auth State)

---

##  Features

* User authentication (JWT-based)
*  Create, update, delete posts
*  Comment system (with replies)
*  Like/unlike posts
*  Follow/unfollow users
*  Moderator features (report + resolve)
*  Threaded comments
*  Optimized MongoDB schema (denormalized counters)

---

##  Project Structure

### Backend

```
controller/     → API endpoints
service/        → Business logic
repository/     → MongoDB access
model/          → Database schemas
dto/            → Request/response objects
security/       → JWT + auth config
config/         → App configuration + seeder
```

---

### Frontend

```
api/            → API calls
components/     → Reusable UI components
pages/          → Route-based pages
context/        → Global auth state
```

---

##  Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd blog-project
```

---

##  Backend Setup

### 2. Configure MongoDB

Make sure MongoDB is running locally:

```bash
mongod
```

Update `application.properties`:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/blogDB_dev
```

---

### 3. Run backend

```bash
cd backend
./mvnw spring-boot:run
```

---

###  Seeder (IMPORTANT)

On first run, the app automatically seeds:

*  Admin user
*  Test user
*  Sample posts

#### Default Credentials

```
Admin:
username: admin
password: admin123

User:
username: testuser
password: 123456
```

 Seeder runs ONLY if database is empty.

---

##  Frontend Setup

### 4. Install dependencies

```bash
cd frontend
npm install
```

---

### 5. Run frontend

```bash
npm run dev
```

App runs on:

```
http://localhost:5173
```

---

##  API Base URL

Ensure frontend API calls point to backend:

```
http://localhost:8080/api
```

If using Vite proxy, configure:

```js
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```

---

##  How It Works

### Authentication Flow

1. User logs in → receives JWT
2. JWT stored in frontend
3. Sent in headers:

```
Authorization: Bearer <token>
```

4. Backend validates via JWT filter

---

### Data Design (MongoDB)

* Posts → main collection
* Comments → separate (scalable)
* Likes / Follows → relationship collections
* Counters → denormalized (`like_count`, `comment_count`)

---

##  Development Workflow

### Reset database

```bash
use blogDB_dev
db.dropDatabase()
```

Restart backend → seeder runs again.

---


