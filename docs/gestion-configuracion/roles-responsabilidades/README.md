# Roles y responsabilidades

[Inicio](../README.md) · [CI](../elementos-configuracion/README.md) · [Baselines](../baselines/README.md) · [Control de cambios](../control-cambios/README.md) · [Trazabilidad](../trazabilidad/README.md) · [Versionado](../versionado-liberaciones/README.md)

Los roles describen responsabilidades dentro del proceso y no implican cargos exclusivos. Una persona puede asumir más de un rol según el cambio, siempre que se conserve la independencia mínima de revisión.

## Roles

| Rol | Responsabilidades principales |
|---|---|
| Responsable de configuración | Mantener el inventario de CI, administrar identificadores, verificar la trazabilidad y registrar las baselines. |
| Solicitante | Describir la necesidad, la justificación y los criterios esperados del cambio. |
| Desarrollador | Analizar el impacto técnico, implementar el alcance aprobado, preparar pruebas y documentar el resultado. |
| Revisor técnico | Evaluar diseño, código, dependencias, configuración, riesgos y mantenibilidad. |
| Verificador | Confirmar que se ejecutaron las pruebas exigidas y que el resultado satisface los criterios definidos. |
| Responsable funcional | Evaluar el efecto sobre las capacidades y aceptar los cambios visibles para el usuario. |
| Comité de Control de Cambios (CCB) | Decidir sobre cambios de alto impacto, conflictos de prioridad, desviaciones relevantes y modificaciones del contrato compartido. |

## Matriz RACI

`R` ejecuta la actividad, `A` responde por la decisión final, `C` aporta criterio y `I` recibe información.

| Actividad | Configuración | Solicitante | Desarrollador | Revisor | Verificador | Funcional | CCB |
|---|---|---|---|---|---|---|---|
| Registrar la solicitud | C | R | C | I | I | C | I |
| Identificar CI y baseline afectada | A/R | C | C | C | I | I | I |
| Analizar impacto y riesgo | C | C | R | C | C | C | A* |
| Decidir un cambio ordinario | C | I | C | A | C | C | I |
| Decidir un cambio de alto impacto | C | I | C | C | C | C | A/R |
| Implementar y documentar | I | I | A/R | C | C | I | I |
| Revisar técnicamente | I | I | C | A/R | C | I | I |
| Verificar resultados | I | I | C | C | A/R | C | I |
| Aceptar impacto funcional | I | C | C | C | C | A/R | I |
| Integrar y cerrar el cambio | A | I | R | C | C | C | I |
| Establecer baseline sucesora | A/R | I | C | C | C | C | I |

`A*` corresponde al CCB solamente cuando el impacto, el riesgo o la dependencia compartida justifican su intervención; en los demás casos la decisión se mantiene en la revisión ordinaria.

## Reglas de independencia

- El autor de un cambio no puede ser su único revisor ni su único verificador.
- Un CI de nivel alto requiere revisión técnica por otra persona y evidencia de verificación.
- Los cambios funcionales visibles requieren consulta o aceptación del responsable funcional.
- Los cambios de `CI-SH-API` requieren participación del responsable correspondiente del backend.
- La misma persona puede ejercer varios roles en un equipo pequeño, excepto cuando eso implique aprobar sin revisión independiente su propio trabajo.

## Intervención del CCB

El CCB participa cuando el cambio:

- Afecta varias capacidades críticas o varios CI de nivel alto.
- Modifica el contrato compartido con el backend.
- Introduce una desviación que se conservará en una baseline.
- Tiene riesgo elevado de pérdida de información, incompatibilidad o interrupción.
- Genera desacuerdo sobre alcance, prioridad, aceptación o reversión.

Para decidir un cambio de este tipo deben participar al menos dos personas y el autor no puede ser la única aprobación. La decisión, sus condiciones y los votos u observaciones relevantes se conservan en la solicitud o el Pull Request.
