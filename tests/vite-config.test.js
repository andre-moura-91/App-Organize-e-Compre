import { describe, expect, it } from 'vitest';
import config from '../vite.config.js';

describe('Vite configuration', () => {
  it('keeps the expected web root, build output, and development port', () => {
    expect(config.root).toBe('./');
    expect(config.build.outDir).toBe('dist');
    expect(config.server.port).toBe(5173);
  });
});
