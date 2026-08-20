import { defineConfig } from "vitest/config"
import tailwindcss from "@tailwindcss/vite"
import vue from "@vitejs/plugin-vue"

// https://vite.dev/config/
export default defineConfig({
  base: "/tv-app-abn_amro/",
  plugins: [vue(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
})
