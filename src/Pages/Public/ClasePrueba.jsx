import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaWhatsapp } from "react-icons/fa"; // Importar el ícono de WhatsApp
import { naranja } from "../../constants/colores";

const ClasePrueba = () => {
  // Define el esquema de validación con Yup
  const validationSchema = Yup.object({
    nombre: Yup.string()
      .min(3, "Debe tener al menos 3 caracteres")
      .required("El nombre es obligatorio"),
    apellido: Yup.string()
      .min(3, "Debe tener al menos 3 caracteres")
      .required("El apellido es obligatorio"),
    dni: Yup.string()
      .matches(/^[0-9]+$/, "El DNI solo debe contener números")
      .min(7, "El DNI debe tener entre 7 y 8 dígitos")
      .max(8, "El DNI debe tener entre 7 y 8 dígitos")
      .required("El DNI es obligatorio"),
    telefono: Yup.string()
      .matches(/^[0-9]+$/, "El teléfono solo debe contener números")
      .min(10, "Debe tener al menos 10 dígitos")
      .required("El número de teléfono es obligatorio"),
    objetivos: Yup.string()
      .oneOf(
        [
          "perder_peso",
          "ganar_musculo",
          "mejorar_resistencia",
          "salud_general",
        ],
        "Selecciona un objetivo válido"
      )
      .required("Debes seleccionar un objetivo"),
  });

  // Configura Formik
  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      dni: "",
      telefono: "",
      objetivos: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log("Datos del formulario:", values);
      alert(
        "¡Gracias! Hemos recibido tu solicitud para una clase de prueba. Nos pondremos en contacto contigo pronto."
      );
      resetForm();
    },
  });

  const renderError = (field) =>
    formik.touched[field] &&
    formik.errors[field] && (
      <p className="text-red-500 text-xs mt-1">{formik.errors[field]}</p>
    );

  // Objeto para definir los campos del formulario
  const formFields = [
    { name: "nombre", label: "Nombre", type: "text", autoFocus: true },
    { name: "apellido", label: "Apellido", type: "text" },
    { name: "dni", label: "DNI", type: "text" },
    { name: "telefono", label: "Número de Teléfono", type: "tel" },
    {
      name: "objetivos",
      label: "¿Cuál es tu principal objetivo?",
      type: "select",
      options: [
        { value: "", label: "Selecciona una opción" },
        { value: "perder_peso", label: "Perder peso" },
        { value: "ganar_musculo", label: "Ganar masa muscular" },
        { value: "mejorar_resistencia", label: "Mejorar resistencia" },
        { value: "salud_general", label: "Salud y bienestar general" },
      ],
    },
  ];

  const inputStyles =
    "mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-500";

  return (
    <div className="bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-black p-8 rounded-xl shadow-2xl shadow-orange-500/20 border border-gray-800">
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Solicita tu Clase de Prueba
        </h2>
        <p className="text-center text-gray-400 mb-8">
          Completa el formulario y da el primer paso hacia tu mejor versión.
        </p>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {formFields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-300"
              >
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field.name]}
                  className={inputStyles}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  autoFocus={field.autoFocus || false}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field.name]}
                  className={inputStyles}
                />
              )}
              {renderError(field.name)}
            </div>
          ))}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-gray-900 transition-opacity"
            >
              ENVIAR SOLICITUD
            </button>
          </div>
        </form>
        {/* Sección de WhatsApp */}
        <div className="text-center mt-8 border-t border-gray-800 pt-6">
          <p className="text-gray-400 text-sm mb-3">
            O si lo prefieres, contáctanos directamente:
          </p>
          <a
            href="https://wa.me/3854382934" // Número ficticio de Argentina
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 transition-colors"
          >
            <FaWhatsapp size={20} />
            <span>Chatear por WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ClasePrueba;
