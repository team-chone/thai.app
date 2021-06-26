<template>
  <div>
    <h1>ウォレット</h1>
    <div>あなたの今のポイントは{{ user_point }}</div>
    <router-link to="/maphome">戻る</router-link>
  </div>
</template>
<script>
import firebase from "firebase"
export default {
  data() {
    return {
      user_point: "",
    }
  },
  mounted() {
    firebase
      .firestore()
      .collection("users")
      .doc(this.$auth.currentUser.uid)
      .get()
      .then((doc) => {
        this.user_point = doc.data().point
      })
  },
}
</script>
