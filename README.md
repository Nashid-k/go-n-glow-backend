# Go N Glow - Salon Booking Platform (Backend)

Backend API for the Go N Glow salon booking platform built with Node.js, Express, TypeScript, and MongoDB.

## Features

- ✅ JWT-based authentication and authorization
- ✅ Role-based access control (User / Admin)
- ✅ RESTful API design
- ✅ MongoDB database with Mongoose ODM
- ✅ Input validation and error handling
- ✅ CORS enabled for frontend integration
- ✅ Mocked OTP for password reset

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **Language**: TypeScript
- **Development**: Nodemon + ts-node

## API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - Login user
- `POST /forgot-password` - Send OTP (mocked)
- `POST /verify-otp` - Verify OTP and reset password
- `GET /me` - Get current user (protected)

### Salons (`/api/salons`)
- `GET /` - List all salons with filters (city, search)
- `GET /:id` - Get salon details
- `GET /:id/availability` - Get available time slots
- `POST /` - Create salon (admin only)
- `PUT /:id` - Update salon (admin only)
- `DELETE /:id` - Delete salon (admin only)

### Services (`/api/services`)
- `GET /` - List services (with filters: salonId, category)
- `POST /` - Create service (admin only)
- `PUT /:id` - Update service (admin only)
- `DELETE /:id` - Delete service (admin only)

### Bookings (`/api/bookings`)
- `POST /` - Create booking (protected)
- `GET /` - Get user's bookings (protected)
- `GET /:id` - Get booking details (protected)
- `PUT /:id/cancel` - Cancel booking (protected)
- `GET /admin/all` - Get all bookings (admin only)

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create environment file**:
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/go-n-glow
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

3. **Start MongoDB**:
   Make sure MongoDB is running locally or use MongoDB Atlas.

4. **Run the server**:
   ```bash
   # Development mode with hot reload
   npm run dev

   # Production build
   npm run build
   npm start
   ```

The API will be available at `http://localhost:5000`

## Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: 'user' | 'admin',
  location: { city: String },
  createdAt: Date,
  updatedAt: Date
}
```

### Salon Collection
```javascript
{
  name: String,
  description: String,
  location: { address: String, city: String },
  images: [String],
  rating: Number,
  reviewCount: Number,
  openingHours: Map,
  services: [ObjectId],
  createdAt: Date
}
```

### Service Collection
```javascript
{
  salonId: ObjectId,
  name: String,
  description: String,
  category: String,
  price: Number,
  duration: Number (minutes),
  image: String
}
```

### Booking Collection
```javascript
{
  userId: ObjectId,
  salonId: ObjectId,
  serviceIds: [ObjectId],
  date: Date,
  timeSlot: String,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  totalPrice: Number,
  notes: String
}
```

## Project Structure

```
src/
├── config/           # Database configuration
├── controllers/      # Request handlers
├── middleware/       # Auth and error handling
├── models/          # Mongoose schemas
├── routes/          # API routes
└── server.ts        # Entry point
```

## Development Notes

- The OTP flow is a development-only mock; password-reset routes return `501` in production until a real delivery and verification provider is configured
- Default admin user must be created manually in the database
- All passwords are hashed using bcrypt before storage
- JWT tokens expire after 30 days

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a strong JWT_SECRET
3. Use MongoDB Atlas for database
4. Consider adding rate limiting middleware
5. Enable HTTPS

## Author

FlipmaxxGlobal LLP Full Stack Developer Assignment
# go-n-glow-backend
