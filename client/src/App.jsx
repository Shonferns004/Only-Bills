import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

  if (loading) return <div>Loading...</div>;
  if (!authorized) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  return (
    <Router>
      <ToastContainer className="z-55"/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
