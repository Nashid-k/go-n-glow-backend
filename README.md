# Go N Glow — Salon Booking API

Backend API for the Go N Glow salon booking platform, built with Node.js, Express, TypeScript and MongoDB.

## Features

- JWT-based signup, login and protected endpoints
- Role-based access control for user and admin operations
- Salon discovery and service catalogue
- Appointment booking and cancellation
- MongoDB persistence with Mongoose
- Password hashing with bcryptjs
- Configurable CORS origin

## Stack

Node.js, Express, TypeScript, MongoDB/Mongoose, JWT, bcryptjs and Nodemon.

## Run locally

```bash
git clone https://github.com/Nashid-k/go-n-glow-backend.git
cd go-n-glow-backend
npm install
cp .env.example .env
npm run dev
```

The API defaults to port `5000`.

## Environment

| Variable | Purpose |
|---|---|
| `PORT` | API port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Required high-entropy signing secret; the server refuses to start without it |
| `CLIENT_URL` | Frontend origin allowed by CORS |
| `NODE_ENV` | Set to `production` in production |

## API routes

- `/api/auth` — signup, login, current-user and password-reset routes
- `/api/salons` — salon discovery and admin management
- `/api/services` — service catalogue and admin management
- `/api/bookings` — booking creation, listing and cancellation

## Security notes

The OTP password-reset flow is a development mock, not a real email/SMS verification system. Both reset endpoints return `501` in production until a real OTP delivery, expiry, storage and verification provider is implemented. Do not use the mock OTP as a real account-recovery mechanism.
