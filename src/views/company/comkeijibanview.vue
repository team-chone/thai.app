<template>
  <div>
    <header class="site-header">
      <div class="site-header__wrapper">
        <div class="site-header__start">
          <h1 class="brand">{{ pin_company }}</h1>
        </div>
        <div class="site-header__middle">
          <nav class="nav">
            <ul class="nav__wrapper">
              <div class="nav__item">
                <img class="image" src="../../image/home.png" />
                <router-link to="/commaphome" class="media"
                  ><font color="#000000">ホーム</font></router-link
                >
              </div>
              <div class="nav__item">
                <img class="image" src="../../image/addpin2.png" />
                <router-link to="/combuildpin" class="media"
                  ><font color="#000000">ピンを立てる</font></router-link
                >
              </div>
              <div class="nav__item active">
                <img class="image" src="../../image/viewpin.png" />
                <router-link to="/compinview" class="media"
                  ><font color="#000000">ピンを見る</font></router-link
                >
              </div>
            </ul>
          </nav>
        </div>
      </div>
    </header>
    <div class="page-title">
      <h1>{{ pin_name }}掲示板</h1>
      <img src="../../image/board2.png" width="5%" />
    </div>
    <hamburger />
    <div v-if="reply_space === 'true'" class="anim-box">
      <textarea
        v-model="input_reply"
        placeholder="ご意見ありがとうございます"
        class="input-reply"
      ></textarea>
      <button v-on:click="submitReply" class="button2">リプライ送信</button>
      <button v-on:click="cancel" class="button2">戻る</button>
    </div>
    <div class="coment-view">
      <div
        v-for="(submission, index) in submissions"
        :key="index"
        class="coment"
      >
        <div class="balloon1-left">
          <div class="acount">
            <img src="../../image/human.png" width="5%" />
            <h5 class="nickname">{{ submission.user_nickname }}</h5>
          </div>
          <h4>「{{ submission.input_text }}」</h4>
          <h5>
            {{ submission.format_submit_time }}
          </h5>
        </div>
        <div class="buttons">
          <div v-on:click="addResolved(submission.id)" class="button">
            <img src="../../image/check.png" width="20%" />
          </div>
          <div>
            <div v-if="submission.reply === ''">
              <div v-on:click="replySpaceOpen(submission.id)" class="button">
                <img src="../../image/replay.png" width="20%" />
              </div>
            </div>
            <div v-else>
              <div v-on:click="replySpaceOpen(submission.id)" class="button">
                <img src="../../image/change.png" width="20%" />
              </div>
            </div>
          </div>
        </div>
        <div class="balloon1-right">
          <h4>{{ submission.reply }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase"
import hamburger from "../../components/comhamburger.vue"
export default {
  components: { hamburger },
  data() {
    return {
      pin_id: this.$route.params.pin_id,
      pin_name: this.$route.params.pin_name,
      submissions: [],
      input_reply: "",
      reply_space: "false",
      submission_id: "",
      pin_company: "",
    }
  },
  methods: {
    replySpaceOpen(value) {
      this.reply_space = "true"
      this.submission_id = value
    },
    cancel() {
      this.reply_space = "false"
    },
    submitReply() {
      firebase
        .firestore()
        .collection("pins")
        .doc(this.pin_id)
        .collection("board")
        .doc(this.submission_id)
        .set(
          {
            reply: this.input_reply,
          },
          { merge: true }
        )
        .then(() => {
          this.reply_space = "false"
          this.input_reply = ""
          this.submission_id = ""
          alert("リプライを送信しました")
        })
    },
    addResolved(value) {
      this.submission_id = value
      firebase
        .firestore()
        .collection("pins")
        .doc(this.pin_id)
        .collection("board")
        .doc(this.submission_id)
        .set(
          {
            resolved: "true",
          },
          { merge: true }
        )
        .then(() => {
          this.submission_id = ""
          alert("解決済ボックスに送りました")
        })
    },
  },
  created() {
    firebase
      .firestore()
      .collection("companies")
      .doc(this.$auth.currentUser.uid)
      .get()
      .then((doc) => {
        this.pin_company = doc.data().comname
        //console.log(this.pin_company)
      })
    firebase
      .firestore()
      .collection("pins")
      .doc(this.pin_id)
      .collection("board")
      .orderBy("format_submit_time", "desc")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((submission) => {
          this.submissions.push({
            id: submission.id,
            ...submission.data(),
          })
        })
      })
  },
}
</script>
<style scoped>
.page-title {
  text-align: center;
}
.image {
  margin-left: 33%;
  width: 50px;
  height: 50px;
}
/* ヘッダーの情報 */
.brand {
  font-weight: bold;
  font-size: 20px;
}

.site-header {
  position: relative;
  background-color: #ffc44d;
}

/* .site-header__middle {
  flex: 1;
} */

.site-header__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}
.media {
  text-decoration: none;
}
@media (min-width: 940px) {
  .site-header__wrapper {
    padding-top: 0;
    padding-bottom: 0;
  }
}
.nav {
  margin-left: 30rem;
  margin-right: 1rem;
}

@media (min-width: 940px) {
  .nav__wrapper {
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 939px) {
  .nav__wrapper {
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    z-index: -1;
    background-color: #d9f0f7;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-100%);
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  }
  .nav__wrapper.active {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 940px) {
  .nav__item:last-child a {
    border-right: 1px solid #222;
  }
}

@media (min-width: 1100px) {
  .nav__item {
    min-width: 140px;
    flex: 1;
  }
}

.nav__item a {
  display: block;
  padding: 1rem 1.25rem;
  border-left: 4px solid transparent;
}
@media (min-width: 940px) {
  .nav__item a {
    text-align: center;
    border-left: 1px solid #222;
    border-bottom: 4px solid transparent;
  }
}
.nav__item svg {
  display: inline-block;
  vertical-align: middle;
  width: 22px;
  height: 22px;
  margin-right: 1rem;
}
@media (min-width: 940px) {
  .nav__item svg {
    display: block;
    margin: 0 auto 0.5rem;
  }
}
.nav__item.active a {
  border-left-color: #222;
}
@media (min-width: 940px) {
  .nav__item.active a {
    border-bottom-color: #222;
  }
}
.nav__toggle {
  position: absolute;
  right: 1rem;
  top: 1rem;
}
@media (min-width: 940px) {
  .nav__toggle {
    display: none;
  }
}

.inactive-item {
  opacity: 0;
}
/* ヘッダーの情報ここまで */
h1 {
  text-align: center;
  font-size: x-large;
}
.acount {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.nickname {
  margin-left: 4%;
}
.balloon1-left {
  position: relative;
  display: inline-block;
  margin: 1.5em 0 1.5em 15px;
  padding: 7px 10px;
  min-width: 120px;
  max-width: 100%;
  color: #555;
  font-size: 16px;
  background: #f5d0a9;
}

.balloon1-left:before {
  content: "";
  position: absolute;
  top: 50%;
  left: -30px;
  margin-top: -15px;
  border: 15px solid transparent;
  border-right: 15px solid #f5d0a9;
}

.balloon1-right {
  position: relative;
  display: inline-block;
  margin: 1.5em 15px 1.5em 0;
  padding: 7px 10px;
  min-width: 120px;
  max-width: 100%;
  color: #555;
  font-size: 16px;
  background: #effbef;
}

.balloon1-right:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 100%;
  margin-top: -15px;
  border: 15px solid transparent;
  border-left: 15px solid #effbef;
}

.balloon1-right h4 {
  margin: 0;
  padding: 0;
}
.coment-view {
  background-color: white;
  margin: 0 auto;
  margin-bottom: 5%;
  width: 80%;
  box-shadow: 0px 11px 35px 2px rgb(0, 0, 0, 0.14);
  border-radius: 1.5em;
  display: flex;
  flex-direction: column;
  padding-top: 1%;
  padding-bottom: 2%;
}
.coment {
  width: 80%;
  margin: 0 auto;
  border-bottom: 2px solid #effbef;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #effbef;
  height: 5%;
}
.button:hover {
  background-color: #effbef;
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

  width: 40%;

  position: fixed;
  top: 30%;
  right: 30%;
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
.input-reply {
  width: 80%;
  margin: 0 auto;
}
.button2 {
  width: 20%;
  margin: 0 auto;
  margin-top: 2%;
}
</style>
