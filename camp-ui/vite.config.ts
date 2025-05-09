/// <reference types="vitest" />
import {defineConfig} from "vite"
import react from "@vitejs/plugin-react"
import {VitePWA} from "vite-plugin-pwa"
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    base: "/camp-menu/",
    test: {
        environment: "jsdom",
        setupFiles: ["vite.setup.ts"],
        deps: {
            interopDefault: true,
        },
    },
    optimizeDeps: {
        exclude: ["camp-dsl"],
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                meals: resolve(__dirname, 'meals.html')
            }
        }
    },
    server: {
        fs: {
            strict: false,
        },
    },
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            workbox: {
                maximumFileSizeToCacheInBytes: 1024 * 1024 * 1024,
            },
            manifest: {
                name: "camp-menu",
                short_name: "camp-menu",
                description: "camp-menu",
                theme_color: "#FFFFE0",
                icons: [{
                    src: "pwa-64x64.png",
                    sizes: "64x64",
                    type: "image/png",
                }, {
                    src: "pwa-192x192.png",
                    sizes: "192x192",
                    type: "image/png",
                }, {
                    src: "pwa-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                }, {
                    src: "maskable-icon-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "maskable",
                }],
            },
        }),
    ],
})