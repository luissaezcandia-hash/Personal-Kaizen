import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Limpiar el DOM después de cada test
afterEach(() => {
  cleanup();
});
