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
        :title="m.title"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        :icon="m.pinicon"
        :range="m.range"
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
          {{ marker.position }}
        </p>
      </GmapInfoWindow>
    </GmapMap>
    <button v-on:click="kyori">{{ search }}</button>
    <router-link to="/shopinformation">店の情報へ</router-link>
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
export default {
  data() {
    return {
      maplocation: { lng: 0, lat: 0 },
      zoom: 16,
      i: 0,
      search: "お店を探す",
      d: 0,
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
  async mounted() {
    const currentPosTmp = await this.getCurrentPosition()
    const currentPos = {
      lat: currentPosTmp.coords.latitude,
      lng: currentPosTmp.coords.longitude,
    }
    this.maplocation = currentPos
    this.markers.push({
      title: "mark0(現在地)",
      position: this.maplocation,
    })
    this.i += 1
  },
  methods: {
    getCurrentPosition() {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
    },
    onClickMarker(index, marker) {
      this.$refs.gmp.panTo(marker.position)
      this.infoWindowPos = marker.position
      this.marker = marker
      this.infoWinOpen = true
    },
    mark(event) {
      this.markers.push({
        title: "mark" + this.i,
        position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
        range: 150,
        pinicon: {
          url: require("../../image/green-dot.png"),
          scaledSize: { width: 40, height: 40, f: "px", b: "px" },
        },
      })
      this.i += 1
    },
    haversine_distance(a, b) {
      const R = 6371071 // Radius of the Earth in meters
      const rlat1 = (a.position.lat * Math.PI) / 180
      // Convert degrees to radians
      const rlat2 = b.position.lat * (Math.PI / 180)
      // Convert degrees to radians
      const difflat = rlat2 - rlat1 // Radian difference (latitudes)
      const difflon = (b.position.lng - a.position.lng) * (Math.PI / 180) // Radian difference (longitudes)

      this.d =
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
    kyori() {
      for (let j = 1; j <= this.i; j++) {
        this.haversine_distance(this.markers[j], this.markers[0])
        if (this.d < this.markers[j].range) {
          this.markers[j].pinicon = {
            url: require("../../image/blue-dot.png"),
            scaledSize: { width: 40, height: 40, f: "px", b: "px" },
          }
          console.log(j + "近い")
        } else {
          console.log(j + "遠い")
        }
      }
      console.log("owari")
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
