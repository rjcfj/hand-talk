<template>
  <header
    class="fixed top-0 left-0 w-full bg-white shadow-sm z-50 border-b border-gray-100"
  >
    <div
      class="max-w-6xl mx-auto flex justify-between items-center px-6 py-4"
    >
      <!-- Logo + Título -->
      <div class="flex items-center gap-3">
        <img
          src="/src/assets/handtalk-logo.png"
          alt="Logo"
          class="w-8 h-8"
        />
        <h1 class="text-xl font-semibold text-gray-900">
          <span class="text-[#ff6600]">Hand Talk</span>
          <span class="text-gray-700"> - Acessibilidade</span>
        </h1>
      </div>

      <!-- Menu -->
      <nav class="flex gap-8 text-sm font-medium">
        <RouterLink
          to="/"
          class="text-gray-700 hover:text-[#ff6600] transition-colors duration-200"
          active-class="text-[#ff6600] font-semibold"
        >
          Início
        </RouterLink>

        <RouterLink
          to="/analysis"
          class="text-gray-700 hover:text-[#ff6600] transition-colors duration-200"
          active-class="text-[#ff6600] font-semibold"
        >
          Análises
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* melhora o comportamento no hover para acessibilidade */
a {
  outline: none;
}
a:focus-visible {
  outline: 2px solid #ff6600;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
