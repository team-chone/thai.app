<template>
  <div>
    <hamburger />
    <div class="input_main">
      <h1 align="center" class="input_title">ウォレット</h1>
      <div>
        <span class="user_point">{{ user_point }}</span
        ><span class="user_point_p">p</span>
      </div>
      <div>
        <router-link to="/maphome">戻る</router-link>
      </div>
    </div>
  </div>
</template>
<script>
import firebase from "firebase"
import hamburger from "../../components/hamburger.vue"
export default {
  components: { hamburger },
  data() {
    return {
      user_point: "",
    }
  },
  mounted() {
    firebase
      .firestore()
      .collection("users")
      .doc(this.$auth.currentUser.uid)
      .get()
      .then((doc) => {
        this.user_point = doc.data().point
      })
  },
}
</script>
<style>
.input_main {
  background-color: white;
  border-radius: 1.5em;
  margin: 50px auto;
  width: 350px;
  height: 50%;
  box-shadow: 0px 11px 35px 2px rgb(0, 0, 0, 0.14);
  display: flex;
  align-items: center;
  flex-direction: column;
}
.input_title {
  padding: 10px;
}
.user_point_p {
  font-size: x-large;
}
.user_point {
  color: #ff5f17;
  font-size: 80px;
}
/* .input_content {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 10px;
} */
</style>
