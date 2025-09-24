import React from "react";

// Array de imágenes del gimnasio
const imagenesGimnasio = Array.from(
  { length: 9 },
  (_, i) => new URL(`../img/Gimnasio/img-${i + 1}.webp`, import.meta.url).href
);

// Frases motivacionales
const frasesMotivacion = [
  "RESULTADOS QUE HABLAN.",
  "ENTRENAMIENTOS QUE TRANSFORMAN.",
  "Superá tus límites cada día.",
  "El cambio empieza en vos.",
  "Tu esfuerzo, tu orgullo.",
  "La constancia vence al talento.",
  "Entrená fuerte, viví mejor.",
  "No pares hasta estar orgulloso.",
  "Hazlo por ti, hazlo por tu salud.",
  "El dolor es temporal, la gloria es eterna.",
  "Sé más fuerte que tus excusas.",
  "El gimnasio es tu zona de poder.",
  "La motivación te impulsa, el hábito te mantiene.",
  "Entrena con pasión, vive con propósito.",
  "El progreso es mejor que la perfección.",
  "Hazlo por la versión de ti que quieres ser.",
  "No te compares, supérate.",
  "Hoy entrenas, mañana triunfas.",
  "El éxito es la suma de pequeños esfuerzos.",
  "La meta no es ser mejor que otros, es ser mejor que ayer.",
  "Hazlo por el placer de lograrlo.",
  "La energía que inviertes vuelve multiplicada.",
  "Entrena duro, sueña en grande.",
  "El movimiento es vida.",
  "No te detengas hasta que te sientas orgulloso.",
  "La perseverancia te hace invencible.",
  "El esfuerzo nunca se desperdicia.",
  "Hoy es el mejor día para empezar.",
  "El gimnasio es tu templo.",
  "La fuerza se construye, no se hereda.",
  "Entrena con propósito, vive con pasión.",
  "El sudor es tu medalla diaria.",
  "La superación es tu mejor recompensa.",
  "Hazlo por ti, por tu salud, por tu futuro.",
];

// Selecciona una imagen y dos frases aleatorias
const imgBanner =
  imagenesGimnasio[Math.floor(Math.random() * imagenesGimnasio.length)];
const frase1 =
  frasesMotivacion[Math.floor(Math.random() * frasesMotivacion.length)];
let frase2 =
  frasesMotivacion[Math.floor(Math.random() * frasesMotivacion.length)];
if (frase2 === frase1)
  frase2 =
    frasesMotivacion[
      (frasesMotivacion.indexOf(frase1) + 1) % frasesMotivacion.length
    ];

const Banner = () => (
  <section className="relative w-full h-[340px] md:h-[420px] lg:h-[480px] flex items-stretch overflow-hidden bg-black">
    {/* Imagen de fondo */}
    <img
      src={imgBanner}
      alt="Banner gimnasio"
      className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
      style={{ filter: "brightness(0.7) grayscale(0.2)" }}
      aria-hidden
    />
    {/* Overlay oscuro para el texto */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
    {/* Contenido */}
    <div className="relative z-10 flex flex-col md:flex-row w-full h-full">
      <div className="flex flex-col justify-center items-start px-6 md:px-12 lg:px-20 py-8 md:py-0 w-full md:w-1/2">
        <h1 className="font-druk text-3xl md:text-5xl lg:text-6xl leading-tight uppercase mb-2 text-white drop-shadow-lg">
          {frase1}
        </h1>
        <span className="font-druk text-2xl md:text-4xl lg:text-5xl leading-tight uppercase mt-2 block text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-slate-100 to-slate-500 drop-shadow-lg">
          {frase2}
        </span>
      </div>
      <div className="hidden md:block w-1/2" />
  {/* Difuminado negro arriba y abajo */}
  <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/90 to-transparent pointer-events-none" />
  <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
    </div>
  </section>
);

export default Banner;
