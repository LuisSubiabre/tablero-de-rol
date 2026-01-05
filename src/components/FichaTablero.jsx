import React from "react";
import PropTypes from "prop-types";
import { calcularEstadoPorHP, getColorHP } from "./utils";

const FichaTablero = ({
  ficha,
  tableroSize,
  zoom,
  pan,
  isDragging,
  onMouseDown,
  onResizeRightMouseDown,
  onDoubleClick,
  onClick,
}) => {
  const clickTimeoutRef = React.useRef(null);
  const hpActual = ficha.hpActual ?? ficha.hpMax ?? 50;
  const hpMax = ficha.hpMax ?? 50;
  const estado = ficha.estado || calcularEstadoPorHP(hpActual, hpMax);
  const tamañoFicha = ficha.tamaño || 55;
  const porcentajeHP = hpMax > 0 ? (hpActual / hpMax) * 100 : 0;
  const colorHP = getColorHP(hpActual, hpMax);

  // Calcular posición relativa al centro del contenedor
  const scaleFactor = zoom / 100;
  const offsetX =
    tableroSize.width > 0
      ? ((ficha.x - 50) / 100) * tableroSize.width * scaleFactor
      : 0;
  const offsetY =
    tableroSize.height > 0
      ? ((ficha.y - 50) / 100) * tableroSize.height * scaleFactor
      : 0;

  return (
    <div
      className="ficha-wrapper"
      style={{
        left: "50%",
        top: "50%",
        width: `${tamañoFicha}px`,
        height: `${tamañoFicha}px`,
        cursor: isDragging ? "grabbing" : "grab",
        transition: isDragging ? "none" : "transform 0.1s",
        transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) translate(${pan.x}px, ${pan.y}px) scale(${scaleFactor})`,
        transformOrigin: "center center",
      }}
      onMouseDown={(e) => {
        if (e.button === 2) {
          // Click derecho: redimensionado vertical
          onResizeRightMouseDown(e, ficha);
          return;
        }
        if (e.detail === 2) {
          // Doble click para editar en modal
          e.preventDefault();
          e.stopPropagation();
          if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
          }
          onDoubleClick(ficha, true);
        } else {
          // Iniciar arrastre
          e.preventDefault();
          e.stopPropagation();
          onMouseDown(e, ficha);

          // Programar selección si no hay movimiento
          clickTimeoutRef.current = setTimeout(() => {
            if (onClick) onClick(ficha);
          }, 200);
        }
      }}
      onContextMenu={(e) => {
        // Evitar menú contextual al usar click derecho para redimensionar
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseMove={() => {
        // Si hay movimiento, cancelar la selección
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
          clickTimeoutRef.current = null;
        }
      }}
      title={`${ficha.nombre} - ${hpActual}/${hpMax} HP - ${estado}`}
    >
      {/* Nombre arriba (fuera del contenedor para evitar overflow/recortes) */}
      <div className="ficha-nombre-arriba">{ficha.nombre}</div>

      {/* Círculo de la ficha (mantiene overflow hidden para recortar imagen) */}
      <div
        className={`ficha ficha-estado-${estado}`}
        style={{
          position: "relative",
          left: "auto",
          top: "auto",
          width: "100%",
          height: "100%",
          transform: "none",
          backgroundColor: hpActual <= 0 ? "#6b7280" : ficha.color,
        }}
      >
        <div className="ficha-contenido">
          {ficha.imagen ? (
            <img
              src={ficha.imagen}
              alt={ficha.nombre}
              className="ficha-imagen"
            />
          ) : (
            <div className="ficha-inicial">
              {ficha.nombre.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Ícono de calavera si HP = 0 */}
        {hpActual <= 0 && <div className="ficha-calavera">💀</div>}
      </div>

      {/* Barra de HP lineal debajo de la ficha */}
      <div className="ficha-hp-bar" aria-label={`HP ${hpActual}/${hpMax}`}>
        <div
          className="ficha-hp-bar-fill"
          style={{
            width: `${Math.max(0, Math.min(100, porcentajeHP))}%`,
            backgroundColor: colorHP,
          }}
        />
        <div className="ficha-hp-bar-text">
          {hpActual}/{hpMax}
        </div>
      </div>
    </div>
  );
};

FichaTablero.propTypes = {
  ficha: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    categoria: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    tamaño: PropTypes.number,
    hpActual: PropTypes.number,
    hpMax: PropTypes.number,
    estado: PropTypes.string,
    imagen: PropTypes.string,
  }).isRequired,
  tableroSize: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  zoom: PropTypes.number.isRequired,
  pan: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  isDragging: PropTypes.bool.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onResizeRightMouseDown: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  onClick: PropTypes.func,
};

export default FichaTablero;
