<template>
  <div v-if="results.length">
    <div v-for="(r, idx) in results" :key="idx" class="mb-6 border p-4 rounded shadow">
      <h2 class="text-xl font-semibold mb-2">URL: {{ r.url }}</h2>
      <p>Total de issues: {{ r.total_issues || r.issues.length }}</p>

      <ul v-if="r.issues.length" class="mt-2">
        <li
          v-for="(issue, i) in r.issues"
          :key="i"
          class="mb-2 border-t pt-2"
        >
          <strong>{{ issue.id }}</strong> - {{ issue.impact }}<br />
          {{ issue.description }}<br />
          <em>{{ issue.help }}</em>
          <ul class="ml-4 mt-1">
            <li
              v-for="(node, j) in issue.nodes"
              :key="j"
            >
              <code>{{ node.html }}</code><br />
              Target: {{ node.target.join(', ') }}<br />
              {{ node.failureSummary }}
            </li>
          </ul>
        </li>
      </ul>

      <p v-else class="text-green-600">Nenhuma violação encontrada ✅</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ results: any[] }>()
</script>
