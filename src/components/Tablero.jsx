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
  mostrarGrilla,
  tamañoGrilla,
  colorGrilla,
  offsetGrilla,
  mostrarNombresFichas,
  modoDibujo,
  colorLapiz,
  grosorLapiz,
  modoBorrador,
  dibujos,
  dibujoActual,
  onIniciarDibujo,
  onContinuarDibujo,
  onTerminarDibujo,
  onBorrarDibujoEnPunto,
  onMouseMove,
  onMouseDown,
  onMouseUp,
  onWheel,
  onContextMenu,
  onFichaMouseDown,
  onFichaResizeRightMouseDown,
  onFichaDoubleClick,
  onFichaClick,
  onCargarImagen
}, ref) => {
  const tableroRef = ref;
  const fileInputRef = useRef(null);
  const [estaDibujando, setEstaDibujando] = React.useState(false);

  // Función para convertir coordenadas del mouse a coordenadas relativas del tablero (0-1)
  const convertirCoordenadasMouse = (clientX, clientY) => {
    if (!tableroRef.current) return { x: 0, y: 0 };

    const rect = tableroRef.current.getBoundingClientRect();
    const scaleFactor = zoom / 100;

    // Coordenadas del mouse relativas al rectángulo transformado
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    // El rectángulo que obtenemos ya refleja la transformación
    // Para obtener coordenadas en el sistema original, necesitamos deshacer la transformación

    // Centro del rectángulo transformado
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Deshacer la transformación: translate primero, luego scale
    // Como transform-origin es center, necesitamos ajustar por el centro
    const unTranslatedX = mouseX - centerX;
    const unTranslatedY = mouseY - centerY;

    const unScaledX = unTranslatedX / scaleFactor;
    const unScaledY = unTranslatedY / scaleFactor;

    const originalX = unScaledX + centerX - pan.x;
    const originalY = unScaledY + centerY - pan.y;

    // Convertir a coordenadas normalizadas (0-1)
    const x = originalX / tableroSize.width;
    const y = originalY / tableroSize.height;

    return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
  };

  // Función para manejar el inicio del dibujo
  const handleMouseDownDibujo = (e) => {
    if (!modoDibujo) return;

    e.preventDefault();
    e.stopPropagation();

    const coords = convertirCoordenadasMouse(e.clientX, e.clientY);
    setEstaDibujando(true);

    if (modoBorrador) {
      onBorrarDibujoEnPunto(coords.x, coords.y);
    } else {
      onIniciarDibujo(coords.x, coords.y);
    }
  };

  // Función para continuar el dibujo
  const handleMouseMoveDibujo = (e) => {
    if (!estaDibujando || !modoDibujo) return;

    const coords = convertirCoordenadasMouse(e.clientX, e.clientY);

    if (modoBorrador) {
      onBorrarDibujoEnPunto(coords.x, coords.y);
    } else {
      onContinuarDibujo(coords.x, coords.y);
    }
  };

  // Función para terminar el dibujo
  const handleMouseUpDibujo = () => {
    if (estaDibujando) {
      setEstaDibujando(false);
      onTerminarDibujo();
    }
  };

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
        className={`tablero ${modoDibujo ? 'modo-dibujo' : ''} ${modoBorrador ? 'modo-borrador' : ''}`}
        onMouseMove={(e) => {
          onMouseMove(e);
          if (modoDibujo && estaDibujando) handleMouseMoveDibujo(e);
        }}
        onMouseDown={(e) => {
          if (modoDibujo && e.button === 0) {
            // Click izquierdo en modo dibujo: dibujar
            handleMouseDownDibujo(e);
          } else if (e.button === 2 || (!modoDibujo && e.button === 0)) {
            // Click derecho siempre, o click izquierdo cuando no está en modo dibujo: panear
            onMouseDown(e);
          }
        }}
        onMouseUp={(e) => {
          onMouseUp(e);
          if (modoDibujo && e.button === 0) handleMouseUpDibujo();
        }}
        onMouseLeave={(e) => {
          onMouseUp(e);
          if (modoDibujo && estaDibujando) handleMouseUpDibujo();
        }}
        onWheel={onWheel}
        onContextMenu={onContextMenu}
        style={{
          cursor: modoDibujo ? (modoBorrador ? 'not-allowed' : 'crosshair') : 'default'
        }}
        title={modoDibujo ? 'Click izquierdo: dibujar | Click derecho: panear' : 'Click y arrastra para mover el tablero'}
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

        {/* Grilla cuadrada */}
        {mostrarGrilla && (
          <svg
            className="tablero-grilla"
            width={tableroSize.width}
            height={tableroSize.height}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            <defs>
              <pattern
                id="grid"
                width={tamañoGrilla}
                height={tamañoGrilla}
                patternUnits="userSpaceOnUse"
                patternTransform={`translate(${offsetGrilla.x}, ${offsetGrilla.y})`}
              >
                <path
                  d={`M ${tamañoGrilla} 0 L 0 0 0 ${tamañoGrilla}`}
                  fill="none"
                  stroke={colorGrilla}
                  strokeWidth="1"
                  opacity="0.6"
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#grid)"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${
                  zoom / 100
                })`,
                transformOrigin: "center center",
              }}
            />
          </svg>
        )}

        {/* Dibujos */}
        {(dibujos.length > 0 || dibujoActual) && (
          <svg
            className="tablero-dibujos"
            width={tableroSize.width}
            height={tableroSize.height}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              zIndex: 2,
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
              transformOrigin: "center center",
            }}
          >
            {/* Dibujos completados */}
            {dibujos.map((dibujo, index) => (
              <path
                key={`dibujo-${index}`}
                d={dibujo.puntos.reduce((path, punto, i) => {
                  const x = punto.x * tableroSize.width;
                  const y = punto.y * tableroSize.height;
                  return i === 0 ? `M ${x} ${y}` : `${path} L ${x} ${y}`;
                }, '')}
                stroke={dibujo.color}
                strokeWidth={dibujo.grosor}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* Dibujo actual (mientras se está dibujando) */}
            {dibujoActual && dibujoActual.puntos.length > 0 && (
              <path
                d={dibujoActual.puntos.reduce((path, punto, i) => {
                  const x = punto.x * tableroSize.width;
                  const y = punto.y * tableroSize.height;
                  return i === 0 ? `M ${x} ${y}` : `${path} L ${x} ${y}`;
                }, '')}
                stroke={dibujoActual.color}
                strokeWidth={dibujoActual.grosor}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        )}

        {fichas.map((ficha) => (
          <FichaTablero
            key={ficha.id}
            ficha={ficha}
            tableroSize={tableroSize}
            zoom={zoom}
            pan={pan}
            isDragging={fichaArrastrada === ficha.id}
            mostrarNombres={mostrarNombresFichas}
            modoDibujo={modoDibujo}
            onMouseDown={onFichaMouseDown}
            onResizeRightMouseDown={onFichaResizeRightMouseDown}
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
  mostrarGrilla: PropTypes.bool.isRequired,
  tamañoGrilla: PropTypes.number.isRequired,
  colorGrilla: PropTypes.string.isRequired,
  offsetGrilla: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  mostrarNombresFichas: PropTypes.bool.isRequired,
  modoDibujo: PropTypes.bool.isRequired,
  colorLapiz: PropTypes.string.isRequired,
  grosorLapiz: PropTypes.number.isRequired,
  modoBorrador: PropTypes.bool.isRequired,
  dibujos: PropTypes.arrayOf(
    PropTypes.shape({
      puntos: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
        })
      ).isRequired,
      color: PropTypes.string.isRequired,
      grosor: PropTypes.number.isRequired,
    })
  ).isRequired,
  dibujoActual: PropTypes.shape({
    puntos: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      })
    ),
    color: PropTypes.string,
    grosor: PropTypes.number,
  }),
  onIniciarDibujo: PropTypes.func.isRequired,
  onContinuarDibujo: PropTypes.func.isRequired,
  onTerminarDibujo: PropTypes.func.isRequired,
  onBorrarDibujoEnPunto: PropTypes.func.isRequired,
  onMouseMove: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired,
  onWheel: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  onFichaMouseDown: PropTypes.func.isRequired,
  onFichaResizeRightMouseDown: PropTypes.func.isRequired,
  onFichaDoubleClick: PropTypes.func.isRequired,
  onFichaClick: PropTypes.func,
  onCargarImagen: PropTypes.func.isRequired,
};

Tablero.displayName = 'Tablero';

export default Tablero;
