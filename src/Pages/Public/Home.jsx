import { FaDumbbell, FaUsers, FaAward } from "react-icons/fa";
import Ubication from "../../components/ubication";
import routes from "../../Routes/Rutas";
import { NavLink } from "react-router-dom";

// Componente para la sección principal (Hero)
const HeroSection = () => (
  <div className="relative bg-black text-white text-center py-40 px-4">
    <div
      className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-30"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2787&auto=format&fit=crop')",
      }}
    ></div>
    <div className="relative z-10">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
        FORJA TU{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
          MEJOR VERSIÓN
        </span>
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
        En INFINITY, no solo levantas pesas. Elevas tu potencial. Únete a
        nuestra comunidad y transforma tu vida.
      </p>
      {routes
        .filter((r) => r.name === "Clase de Prueba")
        .map((r) => (
          <NavLink to={r.path} key={r.name}>
            <button className="px-8 py-3 font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-md hover:opacity-90 transition-all duration-300 transform hover:scale-105 text-lg">
              Solicita tu Clase de Prueba
            </button>
          </NavLink>
        ))}
    </div>
  </div>
);

// Componente para la sección de características
const FeaturesSection = () => {
  const features = [
    {
      icon: <FaDumbbell size={44} className="mx-auto text-orange-500" />,
      title: "Equipamiento Moderno",
      description:
        "Máquinas de última generación para maximizar tus resultados.",
    },
    {
      icon: <FaUsers size={44} className="mx-auto text-purple-500" />,
      title: "Comunidad Increíble",
      description: "Entrena en un ambiente de apoyo y motivación constante.",
    },
    {
      icon: <FaAward size={44} className="mx-auto text-yellow-400" />,
      title: "Coaches Certificados",
      description: "Expertos dedicados a guiarte en cada paso de tu camino.",
    },
  ];

  return (
    <div className="bg-neutral-950 py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="relative p-8 bg-neutral-900 rounded-2xl shadow-lg border border-neutral-800 transition-transform duration-300 hover:-translate-y-2 hover:shadow-orange-500/20"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-bold text-white mt-2 mb-2 tracking-tight">
              {feature.title}
            </h3>
            <p className="text-gray-400">{feature.description}</p>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-500 to-yellow-400 opacity-30 rounded-b-2xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para la sección de testimonios
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ana Pérez",
      quote:
        "El cambio en mi vida ha sido increíble. Los coaches son súper atentos y el ambiente es genial. ¡Lo recomiendo al 100%!",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Carlos Vera",
      quote:
        "Nunca pensé que disfrutaría tanto ir al gimnasio. INFINITY es más que un lugar para entrenar, es una segunda casa.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
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
