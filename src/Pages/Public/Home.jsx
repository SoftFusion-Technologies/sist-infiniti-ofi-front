import { FaDumbbell, FaUsers, FaAward } from 'react-icons/fa';
import Ubication from '../../components/Ubication';
import routes from '../../Routes/Rutas';
import { NavLink } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import ParticlesBackground from '../../components/ParticlesBackground';
import { useRef } from 'react';

// Variantes de entrada y del martillazo del HeroSection
const enter = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 220, damping: 20 }
  }
};

const smash = {
  rest: {
    scale: 1,
    rotate: 0,
    letterSpacing: '0.02em',
    filter: 'brightness(1)'
  },
  hit: {
    scale: [1, 1.06, 0.995, 1],
    rotate: [0, -0.6, 0.3, 0],
    letterSpacing: ['0.02em', '0.08em', '0.03em', '0.02em'],
    filter: [
      'brightness(1)',
      'brightness(1.35)',
      'brightness(1.05)',
      'brightness(1)'
    ],
    transition: { duration: 0.6, times: [0, 0.2, 0.5, 1], ease: 'easeOut' }
  }
};

// Componente para la sección principal (Hero)
const HeroSection = () => {
  // ⬇️ Definimos la ref y el flag de visibilidad
  const hitRef = useRef(null);
  const isIn = useInView(hitRef, { once: true, amount: 0.6 });

  const discFondo = encodeURI(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <g fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='2'>
        <circle cx='50' cy='50' r='40'/>
        <circle cx='50' cy='50' r='24'/>
        <circle cx='50' cy='50' r='8'/>
      </g>
      <g stroke='rgba(255,255,255,0.06)'>
        <line x1='50' y1='5' x2='50' y2='20'/>
        <line x1='50' y1='80' x2='50' y2='95'/>
        <line x1='5' y1='50' x2='20' y2='50'/>
        <line x1='80' y1='50' x2='95' y2='50'/>
      </g>
    </svg>
  `);

  const MancuernasRotando = encodeURI(`
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
    <g fill='none' stroke='rgba(255,255,255,0.75)' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'>
      <!-- barra -->
      <line x1='10' y1='32' x2='54' y2='32' />
      <!-- discos izquierda -->
      <rect x='6' y='24' width='6' height='16' rx='2' ry='2' fill='rgba(255,255,255,0.12)' stroke='rgba(255,255,255,0.6)'/>
      <rect x='12' y='26' width='6' height='12' rx='2' ry='2' fill='rgba(255,255,255,0.08)'/>
      <!-- discos derecha -->
      <rect x='52' y='24' width='6' height='16' rx='2' ry='2' fill='rgba(255,255,255,0.12)' stroke='rgba(255,255,255,0.6)'/>
      <rect x='46' y='26' width='6' height='12' rx='2' ry='2' fill='rgba(255,255,255,0.08)'/>
    </g>
  </svg>
`);
  return (
    <section className="relative isolate overflow-hidden bg-black text-white min-h-[88vh] md:min-h-[92vh]">
      {/* GYM LAYER 1: patrón de discos (repetido) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rotate-6 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,${discFondo}")`,
          backgroundSize: '220px 220px',
          backgroundRepeat: 'repeat',
          filter: 'blur(0.3px)',
          maskImage:
            'radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage:
            'radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)'
        }}
      />

      {/* GYM LAYER 2: kettlebell gigante sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 -bottom-36 w-[62vmin] h-[62vmin] opacity-30 blur-2xl"
        style={{
          background:
            'conic-gradient(from 210deg at 50% 45%, rgba(255,255,255,0.12), rgba(255,255,255,0.04), rgba(0,0,0,0.0))',
          clipPath:
            'path("M 50 10 C 34 10 26 20 26 30 C 26 37 31 43 38 45 C 28 50 20 60 20 72 C 20 87 34 98 50 98 C 66 98 80 87 80 72 C 80 60 72 50 62 45 C 69 43 74 37 74 30 C 74 20 66 10 50 10 Z")'
        }}
      />

      {/* Capa aurora + spotlight + grid + órbitas + noise (lo tuyo “wow”) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blur-2xl opacity-60"
      >
        <div className="absolute -top-20 -left-24 size-[38rem] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.14),rgba(6,182,212,0.12),rgba(99,102,241,0.12),transparent,rgba(6,182,212,0.12))]" />
        <div className="absolute -bottom-24 -right-20 size-[42rem] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_25%,rgba(255,255,255,0.16),transparent_70%)]" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          WebkitMaskImage:
            'radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          maskImage:
            'radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)'
        }}
      />

      {/* orbitas que giran descomentar si quedan bien */}
      {/* <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 size-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-[orbit_28s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 size-[54vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-[orbit_36s_linear_infinite_reverse]" />
      </div> */}

      {/* ÓRBITAS CON MANCUERNAS (reemplaza el bloque de órbitas anterior) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Anillo guía tenue */}
        <div className="absolute left-1/2 top-1/2 size-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

        {/* Anillo grande con 4 mancuernas (giro horario) */}
        <div className="absolute left-1/2 top-1/2 size-[72vmin] -translate-x-1/2 -translate-y-1/2 animate-[orbit_28s_linear_infinite]">
          {/* Top */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '42px',
              height: '42px',
              backgroundImage: `url("data:image/svg+xml;utf8,${MancuernasRotando}")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.18))',
              transform: 'translate(-50%,-50%) rotate(20deg)'
            }}
          />
          {/* Right */}
          <div
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2"
            style={{
              width: '42px',
              height: '42px',
              backgroundImage: `url("data:image/svg+xml;utf8,${MancuernasRotando}")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.18))',
              transform: 'translate(50%,-50%) rotate(20deg)'
            }}
          />
          {/* Bottom */}
          <div
            className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2"
            style={{
              width: '42px',
              height: '42px',
              backgroundImage: `url("data:image/svg+xml;utf8,${MancuernasRotando}")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.18))',
              transform: 'translate(-50%,50%) rotate(20deg)'
            }}
          />
          {/* Left */}
          <div
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '42px',
              height: '42px',
              backgroundImage: `url("data:image/svg+xml;utf8,${MancuernasRotando}")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.18))',
              transform: 'translate(-50%,-50%) rotate(20deg)'
            }}
          />
        </div>

        {/* Anillo chico con 2 mancuernas (giro antihorario) */}
        <div className="absolute left-1/2 top-1/2 size-[54vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-[orbit_reverse_36s_linear_infinite]">
          {/* Top */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '36px',
              height: '36px',
              backgroundImage: `url("data:image/svg+xml;utf8,${MancuernasRotando}")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.16))',
              transform: 'translate(-50%,-50%) rotate(20deg)'
            }}
          />
          {/* Bottom */}
          <div
            className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2"
            style={{
              width: '36px',
              height: '36px',
              backgroundImage: `url("data:image/svg+xml;utf8,${MancuernasRotando}")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.16))',
              transform: 'translate(-50%,50%) rotate(20deg)'
            }}
          />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,.35) 0, rgba(255,255,255,.35) 1px, transparent 1px, transparent 3px)'
        }}
      />

      {/* CONTENIDO */}
      <div className="relative z-10 text-center px-4 py-36 md:py-48 lg:py-56 max-w-6xl mx-auto">
        <motion.h1
          variants={enter}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.05]"
        >
          FORJA TU{' '}
          <motion.span
            ref={hitRef}
            variants={smash}
            initial="rest"
            animate={isIn ? 'hit' : 'rest'}
            className="relative inline-block align-baseline"
          >
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 drop-shadow-[0_2px_24px_rgba(255,255,255,0.18)]">
              MEJOR VERSIÓN
            </span>
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-300/50"
              style={{ animation: 'pulse-ring 2.5s ease-out infinite' }}
            />
          </motion.span>
        </motion.h1>

        <motion.p
          variants={enter}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.05 }}
          className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12"
        >
          En INFINITY, no solo levantás pesas: elevás tu potencial. Sumate a la
          comunidad y transformá tu rendimiento.
        </motion.p>

        {routes
          .filter((r) => r.name === 'Clase de Prueba')
          .map((r) => (
            <motion.div
              key={r.name}
              variants={enter}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center"
            >
              <NavLink to={r.path}>
                <button
                  className="px-8 py-3 font-bold text-gray-900 rounded-md text-lg
                             bg-gradient-to-r from-gray-100 via-gray-200 to-gray-400
                             transition-transform duration-200 hover:brightness-110
                             hover:-translate-y-[1px] active:translate-y-0
                             shadow-[0_0_14px_rgba(255,255,255,0.6)]"
                >
                  SOLICITÁ TU CLASE DE PRUEBA
                </button>
              </NavLink>
            </motion.div>
          ))}
        {/* Chips flotantes (detalle “wow”) */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-300">
          <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            Rutinas inteligentes
          </span>
          <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            Seguimiento en tiempo real
          </span>
          <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            Coach digital
          </span>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: translate(-50%, -50%) scale(0.3); opacity: 0.8; }
          70%  { transform: translate(-50%, -50%) scale(3);   opacity: 0;   }
          100% { opacity: 0; }
        }
        @keyframes orbit {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes orbit_reverse {
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        .animate-[orbit_28s_linear_infinite] {
          animation: orbit 28s linear infinite;
        }
        .animate-[orbit_36s_linear_infinite_reverse] {
          animation: orbit_reverse 36s linear infinite;
        }
      `}</style>
    </section>
  );
};

// Variants para el pop-up y el stagger del FeaturesSection
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.6 }
  }
};

const pop = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20, mass: 0.6 }
  }
};

// Componente para la sección de características
const FeaturesSection = () => {
  const features = [
    { icon: <FaDumbbell size={28} />, title: 'Equipamiento Moderno', description: 'Máquinas de última generación con mantenimiento al día.' },
    { icon: <FaUsers size={28} />, title: 'Comunidad Activa', description: 'Ambiente enfocado, respeto por el proceso y progreso real.' },
    { icon: <FaAward size={28} />, title: 'Coaches Certificados', description: 'Metodologías probadas y seguimiento técnico cercano.' }
  ];


  return (
    <section className="relative isolate overflow-hidden bg-black pt-24 pb-28 px-6 -mt-8">
      {/* DIVISOR entre Hero y Features (onda metálica) */}
      <div className="absolute -top-12 left-0 w-full h-12" aria-hidden>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,120 C300,0 1140,240 1440,60 L1440,120 L0,120 Z" fill="url(#silverGrad)" />
          <defs>
            <linearGradient id="silverGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#e5e7eb" stopOpacity="0.10" />
              <stop offset="0.5" stopColor="#9ca3af" stopOpacity="0.18" />
              <stop offset="1" stopColor="#d1d5db" stopOpacity="0.10" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* CAPAS: aurora + grid + noise para continuidad con el Hero */}
      <div aria-hidden className="pointer-events-none absolute inset-0 blur-2xl opacity-60">
        <div className="absolute -top-24 -left-24 size-[32rem] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.10),rgba(6,182,212,0.08),rgba(99,102,241,0.08),transparent,rgba(6,182,212,0.08))]" />
        <div className="absolute -bottom-16 -right-20 size-[36rem] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_60%)]" />
      </div>

      {/* grid sutil con máscara central */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          WebkitMaskImage:
            'radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)',
          maskImage:
            'radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)'
        }}
      />
      {/* noise para textura */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,.35) 0, rgba(255,255,255,.35) 1px, transparent 1px, transparent 3px)'
        }}
      />

      <ParticlesBackground />

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          variants={pop}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mb-14 text-center"
        >
          <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tight">
            Entrenamiento Redefinido
          </h2>
          <p className="text-gray-300 mt-3">
            Tecnología, diseño y metodología al servicio de tu mejor versión.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="grid gap-8 md:grid-cols-3 [perspective:1200px]"
        >
          {features.map((f) => (
            <motion.article
              key={f.title}
              variants={pop}
              className="
                group relative rounded-2xl
                bg-neutral-900/90
                border border-neutral-800
                px-6 pt-10 pb-8
                shadow-[0_12px_40px_rgba(0,0,0,0.45)]
                [transform-style:preserve-3d]
                overflow-hidden
                motion-reduce:transform-none motion-reduce:transition-none
              "
              whileHover={{ rotateX: -6, rotateY: 6, y: -8 }}
              whileTap={{ scale: 0.995 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18, mass: 0.6 }}
            >
              {/* Caras isométricas (ahora plata, no sky) */}
              <span
                aria-hidden
                className="
                  absolute inset-0 -z-10 rounded-2xl
                  before:content-[''] before:absolute before:-top-2 before:left-2
                  before:w-[calc(100%-4px)] before:h-3 before:rounded-t-2xl
                  before:bg-gradient-to-r before:from-gray-500/30 before:to-gray-300/30
                  before:blur-[1px]
                  after:content-[''] after:absolute after:-left-2 after:top-2
                  after:w-3 after:h-[calc(100%-4px)] after:rounded-l-2xl
                  after:bg-gradient-to-b after:from-gray-500/30 after:to-gray-300/30
                  after:blur-[1px]
                "
              />

              {/* Corte diagonal */}
              <span
                aria-hidden
                className="
                  absolute -right-6 -top-6 size-16 rotate-45
                  bg-gradient-to-br from-neutral-800 to-neutral-900
                  border border-neutral-700
                "
              />

              {/* Borde activo sutil en hover (plata) */}
              <span
                aria-hidden
                className="
                  pointer-events-none absolute inset-0 rounded-2xl
                  ring-0 ring-gray-300/0 group-hover:ring-1 group-hover:ring-gray-300/30
                  transition-all duration-300
                "
              />

              {/* Icono en rombo (flotante) */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 250, damping: 16 }}
                className="
                  mx-auto grid place-items-center size-16
                  rotate-45 rounded-xl
                  bg-gradient-to-br from-neutral-800 to-neutral-900
                  border border-neutral-700
                  shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                "
                style={{ transform: 'translateZ(40px) rotate(45deg)' }}
              >
                <div className="-rotate-45 text-gray-200 group-hover:text-gray-100 transition-colors duration-300">
                  {f.icon}
                </div>
              </motion.div>

              {/* titulo y descripcion */}
              <h3 className="mt-6 text-white text-xl font-semibold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-gray-300 leading-relaxed">
                {f.description}
              </p>

              {/* Linea base (acento plata) */}
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 opacity-40 group-hover:opacity-70 transition-opacity duration-300 rounded-b-2xl" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};



// Componente para la sección de testimonios
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Ana Pérez',
      quote:
        'El cambio en mi vida ha sido increíble. Los coaches son súper atentos y el ambiente es genial. ¡Lo recomiendo al 100%!',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'Carlos Vera',
      quote:
        'Nunca pensé que disfrutaría tanto ir al gimnasio. INFINITY es más que un lugar para entrenar, es una segunda casa.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-black via-neutral-900 to-black py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-12 tracking-tight">
          Lo que dicen nuestros clientes
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="relative bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-orange-500/30 group"
            >
              <div className="flex flex-col items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-orange-500 shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                <p className="text-gray-200 italic mb-4 text-lg leading-relaxed">
                  “{testimonial.quote}”
                </p>
                <h4 className="font-bold text-orange-500 text-lg mt-2 tracking-wide">
                  {testimonial.name}
                </h4>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-500 to-yellow-400 opacity-40 rounded-b-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente principal de la página Home
const Home = () => {
  return (
    <div className="bg-gray-900 text-white">
      <HeroSection />
      <FeaturesSection />
      <Ubication />
      <TestimonialsSection />
      {/* El Footer se renderizará automáticamente desde App.jsx */}
    </div>
  );
};

export default Home;
