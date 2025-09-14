import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import routes from "../Routes/Rutas";
import { NavLink } from "react-router-dom";
import { naranja } from "../constants/colores";
import Logo from "../img/Logo.webp"

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  // Filtra las rutas que deben mostrarse en la navegación
  const navItems = routes.filter((route) => route.showInNav);
  const activeLinkStyle = {
    color: "#f97316", // Naranja para el enlace activo
  };

  return (
    <nav className="bg-black text-white flex justify-between items-center h-24 max-w-full mx-auto px-4 shadow-lg shadow-orange-500/20">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-3">
        <img src={Logo} alt="Infinity Academia Logo" className="h-10 w-auto" />
        <div className="flex flex-col">
          <span className={`text-3xl font-custom-montserrat text-transparent bg-clip-text bg-gradient-to-r from-[#EC630D] to-orange-600`}>
            INFINITY
          </span>
          <span className="text-xl font-custom-montserrat text-white text-center">
            Academia
          </span>
        </div>
      </NavLink>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              className="p-4 hover:text-orange-500 transition-colors duration-300 cursor-pointer font-medium"
            >
              {item.name}
            </NavLink>
          </li>
        ))}
        <NavLink to="/clase-prueba">
          <button className="ml-4 px-4 py-2 font-bold text-white bg-gradient-to-r from-orange-500 to-orange-800 rounded-md hover:opacity-90 transition-opacity">
            Probar una clase
          </button>
        </NavLink>
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className="block md:hidden z-50">
        {nav ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={
          nav
            ? "fixed md:hidden left-0 top-0 w-full h-full bg-black ease-in-out duration-500 z-40"
            : "ease-in-out w-full duration-500 fixed top-0 bottom-0 left-[-100%] z-40"
        }
      >
        {/* Mobile Logo */}
        <NavLink to="/" onClick={handleNav} className="inline-block m-8">
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
            INFINITY
          </span>
        </NavLink>

        {/* Mobile Menu Items */}
        <ul className="p-8 text-center">
          {navItems.map((item) => (
            <li key={item.name} className="p-4 border-b border-gray-600">
              <NavLink
                to={item.path}
                onClick={handleNav}
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : undefined
                }
                className="text-2xl font-semibold hover:text-orange-500 transition-colors duration-300"
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex justify-center mt-8">
          <NavLink to="/clase-prueba" onClick={handleNav}>
            <button className="px-8 py-3 font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-md hover:opacity-90 transition-opacity text-xl">
              Probar una clase
            </button>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
