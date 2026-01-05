import React from "react";
import PropTypes from "prop-types";

const Header = ({
  tableroImagen,
  zoom,
  onZoomChange,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onCargarImagen,
}) => {
  const fileInputRef = React.useRef(null);

  return (
    <header className="header">
      <h1>Tablero de Rol</h1>
      <div className="header-controls">
        {tableroImagen && (
          <div className="zoom-controls">
            <button
              className="btn-zoom"
              onClick={onZoomOut}
              title="Alejar (Ctrl + Rueda del mouse)"
            >
              −
            </button>
            <input
              type="range"
              min="25"
              max="300"
              value={zoom}
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="zoom-slider"
            />
            <span className="zoom-value">{zoom}%</span>
            <button
              className="btn-zoom"
              onClick={onZoomIn}
              title="Acercar (Ctrl + Rueda del mouse)"
            >
              +
            </button>
            <button
              className="btn-zoom-reset"
              onClick={onZoomReset}
              title="Restablecer zoom"
            >
              Resetear
            </button>
          </div>
        )}
        <button
          className="btn-cargar"
          onClick={() => fileInputRef.current?.click()}
        >
          Cargar Tablero
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onCargarImagen}
        style={{ display: "none" }}
      />
    </header>
  );
};

Header.propTypes = {
  tableroImagen: PropTypes.string,
  zoom: PropTypes.number.isRequired,
  onZoomChange: PropTypes.func.isRequired,
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
  onZoomReset: PropTypes.func.isRequired,
  onCargarImagen: PropTypes.func.isRequired,
};

export default Header;
