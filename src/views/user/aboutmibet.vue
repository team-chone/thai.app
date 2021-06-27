<template>
  <div>
    <div class="input_main">
      <h1 align="center" class="input_title">サービス概要</h1>
      <div class="input_content" v-if="number === 1">
        <p class="input_content">
          私たちは日々生活している中で様々な不満や意見を抱えていると思います。例えば「この公園にベンチが欲しい」「このレストランの机がもう少し広かったらいいのに」といった大小さまざまなものです。
        </p>
        <div class="next_button" @click="nextPage">次へ</div>
      </div>
      <div v-if="number === 2">
        <p class="input_content">
          しかし現状、これら生活者の貴重な意見がアウトプットされる場はなく、それを必要としている人の元にはほとんど届いておりません。そこで、生活者の意見をリアルタイムで発信するツールとして私たちはMibetを開発しました。
        </p>
        <div class="next_button" @click="nextPage">次へ</div>
      </div>
      <div v-if="number === 3">
        <p class="input_content">
          Mibetを使用することで、生活者は日々生活している中での不満や意見をアウトプットすることでポイントを獲得することができ、企業は日常的にアンケートや掲示板機能を通じて生活者のリアルな声をビッグデータとして収集し、早期改善に努められます。
        </p>
        <div class="next_button" @click="nextPage">次へ</div>
      </div>
      <div v-if="number === 4">
        <p class="input_content">
          このようにMibetは企業と生活者がwin-winの関係となり、世の中をスピーディにより良くしていくアプリです。
        </p>
        <div class="input_content">
          <router-link to="/">Mibetを始めよう！</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      number: 1,
    }
  },
  methods: {
    nextPage() {
      this.number += 1
    },
  },
}
</script>

<style>
.input_main {
  background-color: white;
  border-radius: 1.5em;
  margin: 50px auto;
  width: 400px;
  height: 50%;
  box-shadow: 0px 11px 35px 2px rgb(0, 0, 0, 0.14);
  display: flex;
  align-items: center;
  flex-direction: column;
}
.input_content {
  margin: 15px;
}
.input_title {
  padding: 10px;
}
.next_button {
  cursor: pointer;
  color: rgb(7, 91, 248);
  display: flex;
  justify-content: flex-end;
  margin: 10px;
}
</style>
