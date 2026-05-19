import { z } from 'zod';
import { generateObject } from 'ai';
import { ollama } from 'ai-sdk-ollama';

export const RefactorToolSchema = z.enum(['create_event', 'adjust_okr', 'add_routine']);

export const RefactorSuggestionSchema = z.object({
  id: z.string(),
  intent: z.string(),
  reasoning: z.string(),
  tool: RefactorToolSchema,
  params: z.any(),
});

export type RefactorSuggestion = z.infer<typeof RefactorSuggestionSchema>;

/**
 * System Prompt para el Asistente de Refactor Personal.
 * Basado en los principios de Gentleman Programming: Alto Rendimiento, Clean Code, y Mejora Continua.
 */
export const SYSTEM_PROMPT = `
Eres el Jefe de Operaciones (COO) de un sistema de alto rendimiento personal llamado KAIZEN.
Tu misión es analizar los logs diarios y los objetivos (OKRs) del usuario para proponer ajustes tácticos.

PRINCIPIOS:
1. "La verdad es lo que funciona. El resto es ruido."
2. Propón acciones concretas, no consejos vagos.
3. Si el usuario falla consistentemente en algo, sugiere un refactor de su agenda o metas.
4. Mantén un tono profesional, directo y desafiante (Senior Architect).

HERRAMIENTAS DISPONIBLES:
- create_event: Bloquear tiempo en la agenda para tareas críticas.
- adjust_okr: Ajustar valores de Key Results si son poco realistas o demasiado fáciles.
- add_routine: Añadir tareas recurrentes a las rutinas de salud o trabajo.

REGLAS DE SALIDA:
- Genera sugerencias que se traduzcan en una de las herramientas anteriores.
- Explica brevemente el razonamiento técnico detrás de cada propuesta.
`;

/**
 * Función real para analizar el rendimiento usando Ollama local.
 */
export const analyzePerformance = async (logs: any[], objectives: any[]): Promise<RefactorSuggestion[]> => {
  try {
    const { object } = await generateObject({
      model: ollama('llama3.2'), // Asegúrate de tener este modelo en Ollama
      schema: z.object({
        suggestions: z.array(RefactorSuggestionSchema)
      }),
      system: SYSTEM_PROMPT,
      prompt: `
        CONTEXTO ACTUAL:
        - Logs diarios recientes: ${JSON.stringify(logs.slice(0, 7))}
        - Objetivos (OKRs): ${JSON.stringify(objectives)}

        Analiza estos datos y propón refactors tácticos inmediatos.
      `,
    });

    return object.suggestions;
  } catch (error) {
    console.error('Error en el Estratega KAIZEN (Ollama):', error);
    return [];
  }
};
