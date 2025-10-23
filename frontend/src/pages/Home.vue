<template>
  <div class="mt-28 max-w-3xl mx-auto">
    <div class="bg-white shadow-lg rounded-xl p-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">
        Analisar acessibilidade
      </h2>
      <p class="text-gray-600 mb-6">
        Insira uma URL abaixo para verificar problemas de acessibilidade:
      </p>

      <form @submit.prevent="analyze" class="flex flex-col gap-4">
        <input
          v-model="url"
          type="url"
          placeholder="https://exemplo.com"
          class="border border-gray-300 rounded-lg w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          required
        />
        <button
          type="submit"
          class="bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition"
          :disabled="loading"
        >
          <span v-if="!loading">Analisar</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Analisando...
          </span>
        </button>
      </form>

      <p v-if="message" class="mt-4 text-gray-700">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { io, Socket } from "socket.io-client";

const url = ref("");
const loading = ref(false);
const message = ref("");
const router = useRouter();
const apiUrl = import.meta.env.VITE_API_URL;

const socket: Socket = io(apiUrl); // URL do seu backend

socket.on("analysisStatus", (data) => {
  message.value = data.message;
});

const analyze = async () => {
  if (!url.value) return;

  loading.value = true;
  message.value = "";

  try {
    const response = await axios.post(`${apiUrl}/analyze`, { url: url.value });
    message.value = `Análise concluída! Foram encontrados ${response.data.total_issues} problemas.`;
    url.value = "";

    setTimeout(() => {
      router.push("/analysis");
    }, 1000);
  } catch (err: any) {
    message.value = err.response?.data?.error || "Erro ao analisar a página.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.bg-orange-500 {
  background-color: #ff6600;
}
.bg-orange-600 {
  background-color: #e65c00;
}
.focus\:ring-orange-500:focus {
  --tw-ring-color: #ff6600;
}
</style>
