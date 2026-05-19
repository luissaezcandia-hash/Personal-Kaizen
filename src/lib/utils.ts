import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from 'sonner'
import type { PostgrestError } from '@supabase/supabase-js'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleSupabaseError(error: PostgrestError | Error | unknown, customMessage?: string): void {
  console.error('[Supabase Error]:', error);

  let extractedMessage = 'Error inesperado al comunicar con el servidor.';

  if (error instanceof Error) {
    extractedMessage = error.message;
  } else if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
    extractedMessage = (error as any).message;
  }

  const finalMessage = customMessage || extractedMessage;
  
  toast.error(finalMessage);
}
