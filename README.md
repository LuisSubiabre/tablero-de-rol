# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Funcionalidad de pan implementada:
Estado de pan: Se guarda la posición X e Y del pan.
Métodos para panear:
Clic derecho: Clic derecho + arrastrar para mover la imagen
Clic central (rueda): Clic en la rueda + arrastrar
Espacio + Clic izquierdo: Mantén presionada la tecla Espacio y arrastra con el botón izquierdo
Distinción entre acciones:
El pan no interfiere con el movimiento de fichas
Las fichas se mueven con clic izquierdo normal
El pan se activa solo con los métodos indicados
Integración con zoom:
El pan funciona junto con el zoom
Al hacer reset del zoom, también se resetea el pan
La imagen se mueve usando translate junto con scale
Feedback visual:
El cursor cambia a "grab" cuando puedes panear
Cambia a "grabbing" mientras paneas
