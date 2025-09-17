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

  return (
    <section className="relative bg-black text-white overflow-hidden">
      {/* spotlight sutil */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(30,144,255,0.12),transparent_60%)]" />
      </div>

      <div className="relative z-10 text-center px-4 py-32 md:py-40 max-w-6xl mx-auto">
        {/* Título */}
        <motion.h1
          variants={enter}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]"
        >
          FORJA TU {/* Bloque con “martillazo” de entrada */}
          <motion.span
            ref={hitRef}
            variants={smash}
            initial="rest"
            animate={isIn ? 'hit' : 'rest'}
            className="relative inline-block align-baseline"
          >
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#86c5ff] via-[#0d1b2a] to-[#1e90ff]">
              MEJOR VERSIÓN
            </span>

            {/* Rayo/destello que cruza */}
            <span
              aria-hidden
              className="absolute top-1/2 left-[-60%] w-[220%] h-[2px]
             bg-gradient-to-r from-transparent via-sky-200 to-transparent
             transform -translate-y-1/2 -skew-x-20 rounded-full blur-[1px] shadow-[0_0_12px_rgba(255,255,255,0.8)]"
              style={{
                animation: 'ray 1.2s ease-in-out infinite'
              }}
            />
            {/* Anillo pulsante infinito */}
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                         w-8 h-8 rounded-full border border-sky-400/50"
              style={{ animation: 'pulse-ring 2.5s ease-out infinite' }}
            />
          </motion.span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          variants={enter}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.05 }}
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10"
        >
          En INFINITY, no solo levantás pesas: elevás tu potencial. Sumate a la
          comunidad y transformá tu rendimiento.
        </motion.p>

        {/* CTA (paleta azul/negra) — deja tu lógica de rutas como la tenías */}
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
            >
              <NavLink to={r.path}>
                <button
                  className="px-8 py-3 font-bold text-white rounded-md text-lg
                             bg-gradient-to-r from-black via-[#0d1b2a] to-[#1e90ff]
                             transition-transform duration-200 hover:brightness-125
                             hover:-translate-y-[1px] active:translate-y-0
                             shadow-[0_0_18px_rgba(30,144,255,0.45)]"
                >
                  SOLICITÁ TU CLASE DE PRUEBA
                </button>
              </NavLink>
            </motion.div>
          ))}
      </div>

      {/* Keyframes locales */}
      <style>{`
        @keyframes flash {
          0% { opacity: 0; transform: translateY(-50%) translateX(0); }
          20% { opacity: .9; }
          100% { opacity: 0; transform: translateY(-50%) translateX(18px); }
        }
        @keyframes pulse-ring {
          0%   { transform: translate(-50%, -50%) scale(0.3); opacity: 0.8; }
          70%  { transform: translate(-50%, -50%) scale(3);   opacity: 0;   }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .motion-reduce\\:none { animation: none !important; }
        }
       @keyframes ray {
          0%   { left: -60%; opacity: 0; }
          10%  { opacity: 1; }
          50%  { opacity: 1; }
          100% { left: 110%; opacity: 0; }
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
    {
      icon: <FaDumbbell size={28} />,
      title: 'Equipamiento Moderno',
      description: 'Máquinas de última generación con mantenimiento al día.'
    },
    {
      icon: <FaUsers size={28} />,
      title: 'Comunidad Activa',
      description: 'Ambiente enfocado, respeto por el proceso y progreso real.'
    },
    {
      icon: <FaAward size={28} />,
      title: 'Coaches Certificados',
      description: 'Metodologías probadas y seguimiento técnico cercano.'
    }
  ];

  return (
    <section className="relative isolate bg-neutral-950 py-24 px-6 overflow-hidden">
      <ParticlesBackground />

      {/* Degradé leve para profundidad */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent"
      />

      <div className="mx-auto max-w-6xl">
        {/* Header con pop-up */}
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
          <p className="text-neutral-400 mt-3">
            Tecnología, diseño y metodología al servicio de tu mejor versión.
          </p>
        </motion.div>

        {/* Grid con stagger + pop-up en cada card */}
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
              // pop-up on view
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
              // interacciones de siempre
              whileHover={{ rotateX: -6, rotateY: 6, y: -8 }}
              whileTap={{ scale: 0.995 }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 18,
                mass: 0.6
              }}
            >
              {/* Caras isométricas (top/side) */}
              <span
                aria-hidden
                className="
                  absolute inset-0 -z-10 rounded-2xl
                  before:content-[''] before:absolute before:-top-2 before:left-2
                  before:w-[calc(100%-4px)] before:h-3 before:rounded-t-2xl
                  before:bg-gradient-to-r before:from-sky-700/30 before:to-cyan-600/30
                  before:blur-[1px]
                  after:content-[''] after:absolute after:-left-2 after:top-2
                  after:w-3 after:h-[calc(100%-4px)] after:rounded-l-2xl
                  after:bg-gradient-to-b after:from-sky-700/30 after:to-cyan-600/30
                  after:blur-[1px]
                "
              />

              {/* Corte diagonal (detalle) */}
              <span
                aria-hidden
                className="
                  absolute -right-6 -top-6 size-16 rotate-45
                  bg-gradient-to-br from-neutral-800 to-neutral-900
                  border border-neutral-700
                "
              />

              {/* Borde activo sutil en hover */}
              <span
                aria-hidden
                className="
                  pointer-events-none absolute inset-0 rounded-2xl
                  ring-0 ring-sky-500/0 group-hover:ring-1 group-hover:ring-sky-500/30
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
                <div className="-rotate-45 text-sky-400 group-hover:text-cyan-300 transition-colors duration-300">
                  {f.icon}
                </div>
              </motion.div>

              {/* Título y descripción */}
              <h3 className="mt-6 text-white text-xl font-semibold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-neutral-400 leading-relaxed">
                {f.description}
              </p>

              {/* Línea base (acento) */}
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-600 opacity-40 group-hover:opacity-70 transition-opacity duration-300 rounded-b-2xl" />
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
