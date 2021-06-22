<template>
  <div>
    <h1>{{ shop_name }}のアンケート</h1>
    <router-link to="/maphome">戻る</router-link>
    <h2>{{ questionnaire_title }}</h2>
    <h3>残り{{ questionnaire_limit }}回</h3>
    <div v-for="(question, index) in questions">
      <div>質問{{ index + 1 }}</div>
      {{ question.question_title }}
      <div v-if="question.question_type1 === 'ture'">必須</div> 
      <div v-if="question.question_type2 === 'ture'">複数回答可能
        <div v-for="question_select in question.question_selects">
          <label><input type="checkbox" />{{ question_select }}</label>
        </div>
      </div>
      <div v-else>
        <div v-for="question_select in question.question_selects">
          <label><input type="radio" />{{ question_select }}</label>
        </div>
          
      </div>
    </div>
    <button v-on:click="sendQuesttionnaire">以上の内容でアンケートを送信</button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"
export default {
  data() {
    return {
      pin_id: "3qfExAHVC1P4uxfERpVM",
      shop_name: "多摩高校",
      questionnaire_limit: "",
      questionnaire_title: "",
      questions: "",
      ansers:[],
      questions:{},
    }
  },
  methods: {
    sendQuesttionnaire() {
      const anser = {
        user_id:"浦部蒼太",
        questions: this.questions
      }
    }
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
        this.questions = doc.data().questions
      })
  },
}
</script>
