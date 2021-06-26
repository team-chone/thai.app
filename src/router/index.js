import Vue from "vue"
import VueRouter from "vue-router"
// import firebase from "firebase"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "mibet",
    component: () => import("../views/mibet.vue"),
  },
  {
    path: "/makeacount",
    name: "makeacount",
    component: () => import("../views/user/makeacount.vue"),
  },
  {
    path: "/comcreateacount",
    name: "comCreateAcount",
    component: () => import("../views/company/comcreateacount.vue"),
  },
  {
    path: "/comlogin",
    name: "comLogin",
    component: () => import("../views/company/comlogin.vue"),
  },

  // {
  //   path: "/googleacount",
  //   name: "googleacount",
  //   component: () => import("../views/googleacount.vue"),
  // },
  // {
  //   path: "/otheracount",
  //   name: "otheracount",
  //   component: () => import("../views/otheracount.vue"),
  // },
  // {
  //   path: "/login",
  //   name: "Login",
  //   component: () => import("../views/user/login.vue"),
  // },
  {
    path: "/maphome",
    name: "maphome",
    component: () => import("../views/user/maphome.vue"),
  },
  // {
  //   path: "/shopinformation",
  //   name: "shopinformation",
  //   component: () => import("../views/user/shopinformation.vue"),
  // },
  {
    path: "/shopanketo",
    name: "shopanketo",
    component: () => import("../views/user/shopanketo.vue"),
  },
  {
    path: "/shopkeijiban",
    name: "shopkeijiban",
    component: () => import("../views/user/shopkeijiban.vue"),
  },
  {
    path: "/cominfo",
    name: "cominfo",
    component: () => import("../views/company/cominfo.vue"),
  },
  {
    path: "/commaphome",
    name: "commaphome",
    component: () => import("../views/company/commaphome.vue"),
  },
  {
    path: "/combuildpin",
    name: "combuildpin",
    component: () => import("../views/company/combuildpin.vue"),
  },
  {
    path: "/compinview",
    name: "compinview",
    component: () => import("../views/company/compinview.vue"),
  },
  {
    path: "/compininformation",
    name: "compininformation",
    component: () => import("../views/company/compininformation.vue"),
  },
  {
    path: "/comanketoview",
    name: "comanketoview",
    component: () => import("../views/company/comanketoview.vue"),
  },
  {
    path: "/comkeijibanview",
    name: "comkeijibanview",
    component: () => import("../views/company/comkeijibanview.vue"),
  },
  {
    path: "/aboutmibet",
    name: "aboutmibet",
    component: () => import("../views/user/aboutmibet.vue"),
  },
  {
    path: "/acount",
    name: "acount",
    component: () => import("../views/user/acount.vue"),
  },
  {
    path: "/wolet",
    name: "wolet",
    component: () => import("../views/user/wolet.vue"),
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

// let isSignedIn = () => {
//   return firebase.auth().currentUser
// }

// router.beforeEach((to, from, next) => {
//   if (to.name !== "mibet" && !isSignedIn()) {
//     next("/BeforeSignIn")
//   } else {
//     next()
//   }
// })

export default router
