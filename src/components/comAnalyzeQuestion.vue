<template>
  <div>
    <div v-if="finished === 'false'">loading...</div>
    <div v-else>
      <h1>アンケート結果</h1>
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
      <!-- <h3>{{ questionnaire_title }}</h3> -->
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
            v-for="(question_select, index2) in question.question_selects"
            :key="index2"
          >
            □{{ question_select }}
            <div class="graph">
              <span
                class="bar"
                v-bind:style="{
                  width: question_percentage[index][index2] + '%',
                }"
                >{{ question_percentage[index][index2] }}%</span
              >
            </div>
          </div>
        </div>
      </div>
      <!-- <div v-for="(question, index) in questions" :key="question.id">
        <div>質問{{ index + 1 }}</div>
        {{ question.question_title }}
        <div v-if="question.question_type1 === 'ture'">必須</div>
        <div
          v-for="(question_select, index2) in question.question_selects"
          :key="index2"
        >
          □{{ question_select }} {{ question_percentage[index][index2] }}%
        </div>
    
      </div>-->
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
  z-index: 1;
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
.graph {
  position: relative;
  width: 70%;
  border: 1px solid #207870;
  padding: 2px;
  margin-bottom: 2%;
}
.graph .bar {
  display: block;
  position: relative;
  background: #409890;
  text-align: center;
  color: #f0ffff;
  height: 2em;
  line-height: 2em;
}
.graph .bar span {
  position: absolute;
  left: 1em;
}
</style>
