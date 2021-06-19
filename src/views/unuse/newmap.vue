<template>
  <GmapMap
    ref="mapRef"
    :center="{ lat: 35.66606091, lng: 139.41392096 }"
    :zoom="16"
    map-type-id="terrain"
    style="width: 500px; height: 300px"
    @click="mapClick"
  >
    <GmapMarker
      v-for="marker in markers"
      v-bind:key="marker.id"
      :position="marker.position"
      :clickable="true"
      :draggable="true"
  /></GmapMap>
</template>
<script>
export default {
  data() {
    return {
      latlng: "",
      marklatlng: "",
      markers: [
        {
          id: 1,
          position: { lat: 35, lng: 35 },
        },
      ],
    }
  },

  mounted() {
    // let script = document.createElement("script")
    // script.src =
    //   "https://maps.googleapis.com/maps/api/js?key=AIzaSyCjk2DbCqIKkJA63AtCxHpx6HI72nB8mX8&callback=initMap&libraries=&v=weekly"
    // script.async = true
    // document.head.appendChild(script)

    if (navigator.geolocation) {
      // callback関数内でthis使えないため
      let vm = this
      navigator.geolocation.getCurrentPosition(function (position) {
        vm.latlng = new window.google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        )
        vm.map = new window.google.maps.Map(vm.$refs["mapRef"], {
          center: vm.latlng,
          zoom: 16,
        })
        new window.google.maps.Marker({
          position: vm.latlng,
          map: vm.mapRef,
          animation: window.google.maps.Animation.DROP,
        })
      })
    }
  },

  methods: {
    mapClick(event) {
      this.marklatlng = new window.google.maps.LatLng(
        event.latitude,
        event.longitude
      )

      new window.google.maps.Marker({
        position: this.marklatlng,
        map: this.terrain,
      })
      console.log(this.marklatlng)
      console.log(event.offsetX)
    },
  },
}
</script>
