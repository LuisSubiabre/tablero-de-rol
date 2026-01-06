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
  onNombreChange,
  onCategoriaChange,
  onImagenChange,
  onHpMaxChange,
  onHpActualChange,
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
        <h2>Añadir Ficha</h2>
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
            autoFocus
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
          <div className="hp-inputs-compact">
            <input
              type="number"
              min="0"
              max="999"
              placeholder="Actual"
              value={hpActualFicha}
              onChange={(e) =>
                onHpActualChange(
                  Math.max(0, parseInt(e.target.value) || 0)
                )
              }
              className="input-hp-compact"
            />
            <span className="hp-separator">/</span>
            <input
              type="number"
              min="1"
              max="999"
              placeholder="Máximo"
              value={hpMaxFicha}
              onChange={(e) => {
                const nuevoMax = Math.max(
                  1,
                  parseInt(e.target.value) || 1
                );
                onHpMaxChange(nuevoMax);
                if (hpActualFicha > nuevoMax) onHpActualChange(nuevoMax);
              }}
              className="input-hp-compact"
            />
          </div>
          {hpMaxFicha > 0 && (
            <>
              <div className="hp-preview-bar">
                <div
                  className="hp-preview-fill"
                  style={{
                    width: `${Math.max(0, Math.min(100, (hpActualFicha / hpMaxFicha) * 100))}%`,
                    backgroundColor: getColorHP(hpActualFicha, hpMaxFicha),
                  }}
                />
              </div>
              <div className="hp-info-text">
                {hpActualFicha}/{hpMaxFicha} {getLabelEstado(calcularEstadoPorHP(hpActualFicha, hpMaxFicha)).split(' ')[1]}
              </div>
            </>
          )}
        </div>


        <div className="form-actions">
          <button type="submit" className="btn-agregar">
            Añadir Ficha
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
  onNombreChange: PropTypes.func.isRequired,
  onCategoriaChange: PropTypes.func.isRequired,
  onImagenChange: PropTypes.func.isRequired,
  onHpMaxChange: PropTypes.func.isRequired,
  onHpActualChange: PropTypes.func.isRequired,
  onAgregarFicha: PropTypes.func.isRequired,
};

export default PanelAgregar;
