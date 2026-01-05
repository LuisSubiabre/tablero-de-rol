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
  onNuevaPartida,
  mostrarGrilla,
  tamañoGrilla,
  colorGrilla,
  onToggleGrilla,
  onCambioTamañoGrilla,
  onCambioColorGrilla,
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

        {tableroImagen && (
          <div className="grilla-controls">
            <button
              className={`btn-toggle-grilla ${mostrarGrilla ? "active" : ""}`}
              onClick={onToggleGrilla}
              title="Mostrar/ocultar grilla"
            >
              □ Grilla
            </button>

            {mostrarGrilla && (
              <>
                <div className="grilla-tamaño-control">
                  <label htmlFor="tamaño-grilla">Tamaño:</label>
                  <input
                    id="tamaño-grilla"
                    type="range"
                    min="20"
                    max="200"
                    step="10"
                    value={tamañoGrilla}
                    onChange={(e) =>
                      onCambioTamañoGrilla(Number(e.target.value))
                    }
                    className="grilla-slider"
                    title={`Tamaño de grilla: ${tamañoGrilla}px`}
                  />
                  <span className="grilla-valor">{tamañoGrilla}px</span>
                </div>

                <div className="grilla-color-control">
                  <label htmlFor="color-grilla">Color:</label>
                  <input
                    id="color-grilla"
                    type="color"
                    value={colorGrilla}
                    onChange={(e) => onCambioColorGrilla(e.target.value)}
                    className="grilla-color-picker"
                    title="Color de la grilla"
                  />
                </div>
              </>
            )}
          </div>
        )}

        <button
          className="btn-nueva-partida"
          onClick={onNuevaPartida}
          title="Crear nueva partida (elimina todo)"
        >
          Nueva Partida
        </button>
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
  onNuevaPartida: PropTypes.func.isRequired,
  mostrarGrilla: PropTypes.bool.isRequired,
  tamañoGrilla: PropTypes.number.isRequired,
  colorGrilla: PropTypes.string.isRequired,
  onToggleGrilla: PropTypes.func.isRequired,
  onCambioTamañoGrilla: PropTypes.func.isRequired,
  onCambioColorGrilla: PropTypes.func.isRequired,
};

export default Header;
