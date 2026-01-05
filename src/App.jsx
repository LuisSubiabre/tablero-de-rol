import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import {
  Header,
  PanelAgregar,
  PanelFichas,
  Tablero,
  PanelInfoFicha,
  ModalEdicion,
  DiceRoller,
  CATEGORIAS,
  getColorPorCategoria,
  calcularEstadoPorHP,
} from "./components";

const STORAGE_KEY = "tablero-rol-data";

// Función para guardar datos en localStorage
const guardarEnLocalStorage = (clave, datos) => {
  try {
    localStorage.setItem(clave, JSON.stringify(datos));
  } catch (error) {
    console.warn("Error guardando en localStorage:", error);
  }
};

// Función para cargar datos desde localStorage
const cargarDesdeLocalStorage = (clave, valorPorDefecto) => {
  try {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : valorPorDefecto;
  } catch (error) {
    console.warn("Error cargando desde localStorage:", error);
    return valorPorDefecto;
  }
};

function App() {
  // Estados principales con carga desde localStorage
  const [tableroImagen, setTableroImagen] = useState(() =>
    cargarDesdeLocalStorage(`${STORAGE_KEY}-tablero`, null)
  );
  const [zoom, setZoom] = useState(() =>
    cargarDesdeLocalStorage(`${STORAGE_KEY}-zoom`, 100)
  );
  const [pan, setPan] = useState(() =>
    cargarDesdeLocalStorage(`${STORAGE_KEY}-pan`, { x: 0, y: 0 })
  );
  const [fichas, setFichas] = useState(() =>
    cargarDesdeLocalStorage(`${STORAGE_KEY}-fichas`, [])
  );
  const [fichaSeleccionada, setFichaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalDadosAbierto, setModalDadosAbierto] = useState(false);

  // Estados para el formulario
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    CATEGORIAS.HEROES
  );
  const [nombreFicha, setNombreFicha] = useState("");
  const [imagenFicha, setImagenFicha] = useState("");
  const [hpMaxFicha, setHpMaxFicha] = useState(50);
  const [hpActualFicha, setHpActualFicha] = useState(50);
  const [tamañoFicha, setTamañoFicha] = useState(55);
  const [fichaEditando, setFichaEditando] = useState(null);

  // Persistencia con localStorage
  useEffect(() => {
    guardarEnLocalStorage(`${STORAGE_KEY}-fichas`, fichas);
  }, [fichas]);

  useEffect(() => {
    guardarEnLocalStorage(`${STORAGE_KEY}-tablero`, tableroImagen);
  }, [tableroImagen]);

  useEffect(() => {
    guardarEnLocalStorage(`${STORAGE_KEY}-zoom`, zoom);
  }, [zoom]);

  useEffect(() => {
    guardarEnLocalStorage(`${STORAGE_KEY}-pan`, pan);
  }, [pan]);

  // Función para limpiar todos los datos guardados (opcional para desarrollo)
  const limpiarDatosGuardados = () => {
    localStorage.removeItem(`${STORAGE_KEY}-fichas`);
    localStorage.removeItem(`${STORAGE_KEY}-tablero`);
    localStorage.removeItem(`${STORAGE_KEY}-zoom`);
    localStorage.removeItem(`${STORAGE_KEY}-pan`);
  };

  // Función para crear nueva partida
  const handleNuevaPartida = () => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que quieres crear una nueva partida?\n\nEsto eliminará todas las fichas, el tablero cargado y restablecerá el zoom y la posición. Esta acción no se puede deshacer."
    );

    if (confirmacion) {
      // Limpiar localStorage
      limpiarDatosGuardados();

      // Resetear todos los estados
      setTableroImagen(null);
      setZoom(100);
      setPan({ x: 0, y: 0 });
      setFichas([]);
      setFichaSeleccionada(null);
      setModalAbierto(false);

      // Resetear formulario
      resetFormulario();

      console.log("Nueva partida creada - todos los datos eliminados");
    }
  };

  // Resetear formulario
  const resetFormulario = () => {
    setNombreFicha("");
    setCategoriaSeleccionada(CATEGORIAS.HEROES);
    setImagenFicha("");
    setHpMaxFicha(50);
    setHpActualFicha(50);
    setTamañoFicha(55);
    setFichaEditando(null);
  };

  // Estados para el tablero y arrastre
  const [tableroSize, setTableroSize] = useState({ width: 0, height: 0 });
  const [fichaArrastrada, setFichaArrastrada] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const [fichaRedimensionando, setFichaRedimensionando] = useState(null);

  // Refs
  const fileInputRef = useRef(null);
  const idCounterRef = useRef(0);
  const tableroRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const spacePressedRef = useRef(false);
  const clickStartRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const resizeStartRef = useRef({ x: 0, y: 0, tamaño: 55, modo: "vertical" });

  // Funciones de zoom y pan
  const handleCargarImagen = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTableroImagen(e.target.result);
        setZoom(100);
        setPan({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZoomChange = (nuevoZoom) => {
    setZoom(Math.max(25, Math.min(300, nuevoZoom)));
  };

  const handleZoomIn = () => {
    handleZoomChange(zoom + 10);
  };

  const handleZoomOut = () => {
    handleZoomChange(zoom - 10);
  };

  const handleZoomReset = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  };

  // Funciones de fichas
  const handleAgregarFicha = (fichaData) => {
    idCounterRef.current += 1;
    const nuevaFicha = {
      id: idCounterRef.current,
      ...fichaData,
      x: 50,
      y: 50,
    };
    setFichas([...fichas, nuevaFicha]);
    resetFormulario();
  };

  const handleEditarFicha = (ficha, abrirModal = false) => {
    setFichaEditando(ficha);
    if (abrirModal) {
      setModalAbierto(true);
    }
  };

  const handleFichaClick = (ficha) => {
    setFichaSeleccionada(ficha);
  };

  const handleEliminarFicha = (id) => {
    setFichas(fichas.filter((f) => f.id !== id));
  };

  const handleGuardarEdicion = (fichaActualizada) => {
    setFichas(
      fichas.map((f) => (f.id === fichaActualizada.id ? fichaActualizada : f))
    );
    setModalAbierto(false);
    setFichaEditando(null);
  };

  // Funciones del tablero
  const handleMouseDown = (e, ficha) => {
    e.preventDefault();
    e.stopPropagation();

    clickStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;

    setFichaArrastrada(ficha.id);
    setIsPanning(false);
    setFichaRedimensionando(null);

    const rect = tableroRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const scaleFactor = zoom / 100;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const mouseRelativeX = mouseX - centerX - pan.x;
    const mouseRelativeY = mouseY - centerY - pan.y;

    const mouseScaledX = mouseRelativeX / scaleFactor;
    const mouseScaledY = mouseRelativeY / scaleFactor;

    const fichaScaledX = ((ficha.x - 50) / 100) * tableroSize.width;
    const fichaScaledY = ((ficha.y - 50) / 100) * tableroSize.height;

    offsetRef.current = {
      x: mouseScaledX - fichaScaledX,
      y: mouseScaledY - fichaScaledY,
    };
  };

  const handleResizeRightMouseDown = (e, ficha) => {
    // Click derecho + arrastre vertical: arriba agranda, abajo achica
    e.preventDefault();
    e.stopPropagation();

    setFichaArrastrada(null);
    setIsPanning(false);
    setFichaRedimensionando(ficha.id);
    isDraggingRef.current = false;

    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      tamaño: ficha.tamaño || 55,
      modo: "vertical",
    };
  };

  const handleTableroMouseDown = (e) => {
    if (
      e.button === 2 ||
      e.button === 1 ||
      (e.button === 0 && spacePressedRef.current)
    ) {
      e.preventDefault();
      setIsPanning(true);
      setFichaArrastrada(null);
      setFichaSeleccionada(null);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    } else if (e.button === 0 && !spacePressedRef.current) {
      setFichaSeleccionada(null);
    }
  };

  const handleMouseMove = (e) => {
    // El paneo y arrastre se manejan globalmente, aquí no se necesita lógica
    return;
  };

  const handleMouseUp = () => {
    // El paneo y arrastre se manejan globalmente
    return;
  };

  const handleWheel = (e) => {
    if (!tableroImagen) return;
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      handleZoomChange(zoom + delta);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  // Efectos
  useEffect(() => {
    const updateTableroSize = () => {
      if (tableroRef.current) {
        const rect = tableroRef.current.getBoundingClientRect();
        setTableroSize({ width: rect.width, height: rect.height });
      }
    };

    updateTableroSize();
    window.addEventListener("resize", updateTableroSize);

    let resizeObserver = null;
    if (tableroRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateTableroSize);
      resizeObserver.observe(tableroRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateTableroSize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [tableroImagen]);

  // Efecto para manejar el arrastre global y paneo
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      // Manejar redimensionado (prioridad máxima)
      if (fichaRedimensionando) {
        const scaleFactor = zoom / 100;
        const dx = e.clientX - resizeStartRef.current.x;
        const dy = e.clientY - resizeStartRef.current.y;
        let delta = 0;
        if (resizeStartRef.current.modo === "vertical") {
          // Arriba (dy negativo) => delta positivo
          delta = -dy / (scaleFactor || 1);
        } else {
          const deltaVisual = Math.max(dx, dy);
          delta = deltaVisual / (scaleFactor || 1);
        }

        const nuevoTamaño = Math.round(resizeStartRef.current.tamaño + delta);
        const tamañoLimitado = Math.max(30, Math.min(nuevoTamaño, 140));

        setFichas((prevFichas) =>
          prevFichas.map((f) =>
            f.id === fichaRedimensionando ? { ...f, tamaño: tamañoLimitado } : f
          )
        );
        return;
      }

      // Manejar paneo
      if (isPanning) {
        const newPanX = e.clientX - panStartRef.current.x;
        const newPanY = e.clientY - panStartRef.current.y;
        setPan({ x: newPanX, y: newPanY });
        return;
      }

      // Manejar arrastre de ficha
      if (fichaArrastrada && tableroRef.current) {
        const rect = tableroRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const scaleFactor = zoom / 100;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const mouseRelativeX = mouseX - centerX - pan.x;
        const mouseRelativeY = mouseY - centerY - pan.y;

        const mouseScaledX = mouseRelativeX / scaleFactor;
        const mouseScaledY = mouseRelativeY / scaleFactor;

        const fichaScaledX = mouseScaledX - offsetRef.current.x;
        const fichaScaledY = mouseScaledY - offsetRef.current.y;

        const nuevoX = (fichaScaledX / tableroSize.width) * 100 + 50;
        const nuevoY = (fichaScaledY / tableroSize.height) * 100 + 50;

        const xLimitado = Math.max(0, Math.min(nuevoX, 100));
        const yLimitado = Math.max(0, Math.min(nuevoY, 100));

        setFichas((prevFichas) =>
          prevFichas.map((f) =>
            f.id === fichaArrastrada ? { ...f, x: xLimitado, y: yLimitado } : f
          )
        );

        if (clickStartRef.current.x !== 0 || clickStartRef.current.y !== 0) {
          const moveDistance = Math.sqrt(
            Math.pow(e.clientX - clickStartRef.current.x, 2) +
              Math.pow(e.clientY - clickStartRef.current.y, 2)
          );
          if (moveDistance > 5) {
            isDraggingRef.current = true;
          }
        }
      }
    };

    const handleGlobalMouseUp = () => {
      if (fichaArrastrada && !isDraggingRef.current) {
        const ficha = fichas.find((f) => f.id === fichaArrastrada);
        if (ficha) {
          setFichaSeleccionada(ficha);
        }
      }

      setFichaArrastrada(null);
      setIsPanning(false);
      setFichaRedimensionando(null);
      offsetRef.current = { x: 0, y: 0 };
      clickStartRef.current = { x: 0, y: 0 };
      isDraggingRef.current = false;
    };

    if (fichaArrastrada || isPanning || fichaRedimensionando) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [
    fichaArrastrada,
    fichaRedimensionando,
    isPanning,
    zoom,
    pan,
    tableroSize,
    fichas,
  ]);

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
        setModalAbierto(false);
        setFichaEditando(null);
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
      <Header
        tableroImagen={tableroImagen}
        zoom={zoom}
        onZoomChange={handleZoomChange}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onCargarImagen={handleCargarImagen}
        onNuevaPartida={handleNuevaPartida}
        onAbrirDados={() => setModalDadosAbierto(true)}
      />

      <div className="contenedor-principal">
        <aside className="sidebar">
          <PanelAgregar
            nombreFicha={nombreFicha}
            categoriaSeleccionada={categoriaSeleccionada}
            imagenFicha={imagenFicha}
            hpMaxFicha={hpMaxFicha}
            hpActualFicha={hpActualFicha}
            tamañoFicha={tamañoFicha}
            onNombreChange={setNombreFicha}
            onCategoriaChange={setCategoriaSeleccionada}
            onImagenChange={setImagenFicha}
            onHpMaxChange={setHpMaxFicha}
            onHpActualChange={setHpActualFicha}
            onTamañoChange={setTamañoFicha}
            onAgregarFicha={handleAgregarFicha}
          />

          <PanelFichas
            fichas={fichas}
            onEditarFicha={handleEditarFicha}
            onEliminarFicha={handleEliminarFicha}
          />
        </aside>

        <Tablero
          ref={tableroRef}
          tableroImagen={tableroImagen}
          fichas={fichas}
          tableroSize={tableroSize}
          zoom={zoom}
          pan={pan}
          fichaArrastrada={fichaArrastrada}
          onMouseMove={handleMouseMove}
          onMouseDown={handleTableroMouseDown}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          onContextMenu={handleContextMenu}
          onFichaMouseDown={handleMouseDown}
          onFichaResizeRightMouseDown={handleResizeRightMouseDown}
          onFichaDoubleClick={(ficha, abrirModal) =>
            handleEditarFicha(ficha, abrirModal)
          }
          onFichaClick={handleFichaClick}
          onCargarImagen={handleCargarImagen}
        />

        <PanelInfoFicha
          fichaSeleccionada={fichaSeleccionada}
          onClose={() => setFichaSeleccionada(null)}
          onEdit={(ficha, abrirModal) => handleEditarFicha(ficha, abrirModal)}
        />
      </div>

      <ModalEdicion
        ficha={fichaEditando}
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setFichaEditando(null);
        }}
        onSave={handleGuardarEdicion}
        onImageChange={() => {}}
      />

      {modalDadosAbierto && (
        <div
          className="modal-overlay"
          onClick={() => setModalDadosAbierto(false)}
        >
          <div className="modal-dados" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dados-header">
              <h2>🎲 Lanzador de Dados</h2>
              <button
                className="modal-cerrar"
                onClick={() => setModalDadosAbierto(false)}
              >
                ✕
              </button>
            </div>
            <DiceRoller onClose={() => setModalDadosAbierto(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
