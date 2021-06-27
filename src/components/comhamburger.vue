<template>
  <div>
    <!--ハンバーガーメニューのボタン-->
    <div>
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
            <li>
              <router-link to="/comacount"
                ><img
                  src="../image/human.png"
                  width="8%"
                  class="hamlogo"
                />アカウント</router-link
              >
            </li>
            <li>
              <div @click="signOut">
                <img
                  src="../image/logout.png"
                  width="8%"
                  class="hamlogo"
                />ログアウト
              </div>
            </li>
            <li>
              <a href="#"
                ><img
                  src="../image/recieve.png"
                  width="8%"
                  class="hamlogo"
                />(受信トレイ)</a
              >
            </li>
            <li>
              <router-link to="/commaphome"
                ><font color="#000000"
                  ><img
                    src="../image/home.png"
                    width="8%"
                    class="hamlogo"
                  />ホーム</font
                ></router-link
              >
            </li>
            <li>
              <router-link to="/combuildpin"
                ><font color="#000000"
                  ><img
                    src="../image/addpin2.png"
                    width="8%"
                    class="hamlogo"
                  />ピンを立てる</font
                ></router-link
              >
            </li>
            <li>
              <router-link to="/compinview"
                ><font color="#000000"
                  ><img
                    src="../image/viewpin.png"
                    width="8%"
                    class="hamlogo"
                  />ピンを見る</font
                ></router-link
              >
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import firebase from "firebase"

export default {
  data() {
    return {
      ActiveBtn: false,
    }
  },
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/")
        })
    },
  },
}
</script>
<style>
.mibet {
  width: 200px;
  height: auto;
}
.logout_button {
  cursor: pointer;
}
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
.menu li:hover {
  font-weight: bold;
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
.hamlogo {
  margin-right: 5%;
}
</style>
