# Elementos de configuración del frontend

[Inicio](../README.md) · [Baselines](../baselines/README.md) · [Control de cambios](../control-cambios/README.md) · [Trazabilidad](../trazabilidad/README.md) · [Roles](../roles-responsabilidades/README.md)

Los elementos de configuración (_Configuration Items_, CI) son los artefactos que deben identificarse, versionarse y revisarse porque un cambio incorrecto puede afectar la construcción, el funcionamiento, la presentación o el despliegue de la aplicación.

## Criterios de identificación

Los archivos se agrupan cuando comparten propósito y ciclo de cambio. Se separan cuando:

- Pueden cambiar por razones diferentes.
- Requieren controles distintos.
- Representan un contrato con usuarios u otros sistemas.
- Son necesarios para reconstruir o verificar una versión.
- Su modificación puede afectar operación, compatibilidad o seguridad.

## Convención

| Prefijo | Significado |
|---|---|
| `CI-FE` | Elemento controlado dentro del frontend. |
| `CI-SH` | Elemento compartido o coordinado entre frontend y backend. |

## CI priorizados

| Identificador | Elemento | Ubicación | Importancia y control requerido |
|---|---|---|---|
| `CI-FE-DEP-1` | Configuración de dependencias | [`package.json`](../../../package.json) | Declara dependencias, rangos de versión y scripts. Un cambio puede impedir la instalación o alterar la aplicación. |
| `CI-FE-DEP-2` | Control de dependencias | [`package-lock.json`](../../../package-lock.json) | Fija versiones exactas y transitivas para reproducir la instalación. Debe actualizarse junto con `package.json`. |
| `CI-FE-UI` | Estilos y recursos de presentación | CSS, imágenes, SVG, sonidos y [`public/`](../../../public/) | Determina presentación, navegación, accesibilidad e identidad visual. Requiere validación visual. |
| `CI-FE-CFG` | Configuración de ejecución e integraciones | Configuración central por formalizar | Debe centralizar URL de API, banderas de funcionalidad y valores variables por ambiente. |

`CI-FE-DEP-1` y `CI-FE-DEP-2` se administran conjuntamente como `CI-FE-DEP`: el manifiesto declara las dependencias aceptadas y el archivo de bloqueo permite reproducir una instalación exacta.

## Inventario consolidado

| Identificador | Elemento | Contenido o ubicación | Nivel | Estado actual |
|---|---|---|---|---|
| `CI-FE-SRC` | Código fuente | [`src/`](../../../src/) | Alto | Versionado; no existe revisión automatizada ni separación formal entre código activo e inactivo. |
| `CI-FE-UI` | Estilos y recursos de presentación | CSS, imágenes, SVG, sonidos y `public/` | Medio | Versionado; sin criterios documentados de validación visual o accesibilidad. |
| `CI-FE-TPL` | Plantilla de entrada | [`src/assets/sitestemplate.zip`](../../../src/assets/sitestemplate.zip) y esquema interpretado por el lector | Alto | Versionada; su esquema y compatibilidad no están formalizados. |
| `CI-FE-DEP` | Manifiesto y bloqueo de dependencias | `package.json` y `package-lock.json` | Alto | Versionados; no se declara una versión de Node. |
| `CI-FE-BLD` | Construcción y ejecución | Scripts, `eslintConfig`, `browserslist`, [`public/index.html`](../../../public/index.html) y [`.gitignore`](../../../.gitignore) | Alto | Usa Create React App; no existe automatización de integración continua. |
| `CI-FE-TST` | Pruebas y calidad | [`src/App.test.js`](../../../src/App.test.js) y [`src/setupTests.js`](../../../src/setupTests.js) | Alto | La prueba disponible está desactualizada y no representa los flujos actuales. |
| `CI-FE-CFG` | Ejecución e integraciones externas | URL del backend y parámetros de servicios externos | Alto | Los valores permanecen distribuidos dentro de componentes. |
| `CI-SH-API` | Contrato frontend-backend | Solicitud, respuesta, descarga y tratamiento de errores | Alto | Implementación implícita; sin especificación coordinada ni pruebas de contrato. |
| `CI-FE-DOC` | Documentación | README y documentación incluida en la aplicación | Medio | Versionada; parte del contenido de usuario continúa siendo provisional. |
| `CI-FE-REL` | Registros de baseline y liberación | Identificadores de baseline, etiquetas y notas de versión | Alto | Las baselines iniciales están registradas; las etiquetas y notas de liberación no están formalizadas. |

## Relaciones principales

| CI de origen | CI relacionado | Relación |
|---|---|---|
| `CI-FE-TPL` | `CI-FE-SRC` | El lector depende del formato de la plantilla. |
| `CI-FE-DEP` | `CI-FE-BLD` | Las dependencias determinan la instalación y construcción. |
| `CI-FE-BLD` | `CI-FE-SRC` | Los scripts determinan cómo se ejecuta, prueba y construye el código. |
| `CI-FE-CFG` | `CI-FE-SRC` | Los componentes consumen los endpoints y parámetros configurados. |
| `CI-SH-API` | `CI-FE-SRC` | La consulta individual depende del contrato acordado. |
| `CI-FE-TST` | Todos los CI modificables | Las pruebas aportan evidencia para aceptar cambios. |
| `CI-FE-DOC` | Todos los CI modificables | La documentación debe actualizarse cuando cambia el comportamiento o la configuración. |
| `CI-FE-REL` | Todos los CI de una baseline | El registro fija identificadores, referencias y evidencias. |

## Control mínimo

- Los CI de nivel alto requieren solicitud identificada, análisis de impacto, revisión y pruebas aplicables.
- Los CI de nivel medio requieren revisión por pares.
- Un cambio de nivel medio se trata como alto cuando afecta funcionalidad, accesibilidad, datos de entrada o compatibilidad.

