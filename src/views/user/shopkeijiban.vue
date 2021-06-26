<template>
  <div>
    <a v-on:click="modoru" class="btn-social-isometric">
      <span class="btn-social-isometric-icon btn-social-isometric-icon--feedly"
        ><img class="image" src="../../image/home.png" />
        <!-- <i class="fa fa-rss"></i> -->
      </span>
      <span class="btn-social-isometric-text2">地図に戻る</span>
    </a>
    <div class="page-title">
      <h1>{{ pin_name }}の掲示板</h1>
      <img src="../../image/board2.png" width="10%" />
    </div>

    <div class="coment-box">
      <h2>コメントを追加する</h2>
      <textarea
        class="input-textarea"
        v-model="input_text"
        placeholder="ライスの大盛りの量が少なく感じます"
        maxlength="140"
      ></textarea>
      <a v-on:click="submit" class="btn btn-border">投稿</a>
    </div>
    <div class="coment-view">
      <h2>コメントをみる</h2>
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

        <div class="balloon1-right">
          <h4>{{ submission.reply }}</h4>
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
      input_text: "",
      submissions: [],
      user_nickname: "",
    }
  },
  methods: {
    modoru() {
      this.$router.push({
        name: "maphome",
      })
    },
    submit() {
      const submit_time = firebase.firestore.Timestamp.now().toDate()
      const submission = {
        user_nickname: this.user_nickname,
        input_text: this.input_text,
        format_submit_time: `${submit_time.getFullYear()}/${
          submit_time.getMonth() + 1
        }/${submit_time.getDate()} ${submit_time.getHours()}:${submit_time.getMinutes()}:${submit_time.getSeconds()}`,
        favorite: 0,
        reply: "",
      }
      firebase
        .firestore()
        .collection("pins")
        .doc(this.pin_id)
        .collection("board")
        .add(submission)
        .then((ref) => {
          this.submissions.push({
            id: ref.id,
            ...submission,
          })
          this.input_text = ""
        })
    },
  },
  created() {
    firebase
      .firestore()
      .collection("users")
      .doc(this.$auth.currentUser.uid)
      .get()
      .then((doc) => {
        this.user_nickname = doc.data().nickname
        console.log(this.user_nickname)
      })
    firebase
      .firestore()
      .collection("pins")
      .doc(this.pin_id)
      .collection("board")
      .orderBy("format_submit_time", "desc")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          this.submissions.push({
            id: doc.id,
            ...doc.data(),
          })
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
h2 {
  font-size: large;
  text-align: center;
}
.page-title {
  text-align: center;
}
.input-textarea {
  width: 70%;
}
a.btn-border {
  margin-top: 2%;
  color: #ff5f17;
  border: 2px solid #ff5f17;
  border-radius: 0;
  background: #fff;
  padding: 5px 20px;
}

a.btn-border:hover {
  color: #fff;
  background: #ff5f17;
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
.coment-box {
  background-color: white;
  margin: 0 auto;
  margin-bottom: 5%;
  width: 80%;
  box-shadow: 0px 11px 35px 2px rgb(0, 0, 0, 0.14);
  border-radius: 1.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1%;
  padding-bottom: 2%;
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
</style>
