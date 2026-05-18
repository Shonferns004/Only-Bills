# Only Bills — Client

React + Vite frontend for the Only Bills personal finance app.

## Tech Stack

- **React 19** + **Vite 6**
- **Tailwind CSS 3** with custom Material Design tokens
- **React Router v7** for routing
- **Axios** for API calls
- **react-toastify** for notifications
- **Supabase JS** (client-side, for anon access)

## Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | Login | Sign in with email/password |
| `/register` | Register | Create a new account |
| `/home` | Dashboard | Financial overview — summary cards, spending trends chart, recent transactions, budget snapshot, recent splits |
| `/transactions` | Transactions | Add/view/delete income & expense entries |
| `/elec` | Predict | Electricity bill predictor with ML model |
| `/plan` | Planner | Budget planner with AI-generated advice |
| `/split` | Splitter | Bill split calculator with INR default |
| `/about` | About | App info and team |

## Setup

```bash
# Install dependencies
npm install

# Start dev server (default: http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Environment

Create `client/.env`:

```
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
