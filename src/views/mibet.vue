<template>
  <div>
    <h1>ホーム画面</h1>
    <button>アカウント作成</button>
    <router-link to="/login">ログイン</router-link>
    <button @click="check">確認</button>
  </div>
</template>
<script>
// import firebase from "firebase"

// export default {
// methods: {
//   logIn() {
//     const provider = new firebase.auth.GoogleAuthProvider()
//     firebase.auth().signInWithPopup(provider).then(
//       firebase.firestore().collection("users").doc(this.$auth.uid).set({
//         nicknamE: this.nickname
//         agE: this.age
//         gendeR: this.gender
//       })
//     )
//   },
// },
// }
export default {
  methods: {
    check() {
      if (this.$auth.currentUser) {
        console.log("ログインしてるよ")
      } else {
        console.log("ログインしてないよ")
      }
    },
  },
}
</script>
