import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './Pages/Home.jsx';

function Protected({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/">Home</Link>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </div>
  );
}
