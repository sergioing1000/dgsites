# Contribución al frontend

Todo cambio debe asociarse con una solicitud `CR-FE-###` y desarrollarse en una rama independiente.

## Ramas

- Nueva capacidad: `feature/CR-FE-###-descripcion`
- Corrección: `fix/CR-FE-###-descripcion`
- Corrección urgente: `hotfix/CR-FE-###-descripcion`

## Commits

Los mensajes siguen el formato:

```text
tipo(alcance opcional): descripción
```

Tipos admitidos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore` y `revert`.

Ejemplos:

```text
feat(config): centralizar URL del backend
test: actualizar pruebas del selector principal
ci: validar metadatos del pull request
```

## Pull Requests

El título utiliza el formato `CR-FE-###: Descripción del cambio`. La descripción debe indicar el alcance, los elementos de configuración afectados, las pruebas realizadas, los riesgos pendientes y la estrategia de reversión.

Antes de solicitar revisión se debe comprobar que el cambio no incluya archivos ajenos a la solicitud y que las verificaciones aplicables tengan un resultado satisfactorio.
