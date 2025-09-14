import { Routes, Route, Link, Navigate } from "react-router-dom";
import Navbar from "./Layout/Navbar.jsx";
import routes from "./Routes/Rutas.jsx";
import Login from "./Pages/Admin/Login.jsx";
import Footer from "./Layout/Footer.jsx";

function Protected({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <div>
      {/* El Navbar se mostrará en todas las páginas si está fuera de <Routes> */}
      <Navbar />
      <Routes>
        {/* Ruta pública para Login */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}

        {/* Ruta para redirigir si se intenta acceder a la raíz sin estar logueado */}
        <Route path="/" element={!token ? <Navigate to="/login" /> : null} />

        {/* Ruta para 404 */}
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
      <Footer />
    </div>
  );
}

/*       <Routes>
      <header style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/">Home</Link>
      </header>


        <Route
          path="/"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />
        {/* <Route path="/login" element={<Login />} /> *
        <Route path="*" element={<div>404</div>} />
      </Routes> 
      
      */
