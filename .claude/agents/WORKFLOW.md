# Flujo de trabajo y aprobación del equipo

Este documento define las reglas de trabajo del equipo de agentes para este proyecto Astro.
**Todos los agentes deben leer y respetar estas reglas antes de actuar.**

---

## Regla fundamental

**Nunca se hace merge directo a `main`.**

Todo cambio, sin excepción, sigue este flujo:

```
rama feature → Pull Request → validación → aprobación humana → merge
```

El repositorio tiene protección de rama activa en GitHub que hace esto técnicamente imposible de saltarse, incluso para los propietarios del repo.

---

## Flujo completo de un cambio

### 1. Implementación
- El agente `developer` crea una rama con el patrón correcto (`feat/`, `fix/`, `chore/`...)
- Implementa el cambio y hace commit siguiendo Conventional Commits
- Hace push de la rama — **nunca push a main**

### 2. Validación previa al PR
El `orchestrator` decide qué agentes actúan según el impacto del cambio:

| Impacto | Agentes activos |
|---------|----------------|
| BAJO (textos, estilos) | developer → pr-validator |
| MEDIO (componentes, lógica) | developer → code-reviewer → pr-validator |
| ALTO (auth, APIs, deps) | developer → code-reviewer → test-runner → security-auditor → pr-validator |

### 3. Apertura del PR
- El agente `pr-validator` abre el PR contra `main` usando `gh pr create`
- El PR incluye descripción estructurada con contexto para el revisor humano
- **El PR queda en estado abierto — ningún agente lo mergea**

### 4. Validación automática en GitHub
Al abrir el PR, GitHub Actions ejecuta automáticamente:
- Build del proyecto (`npm run build`)
- Tests si están configurados

El merge está bloqueado hasta que estos checks pasen. Esto lo impone GitHub, no los agentes.

### 5. Aprobación humana (obligatoria)
- El propietario del repo revisa el PR en GitHub
- Si todo está correcto, aprueba el PR manualmente
- GitHub habilita el botón de merge solo tras la aprobación
- **Esta aprobación no puede ser simulada ni saltada por ningún agente**

### 6. Merge
- Lo ejecuta el humano desde GitHub
- GitHub comprueba que se cumplen todas las protecciones antes de permitirlo

### 7. Despliegue a staging
- Tras el merge, GitHub Actions despliega automáticamente a staging
- No requiere intervención manual

### 8. Despliegue a producción
- El humano lanza manualmente el workflow de producción desde GitHub Actions
- GitHub solicita aprobación adicional (environment protection)
- **Ningún agente puede lanzar ni aprobar el despliegue a producción**

---

## Lo que los agentes NUNCA deben hacer

- ✗ Push directo a `main` o `master`
- ✗ Merge de un PR (ni con `gh pr merge` ni con ningún otro comando)
- ✗ Aprobar un PR en nombre del usuario
- ✗ Lanzar el workflow de producción sin instrucción explícita del usuario
- ✗ Hacer bypass de las protecciones de rama

Si un agente recibe una instrucción que implique alguna de estas acciones,
debe negarse e informar al usuario de por qué no puede ejecutarla.

---

## Lo que los agentes SÍ hacen de forma autónoma

- ✓ Crear ramas y hacer commits
- ✓ Ejecutar validaciones (build, tests, lint, security)
- ✓ Abrir PRs con descripción estructurada
- ✓ Comentar en el PR con el resultado de las validaciones
- ✓ Lanzar el workflow de **staging** tras confirmación del usuario
- ✓ Informar al usuario cuando un PR está listo para su revisión

---

## Protecciones activas en el repositorio

Las siguientes protecciones están configuradas en GitHub sobre la rama `main`:

- **Require a pull request before merging** — push directo a main bloqueado
- **Require approvals (mínimo 1)** — merge requiere aprobación humana explícita
- **Require status checks to pass** — el build de CI debe pasar antes del merge
- **Do not allow bypassing** — estas reglas aplican a todos, sin excepciones

Estas protecciones las impone GitHub a nivel de repositorio.
Los agentes las respetan por instrucción, pero aunque no lo hicieran,
GitHub las haría cumplir igualmente.

---

## Mensaje al usuario cuando el PR está listo

Cuando el `pr-validator` termine, debe comunicar al usuario:

```
✅ PR abierto: [URL del PR]

Validaciones completadas:
- [resultado de cada agente activado]

Próximos pasos (acción humana requerida):
1. Revisa el PR en GitHub: [URL]
2. Comprueba que los checks de CI están en verde
3. Aprueba el PR si todo es correcto
4. Haz merge desde GitHub

Cuando el merge esté hecho, avísame si quieres que lance el despliegue a staging.
```
