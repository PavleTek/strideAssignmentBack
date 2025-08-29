# Backend

Express.js backend with TypeScript, Prisma, and PostgreSQL.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database running locally
- npm or yarn

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database URL and other variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/stride_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3001
   NODE_ENV=development
   ```

3. **Set up the database:**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Start the development server:**
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
- `npm run prisma:seed` - Seed database with initial data

## Deployment to Railway

1. **Add a PostgreSQL service** to your Railway project
2. **Deploy the backend** by connecting your repository
3. **Add environment variables** from your `.env` file to Railway:
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `PORT`
   - `NODE_ENV`
4. **Replace the `DATABASE_URL`** with the PostgreSQL connection string provided by Railway
5. **Run database migrations** using the Railway console:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
