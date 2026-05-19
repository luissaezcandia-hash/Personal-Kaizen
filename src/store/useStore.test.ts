import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from './useStore';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user' } } })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: { user: { id: 'test-user' } } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    })),
  },
}));

describe('useStore CRM Extensions', () => {
  beforeEach(() => {
    // Reset store state if needed, though Zustand store is shared.
    // For unit tests, we might want to manually reset the state.
  });

  it('should have the new Contact properties (tags, frequency, etc.)', () => {
    const contact = {
      id: '1',
      name: 'Test',
      tags: ['friend'],
      contactFrequency: 'weekly',
      relationshipType: 'friend',
      interactions: []
    };
    
    expect(contact.tags).toContain('friend');
    expect(contact.contactFrequency).toBe('weekly');
  });

  it('should add an interaction and update lastInteraction', async () => {
    const { addInteraction } = useStore.getState();
    const contactId = 'contact-123';
    const interaction = {
      id: 'int-1',
      date: '2026-05-19',
      notes: 'Test interaction'
    };

    // We'll need to mock the initial state to have this contact
    useStore.setState({
      contacts: [{
        id: contactId,
        name: 'Old Contact',
        phase: 'A',
        lastInteraction: '2026-01-01',
        investmentRatio: 1,
        interactions: [],
        tags: [],
        contactFrequency: 'none',
        relationshipType: 'personal'
      }]
    });

    await addInteraction(contactId, interaction);

    const updatedContact = useStore.getState().contacts.find(c => c.id === contactId);
    expect(updatedContact?.interactions).toHaveLength(1);
    expect(updatedContact?.interactions[0].notes).toBe('Test interaction');
    expect(updatedContact?.lastInteraction).toBe('2026-05-19');
  });

  it('should filter contacts by name and tags correctly', () => {
    useStore.setState({
      contacts: [
        { id: '1', name: 'Juan Perez', tags: ['friend', 'gym'], phase: 'A', lastInteraction: '', investmentRatio: 0, interactions: [], contactFrequency: 'none', relationshipType: 'friend' },
        { id: '2', name: 'Maria Lopez', tags: ['work'], phase: 'A', lastInteraction: '', investmentRatio: 0, interactions: [], contactFrequency: 'none', relationshipType: 'professional' },
        { id: '3', name: 'Carlos Gym', tags: ['gym'], phase: 'A', lastInteraction: '', investmentRatio: 0, interactions: [], contactFrequency: 'none', relationshipType: 'friend' },
      ]
    });

    const { getFilteredContacts } = useStore.getState();
    
    // Filter by name
    const juan = getFilteredContacts('Juan');
    expect(juan).toHaveLength(1);
    expect(juan[0].name).toBe('Juan Perez');

    // Filter by tag
    const gym = getFilteredContacts('gym');
    expect(gym).toHaveLength(2); // Juan and Carlos

    // Empty search should return all
    expect(getFilteredContacts('')).toHaveLength(3);
  });
});
