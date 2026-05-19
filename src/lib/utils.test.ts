import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleSupabaseError } from './utils';
import { toast } from 'sonner';

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('Kaizen Error Guard (handleSupabaseError)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error in tests
  });

  it('should trigger a toast with a generic message for unknown errors', () => {
    handleSupabaseError(null);
    expect(toast.error).toHaveBeenCalledWith('Error inesperado al comunicar con el servidor.');
    expect(console.error).toHaveBeenCalled();
  });

  it('should trigger a toast with the Error message if it is an instance of Error', () => {
    const testError = new Error('Test DB constraint failed');
    handleSupabaseError(testError);
    expect(toast.error).toHaveBeenCalledWith('Test DB constraint failed');
    expect(console.error).toHaveBeenCalledWith('[Supabase Error]:', testError);
  });

  it('should prioritize the customMessage if provided', () => {
    const testError = new Error('Original error');
    handleSupabaseError(testError, 'No se pudo guardar el contacto.');
    expect(toast.error).toHaveBeenCalledWith('No se pudo guardar el contacto.');
    expect(console.error).toHaveBeenCalledWith('[Supabase Error]:', testError);
  });

  it('should handle Supabase PostgrestError format gracefully', () => {
    // Supabase errors are usually plain objects, not instances of Error
    const supabaseError = { message: 'RLS policy violation', code: '42501', details: null, hint: null };
    handleSupabaseError(supabaseError);
    
    // We expect it to extract the message if possible, or fallback
    // In our designed implementation, we'll try to check if it's an object with a message property
    expect(toast.error).toHaveBeenCalledWith('RLS policy violation');
  });
});
