import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/.well-known': {
            changeOrigin: true,
            // rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'https://authserver.yuansicloud.com/',
            ws: true,
          },
          '/api': {
            changeOrigin: true,
            // rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'https://api.guguhao.com/',
            ws: true,
          },
          '/connect': {
            changeOrigin: true,
            // rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'https://authserver.yuansicloud.com/',
            ws: true,
          },
        },
      },
    },
  };
});
