/// <reference types="vitest" />
import {defineConfig} from 'vite'
import preact from '@preact/preset-vite'
import {VitePWA} from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/camp-menu/',
    test: {
        environment: "jsdom",
        setupFiles: ["vite.setup.ts"],
    },
    optimizeDeps:{
        exclude: ['camp-dsl']
    },
    server:{
        fs:{
            strict: false,
        },
    },
    plugins: [
        preact(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                maximumFileSizeToCacheInBytes: 1024 * 1024 * 1024,
            },
            manifest: {
                name: "camp-menu",
                short_name: 'camp-menu',
                description: "camp-menu",
                theme_color: "#FFFFE0",
                icons: [{
                    src: "pwa-64x64.png",
                    sizes: "64x64",
                    type: "image/png"
                }, {
                    src: "pwa-192x192.png",
                    sizes: "192x192",
                    type: "image/png"
                }, {
                    src: "pwa-512x512.png",
                    sizes: "512x512",
                    type: "image/png"
                }, {
                    src: "maskable-icon-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "maskable"
                }]
            }
        })
    ],
})
