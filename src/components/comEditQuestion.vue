<template>
  <div>
    <h2>アンケートの編集</h2>
  </div>
</template>

<script>
import firebase from "firebase"
export default {
  data() {
    return {
      pin_id: String(this.$route.params.pin_id),
      pin_name: this.$route.params.pin_name,
      //   questionnaire: {
      //     questionnaire_title: "",
      //     questionnaire_limit: "",
      //     questions: [
      //       {
      //         question_title: "",
      //         question_type1: "",
      //         question_type2: "",
      //         selects: [],
      //       },
      //     ],
      //   },
      pin_data: {},
      question_select: "",
    }
  },

  created() {
    firebase
      .firestore()
      .collection("pins")
      .doc(this.pin_id)
      .get()
      .then((doc) => {
        this.pin_data.push({
          id: doc.id,
          ...doc.data(),
        })
        console.log(this.pin_data)
      })
  },
}
</script>
