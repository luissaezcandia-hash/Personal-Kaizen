import { describe, it, expect } from 'vitest';
import { isContactOverdue } from './crm-utils';

describe('CRM Utilities', () => {
  it('should identify overdue contacts correctly', () => {
    const today = new Date('2026-05-19');
    
    // Weekly - Overdue (10 days ago)
    expect(isContactOverdue('2026-05-09', 'weekly', today)).toBe(true);
    
    // Weekly - Not Overdue (5 days ago)
    expect(isContactOverdue('2026-05-14', 'weekly', today)).toBe(false);
    
    // Monthly - Overdue (40 days ago)
    expect(isContactOverdue('2026-04-09', 'monthly', today)).toBe(true);
    
    // None frequency should never be overdue
    expect(isContactOverdue('2020-01-01', 'none', today)).toBe(false);
  });
});
