# ADCOM Studio Hub — Demo

Demo de propuesta de CODIA Software para **Grupo ADCOM Mérida** (arquitectura, diseño comercial, construcción y remodelación de casonas).

Toda la información es **ficticia**. No hay backend: los datos viven en el navegador (localStorage) y se pueden reiniciar con el botón ↺ de la banda superior.

## Qué incluye

- **Sitio público**: pantalla de carga, inicio animado, servicios, proyectos con filtros, ficha de proyecto con galería y formulario de contacto.
- **Panel interno (Studio Hub)**: inicio con pendientes, clientes, proyectos, biblioteca (Drive), contenido con IA y aprobación, agenda, configuración y comparación de planes.
- Lo que se publica en el panel aparece en el sitio; lo que entra por el formulario aparece en Clientes y Agenda.

## Correr local

```bash
npm install
npm run dev
```

Stack: Vite + React + TypeScript + Tailwind CSS 4 + Framer Motion + Zustand + Lenis.
