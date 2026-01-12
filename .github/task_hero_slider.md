# TASK: HERO SLIDER FEATURE

## Context

- Admin should be able to add/update/delete hero slides
- Slides are fetched dynamically on frontend
- Existing auth and routes must not be changed

## Backend Tasks

- Create `HeroSlide` Mongoose model:
  - Fields: title, imageUrl, order, isActive
- Add CRUD routes under `/api/hero-slides`
- Use existing auth middleware
- Ensure proper error handling

## Frontend Tasks

- Fetch slides via API
- Replace static hero images with dynamic slides
- Implement ordering and active/inactive handling
- Maintain existing UI layout and animations

## Output Expectations

- Only show new schema, routes, controllers, and frontend component changes
- Minimal changes to existing files
