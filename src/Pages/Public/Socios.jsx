import React from 'react';
import { NavLink } from 'react-router-dom';

const Socios = () => {
  // Datos ficticios para los socios (empresas asociadas)
  const socios = [
    { 
      id: 1, 
      name: 'Farmacia Saludable', 
      benefit: '15% de descuento en suplementos deportivos.', 
      logo: 'https://placehold.co/400x200/1a1a1a/f97316/png?text=Farmacia+Saludable' 
    },
    { 
      id: 2, 
      name: 'NutriVida Market', 
      benefit: '10% de descuento en todas tus compras orgánicas.', 
      logo: 'https://placehold.co/400x200/1a1a1a/a855f7/png?text=NutriVida' 
    },
    { 
      id: 3, 
      name: 'Deportes Activos', 
      benefit: '20% de descuento en indumentaria y calzado.', 
      logo: 'https://placehold.co/400x200/1a1a1a/ffffff/png?text=Deportes+Activos' 
    },
    { 
      id: 4, 
      name: 'Kine-Fisio Center', 
      benefit: 'Primera consulta de kinesiología sin cargo.', 
      logo: 'https://placehold.co/400x200/1a1a1a/f97316/png?text=Kine-Fisio' 
    },
    { 
      id: 5, 
      name: 'Barra Energética', 
      benefit: 'Batidos y licuados post-entreno con 10% OFF.', 
      logo: 'https://placehold.co/400x200/1a1a1a/a855f7/png?text=Barra+Energética' 
    },
    { 
      id: 6, 
      name: 'Mente Zen', 
      benefit: 'Clases de meditación y yoga con descuento exclusivo.', 
      logo: 'https://placehold.co/400x200/1a1a1a/ffffff/png?text=Mente+Zen' 
    },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Partners</span>
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
            Por ser miembro de INFINITY, obtienes beneficios exclusivos en las mejores marcas y servicios.
          </p>
        </div>

        {/* Galería de Socios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {socios.map((socio) => (
            <div key={socio.id} className="bg-black rounded-xl overflow-hidden border border-gray-800 flex flex-col justify-between text-center group">
              <div className="p-6 flex items-center justify-center bg-gray-900 h-40">
                <img className="max-h-24 w-auto transition-transform duration-300 group-hover:scale-105" src={socio.logo} alt={`Logo de ${socio.name}`} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white">{socio.name}</h3>
                <p className="mt-2 text-gray-300">{socio.benefit}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sección para Hacerse Socio (CTA) */}
        <div className="mt-24 bg-black rounded-xl shadow-2xl border border-gray-800 p-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
                Disfruta estos y más beneficios
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                Únete a la familia INFINITY para acceder a descuentos y promociones exclusivas de nuestros partners.
            </p>
            <NavLink to="/clase-prueba">
                <button className="px-8 py-3 font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-md hover:opacity-90 transition-all duration-300 transform hover:scale-105 text-lg">
                    Quiero ser Socio
                </button>
            </NavLink>
        </div>

      </div>
    </div>
  );
}

export default Socios;