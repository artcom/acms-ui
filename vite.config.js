import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 8081,
        open: true,
    },

    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
    },
    esbuild: {
        loader: "jsx",
        include: /src\/.*\.js?$/,
        exclude: [],
    },
});
