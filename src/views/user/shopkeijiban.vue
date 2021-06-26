<template>
  <div>
    <h1>{{ pin_name }}の掲示板</h1>
    <a v-on:click="modoru" class="btn-social-isometric">
      <span class="btn-social-isometric-icon btn-social-isometric-icon--feedly"
        ><img class="image" src="../../image/home.png" />
        <!-- <i class="fa fa-rss"></i> -->
      </span>
      <span class="btn-social-isometric-text2">地図に戻る</span>
    </a>

    <div>
      <h2>コメントを追加する</h2>
      <textarea
        class="input-textarea"
        v-model="input_text"
        placeholder="ライスの大盛りの量が少なく感じます"
        maxlength="140"
      ></textarea>
      <button v-on:click="submit">投稿</button>
    </div>
    <h2>
      コメントをみる
      <div v-for="(submission, index) in submissions" :key="index">
        <div>
          <h5>{{ submission.user_nickname }}</h5>
          <h4>{{ submission.input_text }}</h4>
          <h5>
            {{ submission.format_submit_time }}
          </h5>
          <h4>{{ submission.reply }}</h4>
        </div>
      </div>
    </h2>
    <div></div>
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
