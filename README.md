# Review Management App - Production Starter

This is a production-style starter for a review management system with:

- Flask API backend
- React frontend (Vite)
- SQL database persistence using SQLAlchemy
- JWT authentication
- Review CRUD and response workflow
- AI draft endpoint with safe fallback template logic
- Review request queue
- NPS/private feedback routing
- Activity logging
- Simple settings page

## What "real data" means in this project

This version uses a **real persistent database** instead of in-memory arrays.

- For local use, it runs with **SQLite**.
- For production, switch `DATABASE_URL` to **PostgreSQL**.

It also seeds a real admin user and sample records into the database on first run.

## Default login

- Email: `admin@example.com`
- Password: `Admin@123`

Change these in `backend/.env` before production.

---

## Local run

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # macOS/Linux
# .venv\Scripts\activate    # Windows
pip install -r requirements.txt
cp .env.example .env
python run.py
```

Backend runs at:

```text
http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## Production deployment notes

### Backend
Set:
- `DATABASE_URL` to PostgreSQL
- `SECRET_KEY`
- `JWT_SECRET_KEY`
- `CORS_ORIGINS`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SEED_SAMPLE_DATA=false`

### Frontend
Set:
- `VITE_API_BASE_URL` to your production backend URL

---

## Recommended production improvements after this starter

1. Add PostgreSQL migrations with Alembic or Flask-Migrate
2. Add role-based permissions beyond one admin
3. Add Twilio/Resend for real message sending
4. Add Google/Facebook platform sync using official APIs and credentials
5. Add background jobs with Celery/RQ/Redis
6. Add stronger audit logs and monitoring
7. Add tests and CI pipeline

---

## Project structure

```text
review-management-prod/
  backend/
    app/
      routes/
      services/
      utils/
      __init__.py
      models.py
      seed.py
    requirements.txt
    run.py
    .env.example
  frontend/
    src/
      components/
      pages/
      api.js
      App.jsx
      main.jsx
      styles.css
    package.json
    vite.config.js
    .env.example
  README.md
```
