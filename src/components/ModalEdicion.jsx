import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CATEGORIAS } from './constants';
import { getColorPorCategoria, calcularEstadoPorHP, getColorHP, getLabelEstado } from './utils';

const ModalEdicion = ({
  ficha,
  isOpen,
  onClose,
  onSave,
  onImageChange
}) => {
  const [nombreFicha, setNombreFicha] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(CATEGORIAS.HEROES);
  const [imagenFicha, setImagenFicha] = useState("");
  const [hpMaxFicha, setHpMaxFicha] = useState(50);
  const [hpActualFicha, setHpActualFicha] = useState(50);
  const [tamañoFicha, setTamañoFicha] = useState(55);

  const imagenFichaInputRef = useRef(null);

  // Inicializar valores cuando se abre el modal
  useEffect(() => {
    if (isOpen && ficha) {
      setNombreFicha(ficha.nombre);
      setCategoriaSeleccionada(ficha.categoria);
      setImagenFicha(ficha.imagen || "");
      setHpMaxFicha(ficha.hpMax || 50);
      setHpActualFicha(ficha.hpActual || ficha.hpMax || 50);
      setTamañoFicha(ficha.tamaño || 55);
    }
  }, [isOpen, ficha]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombreFicha.trim()) {
      alert("Por favor ingresa un nombre para la ficha");
      return;
    }

    const estadoCalculado = calcularEstadoPorHP(hpActualFicha, hpMaxFicha);
    const fichaActualizada = {
      ...ficha,
      nombre: nombreFicha.trim(),
      categoria: categoriaSeleccionada,
      imagen: imagenFicha,
      hpMax: hpMaxFicha,
      hpActual: hpActualFicha,
      estado: estadoCalculado,
      tamaño: tamañoFicha,
      color: getColorPorCategoria(categoriaSeleccionada),
    };

    onSave(fichaActualizada);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagenFicha(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen || !ficha) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-cerrar" onClick={onClose}>
          ✕
        </button>

        <div className="panel-agregar">
          <h2>Editar Ficha</h2>

          <form onSubmit={handleSubmit} className="form-ficha">
            <div className="form-seccion">
              <label className="form-label">
                <span className="label-icon">⚔️</span>
                Tipo <span className="label-required">*</span>
              </label>
              <div className="categorias">
                {Object.values(CATEGORIAS).map((cat) => (
                  <button
                    key={cat}
                    type="button"
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
              <label className="form-label" htmlFor="modal-input-nombre-ficha">
                <span className="label-icon">📝</span>
                Nombre <span className="label-required">*</span>
              </label>
              <input
                id="modal-input-nombre-ficha"
                type="text"
                placeholder="Ej: Aragorn, Dragón Rojo, Mercader..."
                value={nombreFicha}
                onChange={(e) => setNombreFicha(e.target.value)}
                className="input-nombre"
                autoFocus
              />
              {!nombreFicha.trim() && (
                <span className="field-hint">Requerido para crear la ficha</span>
              )}
            </div>

            <div className="form-seccion">
              <label className="form-label">
                <span className="label-icon">🖼️</span>
                Imagen <span className="label-optional">(opcional)</span>
              </label>
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
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div className="form-seccion">
              <label className="form-label">
                <span className="label-icon">❤️</span>
                Puntos de Vida
              </label>
              <div className="hp-quick-buttons">
                <button
                  type="button"
                  className="hp-quick-btn"
                  onClick={() => {
                    setHpMaxFicha(50);
                    setHpActualFicha(50);
                  }}
                  title="HP Estándar (50)"
                >
                  50
                </button>
                <button
                  type="button"
                  className="hp-quick-btn"
                  onClick={() => {
                    setHpMaxFicha(100);
                    setHpActualFicha(100);
                  }}
                  title="HP Alto (100)"
                >
                  100
                </button>
                <button
                  type="button"
                  className="hp-quick-btn"
                  onClick={() => {
                    setHpMaxFicha(200);
                    setHpActualFicha(200);
                  }}
                  title="HP Muy Alto (200)"
                >
                  200
                </button>
              </div>
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
              <div className="hp-status-indicator">
                <div
                  className="hp-status-bar"
                  style={{
                    width: `${Math.min((hpActualFicha / hpMaxFicha) * 100, 100)}%`,
                    backgroundColor: getColorHP(hpActualFicha, hpMaxFicha),
                  }}
                />
                <span className="hp-status-text">
                  {calcularEstadoPorHP(hpActualFicha, hpMaxFicha) === "muerto" && "💀 Muerto"}
                  {calcularEstadoPorHP(hpActualFicha, hpMaxFicha) === "inconsciente" && "😴 Inconsciente"}
                  {calcularEstadoPorHP(hpActualFicha, hpMaxFicha) === "herido" && "🩹 Herido"}
                  {calcularEstadoPorHP(hpActualFicha, hpMaxFicha) === "saludable" && "✅ Saludable"}
                </span>
              </div>
            </div>

            <div className="form-seccion">
              <label className="form-label">
                <span className="label-icon">📏</span>
                Tamaño
              </label>
              <div className="tamaño-controls">
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
                  <div className="tamaño-visual-indicator">
                    <div
                      className="tamaño-preview-dot"
                      style={{
                        width: `${(tamañoFicha / 120) * 100}%`,
                        height: `${(tamañoFicha / 120) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-cancelar">
                Cancelar
              </button>
              <button type="submit" className="btn-agregar">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

ModalEdicion.propTypes = {
  ficha: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    categoria: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    tamaño: PropTypes.number,
    hpActual: PropTypes.number,
    hpMax: PropTypes.number,
    estado: PropTypes.string,
    imagen: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onImageChange: PropTypes.func.isRequired,
};

export default ModalEdicion;
