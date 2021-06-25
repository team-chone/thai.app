<template>
  <div class="input title">
    <h1>アカウント作成</h1>
    <div>
      <div class="input">
        ニックネーム：
        <input type="text" v-model="nickName" />
      </div>
      <div class="input">
        年齢：
        <input type="number" v-model="age" />
      </div>
      <div class="input">
        性別：
        <select v-model="gender">
          <option>選択してください</option>
          <option>男</option>
          <option>女</option>
          <option>どちらでもない</option>
        </select>
      </div>
      <div class="touroku input">
        <button @click="makeAcount">登録</button>
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
          point: "",
        })
        .then(() => {
          this.$router.push("/maphome")
        })
    },
  },
}
</script>

<style scoped>
.input {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 10px;
}
.title {
  font-family: ;
}
.touroku {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
