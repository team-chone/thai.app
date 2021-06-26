<template>
  <div class="text-center">
    <img class="mibet" src="../../image/MibetLogo2.png" />
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
    <div v-if="pagemove" class="button-wrapper">
      <h2>{{ marker.pin_name }}</h2>
      <button
        v-on:click="pagemovefalse"
        class="btn-social-circle btn-social-circle--feedly"
      >
        <img class="image2" src="../../image/fade.png" />
      </button>
      <a v-on:click="toanketo" class="btn-social-isometric">
        <span
          class="btn-social-isometric-icon btn-social-isometric-icon--feedly"
          ><img class="image" src="../../image/questionnaire2.png" />
          <!-- <i class="fa fa-rss"></i> -->
        </span>
        <span class="btn-social-isometric-text2">アンケート</span>
      </a>
      <a v-on:click="tokeijiban" class="btn-social-isometric">
        <span
          class="btn-social-isometric-icon btn-social-isometric-icon--feedly"
          ><img class="image" src="../../image/board2.png" />
          <!-- <i class="fa fa-rss"></i> -->
        </span>
        <span class="btn-social-isometric-text">掲示板</span>
      </a>
    </div>
    <div class="button-wrapper">
      <button
        v-on:click="opensearch"
        class="btn-social-circle btn-social-circle--feedly"
      >
        <img class="siborubutton" src="../../image/siborubutton.png" />
      </button>
      <!-- 範囲内のピンをクリックしたときに出てくる -->

      <!-- 範囲内のピンをクリックしたときに出てくるここまで -->
      <!-- 条件を絞るを押したときに出てくる -->
      <div v-if="kensaku" class="button-wrapper">
        <button
          v-on:click="kensakufalse"
          class="btn-social-circle btn-social-circle--feedly"
        >
          <img class="image2" src="../../image/fade.png" />
        </button>
        <a v-on:click="search" class="btn-social-isometric">
          <span
            class="btn-social-isometric-icon btn-social-isometric-icon--feedly"
            ><img class="image" src="../../image/siborubutton.png" />
            <!-- <i class="fa fa-rss"></i> -->
          </span>
          <span class="btn-social-isometric-text">検索</span>
        </a>
        <p>店名<input type="text" v-model="tenmei" /></p>

        <p>
          業種<select v-model="gyousyu_select">
            <option value="">指定なし</option>
            <option value="apparel">アパレル</option>
            <option value="restaurant">レストラン</option>
            <option value="others">その他</option>
          </select>
        </p>
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
    kensakufalse() {
      this.kensaku = false
    },
    pagemovefalse() {
      this.pagemove = false
    },
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
.mibet {
  width: 200px;
  height: auto;
}
.image2 {
  width: 70%;
  height: 70%;
}
.migihasi {
  top: 0;
  right: 0;
}
.image {
  margin-top: 8px;
  width: 33px;
  height: 33px;
}
.btn-social-isometric {
  display: flex;
  color: #484848;
  display: inline-block;
  height: 50px;
  font-size: 25px;
  line-height: 46px;
  background: #eaeef1;
  text-decoration: none;
  box-sizing: border-box;
  margin: 1em;
}
.btn-social-isometric-icon {
  display: inline-block;
  width: 50px;
  height: 50px;
  text-align: center;
  color: white;
}
.btn-social-isometric-icon i {
  line-height: 46px;
  font-size: 25px;
}
.btn-social-isometric-text {
  align-items: center;
  display: inline-block;
  width: 120px;
  height: 39.5px;
  text-align: center;
  border-bottom: solid 4px #dcdcdc;
}
.btn-social-isometric-text2 {
  align-items: center;
  display: inline-block;
  width: 150px;
  height: 39.5px;
  text-align: center;
  border-bottom: solid 4px #dcdcdc;
}
.btn-social-isometric-icon--feedly {
  background: #eaeef1;
  border-bottom: solid 4px #dcdcdc;
}

.btn-social-isometric:hover {
  -webkit-transform: translateY(4px);
  transform: translateY(4px);
}
.btn-social-isometric:hover .btn-social-isometric-text,
.btn-social-isometric:hover .btn-social-isometric-text2,
.btn-social-isometric:hover .btn-social-isometric-icon {
  border-bottom: none;
}
.siborubutton {
  width: 30px;
  height: 30px;
}
.button-wrapper {
  animation-name: fadedown;
  animation-duration: 2s;
  animation-iteration-count: 1;
  text-align: center;
}
@keyframes fadedown {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
