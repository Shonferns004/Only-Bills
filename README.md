# Only Bills

Personal finance management app — track expenses, predict electricity bills, plan budgets, and split bills with friends. Built with React + Vite (frontend) and Express + Supabase (backend).

## Project Structure

```
Only-Bills/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Page components
│   │   ├── services/     # LocalStorage helpers
│   │   ├── App.jsx       # Routes
│   │   └── index.css     # Global styles + Tailwind
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
├── backend/         # Express API server
│   ├── src/
│   │   ├── config/       # Supabase, Groq, ML model
│   │   ├── controller/   # Route handlers
│   │   ├── routes/       # Express routers
│   │   └── ml/           # Linear regression model
│   ├── schema.sql        # Database schema
│   ├── app.js            # Entry point
│   └── package.json
└── README.md
```

## Features

- **Dashboard** — summary cards, spending trends chart, recent transactions, budget snapshot, recent splits
- **Transactions** — add/view/delete income and expense entries
- **Electricity Predictor** — ML-powered bill forecasting with history
- **Budget Planner** — AI-generated budget categories and advice (Groq/Llama 3.3)
- **Bill Splitter** — split expenses with tip calculation, INR default
- **Billy AI Chat** — floating assistant widget on every page
- **Dark Mode** — persisted to localStorage

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite 6, Tailwind CSS 3, React Router 7 |
| Backend | Express 5, bcryptjs, CORS |
| Database | Supabase (PostgreSQL) |
| AI | Groq SDK (Llama 3.3-70b) |
| ML | Custom linear regression (no external libs) |

## Setup

### Prerequisites
- Node.js 18+
- Supabase project (free tier works)
- Groq API key (free from console.groq.com)

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
GROQ_API_KEY=your_groq_api_key
PORT=4000
```

Run the schema in `backend/schema.sql` against your Supabase SQL editor, then start:
```bash
npm start
```

### 2. Frontend

```bash
cd client
npm install
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev
```

Open `http://localhost:5173`.

## API Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Sign in |
| `/api/auth/register` | POST | Create account |
| `/api/predict` | POST | Predict electricity bill |
| `/api/budget` | POST | Generate budget + AI advice |
| `/api/chat` | POST | Billy AI chat |
| `/api/data/transactions` | GET/POST/DELETE | Transaction CRUD |
| `/api/data/predictions` | GET/POST/DELETE | Predictions CRUD |
| `/api/data/plans` | GET/POST/DELETE | Budget plans CRUD |
| `/api/data/splits` | GET/POST/DELETE | Bill splits CRUD |
| `/api/data/chat/history` | GET/POST/DELETE | Chat history |
| `/api/health` | GET | Server status |

## Routes (Frontend)

| Route | Page |
|-------|------|
| `/login` | Login |
| `/register` | Register |
| `/home` | Dashboard |
| `/transactions` | Transactions |
| `/elec` | Predictor |
| `/plan` | Planner |
| `/split` | Splitter |
| `/about` | About |

## License

MIT
