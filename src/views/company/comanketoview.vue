<template>
  <div>
    <header class="site-header">
      <div class="site-header__wrapper">
        <div class="site-header__start">
          <h1 class="brand">{{ pin_company }}</h1>
        </div>
        <div class="site-header__middle">
          <nav class="nav">
            <ul class="nav__wrapper">
              <div class="nav__item">
                <img class="image" src="../../image/home.png" />
                <router-link to="/commaphome" class="media"
                  ><font color="#000000">ホーム</font></router-link
                >
              </div>
              <div class="nav__item">
                <img class="image" src="../../image/addpin2.png" />
                <router-link to="/combuildpin" class="media"
                  ><font color="#000000">ピンを立てる</font></router-link
                >
              </div>
              <div class="nav__item active">
                <img class="image" src="../../image/viewpin.png" />
                <router-link to="/compinview" class="media"
                  ><font color="#000000">ピンを見る</font></router-link
                >
              </div>
            </ul>
          </nav>
        </div>
      </div>
    </header>
    <div class="page-title">
      <h1>{{ pin_name }}のアンケート</h1>
      <img src="../../image/questionnaire2.png" width="5%" />
    </div>
    <hamburger />
    <div class="select-box">
      <div v-on:click="screenChange1" v-bind:class="change_style1">
        アンケートを作成する
      </div>
      <div v-on:click="screenChange2" v-bind:class="change_style2">
        アンケートを編集する
      </div>
      <div v-on:click="screenChange3" v-bind:class="change_style3">
        アンケートの結果をみる
      </div>
    </div>

    <com-make-question v-if="screen_type === '1'"></com-make-question>
    <com-edit-question v-if="screen_type === '2'"></com-edit-question>
    <com-analyze-question v-if="screen_type === '3'"></com-analyze-question>
  </div>
</template>

<script>
import comMakeQuestion from "../../components/comMakeQuestion.vue"
import comEditQuestion from "../../components/comEditQuestion.vue"
import comAnalyzeQuestion from "../../components/comAnalyzeQuestion.vue"
import firebase from "firebase"
import Hamburger from "../../components/comhamburger.vue"
export default {
  components: {
    comMakeQuestion,
    comEditQuestion,
    comAnalyzeQuestion,
    Hamburger,
  },
  data() {
    return {
      pin_name: this.$route.params.pin_name,
      pin_id: this.$route.params.pin_id,
      screen_type: false,
      questionnaire_title: "",
      pin_company: "",
      change_style1: "nonstyle",
      change_style2: "nonstyle",
      change_style3: "nonstyle",
    }
  },
  methods: {
    screenChange1() {
      //表示されるコンポーネントの切り替え
      // this.change_style1 = "style"
      // this.change_style2 = "nonstyle"
      // this.change_style3 = "nonstyle"
      firebase
        .firestore()
        .collection("pins")
        .doc(this.pin_id)
        .get()
        .then((doc) => {
          this.questionnaire_title = doc.data().questionnaire_title
          if (this.questionnaire_title === "") {
            this.screen_type = "1"
            this.change_style1 = "style"
            this.change_style2 = "nonstyle"
            this.change_style3 = "nonstyle"
          } else {
            alert("一つのピンに設定できるアンケートは一つまでです")
            this.change_style1 = "nonstyle"
            this.change_style2 = "nonstyle"
            this.change_style3 = "nonstyle"
          }
        })
    },
    screenChange2() {
      this.change_style1 = "nonstyle"
      this.change_style2 = "style"
      this.change_style3 = "nonstyle"
      this.screen_type = "2"
    },
    screenChange3() {
      this.change_style1 = "nonstyle"
      this.change_style2 = "nonstyle"
      this.change_style3 = "style"
      this.screen_type = "3"
    },
  },
  created() {
    firebase
      .firestore()
      .collection("pins")
      .doc(this.pin_id)
      .get()
      .then((doc) => {
        this.questionnaire_title = doc.data().questionnaire_title
      })

    firebase
      .firestore()
      .collection("companies")
      .doc(this.$auth.currentUser.uid)
      .get()
      .then((doc) => {
        this.pin_company = doc.data().comname
        //console.log(this.pin_company)
      })
  },
}
</script>
<style scoped>
.page-title {
  text-align: center;
}

.image {
  margin-left: 33%;
  width: 50px;
  height: 50px;
}
/* ヘッダーの情報 */
.brand {
  font-weight: bold;
  font-size: 20px;
}

.site-header {
  position: relative;
  background-color: #ffc44d;
}

/* .site-header__middle {
  flex: 1;
} */

.site-header__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}
.media {
  text-decoration: none;
}
@media (min-width: 940px) {
  .site-header__wrapper {
    padding-top: 0;
    padding-bottom: 0;
  }
}
.nav {
  margin-left: 30rem;
  margin-right: 1rem;
}

@media (min-width: 940px) {
  .nav__wrapper {
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 939px) {
  .nav__wrapper {
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    z-index: -1;
    background-color: #d9f0f7;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-100%);
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  }
  .nav__wrapper.active {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 940px) {
  .nav__item:last-child a {
    border-right: 1px solid #222;
  }
}

@media (min-width: 1100px) {
  .nav__item {
    min-width: 140px;
    flex: 1;
  }
}

.nav__item a {
  display: block;
  padding: 1rem 1.25rem;
  border-left: 4px solid transparent;
}
@media (min-width: 940px) {
  .nav__item a {
    text-align: center;
    border-left: 1px solid #222;
    border-bottom: 4px solid transparent;
  }
}
.nav__item svg {
  display: inline-block;
  vertical-align: middle;
  width: 22px;
  height: 22px;
  margin-right: 1rem;
}
@media (min-width: 940px) {
  .nav__item svg {
    display: block;
    margin: 0 auto 0.5rem;
  }
}
.nav__item.active a {
  border-left-color: #222;
}
@media (min-width: 940px) {
  .nav__item.active a {
    border-bottom-color: #222;
  }
}
.nav__toggle {
  position: absolute;
  right: 1rem;
  top: 1rem;
}
@media (min-width: 940px) {
  .nav__toggle {
    display: none;
  }
}

.inactive-item {
  opacity: 0;
}
/* ヘッダーの情報ここまで */
h1 {
  text-align: center;
  font-size: x-large;
}
.select-box {
  margin-top: 5%;
  display: flex;
  width: 60%;
  margin: 0 auto;
  justify-content: space-around;
  align-items: center;
}
.style {
  display: inline-block;
  max-width: 180px;
  text-align: left;
  background-color: #facc2e;
  border: 2px solid #f5ecce;
  color: #fff;
  font-size: medium;
  text-decoration: none;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
}

.nonstyle {
  display: inline-block;
  max-width: 180px;
  text-align: left;
  border: 2px solid #facc2e;
  font-size: medium;
  color: #facc2e;
  text-decoration: none;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
  transition: 0.4s;
}

.nonstyle:hover {
  background-color: #facc2e;
  border-color: #f5ecce;
  color: #fff;
}
</style>
