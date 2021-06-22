<template>
  <div>
    <h1>{{ pin_name }}</h1>

    <router-link to="/compinview">戻る</router-link> |
    <router-link to="/comkeijibanview">掲示板を見る</router-link>
    <div>
      <h2>アンケートの新規作成</h2>
      <p>アンケートの題名を入力</p>
      <input type="text" v-model="questionnaire_title" />
      <p>回答数の上限を設定</p>
      <input type="number" v-model="questionnaire_limit" />
      <div v-for="(question, index) in questions">
        <div>質問{{ index + 1 }}</div>
        <div>{{ question.question_title }}</div>
        <div v-if="question.question_type1 === 'ture'">必須</div>
        <div v-if="question.question_type2 === 'ture'">複数回答可能</div>
        <div v-for="select in question.question_selects">
          <div>{{ select }}</div>
        </div>
        <div v-on:click="deleteQuestion(index)">消去</div>
      </div>
      <p>質問の作成</p>
      <div>
        <p>質問の本文入力</p>
        <input type="text" v-model="question_title" />
        <p>回答必須の質問であるか</p>
        <div>
          <label
            ><input
              type="radio"
              value="ture"
              v-model="question_type1"
            />必須</label
          >
          <label
            ><input
              type="radio"
              value="false"
              v-model="question_type1"
            />必須でない</label
          >
        </div>
        <p>複数回答可能であるか</p>
        <label
          ><input
            type="radio"
            value="ture"
            v-model="question_type2"
          />可能</label
        >
        <label
          ><input
            type="radio"
            value="false"
            v-model="question_type2"
          />不可能</label
        >
        <div v-for="(select, index) in selects">
          {{ select }}
          <div v-on:click="deleteSelect(index)">消去</div>
        </div>
        <p>選択肢の入力</p>
        <input type="text" v-model="question_select" />
        <button v-on:click="addSelect">選択肢の追加</button>
        <button v-on:click="addQuestion">この質問を追加する</button>
      </div>
      <button v-on:click="addQuestionnaire">
        以上の内容でアンケートを作成
      </button>
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
      question_title: "",
      question_type1: "",
      question_type2: "",
      question_select: "",
      questions: [],
      selects: [],
    }
  },
  methods: {
    addQuestionnaire() {
      if (
        firebase.firestore().collection("pins").doc(this.pin_id)
          .questionnaire_title
      ) {
        alert("すでにアンケートは設定されています")
      } else {
        firebase
          .firestore()
          .collection("pins")
          .doc(this.pin_id)
          .set(
            {
              questionnaire_title: this.questionnaire_title,
              questionnaire_limit: this.questionnaire_limit,
              questions: this.questions,
            },
            { merge: true }
          )
          .then(() => {
            this.questionnaire_title = ""
            this.questionnaire_limit = ""
            this.questions = []
          })
      }
    },
    addQuestion() {
      const question = {
        question_title: this.question_title,
        question_type1: this.question_type1,
        question_type2: this.question_type2,
        question_selects: this.selects,
      }
      this.questions.push(question)
      this.question_title = ""
      this.question_type1 = ""
      this.question_type2 = ""
      this.selects = []
    },
    addSelect() {
      this.selects.push(this.question_select)
      this.question_select = ""
    },
    deleteSelect(index) {
      this.selects.splice(index, 1)
    },
    deleteQuestion(index) {
      this.questions.splice(index, 1)
    },
  },
}
</script>
