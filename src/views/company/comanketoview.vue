<template>
  <div>
    <header class="site-header">
      <div class="site-header__wrapper">
        <div class="site-header__start">
          <h1 class="brand">{{ pin_company }}アンケート</h1>
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

    <h1>{{ pin_name }}</h1>
    <div v-on:click="screenChange1" v-bind:class="change_style1">
      アンケートを作成する
    </div>
    <div v-on:click="screenChange2" v-bind:class="change_style2">
      アンケートを編集する
    </div>
    <div v-on:click="screenChange3" v-bind:class="change_style3">
      アンケートの結果をみる
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
export default {
  components: { comMakeQuestion, comEditQuestion, comAnalyzeQuestion },
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
      this.change_style1 = "style"
      this.change_style2 = "nonstyle"
      this.change_style3 = "nonstyle"
      firebase
        .firestore()
        .collection("pins")
        .doc(this.pin_id)
        .get()
        .then((doc) => {
          this.questionnaire_title = doc.data().questionnaire_title
          if (this.questionnaire_title === "") {
            this.screen_type = "1"
          } else {
            alert("一つのピンに設定できるアンケートは一つまでです")
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
.style {
  color: red;
}
.nonstyle {
  color: black;
}
</style>
