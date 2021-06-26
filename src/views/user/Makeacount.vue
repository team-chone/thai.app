<template>
  <div>
    <h1>アカウント作成</h1>
    <div class="input">
      <div>
        ニックネーム：
        <input type="text" v-model="nickName" />
      </div>
      <div>
        年齢：
        <input type="number" v-model="age" />
      </div>
      <div>
        性別：
        <select v-model="gender">
          <option>選択してください</option>
          <option>男</option>
          <option>女</option>
          <option>どちらでもない</option>
        </select>
      </div>
      <br />
      <button @click="makeAcount">登録</button>
    </div>
  </div>
</template>
//とりあえず2種類作っておいた。すぐアカウント作成完了画面に行くけど間に足して
<script>
import firebase from "firebase"

export default {
  data() {
    return {
      nickName: "",
      age: "",
      gender: "",
      point: "",
    }
  },
  methods: {
    makeAcount() {
      firebase
        .firestore()
        .collection("users")
        .doc(this.$auth.currentUser.uid)
        .set({
          nickname: this.nickName,
          age: this.age,
          gender: this.gender,
          point: "",
        })
        .then(() => {
          this.$router.push("/maphome")
        })
    },
  },
}
</script>

<style>
/* .input {
  display: flex;
  flex-direction: column;
} */
</style>
