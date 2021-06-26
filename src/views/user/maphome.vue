<template>
  <div class="text-center">
    <h1>Google Map</h1>
    <div id="app">
      <!--ハンバーガーメニューのボタン-->
      <div class="hamburger_btn" v-on:click="ActiveBtn = !ActiveBtn">
        <span
          class="line line_01"
          v-bind:class="{ btn_line01: ActiveBtn }"
        ></span>
        <span
          class="line line_02"
          v-bind:class="{ btn_line02: ActiveBtn }"
        ></span>
        <span
          class="line line_03"
          v-bind:class="{ btn_line03: ActiveBtn }"
        ></span>
      </div>
      <!--サイドバー-->
      <transition name="menu">
        <div class="menu" v-show="ActiveBtn">
          <ul>
            <li><router-link to="/acount">アカウント情報</router-link></li>
            <li><router-link to="/wolet">ウォレット</router-link></li>
            <li><div @click="signOut">ログアウト</div></li>
            <li><a href="#">(受信トレイ)</a></li>
          </ul>
        </div>
      </transition>
    </div>

    <GmapMap
      class="map"
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
        :canmove="false"
        :pin_type="m.pin_type"
        @click="onClickMarker(index, m)"
      />
      <GmapInfoWindow
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen = false"
      >
        <p style="color: #000">
          {{ marker.title }}
          {{ movebutton }}
        </p> </GmapInfoWindow
      ><button
        v-on:click="opensearch"
        class="btn-social-circle btn-social-circle--feedly"
      >
        <img src="../../image/green-dot.png" />
      </button>
    </GmapMap>
    <div class="button-wrapper">
      <button
        v-on:click="opensearch"
        class="btn-social-circle btn-social-circle--feedly"
      >
        <img src="../../image/green-dot.png" />
      </button>
      <!-- 範囲内のピンをクリックしたときに出てくる -->
      <div v-if="pagemove" class="input">
        <h2>{{ marker.pin_name }}</h2>
        <button v-on:click="toanketo">アンケートに答える</button>
        <button v-on:click="tokeijiban">掲示板</button>
      </div>
      <!-- 範囲内のピンをクリックしたときに出てくるここまで -->
      <!-- 条件を絞るを押したときに出てくる -->
      <div v-if="kensaku">
        店名<input type="text" v-model="tenmei" />
        <p>
          業種<select v-model="gyousyu_select">
            <option value="">指定なし</option>
            <option value="apparel">アパレル</option>
            <option value="restaurant">レストラン</option>
            <option value="others">その他</option>
          </select>
        </p>
        <button v-on:click="search">この条件で絞る</button>
      </div>
      <!-- 条件を絞るを押した時に出てくるここまで -->
    </div>
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
import firebase from "firebase"
export default {
  data() {
    return {
      maplocation: { lng: 0, lat: 0 },
      zoom: 16,
      pagemove: false, //範囲内のピンを選ぶとtrueになり移動の選択肢が出てくる
      movebutton: "範囲外のため答えられません",
      kensaku: false, //条件を絞るを押すとtrueになり、検索入力画面が出てくる
      tenmei: "",
      gyousyu_select: "",
      pin_id: "",
      pin_name: "",
      nagasa: 0,
      mk1: "",
      mk2: "",
      ActiveBtn: false,
      styleMap: {
        width: "100%",
        height: "400px",
      },
      mapOptions: {
        streetViewControl: false,
        styles: [],
      },
      infoOptions: {
        minWidth: 200,
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      infoWindowPos: null,
      infoWinOpen: false,
      marker: {},
      markers: [],
    }
  },
  //ページを開いた時の動作、範囲内のピンを判断するところまでしている
  async mounted() {
    const currentPosTmp = await this.getCurrentPosition()
    const currentPos = {
      lat: currentPosTmp.coords.latitude,
      lng: currentPosTmp.coords.longitude,
    }
    this.maplocation = currentPos
    this.markers.push({
      pin_name: "mark0(現在地)",
      pin_lat: this.maplocation.lat,
      pin_lng: this.maplocation.lng,
    })

    firebase
      .firestore()
      .collection("pins")
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

      .then(() => {
        this.kyori()
      })
  },

  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/")
        })
    },
    //現在地を取得する関数
    getCurrentPosition() {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
    },
    //ピンを押したときの関数
    onClickMarker(index, marker) {
      this.$refs.gmp.panTo({ lat: marker.pin_lat, lng: marker.pin_lng })
      this.infoWindowPos = { lat: marker.pin_lat, lng: marker.pin_lng }
      this.marker = marker
      if (this.marker.canmove) {
        this.infoWinOpen = false
        this.pagemove = true
        this.pin_id = this.marker.id
        this.pin_name = this.marker.pin_name
      } else {
        this.infoWinOpen = true
        this.pagemove = false
      }
    },

    //距離を測る関数,nagasa(メートル)で得られる。
    haversine_distance(a, b) {
      const R = 6371071 // Radius of the Earth in meters
      const rlat1 = (a.pin_lat * Math.PI) / 180
      // Convert degrees to radians
      const rlat2 = b.pin_lat * (Math.PI / 180)
      // Convert degrees to radians
      const difflat = rlat2 - rlat1 // Radian difference (latitudes)
      const difflon = (b.pin_lng - a.pin_lng) * (Math.PI / 180) // Radian difference (longitudes)

      this.nagasa =
        2 *
        R *
        Math.asin(
          Math.sqrt(
            Math.sin(difflat / 2) * Math.sin(difflat / 2) +
              Math.cos(rlat1) *
                Math.cos(rlat2) *
                Math.sin(difflon / 2) *
                Math.sin(difflon / 2)
          )
        )
    },

    //距離を比較して範囲内のものを見つける関数
    kyori() {
      for (let j = 1; j <= this.markers.length; j++) {
        this.haversine_distance(this.markers[j], this.markers[0])
        if (this.nagasa < this.markers[j].pin_range) {
          this.markers[j].pinicon = {
            url: require("../../image/blue-dot.png"),
            scaledSize: { width: 40, height: 40, f: "px", b: "px" },
          }
          this.markers[j].canmove = true
        } else {
          this.markers[j].pinicon = {
            url: require("../../image/green-dot.png"),
            scaledSize: { width: 40, height: 40, f: "px", b: "px" },
          }
          this.markers[j].canmove = false
        }
      }
    },
    //アンケートへを押したときの動作pin_idを渡す
    toanketo() {
      this.$router.push({
        name: "shopanketo", //アンケートページに遷移
        params: {
          pin_id: this.pin_id,
          pin_name: this.pin_name,
        },
      })
    },
    //掲示板へを押したときの動作pin_idを渡す
    tokeijiban() {
      this.$router.push({
        name: "shopkeijiban", //掲示板ページに遷移
        params: {
          pin_id: this.pin_id,
          pin_name: this.pin_name,
        },
      })
    },
    //条件を絞るを押したときの動作
    opensearch() {
      this.kensaku = true
    },
    //この条件で絞るを押したときの動作
    search() {
      this.markers = [] //一回配列を空にする
      //現在地のピンを立てる
      this.markers.push({
        pin_name: "mark0(現在地)",
        pin_lat: this.maplocation.lat,
        pin_lng: this.maplocation.lng,
      })
      //tenmei,gyousyu_selectのあるなしで場合分けしてそれぞれと一致するピンだけを取得する
      //tenmeiが完全一致になってるのが微妙
      if (this.tenmei !== "" && this.gyousyu_select !== "") {
        firebase
          .firestore()
          .collection("pins")
          .where("pin_name", "==", this.tenmei)
          .where("pin_type", "==", this.gyousyu_select)
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
          .then(() => {
            this.kyori()
          })
      } else if (this.tenmei == "" && this.gyousyu_select !== "") {
        firebase
          .firestore()
          .collection("pins")
          .where("pin_type", "==", this.gyousyu_select)
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
          .then(() => {
            this.kyori()
          })
      } else if (this.tenmei !== "" && this.gyousyu_select == "") {
        firebase
          .firestore()
          .collection("pins")
          .where("pin_name", "==", this.tenmei)
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
          .then(() => {
            this.kyori()
          })
      } else {
        firebase
          .firestore()
          .collection("pins")
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
          .then(() => {
            this.kyori()
          })
      }
    },
  },
}
</script>
<style>
.button-wrapper {
  text-align: center;
}
.btn-social-circle {
  z-index: 1;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  text-decoration: none;
  color: #fff;
  width: 50px;
  height: 50px;
  line-height: 30px;
  padding: 5px;
  font-size: 25px;
  border-radius: 50%;
  text-align: center;
  font-weight: bold;
  box-shadow: inset 0 2px 0px rgba(255, 255, 255, 0.25),
    inset 0 -2px 0px rgba(0, 0, 0, 0.18);
  transition: 0.2s;
}
.btn-social-circle .fa {
  line-height: 30px;
}
.btn-social-circle:hover {
  box-shadow: none;
}

.btn-social-circle--feedly {
  background: #ff5f17;
  border: solid 5px #ff5f17;
}
.input {
  position: relative;
  z-index: 1;
  display: inline-block;
  margin: 1em;
  max-width: 350px;
  width: calc(100% - 2em);
  vertical-align: top;
}

.input__field {
  position: relative;
  display: block;
  float: right;
  padding: 0.8em;
  width: 60%;
  border: none;
  border-radius: 0;
  background: #f0f0f0;
  color: #aaa;
  font-weight: bold;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-appearance: none; /* for box shadows to show on iOS */
}

.input__field:focus {
  outline: none;
}

.input__label {
  display: inline-block;
  float: right;
  padding: 0 1em;
  width: 40%;
  color: #6a7989;
  font-weight: bold;
  font-size: 70.25%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.input__label-content {
  position: relative;
  display: block;
  padding: 1.6em 0;
  width: 100%;
}

.graphic {
  position: absolute;
  top: 0;
  left: 0;
  fill: none;
}

.icon {
  color: #ddd;
  font-size: 150%;
}
.input--hoshi {
  overflow: hidden;
}

.input__field--hoshi {
  margin-top: 1em;
  padding: 0.85em 0.15em;
  width: 100%;
  background: transparent;
  color: #595f6e;
}

.input__label--hoshi {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 0 0.25em;
  width: 100%;
  height: calc(100% - 1em);
  text-align: left;
  pointer-events: none;
}

.input__label-content--hoshi {
  position: absolute;
}

.input__label--hoshi::before,
.input__label--hoshi::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 10px);
  border-bottom: 1px solid #b9c1ca;
}

.input__label--hoshi::after {
  margin-top: 2px;
  border-bottom: 4px solid red;
  -webkit-transform: translate3d(-100%, 0, 0);
  transform: translate3d(-100%, 0, 0);
  -webkit-transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
}

.input__label--hoshi-color-1::after {
  border-color: hsl(200, 100%, 50%);
}

.input__label--hoshi-color-2::after {
  border-color: hsl(160, 100%, 50%);
}

.input__label--hoshi-color-3::after {
  border-color: hsl(20, 100%, 50%);
}

.input__field--hoshi:focus + .input__label--hoshi::after,
.input--filled .input__label--hoshi::after {
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

.input__field--hoshi:focus + .input__label--hoshi .input__label-content--hoshi,
.input--filled .input__label-content--hoshi {
  -webkit-animation: anim-1 0.3s forwards;
  animation: anim-1 0.3s forwards;
}

@-webkit-keyframes anim-1 {
  50% {
    opacity: 0;
    -webkit-transform: translate3d(1em, 0, 0);
    transform: translate3d(1em, 0, 0);
  }
  51% {
    opacity: 0;
    -webkit-transform: translate3d(-1em, -40%, 0);
    transform: translate3d(-1em, -40%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: translate3d(0, -40%, 0);
    transform: translate3d(0, -40%, 0);
  }
}

@keyframes anim-1 {
  50% {
    opacity: 0;
    -webkit-transform: translate3d(1em, 0, 0);
    transform: translate3d(1em, 0, 0);
  }
  51% {
    opacity: 0;
    -webkit-transform: translate3d(-1em, -40%, 0);
    transform: translate3d(-1em, -40%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: translate3d(0, -40%, 0);
    transform: translate3d(0, -40%, 0);
  }
}

/*ボタン*/
.hamburger_btn {
  position: fixed; /*常に最上部に表示したいので固定*/
  top: 0;
  right: 0;
  width: 70px;
  height: 72px;
  cursor: pointer;
  z-index: 50;
}

.hamburger_btn .line {
  position: absolute;
  top: 0;
  left: 20px;
  width: 32px;
  height: 2px;
  background: #333333;
  text-align: center;
}

.hamburger_btn .line_01 {
  top: 16px;
  transition: 0.4s ease;
}
.hamburger_btn .line_02 {
  top: 26px;
  transition: 0.4s ease;
}
.hamburger_btn .line_03 {
  top: 36px;
  transition: 0.4s ease;
}

.btn_line01 {
  transform: translateY(10px) rotate(-45deg);
  transition: 0.4s ease;
}
.btn_line02 {
  transition: 0.4s ease;
  opacity: 0;
}
.btn_line03 {
  transform: translateY(-10px) rotate(45deg);
  transition: 0.4s ease;
}

/*サイドバー*/
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.4s;
}
.menu-enter,
.menu-leave-to {
  opacity: 0;
}
.menu-leave,
.menu-enter-to {
  opacity: 1;
}

.menu li {
  list-style: none;
  line-height: 1;
  padding: 1rem;
}
.menu {
  background-color: rgba(197, 197, 197, 0.671);
  z-index: 30;
  padding: 2rem 1rem;
  position: fixed;
  width: 20rem;
  height: 80rem;
  top: 0;
  right: 0;
}
.menu a {
  color: rgb(66, 66, 66);
  text-decoration: none;
  font-size: 1.2rem;
  padding: 0 2rem;
}
.menu ul {
  margin: 1rem;
  padding: 0;
}
</style>
