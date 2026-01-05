import { useState, useRef } from "react";
import "./App.css";

const CATEGORIAS = {
  HEROES: "Heroes",
  BESTIAS: "Bestias",
  OTROS: "Otros",
};

function App() {
  const [tableroImagen, setTableroImagen] = useState(null);
  const [fichas, setFichas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    CATEGORIAS.HEROES
  );
  const [nombreFicha, setNombreFicha] = useState("");
  const fileInputRef = useRef(null);
  const idCounterRef = useRef(0);
  const tableroRef = useRef(null);
  const [fichaArrastrada, setFichaArrastrada] = useState(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleCargarImagen = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTableroImagen(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAgregarFicha = () => {
    if (!nombreFicha.trim()) {
      alert("Por favor ingresa un nombre para la ficha");
      return;
    }

    idCounterRef.current += 1;
    const nuevaFicha = {
      id: idCounterRef.current,
      nombre: nombreFicha.trim(),
      categoria: categoriaSeleccionada,
      x: 50, // posición inicial
      y: 50,
      color: getColorPorCategoria(categoriaSeleccionada),
    };

    setFichas([...fichas, nuevaFicha]);
    setNombreFicha("");
  };

  const getColorPorCategoria = (categoria) => {
    switch (categoria) {
      case CATEGORIAS.HEROES:
        return "#3b82f6"; // azul
      case CATEGORIAS.BESTIAS:
        return "#ef4444"; // rojo
      case CATEGORIAS.OTROS:
        return "#10b981"; // verde
      default:
        return "#6b7280"; // gris
    }
  };

  const handleEliminarFicha = (id) => {
    setFichas(fichas.filter((f) => f.id !== id));
  };

  const handleMouseDown = (e, ficha) => {
    e.preventDefault();
    e.stopPropagation();
    setFichaArrastrada(ficha.id);

    const fichaRect = e.currentTarget.getBoundingClientRect();

    // Calcular el offset desde el centro de la ficha hasta el punto donde se hizo clic
    offsetRef.current = {
      x: e.clientX - (fichaRect.left + fichaRect.width / 2),
      y: e.clientY - (fichaRect.top + fichaRect.height / 2),
    };
  };

  const handleMouseMove = (e) => {
    if (!fichaArrastrada || !tableroImagen || !tableroRef.current) return;

    const rect = tableroRef.current.getBoundingClientRect();

    // Calcular posición del mouse relativa al tablero
    const mouseX = e.clientX - rect.left - offsetRef.current.x;
    const mouseY = e.clientY - rect.top - offsetRef.current.y;

    // Convertir a porcentajes
    const nuevoX = (mouseX / rect.width) * 100;
    const nuevoY = (mouseY / rect.height) * 100;

    // Limitar dentro de los límites del tablero
    const xLimitado = Math.max(0, Math.min(nuevoX, 100));
    const yLimitado = Math.max(0, Math.min(nuevoY, 100));

    setFichas((prevFichas) =>
      prevFichas.map((f) =>
        f.id === fichaArrastrada
          ? {
              ...f,
              x: xLimitado,
              y: yLimitado,
            }
          : f
      )
    );
  };

  const handleMouseUp = () => {
    setFichaArrastrada(null);
    offsetRef.current = { x: 0, y: 0 };
  };

  const fichasPorCategoria = (categoria) => {
    return fichas.filter((f) => f.categoria === categoria);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Tablero de Rol</h1>
        <button
          className="btn-cargar"
          onClick={() => fileInputRef.current?.click()}
        >
          Cargar Tablero
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleCargarImagen}
          style={{ display: "none" }}
        />
      </header>

      <div className="contenedor-principal">
        <aside className="sidebar">
          <div className="panel-agregar">
            <h2>Añadir Ficha</h2>
            <div className="categorias">
              {Object.values(CATEGORIAS).map((cat) => (
                <button
                  key={cat}
                  className={`btn-categoria ${
                    categoriaSeleccionada === cat ? "activa" : ""
                  }`}
                  onClick={() => setCategoriaSeleccionada(cat)}
                  style={{
                    backgroundColor:
                      categoriaSeleccionada === cat
                        ? getColorPorCategoria(cat)
                        : "#374151",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Nombre de la ficha"
              value={nombreFicha}
              onChange={(e) => setNombreFicha(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAgregarFicha()}
              className="input-nombre"
            />
            <button onClick={handleAgregarFicha} className="btn-agregar">
              Añadir Ficha
            </button>
          </div>

          <div className="panel-fichas">
            <h2>Fichas ({fichas.length})</h2>
            <div className="lista-fichas">
              {Object.values(CATEGORIAS).map((categoria) => {
                const fichasCat = fichasPorCategoria(categoria);
                if (fichasCat.length === 0) return null;

                return (
                  <div key={categoria} className="categoria-grupo">
                    <h3
                      className="categoria-titulo"
                      style={{ color: getColorPorCategoria(categoria) }}
                    >
                      {categoria} ({fichasCat.length})
                    </h3>
                    {fichasCat.map((ficha) => (
                      <div key={ficha.id} className="ficha-item">
                        <span className="ficha-nombre">{ficha.nombre}</span>
                        <button
                          className="btn-eliminar"
                          onClick={() => handleEliminarFicha(ficha.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
              {fichas.length === 0 && (
                <p className="sin-fichas">No hay fichas añadidas</p>
              )}
            </div>
          </div>
        </aside>

        <main className="tablero-contenedor">
          {tableroImagen ? (
            <div
              ref={tableroRef}
              className="tablero"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                src={tableroImagen}
                alt="Tablero"
                className="tablero-imagen"
                draggable={false}
              />
              {fichas.map((ficha) => (
                <div
                  key={ficha.id}
                  className="ficha"
                  style={{
                    left: `${ficha.x}%`,
                    top: `${ficha.y}%`,
                    backgroundColor: ficha.color,
                    cursor: fichaArrastrada === ficha.id ? "grabbing" : "grab",
                    transition:
                      fichaArrastrada === ficha.id
                        ? "none"
                        : "transform 0.1s, box-shadow 0.1s",
                  }}
                  onMouseDown={(e) => handleMouseDown(e, ficha)}
                  title={ficha.nombre}
                >
                  <span className="ficha-inicial">
                    {ficha.nombre.charAt(0).toUpperCase()}
                  </span>
                  <span className="ficha-nombre-tooltip">{ficha.nombre}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="tablero-vacio">
              <p>Carga una imagen de tablero para comenzar</p>
              <button
                className="btn-cargar-grande"
                onClick={() => fileInputRef.current?.click()}
              >
                Cargar Tablero
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
