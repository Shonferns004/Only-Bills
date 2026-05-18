# Only Bills — Backend

Express.js API server for the Only Bills personal finance app.

## Tech Stack

- **Express 5** (Node.js)
- **Supabase** as database (Postgres)
- **Groq SDK** (Llama 3.3) for AI budget advice
- **bcryptjs** for password hashing
- **CORS** enabled

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user (email, password, displayName) |
| POST | `/api/auth/login` | Login (email, password) |

### Predictions (ML)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict` | Predict electricity bill from room/occupant inputs |

### Data CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/data/transactions` | List transactions |
| POST | `/api/data/transactions` | Add transaction |
| DELETE | `/api/data/transactions/:id` | Delete transaction |
| GET | `/api/data/predictions` | List predictions |
| POST | `/api/data/predictions` | Save prediction |
| DELETE | `/api/data/predictions/:id` | Delete prediction |
| GET | `/api/data/plans` | List budget plans |
| POST | `/api/data/plans` | Save budget plan |
| DELETE | `/api/data/plans/:id` | Delete budget plan |
| GET | `/api/data/splits` | List bill splits |
| POST | `/api/data/splits` | Save bill split |
| DELETE | `/api/data/splits/:id` | Delete bill split |
| GET | `/api/data/chat/history` | Get chat history |
| POST | `/api/data/chat/history` | Save chat message |
| DELETE | `/api/data/chat/history` | Clear chat history |

### Budget

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/budget` | Calculate budget & get AI advice via Groq |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to Billy AI assistant |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server status + user count |

## Setup

```bash
# Install dependencies
npm install

# Start with nodemon (auto-restart on changes)
npm start
```

## Environment

Create `backend/.env`:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
GROQ_API_KEY=your_groq_api_key
PORT=4000
```
