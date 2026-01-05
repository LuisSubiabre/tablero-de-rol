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
      className={`ficha ficha-estado-${estado}`}
      style={{
        left: "50%",
        top: "50%",
        width: `${tamañoFicha}px`,
        height: `${tamañoFicha}px`,
        backgroundColor: ficha.imagen
          ? "transparent"
          : hpActual <= 0
          ? "#6b7280"
          : ficha.color,
        cursor: isDragging ? "grabbing" : "grab",
        transition: isDragging ? "none" : "transform 0.1s, box-shadow 0.1s",
        transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) translate(${pan.x}px, ${pan.y}px) scale(${scaleFactor})`,
        transformOrigin: "center center",
      }}
      onMouseDown={(e) => {
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
            if (onClick) {
              onClick(ficha);
            }
          }, 200);
        }
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
      {/* Barra de vida circular alrededor de la ficha */}
      <svg className="ficha-hp-ring" viewBox="0 0 100 100">
        <circle
          className="ficha-hp-ring-background"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(0, 0, 0, 0.6)"
          strokeWidth="4"
        />
        <circle
          className="ficha-hp-ring-fill"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={colorHP}
          strokeWidth="4"
          strokeDasharray={`${2 * Math.PI * 45}`}
          strokeDashoffset={`${2 * Math.PI * 45 * (1 - porcentajeHP / 100)}`}
        />
      </svg>

      {/* Contenido de la ficha */}
      <div className="ficha-contenido">
        {ficha.imagen ? (
          <img src={ficha.imagen} alt={ficha.nombre} className="ficha-imagen" />
        ) : (
          <div className="ficha-inicial">
            {ficha.nombre.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Nombre debajo de la ficha */}
      <div className="ficha-nombre-abajo">{ficha.nombre}</div>
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
  onDoubleClick: PropTypes.func.isRequired,
  onClick: PropTypes.func,
};

export default FichaTablero;
