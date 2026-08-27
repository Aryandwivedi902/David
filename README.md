# The Grand Horizon Resort & Spa - Full-Stack Hotel Website Demo

A complete, production-ready premium hotel reservation portal and administration dashboard demo. Built with a high-end **React Three Fiber (WebGL) 3D frontend**, **Node.js Express API**, and **PostgreSQL database** through **Prisma ORM**.

---

## Technical Stack & Architecture

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Three.js, React Three Fiber, Drei, Lucide Icons.
- **Backend**: Node.js, Express, JWT, bcrypt, Cors, Helmet, express-rate-limit, Zod.
- **Database & ORM**: PostgreSQL, Prisma ORM.
- **Containerization**: Docker Compose (Local Database).
- **Deployment-Ready**: Vercel (Frontend), Render (Express API + database integration).

```text
                    INTERNET
                        |
                        ↓
                 VERCEL (Frontend)
                     |
                     | HTTPS REST API
                     ▼
                  RENDER (Express REST API)
                     |
                     | Prisma Client
                     ▼
                PostgreSQL Database
```

---

## Directory Structure

```text
hotel-demo/
├── frontend/             # Next.js web application
│   ├── app/              # Routing pages (Home, Rooms, Booking, Admin)
│   ├── components/       # Reusable React & 3D graphics canvas elements
│   ├── lib/              # API Client fetch calls & Zod validators
│   ├── public/           # Images & assets
│   ├── styles/           # Globals Tailwind stylesheet
│   └── package.json
├── backend/              # Node Express API server
│   ├── src/
│   │   ├── config/       # Database connections
│   │   ├── controllers/  # API request input parsing & validation
│   │   ├── middleware/   # Rate limiting, Error catching, JWT verification
│   │   ├── routes/       # Endpoint maps
│   │   ├── services/     # SQL Transaction logics
│   │   └── app.ts / server.ts
│   ├── prisma/           # PostgreSQL Prisma schema and seeding script
│   └── package.json
├── docker-compose.yml    # Database container launcher
└── README.md
```

---

## Local Setup & Development

### 1. Database Initialization
Spin up a local PostgreSQL instance using Docker Compose:
```bash
docker compose up -d
```
*Alternatively, you can provide an external database URL (e.g. Supabase or Neon).*

### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy the `.env.example` file to create your environment variables:
   ```bash
   cp .env.example .env
   ```
3. Run the database migration to apply the PostgreSQL tables:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Run the database seed script to populate the rooms and create the default admin account:
   ```bash
   npm run prisma:seed
   ```
5. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   *The REST API will boot at `http://localhost:5000/api`.*

### 3. Frontend Configuration
1. Open another terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Copy the `.env.local.example` file:
   ```bash
   cp .env.local.example .env.local
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *Open `http://localhost:3000` inside your browser.*

---

## Administrative Sign-In Credentials

To access the admin dashboard at `/admin/login`, use:
- **Email**: `admin@grandhorizon.com`
- **Password**: `admin1234`

### Hashing and Resetting Passwords Safely
To change or reset passwords safely:
1. Generate a hashed representation of the new password using the `bcrypt` script in the database seed file.
2. Update the `passwordHash` column directly in the `admins` table. Do not expose or write passwords in cleartext inside frontend files.

---

## API Documentation Reference

All API payloads use structured JSON format.

### Health Status Check
- **GET** `/api/health`
  - *Response*: `{ "status": "OK" }`

### Public Suites Catalog
- **GET** `/api/rooms` - Retrieve all rooms.
- **GET** `/api/rooms/:slug` - Retrieve details of a specific suite.
- **GET** `/api/rooms/availability` - Search available suites.
  - *Query Params*: `checkIn=YYYY-MM-DD`, `checkOut=YYYY-MM-DD`, `guests=Number`

### Client Reservation Operations
- **POST** `/api/bookings` - Submit reservation checkout.
- **GET** `/api/bookings/:id` - Retrieve stay summary details.
- **POST** `/api/bookings/:id/cancel` - Cancel reservation.

### Customer Feedback
- **POST** `/api/contact` - Submit contact form inquiry.

### Authentication
- **POST** `/api/auth/login` - Authenticate administrator credentials (returns JWT string).
- **POST** `/api/auth/logout` - Discard session.
- **GET** `/api/auth/me` - Query administrator account details.

---

## Production Security Checklist

- [ ] Disable dev stack trace leaks by setting `NODE_ENV=production` in backend.
- [ ] Replace default database seeds credentials and change the administrative email.
- [ ] Update `JWT_SECRET` variables with a secure cryptographically random string.
- [ ] Set `FRONTEND_URL` in the backend environment to permit CORS only from the designated Vercel domain.
- [ ] Ensure `DATABASE_URL` is kept private inside the backend hosting platform and is **never** prefixed with `NEXT_PUBLIC_` or exposed to Next.js clients.
