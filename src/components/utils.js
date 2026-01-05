export const getColorPorCategoria = (categoria) => {
  switch (categoria) {
    case "Heroes":
      return "#3b82f6"; // azul
    case "Bestias":
      return "#ef4444"; // rojo
    case "Otros":
      return "#10b981"; // verde
    default:
      return "#6b7280"; // gris
  }
};

export const getColorHP = (hpActual, hpMax) => {
  if (hpActual <= 0) return "#6b7280"; // gris - muerto
  const porcentaje = hpActual / hpMax;
  if (porcentaje < 0.25) return "#ef4444"; // rojo - crítico
  if (porcentaje < 0.5) return "#f59e0b"; // naranja - grave
  if (porcentaje < 0.75) return "#eab308"; // amarillo - herido
  return "#10b981"; // verde - saludable
};

export const calcularEstadoPorHP = (hpActual, hpMax) => {
  if (hpActual <= 0) return "muerto";
  const porcentaje = hpActual / hpMax;
  if (porcentaje < 0.25) return "inconsciente";
  if (porcentaje < 0.5) return "herido";
  return "saludable";
};

export const getLabelEstado = (estado) => {
  switch (estado) {
    case "muerto":
      return "💀 Muerto";
    case "inconsciente":
      return "😴 Inconsciente";
    case "herido":
      return "🩹 Herido";
    default:
      return "✅ Saludable";
  }
};
