# OnlyBills  

OnlyBills is a **bill management and prediction platform** combining:  
- A **React + Vite + Tailwind** frontend.  
- A **Node.js + Express** backend API.  
- A **Python machine learning model** for bill prediction.  

---

## 🚀 Features  
- User authentication (register & login).  
- Bill splitting and planning tools.  
- AI-powered prediction of future expenses.  
- Interactive dashboard for tracking bills.  
- Modern UI built with Tailwind CSS.  

---

## ⚙️ Installation & Setup  

### 1. Backend (Node.js + Express)  
-  Create your gemeni api key and edit backend/config/main.js
```
cd backend
npm install
npm start
```

### 2. Frontend (React + Vite + Tailwind)
-  Make your Firebase app and edit the client/service/index.jsx
```
cd client
npm install
npm run dev
```

### 3. Model (Python ML Service)
```
cd model
pip install -r requirements.txt
python app.py
```

---

## 🔗 Tech Stack

- Frontend: React, Vite, TailwindCSS

- Backend: Node.js, Express

- Model: Python, Pandas, Scikit-learn

---

## 📊 Workflow

- User interacts with the frontend (login, dashboard, planner).

- Frontend calls backend API (Express routes).

- Backend integrates with the ML model service for predictions.

- Results are displayed in the dashboard.
