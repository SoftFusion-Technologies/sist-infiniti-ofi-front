import React, { useState, useEffect, useRef } from 'react'; // (NUEVO)
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ModalSuccess from './ModalSuccess';
import ModalError from './ModalError';
import Alerta from '../Error';
import { useAuth } from '../../AuthContext';

const tiposContacto = [
  'Socios que no asisten',
  'Inactivo 10 dias',
  'Inactivo 30 dias',
  'Inactivo 60 dias',
  'Prospectos inc. Socioplus',
  'Prosp inc Entrenadores',
  'Leads no convertidos'
];

const FormAltaVentas = ({
  isOpen,
  onClose,
  Rec,
  setSelectedRecaptacion,
  Sede
}) => {
  const [users, setUsers] = useState([]);
  const [selectedSede, setSelectedSede] = useState(['monteros']);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAllUsers, setSelectAllUsers] = useState(false);

  const { userName, userId } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  // const textoModal = 'Usuario creado correctamente.'; se elimina el texto
  // nuevo estado para gestionar dinámicamente según el método (PUT o POST)
  const [textoModal, setTextoModal] = useState('');

  // nueva variable para administrar el contenido de formulario para saber cuando limpiarlo
  const formikRef = useRef(null);

  const nuevoRecSchema = Yup.object().shape({
    usuario_id: Yup.number()
      .required('El usuario es obligatorio')
      .positive('Usuario inválido')
      .integer('Usuario inválido'),
    nombre: Yup.string()
      .required('El nombre es obligatorio')
      .max(255, 'El nombre no puede superar los 255 caracteres'),
    tipo_contacto: Yup.string()
      .oneOf(tiposContacto, 'Tipo de contacto inválido')
      .required('El tipo de contacto es obligatorio')
  });

  useEffect(() => {
    if (Rec) {
      // Si viene con usuarios asignados, mapear los IDs
      const ids = Rec.taskUsers?.map((tu) => tu.user.id) || [];
      setSelectedUsers(ids);
    } else {
      setSelectedUsers([]);
    }
  }, [Rec]);

  useEffect(() => {
    if (isOpen) {
      obtenerUsers(selectedSede);
    }
  }, [isOpen, selectedSede]);

  useEffect(() => {
    setSelectedUsers([]);
    setSelectAllUsers(false);
  }, [selectedSede]);

  const obtenerUsers = async (sede) => {
    try {
      const response =
        sede === 'todas' || sede === ''
          ? await axios.get('http://localhost:8080/users')
          : await axios.get('http://localhost:8080/users', {
              params: { sede }
            });

      // Filtrar los usuarios para excluir aquellos con level = 'instructor'
      const usuariosFiltrados = response.data.filter(
        (user) => user.level !== 'instructor'
      );

      setUsers(usuariosFiltrados);
    } catch (error) {
      console.log('Error al obtener los usuarios:', error);
      setUsers([]);
    }
  };

  const handleCheckboxChange = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers([]);
      formikRef.current.setFieldValue('usuario_id', '');
    } else {
      setSelectedUsers([id]);
      formikRef.current.setFieldValue('usuario_id', id);
    }
  };

  const handleSelectAllUsers = (values, setFieldValue) => {
    const allSelected = values.user.length === users.length;
    const updated = allSelected ? [] : users.map((user) => user.id);
    setFieldValue('user', updated);
  };

  const formatSedeValue = (selectedSede) => {
    return selectedSede.length === 3 ? 'todas' : selectedSede.join(', ');
  };
  const handleSubmitProspecto = async (valores) => {
    try {
      console.log('Valores del form:', valores);

      // Armar objeto completo para el backend
      const prospectoData = {
        usuario_id: userId,
        nombre: valores.nombre,
        dni: valores.dni,
        tipo_prospecto: valores.tipo_prospecto,
        canal_contacto: valores.canal_contacto,
        contacto: valores.contacto,
        actividad: valores.actividad,
        sede: Sede,
        asesor_nombre: valores.asesor_nombre,
        n_contacto_1: valores.n_contacto_1 || 0,
        n_contacto_2: valores.n_contacto_2 || 0,
        n_contacto_3: valores.n_contacto_3 || 0,
        clase_prueba_1_fecha: valores.clase_prueba_1_fecha,
        clase_prueba_1_obs: valores.clase_prueba_1_obs,
        clase_prueba_2_fecha: valores.clase_prueba_2_fecha,
        clase_prueba_2_obs: valores.clase_prueba_2_obs,
        clase_prueba_3_fecha: valores.clase_prueba_3_fecha,
        clase_prueba_3_obs: valores.clase_prueba_3_obs,
        convertido: valores.convertido || false,
        observacion: valores.observacion || ''
      };

      if (valores.canal_contacto === 'Campaña') {
        prospectoData.campania_origen = valores.campania_origen || '';
      } else {
        // Si no es campaña, lo mandás vacío o null (opcional)
        prospectoData.campania_origen = '';
      }
      const url = valores.id
        ? `http://localhost:8080/ventas_prospectos/${valores.id}`
        : 'http://localhost:8080/ventas_prospectos';

      const method = valores.id ? 'PUT' : 'POST';

      // Enviar el objeto directamente, no como array
      const bodyData = JSON.stringify(prospectoData);

      const response = await fetch(url, {
        method,
        body: bodyData,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud ${method}: ${response.status}`);
      }

      const result = await response.json();

      setTextoModal(
        method === 'PUT'
          ? 'Prospecto actualizado correctamente.'
          : 'Prospecto creado correctamente.'
      );
      setShowModal(true);
      setTimeout(() => setShowModal(false), 1500);
    } catch (error) {
      console.error('Error al guardar prospecto:', error.message);
      setErrorModal(true);
      setTimeout(() => setErrorModal(false), 1500);
    }
  };

  const handleClose = () => {
    if (formikRef.current) {
      formikRef.current.resetForm();
      setSelectedRecaptacion(null);
    }
    onClose();
  };

  const handleSedeSelection = (sede) => {
    if (selectedSede.length === 1 && selectedSede.includes(sede)) return;
    setSelectedSede((prev) =>
      prev.includes(sede)
        ? prev.filter((item) => item !== sede)
        : [...prev, sede]
    );
  };

  return (
    <div
      className={`h-screen w-screen mt-16 fixed inset-0 flex pt-10 justify-center ${
        isOpen ? 'block' : 'hidden'
      } bg-gray-800 bg-opacity-75 z-50`}
    >
      <div className={`container-inputs`}>
        <Formik
          innerRef={formikRef}
          initialValues={{
            id: Rec ? Rec.id : null,
            usuario_id: userId,
            nombre: Rec ? Rec.nombre : '',
            dni: Rec ? Rec.dni : '',
            tipo_prospecto: Rec ? Rec.tipo_prospecto : '',
            canal_contacto: Rec ? Rec.canal_contacto : '',
            contacto: Rec ? Rec.contacto : '',
            actividad: Rec ? Rec.actividad : '',
            sede: Sede,
            asesor_nombre: Rec ? Rec.asesor_nombre : '', // nombre del asesor (opcional)
            n_contacto_1: Rec ? Rec.n_contacto_1 : 0,
            n_contacto_2: Rec ? Rec.n_contacto_2 : 0,
            n_contacto_3: Rec ? Rec.n_contacto_3 : 0,
            clase_prueba_1_fecha: Rec ? Rec.clase_prueba_1_fecha : null,
            clase_prueba_1_obs: Rec ? Rec.clase_prueba_1_obs : '',
            clase_prueba_2_fecha: Rec ? Rec.clase_prueba_2_fecha : null,
            clase_prueba_2_obs: Rec ? Rec.clase_prueba_2_obs : '',
            clase_prueba_3_fecha: Rec ? Rec.clase_prueba_3_fecha : null,
            clase_prueba_3_obs: Rec ? Rec.clase_prueba_3_obs : '',
            convertido: Rec ? Rec.convertido : false,
            observacion: Rec ? Rec.observacion : ''
          }}
          enableReinitialize
          onSubmit={async (values, { resetForm }) => {
            await handleSubmitProspecto(values);
            resetForm();
          }}
          validationSchema={null}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <div className="-mt-20 max-h-screen w-full max-w-xl overflow-y-auto bg-white rounded-xl p-10">
              <Form className="formulario w-full bg-white">
                <div className="flex justify-between">
                  <div className="tools">
                    <div className="circle">
                      <span className="red toolsbox"></span>
                    </div>
                    <div className="circle">
                      <span className="yellow toolsbox"></span>
                    </div>
                    <div className="circle">
                      <span className="green toolsbox"></span>
                    </div>
                  </div>
                  <div
                    className="pr-6 pt-3 text-[20px] cursor-pointer"
                    onClick={handleClose}
                  >
                    x
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mx-2"></div>

                <div className="mb-6 px-6 py-4 bg-white rounded-lg shadow-md"></div>

                {/* Contenedor común (opcional si ya estás dentro de un <Form> que centraliza todo) */}
                <div className="space-y-4 px-6">
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="nombre"
                      className="w-1/3 text-left text-black text-base font-medium whitespace-nowrap"
                    >
                      Nom. del prospecto
                    </label>
                    <div className="w-2/3">
                      <Field
                        id="nombre"
                        name="nombre"
                        type="text"
                        className="w-full p-3 text-black bg-slate-100 rounded-xl focus:outline-orange-500"
                        placeholder="Ingrese nombre del contacto"
                        maxLength={100}
                      />
                      {errors.nombre && touched.nombre && (
                        <div className="mt-1">
                          <Alerta>{errors.nombre}</Alerta>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="dni"
                      className="w-1/3 text-left text-black text-base font-medium whitespace-nowrap"
                    >
                      DNI
                    </label>
                    <div className="w-2/3">
                      <Field
                        id="dni"
                        name="dni"
                        type="text"
                        className="w-full p-3 text-black bg-slate-100 rounded-xl focus:outline-orange-500"
                        placeholder="Ingrese DNI"
                        maxLength={20}
                      />
                      {errors.dni && touched.dni && (
                        <div className="mt-1">
                          <Alerta>{errors.dni}</Alerta>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="tipo_prospecto"
                      className="w-1/3 text-left text-black text-base font-medium whitespace-nowrap"
                    >
                      Tipo de prospecto
                    </label>
                    <div className="w-2/3">
                      <Field
                        as="select"
                        id="tipo_prospecto"
                        name="tipo_prospecto"
                        className="w-full p-3 text-black bg-slate-100 rounded-xl focus:outline-orange-500"
                      >
                        <option value="">Seleccione tipo</option>
                        <option value="Nuevo">Nuevo</option>
                        <option value="ExSocio">ExSocio</option>
                      </Field>
                      {errors.tipo_prospecto && touched.tipo_prospecto && (
                        <div className="mt-1">
                          <Alerta>{errors.tipo_prospecto}</Alerta>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="canal_contacto"
                      className="w-1/3 text-left text-black text-base font-medium whitespace-nowrap"
                    >
                      Canal de contacto
                    </label>
                    <div className="w-2/3">
                      <Field
                        as="select"
                        id="canal_contacto"
                        name="canal_contacto"
                        className="w-full p-3 text-black bg-slate-100 rounded-xl focus:outline-orange-500"
                      >
                        <option value="">Seleccione canal</option>
                        <option value="Mostrador">Mostrador</option>
                        <option value="Whatsapp">Whatsapp</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Pagina web">Pagina web</option>
                        <option value="Campaña">Campaña</option>
                        <option value="Comentarios/Stickers">
                          Comentarios/Stickers
                        </option>
                      </Field>
                      {errors.canal_contacto && touched.canal_contacto && (
                        <div className="mt-1">
                          <Alerta>{errors.canal_contacto}</Alerta>
                        </div>
                      )}
                    </div>
                  </div>

                  {values.canal_contacto === 'Campaña' && (
                    <div className="mt-3">
                      <label
                        htmlFor="campania_origen"
                        className="text-black font-medium"
                      >
                        Origen de la campaña
                      </label>
                      <Field
                        as="select"
                        id="campania_origen"
                        name="campania_origen"
                        className="w-full p-3 text-black bg-slate-100 rounded-xl focus:outline-orange-500"
                      >
                        <option value="">Seleccione origen</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Whatsapp">Whatsapp</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Otro">Otro</option>
                      </Field>
                      {errors.campania_origen && touched.campania_origen && (
                        <div className="mt-1">
                          <Alerta>{errors.campania_origen}</Alerta>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="contacto"
                      className="w-1/3 text-left text-black text-base font-medium whitespace-nowrap"
                    >
                      Contact usuario o tel
                    </label>
                    <div className="w-2/3">
                      <Field
                        id="contacto"
                        name="contacto"
                        type="text"
                        className="w-full p-3 text-black bg-slate-100 rounded-xl focus:outline-orange-500"
                        placeholder="Ingrese contacto"
                        maxLength={50}
                      />
                      {errors.contacto && touched.contacto && (
                        <div className="mt-1">
                          <Alerta>{errors.contacto}</Alerta>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="actividad"
                      className="w-1/3 text-left text-black text-base font-medium whitespace-nowrap"
                    >
                      Actividad
                    </label>
                    <div className="w-2/3">
                      <Field
                        as="select"
                        id="actividad"
                        name="actividad"
                        className="w-full p-3 text-black bg-slate-100 rounded-xl focus:outline-orange-500"
                      >
                        <option value="">Seleccione actividad</option>
                        <option value="No especifica">No especifica</option>
                        <option value="Musculacion">Musculación</option>
                        <option value="Pilates">Pilates</option>
                        <option value="Clases grupales">Clases grupales</option>
                        <option value="Pase full">Pase full</option>
                      </Field>

                      {errors.actividad && touched.actividad && (
                        <div className="mt-1">
                          <Alerta>{errors.actividad}</Alerta>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="contacto"
                      className="w-1/3 text-left text-black text-base font-medium whitespace-nowrap"
                    >
                      Observación
                    </label>
                    <div className="w-2/3">
                      <Field
                        id="observacion"
                        name="observacion"
                        type="text"
                        className="w-full p-3 text-black bg-slate-100 rounded-xl focus:outline-orange-500"
                        placeholder="Ingrese una Observación"
                        maxLength={50}
                      />
                      {errors.observacion && touched.observacion && (
                        <div className="mt-1">
                          <Alerta>{errors.observacion}</Alerta>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white py-3 px-4">
                  <input
                    type="submit"
                    value={Rec ? 'Actualizar' : 'Crear Prospecto'}
                    className="w-full bg-orange-500 py-2 px-5 rounded-xl text-white font-bold hover:bg-[#871cca] focus:outline-orange-100"
                  />
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </div>
      <ModalSuccess
        textoModal={textoModal}
        isVisible={showModal}
        onClose={() => setShowModal(false)}
      />
      <ModalError isVisible={errorModal} onClose={() => setErrorModal(false)} />
    </div>
  );
};

export default FormAltaVentas;
