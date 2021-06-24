<template>
  <div>
    <h1>ピンを立てる</h1>
    <router-link to="/commaphome">戻る</router-link> |
    <!-- <router-link to="/compininformation">ピン情報入力</router-link> -->
    <GmapMap
      ref="gmp"
      map-type-id="roadmap"
      :center="maplocation"
      :zoom="zoom"
      :style="styleMap"
      :options="mapOptions"
      @click="mark($event)"
    >
      <GmapMarker
        v-for="(m, index) in markers"
        :key="index"
        :pin_name="m.pin_name"
        :id="m.id"
        :position="{ lat: m.pin_lat, lng: m.pin_lng }"
        :clickable="true"
        :draggable="false"
        :icon="m.pinicon"
        :range="m.pin_range"
        :pin_type="m.pin_type"
      />
    </GmapMap>
    <!-- ピンを立てた時に出てくる情報入力画面 -->
    <div v-if="pinjouhou">
      <h1>ピン情報入力画面</h1>

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
        <label
          ><input type="radio" value="100" v-model="pin_range" />100m</label
        >
      </div>
      <button v-on:click="addPin">ピンを追加する</button>
    </div>
    <!-- ピンを立てた時に出てくる情報入力画面ここまで -->
  </div>
</template>
<script>
import firebase from "firebase"
export default {
  data() {
    return {
      maplocation: { lng: 0, lat: 0 },
      zoom: 16,
      styleMap: {
        width: "100%",
        height: "400px",
      },
      mapOptions: {
        streetViewControl: false,
        styles: [],
      },

      marker: {},
      markers: [],
      aopin: false,
      //ピン情報関係
      pinjouhou: false,
      pin_company: "神奈川県",
      pin_lat: "",
      pin_lng: "",
      pin_name: "",
      pin_type: "",
      pin_range: "",
      pins: [],
    }
  },
  async mounted() {
    const currentPosTmp = await this.getCurrentPosition()
    const currentPos = {
      lat: currentPosTmp.coords.latitude,
      lng: currentPosTmp.coords.longitude,
    }
    this.maplocation = currentPos
    this.markers.push({
      title: "mark0(現在地)",
      pin_lat: this.maplocation.lat,
      pin_lng: this.maplocation.lng,
    })
    //同じ会社のピンだけを追加
    firebase
      .firestore()
      .collection("pins")
      .where("pin_company", "==", this.pin_company)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          this.markers.push({
            id: doc.id,
            ...doc.data(),
            pinicon: {
              url: require("../../image/green-dot.png"),
              scaledSize: { width: 40, height: 40, f: "px", b: "px" },
            },
          })
        })
      })
  },
  methods: {
    getCurrentPosition() {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
    },
    // mark(event) {
    //   this.$router.push({
    //     name: "compininformation", //ピン情報入力画面に遷移
    //     params: {
    //       pinlat: event.latLng.lat(), //緯度、経度をそれぞれpinlat,pinlngで渡す
    //       pinlng: event.latLng.lng(),
    //     },
    //   })
    // },
    mark(event) {
      ;(this.pin_lat = event.latLng.lat()),
        (this.pin_lng = event.latLng.lng()),
        (this.pinjouhou = true)
      if (this.aopin) {
        this.markers.pop() //すでにピンを立てていれば取り除く
      }
      this.markers.push({
        //青ピンで新しいピンを追加
        pin_lat: this.pin_lat,
        pin_lng: this.pin_lng,
        pinicon: {
          url: require("../../image/blue-dot.png"),
          scaledSize: { width: 40, height: 40, f: "px", b: "px" },
        },
      })
      this.aopin = true
    },
    addPin() {
      //ピン情報をfirebase上のコレクションpinsに追加する
      const pin = {
        pin_company: this.pin_company,
        pin_lat: this.pin_lat,
        pin_lng: this.pin_lng,
        pin_name: this.pin_name,
        pin_type: this.pin_type,
        pin_range: this.pin_range,
        questionnaire_title: "", //アンケートがすでに設定されているかで場合分けする際に、questionnaire_title: ""という条件を使うため、このタイミングで登録
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
        this.aopin = false
        //追加したピンもあわせて表示
        firebase
          .firestore()
          .collection("pins")
          .where("pin_company", "==", this.pin_company)
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
              this.markers.push({
                id: doc.id,
                ...doc.data(),
                pinicon: {
                  url: require("../../image/green-dot.png"),
                  scaledSize: { width: 40, height: 40, f: "px", b: "px" },
                },
              })
            })
          })
      }
    },
  },
}
</script>
