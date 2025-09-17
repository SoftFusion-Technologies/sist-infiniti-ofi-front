import { useState } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import routes from '../Routes/Rutas';
import { NavLink } from 'react-router-dom';
import { naranja } from '../constants/colores';
import Logo from '../img/Logo.webp';
import ParticlesBackground from '../components/ParticlesBackground';
import { FaInfinity } from 'react-icons/fa';

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  // Filtra las rutas que deben mostrarse en la navegación
  const navItems = routes.filter((route) => route.showInNav);
  const activeLinkStyle = {
    color: '#f97316' // Naranja para el enlace activo
  };

  return (
    <nav className="relative z-50 bg-black text-white flex items-center h-24 max-w-full mx-auto px-6 border-b border-white/20">
      {/* se agrega componente de particulas al nav cambio agregado por Benjamin Orellana 16-09-25*/}
      <ParticlesBackground />
      {/* Logo (izquierda) */}
      <NavLink to="/" className="flex items-center gap-3">
        <img src={Logo} alt="Infinity Academia Logo" className="h-10 w-auto" />
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className="text-3xl font-custom-montserrat text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-[#021f3e] to-[#1e90ff]">
              INFINITY
            </span>
          </div>
          <span className="text-xl font-custom-montserrat text-white text-center">
            Academia
          </span>
        </div>
      </NavLink>

      {/* Ítems centrados (desktop) */}
      <ul className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
        {[
          { name: 'HORARIOS', path: '/horarios' },
          { name: 'SOCIOS', path: '/socios' },
          { name: 'ESPACIOS', path: '/espacios' },
          { name: 'SUPLEMENTOS', path: '/suplementos' }
        ].map((item) => (
          <li key={item.name} className="relative group">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                [
                  'uppercase tracking-[0.12em] font-semibold transition-all duration-200',
                  // brillo suave SIEMPRE (sin animaciones)
                  'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]',
                  // hover sobrio
                  'group-hover:-translate-y-[1px] group-hover:tracking-[0.14em]',
                  isActive ? 'opacity-100' : 'opacity-95 hover:opacity-100'
                ].join(' ')
              }
            >
              {item.name}
            </NavLink>

            {/* subrayado que se despliega (sin keyframes) */}
            <span className="pointer-events-none absolute -bottom-1 left-0 w-full h-[2px] bg-white/20 rounded-full" />
            <span className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full bg-white rounded-full origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
          </li>
        ))}
      </ul>

      {/* CTA derecha (desktop) */}
      <div className="ml-auto hidden md:block">
        <NavLink to="/clase-prueba">
          <button
            className="
        px-5 py-2 font-bold text-white rounded-md
        bg-gradient-to-r from-black via-[#0d1b2a] to-[#0d5398]
        transition-all duration-200
        hover:brightness-125 hover:-translate-y-[1px] active:translate-y-0
        shadow-[0_0_18px_rgba(30,144,255,0.5)]
        relative overflow-hidden
      "
          >
            <span className="relative z-10 uppercase">
              PRIMERA CLASE GRATIS
            </span>
            {/* destello sutil en hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
          </button>
        </NavLink>
      </div>

      {/* Ícono mobile (derecha) */}
      <div onClick={handleNav} className="block md:hidden ml-auto z-50">
        {nav ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </div>

      {/* Menú Mobile */}
      <div
        className={
          nav
            ? 'fixed md:hidden left-0 top-0 w-full h-full bg-black ease-in-out duration-300 z-40'
            : 'ease-in-out w-full duration-300 fixed top-0 bottom-0 left-[-100%] z-40'
        }
      >
        {/* Logo Mobile */}
        {/* Se reemplazan los colores naranjas, y se agrega un Fa icons de infinito */}
        <NavLink
          to="/"
          onClick={handleNav}
          className="inline-flex items-center gap-2 m-8"
        >
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-[#021f3e] to-[#1e90ff]">
            INFINITY
          </span>
          <FaInfinity className="text-3xl text-blue-400 drop-shadow-[0_0_6px_rgba(30,144,255,0.6)]" />
        </NavLink>

        {/* se agrega componente de particulas al nav cambio agregado por Benjamin Orellana 16-09-25*/}
        <ParticlesBackground />

        {/* Ítems Mobile */}
        <ul className="p-8 text-center">
          {[
            { name: 'HORARIOS', path: '/horarios' },
            { name: 'SOCIOS', path: '/socios' },
            { name: 'ESPACIOS', path: '/espacios' },
            { name: 'SUPLEMENTOS', path: '/suplementos' }
          ].map((item) => (
            <li key={item.name} className="p-4 border-b border-white/15">
              <NavLink
                to={item.path}
                onClick={handleNav}
                className="text-2xl font-semibold uppercase tracking-[0.1em]
                       text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]
                       transition-all duration-200 hover:tracking-[0.12em]"
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA Mobile */}
        <div className="flex justify-center mt-8">
          <NavLink to="/clase-prueba" onClick={handleNav}>
            <button
              className="
        px-8 py-3 font-bold text-white rounded-md text-xl
        bg-gradient-to-r from-black via-[#0d1b2a] to-[#1e90ff]
        transition-all duration-200 hover:brightness-125
        shadow-[0_0_14px_rgba(30,144,255,0.5)]
      "
            >
              PRIMERA CLASE GRATIS
            </button>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
