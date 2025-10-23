import { beforeAll, afterAll } from 'vitest';
import { config } from "@vue/test-utils";

// configurações globais de Vue Test Utils, se precisar
config.global.stubs = {};

// Exemplo: configuração global antes de testes
beforeAll(() => {
  console.log('Vitest setup global');
});

afterAll(() => {
  console.log('Vitest cleanup');
});
