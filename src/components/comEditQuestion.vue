<template>
  <div>
    <h2>アンケートの編集</h2>
    <div v-if="questionnaire_title === ''">
      <h3>このピンにアンケートは設定されていません</h3>
    </div>
    <div v-else>
      <h3>現在実施中のアンケート</h3>
      <h3>{{ questionnaire_title }}</h3>
      <h4>残り{{ questionnaire_remains }}回/{{ questionnaire_limit }}回</h4>
      <button v-on:click="deleteCheck">このアンケートを終了する</button>
      <div v-if="deleteAlert === 'ture'">
        本当に取り消して良いですか
        <button v-on:click="deleteQuestionnaire">はい</button>
        <button v-on:click="deleteCancel">いいえ</button>
      </div>
      <div v-for="(question, index) in questions" :key="question.id">
        <div>質問{{ index + 1 }}</div>
        {{ question.question_title }}
        <div v-if="question.question_type1 === 'ture'">必須</div>
        <div
          v-for="question_select in question.question_selects"
          :key="question_select.id"
        >
          {{ question_select }}
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
