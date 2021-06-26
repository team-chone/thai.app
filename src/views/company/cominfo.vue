<template>
  <div class="info_main">
    <h1>Mibetのご利用を検討されている方へ</h1>

    <P
      >Mibetで企業アカウント登録をしますと、マップ上の好きな地点にピンをたてることができ、
      付近の生活者宛にアンケートを取ったり、掲示板を通して様々な意見を受け取ることができます。
    </P>
    <div>
      <button class="touroku_button" @click="createAcount">
        企業アカウント作成
      </button>
    </div>
    <div>
      <button class="login_button" @click="logIn">ログイン</button>
    </div>
    <!-- <router-link to="/commaphome">管理者用</router-link> -->
  </div>
</template>
<script>
export default {
  methods: {
    createAcount() {
      this.$router.push("/comcreateacount")
    },
    logIn() {
      this.$router.push("/comlogin")
    },
  },
}
</script>

<style>
.info_main {
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
  width: 600px;
}
.login_button {
  margin: 10px;
  color: #ff5f17;
  background-color: white;
  cursor: pointer;
  border-radius: 1.5em;
  font-size: 15px;
  /* border: none; */
  padding: 5px 10px;
  font-weight: bold;
}
.touroku_button {
  margin: 10px;
  color: #fff;
  background: linear-gradient(to right, #ff5f17, #ff9872);
  cursor: pointer;
  border-radius: 1.5em;
  font-size: 15px;
  border: none;
  padding: 5px 10px;
}
</style>
