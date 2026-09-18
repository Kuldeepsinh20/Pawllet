# Pawlet — Production-Ready Pet Onboarding & Health Portal

A full-stack pet registration and health tracking application built with **React (Vite + Tailwind)** on the frontend, **FastAPI + SQLAlchemy** on the backend, and **PostgreSQL** for relational persistence.

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                   Pawlet Frontend                      │
│            (React + Vite + Tailwind CSS)               │
│               http://localhost:3000                    │
└───────────────────────────┬────────────────────────────┘
                            │ Vite Proxy (/api)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Pawlet Backend                       │
│             (FastAPI + Pydantic v2)                    │
│               http://localhost:8000                    │
└─────────────┬───────────────────────────┬──────────────┘
              │ SQLAlchemy ORM            │ Local Disk
              ▼                           ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│    PostgreSQL Database    │ │   storage/uploads/       │
│  (Docker Compose / Local) │ │   (Birth certs, records, │
│        Port: 5432         │ │    insurance policies)   │
└───────────────────────────┘ └──────────────────────────┘
```

---

## Directory Structure

```
pawlet-portal/
├── backend/                        # FastAPI Backend
│   ├── alembic/                    # Database migrations
│   │   ├── versions/
│   │   │   └── 001_initial_schema.py
│   │   └── env.py
│   ├── app/
│   │   ├── core/                   # Config, database engine & session
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   ├── models/                 # SQLAlchemy 2.0 ORM models
│   │   │   ├── base.py
│   │   │   ├── owner.py
│   │   │   ├── pet.py
│   │   │   ├── health.py
│   │   │   ├── vaccine.py
│   │   │   ├── allergy.py
│   │   │   ├── disease.py
│   │   │   ├── medication.py
│   │   │   ├── food.py
│   │   │   ├── category.py
│   │   │   └── document.py
│   │   ├── schemas/                # Pydantic v2 schemas
│   │   │   ├── owner.py
│   │   │   ├── pet.py
│   │   │   ├── health.py
│   │   │   └── document.py
│   │   ├── services/               # Business logic & services
│   │   │   ├── pet_service.py
│   │   │   ├── category_service.py
│   │   │   └── document_service.py
│   │   ├── routers/                # API route definitions
│   │   │   ├── pets.py
│   │   │   └── documents.py
│   │   ├── utils/                  # Age calculation & utilities
│   │   │   └── age_calculator.py
│   │   └── main.py                 # Application entrypoint & CORS
│   ├── .env.example
│   ├── .env
│   ├── alembic.ini
│   └── requirements.txt
├── docker-compose.yml              # PostgreSQL 17 container definition
├── storage/
│   └── uploads/                    # Secure document storage
├── src/                            # React Frontend
│   ├── components/                 # Modals, form cards, avatars
│   │   ├── ViewPetsModal.jsx       # Stored pets viewer & manager
│   │   ├── SuccessModal.jsx        # Submission celebration
│   │   ├── UploadCard.jsx          # File picker & upload preview
│   │   └── ...
│   ├── pages/
│   │   ├── ProfilePage.jsx         # Step 1: Pet & Owner Profile
│   │   └── HealthDocumentsPage.jsx # Step 2: Health Journal & Vault
│   ├── services/
│   │   └── api.js                  # Frontend API client
│   └── App.jsx                     # Core application coordinator
└── package.json
```

---

## Quickstart Guide

### 1. Start PostgreSQL with Docker

Run PostgreSQL using Docker Compose:

```bash
docker compose up -d
```

Verify the database container is healthy:
```bash
docker compose ps
```

> **Note**: If you already have PostgreSQL installed locally on port 5432, you can adjust `DATABASE_URL` in `backend/.env`.

---

### 2. Set Up the Backend

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run database migrations:
   ```bash
   alembic upgrade head
   ```

5. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

The backend is now live at `http://localhost:8000`.
- Interactive Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

### 3. Run the Frontend

1. From the project root (`pawlet-portal/`):
   ```bash
   npm install
   npm run dev
   ```

2. Open your browser at `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied).
   The frontend automatically proxies `/api` calls to the FastAPI backend on port 8000.

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/pets` | Create complete pet record with owner, health, and auto-generated categories |
| `GET` | `/api/v1/pets` | List registered pets (supports `search`, `species`, `gender`, `limit`, `offset`) |
| `GET` | `/api/v1/pets/{id}` | Get full details of a pet including health details, tags, documents, categories |
| `PUT` | `/api/v1/pets/{id}` | Update pet profile, owner, health, or tags |
| `DELETE` | `/api/v1/pets/{id}` | Delete pet, cascading to owner, health, tags, documents, and disk files |
| `POST` | `/api/v1/pets/{id}/documents` | Upload a document file (multipart/form-data) |
| `GET` | `/api/v1/documents/{id}` | Download/stream a stored document file |
| `DELETE` | `/api/v1/documents/{id}` | Delete a document and remove its file from disk |
| `GET` | `/health` | System health check endpoint |

---

## Data Schema & Relationships

- **`owners`**: Contains Owner Name, Contact, Address, and optional Aadhar Card.
- **`pets`**: Links to `owners.id` (CASCADE). Stores Species, Name, Breed, Date of Birth, Place, Height (cm), Weight (kg), and Gender.
- **`health_details`**: One-to-one relationship with `pets.id` (CASCADE). Contains Grooming notes, Checkup Routine, and Last Visit date.
- **`vaccines`**, **`allergies`**, **`diseases`**, **`medications`**, **`food`**: Normalized one-to-many relationship tables storing individual health tags.
- **`pet_categories`**: Dynamically computed and indexed categories (Species, Age Group e.g. "Puppy/Kitten/Adult/Senior", Size classification e.g. "Toy/Small/Medium/Large/Giant", Breed group, Health and Allergy indicators).
- **`documents`**: Metadata storage for files saved to `storage/uploads/` with UUID-based obfuscation to avoid path traversal or collisions.
