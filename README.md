# Suhzan Fine Art Portfolio

A beautiful, modern portfolio website for showcasing fine art with an admin dashboard for managing artworks.

## Tech Stack

- **Frontend**: React 18, Vite 7, Tailwind CSS 4.1, Framer Motion
- **Backend**: Node.js, Express 5, MongoDB, Mongoose
- **Media Storage**: Cloudinary
- **Authentication**: JWT

## Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Cloudinary account

## Setup

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env` with your credentials:

```env
MONGODB_URI=mongodb://localhost:27017/art-portfolio
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

This creates an admin user and default categories.

### 4. Run Development Servers

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

## Access

- **Portfolio**: http://localhost:5173
- **Admin Login**: http://localhost:5173/login
- **Dashboard**: http://localhost:5173/dashboard

## Default Admin Credentials

- **Email**: admin@artportfolio.com
- **Password**: Admin@123

## Features

### Public Portfolio
- ✨ Stunning hero section with parallax
- 🖼️ Masonry gallery with category filtering
- 👤 About section with stats
- 🏆 Achievements timeline
- 📚 Services & pricing cards
- 📧 Contact form

### Admin Dashboard
- 📊 Stats overview
- 🎨 Artwork CRUD operations
- 📤 Media upload (images & videos)
- 🏷️ Category management
- 🔐 JWT authentication

## Project Structure

```
IamSuhzan/
├── backend/
│   ├── config/         # DB & Cloudinary config
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth & error handling
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   └── server.js       # Express app
│
└── frontend/
    ├── src/
    │   ├── components/ # React components
    │   ├── context/    # Auth context
    │   ├── hooks/      # Custom hooks
    │   ├── pages/      # Page components
    │   └── services/   # API client
    └── index.html
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| GET | /api/artworks | Get all artworks |
| POST | /api/artworks | Create artwork |
| PUT | /api/artworks/:id | Update artwork |
| DELETE | /api/artworks/:id | Delete artwork |
| POST | /api/upload/image | Upload image |
| POST | /api/upload/video | Upload video |

## License

MIT
