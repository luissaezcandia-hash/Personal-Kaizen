import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';

// Mock de dependencias
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

vi.mock('@/store/useStore', () => ({
  useStore: vi.fn(() => ({
    fetchData: vi.fn(),
  })),
}));

const TestComponent = () => {
  const { session, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return <div>{session ? 'Authenticated' : 'Guest'}</div>;
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería mostrar loading inicialmente', async () => {
    (supabase.auth.getSession as any).mockReturnValue(new Promise(() => {})); // Nunca resuelve
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('debería mostrar Guest si no hay sesión', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: null } });
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByText('Guest')).toBeInTheDocument());
  });

  it('debería mostrar Authenticated y llamar a fetchData si hay sesión', async () => {
    const mockSession = { user: { id: '123' } };
    const mockFetchData = vi.fn();
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: mockSession } });
    (useStore as any).mockReturnValue({ fetchData: mockFetchData });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('Authenticated')).toBeInTheDocument());
    expect(mockFetchData).toHaveBeenCalledTimes(1);
  });
});
