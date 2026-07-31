# 🌎 Excel Upload Table + NASA POWER API Integration

Este proyecto es una aplicación en React que permite:

- 📂 Subir archivos de Excel con información de estaciones.
- 🔍 Buscar, ordenar, paginar y visualizar los datos.
- 📡 Consultar la API de NASA POWER para obtener datos climáticos históricos.
- 🗺️ Ver las ubicaciones en un mapa interactivo usando Leaflet.
- 📥 Exportar los resultados como un archivo `results.xlsx`.

---

## 🚀 Características

- ✅ Carga de archivos `.xls` y `.xlsx`.
- 🔍 Búsqueda de texto libre en toda la tabla.
- ↕ Ordenamiento de columnas por estación, estado, latitud o longitud.
- 📑 Paginación con opciones de 10, 20 y 50 filas por página.
- 🗺️ Mapa con vista de cada estación (al hacer clic en una fila).
- 🔄 Progreso visual de las peticiones a la API.
- 📤 Exportación a Excel de los datos obtenidos desde la NASA.

---

## 🧑‍💻 Instalación y ejecución local

https://solar-sergioapp.netlify.app/

---

## 🧩 Elementos de configuración (CI)

Los elementos de configuración (_Configuration Items_, CI) son los artefactos que deben identificarse, versionarse y revisarse porque un cambio incorrecto puede afectar la construcción, el funcionamiento, la presentación o el despliegue de la aplicación.

### CI priorizados

| Identificador | Elemento                                   | Ubicación                                                        | Importancia y control requerido                                                                                                                                                                                                           |
| ------------- | ------------------------------------------ | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CI-FE-DEP-1` | Configuración de dependencias              | `package.json`                                                   | Declara las dependencias, sus rangos de versión y los scripts de construcción, prueba y ejecución. Debe versionarse y revisarse porque un cambio no controlado puede impedir la instalación o alterar el comportamiento de la aplicación. |
| `CI-FE-DEP-2` | Control de dependencias                    | `package-lock.json`                                              | Fija las versiones exactas y transitivas para reproducir la instalación. Debe actualizarse y confirmarse junto con `package.json`; no debe editarse manualmente.                                                                          |
| `CI-FE-UI`    | Estilos y recursos de presentación         | Archivos `.css`, imágenes, SVG, sonidos y contenido de `public/` | Determina la presentación, navegación, accesibilidad e identidad visual. Requiere control de versiones y validación visual.                                                                                                               |
| `CI-FE-CFG`   | Configuración de ejecución e integraciones | Archivo de configuración por formalizar                          | Debe centralizar la URL de la API, las banderas de funcionalidad y otros valores variables por ambiente. Evita valores incrustados en los componentes y facilita crear y desplegar entornos de desarrollo, pruebas y producción.          |

`CI-FE-DEP-1` y `CI-FE-DEP-2` se administran conjuntamente como `CI-FE-DEP`, pero se distinguen aquí porque cumplen funciones diferentes: el manifiesto declara las dependencias aceptadas y el archivo de bloqueo permite reproducir una instalación exacta.

### Inventario consolidado

| Identificador                               | Elemento de configuración                           | Nivel de control |
| ------------------------------------------- | --------------------------------------------------- | ---------------- |
| `CI-FE-SRC`                                 | Código fuente de la aplicación                      | Alto             |
| `CI-FE-UI`                                  | Estilos y recursos de presentación                  | Medio            |
| `CI-FE-TPL`                                 | Plantilla de entrada para múltiples ubicaciones     | Alto             |
| `CI-FE-DEP` (`CI-FE-DEP-1` y `CI-FE-DEP-2`) | Manifiesto y bloqueo de dependencias                | Alto             |
| `CI-FE-BLD`                                 | Configuración de construcción y ejecución           | Alto             |
| `CI-FE-TST`                                 | Pruebas y configuración de calidad                  | Alto             |
| `CI-FE-CFG`                                 | Configuración de ejecución e integraciones externas | Alto             |
| `CI-SH-API`                                 | Contrato compartido entre frontend y backend        | Alto             |
| `CI-FE-DOC`                                 | Documentación técnica y de usuario                  | Medio            |
| `CI-FE-ART`                                 | Artefacto compilado del frontend                    | Alto             |
| `CI-FE-REL`                                 | Registros de baseline y liberación                  | Alto             |

Los CI con nivel de control **alto** requieren análisis de impacto, revisión y pruebas aplicables antes de integrarse o liberarse. Los de nivel **medio** requieren revisión por pares y deben elevarse a nivel alto cuando el cambio afecte la funcionalidad, la accesibilidad o la compatibilidad.
