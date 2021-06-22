import Vue from "vue"
import VueRouter from "vue-router"
import firebase from "firebase"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "mibet",
    component: () => import("../views/mibet.vue"),
  },
  {
    path: "/comcreateacount",
    name: "comCreateAcount",
    component: () => import("../views/comcreateacount.vue"),
  },
  {
    path: "/comlogin",
    name: "comLogin",
    component: () => import("../views/comlogin.vue"),
  },
  {
    path: "/makeacount",
    name: "Makeacount",
    component: () => import("../views/Makeacount.vue"),
  },

  {
    path: "/otheracount",
    name: "otheracount",
    component: () => import("../views/otheracount.vue"),
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
    path: "/cominfo",
    name: "comInfo",
    component: () => import("../views/cominfo.vue"),
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

let isSignedIn = () => {
  return firebase.auth().currentUser
}

router.beforeEach((to, from, next) => {
  if (to.name !== "mibet" && !isSignedIn()) {
    next("/BeforeSignIn")
  } else {
    next()
  }
})

export default router
