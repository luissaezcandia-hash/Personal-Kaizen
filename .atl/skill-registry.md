# Skill Registry | personal-kaisen

Este registro centraliza las capacidades del agente y los estándares del proyecto, alineados con el ecosistema **Gentleman-Skills**.

## User Skills (Global Triggers)
- **react-19**: Patrones modernos y uso del React Compiler.
- **zustand-5**: Gestión de estado atómica y optimizada.
- **vitest**: Infraestructura de testing nativa y rápida.
- **tailwind-4**: Estilado moderno y consistente.
- **typescript**: Tipado estricto y seguro.
- **github-pr**: Flujo de PRs con commits convencionales.

## Project Standards
- **GEMINI.md**: Manual del Agente, Arquitectura SDD y Engram.
- **SDD Flow**: explore -> propose -> spec -> design -> tasks -> apply -> verify.

## Compact Rules (Gentleman Curated)
### Arquitectura & UI
- **Atomic Design**: Componentes granulares y reutilizables en `src/components`.
- **Composition over Inheritance**: Priorizar la composición de componentes.
- **Tailwind 4**: Usar utilidades nativas, evitar clases redundantes.

### Lógica & Estado
- **Zustand 5**: Acceso selectivo al store (`useStore(state => state.X)`). Evitar re-renders innecesarios.
- **Supabase SDK**: Tipado estricto en todas las consultas y mutaciones.

### Calidad & Testing
- **Strict TDD**: Escribir el test antes que la lógica de negocio.
- **Clean Code**: Nombres descriptivos, funciones pequeñas, sin efectos secundarios ocultos.
- **Commits**: Seguir el estándar de Conventional Commits.
