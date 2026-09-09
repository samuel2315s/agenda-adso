// Archivo: src/App.jsx
// Componente principal de la aplicación Agenda ADSO.
// Se encarga de:
// - Cargar la lista de contactos desde la API (JSON Server).
// - Manejar estados globales (contactos, carga, error).
// - Conectar el formulario, el buscador y las tarjetas de contactos.
// - Aplicar búsqueda y ordenamiento sobre la lista de contactos.
// - Buscar también por teléfono.
// - Mostrar la cantidad de contactos visibles.

// Importamos hooks de React
import { useEffect, useState } from "react";

// Importamos las funciones de la API (capa de datos)
import { listarContactos, crearContacto, eliminarContactoPorId } from "./api";

// Importamos la configuración global de la aplicación
import { APP_INFO } from "./config";

// Importamos componentes hijos
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";

function App() {
  // Estado que almacena la lista de contactos obtenidos de la API
  const [contactos, setContactos] = useState([]);

  // Estado que indica si estamos cargando información
  const [cargando, setCargando] = useState(true);

  // Estado para guardar mensajes de error generales
  const [error, setError] = useState("");

  // =====================================================
  // ESTADOS PARA BÚSQUEDA Y ORDENAMIENTO
  // =====================================================

  // Estado para el término de búsqueda digitado por el usuario
  const [busqueda, setBusqueda] = useState("");

  // Estado para controlar el orden:
  // true = A-Z
  // false = Z-A
  const [ordenAsc, setOrdenAsc] = useState(true);

  // =====================================================
  // CARGAR CONTACTOS DESDE JSON SERVER
  // =====================================================

  useEffect(() => {
    const cargarContactos = async () => {
      try {
        setCargando(true);
        setError("");

        // Llamamos a la API
        const data = await listarContactos();

        // Guardamos los contactos
        setContactos(data);
      } catch (error) {
        console.error("Error al cargar contactos:", error);

        setError(
          "No se pudieron cargar los contactos. Verifica que el servidor esté encendido e intenta de nuevo.",
        );
      } finally {
        setCargando(false);
      }
    };

    cargarContactos();
  }, []);

  // =====================================================
  // AGREGAR CONTACTO
  // =====================================================

  const onAgregarContacto = async (nuevoContacto) => {
    try {
      setError("");

      // Creamos el contacto en JSON Server
      const creado = await crearContacto(nuevoContacto);

      // Agregamos el nuevo contacto al estado
      setContactos((prev) => [...prev, creado]);
    } catch (error) {
      console.error("Error al crear contacto:", error);

      setError(
        "No se pudo guardar el contacto. Verifica tu conexión o el estado del servidor e intenta nuevamente.",
      );

      throw error;
    }
  };

  // =====================================================
  // ELIMINAR CONTACTO
  // =====================================================

  const onEliminarContacto = async (id) => {
    try {
      setError("");

      // Eliminamos el contacto de la API
      await eliminarContactoPorId(id);

      // Eliminamos el contacto del estado local
      setContactos((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error al eliminar contacto:", error);

      setError(
        "No se pudo eliminar el contacto. Vuelve a intentarlo o verifica el servidor.",
      );
    }
  };

  // =====================================================
  // FILTRO DE CONTACTOS
  // =====================================================

  const contactosFiltrados = contactos.filter((c) => {
    // Convertimos la búsqueda a minúsculas
    const termino = busqueda.toLowerCase();

    // Convertimos nombre a minúsculas
    const nombre = (c.nombre || "").toLowerCase();

    // Convertimos correo a minúsculas
    const correo = (c.correo || "").toLowerCase();

    // Convertimos etiqueta a minúsculas
    const etiqueta = (c.etiqueta || "").toLowerCase();

    // Convertimos teléfono a texto
    // Esto permite buscar números como "321"
    const telefono = String(c.telefono || "").toLowerCase();

    // El contacto aparece si la búsqueda coincide con:
    // nombre, correo, etiqueta o teléfono
    return (
      nombre.includes(termino) ||
      correo.includes(termino) ||
      etiqueta.includes(termino) ||
      telefono.includes(termino)
    );
  });

  // =====================================================
  // ORDENAMIENTO
  // =====================================================

  // Creamos una COPIA del arreglo antes de utilizar sort()
  // para no modificar directamente el estado original.
  const contactosOrdenados = [...contactosFiltrados].sort((a, b) => {
    // Convertimos los nombres a minúsculas
    const nombreA = (a.nombre || "").toLowerCase();
    const nombreB = (b.nombre || "").toLowerCase();

    // Orden A-Z
    if (nombreA < nombreB) {
      return ordenAsc ? -1 : 1;
    }

    // Orden Z-A
    if (nombreA > nombreB) {
      return ordenAsc ? 1 : -1;
    }

    // Si los nombres son iguales
    return 0;
  });

  // =====================================================
  // INTERFAZ
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* =====================================================
            ENCABEZADO
        ===================================================== */}

        <header className="mb-8">
          <p className="text-xs tracking-[0.3em] text-gray-500 uppercase">
            Desarrollo Web ReactJS Ficha {APP_INFO.ficha}
          </p>

          <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
            {APP_INFO.titulo}
          </h1>

          <p className="text-sm text-gray-600 mt-1">{APP_INFO.subtitulo}</p>
        </header>

        {/* =====================================================
            MENSAJE DE ERROR
        ===================================================== */}

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* =====================================================
            CARGANDO
        ===================================================== */}

        {cargando ? (
          <p className="text-sm text-gray-500">Cargando contactos...</p>
        ) : (
          <>
            {/* =====================================================
                FORMULARIO PARA CREAR CONTACTOS
            ===================================================== */}

            <FormularioContacto onAgregar={onAgregarContacto} />

            {/* =====================================================
                BUSCADOR Y ORDENAMIENTO
            ===================================================== */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
              {/* Campo de búsqueda controlado */}
              <input
                type="text"
                className="w-full md:flex-1 rounded-xl border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-sm"
                placeholder="Buscar por nombre, correo, etiqueta o teléfono..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              {/* Botón para cambiar A-Z / Z-A */}
              <button
                type="button"
                onClick={() => setOrdenAsc((prev) => !prev)}
                className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-200"
              >
                {ordenAsc ? "Ordenar Z-A" : "Ordenar A-Z"}
              </button>
            </div>

            {/* =====================================================
                CONTADOR DE RESULTADOS
            ===================================================== */}

            <p className="text-sm text-gray-600 mb-4">
              Mostrando {contactosOrdenados.length} contacto(s)
            </p>

            {/* =====================================================
                LISTA DE CONTACTOS
            ===================================================== */}

            <section className="space-y-4">
              {contactosOrdenados.length === 0 ? (
                // Si no hay resultados
                <p className="text-sm text-gray-500">
                  No se encontraron contactos que coincidan con la búsqueda.
                </p>
              ) : (
                // Mostramos los contactos filtrados y ordenados
                contactosOrdenados.map((c) => (
                  <ContactoCard
                    key={c.id}
                    nombre={c.nombre}
                    telefono={c.telefono}
                    correo={c.correo}
                    etiqueta={c.etiqueta}
                    onEliminar={() => onEliminarContacto(c.id)}
                  />
                ))
              )}
            </section>
          </>
        )}

        {/* =====================================================
            PIE DE PÁGINA
        ===================================================== */}

        <footer className="mt-8 text-xs text-gray-400">
          <p>Desarrollo Web – ReactJS | Proyecto Agenda ADSO</p>

          <p>Instructor: Gustavo Adolfo Bolaños Dorado</p>
        </footer>
      </div>
    </div>
  );
}

// Exportamos el componente principal
export default App;
