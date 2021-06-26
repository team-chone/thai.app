<template>
  <div>
    <h1>{{ company_name }}</h1>
    <router-link to="/commaphome">ホーム</router-link>｜
    <router-link to="/combuildpin">ピンを立てる</router-link> |
    <router-link to="/compinview">ピンを見る</router-link>
    <h1>ピンを見る</h1>

    <div class="pin-list">
      <div v-for="(pin, index) in companyPins" :key="index">
        <div class="pin">
          <div>{{ pin.pin_name }}</div>
          <div>{{ pin.pin_type }}</div>
          <div>
            <router-link
              :to="{
                name: 'comanketoview',
                params: {
                  company_name: pin.company_name,
                  pin_id: pin.id,
                  pin_name: pin.pin_name,
                  pin_type: pin.pin_type,
                  pin_range: pin.pin_range,
                },
              }"
              >アンケート</router-link
            >|
            <router-link
              :to="{
                name: 'comkeijibanview',
                params: {
                  company_name: pin.company_name,
                  pin_id: pin.id,
                  pin_name: pin.pin_name,
                  pin_type: pin.pin_type,
                  pin_range: pin.pin_range,
                },
              }"
              >掲示板</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"
export default {
  data() {
    return {
      company_name: "", //company_nameは企業名と紐付ける必要あり。今はとりあえず「神奈川県」としている。
      companyPins: [],
    }
  },
  created() {
    firebase
      .firestore()
      .collection("companies")
      .doc(this.$auth.currentUser.uid)
      .get()
      .then((doc) => {
        this.company_name = doc.data().comname
        //console.log(this.company_name)
        firebase //pin_companyがcompany_nameと一致するpinを全て取得
          .firestore()
          .collection("pins")
          .where("pin_company", "==", this.company_name)
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
              this.companyPins.push({
                id: doc.id,
                ...doc.data(),
              })
            })
          })
      })
  },
}
</script>
<style scoped>
.pin-list {
  width: 90%;
  margin: 0 auto;
  background-color: #ff5f17;
  padding-bottom: 5%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.pin {
  width: 100%;
  background-color: #f3e2a9;
  margin-top: 5%;
}
</style>
