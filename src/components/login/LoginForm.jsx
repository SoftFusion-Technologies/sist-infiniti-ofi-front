/*
 * Programador: Benjamin Orellana
 * Fecha Actualización: 21 / 06 / 2025
 * Versión: 1.1
 *
 * Descripción:
 * Este archivo (LoginForm.jsx) es el formulario exclusivo de login de usuarios (email + password),
 * autenticado contra la base de datos y gestionado con JWT.
 *
 * Tema: Renderización - Login
 * Capa: Frontend
 */

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Alerta from '../Error';
import { useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';
import '../../Styles/login.css';
import { useAuth } from '../../AuthContext';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ParticlesBackground from '../ParticlesBackground';
import VideoLogin from '../../img/staff/videoBienvenida.mp4';

Modal.setAppElement('#root');

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const element = document.getElementById('login');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);

      axios
        .post('http://localhost:8080/login', {
          email: values.email,
          password: values.password
        })
        .then((res) => {
          setLoading(false);
          if (res.data.message === 'Success') {
            login(
              res.data.token,
              res.data.id,
              res.data.nombre,
              res.data.email,
              res.data.rol,
              res.data.local_id,
              res.data.es_reemplazante
            );

            if (res.data.rol === 'vendedor') {
              navigate('/dashboard');
            } else {
              navigate('/dashboard');
            }
          } else {
            setModalMessage('Usuario o contraseña incorrectos');
            setIsModalOpen(true);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
          setModalMessage('Error al conectar con el servidor');
          setIsModalOpen(true);
        });
    }
  };

  return (
    <div
      id="login"
      className="h-screen w-full flex items-center justify-center bg-cover bg-center relative"
    >
      {/* VIDEO DE FONDO */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={VideoLogin}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />

      {/* PARTICLES: debajo del overlay y sin capturar eventos */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <ParticlesBackground />
      </div>

      {/* CAPA OSCURA */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10" />

      {/* TARJETA / FORMULARIO */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        whileHover={{
          scale: 1.01,
          boxShadow: '0 8px 30px rgba(202, 215, 215, 0.3)'
        }}
        className="relative z-20 bg-white shadow-2xl rounded-2xl p-8 w-[95%] max-w-md mx-auto"
      >
        <h1 className="uppercase text-5xl font-bignoodle font-bold text-center text-gray-600 mb-2">
          Bienvenido
        </h1>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-sm text-gray-500 mb-6"
        >
          Iniciá sesión para acceder al panel
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              id="email"
              type="email"
              name="email"
              placeholder="ejemplo@correo.com"
              className="w-full mt-1 p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all"
              onChange={handleInput}
            />
            {errors.email && <Alerta>{errors.email}</Alerta>}
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                className="w-full mt-1 p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all pr-10"
                onChange={handleInput}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-600"
                aria-label={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <Alerta>{errors.password}</Alerta>}
          </div>

          {/* Botón de envío */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-gray-500 text-white w-full py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-[#8d9695] transition-all"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </motion.button>
          </div>
        </form>

        {/* Frase motivadora */}
        <p className="mt-6 text-center text-xs text-gray-400 italic">
          "La constancia supera al talento"
        </p>
      </motion.div>

      {/* MODAL DE ERROR */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Error Modal"
        className="flex justify-center items-center h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Error</h2>
          <p>{modalMessage}</p>
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );

};

export default LoginForm;
