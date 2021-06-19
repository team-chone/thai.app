import Vue from "vue"
import firebase from "firebase"
import "firebase/firestore"
import "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAwpb68VnP0XkOX_AehjN9-szI1wMHef8k",
  authDomain: "thai-ec214.firebaseapp.com",
  projectId: "thai-ec214",
  storageBucket: "thai-ec214.appspot.com",
  messagingSenderId: "378286030355",
  appId: "1:378286030355:web:cd76ee0708362da947c9e6",
  measurementId: "G-TC8JR6J8KE",
}

firebase.initializeApp(firebaseConfig)

const initialUserState = {
  uid: "",
  displayName: "",
  photoURL: "",
}
const $auth = Vue.observable({
  currentUser: { ...initialUserState },
})
firebase.auth().onAuthStateChanged((user) => {
  let state
  if (user) {
    const { uid, displayName, photoURL } = user
    state = {
      uid,
      displayName,
      photoURL,
    }
  } else {
    state = initialUserState
  }
  Object.assign($auth.currentUser, state)
})
Vue.prototype.$auth = $auth
