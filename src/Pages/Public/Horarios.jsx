import { FaMapMarkerAlt, FaCalendarDay, FaCalendarWeek } from 'react-icons/fa';

const Horarios = () => {
  const schedule = [
    {
      icon: <FaCalendarWeek className="text-orange-500" size={30} />,
      days: 'Lunes a Viernes',
      time: '07:00 - 22:00 hs',
    },
    {
      icon: <FaCalendarDay className="text-orange-500" size={30} />,
      days: 'Sábados y Feriados',
      time: '10:00 - 17:00 hs',
    },
  ];

  return (
    <div className="bg-gray-950 flex items-center justify-center py-12 px-4">
      <div className="max-w-3xl w-full bg-black p-8 sm:p-10 rounded-xl shadow-2xl shadow-orange-500/20 border border-gray-800">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Horarios</span>
          </h1>
          <p className="mt-3 text-lg text-gray-400">Siempre abiertos para ayudarte a alcanzar tus metas.</p>
        </div>

        {/* Schedule Cards */}
        <div className="space-y-6 mb-10">
          {schedule.map((item, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-6 flex items-center space-x-5 border border-gray-700/50">
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{item.days}</h3>
                <p className="text-gray-300 text-lg">{item.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Location */}
        <div className="border-t border-gray-800 pt-8 text-center">
            <div className="flex items-center justify-center text-gray-300 mb-4">
                <FaMapMarkerAlt className="text-orange-500 mr-3" size={20}/>
                <span className="text-lg">Lamadrid 986 - Barrio Sur, Tucumán</span>
            </div>
            <p className="font-semibold text-xl text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                #DaleVeniAEntrenar 💪
            </p>
        </div>

      </div>
    </div>
  );
}

export default Horarios;