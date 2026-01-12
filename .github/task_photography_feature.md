# TASK: COMPLETE PHOTOGRAPHY FEATURE – EXISTING PORTFOLIO

## Context

- Portfolio is already built with:
  - Frontend: React (Vite), Vanilla JS, TailwindCSS (Vercel)
  - Backend: Node.js, Express.js, MongoDB (Render)
  - Admin dashboard already exists
- Current dynamic features:
  - Hero slider
  - Awards
  - Projects
- New photography feature must be fully integrated:
  - Backend: API + Mongoose model
  - Frontend: Home page section + Photography page
  - Navbar link
  - Admin dashboard CRUD form for photography

---

## Backend Requirements

1. Create a new **Mongoose model** `Photography`:

- Fields:
  - `title` (string, required)
  - `description` (string, optional)
  - `imageUrl` (string, required)
  - `category` (string, optional)
  - `dateTaken` (Date, optional)
- Add timestamps for created/updated

2. Create **REST API routes** `/api/photography`:

- `GET /` – fetch all photography works
- `GET /latest` – fetch latest 3–6 works for home page
- `POST /` – create new photo (admin only)
- `PUT /:id` – update photo (admin only)
- `DELETE /:id` – delete photo (admin only)

3. Use **existing auth middleware** for admin routes
4. Include proper validation and error handling
5. Keep API structure consistent with existing portfolio

---

## Frontend Requirements

### 1️⃣ Navbar

- Add **Photography menu item** linking to `/photography`
- Maintain existing styling and mobile responsiveness

### 2️⃣ Home Page Section

- Display **latest 3–6 photography works**
- Use **responsive grid layout** (TailwindCSS)
- Each photo clickable to **open modal/lightbox view**
- Fetch data from `GET /api/photography/latest`

### 3️⃣ Photography Page

- Dedicated `/photography` page
- Display **all photography works** in grid layout
- Optional: filter by `category`
- Clicking a photo opens **larger view/modal**
- Fetch data from `GET /api/photography`

### 4️⃣ Admin Dashboard

- Add CRUD form for photography:
  - Fields: title, description, imageUrl, category, dateTaken
  - Buttons: Add, Edit, Delete
  - Reuse existing dashboard components/styles
  - Connect to `/api/photography` routes
  - Validate inputs and handle errors

---

## Constraints

- Do not modify existing Hero, Awards, Projects features
- Maintain consistent **coding style** and TailwindCSS styling
- No TypeScript
- Minimal changes outside the photography feature
- Include comments explaining assumptions

---

## Output Expectations

- **Backend**: Mongoose model, routes, controllers
- **Frontend**:
  - Navbar update with Photography menu
  - Home page photography section component
  - Photography page component
- **Admin Dashboard**: CRUD form for photography works
- API integration in frontend examples
- Responsive design for grid layout
- Optional: modal/lightbox for image viewing
