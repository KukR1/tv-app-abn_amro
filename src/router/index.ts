import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue"),
    },
    {
      path: "/shows/:id",
      name: "show-details",
      component: () => import("../views/ShowDetailView.vue"),
      props: true,
    },
  ],
})

export default router
