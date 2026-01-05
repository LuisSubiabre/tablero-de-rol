import React, { useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import FichaTablero from './FichaTablero';

const Tablero = forwardRef(({
  tableroImagen,
  fichas,
  tableroSize,
  zoom,
  pan,
  fichaArrastrada,
  onMouseMove,
  onMouseDown,
  onMouseUp,
  onWheel,
  onContextMenu,
  onFichaMouseDown,
  onFichaDoubleClick,
  onFichaClick,
  onCargarImagen
}, ref) => {
  const tableroRef = ref;
  const fileInputRef = useRef(null);

  if (!tableroImagen) {
    return (
      <div className="tablero-contenedor">
        <div className="tablero-vacio">
          <h2>¡Bienvenido al Tablero de Rol!</h2>
          <p>Carga una imagen del tablero para comenzar</p>
          <button
            className="btn-cargar-grande"
            onClick={() => fileInputRef.current?.click()}
          >
            Cargar Tablero
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onCargarImagen}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="tablero-contenedor">
      <div
        ref={tableroRef}
        className="tablero"
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onContextMenu={onContextMenu}
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
        {fichas.map((ficha) => (
          <FichaTablero
            key={ficha.id}
            ficha={ficha}
            tableroSize={tableroSize}
            zoom={zoom}
            pan={pan}
            isDragging={fichaArrastrada === ficha.id}
            onMouseDown={onFichaMouseDown}
            onDoubleClick={onFichaDoubleClick}
            onClick={onFichaClick}
          />
        ))}
      </div>
    </div>
  );
});

Tablero.propTypes = {
  tableroImagen: PropTypes.string,
  fichas: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ).isRequired,
  tableroSize: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  zoom: PropTypes.number.isRequired,
  pan: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  fichaArrastrada: PropTypes.number,
  onMouseMove: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired,
  onWheel: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  onFichaMouseDown: PropTypes.func.isRequired,
  onFichaDoubleClick: PropTypes.func.isRequired,
  onFichaClick: PropTypes.func,
  onCargarImagen: PropTypes.func.isRequired,
};

Tablero.displayName = 'Tablero';

export default Tablero;
