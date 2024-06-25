import react from '@vitejs/plugin-react';
import { theme } from 'antd';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import tsConfigPaths from 'vite-tsconfig-paths';

import { token } from './src/config/themeConfig';

const { defaultAlgorithm, defaultSeed } = theme;

const mapToken = defaultAlgorithm(defaultSeed);

export const UI_VERSION = process.env.VERSION || 'development';
export const API_URL = process.env.API_URL || 'http://localhost:30081';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __UI_VERSION__: JSON.stringify(UI_VERSION)
  },
  build: {
    outDir: 'build',
    sourcemap: false
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: { ...mapToken, ...token }
      }
    }
  },
  plugins: [
    tsConfigPaths(),
    viteCompression(),
    react(),
    monacoEditorPlugin({
      customWorkers: [
        {
          label: 'yaml',
          entry: 'monaco-yaml/yaml.worker'
        }
      ]
    })
  ],
  server: {
    proxy: {
      '/akuity.io.kargo.service.v1alpha1.KargoService': {
        target: API_URL,
        changeOrigin: true
      }
    },
    port: 3333
  }
});
