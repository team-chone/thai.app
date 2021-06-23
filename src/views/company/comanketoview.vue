<template>
  <div>
    <h1>{{ pin_name }}</h1>

    <router-link to="/compinview">戻る</router-link> |
    <router-link to="/comkeijibanview">掲示板を見る</router-link>

    <button v-on:click="screenChange1">アンケートを作成する</button>
    <button v-on:click="screenChange2">アンケートを編集する</button>
    <button v-on:click="screenChange3">アンケートの結果をみる</button>
    <com-make-question v-if="screen_type === '1'"></com-make-question>
    <com-edit-question v-if="screen_type === '2'"></com-edit-question>
    <com-analyze-question v-if="screen_type === '3'"></com-analyze-question>
    <!-- <div>

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

    </div> -->
  </div>
</template>

<script>
import comMakeQuestion from "../../components/comMakeQuestion.vue"
import comEditQuestion from "../../components/comEditQuestion.vue"
import comAnalyzeQuestion from "../../components/comAnalyzeQuestion.vue"
import firebase from "firebase"
export default {
  components: { comMakeQuestion, comEditQuestion, comAnalyzeQuestion },
  data() {
    return {
      pin_name: this.$route.params.pin_name,
      pin_id: this.$route.params.pin_id,
      screen_type: false,
      questionnaire_title: "",
    }
  },
  methods: {
    screenChange1() {
      //表示されるコンポーネントの切り替え
      if (this.questionnaire_title === "") {
        this.screen_type = "1"
      } else {
        alert("一つのピンに設定できるアンケートは一つまでです")
      }
    },
    screenChange2() {
      this.screen_type = "2"
    },
    screenChange3() {
      this.screen_type = "3"
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
        console.log(this.questionnaire_title)
      })
  },
}
</script>
