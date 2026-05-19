import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CRMModule } from './CRMModule';
import { useStore } from '@/store/useStore';

// Mock the store
vi.mock('@/store/useStore', () => ({
  useStore: vi.fn(),
}));

describe('CRMModule', () => {
  it('should render the contact list initially', () => {
    (useStore as any).mockReturnValue({
      contacts: [{ id: '1', name: 'Juan Perez', tags: [], lastInteraction: '', contactFrequency: 'none', relationshipType: 'personal', interactions: [] }],
      getFilteredContacts: vi.fn(() => [{ id: '1', name: 'Juan Perez', tags: [], lastInteraction: '', contactFrequency: 'none', relationshipType: 'personal', interactions: [] }]),
    });

    render(<CRMModule />);
    expect(screen.getByText('Personal CRM')).toBeDefined();
    expect(screen.getByText('Juan Perez')).toBeDefined();
  });

  it('should switch to profile view when a contact is clicked', () => {
    (useStore as any).mockReturnValue({
      contacts: [{ id: '1', name: 'Juan Perez', tags: [], lastInteraction: '', contactFrequency: 'none', relationshipType: 'personal', interactions: [] }],
      getFilteredContacts: vi.fn(() => [{ id: '1', name: 'Juan Perez', tags: [], lastInteraction: '', contactFrequency: 'none', relationshipType: 'personal', interactions: [] }]),
    });

    render(<CRMModule />);
    const contactRow = screen.getByText('Juan Perez');
    fireEvent.click(contactRow);

    // After click, it should show the profile (we'll implement this logic)
    expect(screen.getByText('Perfil de Juan Perez')).toBeDefined();
  });
});
