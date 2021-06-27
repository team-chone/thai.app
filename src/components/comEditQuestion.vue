<template>
  <div>
    <h1>アンケートの編集</h1>
    <div v-if="questionnaire_title === ''">
      <h1>このピンにアンケートは設定されていません</h1>
    </div>
    <div v-else>
      <div class="questionnaire-title">
        <h1 class="title">{{ questionnaire_title }}</h1>
        <div class="questionnaire-info">
          <div>
            <h3>
              残り{{ questionnaire_remains }}回/{{ questionnaire_limit }}回
            </h3>
          </div>
          <div class="point-box">
            <h3>報酬：{{ questionnaire_point }}</h3>
          </div>
        </div>
      </div>
      <div class="button-box">
        <a v-on:click="deleteCheck" class="btn-border"
          >このアンケートを終了する</a
        >
      </div>

      <div v-if="deleteAlert === 'ture'" class="anim-box">
        <h3>本当に取り消して良いですか</h3>
        <div class="select-box">
          <button v-on:click="deleteQuestionnaire">はい</button>
          <button v-on:click="deleteCancel">いいえ</button>
        </div>
      </div>
      <div class="questions-box">
        <div
          v-for="(question, index) in questions"
          :key="question.id"
          class="question-box"
        >
          <div>質問{{ index + 1 }}</div>
          <div class="question-title">{{ question.question_title }}</div>
          <div v-if="question.question_type1 === 'ture'" class="must">必須</div>
          <div
            v-for="question_select in question.question_selects"
            :key="question_select.id"
          >
            □{{ question_select }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"
export default {
  data() {
    return {
      pin_id: String(this.$route.params.pin_id),
      pin_name: this.$route.params.pin_name,
      questionnaire_title: "",
      questionnaire_limit: "",
      questionnaire_remains: "",
      questions: [],
      deleteAlert: "false",
    }
  },
  methods: {
    deleteCheck() {
      //確認画面を表示
      this.deleteAlert = "ture"
    },
    deleteQuestionnaire() {
      //アンケートの取り消し
      this.deleteAlert = "false"
      firebase
        .firestore()
        .collection("pins")
        .doc(this.pin_id)
        .set(
          {
            questionnaire_title: "",
            questionnaire_limit: "",
            questionnaire_remains: "",
            questions: [],
          },
          { merge: true }
        )
        .then(() => {
          this.questionnaire_title = ""
          this.deleteAlert = "false"
        })
    },
    deleteCancel() {
      //確認画面でいいえを選択した時
      this.deleteAlert = "false"
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
        this.questionnaire_limit = doc.data().questionnaire_limit
        this.questionnaire_remains = doc.data().questionnaire_remains
        this.questions = doc.data().questions
      })
  },
}
</script>
<style scoped>
h1 {
  text-align: center;
  font-size: x-large;
}
h3 {
  font-size: large;
}
.questionnaire-info {
  /* width: 50%;
  margin: 0 auto; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.questionnaire-title {
  padding-top: 0.5%;
  background-color: white;
  margin: 0 auto;
  margin-bottom: 5%;
  width: 80%;
  box-shadow: 0px 11px 35px 2px rgb(0, 0, 0, 0.14);
  border-radius: 1.5em;
}
.questions-box {
  background-color: white;
  margin: 0 auto;
  width: 80%;
  box-shadow: 0px 11px 35px 2px rgb(0, 0, 0, 0.14);
  border-radius: 1.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1%;
  padding-bottom: 2%;
}
.question-box {
  width: 80%;
  margin: 0 auto;
  margin-top: 1%;
  border-bottom: medium solid #effbef;
}
.question-title {
  font-size: larger;
  font-weight: bold;
}
.must {
  font-size: small;
  color: red;
}
a.btn-border {
  margin-top: 2%;
  color: #ff5f17;
  border: 2px solid #ff5f17;
  border-radius: 0;
  background: #fff;
  padding: 5px 20px;
}
.button-box {
  display: flex;
  justify-content: center;
  margin-bottom: 5%;
}
a.btn-border:hover {
  color: #fff;
  background: #ff5f17;
}
.anim-box {
  background-color: #e6e6e6;

  box-shadow: 0px 11px 35px 2px rgb(0, 0, 0, 0.14);

  display: flex;
  flex-direction: column;
  text-align: center;
  padding-top: 2%;
  padding-bottom: 2%;

  width: 40%;

  position: fixed;
  top: 30%;
  right: 30%;
}
.select-box {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  font-size: large;
}
.anim-box.fadein.is-animated {
  animation: fadeIn 0.7s cubic-bezier(0.33, 1, 0.68, 1) 1 forwards;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
