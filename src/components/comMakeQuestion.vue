<template>
  <div>
    <h1>アンケートの新規作成</h1>
    <div class="questionnaire-box">
      <h2>アンケートの題名を入力</h2>
      <input
        type="text"
        v-model="questionnaire_title"
        class="questionnaire-title"
      />
      <h2>回答数の上限を設定（最小10）</h2>
      <input
        type="number"
        min="10"
        v-model="questionnaire_limit"
        class="questionnaire-info"
      />
      <h2>アンケート回答によるポイント付与</h2>
      <input
        type="number"
        min="0"
        v-model="questionnaire_point"
        class="questionnaire-info"
      />
      <div class="questions-box">
        <div
          v-for="(question, index) in questions"
          :key="question.id"
          class="question-box"
        >
          <div>質問{{ index + 1 }}</div>
          <div>
            <h3>{{ question.question_title }}</h3>
          </div>
          <div v-if="question.question_type1 === 'ture'" class="must">必須</div>
          <!-- <div v-if="question.question_type2 === 'ture'">複数回答可能</div> -->
          <div v-for="select in question.question_selects" :key="select.id">
            <div>{{ select }}</div>
          </div>
          <button v-on:click="deleteQuestion(index)" class="delete-button">
            消去
          </button>
        </div>
      </div>
      <div class="make-question">
        <h2>質問の作成</h2>

        <h3>質問の本文入力</h3>
        <input type="text" v-model="question_title" class="question-text" />
        <h3>回答必須の質問であるか</h3>
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
        <!-- <h3>複数回答可能であるか</h3>
      <label
        ><input type="radio" value="ture" v-model="question_type2" />可能</label
      >
      <label
        ><input
          type="radio"
          value="false"
          v-model="question_type2"
        />不可能</label
      > -->
        <div class="selections">
          <div
            v-for="(select, index) in selects"
            :key="select.id"
            class="selection"
          >
            <div>{{ select }}</div>
            <button v-on:click="deleteSelect(index)">消去</button>
          </div>
        </div>

        <div class="make-selection">
          <h3>選択肢の入力</h3>
          <input type="text" v-model="question_select" />
          <button v-on:click="addSelect" class="add-select">
            選択肢の追加
          </button>
        </div>

        <button v-on:click="addQuestion" class="add-question">
          この質問を追加する
        </button>
      </div>
    </div>
    <div class="button-box">
      <a v-on:click="addQuestionnaire" class="btn-border"
        >以上の内容でアンケートを作成</a
      >
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
      questionnaire_point: "",
      question_title: "",
      question_type1: "",
      //question_type2: "",
      question_select: "",
      questions: [],
      selects: [],
    }
  },
  methods: {
    addQuestionnaire() {
      //アンケート情報（questionnaire_title,_limit_questions)をpins内に格納
      //   if (this.questionnaire_title === "") {
      firebase
        .firestore()
        .collection("pins")
        .doc(this.pin_id)
        .set(
          {
            questionnaire_title: this.questionnaire_title,
            questionnaire_limit: this.questionnaire_limit,
            questionnaire_point: this.questionnaire_point,
            questionnaire_remains: this.questionnaire_limit,
            questions: this.questions,
          },
          { merge: true }
        )
        .then(() => {
          this.questionnaire_title = ""
          this.questionnaire_limit = ""
          this.questions = []
          alert("アンケートを設定しました")
          this.$router.push({
            name: "commaphome",
          })
        })
      //   } else {
      //     alert("一つのピンに設定できるアンケートは一つまでです")
      //   }
    },
    addQuestion() {
      //questionをquestions配列内に格納
      const question = {
        question_title: this.question_title,
        question_type1: this.question_type1,
        //question_type2: this.question_type2,
        question_selects: this.selects,
      }
      this.questions.push(question)
      this.question_title = ""
      this.question_type1 = ""
      //this.question_type2 = ""
      this.selects = []
    },
    addSelect() {
      //selectをselects配列内に格納
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
<style scoped>
h1 {
  text-align: center;
  font-size: x-large;
}
h2 {
  font-size: large;
}
h3 {
  font-size: medium;
}
.questionnaire-box {
  background-color: white;
  margin: 0 auto;
  margin-bottom: 2%;
  width: 80%;
  box-shadow: 0px 11px 35px 2px rgb(0, 0, 0, 0.14);
  border-radius: 1.5em;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding-top: 2%;
  padding-bottom: 2%;
}
.questionnaire-title {
  width: 50%;
  margin: 0 auto;
}
.questionnaire-info {
  width: 20%;
  margin: 0 auto;
}
.questions-box {
  margin: 0 auto;
  margin-top: 2%;
  width: 90%;
  background-color: #f3be86;
  border-radius: 1em;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.question-box {
  margin: 0 auto;
  margin-top: 2%;
  margin-bottom: 2%;
  width: 30%;
  min-height: 100px;
  background-color: #f5d0a9;
  border-radius: 1em;
}
.make-question {
  margin: 0 auto;
  margin-top: 2%;
  width: 70%;
  background-color: #f5d0a9;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.question-text {
  width: 80%;
}
.selections {
  margin: 0 auto;
  margin-top: 2%;
  width: 90%;
  background-color: #f7dfc7;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.selection {
  margin-top: 2%;
  margin-bottom: 2%;
}
.make-selection {
  margin: 0 auto;
  margin-top: 2%;
  width: 50%;
  background-color: #f7dfc7;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.add-select {
  margin-top: 2%;
  margin-bottom: 2%;
}
.add-question {
  margin-top: 4%;
  margin-bottom: 4%;
}
.must {
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
.delete-button {
  margin-bottom: 2%;
}
</style>
