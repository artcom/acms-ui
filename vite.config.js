import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 8081,
        open: true,
    },
    define: {
        'process.env': {},
        global: 'window', // Polyfill global if needed
    },
    resolve: {
        alias: {
        },
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
