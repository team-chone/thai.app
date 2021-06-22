<template>
  <div>
    <h1>ピンを見る</h1>

    <div>
      <div v-for="pin in companyPins">
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
            >アンケートを見る</router-link
          >|
          <router-link to="/comkeijibanview">掲示板を見る</router-link>
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
      company_name: "神奈川県", //company_nameは企業名と紐付ける必要あり。今はとりあえず「神奈川県」としている。
      companyPins: [],
    }
  },
  created() {
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
  },
}
</script>
