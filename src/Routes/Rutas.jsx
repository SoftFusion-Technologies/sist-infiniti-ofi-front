import Home from "../Pages/Public/Home.jsx";
import ClasePrueba from "../Pages/Public/ClasePrueba.jsx";
import Horarios from "../Pages/Public/Horarios.jsx";
import Socios from "../Pages/Public/Socios.jsx";
import Espacios from "../Pages/Public/Espacios.jsx";

const routes = [
    {
        path: "/",
        element: <Home />,
        name: "Home",
        showInNav: false, // El logo ya nos lleva al Home
    },
    {
        path: "/clase-prueba",
        element: <ClasePrueba />,
        name: "Clase de Prueba",
        showInNav: false, // Esto será un botón aparte
    },
    {
        path: "/horarios",
        element: <Horarios />,
        name: "Horarios",
        showInNav: true,
    },
    {
        path: "/socios",
        element: <Socios />,
        name: "Socios",
        showInNav: true,
    },
    {
        path: "/espacios",
        element: <Espacios />,
        name: "Espacios",
        showInNav: true,
    }
]

export default routes;