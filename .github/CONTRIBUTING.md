# Contribución al frontend

Todo cambio debe asociarse con una solicitud `CR-FE-###` y desarrollarse en una rama independiente.

## Ramas

Las ramas permanentes representan ambientes y niveles de estabilidad:

- `develop`: integración de cambios aprobados para la siguiente versión.
- `staging`: candidato que se valida en preproducción.
- `main`: configuración estable, productiva y liberable.

Las ramas temporales utilizan:

- Nueva capacidad: `feature/CR-FE-###-descripcion`, creada desde `develop`.
- Corrección ordinaria: `fix/CR-FE-###-descripcion`, creada desde `develop`.
- Corrección urgente: `hotfix/CR-FE-###-descripcion`, creada desde `main`.

## Promoción

El flujo ordinario es:

```text
feature/fix -> develop -> staging -> main
```

Cada transición se realiza mediante Pull Request. Una corrección urgente se integra primero en `main`; después `main` se sincroniza hacia `develop` para que la corrección avance nuevamente a `staging`.

No se incorporan nuevas capacidades directamente en `staging` o `main`. La promoción conserva los commits ya verificados: no se reconstruye el cambio en otra rama.

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

Las transiciones admitidas son:

- `feature/*` o `fix/*` hacia `develop`.
- `develop` hacia `staging`.
- `staging` hacia `main`.
- `hotfix/*` hacia `main`.
- `main` hacia `develop` para sincronizar una corrección urgente.

Antes de solicitar revisión se debe comprobar que el cambio no incluya archivos ajenos a la solicitud y que las verificaciones aplicables tengan un resultado satisfactorio.

## Verificaciones del frontend

Antes de publicar una rama se ejecutan las mismas comprobaciones que utiliza CI:

```bash
npm ci --no-audit --no-fund
npm run lint
npm run test:coverage
npm run build
```

CI separa lint, pruebas y build para que cada error tenga una señal independiente. La cobertura global mínima es 65% para statements, branches, functions y lines; el reporte HTML se conserva como artefacto durante siete días.

Los pushes aprobados a `staging` y `main` despliegan exclusivamente el artefacto generado por CI. Después de publicarlo, CD comprueba la respuesta HTTP, el tipo de contenido y la presencia del elemento raíz de la aplicación. El release de producción solo se crea cuando esa comprobación termina correctamente.
