import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { auth, getUserRole } from './firebase'; // Uvozi avtentikacijo in funkcijo za vlogo
import Header from './components/layout/Header';
import Dashboard from './components/pages/Dashboard/Dashboard';
import WorkHours from './components/pages/WorkHours/WorkHours';
import Absences from './components/pages/Absences/Absences';
import LeaveAndVacation from './components/pages/LeaveAndVacation/LeaveAndVacation';
import Login from './auth/Login';
import Register from './auth/Register';
import { AuthProvider } from './context/Context';
import Profile from './components/pages/Profile/Profile';

function App() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const role = await getUserRole(user.uid);
        setRole(role);
      } else {
        setIsAuthenticated(false);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Nalaganje...</p>;

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {isAuthenticated && <Header role={role} setRole={setRole} setIsAuthenticated={setIsAuthenticated} />}
          <div className="container mt-3">
            <Routes>
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setRole={setRole} />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={isAuthenticated ? (role === 'admin' ? <Dashboard /> : <Navigate to="/workhours" />) : <Navigate to="/login" />}
              />
              <Route
                path="/workhours"
                element={isAuthenticated ? <WorkHours /> : <Navigate to="/login" />}
              />
              <Route
                path="/absences"
                element={isAuthenticated && role === 'admin' ? <Absences /> : <Navigate to="/login" />}
              />
              <Route
                path="/leaves"
                element={isAuthenticated ? <LeaveAndVacation /> : <Navigate to="/login" />}
              />
              <Route
                path="/profile"
                element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
