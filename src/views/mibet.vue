<template>
  <div class="info_main">
    <div id="app">
      <div class="fade-in-bottom">
        <img src="../image/MibetLogo2.png" alt="" class="logo" />
      </div>

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
            <li><router-link to="/aboutmibet">サービス概要</router-link></li>
            <li><router-link to="/cominfo">企業の方へ</router-link></li>
          </ul>
        </div>
      </transition>
    </div>
    <div class="input_content">
      <button class="touroku_button" @click="createAcount">
        アカウント作成
      </button>
    </div>
    <!-- <div v-if="message1" class="error_message input_content">
      ※既にアカウントが存在します
    </div> -->
    <div class="input_content">
      <button class="login_button" @click="logIn">ログイン</button>
    </div>
    <!-- <div v-if="message2" class="error_message input_content">
      ※存在しないアカウントです。初めにアカウント登録をしてください。
    </div> -->
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
import firebase from "firebase"
export default {
  data() {
    return {
      ActiveBtn: false,
      // message1: false,
      // message2: false,
    }
  },
  methods: {
    createAcount() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          return firebase
            .firestore()
            .collection("users")
            .doc(result.user.uid)
            .get()
        })
        .then((doc) => {
          if (doc.exists) {
            // this.message1 = true
            alert("※既にアカウントが存在します")
          } else {
            this.$router.push("/makeacount")
          }
        })
    },
    logIn() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          return firebase
            .firestore()
            .collection("users")
            .doc(result.user.uid)
            .get()
        })
        .then((doc) => {
          if (doc.exists) {
            this.$router.push("/maphome")
          } else {
            alert(
              "※存在しないアカウントです。初めにアカウント登録をしてください。"
            )
          }
        })
    },

    // created: {
    //   check() {
    //     if (this.$auth.currentUser) {
    //       this.$router.push("/maphome")
    //     } else {
    //     }
    //   },
    // },
  },
}
</script>
<style>
html {
  background-color: #effbef;
  height: 100%;
  font-family: "Ubuntu", sans-serif;
}
.fade-in-bottom {
  opacity: 0;
  animation-name: fadein-bottom;
  animation-duration: 1.5s;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
}
@keyframes fadein-bottom {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.logo {
  display: flex;
  justify-content: center;
  width: 80%;
  margin: 0 auto;
}
.info_main {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-top: 20%;
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
.error_message {
  color: red;
}
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
