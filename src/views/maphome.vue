<template>
  <div class="text-center">
    <h1>Google Map</h1>

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
          url: require("../image/green-dot.png"),
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
            url: require("../image/blue-dot.png"),
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
