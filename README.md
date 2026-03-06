# PrimeTrade AI — Full Stack Assignment

A full-stack task management application built with a Node.js/Express REST API backend and a React frontend.

---

## Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Backend     | Node.js, Express.js                      |
| Database    | PostgreSQL (Neon) via Prisma ORM         |
| Auth        | JWT (jsonwebtoken) + bcrypt              |
| Security    | Helmet, CORS                             |
| Docs        | Swagger UI (swagger-jsdoc)              |
| Frontend    | React (Vite), Axios, React Router DOM   |
| Environment | dotenv                                   |

---

## Project Structure

```
primetradeai_assign/
├── app.js
├── server.js
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/          # App config & Prisma client
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, role, error, 404
│   ├── routes/          # Express routers
│   ├── services/        # Business logic & DB calls
│   └── utils/           # Logger
└── frontend/
    └── src/
        ├── api/         # Axios instance + API functions
        ├── components/  # PrivateRoute
        └── pages/       # Login, Register, Dashboard
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- A PostgreSQL database (e.g. Neon)

### Backend

```bash
# 1. Clone the repo
git clone https://github.com/kartik-singhhh03/Primetradeai_assign.git
cd Primetradeai_assign

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET in .env

# 4. Run database migration
npx prisma migrate dev

# 5. Start the server
npm run dev        # development (nodemon)
npm start          # production
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # runs at http://localhost:5173
```

---

## Environment Variables

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=your_postgres_connection_url
JWT_SECRET=your_super_secret_key
```

---

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Auth

| Method | Endpoint          | Description       | Auth Required |
|--------|-------------------|-------------------|---------------|
| POST   | `/auth/register`  | Register new user | No            |
| POST   | `/auth/login`     | Login & get token | No            |

**Register body:**
```json
{ "name": "John", "email": "john@example.com", "password": "secret123" }
```

**Login body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```

**Login response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt>",
    "user": { "id": "...", "name": "John", "email": "...", "role": "USER" }
  }
}
```

### Tasks

All task endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint       | Description              | Notes                        |
|--------|----------------|--------------------------|------------------------------|
| POST   | `/tasks`       | Create a task            | Authenticated user           |
| GET    | `/tasks`       | Get all tasks            | USER sees own tasks only     |
| GET    | `/tasks/:id`   | Get single task          | USER sees own tasks only     |
| PUT    | `/tasks/:id`   | Update task              | USER can only update own     |
| DELETE | `/tasks/:id`   | Delete task              | USER can only delete own     |

**Create/Update body:**
```json
{ "title": "Buy groceries", "description": "Milk, eggs", "completed": false }
```

---

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)   // USER | ADMIN
  createdAt DateTime @default(now())
  tasks     Task[]
}

model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## Swagger Docs

Once the backend is running, visit:

```
http://localhost:3000/api-docs
```

---

## Scalability Notes

This backend is designed with scalability in mind. Here is how it can grow:

### Horizontal Scaling
The Express server is stateless — JWT tokens carry all session data, so multiple instances can run behind a load balancer (e.g. AWS ALB or Nginx) without any shared session store. Spinning up more replicas increases throughput linearly.

### Load Balancer
A reverse proxy like **Nginx** or a cloud load balancer routes traffic across instances, handles SSL termination, and enables zero-downtime deployments via rolling restarts.

### Redis Caching
Frequently accessed data (e.g. task lists, user profiles) can be cached in **Redis** with a short TTL. This reduces database round-trips and significantly cuts response times under heavy read load.

```
Client → Load Balancer → Express Instance(s) → Redis (cache hit)
                                              ↘ PostgreSQL (cache miss)
```

### Microservices Architecture
As the system grows, the monolith can be split into independent services:
- **Auth Service** — handles registration, login, token refresh
- **Task Service** — CRUD for tasks
- **Notification Service** — emails, push notifications

Each service can be deployed, scaled, and updated independently.

### Message Queues
For operations that don't need an immediate response (emails, audit logs, notifications), a message queue like **RabbitMQ** or **AWS SQS** decouples the work from the request cycle. The API publishes an event and returns instantly; a background worker processes it asynchronously.

---

## Error Response Format

All errors return a consistent shape:

```json
{ "success": false, "message": "Descriptive error message" }
```

---

## Author

Kartik Singh — [GitHub](https://github.com/kartik-singhhh03)
