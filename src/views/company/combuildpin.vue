<template>
  <div>
    <h1>ピンを立てる</h1>
    <router-link to="/commaphome">戻る</router-link> |
    <router-link to="/compininformation">ピン情報入力</router-link>
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
      />
    </GmapMap>
  </div>
</template>
<script>
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
    mark(event) {
      this.$router.push({
        name: "compininformation", //ピン情報入力画面に遷移
        params: {
          pinlat: event.latLng.lat(), //緯度、経度をそれぞれpinlat,pinlngで渡す
          pinlng: event.latLng.lng(),
        },
      })
    },
  },
}
</script>
