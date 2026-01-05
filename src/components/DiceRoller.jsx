import React, { useState } from "react";
import PropTypes from "prop-types";

const DiceRoller = ({ onClose }) => {
  const [resultados, setResultados] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [dadoSeleccionado, setDadoSeleccionado] = useState(20);
  const [isRolling, setIsRolling] = useState(false);
  const [lastRollType, setLastRollType] = useState(null);


  // Función para tirar dados con animación
  const tirarDado = (caras, cantidadDados = cantidad, tipoTirada = null) => {
    setIsRolling(true);
    setLastRollType(tipoTirada);

    // Simular delay de lanzamiento
    setTimeout(() => {
      const nuevosResultados = [];
      let total = 0;

      for (let i = 0; i < cantidadDados; i++) {
        const resultado = Math.floor(Math.random() * caras) + 1;
        nuevosResultados.push(resultado);
        total += resultado;
      }

      setResultados(nuevosResultados);
      setIsRolling(false);

      // Agregar al historial
      const nuevaTirada = {
        id: Date.now(),
        dado: `d${caras}`,
        cantidad: cantidadDados,
        resultados: nuevosResultados,
        total,
        timestamp: new Date().toLocaleTimeString(),
        tipo: tipoTirada,
        esCritico: caras === 20 && nuevosResultados[0] === 20,
        esFallo: caras === 20 && nuevosResultados[0] === 1,
      };

      setHistorial(prev => [nuevaTirada, ...prev.slice(0, 9)]);
    }, 800);
  };

  // Función para tirar dado seleccionado
  const tirarSeleccionado = () => {
    tirarDado(dadoSeleccionado);
  };

  // Presets comunes para D&D
  const tirarAtaque = () => {
    tirarDado(20, 1, 'ataque');
  };

  const tirarVentaja = () => {
    const resultadosVentaja = [];
    for (let i = 0; i < 2; i++) {
      resultadosVentaja.push(Math.floor(Math.random() * 20) + 1);
    }
    const mejorResultado = Math.max(...resultadosVentaja);
    tirarDado(20, 1, `ventaja (${resultadosVentaja.join(', ')})`);
    // Forzar el resultado después del delay
    setTimeout(() => {
      setResultados([mejorResultado]);
    }, 800);
  };

  const tirarDesventaja = () => {
    const resultadosDesventaja = [];
    for (let i = 0; i < 2; i++) {
      resultadosDesventaja.push(Math.floor(Math.random() * 20) + 1);
    }
    const peorResultado = Math.min(...resultadosDesventaja);
    tirarDado(20, 1, `desventaja (${resultadosDesventaja.join(', ')})`);
    // Forzar el resultado después del delay
    setTimeout(() => {
      setResultados([peorResultado]);
    }, 800);
  };

  const tirarSalvacion = () => {
    tirarDado(20, 1, 'salvación');
  };

  const tirarDano = (dados) => {
    const [numDados, caras] = dados.split('d').map(Number);
    tirarDado(caras, numDados, `daño (${dados})`);
  };

  // Función para limpiar historial
  const limpiarHistorial = () => {
    setHistorial([]);
    setResultados([]);
  };

  const dados = [
    { caras: 4, nombre: "d4", color: "#8b7355" },
    { caras: 6, nombre: "d6", color: "#a0856a" },
    { caras: 8, nombre: "d8", color: "#b89a7f" },
    { caras: 10, nombre: "d10", color: "#c9ab94" },
    { caras: 12, nombre: "d12", color: "#d4bca9" },
    { caras: 20, nombre: "d20", color: "#daa520" },
    { caras: 100, nombre: "d100", color: "#8b7355" },
  ];

  return (
    <div className="dice-roller-modal">

      <div className="dice-controls">
        <div className="cantidad-selector">
          <label>Cantidad:</label>
          <input
            type="number"
            min="1"
            max="20"
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
            className="input-cantidad"
          />
        </div>

        <div className="dado-seleccionado">
          <label>Dado seleccionado:</label>
          <select
            value={dadoSeleccionado}
            onChange={(e) => setDadoSeleccionado(parseInt(e.target.value))}
            className="select-dado"
          >
            {dados.map(dado => (
              <option key={dado.caras} value={dado.caras}>
                d{dado.caras}
              </option>
            ))}
          </select>
          <button
            className={`btn-tirar-grande ${isRolling ? 'rolling' : ''}`}
            onClick={tirarSeleccionado}
            disabled={isRolling}
          >
            {isRolling ? '🎲 Lanzando...' : `Tirar ${cantidad > 1 ? `${cantidad}d` : 'd'}${dadoSeleccionado}`}
          </button>
        </div>
      </div>

      <div className="dice-presets">
        <h3>Presets D&D</h3>
        <div className="presets-grid">
          <button
            className="btn-preset attack"
            onClick={tirarAtaque}
            disabled={isRolling}
            title="Tirar d20 para ataque"
          >
            <span className="preset-icon">⚔️</span>
            <span className="preset-text">Ataque</span>
          </button>
          <button
            className="btn-preset advantage"
            onClick={tirarVentaja}
            disabled={isRolling}
            title="Tirar 2d20 y tomar el mayor"
          >
            <span className="preset-icon">↗️</span>
            <span className="preset-text">Ventaja</span>
          </button>
          <button
            className="btn-preset disadvantage"
            onClick={tirarDesventaja}
            disabled={isRolling}
            title="Tirar 2d20 y tomar el menor"
          >
            <span className="preset-icon">↘️</span>
            <span className="preset-text">Desventaja</span>
          </button>
          <button
            className="btn-preset save"
            onClick={tirarSalvacion}
            disabled={isRolling}
            title="Tirar d20 para salvación"
          >
            <span className="preset-icon">🛡️</span>
            <span className="preset-text">Salvación</span>
          </button>
        </div>

        <div className="damage-presets">
          <span className="damage-label">Daño:</span>
          <div className="damage-buttons">
            <button className="btn-damage" onClick={() => tirarDano('1d6')} disabled={isRolling}>⚔️ 1d6</button>
            <button className="btn-damage" onClick={() => tirarDano('1d8')} disabled={isRolling}>🗡️ 1d8</button>
            <button className="btn-damage" onClick={() => tirarDano('2d6')} disabled={isRolling}>💥 2d6</button>
            <button className="btn-damage" onClick={() => tirarDano('1d10')} disabled={isRolling}>🏹 1d10</button>
            <button className="btn-damage" onClick={() => tirarDano('2d8')} disabled={isRolling}>🔥 2d8</button>
          </div>
        </div>
      </div>

      <div className="dados-grid">
            {dados.map(dado => (
              <button
                key={dado.caras}
                className="btn-dado"
                style={{ backgroundColor: dado.color }}
                onClick={() => tirarDado(dado.caras)}
                title={`Tirar ${cantidad > 1 ? cantidad + 'x ' : ''}d${dado.caras}`}
              >
                <div className="dado-icon">🎲</div>
                <div className="dado-nombre">{dado.nombre}</div>
              </button>
            ))}
          </div>

      {resultados.length > 0 && (
        <div className={`resultado-actual ${isRolling ? 'rolling' : ''}`}>
          <h3>
            {isRolling ? '🎲 Lanzando...' : 'Última tirada:'}
            {lastRollType && <span className="roll-type">({lastRollType})</span>}
          </h3>
          <div className="resultado-detalle">
            <span className="resultado-dado">{cantidad}d{dadoSeleccionado}</span>
            <span className="resultado-valores">
              {resultados.length > 1
                ? `[${resultados.join(', ')}] = `
                : ''
              }
              <span className={`resultado-total ${dadoSeleccionado === 20 && resultados[0] === 20 ? 'critico' : dadoSeleccionado === 20 && resultados[0] === 1 ? 'fallo' : ''}`}>
                {resultados.reduce((a, b) => a + b, 0)}
                {dadoSeleccionado === 20 && resultados[0] === 20 && <span className="critico-indicator"> CRÍTICO! 🎉</span>}
                {dadoSeleccionado === 20 && resultados[0] === 1 && <span className="fallo-indicator"> FALLO CRÍTICO 💀</span>}
              </span>
            </span>
          </div>
        </div>
      )}

      {historial.length > 0 && (
            <div className="historial">
              <div className="historial-header">
                <h3>Historial</h3>
                <button
                  className="btn-limpiar-historial"
                  onClick={limpiarHistorial}
                >
                  Limpiar
                </button>
              </div>
              <div className="historial-lista">
                {historial.map(tirada => (
                  <div key={tirada.id} className={`historial-item ${tirada.esCritico ? 'critico' : tirada.esFallo ? 'fallo' : ''}`}>
                    <span className="historial-tiempo">{tirada.timestamp}</span>
                    <span className="historial-tirada">
                      {tirada.cantidad > 1
                        ? `${tirada.cantidad}${tirada.dado}`
                        : tirada.dado
                      }
                      {tirada.tipo && <span className="historial-tipo">({tirada.tipo})</span>}
                    </span>
                    <span className="historial-resultado">
                      {tirada.resultados.length > 1
                        ? `[${tirada.resultados.join(', ')}] = `
                        : ''
                      }
                      <strong>{tirada.total}</strong>
                      {tirada.esCritico && <span className="historial-critico">🎉</span>}
                      {tirada.esFallo && <span className="historial-fallo">💀</span>}
                    </span>
                  </div>
                ))}
              </div>
        </div>
      )}
    </div>
  );
};

export default DiceRoller;
