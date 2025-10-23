import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,       // habilita describe/it/expect globalmente
    environment: "node", // ambiente para testes backend
  },
});
