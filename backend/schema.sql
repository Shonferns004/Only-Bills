-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)

CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE budget_plans (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  income REAL NOT NULL,
  num_family_members INTEGER NOT NULL,
  marital_status TEXT NOT NULL,
  num_children INTEGER DEFAULT 0,
  has_rent TEXT DEFAULT 'no',
  rent_amount REAL DEFAULT 0,
  has_vehicle TEXT DEFAULT 'no',
  petrol_expense REAL DEFAULT 0,
  budget_json TEXT,
  advice TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE predictions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rooms INTEGER NOT NULL,
  people INTEGER NOT NULL,
  appliances INTEGER NOT NULL,
  systems INTEGER NOT NULL,
  predicted_amount REAL NOT NULL,
  per_room REAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bill_splits (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount REAL NOT NULL,
  people INTEGER NOT NULL,
  tip_percent REAL NOT NULL,
  tip_amount REAL NOT NULL,
  total_with_tip REAL NOT NULL,
  per_person REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_history (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'other',
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
