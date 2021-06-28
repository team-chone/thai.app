<template>
  <div class="page">
    <div v-if="questionnaire_title === '' || questionnaire_remains <= 0">
      <a v-on:click="modoru" class="btn-social-isometric">
        <span
          class="btn-social-isometric-icon btn-social-isometric-icon--feedly"
          ><img class="image" src="../../image/map.png" />
        </span>
        <span class="btn-social-isometric-text2">地図に戻る</span>
      </a>
      <div class="anim-box">
        <h3>このピンにアンケートはありません</h3>
      </div>
    </div>
    <div v-else>
      <div v-if="ansered_nicknames.includes(user_nickname)">
        <a v-on:click="modoru" class="btn-social-isometric">
          <span
            class="btn-social-isometric-icon btn-social-isometric-icon--feedly"
            ><img class="image" src="../../image/map.png" />
          </span>
          <span class="btn-social-isometric-text2">地図に戻る</span>
        </a>
        <div class="anim-box">
          <h3>あなたはすでにこの質問に答えています</h3>
        </div>
      </div>
      <div v-else>
        <a v-on:click="modoru" class="btn-social-isometric">
          <span
            class="btn-social-isometric-icon btn-social-isometric-icon--feedly"
            ><img class="image" src="../../image/map.png" />
          </span>
          <span class="btn-social-isometric-text2">地図に戻る</span>
        </a>
        <div class="page-title">
          <h1>{{ pin_name }}のアンケート</h1>
          <img src="../../image/questionnaire2.png" width="10%" />
          <div class="questionnaire-title">
            <h1 class="title">{{ questionnaire_title }}</h1>
            <div class="questionnaire-info">
              <div>
                <h3>
                  残り<span>{{ questionnaire_remains }}</span
                  >回
                </h3>
              </div>
              <div class="point-box">
                <img src="../../image/coin.png" width="5%" class="coin" />
                <h3>報酬：{{ questionnaire_point }}pt</h3>
              </div>
            </div>
          </div>
        </div>
        <div class="questions-box">
          <div
            v-for="(question, index) in questions"
            :key="question.id"
            class="question-box"
          >
            <div>質問{{ index + 1 }}</div>
            <div class="question-title">{{ question.question_title }}</div>
            <div v-if="question.question_type1 === 'ture'">
              <div class="must">必須</div>
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
        </div>
        <div class="button">
          <button class="login_button" v-on:click="sendQuesttionnaire">
            送信
          </button>
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
      user_point: "",
      // user_age: "70",
      // user_gender: "女",
      // user_nickname: "のりこ",
      ansered_nicknames: [],
    }
  },
  methods: {
    modoru() {
      this.$router.push({
        name: "maphome",
      })
    },
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
                  this.user_point =
                    Number(this.user_point) + Number(this.questionnaire_point)
                  firebase
                    .firestore()
                    .collection("users")
                    .doc(this.$auth.currentUser.uid)
                    .set(
                      {
                        point: this.user_point,
                      },
                      { merge: true }
                    )
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
            // console.log(this.ansered_nicknames)
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
        this.user_point = doc.data().point
        console.log(this.user_nickname)
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
.page-title {
  text-align: center;
}
.questionnaire-info {
  /* width: 50%;
  margin: 0 auto; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.point-box {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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
.btn-social-isometric {
  display: flex;
  color: #484848;
  display: inline-block;
  height: 50/4 * 3px;
  font-size: 25/4 * 3px;
  line-height: 46/4 * 3px;
  background: #eaeef1;
  text-decoration: none;
  box-sizing: border-box;
  margin: 1/4 * 3em;
  margin-left: 10px;
  /* margin-bottom: 2%; */
}
.btn-social-isometric-text2 {
  align-items: center;
  display: inline-block;
  width: 150/4 * 3px;
  height: 39.5/4 * 3px;
  text-align: center;
  border-bottom: solid 3px #dcdcdc;
}
.button {
  display: flex;
  justify-content: center;
  margin-bottom: 2%;
  margin-top: 2%;
}
.login_button {
  margin: 10px;
  color: #ff5f17;
  background-color: white;
  cursor: pointer;
  border-radius: 1.5em;
  font-size: 15px;
  /* border: none; */
  padding: 5px 15px;
  font-weight: bold;
}
.anim-box {
  background-color: #e6e6e6;

  box-shadow: 0px 11px 35px 2px rgb(0, 0, 0, 0.14);

  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: space-around;
  padding-top: 2%;
  padding-bottom: 2%;

  width: 60%;

  position: fixed;
  top: 30%;
  right: 20%;
  z-index: 5;
  border-radius: 1em;
}
.anim-box.popup.is-animated {
  animation: popup 0.6s cubic-bezier(0.22, 1, 0.36, 1) 1 forwards;
}

@keyframes popup {
  0% {
    transform: translateY(40px) scale(0.8);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
  }
  80%,
  100% {
    opacity: 1;
  }
}
</style>
