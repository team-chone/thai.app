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
              <li class="nav__item active">
                <img class="image" src="../../image/home.png" />
                <router-link to="/commaphome" class="media"
                  ><font color="#000000">ホーム</font></router-link
                >
              </li>
              <li class="nav__item">
                <img class="image" src="../../image/addpin.png" />
                <router-link to="/combuildpin" class="media"
                  ><font color="#000000">ピンを立てる</font></router-link
                >
              </li>
              <li class="nav__item">
                <img class="image" src="../../image/viewpin.png" />
                <router-link to="/compinview" class="media"
                  ><font color="#000000">ピンを見る</font></router-link
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
    <div class="page">
      <div class="page-title">
        <h1>ホーム画面</h1>
        <img src="../../image/home.png" width="10%" />
      </div>
    </div>
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
            <li><router-link to="/comacount">アカウント</router-link></li>
            <li><div @click="signOut">ログアウト</div></li>
            <li></li>
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
        :pin_type="m.pin_type"
        @click="onClickMarker(index, m)"
      />
      <GmapInfoWindow
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen = false"
      >
        <p style="color: #000">name: {{ name }}</p>
        <p>type:{{ type }}</p>
      </GmapInfoWindow>
    </GmapMap>
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
import firebase from "firebase"
export default {
  data() {
    return {
      ActiveBtn: false, //これだけハンバーガーバーの変数
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
      pin_company: "",
      marker: {},
      markers: [],
      infoOptions: {
        minWidth: 200,
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      name: "",
      type: "",
      infoWinOpen: false,
      infoWindowPos: null,
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
      pin_name: "現在地",
      pin_lat: this.maplocation.lat,
      pin_lng: this.maplocation.lng,
    })
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
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/")
        })
    },
    getCurrentPosition() {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
    },
    onClickMarker(index, marker) {
      this.infoWindowPos = { lat: marker.pin_lat, lng: marker.pin_lng }
      this.name = marker.pin_name
      this.type = marker.pin_type
      this.infoWinOpen = true
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
        //console.log(this.pin_company)
        console.log = this.pin_company
      })
  },
}
</script>

<style>
.page-title {
  text-align: center;
}
.image {
  margin-left: 33%;
  width: 50px;
  height: 50px;
}
/* ヘッダーの情報 */
.brand {
  font-weight: bold;
  font-size: 20px;
}

.site-header {
  position: relative;
  background-color: #ff5f17;
}

/* .site-header__middle {
  flex: 1;
} */

.site-header__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}
.media {
  text-decoration: none;
}
@media (min-width: 940px) {
  .site-header__wrapper {
    padding-top: 0;
    padding-bottom: 0;
  }
}
.nav {
  margin-left: 30rem;
  margin-right: 1rem;
}

@media (min-width: 940px) {
  .nav__wrapper {
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 939px) {
  .nav__wrapper {
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    z-index: -1;
    background-color: #d9f0f7;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-100%);
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  }
  .nav__wrapper.active {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 940px) {
  .nav__item:last-child a {
    border-right: 1px solid #222;
  }
}

@media (min-width: 1100px) {
  .nav__item {
    min-width: 140px;
    flex: 1;
  }
}

.nav__item a {
  display: block;
  padding: 1rem 1.25rem;
  border-left: 4px solid transparent;
}
@media (min-width: 940px) {
  .nav__item a {
    text-align: center;
    border-left: 1px solid #222;
    border-bottom: 4px solid transparent;
  }
}
.nav__item svg {
  display: inline-block;
  vertical-align: middle;
  width: 22px;
  height: 22px;
  margin-right: 1rem;
}
@media (min-width: 940px) {
  .nav__item svg {
    display: block;
    margin: 0 auto 0.5rem;
  }
}
.nav__item.active a {
  border-left-color: #222;
}
@media (min-width: 940px) {
  .nav__item.active a {
    border-bottom-color: #222;
  }
}
.nav__toggle {
  position: absolute;
  right: 1rem;
  top: 1rem;
}
@media (min-width: 940px) {
  .nav__toggle {
    display: none;
  }
}

.inactive-item {
  opacity: 0;
}
/* ヘッダーの情報ここまで */
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
.menu li:hover {
  font-weight: bold;
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
