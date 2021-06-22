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
            <li><a href="#">(受信トレイ)</a></li>
          </ul>
        </div>
      </transition>
    </div>

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
        </p>
      </GmapInfoWindow>
    </GmapMap>
    <button v-on:click="kyori">お店を探す</button>
    <button v-on:click="opensearch">条件を絞る</button>
    <!-- 範囲内のピンをクリックしたときに出てくる -->
    <div v-if="pagemove">
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
        console.log(this.markers)
        console.log(this.markers[0])
        console.log(this.markers[1])
        console.log(this.markers[1].pin_lat)
        this.kyori()
      })
  },

  methods: {
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
      console.log(this.nagasa)
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
