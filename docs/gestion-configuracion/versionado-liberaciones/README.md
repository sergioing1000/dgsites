# Versionado y liberaciones del frontend

[Inicio](../README.md) · [CI](../elementos-configuracion/README.md) · [Baselines](../baselines/README.md) · [Control de cambios](../control-cambios/README.md) · [Trazabilidad](../trazabilidad/README.md) · [Roles](../roles-responsabilidades/README.md)

Las versiones estables del frontend siguen Semantic Versioning y se identifican mediante el formato `MAJOR.MINOR.PATCH`. Los tags publicados en GitHub constituyen el registro de las liberaciones. `package.json` y `package-lock.json` conservan la misma versión de proyecto y proporcionan el número de la primera liberación cuando todavía no existen tags.

## Incrementos de versión

| Componente | Cuándo se incrementa |
|---|---|
| `MAJOR` | Se introduce un cambio incompatible que exige coordinación o migración. |
| `MINOR` | Se agrega una capacidad compatible con el comportamiento existente. |
| `PATCH` | Se corrige un defecto sin introducir incompatibilidades. |

Mientras la versión sea `0.x.y`, un cambio que altere de forma incompatible el comportamiento controlado incrementará `MINOR`. Las correcciones compatibles incrementarán `PATCH`.

## Convención de tags

Cada liberación utiliza un tag anotado con el formato `vMAJOR.MINOR.PATCH`, por ejemplo `v0.1.0`. El tag debe:

- señalar un commit integrado en `main`;
- representar un cambio promovido previamente por `develop` y `staging`;
- crearse automáticamente después de que CI y el despliegue productivo de ese commit finalicen correctamente;
- conservarse como referencia inmutable de la liberación.

## Procedimiento

1. Integrar el cambio en `develop` mediante Pull Request y esperar un CI satisfactorio.
2. Promover `develop` hacia `staging` y validar el despliegue de preproducción.
3. Promover `staging` hacia `main` y verificar el CI.
4. Permitir que `deploy.yml` despliegue en producción la construcción verificada por CI.
5. Invocar `release.yml` después del despliegue productivo para crear el primer tag desde la versión del proyecto o calcular el siguiente incremento a partir de los Conventional Commits.
6. Publicar automáticamente el tag y el GitHub Release con el artefacto construido y su suma SHA-256.
7. Registrar la versión, el commit, las promociones, la baseline y las evidencias en la trazabilidad.

El workflow de liberación reutiliza el artefacto generado y verificado por CI. Si el despliegue productivo es satisfactorio, publica las notas generadas, el artefacto comprimido y su suma SHA-256. Una reejecución reutiliza el tag cuando ya identifica el mismo commit y evita reemplazar un tag asociado a otra revisión.

## Evidencia de liberación

El registro de una liberación debe incluir:

- versión y tag anotado;
- commit de `main` y Pull Request asociado;
- Pull Requests de promoción entre `develop`, `staging` y `main`;
- ejecución satisfactoria de CI y del despliegue y liberación de `Frontend CD`;
- enlace a la GitHub Release;
- artefacto y suma SHA-256;
- baseline sucesora, cuando corresponda;
- responsable que autorizó la liberación.

## Reversión

Los tags y las GitHub Releases publicadas no se reutilizan ni se reemplazan. Si una versión contiene un defecto, se restaura temporalmente el despliegue estable anterior cuando sea necesario y la corrección se entrega como una nueva versión `PATCH`. La trazabilidad conserva tanto la versión afectada como la versión correctiva.
