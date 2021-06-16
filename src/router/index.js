import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "mibet",
    component: () => import("../views/mibet.vue"),
  },
  {
    path: "/makeacount",
    name: "Makeacount",
    component: () => import("../views/Makeacount.vue"),
  },
  {
    path: "/googleacount",
    name: "googleacount",
    component: () => import("../views/googleacount.vue"),
  },
  {
    path: "/otheracount",
    name: "otheracount",
    component: () => import("../views/otheracount.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/maphome",
    name: "maphome",
    component: () => import("../views/maphome.vue"),
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
