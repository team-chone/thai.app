<template>
  <div class="all">
    <header class="site-header">
      <div class="site-header__wrapper">
        <div class="site-header__start">
          <h1 class="brand">{{ pin_company }}</h1>
        </div>
        <div class="site-header__middle">
          <nav class="nav">
            <ul class="nav__wrapper">
              <div class="nav__item">
                <img class="image" src="../../image/home.png" />
                <router-link to="/commaphome" class="media"
                  ><font color="#000000">ホーム</font></router-link
                >
              </div>
              <div class="nav__item active">
                <img class="image" src="../../image/addpin2.png" />
                <router-link to="/combuildpin" class="media"
                  ><font color="#000000">ピンを立てる</font></router-link
                >
              </div>
              <div class="nav__item">
                <img class="image" src="../../image/viewpin.png" />
                <router-link to="/compinview" class="media"
                  ><font color="#000000">ピンを見る</font></router-link
                >
              </div>
            </ul>
          </nav>
        </div>
      </div>
    </header>
    <div class="page">
      <div class="page-title">
        <h1>ピンを立てる</h1>
        <img src="../../image/addpin2.png" width="5%" />
      </div>
    </div>
    <!-- <h1>{{ pin_company }}</h1>
    <router-link to="/commaphome">ホーム</router-link>｜
    <router-link to="/combuildpin">ピンを立てる</router-link> |
    <router-link to="/compinview">ピンを見る</router-link>
    <h1>ピンを立てる</h1>
    <router-link to="/commaphome">戻る</router-link> | -->
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
      <div class="pin-info">
        <input
          type="text"
          placeholder="ピンの名前の入力"
          v-model="pin_name"
          class="input-name"
        />
        <select v-model="pin_type" class="select-type">
          <option value="飲食">飲食</option>
          <option value="スーパー">スーパー</option>
          <option value="ショッピングセンター">ショッピングセンター</option>
          <option value="コンビニ">コンビニ</option>
          <option value="インフラ">インフラ</option>
          <option value="家具・家電">家具・家電</option>
          <option value="日用品・書籍・スポーツ">日用品・書籍・スポーツ</option>
          <option value="アパレル">アパレル</option>
          <option value="ホテル">ホテル</option>
          <option value="アミューズメント">アミューズメント</option>
        </select>
        <div class="select-range">
          <label
            ><input type="radio" value="10" v-model="pin_range" />10m</label
          >
          <label
            ><input type="radio" value="20" v-model="pin_range" />20m</label
          >
          <label
            ><input type="radio" value="30" v-model="pin_range" />30m</label
          >
          <label
            ><input type="radio" value="40" v-model="pin_range" />40m</label
          >
          <label
            ><input type="radio" value="50" v-model="pin_range" />50m</label
          >
          <label
            ><input type="radio" value="60" v-model="pin_range" />60m</label
          >
          <label
            ><input type="radio" value="70" v-model="pin_range" />70m</label
          >
          <label
            ><input type="radio" value="80" v-model="pin_range" />80m</label
          >
          <label
            ><input type="radio" value="90" v-model="pin_range" />90m</label
          >
          <label
            ><input type="radio" value="100" v-model="pin_range" />100m</label
          >
        </div>
      </div>
      <div class="button-box">
        <a v-on:click="addPin" class="btn-border">ピンを追加する</a>
      </div>
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
      pin_company: "",
      pin_lat: "",
      pin_lng: "",
      pin_name: "",
      pin_type: "",
      pin_range: "",
      pins: [],
    }
  },
  created() {
    //ページ遷移時にcompany_nameとfirebase上のcomnameを紐つけ
    firebase
      .firestore()
      .collection("companies")
      .doc(this.$auth.currentUser.uid)
      .get()
      .then((doc) => {
        this.pin_company = doc.data().comname
      })
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
<style>
.all {
  padding-bottom: 5%;
}
h1 {
  font-size: x-large;
  text-align: center;
}
.pin-info {
  background-color: white;
  margin: 0 auto;
  margin-bottom: 5%;
  width: 80%;
  box-shadow: 0px 11px 35px 2px rgb(0, 0, 0, 0.14);
  border-radius: 1.5em;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding-top: 2%;
  padding-bottom: 2%;
}
.input-name {
  width: 50%;
  margin: 0 auto;
  margin-bottom: 2%;
}
.select-type {
  width: 30%;
  margin: 0 auto;
  margin-bottom: 2%;
}
.button-box {
  display: flex;
  justify-content: center;
}
a.btn-border {
  margin-top: 2%;
  color: #ff5f17;
  border: 2px solid #ff5f17;
  border-radius: 0;
  background: #fff;
  padding: 5px 20px;
}

a.btn-border:hover {
  color: #fff;
  background: #ff5f17;
}
</style>
