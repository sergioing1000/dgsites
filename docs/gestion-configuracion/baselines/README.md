# Baselines del frontend

[Inicio](../README.md) · [CI](../elementos-configuracion/README.md) · [Control de cambios](../control-cambios/README.md) · [Trazabilidad](../trazabilidad/README.md) · [Roles](../roles-responsabilidades/README.md)

Una baseline es una configuración identificada y establecida que sirve como referencia para desarrollar y verificar cambios posteriores. Una vez establecida, sus elementos no se modifican directamente: un cambio controlado origina una nueva versión cuando corresponde.

## Convención

Se utiliza el esquema `BL-FE-<TIPO>-<NÚMERO>`:

| Tipo | Baseline | Propósito |
|---|---|---|
| `FUN` | Funcional | Fijar las capacidades y el comportamiento controlado. |
| `DEV` | Desarrollo | Fijar código, dependencias, configuración, pruebas y documentación como punto de partida. |

El número es consecutivo e inmutable. Un cambio que requiera actualizar `BL-FE-DEV-001` producirá `BL-FE-DEV-002`, sin reemplazar la referencia histórica anterior.

## Baselines establecidas

| Identificador | Estado | Referencia | Alcance |
|---|---|---|---|
| `BL-FE-FUN-001` | Establecida | Comportamiento fijado en `474f33c` | Capacidades funcionales actuales, incluidas las parciales o provisionales. |
| `BL-FE-DEV-001` | Establecida con desviaciones conocidas | Commit `474f33c543fc00252eb24993b01d7c322dae7322` de `main` | CI que constituyen el punto de partida para desarrollar y verificar cambios. |

## `BL-FE-FUN-001`

Esta baseline fija el comportamiento actual como referencia, sin declarar que todas las capacidades cumplen criterios completos de aceptación.

| Código | Capacidad incluida | Estado observado |
|---|---|---|
| `FUN-FE-01` | Seleccionar una función mediante el carrusel principal. | Implementada |
| `FUN-FE-02` | Ingresar nombre, coordenadas y rango de fechas para consultar una ubicación. | Implementada con validación parcial |
| `FUN-FE-03` | Seleccionar y visualizar coordenadas mediante OpenStreetMap. | Implementada |
| `FUN-FE-04` | Solicitar al backend resultados para una ubicación y descargar el archivo. | Implementada; depende de una URL incrustada |
| `FUN-FE-05` | Cargar estaciones desde una plantilla Excel, buscarlas, ordenarlas y paginarlas. | Implementada con validación limitada |
| `FUN-FE-06` | Consultar NASA POWER para múltiples ubicaciones. | Implementada |
| `FUN-FE-07` | Calcular resultados y exportarlos a Excel desde el navegador. | Implementada |
| `FUN-FE-08` | Obtener y presentar la ubicación actual del navegador. | Parcial |
| `FUN-FE-09` | Presentar documentación dentro de la aplicación. | Provisional |

Los enlaces `About`, `Dashboard` y `Contact` no se consideran capacidades implementadas. La migración de la herramienta de construcción, un nuevo contrato de API y la centralización del procesamiento son cambios futuros y no forman parte de esta baseline.

## `BL-FE-DEV-001`

El commit base `474f33c543fc00252eb24993b01d7c322dae7322` contiene:

| CI | Inclusión | Observación |
|---|---|---|
| `CI-FE-SRC` | Incluido | Contiene código activo, provisional e inactivo. |
| `CI-FE-UI` | Incluido | Sin evidencia automatizada de validación visual o accesibilidad. |
| `CI-FE-TPL` | Incluido | La plantilla no tiene una versión de esquema independiente. |
| `CI-FE-DEP` | Incluido | La aplicación declara `0.1.0`; Node no está fijado. |
| `CI-FE-BLD` | Incluido | Usa Create React App; no existe un pipeline automatizado. |
| `CI-FE-TST` | Incluido con desviación | La prueba disponible está desactualizada. |
| `CI-FE-CFG` | Incluido con desviación | Las URL y parámetros externos permanecen incrustados en componentes. |
| `CI-SH-API` | Referenciado, no formalizado | El contrato debe coordinarse con el backend. |
| `CI-FE-DOC` | Incluido | Comprende el README y la documentación presentada por la aplicación. |
| `CI-FE-REL` | Incluido parcialmente | Las baselines están identificadas; no existen etiquetas ni notas de liberación. |

## Desviaciones conocidas

| Código | Desviación | Tratamiento esperado |
|---|---|---|
| `DV-FE-001` | La prueba automatizada busca contenido que ya no existe. | Crear pruebas representativas de los flujos críticos. |
| `DV-FE-002` | Las URL y parámetros externos están incrustados en componentes. | Centralizar y documentar configuración por ambiente. |
| `DV-FE-003` | No se declara una versión de Node. | Fijar y documentar una versión compatible. |
| `DV-FE-004` | No existen etiquetas ni notas de liberación. | Crear el registro al establecer una liberación. |
| `DV-FE-005` | El contrato frontend-backend es implícito. | Versionar y probar el contrato de manera coordinada. |

## Regla de actualización

Se establece una baseline sucesora ante:

- Un cambio funcional aprobado.
- Una modificación del contrato frontend-backend.
- Una actualización relevante de React, herramientas o dependencias críticas.
- Un cambio de estructura de la plantilla Excel.
- La centralización o modificación de la configuración por ambiente.
- Una corrección que altere resultados, validaciones o tratamiento de errores.
