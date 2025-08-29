# Backend API

Express.js backend with TypeScript, Prisma, and PostgreSQL for user authentication.

## Features

- ✅ User registration and login with JWT tokens
- ✅ Login with username OR email (both unique)
- ✅ No password restrictions
- ✅ TypeScript for type safety
- ✅ Prisma ORM with PostgreSQL
- ✅ Secure password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Input validation and error handling
- ✅ CORS enabled
- ✅ Security headers with Helmet
- ✅ Request logging with Morgan

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy the `.env` file and update the database URL:
   ```bash
   cp .env.example .env
   ```
   
   Update the DATABASE_URL in `.env`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/stride_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3001
   NODE_ENV=development
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run database migrations
   npm run prisma:migrate
   ```

4. **Seed the database with initial data (optional):**
   ```bash
   npm run prisma:seed
   ```
   This will create 3 users:
   - Admin: `admin@stride.com` (username: `admin`, password: `asdf`)
   - User 1: `john@example.com` (username: `john_doe`, password: `asdf`)
   - User 2: `jane@example.com` (username: `jane_smith`, password: `asdf`)

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:reset` - Reset database
- `npm run prisma:seed` - Seed database with initial data

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "anypassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "clx123...",
    "username": "john_doe",
    "email": "john@example.com",
    "isAdmin": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "john_doe",
  "password": "anypassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "clx123...",
    "username": "john_doe",
    "email": "john@example.com",
    "isAdmin": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "clx123...",
    "username": "john_doe",
    "email": "john@example.com",
    "isAdmin": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Logout (Protected)
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": ["Detailed error messages"] // Optional
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials/token)
- `409` - Conflict (username/email already exists)
- `404` - Not Found
- `500` - Internal Server Error

## Database Schema

### User Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  isAdmin BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Features

- Passwords are hashed using bcrypt with 12 salt rounds
- JWT tokens for stateless authentication
- CORS enabled for cross-origin requests
- Security headers with Helmet
- Input validation and sanitization
- No password restrictions (as requested)

## Development

The project uses:
- **TypeScript** for type safety
- **Prisma** as the ORM
- **PostgreSQL** as the database
- **Express.js** as the web framework
- **JWT** for authentication
- **bcrypt** for password hashing

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `JWT_EXPIRES_IN` | JWT token expiration time | `7d` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
