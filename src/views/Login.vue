<template>
  <div>
    <h1>ログイン</h1>
    <button @click="logIn">ログイン</button>
  </div>
</template>
<script>
import firebase from "firebase"

export default {
  methods: {
    logIn() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(() => {
          this.$router.push("/maphome")
        })

      // .then(
      //   firebase.firestore().collection("users").doc(this.$auth.uid).set({
      //     nicknamE: "rekking"
      //   })
      // )
    },
  },
}
</script>
