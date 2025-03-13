
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'assets/time-for-break.mp3', 'assets/time-for-focus.mp3'],
      manifest: {
        name: 'FocusFlow',
        short_name: 'FocusFlow',
        description: 'Productivity timer with focus and break sessions',
        theme_color: '#8B5CF6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64',
            type: 'image/x-icon'
          }
        ]
      }
    })
  ].filter(Boolean),
  build: {
    cssCodeSplit: false,
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        index: "./src/content.tsx",
      },
      output: {
        entryFileNames: "index.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'styles.css';
          }
          return `assets/[name][extname]`;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
