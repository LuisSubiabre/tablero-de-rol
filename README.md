# 🗡️ Tablero Virtual de Rol (D&D)

Aplicación web para gestionar partidas de Dungeons & Dragons y juegos de rol similares. Incluye tablero interactivo, gestión de fichas y herramientas para Dungeon Masters.

## ✨ Características

### 🎯 Gestión de Fichas

- **Crear fichas** de Héroes, Bestias y NPCs
- **Personalización completa**: nombre, imagen, puntos de vida, tamaño
- **Estados visuales**: herido, inconsciente, muerto (color gris)
- **Arrastrar y soltar** sobre el tablero
- **Redimensionar** con click derecho + arrastrar vertical
- **Información en tiempo real** al seleccionar fichas

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
