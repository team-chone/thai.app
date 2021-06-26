<template>
  <div class="input_main">
    <h1 align="center" class="input_title">企業アカウント登録</h1>
    <div class="input_content">
      企業名*：
      <input class="un" type="text" v-model="comName" />
    </div>
    <div class="input_content">
      メールアドレス*：
      <input class="un" type="text" v-model="comMail" />
    </div>
    <div class="input_content">
      電話番号*：
      <input class="un" type="text" v-model="comPhone" />
    </div>
    <div class="input_content">
      業種：
      <select class="un" v-model="comIndustry">
        <option>選択してください</option>
        <option>サービス業</option>
        <option>インフラ</option>
        <option>小売</option>
      </select>
    </div>
    <div class="input_content">
      パスワード*（6文字以上）:
      <input class="un" type="text" v-model="comPassword" />
    </div>
    <div class="input_content">
      <button class="touroku_button" @click="makeComAcount">登録</button>
    </div>
    <div class="input_content error_message">
      {{ message }}
    </div>
  </div>
</template>
<script>
import firebase from "firebase"

export default {
  data() {
    return {
      comPassword: "",
      comPhone: "",
      comMail: "",
      comName: "",
      comIndustry: "",
      message: "",
    }
  },
  methods: {
    makeComAcount() {
      if ((this.comPhone, this.comName)) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.comMail, this.comPassword)
          .then((userCredential) => {
            return firebase
              .firestore()
              .collection("companies")
              .doc(userCredential.user.uid)
              .set({
                comphone: this.comPhone,
                commail: this.comMail,
                comindustry: this.comIndustry,
                compassword: this.comPassword,
                comname: this.comName,
              })
          })
          .then(() => {
            this.$router.push("/commaphome")
          })
          .catch(() => {
            this.message =
              "※パスワードかメールアドレスが適切ではない、もしくは既に登録されているメールアドレスです。"
          })
      } else {
        this.message = "※必須項目を記入してください"
      }
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
.input_title {
  padding: 20px;
}
.error_message {
  color: red;
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
