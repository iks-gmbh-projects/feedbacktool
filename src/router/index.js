import { createWebHistory, createRouter } from "vue-router";
import AppHome from './../components/AppHome.vue'
import UserComments from './../components/UserComments.vue'
import AdminView from './../components/AdminView.vue'

const routes = [
  {
    path: "/",
    name: "AppHome",
    component: AppHome,
  },
  {
    path: "/comments",
    name: "UserComments",
    component: UserComments,
  },
  {
    path: "/admin",
    name: "AdminView",
    component: AdminView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
