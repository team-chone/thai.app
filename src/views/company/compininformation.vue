<template>
  <div>
    <h1>ピン情報入力画面</h1>
    <router-link to="/combuildpin">ピンを立てるへ</router-link> |
    <router-link to="/commaphome">戻る</router-link>

    <input type="text" placeholder="ピンの名前の入力" v-model="pin_name" />
    <select v-model="pin_type">
      <option value="restaurant">飲食</option>
      <option value="apparel">アパレル</option>
      <option value="cinema">映画館</option>
    </select>
    <div>
      <label><input type="radio" value="10" v-model="pin_range" />10m</label>
      <label><input type="radio" value="20" v-model="pin_range" />20m</label>
      <label><input type="radio" value="30" v-model="pin_range" />30m</label>
      <label><input type="radio" value="40" v-model="pin_range" />40m</label>
      <label><input type="radio" value="50" v-model="pin_range" />50m</label>
      <label><input type="radio" value="60" v-model="pin_range" />60m</label>
      <label><input type="radio" value="70" v-model="pin_range" />70m</label>
      <label><input type="radio" value="80" v-model="pin_range" />80m</label>
      <label><input type="radio" value="90" v-model="pin_range" />90m</label>
      <label><input type="radio" value="100" v-model="pin_range" />100m</label>
    </div>
    <button v-on:click="addPin">ピンを追加する</button>
  </div>
</template>

<script>
import firebase from "firebase"
export default {
  data() {
    return {
      pin_company: "",
      pin_lat: this.$route.params.pinlat,
      pin_lng: this.$route.params.pinlng,
      pin_name: "",
      pin_type: "",
      pin_range: "",
      pins: [],
    }
  },
  methods: {
    addPin() {
      //ピン情報をfirebase上のコレクションpinsに追加する
      const pin = {
        pin_company: this.pin_company,
        pin_lat: this.pin_lat,
        pin_lng: this.pin_lng,
        pin_name: this.pin_name,
        pin_type: this.pin_type,
        pin_range: this.pin_range,
      }
      if (
        //ピン情報入力に漏れがある場合はアラート
        this.pin_name === "" ||
        this.pin_type === "" ||
        this.pin_range === ""
      ) {
        alert("全ての項目を入力してください")
      } else {
        //ピン情報が全て入力できていればpinsにpinを追加
        firebase
          .firestore()
          .collection("pins")
          .add(pin)
          .then(() => {
            this.pins.push(pin)
          })
        this.pin_name = ""
        this.pin_type = ""
        this.pin_range = ""
      }
    },
  },
  created() {
    firebase
      .firestore()
      .collection("companies")
      .doc(this.$auth.currentUser.uid)
      .get()
      .then((doc) => {
        this.pin_company = doc.data().comname
      })
  },
}
</script>
