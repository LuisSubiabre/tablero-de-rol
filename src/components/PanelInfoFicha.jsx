import React from 'react';
import PropTypes from 'prop-types';
import { calcularEstadoPorHP, getColorHP, getLabelEstado } from './utils';

const PanelInfoFicha = ({ fichaSeleccionada, onClose, onEdit }) => {
  if (!fichaSeleccionada) return null;

  const hpActual = fichaSeleccionada.hpActual ?? fichaSeleccionada.hpMax ?? 50;
  const hpMax = fichaSeleccionada.hpMax ?? 50;
  const estado = fichaSeleccionada.estado || calcularEstadoPorHP(hpActual, hpMax);
  const colorHP = getColorHP(hpActual, hpMax);

  return (
    <div className="ficha-info-panel">
      <button
        className="ficha-info-cerrar"
        onClick={onClose}
        title="Cerrar"
      >
        ×
      </button>
      <div className="ficha-info-header">
        <div
          className="ficha-info-avatar"
          style={{
            backgroundColor: fichaSeleccionada.color,
          }}
        >
          {fichaSeleccionada.imagen ? (
            <img
              src={fichaSeleccionada.imagen}
              alt={fichaSeleccionada.nombre}
            />
          ) : (
            <span>
              {fichaSeleccionada.nombre.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="ficha-info-titulo">
          <h3>{fichaSeleccionada.nombre}</h3>
          <span
            className="ficha-info-tipo"
            style={{
              color: fichaSeleccionada.color,
            }}
          >
            {fichaSeleccionada.categoria}
          </span>
        </div>
      </div>
      <div className="ficha-info-body">
        <div className="ficha-info-stat">
          <span className="ficha-info-stat-label">Estado</span>
          <span className="ficha-info-stat-value">
            {getLabelEstado(estado)}
          </span>
        </div>
        <div className="ficha-info-stat">
          <span className="ficha-info-stat-label">Puntos de Vida</span>
          <div className="ficha-info-hp">
            <div className="ficha-info-hp-bar-container">
              <div
                className="ficha-info-hp-bar"
                style={{
                  width: `${
                    ((hpActual / hpMax) * 100)
                  }%`,
                  backgroundColor: colorHP,
                }}
              />
            </div>
            <span className="ficha-info-hp-text">
              {hpActual} / {hpMax}
            </span>
          </div>
        </div>
        <div className="ficha-info-stat">
          <span className="ficha-info-stat-label">Tamaño</span>
          <span className="ficha-info-stat-value">
            {fichaSeleccionada.tamaño || 55}px
          </span>
        </div>
      </div>
      <div className="ficha-info-actions">
        <button
          className="ficha-info-btn-editar"
          onClick={() => {
            onEdit(fichaSeleccionada, true);
            onClose();
          }}
        >
          Editar
        </button>
      </div>
    </div>
  );
};

PanelInfoFicha.propTypes = {
  fichaSeleccionada: PropTypes.shape({
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
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default PanelInfoFicha;


