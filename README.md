# 🗡️ Tablero Virtual de Rol

Aplicación web para apoyar partidas de rol mediante un tablero visual simple e intuitivo.  
Ideal para **rol en solitario**, simulación de encuentros o preparación de escenarios,
sin sistemas complejos ni reglas automatizadas.

Carga tu mapa, añade tus fichas y deja que la narrativa fluya.

---

## ✨ Características

### 🎯 Gestión de Fichas

- Crear fichas de Héroes, Bestias y NPCs
- Fichas con o sin imagen
- Edición rápida mediante doble clic
- Arrastrar y soltar sobre el tablero
- Redimensionar fichas con clic derecho + arrastre vertical

### 🗺️ Tablero Interactivo

- Cargar mapas como imagen de fondo (JPG, PNG, WebP)
- **Grilla opcional sobre el mapa** para facilitar el posicionamiento
- Zoom y paneo fluido
- Navegación cómoda para mapas grandes

### 💾 Persistencia de Datos

- Guardado automático en el navegador (LocalStorage)
- La partida permanece aunque cierres la pestaña o el navegador
- Opción de reiniciar la partida manualmente

---

## 🎮 Controles

- **Clic izquierdo + arrastrar**: mover fichas
- **Clic derecho + arrastrar**: panear tablero
- **Rueda del mouse**: zoom
- **Doble clic en ficha**: editar ficha

---

## 🛠️ Tecnologías

- **React 19**
- **Vite**
- **CSS puro** (sin frameworks visuales)
- **LocalStorage** para persistencia

---

🎲 Menos reglas, más imaginación.  
⚔️ Simula encuentros a tu ritmo.  
🧙‍♂️ Rol visual, rápido y sin distracciones.

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
- **Responsive design completo**: desktop, tablets, móviles

### 📱 Responsive Design

- **1024px+**: Layout completo de escritorio
- **768px-1024px**: Optimizado para tablets
- **480px-768px**: Layout móvil con sidebar colapsable
- **320px-480px**: Optimizado para móviles grandes
- **<320px**: Diseño ultra-compacto para móviles pequeños
- **Touch-friendly**: Botones de 44px mínimo para mejor usabilidad móvil
- **Gestos optimizados**: Touch actions y manipulación táctil
