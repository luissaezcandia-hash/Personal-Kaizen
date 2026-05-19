import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContactProfile } from './ContactProfile';
import { useStore } from '@/store/useStore';

// Mock the store
vi.mock('@/store/useStore', () => ({
  useStore: vi.fn(),
}));

describe('ContactProfile', () => {
  const mockContact = {
    id: '1',
    name: 'Juan Perez',
    tags: ['gym'],
    lastInteraction: '2026-05-10',
    contactFrequency: 'weekly',
    relationshipType: 'friend',
    interactions: [{ id: 'i1', date: '2026-05-10', notes: 'Old note' }],
    instagram: '@juan',
    whatsapp: '+52123',
    birthday: '1990-01-01',
    notes: 'Likes pizza'
  };

  it('should render contact details correctly', () => {
    (useStore as any).mockReturnValue({
      addInteraction: vi.fn(),
    });

    render(<ContactProfile contact={mockContact as any} />);
    expect(screen.getByText('Perfil de Juan Perez')).toBeDefined();
    expect(screen.getByText('@juan')).toBeDefined();
    expect(screen.getByText('Likes pizza')).toBeDefined();
  });

  it('should allow adding a new interaction', async () => {
    const addInteractionMock = vi.fn();
    (useStore as any).mockReturnValue({
      addInteraction: addInteractionMock,
    });

    render(<ContactProfile contact={mockContact as any} />);
    
    const input = screen.getByPlaceholderText('¿De qué hablaron?');
    fireEvent.change(input, { target: { value: 'New interaction note' } });
    
    const button = screen.getByText('Registrar Interacción');
    fireEvent.click(button);

    expect(addInteractionMock).toHaveBeenCalledWith('1', expect.objectContaining({
      notes: 'New interaction note'
    }));
  });
});
