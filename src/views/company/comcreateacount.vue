<template>
  <div class="input">
    <div>
      企業名*：
      <input type="text" v-model="comName" />
    </div>
    <div>
      メールアドレス*：
      <input type="text" v-model="comMail" />
    </div>
    <div>
      電話番号*：
      <input type="text" v-model="comPhone" />
    </div>
    <div>
      業種：
      <select v-model="comIndustry">
        <option>選択してください</option>
        <option>サービス業</option>
        <option>インフラ</option>
        <option>小売</option>
      </select>
    </div>
    <div>
      パスワード*（6文字以上）:
      <input type="text" v-model="comPassword" />
    </div>
    <br />
    <button @click="makeComAcount">登録</button>
    {{ message }}
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
              "パスワードかメールアドレスが適切ではない、もしくは既に登録されているメールアドレスです。"
          })
      } else {
        this.message = "必須項目を記入してください"
      }
    },
  },
}
</script>
