<template>
  <div>
    <div v-if="finished === 'false'">loading...</div>
    <div v-else>
      <h2>アンケート結果</h2>
      <h3>現在実施中のアンケート</h3>
      <h3>{{ questionnaire_title }}</h3>
      <div v-for="(question, index) in questions" :key="question.id">
        <div>質問{{ index + 1 }}</div>
        {{ question.question_title }}
        <div v-if="question.question_type1 === 'ture'">必須</div>
        <div
          v-for="(question_select, index2) in question.question_selects"
          :key="index2"
        >
          {{ question_select }}
          {{ question_percentage[index][index2] }}%
        </div>
        <!-- <div v-for="(question_result,i) in question_results">

      </div> -->
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
      question_results: [],
      anser_question_results: [],
      anser_question_results2: [],
      question_percentage: [],
      finished: "false",
    }
  },
  methods: {},

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
        for (let i = 0; i < this.questions.length; i++) {
          this.anser_question_results2[i] = []
          this.question_percentage[i] = []
        }
        firebase
          .firestore()
          .collection("pins")
          .doc(this.pin_id)
          .collection(this.questionnaire_title + "ansers")
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
              this.question_results.push({
                id: doc.id,
                ...doc.data(),
              })
            })
            for (let i = 0; i < this.question_results.length; i++) {
              this.anser_question_results.push(
                this.question_results[i].anser_question
              )
            }
            for (let x = 0; x < this.questions.length; x++) {
              for (let i = 0; i < this.anser_question_results.length; i++) {
                this.anser_question_results2[x][i] =
                  this.anser_question_results[i][x]
              }
            }
            for (let x = 0; x < this.questions.length; x++) {
              //console.log(this.questions[x].question_selects.length)
              for (
                let i = 0;
                i < this.questions[x].question_selects.length;
                i++
              ) {
                let a = this.questions[x].question_selects[i]
                //console.log(a)
                let count = 0
                for (
                  let y = 0;
                  y < this.anser_question_results2[x].length;
                  y++
                ) {
                  if (this.anser_question_results2[x][y] === a) {
                    count++
                  }
                }
                this.question_percentage[x][i] = Math.round(
                  (count / this.anser_question_results2[x].length) * 100
                )
              }
            }
            //console.log(this.question_percentage)
            this.finished = "true"
          })
      })
  },
}
</script>
