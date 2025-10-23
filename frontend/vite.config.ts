// vite.config.ts na raiz
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    include: [
      "frontend/test/**/*.ts" // só pega os testes do frontend
    ],
    globals: true,
    environment: "jsdom",
  },
});
