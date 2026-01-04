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
  const [fichaArrastrada, setFichaArrastrada] = useState(null);
  const [posicionArrastre, setPosicionArrastre] = useState({ x: 0, y: 0 });

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
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    setPosicionArrastre({
      x: e.clientX - rect.left - ficha.x,
      y: e.clientY - rect.top - ficha.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!fichaArrastrada || !tableroImagen) return;

    const contenedor = e.currentTarget;
    const rect = contenedor.getBoundingClientRect();
    const x = e.clientX - rect.left - posicionArrastre.x;
    const y = e.clientY - rect.top - posicionArrastre.y;

    setFichas(
      fichas.map((f) =>
        f.id === fichaArrastrada
          ? {
              ...f,
              x: Math.max(0, Math.min(x, 100)),
              y: Math.max(0, Math.min(y, 100)),
            }
          : f
      )
    );
  };

  const handleMouseUp = () => {
    setFichaArrastrada(null);
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
