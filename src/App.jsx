import { useState, useRef, useEffect } from "react";
import "./App.css";

const CATEGORIAS = {
  HEROES: "Heroes",
  BESTIAS: "Bestias",
  OTROS: "Otros",
};

const ESTADOS = {
  SALUDABLE: "saludable",
  HERIDO: "herido",
  INCONSCIENTE: "inconsciente",
  MUERTO: "muerto",
};

function App() {
  const [tableroImagen, setTableroImagen] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [fichas, setFichas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    CATEGORIAS.HEROES
  );
  const [nombreFicha, setNombreFicha] = useState("");
  const [imagenFicha, setImagenFicha] = useState("");
  const [hpMaxFicha, setHpMaxFicha] = useState(50);
  const [hpActualFicha, setHpActualFicha] = useState(50);
  const [tamañoFicha, setTamañoFicha] = useState(55);
  const [fichaEditando, setFichaEditando] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const fileInputRef = useRef(null);
  const imagenFichaInputRef = useRef(null);
  const idCounterRef = useRef(0);
  const tableroRef = useRef(null);
  const [fichaArrastrada, setFichaArrastrada] = useState(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const spacePressedRef = useRef(false);

  const handleCargarImagen = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTableroImagen(e.target.result);
        setZoom(100); // Resetear zoom al cargar nueva imagen
        setPan({ x: 0, y: 0 }); // Resetear pan
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZoomChange = (nuevoZoom) => {
    setZoom(Math.max(25, Math.min(300, nuevoZoom))); // Limitar entre 25% y 300%
  };

  const handleZoomIn = () => {
    handleZoomChange(zoom + 10);
  };

  const handleZoomOut = () => {
    handleZoomChange(zoom - 10);
  };

  const handleZoomReset = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 }); // Resetear pan al resetear zoom
  };

  const handleWheel = (e) => {
    if (!tableroImagen) return;
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -5 : 5;
      handleZoomChange(zoom + delta);
    }
  };

  const handleCargarImagenFicha = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagenFicha(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calcularEstadoPorHP = (hpActual, hpMax) => {
    if (hpActual <= 0) return ESTADOS.MUERTO;
    if (hpActual < hpMax * 0.5) return ESTADOS.INCONSCIENTE;
    if (hpActual < hpMax) return ESTADOS.HERIDO;
    return ESTADOS.SALUDABLE;
  };

  const handleAgregarFicha = () => {
    if (!nombreFicha.trim()) {
      alert("Por favor ingresa un nombre para la ficha");
      return;
    }

    if (fichaEditando) {
      // Editar ficha existente
      const estadoCalculado = calcularEstadoPorHP(hpActualFicha, hpMaxFicha);
      setFichas(
        fichas.map((f) =>
          f.id === fichaEditando.id
            ? {
                ...f,
                nombre: nombreFicha.trim(),
                categoria: categoriaSeleccionada,
                imagen: imagenFicha || f.imagen,
                hpMax: hpMaxFicha,
                hpActual: hpActualFicha,
                estado: estadoCalculado,
                tamaño: tamañoFicha,
                color: getColorPorCategoria(categoriaSeleccionada),
              }
            : f
        )
      );
      if (modalAbierto) {
        handleCerrarModal();
      } else {
        setFichaEditando(null);
      }
    } else {
      // Nueva ficha
      idCounterRef.current += 1;
      const estadoCalculado = calcularEstadoPorHP(hpActualFicha, hpMaxFicha);
      const nuevaFicha = {
        id: idCounterRef.current,
        nombre: nombreFicha.trim(),
        categoria: categoriaSeleccionada,
        tipo: categoriaSeleccionada,
        imagen: imagenFicha,
        hpMax: hpMaxFicha,
        hpActual: hpActualFicha,
        estado: estadoCalculado,
        tamaño: tamañoFicha,
        x: 50,
        y: 50,
        color: getColorPorCategoria(categoriaSeleccionada),
      };

      setFichas([...fichas, nuevaFicha]);
    }

    // Resetear formulario
    setNombreFicha("");
    setImagenFicha("");
    setHpMaxFicha(50);
    setHpActualFicha(50);
    setTamañoFicha(55);
  };

  const handleEditarFicha = (ficha, abrirModal = false) => {
    setFichaEditando(ficha);
    setNombreFicha(ficha.nombre);
    setCategoriaSeleccionada(ficha.categoria);
    setImagenFicha(ficha.imagen || "");
    setHpMaxFicha(ficha.hpMax || 50);
    setHpActualFicha(ficha.hpActual || ficha.hpMax || 50);
    setTamañoFicha(ficha.tamaño || 55);

    if (abrirModal) {
      setModalAbierto(true);
    } else {
      // Scroll al formulario (para el botón de editar en la lista)
      document
        .querySelector(".panel-agregar")
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setFichaEditando(null);
    setNombreFicha("");
    setImagenFicha("");
    setHpMaxFicha(50);
    setHpActualFicha(50);
    setTamañoFicha(55);
  };

  const handleCancelarEdicion = () => {
    if (modalAbierto) {
      handleCerrarModal();
    } else {
      setFichaEditando(null);
      setNombreFicha("");
      setImagenFicha("");
      setHpMaxFicha(50);
      setHpActualFicha(50);
      setTamañoFicha(55);
    }
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

  const getColorHP = (hpActual, hpMax) => {
    if (hpActual <= 0) return "#6b7280"; // gris - muerto
    const porcentaje = hpActual / hpMax;
    if (porcentaje < 0.25) return "#ef4444"; // rojo - crítico
    if (porcentaje < 0.5) return "#f59e0b"; // naranja - grave
    if (porcentaje < 0.75) return "#eab308"; // amarillo - herido
    return "#10b981"; // verde - saludable
  };

  const getLabelEstado = (estado) => {
    switch (estado) {
      case ESTADOS.MUERTO:
        return "💀 Muerto";
      case ESTADOS.INCONSCIENTE:
        return "😴 Inconsciente";
      case ESTADOS.HERIDO:
        return "🩹 Herido";
      default:
        return "✅ Saludable";
    }
  };

  const handleEliminarFicha = (id) => {
    setFichas(fichas.filter((f) => f.id !== id));
  };

  const handleMouseDown = (e, ficha) => {
    e.preventDefault();
    e.stopPropagation();
    setFichaArrastrada(ficha.id);
    setIsPanning(false); // No estamos paneando cuando movemos una ficha

    // Calcular el offset considerando que la ficha está centrada
    // Necesitamos el offset en el espacio del contenedor, no en el espacio transformado
    const rect = tableroRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // La posición porcentual de la ficha
    const fichaX = (ficha.x / 100) * rect.width;
    const fichaY = (ficha.y / 100) * rect.height;

    // Offset desde el centro de la ficha (posición porcentual) hasta el mouse
    offsetRef.current = {
      x: mouseX - fichaX,
      y: mouseY - fichaY,
    };
  };

  const handleTableroMouseDown = (e) => {
    // Panear con clic derecho, clic central, o espacio + clic izquierdo
    if (
      e.button === 2 ||
      e.button === 1 ||
      (e.button === 0 && spacePressedRef.current)
    ) {
      e.preventDefault();
      setIsPanning(true);
      setFichaArrastrada(null);
      panStartRef.current = {
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      };
    }
  };

  const handleContextMenu = (e) => {
    // Prevenir el menú contextual al hacer clic derecho
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!tableroImagen || !tableroRef.current) return;

    // Si estamos paneando
    if (isPanning) {
      const newPanX = e.clientX - panStartRef.current.x;
      const newPanY = e.clientY - panStartRef.current.y;
      setPan({ x: newPanX, y: newPanY });
      return;
    }

    // Si estamos moviendo una ficha
    if (fichaArrastrada) {
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
    }
  };

  const handleMouseUp = () => {
    setFichaArrastrada(null);
    setIsPanning(false);
    offsetRef.current = { x: 0, y: 0 };
  };

  const fichasPorCategoria = (categoria) => {
    return fichas.filter((f) => f.categoria === categoria);
  };

  // Agregar listeners para la tecla espacio y ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        spacePressedRef.current = true;
        if (tableroRef.current) {
          tableroRef.current.style.cursor = "grab";
        }
      }
      if (e.code === "Escape" && modalAbierto) {
        handleCerrarModal();
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        spacePressedRef.current = false;
        setIsPanning((prev) => {
          if (!prev && tableroRef.current) {
            tableroRef.current.style.cursor = "default";
          }
          return prev;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [modalAbierto]);

  return (
    <div className="app">
      <header className="header">
        <h1>Tablero de Rol</h1>
        <div className="header-controls">
          {tableroImagen && (
            <div className="zoom-controls">
              <button
                className="btn-zoom"
                onClick={handleZoomOut}
                title="Alejar (Ctrl + Rueda del mouse)"
              >
                −
              </button>
              <input
                type="range"
                min="25"
                max="300"
                value={zoom}
                onChange={(e) => handleZoomChange(Number(e.target.value))}
                className="zoom-slider"
              />
              <span className="zoom-value">{zoom}%</span>
              <button
                className="btn-zoom"
                onClick={handleZoomIn}
                title="Acercar (Ctrl + Rueda del mouse)"
              >
                +
              </button>
              <button
                className="btn-zoom-reset"
                onClick={handleZoomReset}
                title="Restablecer zoom"
              >
                Resetear
              </button>
            </div>
          )}
          <button
            className="btn-cargar"
            onClick={() => fileInputRef.current?.click()}
          >
            Cargar Tablero
          </button>
        </div>
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
            <h2>{fichaEditando ? "Editar Ficha" : "Añadir Ficha"}</h2>

            <div className="form-seccion">
              <label className="form-label">Tipo</label>
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
                          : "rgba(60, 40, 20, 0.6)",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-seccion">
              <label className="form-label" htmlFor="input-nombre-ficha">
                Nombre
              </label>
              <input
                id="input-nombre-ficha"
                type="text"
                placeholder="Nombre de la ficha"
                value={nombreFicha}
                onChange={(e) => setNombreFicha(e.target.value)}
                className="input-nombre"
              />
            </div>

            <div className="form-seccion">
              <label className="form-label">Imagen (opcional)</label>
              <div className="imagen-input-container">
                {imagenFicha && (
                  <img
                    src={imagenFicha}
                    alt="Vista previa"
                    className="imagen-preview"
                  />
                )}
                <button
                  type="button"
                  className="btn-cargar-imagen"
                  onClick={() => imagenFichaInputRef.current?.click()}
                >
                  {imagenFicha ? "Cambiar Imagen" : "Cargar Imagen"}
                </button>
                {imagenFicha && (
                  <button
                    type="button"
                    className="btn-eliminar-imagen"
                    onClick={() => setImagenFicha("")}
                  >
                    ✕
                  </button>
                )}
                <input
                  ref={imagenFichaInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCargarImagenFicha}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div className="form-seccion">
              <label className="form-label">Puntos de Vida</label>
              <div className="hp-inputs">
                <div className="hp-input-group">
                  <label className="hp-label">Actual</label>
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={hpActualFicha}
                    onChange={(e) =>
                      setHpActualFicha(
                        Math.max(0, parseInt(e.target.value) || 0)
                      )
                    }
                    className="input-hp"
                  />
                </div>
                <span className="hp-separator">/</span>
                <div className="hp-input-group">
                  <label className="hp-label">Máximo</label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={hpMaxFicha}
                    onChange={(e) => {
                      const nuevoMax = Math.max(
                        1,
                        parseInt(e.target.value) || 1
                      );
                      setHpMaxFicha(nuevoMax);
                      if (hpActualFicha > nuevoMax) setHpActualFicha(nuevoMax);
                    }}
                    className="input-hp"
                  />
                </div>
              </div>
            </div>

            <div className="form-seccion">
              <label className="form-label">Tamaño (px)</label>
              <input
                type="range"
                min="30"
                max="120"
                value={tamañoFicha}
                onChange={(e) => setTamañoFicha(parseInt(e.target.value))}
                className="tamaño-slider"
              />
              <div className="tamaño-value-display">
                <span>{tamañoFicha}px</span>
              </div>
            </div>

            <div className="form-actions">
              {fichaEditando && (
                <button
                  onClick={handleCancelarEdicion}
                  className="btn-cancelar"
                >
                  Cancelar
                </button>
              )}
              <button onClick={handleAgregarFicha} className="btn-agregar">
                {fichaEditando ? "Guardar Cambios" : "Añadir Ficha"}
              </button>
            </div>
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
                    {fichasCat.map((ficha) => {
                      const hpActual = ficha.hpActual ?? ficha.hpMax ?? 50;
                      const hpMax = ficha.hpMax ?? 50;
                      const porcentajeHP =
                        hpMax > 0 ? (hpActual / hpMax) * 100 : 0;
                      const estado =
                        ficha.estado || calcularEstadoPorHP(hpActual, hpMax);

                      return (
                        <div key={ficha.id} className="ficha-item">
                          <div
                            className="ficha-item-content"
                            onClick={() => handleEditarFicha(ficha)}
                          >
                            <div className="ficha-item-header">
                              <span className="ficha-nombre">
                                {ficha.nombre}
                              </span>
                              <span className="ficha-estado-label">
                                {getLabelEstado(estado)}
                              </span>
                            </div>
                            <div className="ficha-hp-bar-container">
                              <div
                                className="ficha-hp-bar"
                                style={{
                                  width: `${porcentajeHP}%`,
                                  backgroundColor: getColorHP(hpActual, hpMax),
                                }}
                              />
                              <span className="ficha-hp-text">
                                {hpActual}/{hpMax} HP
                              </span>
                            </div>
                          </div>
                          <div className="ficha-item-actions">
                            <button
                              className="btn-editar"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditarFicha(ficha);
                              }}
                              title="Editar"
                            >
                              ✎
                            </button>
                            <button
                              className="btn-eliminar"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEliminarFicha(ficha.id);
                              }}
                              title="Eliminar"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
              onMouseDown={handleTableroMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onContextMenu={handleContextMenu}
            >
              <img
                src={tableroImagen}
                alt="Tablero"
                className="tablero-imagen"
                draggable={false}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${
                    zoom / 100
                  })`,
                  transformOrigin: "center center",
                }}
              />
              {fichas.map((ficha) => {
                const hpActual = ficha.hpActual ?? ficha.hpMax ?? 50;
                const hpMax = ficha.hpMax ?? 50;
                const estado =
                  ficha.estado || calcularEstadoPorHP(hpActual, hpMax);
                const tamañoFicha = ficha.tamaño || 55;
                const porcentajeHP = hpMax > 0 ? (hpActual / hpMax) * 100 : 0;
                const colorHP = getColorHP(hpActual, hpMax);

                return (
                  <div
                    key={ficha.id}
                    className={`ficha ficha-estado-${estado}`}
                    style={{
                      left: `${ficha.x}%`,
                      top: `${ficha.y}%`,
                      width: `${tamañoFicha}px`,
                      height: `${tamañoFicha}px`,
                      backgroundColor: hpActual <= 0 ? "#6b7280" : ficha.color,
                      cursor:
                        fichaArrastrada === ficha.id ? "grabbing" : "grab",
                      transition:
                        fichaArrastrada === ficha.id
                          ? "none"
                          : "transform 0.1s, box-shadow 0.1s",
                      transform: `translate(-50%, -50%) translate(${pan.x}px, ${
                        pan.y
                      }px) scale(${zoom / 100})`,
                    }}
                    onMouseDown={(e) => {
                      if (e.detail === 2) {
                        // Doble click para editar en modal
                        e.preventDefault();
                        e.stopPropagation();
                        handleEditarFicha(ficha, true);
                      } else {
                        handleMouseDown(e, ficha);
                      }
                    }}
                    title={`${
                      ficha.nombre
                    } - ${hpActual}/${hpMax} HP - ${getLabelEstado(estado)}`}
                  >
                    {/* Barra de vida circular alrededor de la ficha */}
                    <svg className="ficha-hp-ring" viewBox="0 0 100 100">
                      <circle
                        className="ficha-hp-ring-background"
                        cx="50"
                        cy="50"
                        r="48"
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.4)"
                        strokeWidth="4"
                      />
                      <circle
                        className="ficha-hp-ring-fill"
                        cx="50"
                        cy="50"
                        r="48"
                        fill="none"
                        stroke={colorHP}
                        strokeWidth="4"
                        strokeDasharray={`${2 * Math.PI * 48}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 48 * (1 - porcentajeHP / 100)
                        }`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        style={{
                          filter: `drop-shadow(0 0 3px ${colorHP})`,
                        }}
                      />
                    </svg>
                    {ficha.imagen ? (
                      <img
                        src={ficha.imagen}
                        alt={ficha.nombre}
                        className="ficha-imagen"
                      />
                    ) : (
                      <span className="ficha-inicial">
                        {ficha.nombre.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div className="ficha-hp-indicator">
                      {hpActual}/{hpMax}
                    </div>
                    <span className="ficha-nombre-tooltip">{ficha.nombre}</span>
                  </div>
                );
              })}
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

      {/* Modal de Edición */}
      {modalAbierto && fichaEditando && (
        <div className="modal-overlay" onClick={handleCerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Ficha: {fichaEditando.nombre}</h2>
              <button className="modal-cerrar" onClick={handleCerrarModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-seccion">
                <label className="form-label">Tipo</label>
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
                            : "rgba(60, 40, 20, 0.6)",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-seccion">
                <label
                  className="form-label"
                  htmlFor="modal-input-nombre-ficha"
                >
                  Nombre
                </label>
                <input
                  id="modal-input-nombre-ficha"
                  type="text"
                  placeholder="Nombre de la ficha"
                  value={nombreFicha}
                  onChange={(e) => setNombreFicha(e.target.value)}
                  className="input-nombre"
                />
              </div>

              <div className="form-seccion">
                <label className="form-label">Imagen (opcional)</label>
                <div className="imagen-input-container">
                  {imagenFicha && (
                    <img
                      src={imagenFicha}
                      alt="Vista previa"
                      className="imagen-preview"
                    />
                  )}
                  <button
                    type="button"
                    className="btn-cargar-imagen"
                    onClick={() => imagenFichaInputRef.current?.click()}
                  >
                    {imagenFicha ? "Cambiar Imagen" : "Cargar Imagen"}
                  </button>
                  {imagenFicha && (
                    <button
                      type="button"
                      className="btn-eliminar-imagen"
                      onClick={() => setImagenFicha("")}
                    >
                      ✕
                    </button>
                  )}
                  <input
                    ref={imagenFichaInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCargarImagenFicha}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div className="form-seccion">
                <label className="form-label">Puntos de Vida</label>
                <div className="hp-inputs">
                  <div className="hp-input-group">
                    <label className="hp-label">Actual</label>
                    <input
                      type="number"
                      min="0"
                      max="999"
                      value={hpActualFicha}
                      onChange={(e) =>
                        setHpActualFicha(
                          Math.max(0, parseInt(e.target.value) || 0)
                        )
                      }
                      className="input-hp"
                    />
                  </div>
                  <span className="hp-separator">/</span>
                  <div className="hp-input-group">
                    <label className="hp-label">Máximo</label>
                    <input
                      type="number"
                      min="1"
                      max="999"
                      value={hpMaxFicha}
                      onChange={(e) => {
                        const nuevoMax = Math.max(
                          1,
                          parseInt(e.target.value) || 1
                        );
                        setHpMaxFicha(nuevoMax);
                        if (hpActualFicha > nuevoMax)
                          setHpActualFicha(nuevoMax);
                      }}
                      className="input-hp"
                    />
                  </div>
                </div>
              </div>

              <div className="form-seccion">
                <label className="form-label">Tamaño (px)</label>
                <input
                  type="range"
                  min="30"
                  max="120"
                  value={tamañoFicha}
                  onChange={(e) => setTamañoFicha(parseInt(e.target.value))}
                  className="tamaño-slider"
                />
                <div className="tamaño-value-display">
                  <span>{tamañoFicha}px</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={handleCancelarEdicion} className="btn-cancelar">
                Cancelar
              </button>
              <button onClick={handleAgregarFicha} className="btn-agregar">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
