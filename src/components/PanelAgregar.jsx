import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { CATEGORIAS } from './constants';
import { getColorPorCategoria, calcularEstadoPorHP, getColorHP, getLabelEstado } from './utils';

const PanelAgregar = ({
  nombreFicha,
  categoriaSeleccionada,
  imagenFicha,
  hpMaxFicha,
  hpActualFicha,
  tamañoFicha,
  fichaEditando,
  onNombreChange,
  onCategoriaChange,
  onImagenChange,
  onHpMaxChange,
  onHpActualChange,
  onTamañoChange,
  onAgregarFicha
}) => {
  const imagenFichaInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombreFicha.trim()) {
      alert("Por favor ingresa un nombre para la ficha");
      return;
    }

    const estadoCalculado = calcularEstadoPorHP(hpActualFicha, hpMaxFicha);
    const fichaData = {
      nombre: nombreFicha.trim(),
      categoria: categoriaSeleccionada,
      imagen: imagenFicha,
      hpMax: hpMaxFicha,
      hpActual: hpActualFicha,
      estado: estadoCalculado,
      tamaño: tamañoFicha,
      color: getColorPorCategoria(categoriaSeleccionada),
    };

    onAgregarFicha(fichaData);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImagenChange(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="panel-agregar">
      <div className="panel-header">
        <h2>{fichaEditando ? "Editar Ficha" : "Añadir Ficha"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-ficha">
        <div className="form-seccion">
          <label className="form-label">
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
                    onClick={() => onCategoriaChange(cat)}
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
            Nombre <span className="label-required">*</span>
          </label>
          <input
            id="input-nombre-ficha"
            type="text"
            placeholder="Ej: Aragorn, Dragón Rojo, Mercader..."
                  value={nombreFicha}
                  onChange={(e) => onNombreChange(e.target.value)}
            className="input-nombre"
            autoFocus={!fichaEditando}
          />
          {!nombreFicha.trim() && (
            <span className="field-hint">Requerido para crear la ficha</span>
          )}
        </div>

        <div className="form-seccion">
          <label className="form-label">
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
                  onClick={() => onImagenChange("")}
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
            Puntos de Vida
          </label>
          <div className="hp-inputs">
            <div className="hp-input-group">
              <label className="hp-label">Actual</label>
              <input
                type="number"
                min="0"
                max="999"
                value={hpActualFicha}
                      onChange={(e) =>
                        onHpActualChange(
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
                        onHpMaxChange(nuevoMax);
                        if (hpActualFicha > nuevoMax) onHpActualChange(nuevoMax);
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
            Tamaño
          </label>
          <div className="tamaño-controls">
            <input
              type="range"
              min="30"
              max="120"
              value={tamañoFicha}
                    onChange={(e) => onTamañoChange(parseInt(e.target.value))}
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
          <button type="submit" className="btn-agregar">
            {fichaEditando ? "Guardar Cambios" : "Añadir Ficha"}
          </button>
        </div>
      </form>
    </div>
  );
};

PanelAgregar.propTypes = {
  nombreFicha: PropTypes.string.isRequired,
  categoriaSeleccionada: PropTypes.string.isRequired,
  imagenFicha: PropTypes.string.isRequired,
  hpMaxFicha: PropTypes.number.isRequired,
  hpActualFicha: PropTypes.number.isRequired,
  tamañoFicha: PropTypes.number.isRequired,
  fichaEditando: PropTypes.object,
  onNombreChange: PropTypes.func.isRequired,
  onCategoriaChange: PropTypes.func.isRequired,
  onImagenChange: PropTypes.func.isRequired,
  onHpMaxChange: PropTypes.func.isRequired,
  onHpActualChange: PropTypes.func.isRequired,
  onTamañoChange: PropTypes.func.isRequired,
  onAgregarFicha: PropTypes.func.isRequired,
};

export default PanelAgregar;
