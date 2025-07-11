import { defineConfig } from "vite";

export default defineConfig({
    server: {
        port: 5173,
        strictPort: true,
    },
    base: "/OneYearTogether/",
    build: {
        minify: false,
        sourcemap: true,
    },
});
