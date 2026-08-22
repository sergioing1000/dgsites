# Versionado y liberaciones del frontend

[Inicio](../README.md) · [CI](../elementos-configuracion/README.md) · [Baselines](../baselines/README.md) · [Control de cambios](../control-cambios/README.md) · [Trazabilidad](../trazabilidad/README.md) · [Roles](../roles-responsabilidades/README.md)

Las versiones estables del frontend siguen Semantic Versioning y se identifican mediante el formato `MAJOR.MINOR.PATCH`. La versión declarada en `package.json` y `package-lock.json` es la fuente de referencia; ambos archivos deben conservar el mismo valor.

## Incrementos de versión

| Componente | Cuándo se incrementa |
|---|---|
| `MAJOR` | Se introduce un cambio incompatible que exige coordinación o migración. |
| `MINOR` | Se agrega una capacidad compatible con el comportamiento existente. |
| `PATCH` | Se corrige un defecto sin introducir incompatibilidades. |

Mientras la versión sea `0.x.y`, un cambio que altere de forma incompatible el comportamiento controlado incrementará `MINOR`. Las correcciones compatibles incrementarán `PATCH`.

## Convención de tags

Cada liberación utiliza un tag firmado con el formato `vMAJOR.MINOR.PATCH`, por ejemplo `v0.1.0`. El tag debe:

- coincidir con la versión de `package.json` y `package-lock.json`;
- señalar un commit integrado en `main`;
- representar un cambio promovido previamente por `develop` y `staging`;
- crearse después de que CI y el despliegue productivo de ese commit finalicen correctamente;
- conservarse como referencia inmutable de la liberación.

## Procedimiento

1. Determinar el incremento según el alcance aprobado.
2. Actualizar los manifiestos sin crear el tag: `npm version MAJOR.MINOR.PATCH --no-git-tag-version`.
3. Integrar el cambio en `develop` mediante Pull Request y esperar un CI satisfactorio.
4. Promover `develop` hacia `staging` y validar el despliegue de preproducción.
5. Promover `staging` hacia `main` y verificar CI y el despliegue productivo.
6. Crear el tag firmado sobre el commit integrado: `git tag -s vMAJOR.MINOR.PATCH -m "DGSITES Frontend vMAJOR.MINOR.PATCH"`.
7. Publicar el tag: `git push origin vMAJOR.MINOR.PATCH`.
8. Verificar que el workflow `Frontend Release` publique la GitHub Release.
9. Registrar la versión, el commit, las promociones, la baseline y las evidencias en la trazabilidad.

El workflow vuelve a instalar las dependencias, ejecutar las pruebas y construir la aplicación. Si las verificaciones son satisfactorias, publica las notas generadas, el artefacto comprimido y su suma SHA-256.

## Evidencia de liberación

El registro de una liberación debe incluir:

- versión y tag firmado;
- commit de `main` y Pull Request asociado;
- Pull Requests de promoción entre `develop`, `staging` y `main`;
- ejecución satisfactoria de CI, despliegues y `Frontend Release`;
- enlace a la GitHub Release;
- artefacto y suma SHA-256;
- baseline sucesora, cuando corresponda;
- responsable que autorizó la liberación.

## Reversión

Los tags y las GitHub Releases publicadas no se reutilizan ni se reemplazan. Si una versión contiene un defecto, se restaura temporalmente el despliegue estable anterior cuando sea necesario y la corrección se entrega como una nueva versión `PATCH`. La trazabilidad conserva tanto la versión afectada como la versión correctiva.
