import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from './components/Login';
import Register from './components/Register';
import Planner from './components/Planner';
import { getLocalStorage } from './services/Storage';
import Layout from './components/Layout';
import BillSplitter from './components/Splitter';
import Dashboard from './components/Dashboard';
import Predict from './components/Predict';
import About from './components/About';
import AuthCallback from './components/AuthCallback';
import Transactions from './components/Transactions';

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [authorized, setAuthorized] = React.useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getLocalStorage('userDetail');
      setAuthorized(!!user);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 w-full max-w-sm px-4">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-4 w-64" />
        <div className="skeleton h-12 w-full mt-4" />
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-12 w-full" />
      </div>
    </div>
  );
  if (!authorized) return <Navigate to="/login" replace />;

  return children;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer className="z-55"/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/home" element={<Dashboard />} />
                  <Route path="/plan" element={<Planner />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/split" element={<BillSplitter />} />
                  <Route path="/elec" element={<Predict />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
