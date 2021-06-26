<template>
  <div class="input_main">
    <h1 align="center" class="input_title">アカウント登録</h1>
    <div>
      <div class="input_content">
        ニックネーム：
        <input class="un" type="text" v-model="nickName" />
      </div>
      <div class="input_content">
        年齢：
        <input class="un" type="number" v-model="age" />
      </div>
      <div class="input_content">
        性別：
        <select class="un" v-model="gender">
          <option>選択してください</option>
          <option>男</option>
          <option>女</option>
          <option>どちらでもない</option>
        </select>
      </div>
      <div class="input_content">
        <button class="touroku_button" @click="makeAcount">登録</button>
      </div>
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
          point: 0,
        })
        .then(() => {
          this.$router.push("/maphome")
        })
    },
  },
}
</script>

<style>
/* html {
  background-color: #effbef;
  height: 100%;
  font-family: "Ubuntu", sans-serif;
} */
.input_main {
  background-color: white;
  border-radius: 1.5em;
  margin: 50px auto;
  width: 350px;
  height: 50%;
  box-shadow: 0px 11px 35px 2px rgb(0, 0, 0, 0.14);
}
.input_title {
  padding: 20px;
}
.input_content {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 10px;
}
.touroku_button {
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
