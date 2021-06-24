<template>
  <div class="input">
    <div>
      メールアドレス：
      <input type="text" v-model="comMail" />
    </div>
    <div>
      パスワード：
      <input type="text" v-model="comPassword" />
    </div>
    <br />
    <button @click="signIn">ログイン</button>
    {{ message }}
  </div>
</template>
<script>
import firebase from "firebase"

export default {
  data() {
    return {
      comMail: "",
      comPassword: "",
      message: "",
    }
  },
  methods: {
    signIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.comMail, this.comPassword)
        .then(() => {
          this.$router.push("/commaphome")
        })
        .catch(() => {
          this.message = "パスワードまたはメールアドレスが間違っています"
        })
    },
  },
}
</script>
