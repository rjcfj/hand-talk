import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Analysis from "../pages/Analysis.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/analysis", component: Analysis },
  ],
});

export default router;
