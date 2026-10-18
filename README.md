# Cactai

Cactai is an automated cactus health monitor. Sensors on an ESP32 collect readings
from the plant, and a web dashboard displays them as live charts. The dashboard
also includes an "Ask Cactai" tab, where you can ask an AI assistant questions
about your plant's health.

## Features

- Live sensor readings displayed as charts on a web dashboard
- "Ask Cactai" AI chat for plant care questions, powered by the Gemini API
- User login with cookie-based authentication
- Handles failed sensors gracefully: if a sensor is knocked out of place, the
  firmware reports `null` and the dashboard shows the reading as missing
  instead of zero
- Interactive API documentation, generated automatically by FastAPI

## How it works

1. The **ESP32 firmware** reads the sensors and sends the data to the backend.
2. The **backend** stores readings in a PostgreSQL database and serves them
   through a REST API. It also forwards chat questions to the Gemini API.
3. The **web dashboard** requests data from the backend and displays it.

## Tech stack

| Part      | Technology                                  |
|-----------|---------------------------------------------|
| Firmware  | ESP32, developed with PlatformIO            |
| Backend   | Python, FastAPI, PostgreSQL                 |
| Auth      | JWT stored in cookies                       |
| AI        | Gemini API                                  |
| Frontend  | React, Vite, Recharts                       |

## Project structure

    cactai/
    └── software/
        ├── backend/     FastAPI server
        ├── web/         React dashboard (Vite)
        │   └── src/
        │       ├── pages/        Full pages (dashboard, login, settings)
        │       ├── components/   Reusable UI pieces
        │       ├── hooks/        Shared React logic
        │       ├── api/          Functions that call the backend
        │       └── styles/       CSS
        └── [firmware/]  ESP32 code (PlatformIO)

## Getting started

### Prerequisites

- Python3
- Node.js and npm
- Supabase, running locally or hosted
- A Gemini API key for the Ask Cactai feature

### 1. Set up the backend

    cd software/backend
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt

Create a `.env` file in the `backend` folder:

    DATABASE_URL=[postgresql://user:password@localhost:5432/cactai]
    GEMINI_API_KEY=your-api-key-here
    [JWT_SECRET=your-secret-here]

Start the server:

    uvicorn [main]:app --reload

The API runs at http://localhost:8000.

### 2. Set up the web dashboard

In a new terminal:

    cd software/web
    npm install
    npm run dev

Then open [http://localhost:5173] in your browser.

## API documentation

FastAPI generates interactive documentation from the code, so it stays up to
date whenever the endpoints change. With the backend running, open:

- http://localhost:8000/docs for Swagger UI, where you can try each endpoint
- http://localhost:8000/redoc for a read-only reference view

### Main endpoints

| Method | Endpoint     | Description                           |
|--------|--------------|---------------------------------------|
| POST   | [/login]     | [Logs in and sets the auth cookie]    |
| GET    | [/readings]  | [Returns recent sensor readings]      |
| POST   | [/readings]  | [Receives new readings from the ESP32]|
| POST   | /chat        | Sends a question to Ask Cactai        |

