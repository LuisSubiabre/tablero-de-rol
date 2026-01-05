# 🗡️ Tablero Virtual de Rol (D&D)

Aplicación web para gestionar partidas de Dungeons & Dragons y juegos de rol similares. Incluye tablero interactivo, gestión de fichas, lanzamiento de dados y herramientas para Dungeon Masters.

## ✨ Características

### 🎯 Gestión de Fichas

- **Crear fichas** de Héroes, Bestias y NPCs
- **Personalización completa**: nombre, imagen, puntos de vida, tamaño
- **Estados visuales**: herido, inconsciente, muerto (color gris)
- **Arrastrar y soltar** sobre el tablero
- **Redimensionar** con click derecho + arrastrar vertical
- **Información en tiempo real** al seleccionar fichas

### 🎲 Lanzador de Dados

- **Dados clásicos**: d4, d6, d8, d10, d12, d20, d100
- **Tiradas múltiples**: lanzar varios dados del mismo tipo
- **Presets D&D**: ataque, ventaja, desventaja, salvación, daño
- **Animaciones**: feedback visual durante lanzamientos
- **Indicadores críticos**: resalta 20s y 1s en d20
- **Historial mejorado** con colores para críticos/fallos
- **Sección colapsable** para ahorrar espacio

### 🗺️ Tablero Interactivo

- **Cargar imagen de fondo** personalizada
- **Zoom y pan** fluido con controles intuitivos
- **Persistencia automática** de posición y zoom
- **Controles de zoom** con slider y botones

### 💾 Persistencia de Datos

- **LocalStorage automático** - no pierdes tu partida al recargar
- **Botón "Nueva Partida"** para resetear todo
- **Guardado en tiempo real** de todas las modificaciones

## 🎮 Controles

### Tablero

- **Clic izquierdo + arrastrar**: mover fichas
- **Click derecho + arrastrar**: panear tablero
- **Rueda del mouse**: zoom
- **Espacio + clic izquierdo**: panear (alternativo)
- **Doble clic en ficha**: editar ficha

### Dados (modal)

- **🎲 Dados**: botón en header para abrir modal
- **Clic en dado**: tirar 1 dado del tipo seleccionado
- **Selector de cantidad**: tirar múltiples dados
- **Tirar grande**: botón para tirada rápida
- **Presets D&D**: ataque, ventaja, desventaja, salvación, daño
- **✕**: cerrar modal
- **Animaciones**: feedback visual durante lanzamientos
- **Críticos**: resalta 20s (oro) y 1s (rojo) en d20

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 🛠️ Tecnologías

- **React** - Framework UI
- **Vite** - Build tool y dev server
- **CSS** - Estilos con tema medieval/fantástico
- **LocalStorage** - Persistencia de datos

## 🎨 Tema Visual

- **Colores medievales**: marrón, dorado, rojo sangre
- **Fuentes elegantes** con sombras y efectos
- **Animaciones suaves** y feedback visual
- **Responsive design** para diferentes pantallas
