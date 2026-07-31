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

---

## 📌 Definición de baselines iniciales

Una baseline es una configuración identificada y establecida que sirve como referencia para desarrollar y verificar cambios posteriores. Una vez establecida, sus elementos no se modifican directamente: todo cambio debe seguir el proceso de control de cambios y dar origen a una nueva versión.

En este documento se establecen las baselines iniciales funcional y de desarrollo del frontend de DGSITES.

### Convención de identificación

Se utiliza el esquema `BL-FE-<TIPO>-<NÚMERO>`:

| Tipo | Baseline | Propósito |
| --- | --- | --- |
| `FUN` | Funcional | Fijar las capacidades y el comportamiento que deben conservarse o cambiarse de forma controlada. |
| `DEV` | Desarrollo | Fijar el código, las dependencias, la configuración, las pruebas y la documentación que sirven como punto de partida. |

El número es consecutivo e inmutable. Por ejemplo, un cambio aprobado sobre `BL-FE-DEV-001` debe producir `BL-FE-DEV-002`, sin reemplazar el contenido histórico de la primera.

### Baselines establecidas

| Identificador | Estado | Referencia | Alcance |
| --- | --- | --- | --- |
| `BL-FE-FUN-001` | Establecida | Comportamiento fijado en el commit `474f33c` | Capacidades funcionales actuales del frontend, incluidas las que se encuentran en estado parcial o provisional. |
| `BL-FE-DEV-001` | Establecida con desviaciones conocidas | Commit `474f33c543fc00252eb24993b01d7c322dae7322` de la rama `master` | CI que constituyen el punto de partida para desarrollar y verificar cambios posteriores. |

### `BL-FE-FUN-001`: baseline funcional

Esta baseline fija el comportamiento actual como referencia, pero no declara que todas las capacidades cumplan criterios completos de aceptación.

| Código | Capacidad incluida | Estado observado |
| --- | --- | --- |
| `FUN-FE-01` | Seleccionar una función mediante el carrusel principal. | Implementada |
| `FUN-FE-02` | Ingresar nombre, coordenadas y rango de fechas para consultar una ubicación. | Implementada con validación parcial |
| `FUN-FE-03` | Seleccionar y visualizar coordenadas mediante OpenStreetMap. | Implementada |
| `FUN-FE-04` | Solicitar al backend resultados para una ubicación y descargar el archivo. | Implementada; depende de una URL incrustada |
| `FUN-FE-05` | Cargar estaciones desde una plantilla Excel, buscarlas, ordenarlas y paginarlas. | Implementada con validación limitada |
| `FUN-FE-06` | Consultar NASA POWER para múltiples ubicaciones. | Implementada |
| `FUN-FE-07` | Calcular resultados y exportarlos a Excel desde el navegador. | Implementada |
| `FUN-FE-08` | Obtener y presentar la ubicación actual del navegador. | Parcial |
| `FUN-FE-09` | Presentar documentación dentro de la aplicación. | Provisional |

Los enlaces `About`, `Dashboard` y `Contact` no se consideran capacidades implementadas. La migración a Vite, un nuevo contrato de API y la centralización del procesamiento son cambios futuros y no forman parte de esta baseline.

### `BL-FE-DEV-001`: baseline de desarrollo

El commit base `474f33c543fc00252eb24993b01d7c322dae7322` fija el estado inicial de desarrollo y contiene los siguientes CI:

| CI | Inclusión en la baseline | Observación |
| --- | --- | --- |
| `CI-FE-SRC` | Incluido | Contiene el código activo, provisional e inactivo de `src/`. |
| `CI-FE-UI` | Incluido | No existe evidencia automatizada de validación visual o accesibilidad. |
| `CI-FE-TPL` | Incluido | La plantilla no tiene una versión de esquema independiente. |
| `CI-FE-DEP` | Incluido | `package.json` y `package-lock.json` declaran la versión `0.1.0`; la versión de Node no está fijada. |
| `CI-FE-BLD` | Incluido | La construcción usa Create React App y no existe un pipeline automatizado. |
| `CI-FE-TST` | Incluido con desviación | La prueba disponible está desactualizada y no verifica los flujos críticos. |
| `CI-FE-CFG` | Incluido con desviación | Las URL y los parámetros externos permanecen incrustados en componentes. |
| `CI-SH-API` | Referenciado, no formalizado | El contrato consumido por el frontend debe coordinarse con la baseline del backend. |
| `CI-FE-DOC` | Incluido | Comprende este README y la documentación presentada por la aplicación. |
| `CI-FE-REL` | En proceso de formalización | No existen todavía etiquetas, notas ni manifiestos de liberación. |

Todo cambio posterior debe identificar los CI afectados y registrar sus commits, revisión y evidencias de prueba. Los cambios del contrato compartido deben coordinarse con el backend.

### Desviaciones conocidas

| Código | Desviación | Tratamiento esperado |
| --- | --- | --- |
| `DV-FE-001` | La prueba automatizada disponible busca contenido que ya no existe. | Crear pruebas representativas de los flujos críticos. |
| `DV-FE-002` | Las URL y los parámetros externos están incrustados en los componentes. | Centralizar y documentar la configuración por ambiente. |
| `DV-FE-003` | No se declara una versión de Node. | Fijar y documentar una versión compatible. |
| `DV-FE-004` | No existen etiquetas, notas ni manifiestos de liberación. | Crear el registro al aprobar la primera liberación. |
| `DV-FE-005` | El contrato entre frontend y backend es implícito. | Versionar y probar el contrato de forma coordinada. |

Una nueva versión de baseline será necesaria ante cambios funcionales, modificaciones del contrato frontend-backend, actualizaciones relevantes de dependencias, cambios de la plantilla Excel o configuración por ambiente.
