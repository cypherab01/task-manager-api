# Task Manager API

A full-featured task management REST API built with Next.js 16, Prisma ORM, and PostgreSQL. This API provides user authentication and CRUD operations for managing tasks with JWT-based authorization.

## Features

- **User Authentication**: Register and login with secure password hashing (bcrypt)
- **JWT Authorization**: Secure API endpoints with JSON Web Tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Status Tracking**: Track tasks with three statuses: `PENDING`, `IN_PROGRESS`, `COMPLETED`
- **User Isolation**: Users can only access and manage their own tasks
- **Database**: PostgreSQL with Prisma ORM

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/cypherab01/task-manager-api
cd task-manager-api
```

2. Install dependencies:

```bash
npm install
# or
bun install
```

3. Set up environment variables:

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/task_manager"
JWT_SECRET="your-secret-key-here"
```

4. Run database migrations:

```bash
npx prisma migrate deploy
# or generate the Prisma client
npx prisma generate
```

5. Start the development server:

```bash
npm run dev
# or
bun dev
```

The API will be available at `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### Register a New User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (201):**

```json
{
  "user": {
    "id": "clxxx...",
    "email": "john@example.com"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx...",
    "email": "john@example.com"
  }
}
```

### Task Endpoints

All task endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

#### Get All Tasks

```http
GET /api/tasks
Authorization: Bearer <token>
```

**Response (200):**

```json
[
  {
    "id": "clxxx...",
    "title": "Complete project",
    "description": "Finish the task manager API",
    "status": "IN_PROGRESS",
    "userId": "clxxx...",
    "createdAt": "2024-11-02T10:00:00.000Z",
    "updatedAt": "2024-11-02T11:00:00.000Z"
  }
]
```

#### Create a Task

```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description"
}
```

**Response (201):**

```json
{
  "message": "Task created successfully",
  "task": {
    "title": "New Task",
    "description": "Task description",
    "status": "PENDING"
  }
}
```

#### Update Task Status

```http
PATCH /api/tasks/[id]
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "COMPLETED"
}
```

**Valid Status Values:**

- `PENDING`
- `IN_PROGRESS`
- `COMPLETED`

**Response (200):**

```json
{
  "id": "clxxx...",
  "title": "Task title",
  "description": "Task description",
  "status": "COMPLETED",
  "userId": "clxxx...",
  "createdAt": "2024-11-02T10:00:00.000Z",
  "updatedAt": "2024-11-02T12:00:00.000Z"
}
```

#### Delete a Task

```http
DELETE /api/tasks/[id]
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "message": "Task deleted successfully"
}
```

## Database Schema

### User Model

```prisma
model User {
  id        String    @id @default(cuid())
  name      String
  email     String    @unique
  password  String
  tasks     Task[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### Task Model

```prisma
model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(PENDING)
  user        User       @relation(fields: [userId], references: [id])
  userId      String
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}
```

## Error Responses

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**

```json
{
  "error": "Error message description"
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Commands

- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client
- `npx prisma studio` - Open Prisma Studio (database GUI)

## Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
4. Deploy!

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A strong, random secret key for JWT signing

## Security Notes

- Passwords are hashed using bcrypt with a salt factor of 10
- JWT tokens expire after 7 days
- All task operations verify user ownership
- SQL injection protection through Prisma ORM

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
