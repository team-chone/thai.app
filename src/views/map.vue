<template>
  <div>
    <h1>Google Map</h1>

    <div ref="map" style="height: 500px; width: 100%" v-on:click="mark"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: "",
    }
  },

  mounted() {
    let script = document.createElement("script")
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCjk2DbCqIKkJA63AtCxHpx6HI72nB8mX8&callback=initMap"
    script.async = true
    document.head.appendChild(script)
    window.initMap = () => {
      this.map = new window.google.maps.Map(this.$refs.map, {
        center: this.myLatLng,
        zoom: 8,
      })
    }
    if (navigator.geolocation) {
      // callback関数内でthis使えないため
      let vm = this
      navigator.geolocation.getCurrentPosition(function (position) {
        let latlng = new window.google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        )
        vm.map = new window.google.maps.Map(vm.$refs["map"], {
          center: latlng,
          zoom: 16,
        })
        new window.google.maps.Marker({
          position: latlng,
          map: vm.map,
        })
      })
    }
  },
  methods: {
    mark(e) {
      let marklatlng = new window.google.maps.LatLng(e.latLng)
      new window.google.maps.Marker({
        position: marklatlng,
        map: this.map,
      })
      console.log(e.latlng)
    },
  },
}
</script>
