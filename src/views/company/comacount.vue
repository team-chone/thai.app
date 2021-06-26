<template>
  <div class="input_main">
    <h1 align="center" class="input_title">企業アカウント更新</h1>
    <div class="input_content">
      企業名：{{ comName_now }}
      <input class="un" type="text" v-model="comName" />
    </div>
    <div class="input_content">
      電話番号：{{ comPhone_now }}
      <input class="un" type="text" v-model="comPhone" />
    </div>
    <div class="input_content">
      業種：{{ comIndustry_now }}
      <select class="un" v-model="comIndustry">
        <option>選択してください</option>
        <option>サービス業</option>
        <option>インフラ</option>
        <option>小売</option>
      </select>
    </div>
    <div class="input_content">
      <button class="touroku_button" @click="remakeComAcount">更新</button>
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
      comIndustry_now: "",
      comPhone_now: "",
      comName_now: "",
      comPhone: "",
      comName: "",
      comIndustry: "",
      message: "",
    }
  },
  methods: {
    remakeComAcount() {
      if ((this.comPhone, this.comName)) {
        firebase
          .firestore()
          .collection("companies")
          .doc(this.$auth.currentUser.uid)
          .set(
            {
              comname: this.comName,
              comphone: this.comPhone,
              comindustry: this.comIndustry,
            },
            {
              merge: true,
            }
          )
          .then(() => {
            window.location.reload()
          })
      } else {
        this.message = "※全項目を記入してください"
      }
    },
  },
  // watch(){
  //   this.nickName_now | this.age_now | this.gender_now : firebase

  // },
  mounted() {
    firebase
      .firestore()
      .collection("companies")
      .doc(this.$auth.currentUser.uid)
      .get()
      .then((doc) => {
        this.comName_now = doc.data().comname
        this.comPhone_now = doc.data().comphone
        this.comIndustry_now = doc.data().comindustry
      })
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
