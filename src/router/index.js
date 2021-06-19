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
  {
    path: "/shopinformation",
    name: "shopinformation",
    component: () => import("../views/shopinformation.vue"),
  },
  {
    path: "/shopanketo",
    name: "shopanketo",
    component: () => import("../views/shopanketo.vue"),
  },
  {
    path: "/shopkeijiban",
    name: "shopkeijiban",
    component: () => import("../views/shopkeijiban.vue"),
  },
  {
    path: "/comlogin",
    name: "comlogin",
    component: () => import("../views/comlogin.vue"),
  },
  {
    path: "/commaphome",
    name: "commaphome",
    component: () => import("../views/commaphome.vue"),
  },
  {
    path: "/combuildpin",
    name: "combuildpin",
    component: () => import("../views/combuildpin.vue"),
  },
  {
    path: "/compinview",
    name: "compinview",
    component: () => import("../views/compinview.vue"),
  },
  {
    path: "/compininformation",
    name: "compininformation",
    component: () => import("../views/compininformation.vue"),
  },
  {
    path: "/comanketoview",
    name: "comanketoview",
    component: () => import("../views/comanketoview.vue"),
  },
  {
    path: "/comkeijibanview",
    name: "comkeijibanview",
    component: () => import("../views/comkeijibanview.vue"),
  },
  {
    path: "/aboutmibet",
    name: "aboutmibet",
    component: () => import("../views/aboutmibet.vue"),
  },
  {
    path: "/acount",
    name: "acount",
    component: () => import("../views/acount.vue"),
  },
  {
    path: "/wolet",
    name: "wolet",
    component: () => import("../views/wolet.vue"),
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
