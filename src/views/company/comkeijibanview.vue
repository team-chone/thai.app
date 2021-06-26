<template>
  <div>
    <h1>{{ pin_company }}</h1>
    <router-link to="/commaphome">ホーム</router-link>｜
    <router-link to="/combuildpin">ピンを立てる</router-link> |
    <router-link to="/compinview">ピンを見る</router-link>
    <h1>{{ pin_name }}掲示板</h1>
    <router-link to="/compinview">戻る</router-link> |
    <router-link to="/comanketoview">アンケートを見る</router-link>
    <div v-if="reply_space === 'true'">
      <textarea
        v-model="input_reply"
        placeholder="ご意見ありがとうございます"
      ></textarea>
      <button v-on:click="submitReply">リプライ送信</button>
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
          <button v-on:click="addResolved(submission.id)">解決済にする</button>
          <div v-if="submission.reply === ''">
            <button v-on:click="replySpaceOpen(submission.id)">リプライ</button>
          </div>
          <div v-else>
            <button v-on:click="replySpaceOpen(submission.id)">
              リプライ変更
            </button>
            <h4>{{ submission.reply }}</h4>
          </div>
        </div>
      </div>
    </h2>
  </div>
</template>

<script>
import firebase from "firebase"
export default {
  data() {
    return {
      pin_id: this.$route.params.pin_id,
      pin_name: this.$route.params.pin_name,
      submissions: [],
      input_reply: "",
      reply_space: "false",
      submission_id: "",
    }
  },
  methods: {
    replySpaceOpen(value) {
      this.reply_space = "true"
      this.submission_id = value
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
