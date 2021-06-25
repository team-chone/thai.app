<template>
  <div>
    <h2>アンケート結果</h2>
    <h3>現在実施中のアンケート</h3>
    <h3>{{ questionnaire_title }}</h3>
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
      <!-- <div v-for="(question_result,i) in question_results">

      </div> -->
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
      array: [],
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
            for (let i = 0; i < this.anser_question_results.length; i++) {
              this.anser_question_results2.push(
                this.anser_question_results[i][0]
              )
            }

            // for (let i = 0; i < this.anser_question_results[].length; i++) {
            //   for (let x = 0; x < this.anser_question_results[i].length; x++) {
            //     this.array.push(this.anser_question_results[x][i])
            //   }
            //   this.anser_question_results2[i] = this.array
            //   this.array = []
            // }
            // console.log(this.anser_question_results)
            console.log(this.anser_question_results2)
          })
      })
  },
}
</script>
