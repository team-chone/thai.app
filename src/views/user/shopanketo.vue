<template>
  <div>
    <div v-if="questionnaire_title === '' || questionnaire_remains <= 0">
      <h1>このピンにアンケートはありません</h1>
    </div>
    <div v-else>
      <div v-if="ansered_nicknames.includes(user_nickname)">
        <h1>あなたはすでにこの質問に答えています</h1>
      </div>
      <div v-else>
        <h1>{{ pin_name }}のアンケート</h1>
        <router-link to="/maphome">戻る</router-link>
        <h2>{{ questionnaire_title }}</h2>
        <h3>残り{{ questionnaire_remains }}回</h3>
        <div v-for="(question, index) in questions" :key="question.id">
          <div>質問{{ index + 1 }}</div>
          {{ question.question_title }}
          <div v-if="question.question_type1 === 'ture'">
            必須
            <!-- <div v-if="question.question_type2 === 'ture'">複数回答可能
                  <div v-for="question_select in question.question_selects" :key="question_select.id">
                    <input type="checkbox" :value="question_select" v-model="anser_question[index]"/>{{ question_select }}
                  </div>
          </div>
          <div v-else> -->
            <div
              v-for="question_select in question.question_selects"
              :key="question_select.id"
            >
              <input
                type="radio"
                :name="index"
                :value="question_select"
                v-model="anser_question[index]"
              />{{ question_select }}
            </div>
            <input
              type="radio"
              :name="index"
              value="未回答だよ"
              checked="checked"
              v-model="anser_question[index]"
              style="display: none"
            />
            <!-- 必須回答項目が何も選択されていないとき、未回答だよという値を持たせておく -->
            <!-- </div> -->
          </div>
          <div v-else>
            <!-- <div v-if="question.question_type2 === 'ture'">複数回答可能
                  <div v-for="question_select in question.question_selects" :key="question_select.id">
                    <input type="checkbox" :value="question_select" v-model="anser_question[index]"/>{{ question_select }}
                  </div>
                  
          </div>
          <div v-else> -->
            <div
              v-for="question_select in question.question_selects"
              :key="question_select.id"
            >
              <input
                type="radio"
                :name="index"
                :value="question_select"
                v-model="anser_question[index]"
              />{{ question_select }}
            </div>
            <input
              type="radio"
              :name="index"
              value=""
              checked="checked"
              v-model="anser_question[index]"
              style="display: none"
            />
            <!-- 何も選択しないとき、データが送られないことを防ぐため、空のバリューを入れる -->
            <!-- </div> -->
          </div>
        </div>
        <button v-on:click="sendQuesttionnaire">
          以上の内容でアンケートを送信
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"
export default {
  data() {
    return {
      pin_id: this.$route.params.pin_id,
      pin_name: this.$route.params.pin_name,
      // pin_id:"SpbnllAccnI0PcUCE4sG",
      // pin_name:"厚木高校",
      questionnaire_limit: "",
      questionnaire_remains: "",
      questionnaire_title: "",
      questionnaire_point: "",

      anser_must_question: [],
      anser_question: [],
      checked: "",

      questions: [],

      user_id: "",
      user_age: "",
      user_gender: "",
      user_nickname: "",
      // user_age: "70",
      // user_gender: "女",
      // user_nickname: "のりこ",
      ansered_nicknames: [],
    }
  },
  methods: {
    sendQuesttionnaire() {
      //pinsのドキュメントのサブコレクション〇〇（アンケート名）ansersに回答を格納
      if (this.ansered_nicknames.includes(this.user_nickname)) {
        alert("あなたはすでにこの質問に答えています")
      } else {
        if (this.anser_question.includes("未回答だよ")) {
          alert("必須項目は全て回答してください")
        } else {
          firebase
            .firestore()
            .collection("pins")
            .doc(this.pin_id)
            .collection(this.questionnaire_title + "ansers")
            .add({
              user_age: this.user_age,
              user_gender: this.user_gender,
              user_nickname: this.user_nickname,
              anser_question: this.anser_question,
            })
            .then(() => {
              //回答を送信するとquestionnaire_limitが-1される
              firebase
                .firestore()
                .collection("pins")
                .doc(this.pin_id)
                .set(
                  {
                    questionnaire_remains: this.questionnaire_remains - 1,
                  },
                  { merge: true }
                )
                .then(() => {
                  this.$auth.currentUser.point += this.questionnaire_point
                })
                .then(() => {
                  alert("ご回答ありがとうございます")
                  this.$router.push({
                    name: "maphome",
                  })
                })
            })
        }
      }
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
        this.questionnaire_point = doc.data().questionnaire_point
        this.questionnaire_remains = doc.data().questionnaire_remains
        this.questions = doc.data().questions
        for (let i = 0; i < this.questions.length; i++) {
          if (this.questions[i].question_type1 === "ture") {
            this.anser_question[i] = "未回答だよ"
          } else {
            this.anser_question[i] = ""
          }
        }
        //DOM作成時にすでに回答をしているニックネームを取得しansered_nicknamesに格納
        firebase
          .firestore()
          .collection("pins")
          .doc(this.pin_id)
          .collection(this.questionnaire_title + "ansers")
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
              this.ansered_nicknames.push(doc.data().user_nickname)
            })
          })
      })
    firebase
      .firestore()
      .collection("users")
      .doc(this.$auth.currentUser.uid)
      .get()
      .then((doc) => {
        this.user_id = doc.id
        this.user_age = doc.data().age
        this.user_gender = doc.data().gender
        this.user_nickname = doc.data().nickname
      })
  },
}
</script>
