import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import {
  Header,
  PanelAgregar,
  PanelFichas,
  Tablero,
  PanelInfoFicha,
  ModalEdicion,
  CATEGORIAS,
  getColorPorCategoria,
  calcularEstadoPorHP,
} from "./components";

function App() {
  // Estados principales
  const [tableroImagen, setTableroImagen] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [fichas, setFichas] = useState([]);
  const [fichaSeleccionada, setFichaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

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

  // Cargar datos de ficha para edición
  useEffect(() => {
    if (fichaEditando) {
      setNombreFicha(fichaEditando.nombre || "");
      setCategoriaSeleccionada(fichaEditando.categoria || CATEGORIAS.HEROES);
      setImagenFicha(fichaEditando.imagen || "");
      setHpMaxFicha(fichaEditando.hpMax || 50);
      setHpActualFicha(fichaEditando.hpActual || fichaEditando.hpMax || 50);
      setTamañoFicha(fichaEditando.tamaño || 55);
    }
  }, [fichaEditando]);

  // Estados para el tablero y arrastre
  const [tableroSize, setTableroSize] = useState({ width: 0, height: 0 });
  const [fichaArrastrada, setFichaArrastrada] = useState(null);
  const [isPanning, setIsPanning] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const idCounterRef = useRef(0);
  const tableroRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const spacePressedRef = useRef(false);
  const clickStartRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

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
    if (fichaEditando) {
      // Editar ficha existente
      setFichas(
        fichas.map((f) =>
          f.id === fichaEditando.id ? { ...f, ...fichaData } : f
        )
      );
      resetFormulario();
    } else {
      // Nueva ficha
      idCounterRef.current += 1;
      const nuevaFicha = {
        id: idCounterRef.current,
        ...fichaData,
        x: 50,
        y: 50,
      };
      setFichas([...fichas, nuevaFicha]);
      resetFormulario();
    }
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
      offsetRef.current = { x: 0, y: 0 };
      clickStartRef.current = { x: 0, y: 0 };
      isDraggingRef.current = false;
    };

    if (fichaArrastrada || isPanning) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [fichaArrastrada, isPanning, zoom, pan, tableroSize, fichas]);

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
            fichaEditando={fichaEditando}
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
    </div>
  );
}

export default App;
