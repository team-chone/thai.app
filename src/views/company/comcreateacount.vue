<template>
  <div class="input">
    <div>
      企業名：
      <input type="text" v-model="comName" />
    </div>
    <div>
      メールアドレス：
      <input type="text" v-model="comMail" />
    </div>
    <div>
      電話番号：
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
      パスワード：
      <input type="text" v-model="comPassword" />
    </div>
    <br />
    <button @click="makeComAcount">登録</button>
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
    }
  },
  methods: {
    makeComAcount() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.comMail, this.comPassword)
        .then((userCredential) => {
          const user = userCredential.user
          if (user) {
            console.log(user)
          }
        })
      //   firebase
      //     .firestore()
      //     .collection("companies")
      //     .doc(this.comName)
      //     .set({
      //       comphone: this.comPhone,
      //       commail: this.comMail,
      //       comindustry: this.comIndustry,
      //       compassword: this.comPassword,
      //     })
      //     .then(() => {
      //       this.$router.push("/commaphome")
      //     })
    },
  },
}
</script>
