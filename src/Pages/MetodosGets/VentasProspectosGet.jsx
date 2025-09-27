import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import NavbarStaff from '../staff/NavbarStaff';
import { Link } from 'react-router-dom';
import ClasePruebaModal from '../staff/Components/ClasePruebaModal';
import FormAltaVentas from '../../components/Forms/FormAltaVentas';
import { useAuth } from '../../AuthContext';
import StatsVentasModal from '../../components/StatsVentasModal';
import AgendasVentas from '../../components/AgendasVentas';
import { useLocation } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import FiltroMesAnio from '../staff/Components/FiltroMesAnio';
import ObservacionField from '../staff/Components/ObservacionField';
import AgendaDeHoyModal from '../staff/Components/AgendaDeHoyModal';

import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import FilterToolbar from './Components/FilterToolbar';

const getBgClass = (p) => {
  const esComision =
    p.comision === true || p.comision === 1 || p.comision === '1';
  const esConvertido =
    p.convertido === true || p.convertido === 1 || p.convertido === '1';

  if (esComision) return 'bg-sky-500'; // 🔹 Celeste = Comisión
  if (esConvertido) return 'bg-green-500'; // 🟢 Verde = Convertido
  return ''; // ⚪ Sin color = ninguno
};

const esConvertido = (v) => v === true || v === 1 || v === '1';
const esComision = (v) => v === true || v === 1 || v === '1';

const SEDES = [
  { value: 'monteros', label: 'Monteros' },
  { value: 'concepcion', label: 'Concepción' },
  { value: 'barrio sur', label: 'Barrio Sur' }
];

const normalizeSede = (sede) => {
  if (!sede) return '';
  const normalized = sede.toLowerCase().replace(/\s/g, '');
  return normalized === 'barriosur' ? 'smt' : normalized;
};

function aplicarFiltros({
  prospectos,
  search,
  selectedSede,
  tipoFiltro,
  canalFiltro,
  actividadFiltro
}) {
  if (!prospectos?.length) return [];

  const q = (search || '').toLowerCase();

  const filtepurple = prospectos.filter((p) => {
    // 1) búsqueda por nombre (podés sumar DNI / contacto si querés)
    const nombreMatch = (p.nombre || '').toLowerCase().includes(q);
    if (!nombreMatch) return false;

    // 2) sede
    if (selectedSede) {
      const sedeProspecto = normalizeSede(p.sede);
      if (sedeProspecto !== selectedSede) return false;
    }

    // 3) filtros select
    if (tipoFiltro && p.tipo_prospecto !== tipoFiltro) return false;
    if (canalFiltro && p.canal_contacto !== canalFiltro) return false;
    if (actividadFiltro && p.actividad !== actividadFiltro) return false;

    return true;
  });

  // Ordenar como en la UI (convertido primero false->true, luego id desc)
  const sorted = filtepurple.sort((a, b) => {
    if (!a.convertido && b.convertido) return -1;
    if (a.convertido && !b.convertido) return 1;
    return b.id - a.id;
  });

  return sorted;
}

function exportProspectosExcel({
  mes,
  anio,
  prospectos,
  search,
  selectedSede,
  tipoFiltro,
  canalFiltro,
  actividadFiltro,
  formatDate
}) {
  // 1) Tomamos TODO lo filtrado (no paginado)
  const rows = aplicarFiltros({
    prospectos,
    search,
    selectedSede,
    tipoFiltro,
    canalFiltro,
    actividadFiltro
  });

  // 2) Mapeo a AOA (array of arrays) para controlar orden y encabezados
  const header = [
    'Fecha',
    'Colaborador',
    'Nombre',
    'DNI',
    'Tipo Prospecto',
    'Canal Contacto',
    'Usuario / Celular',
    'Actividad',
    '#1',
    '#2',
    '#3',
    'Clase 1',
    'Clase 2',
    'Clase 3',
    'Observación',
    'Convertido'
  ];

  const aoa = [
    header,
    ...rows.map((p) => [
      p.fecha ? formatDate(p.fecha) : '',
      p.asesor_nombre || '',
      p.nombre || '',
      p.dni || '',
      p.tipo_prospecto || '',
      p.canal_contacto || '',
      p.contacto || '',
      p.actividad || '',
      '✔', // #1 fijo marcado en UI
      p.n_contacto_2 ? '✔' : '',
      p.n_contacto_3 ? '✔' : '',
      p.clase_prueba_1_fecha ? formatDate(p.clase_prueba_1_fecha) : '',
      p.clase_prueba_2_fecha ? formatDate(p.clase_prueba_2_fecha) : '',
      p.clase_prueba_3_fecha ? formatDate(p.clase_prueba_3_fecha) : '',
      (p.observacion || '').toString().replace(/\n/g, ' '),
      p.convertido ? 'Sí' : 'No'
    ])
  ];

  // 3) Crear Sheet y Workbook
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // 4) Ancho de columnas aproximado
  ws['!cols'] = [
    { wch: 12 }, // Fecha
    { wch: 20 }, // Colaborador
    { wch: 24 }, // Nombre
    { wch: 14 }, // DNI
    { wch: 16 }, // Tipo Prospecto
    { wch: 18 }, // Canal
    { wch: 22 }, // Usuario/Celular
    { wch: 18 }, // Actividad
    { wch: 6 }, // #1
    { wch: 6 }, // #2
    { wch: 6 }, // #3
    { wch: 12 }, // Clase 1
    { wch: 12 }, // Clase 2
    { wch: 12 }, // Clase 3
    { wch: 30 }, // Observación
    { wch: 10 } // Convertido
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    ws,
    `Ventas${anio}-${String(mes).padStart(2, '0')}`
  );

  // 5) Descargar
  const filename = `Ventas${anio}-${String(mes).padStart(2, '0')}.xlsx`;
  XLSX.writeFile(wb, filename);
}

const VentasProspectosGet = ({ currentUser }) => {
  const [prospectos, setProspectos] = useState([]);
  const [prospectosConAgendaHoy, setProspectosConAgendaHoy] = useState([]);

  const [page, setPage] = useState(0);
  const rowsPerPage = 20;
  const [search, setSearch] = useState('');

  const { userLevel, userId } = useAuth(); // suponiendo que tienes userId también

  const [modalClaseOpen, setModalClaseOpen] = useState(false);
  const [modalNew, setModalNew] = useState(false);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null); // {id, num}

  const [userSede, setUserSede] = useState(null);
  const [selectedSede, setSelectedSede] = useState(null); // null = todas o ninguna sede seleccionada

  // relacion al filtrado
  const [tipoFiltro, setTipoFiltro] = React.useState('');
  const [canalFiltro, setCanalFiltro] = React.useState('');
  const [actividadFiltro, setActividadFiltro] = React.useState('');

  const [showStats, setShowStats] = useState(false);

  const [observaciones, setObservaciones] = useState({});

  const location = useLocation();
  const prospectoIdToScroll = location.state?.prospectoId;
  const dataLoaded = useRef(false); // Para evitar scroll antes de que llegue la data

  const [agendaVentasCant, setAgendaVentasCant] = useState(0); // 👈 nuevo
  const [showAgendasModal, setShowAgendasModal] = useState(false);

  const [alertasSegundoContacto, setAlertasSegundoContacto] = useState({});

  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');

  const [openAgenda, setOpenAgenda] = useState(false);

  // const [soloConvertidos, setSoloConvertidos] = useState(false);
  const [alertaFiltro, setAlertaFiltro] = useState('');
  const [convertidoFiltro, setConvertidoFiltro] = useState('');

  // Evita clicks dobles mientras se procesa
  const [savingIds, setSavingIds] = useState(new Set());

  const [comisionFiltro, setComisionFiltro] = useState('');
  // '' | 'con' | 'sin'

  useEffect(() => {
    const obs = {};
    prospectos.forEach((p) => {
      obs[p.id] = p.observacion || '';
    });
    setObservaciones(obs);
  }, [prospectos]);

  // Traer prospectos con clase de prueba hoy
  useEffect(() => {
    axios
      .get(`http://localhost:8080/notifications/clases-prueba/${userId}`)
      .then((res) =>
        setProspectosConAgendaHoy(res.data.map((p) => p.prospecto_id))
      )
      .catch(() => setProspectosConAgendaHoy([]));
  }, [userId]);

  useEffect(() => {
    const loadAgendaVentasCount = async () => {
      try {
        const qs = new URLSearchParams({
          level: userLevel === 'admin' ? 'admin' : 'vendedor',
          ...(userLevel !== 'admin' ? { usuario_id: String(userId) } : {}),
          with_prospect: '1'
        });
        const r = await fetch(
          `http://localhost:8080/ventas/agenda/hoy?${qs.toString()}`
        );
        const d = await r.json();
        setAgendaVentasCant(Array.isArray(d) ? d.length : 0);
      } catch {
        setAgendaVentasCant(0);
      }
    };
    if (userId) loadAgendaVentasCount();
  }, [userId, userLevel]);

  useEffect(() => {
    // Pedí todas las alertas
    axios
      .get('http://localhost:8080/prospectos-alertas')
      .then((res) => {
        // armamos objeto: { [id]: 'rojo'/'amarillo'/'ninguno' }
        const obj = {};
        res.data.forEach((p) => {
          obj[p.id] = p.color_2do_contacto;
        });
        setAlertasSegundoContacto(obj);
      })
      .catch(() => setAlertasSegundoContacto({}));
  }, []);

  const normalizeString = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '');
  };

  const normalizeSede2 = (sede) => {
    if (!sede) return '';
    const normalized = sede.toLowerCase().replace(/\s/g, '');
    return normalized === 'smt' ? 'barrio sur' : normalized;
  };

  const sedes = [
    { key: 'monteros', label: 'Monteros' },
    { key: 'concepcion', label: 'Concepción' },
    { key: 'smt', label: 'SMT / Barrio Sur' }
  ];

  const URL = 'http://localhost:8080/ventas_prospectos';
  useEffect(() => {
    // Desplaza la página al top cuando el componente se monta
    window.scrollTo(0, 0);
  }, []);

  // Traer info del usuario para obtener sede
  useEffect(() => {
    if (!userId) return;

    const fetchUserSede = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/${userId}`);
        if (!response.ok)
          throw new Error('No se pudo obtener la info del usuario');
        const data = await response.json();
        setUserSede(normalizeString(data.sede || ''));
      } catch (error) {
        console.error('Error cargando sede del usuario:', error);
      }
    };

    fetchUserSede();
  }, [userId]);

  // Cuando userSede se carga, asigno selectedSede si no está set
  useEffect(() => {
    if (userSede && !selectedSede) {
      setSelectedSede(userSede);
    }
  }, [userSede, selectedSede]);

  useEffect(() => {
    if (mes && anio) {
      fetchProspectos();
      setPage(1);
    }
  }, [mes, anio]);

  // Abrir automáticamente a los 2 segundos, solo la primera vez
  useEffect(() => {
    let timer = setTimeout(() => setShowAgendasModal(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const fetchProspectos = async () => {
    try {
      const response = await axios.get(URL, {
        params: {
          usuario_id: currentUser?.id,
          level: currentUser?.level,
          mes, // <--- Nuevo
          anio // <--- Nuevo
        }
      });
      setProspectos(response.data);
      dataLoaded.current = true;
    } catch (error) {
      console.error('Error al obtener prospectos:', error);
    }
  };

  // Hacé scroll cuando la data esté cargada y venga el prospectoId
  useEffect(() => {
    if (dataLoaded.current && prospectoIdToScroll) {
      const row = document.getElementById(`prospecto-${prospectoIdToScroll}`);
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Opcional: resaltá la fila un rato
        row.classList.add('bg-yellow-200', 'animate-pulse');
        setTimeout(
          () => row.classList.remove('animate-pulse', 'bg-yellow-200'),
          1500
        );
      }
    }
  }, [prospectos, prospectoIdToScroll]);

  // Actualiza un campo checkbox (como n_contacto_2) y refresca lista
  const handleCheckboxChange = async (id, field) => {
    try {
      const prospecto = prospectos.find((p) => p.id === id);
      if (!prospecto) return;

      // Alternar valor para checkbox
      const nuevoValor = !prospecto[field];

      await axios.put(`${URL}/${id}`, {
        [field]: nuevoValor
      });
      fetchProspectos();
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  // Actualiza el canal y, si es campaña, el origen
  const handleCanalChange = async (id, nuevoCanal) => {
    setProspectos((old) =>
      old.map((p) =>
        p.id === id
          ? {
              ...p,
              canal_contacto: nuevoCanal,
              campania_origen:
                nuevoCanal === 'Campaña' ? p.campania_origen || '' : '' // si no es campaña, lo limpia
            }
          : p
      )
    );

    // Buscar el prospecto actual para saber el origen (si es campaña)
    const prospecto = prospectos.find((p) => p.id === id);

    try {
      await axios.put(`http://localhost:8080/ventas_prospectos/${id}`, {
        canal_contacto: nuevoCanal,
        campania_origen:
          nuevoCanal === 'Campaña' ? prospecto?.campania_origen || '' : ''
      });
    } catch (error) {
      console.error('Error al actualizar canal:', error);
    }
  };

  const handleChange = async (id, field, value) => {
    try {
      await axios.put(`${URL}/${id}`, { [field]: value });
      fetchProspectos(); // recarga la lista después de actualizar
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  const handleActividadChange = async (id, nuevaActividad) => {
    if (!nuevaActividad) return;

    const valoresValidos = [
      'No especifica',
      'Musculacion',
      'Pilates',
      'Clases grupales',
      'Pase full'
    ];

    if (!valoresValidos.includes(nuevaActividad)) return;

    // Actualiza en el estado
    setProspectos((old) =>
      old.map((p) => (p.id === id ? { ...p, actividad: nuevaActividad } : p))
    );

    // Actualiza en el backend de inmediato
    try {
      await axios.put(`${URL}/${id}`, {
        actividad: nuevaActividad
      });
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    // Solo tomar los primeros 10 caracteres "YYYY-MM-DD"
    const [year, month, day] = dateString.slice(0, 10).split('-');
    return `${day}/${month}/${year}`;
  };

  // Filtrar prospectos
  const filtepurple = prospectos?.length
    ? prospectos.filter((p) => {
        const nombreMatch = (p.nombre || '')
          .toLowerCase()
          .includes(search.toLowerCase());
        if (!nombreMatch) return false;

        // Filtro sede si aplica
        if (selectedSede) {
          const sedeProspecto = normalizeSede(p.sede);
          if (sedeProspecto !== selectedSede) return false;
        }

        // Filtros adicionales
        if (tipoFiltro && p.tipo_prospecto !== tipoFiltro) return false;
        if (canalFiltro && p.canal_contacto !== canalFiltro) return false;
        if (actividadFiltro && p.actividad !== actividadFiltro) return false;

        // 🔹 NUEVO: filtro por convertido
        if (convertidoFiltro === 'si' && !p.convertido) return false;
        if (convertidoFiltro === 'no' && p.convertido) return false;
        // 🔹 NUEVO FILTRO: sólo los que tienen alerta amarilla o roja
        if (alertaFiltro === 'con-alerta') {
          const color = alertasSegundoContacto[p.id];
          if (color !== 'amarillo' && color !== 'rojo') return false;
        }

        // 🔹 NUEVO: filtro comisión
        if (comisionFiltro === 'con' && !esComision(p.comision)) return false;
        if (comisionFiltro === 'sin' && esComision(p.comision)) return false;

        return true;
      })
    : [];

  // Ordenar por convertido y por id desc
  const sorted = [...filtepurple].sort((a, b) => {
    if (!a.convertido && b.convertido) return -1;
    if (a.convertido && !b.convertido) return 1;
    return b.id - a.id;
  });

  // Asegura que la página siempre esté entre 1 y totalPages
  const totalPages = Math.max(Math.ceil(sorted.length / rowsPerPage), 1);
  const safePage = Math.max(1, Math.min(page, totalPages)); // <-- Corrige si alguien fuerza page<1

  const startIndex = (safePage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const visibleProspectos = sorted.slice(startIndex, endIndex);

  // Para la paginación
  const handleChangePage = (nuevaPage) => {
    const nextPage = Math.max(1, Math.min(nuevaPage, totalPages));
    setPage(nextPage);

    // Hacé el scroll después de un pequeño delay para que React pinte la nueva página
    setTimeout(() => {
      if (visibleProspectos.length > 0) {
        const firstRow = document.getElementById(
          `prospecto-${visibleProspectos[0].id}`
        );
        if (firstRow) {
          firstRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Opcional: resalta la fila un segundo
          firstRow.classList.add(
            'ring-2',
            'ring-[#871cca]',
            'ring-offset-2',
            'animate-pulse'
          );
          setTimeout(() => {
            firstRow.classList.remove(
              'ring-2',
              'ring-[#871cca]',
              'ring-offset-2',
              'animate-pulse'
            );
          }, 900);
        }
      } else {
        const listTop = document.getElementById('prospectos-lista-top');
        if (listTop) {
          listTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 80); // Pequeño delay para que la tabla ya esté renderizada
  };

  // console.log('prospectosConAgendaHoy', prospectosConAgendaHoy);
  // console.log(
  //   'visibleProspectos',
  //   visibleProspectos.map((p) => p.id)
  // );

  // Calcular cuántas filas vacías para llegar a 20
  const emptyRowsCount = 20 - visibleProspectos.length;

  // Input de búsqueda
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset al buscar
  };

  const openClasePruebaModal = (id, num) => {
    setClaseSeleccionada({ id, num });
    setModalClaseOpen(true);
  };

  const handleClasePruebaSave = async (id, cambios) => {
    try {
      await axios.put(`${URL}/${id}`, cambios);

      // Actualizar estado local
      setProspectos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...cambios } : p))
      );
    } catch (error) {
      console.error('Error al guardar clase de prueba:', error);
    }
  };

  const handleEliminarProc = async (id) => {
    const confirmacion = window.confirm(
      '¿Seguro que desea eliminar esta recaptación?'
    );
    if (confirmacion) {
      try {
        await axios.delete(`${URL}/${id}`);
        setProspectos(prospectos.filter((q) => q.id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const abrirModal = () => {
    setModalNew(true);
    setClaseSeleccionada(null);
  };
  const cerarModal = () => {
    setModalNew(false);
    fetchProspectos();
  };

  const handleEditarRec = (rec) => {
    // Se actualiza el estado con los detalles de la recaptacion seleccionada
    setClaseSeleccionada(rec);

    // Se abre el modal para editar la recaptacion
    setModalNew(true);
  };

  const handleOrigenChange = async (id, value) => {
    setProspectos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, campania_origen: value } : p))
    );

    try {
      await axios.put(`http://localhost:8080/ventas_prospectos/${id}`, {
        canal_contacto: 'Campaña', // siempre es campaña acá
        campania_origen: value
      });
    } catch (error) {
      console.error('Error al actualizar origen de campaña:', error);
    }
  };

  const handleSedeChange = async (prospectoId, nuevaSede) => {
    // buscamos el prospecto actual para mostrar su nombre en el mensaje
    const prospecto = prospectos.find((p) => p.id === prospectoId);
    const sedeAnterior = prospecto?.sede;

    // actualización optimista
    setProspectos((arr) =>
      arr.map((p) => (p.id === prospectoId ? { ...p, sede: nuevaSede } : p))
    );

    try {
      await axios.put(
        `http://localhost:8080/ventas_prospectos/${prospectoId}`,
        {
          sede: nuevaSede
        }
      );

      // ✅ Éxito
      Swal.fire({
        title: 'Sede actualizada',
        text: `El prospecto "${prospecto?.nombre}" fue cambiado de "${sedeAnterior}" a "${nuevaSede}".`,
        icon: 'success',
        confirmButtonColor: '#10b981', // Tailwind green-500
        confirmButtonText: 'OK'
      });
    } catch (e) {
      // rollback si falla
      setProspectos((arr) =>
        arr.map((p) =>
          p.id === prospectoId ? { ...p, sede: sedeAnterior } : p
        )
      );

      // ❌ Error
      Swal.fire({
        title: 'Error',
        text: `No se pudo actualizar la sede de "${prospecto?.nombre}". Inténtalo de nuevo.`,
        icon: 'error',
        confirmButtonColor: '#871cca', // Tailwind purple-500
        confirmButtonText: 'Cerrar'
      });
    }
  };

  const handleConvertidoToggle = async (
    prospectoId,
    nextValue /* boolean */
  ) => {
    // evitar clicks repetidos
    if (savingIds.has(prospectoId)) return;
    setSavingIds((s) => new Set([...s, prospectoId]));

    const prospecto = prospectos.find((p) => p.id === prospectoId);
    if (!prospecto) {
      setSavingIds((s) => {
        const n = new Set(s);
        n.delete(prospectoId);
        return n;
      });
      return;
    }

    const prev = {
      convertido: !!prospecto.convertido,
      comision: !!prospecto.comision
    };

    // Caso 1: Destildan -> convertido = false y comision = false
    if (!nextValue) {
      // Optimista
      setProspectos((arr) =>
        arr.map((p) =>
          p.id === prospectoId
            ? { ...p, convertido: false, comision: false }
            : p
        )
      );

      try {
        await axios.put(
          `http://localhost:8080/ventas_prospectos/${prospectoId}`,
          {
            convertido: false,
            comision: false,
            comision_usuario_id: userId
          }
        );

        Swal.fire({
          title: 'Actualizado',
          text: `Se anuló la conversión y comisión de "${prospecto.nombre}".`,
          icon: 'success',
          confirmButtonColor: '#10b981'
        });
      } catch (e) {
        // Rollback
        setProspectos((arr) =>
          arr.map((p) => (p.id === prospectoId ? { ...p, ...prev } : p))
        );
        Swal.fire({
          title: 'Error',
          text: 'No se pudo anular la conversión/comisión. Intenta de nuevo.',
          icon: 'error',
          confirmButtonColor: '#871cca'
        });
      } finally {
        setSavingIds((s) => {
          const n = new Set(s);
          n.delete(prospectoId);
          return n;
        });
      }
      return;
    }

    // Caso 2: Tildan -> modal "¿Es comisión?"
    try {
      const { isConfirmed, isDenied, dismiss } = await Swal.fire({
        title: '¿Es comisión?',
        text: `Vas a marcar convertido a "${prospecto.nombre}". ¿Corresponde comisión?`,
        icon: 'question',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sí, es comisión',
        denyButtonText: 'No',
        confirmButtonColor: '#10b981', // green
        denyButtonColor: '#6b7280', // gray
        cancelButtonText: 'Cancelar'
      });

      // Si cancelan, no hacer nada (ni optimista, ni request)
      if (dismiss === Swal.DismissReason.cancel) {
        setSavingIds((s) => {
          const n = new Set(s);
          n.delete(prospectoId);
          return n;
        });
        // Re-sincroniza el checkbox con el estado previo
        setProspectos((arr) =>
          arr.map((p) =>
            p.id === prospectoId ? { ...p, convertido: prev.convertido } : p
          )
        );
        return;
      }

      const esComision = isConfirmed; // true si confirmaron "Sí, es comisión"

      // Optimista
      setProspectos((arr) =>
        arr.map((p) =>
          p.id === prospectoId
            ? { ...p, convertido: true, comision: !!esComision }
            : p
        )
      );

      await axios.put(
        `http://localhost:8080/ventas_prospectos/${prospectoId}`,
        {
          convertido: true,
          comision: !!esComision,
          ...(esComision && userId ? { comision_usuario_id: userId } : {})
        }
      );

      if (esComision) {
        await Swal.fire({
          title: '¡Felicidades!',
          text: '¡Tu comisión quedó registrada!',
          icon: 'success',
          confirmButtonColor: '#10b981'
        });
      } else {
        await Swal.fire({
          title: 'Convertido',
          text: `El prospecto "${prospecto.nombre}" fue marcado como convertido.`,
          icon: 'success',
          confirmButtonColor: '#10b981'
        });
      }
    } catch (e) {
      // Rollback
      setProspectos((arr) =>
        arr.map((p) => (p.id === prospectoId ? { ...p, ...prev } : p))
      );
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar el estado. Intenta nuevamente.',
        icon: 'error',
        confirmButtonColor: '#871cca'
      });
    } finally {
      setSavingIds((s) => {
        const n = new Set(s);
        n.delete(prospectoId);
        return n;
      });
    }
  };

  // estados nuevos
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

  // reemplazo: abrimos el picker primero, no el modal directo
  const openClasePruebaPicker = (prospecto, num) => {
    const fechaKey = `clase_prueba_${num}_fecha`;
    const tipoKey = `clase_prueba_${num}_tipo`;

    const yaTieneDatos = Boolean(prospecto?.[fechaKey] || prospecto?.[tipoKey]);

    // Guardamos selección base para el modal
    setClaseSeleccionada({ id: prospecto.id, num, prospecto });

    if (yaTieneDatos) {
      // 👉 Abre modal directo con lo que ya tiene (tipo preseleccionado)
      setTipoSeleccionado(prospecto?.[tipoKey] || '');
      setModalClaseOpen(true);
      return;
    }

    // 👉 No tiene datos → primero picker de tipo
    Swal.fire({
      title: `Clase #${num}`,
      text: '¿Qué querés agendar?',
      input: 'select',
      inputOptions: {
        Agenda: 'Agenda',
        'Visita programada': 'Visita programada',
        'Clase de prueba': 'Clase de prueba'
      },
      inputPlaceholder: 'Seleccioná una opción',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#10b981',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed && res.value) {
        setTipoSeleccionado(res.value);
        setModalClaseOpen(true);
      }
    });
  };

  return (
    <>
      <NavbarStaff />
      <div className="dashboardbg h-contain pt-10 pb-10">
        <div className="bg-white rounded-lg w-11/12 mx-auto pb-2 shadow-md">
          <div className="pl-5 pt-5">
            <Link to="/dashboard">
              <button className="py-2 px-5 bg-[#871cca] rounded-lg text-sm text-white hover:bg-purple-500 transition-colors duration-300">
                Volver
              </button>
            </Link>
          </div>
          <div className="text-center pt-4 text-[#871cca] titulo text-6xl font-bold">
            <h1>VENTAS</h1>
          </div>
          {/* Filtros */}

          <section className="flex flex-col sm:flex-row flex-wrap gap-4 justify-between items-center my-6 px-2">
            <FiltroMesAnio
              mes={mes}
              setMes={setMes}
              anio={anio}
              setAnio={setAnio}
            />
          </section>

          <button
            onClick={() =>
              exportProspectosExcel({
                mes,
                anio,
                prospectos, // todos los registros del mes/año ya cargados
                search,
                selectedSede, // filtros activos
                tipoFiltro,
                canalFiltro,
                actividadFiltro,
                formatDate // tu helper
              })
            }
            className="ml-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500"
          >
            Exportar Excel
          </button>
          <FilterToolbar
            search={search}
            setSearch={setSearch}
            tipoFiltro={tipoFiltro}
            setTipoFiltro={setTipoFiltro}
            canalFiltro={canalFiltro}
            setCanalFiltro={setCanalFiltro}
            actividadFiltro={actividadFiltro}
            setActividadFiltro={setActividadFiltro}
            convertidoFiltro={convertidoFiltro}
            setConvertidoFiltro={setConvertidoFiltro}
            comisionFiltro={comisionFiltro}
            setComisionFiltro={setComisionFiltro}
            alertaFiltro={alertaFiltro}
            setAlertaFiltro={setAlertaFiltro}
            selectedSede={selectedSede}
            setSelectedSede={setSelectedSede}
            mes={mes}
            setMes={setMes}
            anio={anio}
            setAnio={setAnio}
            onExportClick={() =>
              exportProspectosExcel({
                mes,
                anio,
                prospectos,
                search,
                selectedSede,
                tipoFiltro,
                canalFiltro,
                actividadFiltro,
                convertidoFiltro,
                alertaFiltro,
                comisionFiltro,
                formatDate
              })
            }
            counts={{
              all: prospectos.length,
              convertidos: prospectos.filter((p) => p.convertido).length,
              comision: prospectos.filter((p) => p.comision).length,
              alerta: prospectos.filter((p) =>
                ['amarillo', 'rojo'].includes(alertasSegundoContacto[p.id])
              ).length
            }}
          />

          <div className="flex justify-center gap-3 pb-10 flex-wrap">
            <Link to="#">
              <button
                onClick={abrirModal}
                className="bg-[#58b35e] hover:bg-[#4e8a52] text-white py-2 px-4 rounded transition-colors duration-100 z-10"
              >
                Nuevo Registro
              </button>
            </Link>

            <button
              onClick={() => setShowStats(true)}
              className="bg-[#871cca] hover:bg-purple-500 text-white py-2 px-4 rounded transition-colors duration-100 font-semibold"
            >
              Ver Estadísticas
            </button>

            {/* ⚠️ Mantener pill amarillo */}
            <div
              className="flex items-center ml-3 gap-1 bg-yellow-200 border border-yellow-400 text-yellow-900 font-bold px-4 py-1 rounded-xl shadow select-none cursor-pointer hover:scale-105 active:scale-95 transition"
              onClick={() => setShowAgendasModal(true)}
              title="Ver agendas automáticas del día"
            >
              <span className="text-xl font-black">⚠️</span>
              <span>Agendas de hoy:</span>
              <span className="text-lg">
                {prospectosConAgendaHoy.length + agendaVentasCant}
              </span>
            </div>

            {/* 🔴 Nuevo botón Agenda de hoy con badge fijo en 4 */}
            {/* <button
              onClick={() => setOpenAgenda(true)}
              className="relative bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded font-semibold transition-colors duration-100"
              title="Ver agenda de hoy"
            >
              Nueva Agendas
            </button> */}
          </div>

          {/* Botones de sedes con control de acceso */}
          <div className="w-full flex justify-center mb-10 px-2">
            <div
              className="flex gap-2 md:gap-4 flex-wrap md:flex-nowrap overflow-x-auto scrollbar-hide py-2"
              style={{ WebkitOverflowScrolling: 'touch', maxWidth: '100vw' }}
            >
              {sedes.map(({ key, label }) => {
                const normalizedKey = normalizeString(key);
                const isSelected = selectedSede === normalizedKey;

                return (
                  <button
                    key={key}
                    className={`
        flex-shrink-0
        px-6 py-2
        rounded-full
        font-bold
        text-sm md:text-base
        focus:outline-none focus:ring-2 focus:ring-green-500
        transition-all duration-150
        ${
          isSelected
            ? 'bg-green-800 text-white shadow-md scale-105 border border-green-900'
            : 'bg-green-600 text-white hover:bg-green-700 border border-green-700'
        }
      `}
                    style={{
                      minWidth: 120,
                      marginBottom: 4,
                      marginTop: 4,
                      letterSpacing: '.02em'
                    }}
                    onClick={() => {
                      setSelectedSede(
                        selectedSede === normalizedKey ? null : normalizedKey
                      );
                      setPage(1);
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <style>{`
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
          </div>

          <div className="text-center pt-4">
            <h1>
              Registros de Prospectos - Cantidad: {visibleProspectos.length}
            </h1>
          </div>

          <div className="w-full flex flex-col items-center mt-4">
            <div className="flex gap-2 items-center select-none">
              <button
                className={`rounded-full px-3 py-1 font-bold border-2 text-[#871cca] border-[#871cca] bg-white/80 hover:bg-[#871cca] hover:text-white shadow-sm transition disabled:opacity-30`}
                onClick={() => handleChangePage(1)}
                disabled={safePage === 1}
                aria-label="Primera página"
              >
                ⏮
              </button>
              <button
                className={`rounded-full px-3 py-1 font-bold border-2 text-[#871cca] border-[#871cca] bg-white/80 hover:bg-[#871cca] hover:text-white shadow-sm transition disabled:opacity-30`}
                onClick={() => handleChangePage(safePage - 1)}
                disabled={safePage === 1}
                aria-label="Anterior"
              >
                ←
              </button>
              {/* Números de página, máximo 5 botones visibles */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) =>
                  totalPages <= 5
                    ? true
                    : Math.abs(n - safePage) <= 2 || n === 1 || n === totalPages
                )
                .map((n, i, arr) => (
                  <React.Fragment key={n}>
                    {/* ...puntitos entre saltos */}
                    {i > 0 && n - arr[i - 1] > 1 && (
                      <span className="px-1 text-gray-400">…</span>
                    )}
                    <button
                      className={`rounded-full px-3 py-1 font-bold border-2 ${
                        n === safePage
                          ? 'bg-[#871cca] text-white border-[#871cca] scale-110 shadow-lg'
                          : 'bg-white/90 text-[#871cca] border-[#871cca] hover:bg-[#871cca] hover:text-white'
                      } shadow-sm transition`}
                      onClick={() => handleChangePage(n)}
                    >
                      {n}
                    </button>
                  </React.Fragment>
                ))}
              <button
                className={`rounded-full px-3 py-1 font-bold border-2 text-[#871cca] border-[#871cca] bg-white/80 hover:bg-[#871cca] hover:text-white shadow-sm transition disabled:opacity-30`}
                onClick={() => handleChangePage(safePage + 1)}
                disabled={safePage === totalPages}
                aria-label="Siguiente"
              >
                →
              </button>
              <button
                className={`rounded-full px-3 py-1 font-bold border-2 text-[#871cca] border-[#871cca] bg-white/80 hover:bg-[#871cca] hover:text-white shadow-sm transition disabled:opacity-30`}
                onClick={() => handleChangePage(totalPages)}
                disabled={safePage === totalPages}
                aria-label="Última página"
              >
                ⏭
              </button>
            </div>
            <span className="text-sm text-gray-500 mt-1">
              Página <span className="font-bold">{safePage}</span> de{' '}
              <span className="font-bold">{totalPages}</span> &bull; Mostrando{' '}
              <span className="font-bold">{visibleProspectos.length}</span> de{' '}
              <span className="font-bold">{sorted.length}</span> prospectos
            </span>
          </div>

          {/* Modal de agendas automáticas */}
          <AgendasVentas
            userId={userId}
            level={userLevel} // 👈 pasar el nivel
            open={showAgendasModal}
            onClose={() => setShowAgendasModal(false)}
            onVentasCountChange={setAgendaVentasCant} // 👈 opcional para refrescar contador al marcar done
          />

          <div className="overflow-auto max-h-[70vh] mt-6 rounded-lg shadow-lg border border-gray-300 bg-white">
            <table className="uppercase min-w-[900px] text-sm border-collapse w-full">
              <thead className="bg-purple-600 text-white  sticky top-0 z-20">
                <tr>
                  <th className="border border-gray-200 px-3 py-2 text-left min-w-[140px]">
                    Fecha
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left min-w-[140px]">
                    Colaborador
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left min-w-[140px]">
                    Nombre
                  </th>{' '}
                  <th className="border border-gray-200 px-3 py-2 text-left min-w-[140px]">
                    Sede
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left w-24">
                    DNI
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left w-32">
                    Tipo Prospecto
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left w-36">
                    Canal Contacto
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left min-w-[140px]">
                    Usuario / Celular
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left min-w-[160px]">
                    Actividad
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-center w-10">
                    #1
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-center w-10">
                    #2
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-center w-10">
                    #3
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-center w-28">
                    Clase 1
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-center w-28">
                    Clase 2
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-center w-28">
                    Clase 3
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-center w-16">
                    Observación
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-center w-16">
                    Convertido
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-center w-16 rounded-r-lg">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProspectos.map((p) => (
                  <tr
                    id={`prospecto-${p.id}`}
                    key={p.id}
                    className={`${
                      prospectosConAgendaHoy.includes(Number(p.id))
                        ? 'bg-yellow-100 font-semibold'
                        : ''
                    } hover:bg-purple-600 transition-colors duration-300 cursor-pointer text-gray-800`}
                    style={{ minHeight: '48px' }}
                  >
                    <td
                      className={`border border-gray-300 px-4 py-3 min-w-[50px] ${getBgClass(
                        p
                      )}`}
                    >
                      {formatDate(p.fecha)}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-3 min-w-[50px] ${getBgClass(
                        p
                      )}`}
                    >
                      {p.asesor_nombre}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-3 min-w-[160px] ${getBgClass(
                        p
                      )}`}
                    >
                      <div className="flex items-center gap-2">
                        {alertasSegundoContacto[p.id] === 'amarillo' && (
                          <span
                            title="Pendiente segundo contacto"
                            className="text-yellow-400 text-xl font-bold"
                            style={{ lineHeight: 1 }}
                          >
                            &#9888;
                          </span>
                        )}

                        {alertasSegundoContacto[p.id] === 'rojo' && (
                          <AlertTriangle
                            title="Segundo contacto URGENTE"
                            className="text-purple-500 inline-block"
                            size={22}
                            style={{ verticalAlign: 'middle', marginRight: 4 }}
                          />
                        )}

                        <input
                          type="text"
                          value={p.nombre}
                          onChange={(e) =>
                            handleChange(p.id, 'nombre', e.target.value)
                          }
                          className="
        w-full
        border-b
        border-gray-300
        text-sm
        px-2
        py-1
        text-gray-700
        bg-white
        transition-colors
        duration-200
        ease-in-out
        hover:text-black
        focus:border-purple-600
        focus:outline-none
        cursor-text
      "
                          placeholder="Nombre completo"
                        />
                      </div>
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-3 min-w-[180px] ${getBgClass(
                        p
                      )}`}
                    >
                      {/* Sede */}
                      <select
                        value={(p.sede || '').toLowerCase()}
                        onChange={(e) => handleSedeChange(p.id, e.target.value)}
                        className="
      w-full
      rounded
      border border-gray-300
      text-sm px-3 py-2 font-sans text-gray-700 bg-white
      transition-colors duration-200 ease-in-out
      hover:bg-purple-50 hover:text-purple-900
      focus:outline-none focus:ring-2 focus:ring-purple-400
      focus:border-purple-600 cursor-pointer
    "
                      >
                        {SEDES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td
                      className={`border border-gray-300 px-4 py-3 min-w-[160px] ${getBgClass(
                        p
                      )}`}
                    >
                      <input
                        type="text"
                        value={p.dni}
                        onChange={(e) =>
                          handleChange(p.id, 'dni', e.target.value)
                        }
                        className="
      w-full
      border-b
      border-gray-300
      text-sm
      px-2
      py-1
      text-gray-700
      bg-white
      transition-colors
      duration-200
      ease-in-out
      hover:text-black
      focus:border-purple-600
      focus:outline-none
      cursor-text
    "
                        placeholder="DNI"
                      />
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-3 min-w-[160px] ${getBgClass(
                        p
                      )}`}
                    >
                      <select
                        value={p.tipo_prospecto}
                        onChange={(e) =>
                          handleChange(p.id, 'tipo_prospecto', e.target.value)
                        }
                        className="
      w-full
      rounded
      border
      border-gray-300
      text-sm
      px-3
      py-2
      font-sans
      text-gray-700
      bg-white
      transition-colors
      duration-200
      ease-in-out
      hover:bg-purple-50
      hover:text-purple-900
      focus:outline-none
      focus:ring-2
      focus:ring-purple-400
      focus:border-purple-600
      cursor-pointer
    "
                      >
                        <option value="Nuevo">Nuevo</option>
                        <option value="ExSocio">ExSocio</option>
                      </select>
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-3 min-w-[180px] ${getBgClass(
                        p
                      )}`}
                    >
                      {/* Canal de contacto */}
                      <select
                        value={p.canal_contacto}
                        onChange={(e) =>
                          handleCanalChange(p.id, e.target.value)
                        }
                        className="
      w-full
      rounded
      border border-gray-300
      text-sm px-3 py-2 font-sans text-gray-700 bg-white
      transition-colors duration-200 ease-in-out
      hover:bg-purple-50 hover:text-purple-900
      focus:outline-none focus:ring-2 focus:ring-purple-400
      focus:border-purple-600 cursor-pointer
    "
                      >
                        <option value="Mostrador">Mostrador</option>
                        <option value="Whatsapp">Whatsapp</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Pagina web">Página web</option>
                        <option value="Campaña">Campaña</option>
                        <option value="Comentarios/Stickers">
                          Comentarios/Stickers
                        </option>
                      </select>

                      {/* Select para origen de campaña (solo si el canal es "Campaña") */}
                      {p.canal_contacto === 'Campaña' && (
                        <select
                          value={p.campania_origen || ''}
                          onChange={(e) =>
                            handleOrigenChange(p.id, e.target.value)
                          }
                          className="w-full mt-2 rounded border border-gray-300 text-sm px-3 py-2 font-sans text-gray-700 bg-white"
                        >
                          <option value="">Seleccione origen</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Whatsapp">Whatsapp</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Otro">Otro</option>
                        </select>
                      )}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-3 min-w-[160px] ${getBgClass(
                        p
                      )}`}
                    >
                      <input
                        type="text"
                        value={p.contacto}
                        onChange={(e) =>
                          handleChange(p.id, 'contacto', e.target.value)
                        }
                        className="
      w-full
      border-b
      border-gray-300
      text-sm
      px-2
      py-1
      text-gray-700
      bg-white
      transition-colors
      duration-200
      ease-in-out
      hover:text-black
      focus:border-purple-600
      focus:outline-none
      cursor-text
    "
                        placeholder="Usuario / Celular"
                      />
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-3 min-w-[170px] ${getBgClass(
                        p
                      )}`}
                    >
                      <select
                        value={p.actividad || ''}
                        onChange={(e) =>
                          handleActividadChange(p.id, e.target.value)
                        }
                        className="
                        w-full
                        rounded
                        border
                        border-gray-300
                        text-sm
                        px-3
                        py-2
                        font-sans
                        text-gray-700
                        bg-white
                        transition-colors
                        duration-200
                        ease-in-out
                        hover:bg-purple-50
                        hover:text-purple-900
                        focus:outline-none
                        focus:ring-2
                        focus:ring-purple-400
                        focus:border-purple-600
                        cursor-pointer
                      "
                      >
                        <option value="">Seleccione actividad</option>
                        <option value="No especifica">No especifica</option>
                        <option value="Musculacion">Musculación</option>
                        <option value="Pilates">Pilates</option>
                        <option value="Clases grupales">Clases grupales</option>
                        <option value="Pase full">Pase full</option>
                      </select>
                    </td>
                    {/* N° contacto */}
                    <td
                      className={`border border-gray-300 px-4 py-3 min-w-[50px] ${getBgClass(
                        p
                      )}`}
                    >
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="mx-auto cursor-default transform scale-150"
                      />
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-3 min-w-[50px] ${getBgClass(
                        p
                      )}`}
                    >
                      <input
                        type="checkbox"
                        checked={!!p.n_contacto_2}
                        onChange={() =>
                          handleCheckboxChange(p.id, 'n_contacto_2')
                        }
                        className="mx-auto cursor-default transform scale-150"
                      />
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-3 min-w-[50px] ${getBgClass(
                        p
                      )}`}
                    >
                      <input
                        type="checkbox"
                        checked={!!p.n_contacto_3}
                        onChange={() =>
                          handleCheckboxChange(p.id, 'n_contacto_3')
                        }
                        className="mx-auto cursor-default transform scale-150"
                      />
                    </td>
                    {/* Clases de prueba */}
                    {[1, 2, 3].map((num) => {
                      const fecha = p[`clase_prueba_${num}_fecha`];
                      const tipo = p[`clase_prueba_${num}_tipo`]; // 👈 nuevo campo
                      return (
                        <td
                          key={num}
                          className={`border border-gray-300 px-4 py-3 min-w-[50px] ${getBgClass(
                            p
                          )} cursor-pointer`}
                          onClick={() => openClasePruebaPicker(p, num)}
                          title="Click para elegir tipo y editar fecha/observaciones"
                        >
                          <div className="text-sm">
                            {fecha ? formatDate(fecha) : '-'}
                          </div>
                          {tipo && (
                            <div className="mt-1 inline-block px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800">
                              {tipo}
                            </div>
                          )}
                        </td>
                      );
                    })}

                    <td
                      className={`border border-gray-300 px-4 py-3 min-w-[160px] ${getBgClass(
                        p
                      )}`}
                    >
                      <ObservacionField
                        value={observaciones[p.id] ?? p.observacion ?? ''}
                        onSave={async (nuevo) => {
                          // actualiza estado local
                          setObservaciones((prev) => ({
                            ...prev,
                            [p.id]: nuevo
                          }));
                          // persiste si cambió
                          if (nuevo !== p.observacion) {
                            await handleChange(p.id, 'observacion', nuevo);
                          }
                        }}
                      />
                    </td>
                    {/* Convertido */}
                    <td
                      className={`border border-gray-300 px-4 py-3 min-w-[50px] ${getBgClass(
                        p
                      )}`}
                    >
                      <input
                        type="checkbox"
                        checked={!!p.convertido}
                        disabled={savingIds.has(p.id)}
                        onChange={(e) =>
                          handleConvertidoToggle(p.id, e.target.checked)
                        }
                        className={`mx-auto transform scale-150 ${
                          savingIds.has(p.id)
                            ? 'cursor-not-allowed opacity-60'
                            : 'cursor-pointer'
                        }`}
                      />
                    </td>
                    {/* Editar y eliminar */}
                    <td
                      className={`border border-gray-300 px-4 py-3 min-w-[50px] ${getBgClass(
                        p
                      )}`}
                    >
                      <div className="flex justify-center items-center gap-3">
                        {/* <button
                          onClick={() => handleEditarRec(p)}
                          className="text-purple-600 hover:text-purple-800 font-semibold"
                          title="Editar"
                          aria-label={`Editar prospecto ${p.nombre}`}
                        >
                          ✏️
                        </button> */}

                        <button
                          onClick={() => handleEliminarProc(p.id)}
                          className="text-purple-500 hover:text-purple-700 font-semibold"
                          title="Eliminar"
                          aria-label={`Eliminar prospecto ${p.nombre}`}
                        >
                          ❌
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Filas vacías para completar 20 */}
                {emptyRowsCount > 0 &&
                  Array.from({ length: emptyRowsCount }).map((_, idx) => (
                    <tr key={`empty-${idx}`} className="h-12">
                      <td
                        colSpan={17}
                        className="border border-gray-300 bg-gray-50"
                      />
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full flex flex-col items-center mt-4">
          <div className="flex gap-2 items-center select-none">
            <button
              className={`rounded-full px-3 py-1 font-bold border-2 text-[#871cca] border-[#871cca] bg-white/80 hover:bg-[#871cca] hover:text-white shadow-sm transition disabled:opacity-30`}
              onClick={() => handleChangePage(1)}
              disabled={safePage === 1}
              aria-label="Primera página"
            >
              ⏮
            </button>
            <button
              className={`rounded-full px-3 py-1 font-bold border-2 text-[#871cca] border-[#871cca] bg-white/80 hover:bg-[#871cca] hover:text-white shadow-sm transition disabled:opacity-30`}
              onClick={() => handleChangePage(safePage - 1)}
              disabled={safePage === 1}
              aria-label="Anterior"
            >
              ←
            </button>
            {/* Números de página, máximo 5 botones visibles */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) =>
                totalPages <= 5
                  ? true
                  : Math.abs(n - safePage) <= 2 || n === 1 || n === totalPages
              )
              .map((n, i, arr) => (
                <React.Fragment key={n}>
                  {/* ...puntitos entre saltos */}
                  {i > 0 && n - arr[i - 1] > 1 && (
                    <span className="px-1 text-gray-400">…</span>
                  )}
                  <button
                    className={`rounded-full px-3 py-1 font-bold border-2 ${
                      n === safePage
                        ? 'bg-[#871cca] text-white border-[#871cca] scale-110 shadow-lg'
                        : 'bg-white/90 text-[#871cca] border-[#871cca] hover:bg-[#871cca] hover:text-white'
                    } shadow-sm transition`}
                    onClick={() => handleChangePage(n)}
                  >
                    {n}
                  </button>
                </React.Fragment>
              ))}
            <button
              className={`rounded-full px-3 py-1 font-bold border-2 text-[#871cca] border-[#871cca] bg-white/80 hover:bg-[#871cca] hover:text-white shadow-sm transition disabled:opacity-30`}
              onClick={() => handleChangePage(safePage + 1)}
              disabled={safePage === totalPages}
              aria-label="Siguiente"
            >
              →
            </button>
            <button
              className={`rounded-full px-3 py-1 font-bold border-2 text-[#871cca] border-[#871cca] bg-white/80 hover:bg-[#871cca] hover:text-white shadow-sm transition disabled:opacity-30`}
              onClick={() => handleChangePage(totalPages)}
              disabled={safePage === totalPages}
              aria-label="Última página"
            >
              ⏭
            </button>
          </div>
          <span className="text-sm text-gray-500 mt-1">
            Página <span className="font-bold">{safePage}</span> de{' '}
            <span className="font-bold">{totalPages}</span> &bull; Mostrando{' '}
            <span className="font-bold">{visibleProspectos.length}</span> de{' '}
            <span className="font-bold">{sorted.length}</span> prospectos
          </span>
        </div>
      </div>
      <ClasePruebaModal
        isOpen={modalClaseOpen}
        onClose={() => {
          setModalClaseOpen(false);
          setTipoSeleccionado(null); // limpiar tipo al cerrar
        }}
        onSave={handleClasePruebaSave}
        numeroClase={claseSeleccionada?.num}
        prospecto={prospectos.find((p) => p.id === claseSeleccionada?.id)}
        tipoSeleccionado={tipoSeleccionado}
      />


      <FormAltaVentas
        isOpen={modalNew}
        onClose={cerarModal}
        Rec={claseSeleccionada}
        setSelectedRecaptacion={setClaseSeleccionada}
        Sede={normalizeSede2(selectedSede)}
      />
      <StatsVentasModal
        open={showStats}
        onClose={() => setShowStats(false)}
        sede={selectedSede} // <-- acá le pasás la sede seleccionada (puede ser null para todas)
        normalizeSede2={normalizeSede2}
        mes={mes} // ✅ Nuevo
        anio={anio} // ✅ Nuevo
      />
      <AgendaDeHoyModal
        open={openAgenda}
        onClose={() => setOpenAgenda(false)}
        userId={userId}
        level={userLevel}
      />
    </>
  );
};

export default VentasProspectosGet;
