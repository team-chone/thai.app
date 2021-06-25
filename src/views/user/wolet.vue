<template>
  <div>
    <h1>ウォレット</h1>
    <div>あなたの今のポイントは{{ point }}</div>
    <router-link to="/maphome">戻る</router-link>
  </div>
</template>
<script>
export default {
  data() {
    return {
      point: "",
    }
  },
  mounted() {
    this.point = this.$auth.currentUser.point
  },
}
</script>
