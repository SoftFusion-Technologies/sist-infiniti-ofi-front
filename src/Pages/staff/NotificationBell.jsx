import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [hideNotificationCounter, setHideNotificationCounter] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { userName, userLevel } = useAuth();
  const URL = 'http://localhost:8080/';

  useEffect(() => {
    const getUserId = async () => {
      try {
        const res = await fetch(`${URL}users/`);
        if (!res.ok)
          throw new Error(`Error al obtener los usuarios: ${res.statusText}`);
        const users = await res.json();

        const login = String(userName || '').trim();

        // normalizadores
        const norm = (s) =>
          String(s || '')
            .trim()
            .toLowerCase();
        const localPart = (email) =>
          String(email || '')
            .split('@')[0]
            ?.toLowerCase();

        // intenta por email exacto, por nombre, y por parte local del email
        const user =
          users.find((u) => norm(u.email) === norm(login)) ||
          users.find((u) => norm(u.nombre) === norm(login)) ||
          users.find((u) => localPart(u.email) === norm(login));

        if (user) {
          setUserId(user.id);
        } else {
          // fallback opcional: elegí el primer admin
          const fallbackAdmin = users.find((u) => norm(u.rol) === 'admin');
          if (fallbackAdmin) {
            console.warn(
              `No se encontró ${login}. Usando admin id=${fallbackAdmin.id} como fallback.`
            );
            setUserId(fallbackAdmin.id);
          } else {
            console.log(
              `Usuario "${login}" no encontrado y no hay admin de fallback.`
            );
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getUserId();
  }, [userName]);

  const fetchNotifications = async () => {
    try {
      if (!userId) return;

      // 1) Lista por usuario (ajusta la ruta si cambiaste a /notifications/user/:userId)
      const res = await fetch(`${URL}notifications/${userId}`);
      const data = await res.json();

      // 2) Clases de prueba hoy
      const resClases = await fetch(
        `${URL}notifications/clases-prueba/${userId}`
      );
      const clasesPrueba = await resClases.json();

      const clasesPruebaNotis = (clasesPrueba || []).map((p) => ({
        id: `clase-prueba-${p.prospecto_id}`,
        title: 'Clase de prueba agendada HOY',
        message: `Clase para ${p.nombre} (${p.contacto})`,
        created_at:
          p.clase_prueba_1_fecha ||
          p.clase_prueba_2_fecha ||
          p.clase_prueba_3_fecha,
        leido: 0,
        reference_id: p.prospecto_id,
        type: 'clase_prueba'
      }));

      const ALLOWED_TITLES = new Set([
        'Nueva queja registrada',
        'Nueva pregunta frecuente registrada',
        'Nueva clase de prueba registrada'
        // 'Nueva novedad registrada',
      ]);

      const filteredData = (data || [])
        .map((n) => ({ ...n, leido: n.leido ?? 0 }))
        .filter((n) => ALLOWED_TITLES.has(n.title));

      const allNotis = [...clasesPruebaNotis, ...filteredData];
      const unread = allNotis.filter((n) => n.leido === 0);

      console.log('[notis] usuario', userId, {
        totalBackend: (data || []).length,
        totalClases: (clasesPrueba || []).length,
        totalAll: allNotis.length,
        unread: unread.length,
        sample: allNotis[0]
      });

      setNotifications(allNotis);
      setNewNotificationCount(unread.length);
    } catch (error) {
      console.error('Error al obtener las notificaciones:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const handleNotificationClick = async (notification) => {
    setIsOpen(!isOpen);
    if (newNotificationCount > 0) {
      setNewNotificationCount(0);
      setHideNotificationCounter(true);
    }

    try {
      const response = await fetch(`${URL}notifications/markAsRead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notification_id: notification.id,
          user_id: userId
        })
      });

      const result = await response.json();
      if (response.ok) {
        const updatedNotifications = notifications.map((n) =>
          n.id === notification.id ? { ...n, leido: 1 } : n
        );
        setNotifications(updatedNotifications);
      } else {
        console.error(result.mensajeError);
      }
    } catch (error) {
      console.error('Error al marcar la notificación como leída:', error);
    }
  };

  const handleRedirect = (notification) => {
    const title = String(notification?.title || '')
      .toLowerCase()
      .trim();
    const module = String(notification?.module || '')
      .toLowerCase()
      .trim();
    const refId = notification?.reference_id;

    if (!refId) return; // sin id no redirigimos

    // Helpers
    const is = (t) => title === t;

    if (is('nueva queja registrada')) {
      navigate(`/dashboard/quejas/${refId}`);
      return;
    }

    if (is('nueva novedad registrada')) {
      navigate(`/dashboard/novedades/${refId}`);
      return;
    }

    // 🔸 Clase de prueba → LEADS
    if (
      is('nueva clase de prueba registrada') ||
      is('clase de prueba agendada hoy') ||
      notification?.type === 'clase_prueba' ||
      module === 'clases_de_prueba'
    ) {
      // Pasá el id por estado (o por query si preferís)
      navigate('/dashboard/leads', { state: { prospectoId: refId } });
      return;
    }

    if (is('nueva pregunta frecuente registrada')) {
      navigate(`/dashboard/ask/${refId}`);
      return;
    }

    // Fallback: si el módulo viniera mapeado, podés rutear por módulo
    // if (module === 'algo') navigate('/dashboard/lo-que-sea');
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="w-7 h-7 text-gray-700 hover:text-orange-500 transition duration-200 ease-in-out transform hover:scale-110" />
        {newNotificationCount > 0 && !hideNotificationCounter && (
          <span className="absolute top-[-6px] right-[-6px] bg-red-500 text-white text-xs rounded-full px-2 py-1 transition transform scale-110 animate-pulse">
            {newNotificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-md shadow-lg z-50 transform transition-all duration-200 ease-in-out opacity-100 scale-100">
          <ul className="max-h-64 overflow-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => {
                    handleRedirect(n);
                    handleNotificationClick(n);
                  }}
                  className={`p-4 border-b text-sm cursor-pointer transition duration-300 ease-in-out transform ${
                    n.leido
                      ? 'bg-gray-100'
                      : 'bg-red-100 hover:bg-red-200 text-red-700' // Fondo rojo si no leída
                  }`}
                >
                  <div className="flex flex-col">
                    <strong className="text-lg text-gray-900 uppercase">{n.title}</strong>
                    <div className="mt-1 text-gray-800 text-sm">
                      {n.message}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {format(new Date(n.created_at), 'dd/MM/yyyy HH:mm')}
                    </div>
                    {n.leido === 0 && (
                      <span className="text-xs text-red-500 mt-1">
                        No leída
                      </span> // Indicador de "No leída"
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="p-2 text-sm text-gray-500">Sin notificaciones</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
