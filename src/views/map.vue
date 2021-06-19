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
      latlng: "",
      marklatlng: "",
    }
  },

  mounted() {
    let script = document.createElement("script")
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCjk2DbCqIKkJA63AtCxHpx6HI72nB8mX8&callback=initMap&libraries=&v=weekly"
    script.async = true
    document.head.appendChild(script)

    window.initMap = () => {
      if (navigator.geolocation) {
        // callback関数内でthis使えないため
        let vm = this
        navigator.geolocation.getCurrentPosition(function (position) {
          vm.latlng = new window.google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          )
          vm.map = new window.google.maps.Map(vm.$refs["map"], {
            center: vm.latlng,
            zoom: 16,
          })
          new window.google.maps.Marker({
            position: vm.latlng,
            map: vm.map,
            animation: window.google.maps.Animation.DROP,
          })
        })
      }
    }
  },
  methods: {
    get: async function (event) {
      this.marklatlng = await new window.google.maps.LatLng(
        event.latitude,
        event.longitude
      )
      return this.marklatlng
    },
    mark: async function (event) {
      let result = await this.get(event)
      new window.google.maps.Marker({
        position: result,
        map: this.map,
      })
      console.log(this.result)
      console.log(event.offsetX)
      this.map.panTo(this.result)
    },
  },
}
</script>
