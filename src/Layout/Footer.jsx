import React from "react";
import { FaInstagram, FaFacebookF, FaTiktok, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    { icon: <FaInstagram />, href: "#" },
    { icon: <FaFacebookF />, href: "#" },
    { icon: <FaTiktok />, href: "#" },
    { icon: <FaWhatsapp />, href: "#" },
  ];

  const sections = [
    {
      title: "Navegación",
      links: ["Socios", "Espacios", "Coaches", "Horarios"],
    },
    {
      title: "Legal",
      links: ["Política de Privacidad", "Términos de Uso", "Contacto"],
    },
  ];

  return (
    <footer className="bg-black text-gray-300 border-t-2 border-orange-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna del Logo y Redes Sociales */}
          <div className="space-y-4">
            <a
              href="#"
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600"
            >
              INFINITY
            </a>
            <p className="text-sm">
              Forjando tu mejor versión, un día a la vez.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-orange-500 transition-colors duration-300"
                  aria-label={`Link a ${social.href}`}
                >
                  {React.cloneElement(social.icon, { size: 20 })}
                </a>
              ))}
            </div>
          </div>

          {/* Columnas de Links */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-100 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-base text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Columna de Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 tracking-wider uppercase">
              Contacto
            </h3>
            <ul className="mt-4 space-y-2 text-base text-gray-400">
              <li>Lamadrid 986 - Tucumán</li>
              <li>L-V: 7:00 a 22:00 hs</li>
              <li>contacto@infinity.com</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-base text-gray-500">
            &copy; {new Date().getFullYear()} INFINITY Academia. Todos los
            derechos reservados.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Página creada y mantenida por{" "}
            <a
              href="https://softfusion.com.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-500 transition-colors duration-300"
            >
              SoftFusion
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
