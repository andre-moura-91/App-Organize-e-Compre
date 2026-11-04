import { describe, expect, it } from 'vitest';
import config from '../vite.config.js';

describe('Vite configuration', () => {
  it('keeps the expected web root, build output, and development port', () => {
    expect(config.root).toBe(process.cwd());
    expect(config.build.outDir).toBe('dist');
    expect(config.server.port).toBe(5173);
    expect(config.server.proxy['/api']).toBe('http://127.0.0.1:3000');
    expect(config.build.rollupOptions.input).toHaveLength(12);
  });
});
