import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "e-bill-lilac.vercel.app/",
        changeOrigin: true,
        onProxyReq(proxyReq) {
          console.log(`Proxy request to: ${proxyReq.path}`);
        },
      },
    },
  },
  plugins: [react()],
});
