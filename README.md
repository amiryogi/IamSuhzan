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
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=choose_a_strong_password
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

This creates the admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD` and default categories. The seed refuses to run without both set.

Alternatively, on an empty database the first `POST /api/auth/register` creates the admin account; registration is closed as soon as any user exists.

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

## Admin Access

Only users with the `admin` role can change content, read messages or upload media. Change the password any time from **Dashboard → Settings**.

## Features

### Public Portfolio
- ✨ Stunning hero section with parallax
- 🖼️ Masonry gallery with category filtering
- 👤 About section with stats
- 🏆 Achievements timeline
- 📚 Services & pricing cards
- 🔍 Fullscreen lightbox with zoom, swipe and keyboard navigation
- 🔗 Shareable artwork links (`/gallery?artwork=<slug>`)
- 💬 Enquire / commission buttons that pre-fill the contact form
- 📧 Contact form with spam protection (honeypot + rate limit)

### Admin Dashboard
- 📊 Stats overview
- 🎨 Artwork CRUD operations
- 📤 Media upload (images & videos)
- 🏷️ Category management
- 🔐 JWT authentication (admin role required, rate-limited login, password change)
- 👁️ Drafts and hidden items stay visible in the dashboard

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
| POST | /api/auth/login | Login (rate-limited) |
| PUT | /api/auth/password | Change password |
| GET | /api/artworks | Get published artworks (`?includeHidden=true` adds drafts for admins) |
| POST | /api/artworks | Create artwork |
| PUT | /api/artworks/:id | Update artwork |
| DELETE | /api/artworks/:id | Delete artwork |
| POST | /api/upload/image | Upload image |
| POST | /api/upload/video | Upload video |

## License

MIT
