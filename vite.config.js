import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: resolve('.'),
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: [
        'index.html',
        'src/pages/bem-vindo/saudacao.html',
        'src/pages/cadastro/cadastro.html',
        'src/pages/historico/historical.html',
        'src/pages/home/home.html',
        'src/pages/lista/lista.html',
        'src/pages/login/login.html',
        'src/pages/onboarding/onboarding-1.html',
        'src/pages/password/nova-senha.html',
        'src/pages/password/redefinir-senha.html',
        'src/pages/pre-lista/pre-lista.html',
        'src/pages/profile/perfil.html'
      ].map((page) => resolve(page))
    }
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
    open: true,
    proxy: {
      '/api': 'http://127.0.0.1:3000'
    }
  }
});
