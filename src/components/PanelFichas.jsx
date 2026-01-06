import React from "react";
import PropTypes from "prop-types";
import { CATEGORIAS } from "./constants";
import {
  calcularEstadoPorHP,
  getColorHP,
  getLabelEstado,
  getColorPorCategoria,
} from "./utils";

const PanelFichas = ({
  fichas,
  onEditarFicha,
  onEliminarFicha,
  onDuplicarFicha,
  mostrarNombresFichas,
  onToggleMostrarNombresFichas,
  mostrarImagenesFichas,
  onToggleMostrarImagenesFichas,
}) => {
  const fichasPorCategoria = (categoria) => {
    return fichas.filter((f) => f.categoria === categoria);
  };

  return (
    <div className="panel-fichas">
      <h2>Fichas ({fichas.length})</h2>

      {/* Controles de visualización */}
      <div className="controles-visualizacion">
        <div className="control-nombres-fichas">
          <button
            className={`btn-toggle-nombres-panel ${
              mostrarNombresFichas ? "active" : ""
            }`}
            onClick={onToggleMostrarNombresFichas}
            title={`${
              mostrarNombresFichas ? "Ocultar" : "Mostrar"
            } nombres de fichas`}
          >
            <span className="icono-control">
              {mostrarNombresFichas ? "👁" : "🙈"}
            </span>
          </button>
        </div>

        <div className="control-imagenes-fichas">
          <button
            className={`btn-toggle-imagenes-panel ${
              mostrarImagenesFichas ? "active" : ""
            }`}
            onClick={onToggleMostrarImagenesFichas}
            title={`${
              mostrarImagenesFichas ? "Ocultar" : "Mostrar"
            } imágenes de fichas`}
          >
            <span className="icono-control">
              {mostrarImagenesFichas ? "📷" : "🚫"}
            </span>
          </button>
        </div>
      </div>

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
                const porcentajeHP = hpMax > 0 ? Math.max(0, Math.min(100, (hpActual / hpMax) * 100)) : 0;
                const estado =
                  ficha.estado || calcularEstadoPorHP(hpActual, hpMax);

                return (
                  <div
                    key={ficha.id}
                    className="ficha-item"
                    style={ficha.imagen && mostrarImagenesFichas ? {
                      backgroundImage: `linear-gradient(rgba(15, 10, 5, 0.85), rgba(15, 10, 5, 0.85)), url(${ficha.imagen})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    } : {}}
                  >
                    <div className="ficha-item-actions-top">
                      <button
                        className="btn-editar"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditarFicha(ficha, true);
                        }}
                        title="Editar ficha"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-duplicar"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicarFicha(ficha);
                        }}
                        title="Duplicar ficha"
                      >
                        📋
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEliminarFicha(ficha.id);
                        }}
                        title="Eliminar ficha"
                      >
                        🗑️
                      </button>
                    </div>
                    <div
                      className="ficha-item-content"
                      onClick={() => onEditarFicha(ficha, true)}
                    >
                      <div className="ficha-item-header">
                        <span className="ficha-nombre">{ficha.nombre}</span>
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
  );
};

PanelFichas.propTypes = {
  fichas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      categoria: PropTypes.string.isRequired,
      hpActual: PropTypes.number,
      hpMax: PropTypes.number,
      estado: PropTypes.string,
    })
  ).isRequired,
  onEditarFicha: PropTypes.func.isRequired,
  onEliminarFicha: PropTypes.func.isRequired,
  onDuplicarFicha: PropTypes.func.isRequired,
  mostrarNombresFichas: PropTypes.bool.isRequired,
  onToggleMostrarNombresFichas: PropTypes.func.isRequired,
  mostrarImagenesFichas: PropTypes.bool.isRequired,
  onToggleMostrarImagenesFichas: PropTypes.func.isRequired,
};

export default PanelFichas;
