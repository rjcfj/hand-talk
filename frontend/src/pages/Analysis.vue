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
          <tr
            class="hover:bg-gray-50 cursor-pointer"
            @click="toggleDetails(item.id)"
          >
            <td class="border border-gray-200 px-4 py-2">{{ item.url }}</td>
            <td
              class="border border-gray-200 px-4 py-2 text-center font-semibold"
              :class="
                item.issues.length === 0 ? 'text-green-600' : 'text-red-600'
              "
            >
              {{ item.issues.length }}
            </td>
            <td class="border border-gray-200 px-4 py-2 text-center">
              {{ new Date(item.date).toLocaleString() }}
            </td>
          </tr>

          <tr v-if="openIndex === item.id">
            <td colspan="3" class="bg-gray-50 p-4 border border-gray-200">
              <div
                v-if="item.issues.length === 0"
                class="text-green-600 font-medium"
              >
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

    <!-- Paginação dinâmica -->
    <div class="mt-4 flex justify-between items-center">
      <div class="flex items-center">
        <button
          class="px-4 py-2 rounded-lg font-semibold bg-orange-500 text-white shadow-md hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 transition duration-200 ease-in-out"
          :disabled="page === 1 || loading"
          @click="changePage(page - 1)"
        >
          Anterior
        </button>

        <template v-for="p in dynamicPages" :key="p.key">
          <button
            v-if="p.type === 'page'"
            class="px-4 py-2 rounded-lg mx-1 font-medium transition duration-200 ease-in-out hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
            :class="
              p.number === page
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700'
            "
            @click="changePage(p.number)"
          >
            {{ p.number }}
          </button>
          <span v-else class="mx-1">…</span>
        </template>

        <button
          class="px-4 py-2 rounded-lg font-semibold bg-orange-500 text-white shadow-md hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 transition duration-200 ease-in-out"
          :disabled="page === totalPages || loading"
          @click="changePage(page + 1)"
        >
          Próxima
        </button>
      </div>

      <div>
        <label>
          Itens por página:
          <select
            v-model.number="limit"
            @change="changeLimit"
            class="ml-2 border rounded-lg px-3 py-1 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
          >
            <option v-for="n in [5, 10, 20, 50]" :key="n" :value="n">
              {{ n }}
            </option>
          </select>
        </label>
      </div>
    </div>

    <p v-if="loading" class="mt-4 text-gray-600">Carregando análises...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
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

const page = ref(1);
const limit = ref(5);
const totalPages = ref(1);
const totalItems = ref(0);

const fetchResults = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${apiUrl}/results`, {
      params: { page: page.value, limit: limit.value },
    });
    data.value = response.data.data;
    totalPages.value = response.data.totalPages;
    totalItems.value = response.data.total;
  } catch (err) {
    console.error("Erro ao buscar resultados", err);
  } finally {
    loading.value = false;
  }
};

const toggleDetails = (id: string) => {
  openIndex.value = openIndex.value === id ? null : id;
};

const changePage = (newPage: number) => {
  page.value = newPage;
};

const changeLimit = () => {
  page.value = 1; // reset página ao mudar limite
};

// Computa páginas dinâmicas com elipses
const dynamicPages = computed(() => {
  const pages = [];
  const maxDisplay = 5; // número máximo de páginas visíveis sem elipses
  if (totalPages.value <= maxDisplay) {
    for (let i = 1; i <= totalPages.value; i++)
      pages.push({ type: "page", number: i, key: i });
  } else {
    // sempre mostra primeira e última página
    pages.push({ type: "page", number: 1, key: 1 });

    let start = Math.max(2, page.value - 1);
    let end = Math.min(totalPages.value - 1, page.value + 1);

    if (start > 2) pages.push({ type: "dots", key: "dots-start" });
    for (let i = start; i <= end; i++)
      pages.push({ type: "page", number: i, key: i });
    if (end < totalPages.value - 1)
      pages.push({ type: "dots", key: "dots-end" });

    pages.push({
      type: "page",
      number: totalPages.value,
      key: totalPages.value,
    });
  }
  return pages;
});

watch([page, limit], () => {
  fetchResults();
});

onMounted(() => {
  fetchResults();
});
</script>
