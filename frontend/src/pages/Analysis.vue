<template>
  <div class="mt-24 max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8">
    <h2 class="text-2xl font-semibold text-gray-900 mb-6">
      Resultados de Análises
    </h2>

    <table class="min-w-full border-collapse border border-gray-200">
      <thead class="bg-gray-100 text-gray-700">
        <tr>
          <th class="border border-gray-200 px-4 py-2 text-left">URL</th>
          <th class="border border-gray-200 px-4 py-2">Problemas</th>
          <th class="border border-gray-200 px-4 py-2">Data</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="item in data" :key="item.id">
          <!-- linha principal -->
          <tr
            class="hover:bg-gray-50 cursor-pointer"
            @click="toggleDetails(item.id)"
          >
            <td class="border border-gray-200 px-4 py-2">{{ item.url }}</td>
            <td
              class="border border-gray-200 px-4 py-2 text-center font-semibold"
              :class="item.issues.length === 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ item.issues.length }}
            </td>
            <td class="border border-gray-200 px-4 py-2 text-center">
              {{ new Date(item.date).toLocaleString() }}
            </td>
          </tr>

          <!-- linha de detalhes -->
          <tr v-if="openIndex === item.id">
            <td colspan="3" class="bg-gray-50 p-4 border border-gray-200">
              <div v-if="item.issues.length === 0" class="text-green-600 font-medium">
                Nenhum problema detectado ✅
              </div>
              <ul v-else class="list-disc list-inside space-y-2">
                <li v-for="(issue, j) in item.issues" :key="j">
                  <span class="font-semibold">{{ issue.id }}</span> -
                  {{ issue.help }}
                  <span class="italic text-gray-500">({{ issue.impact }})</span>
                </li>
              </ul>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <p v-if="loading" class="mt-4 text-gray-600">Carregando análises...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

interface IssueNode {
  html: string;
  target: string[];
  failureSummary: string;
}

interface Issue {
  id: string;
  description: string;
  impact: string;
  help: string;
  nodes: IssueNode[];
}

interface AnalysisItem {
  id: string;
  url: string;
  issues: Issue[];
  date: string;
}

const data = ref<AnalysisItem[]>([]);
const loading = ref(false);
const openIndex = ref<string | null>(null);
const apiUrl = import.meta.env.VITE_API_URL;

const fetchResults = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${apiUrl}/results`);
    data.value = response.data;
  } catch (err) {
    console.error("Erro ao buscar resultados", err);
  } finally {
    loading.value = false;
  }
};

const toggleDetails = (id: string) => {
  openIndex.value = openIndex.value === id ? null : id;
};

onMounted(() => {
  fetchResults();
});
</script>
