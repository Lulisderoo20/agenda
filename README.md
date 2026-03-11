# Agenda

Agenda personal minimalista en HTML, CSS y JavaScript, pensada para abrirse directo en el navegador y guardar tareas en `localStorage`.

## Abrir el proyecto

1. Abre `index.html` en tu navegador.
2. Carga tareas con titulo, fecha, hora, area y nota.
3. Usa los filtros para ver `Hoy`, `Proximas` o `Hechas`.

## Que incluye esta primera version

- Diseno UX/UI minimalista con `Fraunces`.
- Paleta en violetas, bordo, fucsia, rosa, coral y naranja.
- Guardado local automatico.
- Estado de tarea completada y borrado rapido.
- Selector inicial persistente entre agenda resumida y agenda con enfoque en Cristo.
- Favicon, logo, manifest web y service worker para compartirla mejor como web app.
- Workflow listo para desplegar en GitHub Pages cuando subas el repo a GitHub.

## Acceso directo con icono

1. Genera los iconos raster ejecutando `python scripts/generate_brand_assets.py`.
2. Crea el acceso directo de Windows ejecutando `powershell -ExecutionPolicy Bypass -File .\scripts\create-shortcut.ps1`.
3. Ese acceso directo usa `assets/agenda-icon.ico`, asi que el icono tambien se ve en el escritorio.

## SEO y compartir

- El SEO sirve para que una pagina web sea mas encontrable en buscadores.
- No mejora por obligar a la gente a hacer clics; eso suele empeorar la experiencia.
- Si quieres reputacion real, publica la app en una URL, compartela, consigue recomendaciones y deja una buena primera impresion.
- Esta base ya incluye metadatos sociales, `manifest.webmanifest`, `robots.txt` y un workflow para GitHub Pages.

## Proximos pasos posibles

- Recordatorios por hora.
- Vista calendario semanal o mensual.
- Etiquetas por color.
- Exportacion e importacion de tareas.
