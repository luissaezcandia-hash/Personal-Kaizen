# Personal Kaizen | Sistema de Alto Rendimiento

**Personal Kaizen** no es solo un gestor de tareas; es un sistema de ingeniería personal basado en la filosofía de mejora continua y alto impacto. Está diseñado para centralizar objetivos estratégicos (OKRs), desglosarlos en acciones tácticas y mantener un feedback loop constante mediante rituales de descompresión.

## 🏗️ Stack Arquitectónico

- **Frontend:** React 19 (Functional Components + Hooks) con TypeScript.
- **Estado:** Zustand (Store centralizado en `src/store/useStore.ts`).
- **Persistencia:** Supabase (Backend-as-a-Service) con Row Level Security (RLS).
- **Estética:** Tailwind CSS + Radix UI (Atomic Design).
- **Runtime:** Vite con soporte PWA para capacidades offline.

## 🤖 Manual del Agente (Gentleman Standard)

Como agente operando en este repositorio, debés actuar como un **Senior Architect**. El código debe ser idiomatico, tipado estrictamente y seguir los patrones establecidos.

### 🎯 Reglas de Orquestación (Lightweight)
Siguiendo los estándares de `Gentleman.Dots`, operamos bajo el principio de **Delegación Total**:
- **Orquestador Ligero**: Mi rol principal es coordinar, trackear el estado del SDD y lanzar sub-agentes.
- **Delegación**: Tareas pesadas de lectura (4+ archivos), investigación profunda o implementaciones batch DEBEN delegarse a sub-agentes (`codebase_investigator`, `generalist`).
- **Contexto**: Mantener el hilo principal limpio. Cada respuesta debe ser quirúrgica y de alto impacto.

### 🧠 Memoria y Contexto (Engram)
Este proyecto utiliza **Engram** para persistencia de contexto entre sesiones.
- **Proactividad**: Guardá cada decisión arquitectónica, bug crítico o descubrimiento técnico usando `mem_save`.
- **Continuidad**: Consultá `mem_context` antes de proponer cambios estructurales.

### 🛠️ Flujo de Trabajo (SDD)
Para cambios sustanciales, se debe seguir el proceso de **Spec-Driven Development**:
1. `explore` -> `propose` -> `spec` -> `design` -> `tasks` -> `apply` -> `verify`.
2. Nunca escribas código de negocio sin una especificación técnica previa.


## 📁 Estructura del Sistema

```text
src/
├── components/      # Módulos de lógica y UI (Atomic Design)
│   ├── agenda/      # Time-blocking y eventos
│   ├── fitness/     # Registro de métricas físicas
│   ├── okr/         # Objetivos trimestrales y Key Results
│   └── relationships/ # CRM de contactos (Kanban)
├── store/           # Single source of truth (Zustand)
└── lib/             # Integraciones core (Supabase, Utils)
```

## 🚀 Comandos Críticos

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Iniciar entorno de desarrollo. |
| `npm run build` | Compilación de producción con chequeo de tipos. |
| `npm run lint` | Verificación de estándares de código. |

## 🔑 Configuración
El sistema depende de variables de entorno de Supabase configuradas en `.env.local`. No subas secretos al repositorio.
