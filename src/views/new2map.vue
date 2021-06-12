<template>
  <!-- <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6"> -->
  <div class="text-center">
    <!-- <logo />
        <vuetify-logo /> -->

    <!-- <v-card> -->
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
    <button v-on:click="nagasa">{{ nagasa }}</button>
    <!-- </v-card>
    </v-col>
  </v-row> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      maplocation: { lng: 0, lat: 0 },
      zoom: 16,
      i: 0,
      nagasa: "長さ",
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
      markers: [
        {
          title: "佐鳴湖",
          position: { lat: 34.7054595, lng: 137.6852776 },
          pinicon: {
            url: require("../image/blue-dot.png"),
            scaledSize: { width: 40, height: 40, f: "px", b: "px" },
            // animation: window.google.maps.Animation.DROP,
          },
        },
        {
          title: "浜名湖ガーデンパーク",
          position: { lat: 34.7140247, lng: 137.6032967 },
          pinicon: {
            url: require("../image/green-dot.png"),
            scaledSize: { width: 40, height: 40, f: "px", b: "px" },
          },
        },
      ],
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
      title: "現在地",
      position: this.maplocation,
      // animation: window.google.maps.Animation.DROP,
    })
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
        animation: window.google.maps.Animation.DROP,
      })
      this.i += 1
    },
    haversine_distance(mk1, mk2) {
      const R = 6371.071 // Radius of the Earth in kilometers
      const rlat1 = mk1.position.lat() * (Math.PI / 180)
      // Convert degrees to radians
      const rlat2 = mk2.position.lat() * (Math.PI / 180)
      // Convert degrees to radians
      const difflat = rlat2 - rlat1 // Radian difference (latitudes)
      const difflon =
        (mk2.position.lng() - mk1.position.lng()) * (Math.PI / 180) // Radian difference (longitudes)

      const d =
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
      return d
    },
    nagasa() {
      this.nagasa = "二つのマーカーを選んで"
    },
  },
}
</script>
