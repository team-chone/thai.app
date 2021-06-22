<template>
  <div>
    <h1>{{ pin_name }}のアンケート</h1>
    <router-link to="/maphome">戻る</router-link>
    <h2>{{ questionnaire_title }}</h2>
    <h3>残り{{ questionnaire_limit }}回</h3>
    <div v-for="(question, index) in questions" :key="question.id">
      <div>質問{{ index + 1 }}</div>
      {{ question.question_title }}
      <div v-if="question.question_type1 === 'ture'">必須

      </div> 
      <!-- <div v-else>

      </div> -->
      <div v-if="question.question_type2 === 'ture'">複数回答可能
        <div v-for="(question_select,i) in question.question_selects" :key="question_select.id">
          <input type="checkbox" :value="question_select" v-model="anser_question[index]"/>{{ question_select }}
        </div>
      </div>
      <div v-else>
        <div v-for="question_select in question.question_selects" :key="question_select.id">
          <input type="radio" :name="index" :value="question_select" v-model="anser_question[index]"/>{{ question_select }}
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
      // pin_id: this.$route.params.pin_id,
      // pin_name: this.$route.params.pin_name,
      pin_id:"3qfExAHVC1P4uxfERpVM",
      pin_name:"多摩高校",
      questionnaire_limit: "",
      questionnaire_title: "",
      // anser_multiple:[],
      anser_question:[],
      //anser_questions:[[]],
      questions:[],    
      user_age: "",
      user_gender:"",
      user_nickname:""
    }
  },
  methods: {
    sendQuesttionnaire() { //pinsのドキュメントのサブコレクションansersに回答を格納
      firebase.firestore().collection("pins").doc(this.pin_id).collection("ansers")
      .add({
        user_age:this.user_age,
        user_gender:this.user_gender,
        user_nickname:this.user_nickname,
        anser_question: this.anser_question
      })
      .then(()=>{

      })
      
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

      // firebase.firestore().collection("users").doc(this.$auth.currentUser.uid)
      // .get()
      // .then((doc)=>{
      //   this.user_age=doc.data().age
      //   this.user_gender=doc.data().gender
      //   this.user_nickname=doc.data().nickname
      // })
  },
}
</script>
