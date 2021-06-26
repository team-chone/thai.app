<template>
  <div class="input_main">
    <div class="input_content">
      メールアドレス：
      <input class="un" type="text" v-model="comMail" />
    </div>
    <div class="input_content">
      パスワード：
      <input class="un" type="text" v-model="comPassword" />
    </div>
    <div class="input_content">
      <button class="touroku_button" @click="signIn">ログイン</button>
    </div>
    <div class="error_message input content">
      {{ message }}
    </div>
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
          this.message = "※パスワードまたはメールアドレスが間違っています"
        })
    },
  },
}
</script>
<style>
.input_main {
  background-color: white;
  border-radius: 1.5em;
  margin: 50px auto;
  width: 350px;
  height: 50%;
  box-shadow: 0px 11px 35px 2px rgb(0, 0, 0, 0.14);
}
.error_message {
  color: red;
  margin: 10px;
}
.input_content {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 10px;
}
.touroku_button {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 10px;
  color: #fff;
  background: linear-gradient(to right, #ff5f17, #ff9872);
  cursor: pointer;
  border-radius: 1.5em;
  font-size: 15px;
  border: none;
  padding: 5px 10px;
}
.un {
  color: rgb(38, 50, 56);
  background: #ffefd5;
  border: 2px solid rgba(0, 0, 0, 0.02);
  border-radius: 20px;
}
</style>
