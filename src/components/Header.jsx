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
  offsetGrilla,
  onToggleGrilla,
  onCambioTamañoGrilla,
  onCambioColorGrilla,
  onMoverGrillaArriba,
  onMoverGrillaAbajo,
  onMoverGrillaIzquierda,
  onMoverGrillaDerecha,
  onResetearOffsetGrilla,
  mostrarConfigGrilla,
  setMostrarConfigGrilla,
  onAbrirAcercaDe,
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
              className={`btn-simple ${mostrarGrilla ? "active" : ""}`}
              onClick={onToggleGrilla}
              title="Mostrar/ocultar grilla"
            >
              Grilla
            </button>
            {mostrarGrilla && (
              <button
                className="btn-config-grilla"
                onClick={() => setMostrarConfigGrilla(!mostrarConfigGrilla)}
                title="Configurar grilla"
              >
                ⚙️
              </button>
            )}
          </div>
        )}

        {/* Panel de configuración de grilla */}
        {mostrarConfigGrilla && (
          <div className="config-panel-grilla">
            <div className="config-grilla-tamaño">
              <label htmlFor="tamaño-grilla">Tamaño:</label>
              <input
                id="tamaño-grilla"
                type="range"
                min="20"
                max="200"
                step="1"
                value={tamañoGrilla}
                onChange={(e) => onCambioTamañoGrilla(Number(e.target.value))}
                className="grilla-slider"
                title={`Tamaño de grilla: ${tamañoGrilla}px`}
              />
              <span className="grilla-valor">{tamañoGrilla}px</span>
            </div>

            <div className="config-grilla-color">
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

            <div className="config-grilla-posicion">
              <label>Posición:</label>
              <div className="posicion-direcciones">
                <button
                  className="btn-direccion arriba"
                  onClick={onMoverGrillaArriba}
                  title="Mover grilla arriba"
                >
                  ↑
                </button>
                <div className="direcciones-medio">
                  <button
                    className="btn-direccion izquierda"
                    onClick={onMoverGrillaIzquierda}
                    title="Mover grilla izquierda"
                  >
                    ←
                  </button>
                  <button
                    className="btn-reset-posicion"
                    onClick={onResetearOffsetGrilla}
                    title="Resetear posición grilla"
                  >
                    ⊙
                  </button>
                  <button
                    className="btn-direccion derecha"
                    onClick={onMoverGrillaDerecha}
                    title="Mover grilla derecha"
                  >
                    →
                  </button>
                </div>
                <button
                  className="btn-direccion abajo"
                  onClick={onMoverGrillaAbajo}
                  title="Mover grilla abajo"
                >
                  ↓
                </button>
              </div>
              {(offsetGrilla.x !== 0 || offsetGrilla.y !== 0) && (
                <div className="offset-display">
                  {offsetGrilla.x !== 0 && `X: ${offsetGrilla.x}`}
                  {offsetGrilla.x !== 0 && offsetGrilla.y !== 0 && ", "}
                  {offsetGrilla.y !== 0 && `Y: ${offsetGrilla.y}`}
                </div>
              )}
            </div>
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
        <button
          className="btn-acerca-de"
          onClick={onAbrirAcercaDe}
          title="Información sobre la aplicación"
        >
          Acerca de
        </button>
        <a
          href="https://github.com/LuisSubiabre/tablero-de-rol"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-github"
          title="Ver código fuente en GitHub"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
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
  offsetGrilla: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  onToggleGrilla: PropTypes.func.isRequired,
  onCambioTamañoGrilla: PropTypes.func.isRequired,
  onCambioColorGrilla: PropTypes.func.isRequired,
  onMoverGrillaArriba: PropTypes.func.isRequired,
  onMoverGrillaAbajo: PropTypes.func.isRequired,
  onMoverGrillaIzquierda: PropTypes.func.isRequired,
  onMoverGrillaDerecha: PropTypes.func.isRequired,
  onResetearOffsetGrilla: PropTypes.func.isRequired,
  mostrarConfigGrilla: PropTypes.bool.isRequired,
  setMostrarConfigGrilla: PropTypes.func.isRequired,
  onAbrirAcercaDe: PropTypes.func.isRequired,
};

export default Header;
