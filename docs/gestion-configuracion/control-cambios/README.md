# Control de cambios del frontend

[Inicio](../README.md) · [CI](../elementos-configuracion/README.md) · [Baselines](../baselines/README.md) · [Trazabilidad](../trazabilidad/README.md) · [Roles](../roles-responsabilidades/README.md) · [Versionado](../versionado-liberaciones/README.md)

Este proceso controla los cambios realizados sobre los elementos de configuración del frontend. Su objetivo es que cada modificación tenga una justificación, una decisión explícita, revisión proporcional al riesgo y evidencia suficiente para reconstruir lo ocurrido.

## Identificación de solicitudes

Cada cambio se registra con el formato `CR-FE-###`, donde el número es consecutivo. La solicitud debe existir antes de implementar el cambio y conservar el mismo identificador en la rama, el Pull Request y el registro de trazabilidad.

## Información obligatoria

| Campo | Contenido esperado |
|---|---|
| Identificador | Código único `CR-FE-###`. |
| Título | Resumen concreto del cambio. |
| Descripción y justificación | Problema, necesidad u oportunidad que origina el cambio. |
| Solicitante y fecha | Persona que registra la solicitud y fecha de creación. |
| Capacidades afectadas | Códigos `FUN-FE-##` aplicables o indicación de que no existe impacto funcional. |
| CI afectados | Elementos del inventario que se modificarán o verificarán. |
| Impacto y riesgo | Efectos funcionales, técnicos, de seguridad, accesibilidad, compatibilidad y operación. |
| Dependencias | Relación con el backend, servicios externos u otros cambios. |
| Pruebas | Verificaciones requeridas y resultado esperado. |
| Reversión | Forma de regresar a la configuración anterior si el cambio falla. |
| Decisión y estado | Aprobada, rechazada, en ajuste, implementada o cerrada. |

## Flujo de control

1. Registrar la solicitud y asignar su identificador.
2. Relacionar las capacidades, los CI y las dependencias afectadas.
3. Analizar impacto, riesgo, pruebas necesarias y estrategia de reversión.
4. Aprobar, rechazar o solicitar ajustes antes de la implementación.
5. Crear una rama `feature/*` o `fix/*` desde `develop`; los `hotfix/*` parten de `main`.
6. Implementar el cambio y actualizar las pruebas y la documentación aplicables.
7. Crear un Pull Request hacia `develop` que enlace la solicitud y presente las evidencias.
8. Ejecutar la revisión técnica y la verificación requeridas por el nivel de control.
9. Integrar el cambio en `develop` únicamente cuando cumpla los criterios de aceptación.
10. Promover `develop` hacia `staging` mediante Pull Request y validar el despliegue de preproducción.
11. Promover `staging` hacia `main` mediante Pull Request después de la aceptación en preproducción.
12. Verificar el despliegue productivo, actualizar la trazabilidad, establecer una baseline sucesora si corresponde y cerrar la solicitud.

## Convención de ramas

| Tipo de cambio | Formato | Ejemplo |
|---|---|---|
| Integración | `develop` | Rama permanente para reunir cambios aprobados. |
| Preproducción | `staging` | Rama permanente para validar el candidato. |
| Producción | `main` | Rama permanente estable y liberable. |
| Nueva capacidad | `feature/CR-FE-###-descripcion` | `feature/CR-FE-012-configuracion-api` |
| Corrección | `fix/CR-FE-###-descripcion` | `fix/CR-FE-013-validacion-fechas` |
| Corrección urgente | `hotfix/CR-FE-###-descripcion` | `hotfix/CR-FE-014-error-descarga` |

El flujo ordinario es `feature/fix -> develop -> staging -> main`. Los cambios se integran y promueven mediante Pull Request; la rama de trabajo no sustituye la solicitud ni la evidencia del cambio.

## Inicialización y protección

Después de integrar la configuración inicial de Git Flow se crean `develop` desde `main` y `staging` desde `develop`. Las tres ramas permanentes deben impedir eliminación y force push.

Los rulesets deben aplicar:

| Rama | Pull Request | Aprobación | Checks obligatorios |
|---|---|---|---|
| `develop` | Requerido | Según el nivel del cambio | `Validate change metadata` y `Verify and build` |
| `staging` | Requerido | Revisión de promoción | `Validate change metadata` y `Verify and build` |
| `main` | Requerido | Al menos una aprobación | `Validate change metadata` y `Verify and build` |

GitHub debe disponer de los environments `staging` y `production`. El primero recibe el alias de preproducción de Netlify y el segundo conserva el despliegue productivo.

## Nivel de revisión

| Alcance | Revisión mínima |
|---|---|
| CI de nivel alto | Análisis de impacto, revisión técnica por otra persona y verificación de las pruebas aplicables. |
| CI de nivel medio | Revisión por pares y validación correspondiente al tipo de artefacto. |
| Cambio funcional, de accesibilidad o compatibilidad sobre un CI medio | Se controla como un cambio de nivel alto. |
| `CI-SH-API` | Revisión del frontend y coordinación explícita con el responsable del backend antes de integrar. |

## Criterios del Pull Request

Antes de aprobarlo se comprueba que:

- Referencia una solicitud `CR-FE-###` aprobada.
- Declara capacidades y CI afectados.
- Su alcance coincide con la solicitud y no incorpora cambios ajenos.
- Incluye o actualiza pruebas cuando el comportamiento cambia.
- Registra los resultados de las verificaciones manuales o automatizadas.
- Actualiza la documentación y la configuración cuando corresponda.
- Describe los riesgos pendientes y el procedimiento de reversión.
- Cumple la coordinación requerida si modifica `CI-SH-API`.
- Utiliza una transición admitida por el flujo Git.

## Cambios rechazados o en ajuste

Una solicitud rechazada conserva su identificador, decisión y motivo, pero no se implementa. Si requiere ajustes, vuelve al análisis con la información corregida. Un cambio ya implementado que no supera la revisión no se integra hasta resolver las observaciones y repetir las verificaciones afectadas.

## Cambios urgentes

Una corrección urgente parte de `main` y se integra nuevamente en `main` mediante Pull Request. Puede abreviar el tiempo de análisis, pero no elimina la identificación, la revisión, las pruebas ni la trazabilidad. Después de estabilizar producción, `main` se sincroniza hacia `develop` para que la corrección vuelva a recorrer `staging` y permanezca en las versiones siguientes.
