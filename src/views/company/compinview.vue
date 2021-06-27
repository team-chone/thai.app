<template>
  <div class="all">
    <header class="site-header">
      <div class="site-header__wrapper">
        <div class="site-header__start">
          <h1 class="brand">{{ company_name }}</h1>
        </div>
        <div class="site-header__middle">
          <nav class="nav">
            <ul class="nav__wrapper">
              <li class="nav__item">
                <img class="image" src="../../image/home.png" />
                <router-link to="/commaphome" class="media"
                  ><font color="#000000">ホーム</font></router-link
                >
              </li>
              <li class="nav__item">
                <img class="image" src="../../image/addpin2.png" />
                <router-link to="/combuildpin" class="media"
                  ><font color="#000000">ピンを立てる</font></router-link
                >
              </li>
              <li class="nav__item active">
                <img class="image" src="../../image/viewpin.png" />
                <router-link to="/compinview" class="media"
                  ><font color="#000000">ピンを見る</font></router-link
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <div class="page">
      <div class="page-title">
        <h1>ピンを見る</h1>
        <img src="../../image/viewpin.png" width="5%" />
      </div>
      <div class="pin-list">
        <div v-for="(pin, index) in companyPins" :key="index">
          <div class="pin-box">
            <div class="pin-name">{{ pin.pin_name }}</div>
            <div class="pin-type">{{ pin.pin_type }}</div>
            <div class="pin-menu">
              <router-link
                :to="{
                  name: 'comanketoview',
                  params: {
                    company_name: pin.company_name,
                    pin_id: pin.id,
                    pin_name: pin.pin_name,
                    pin_type: pin.pin_type,
                    pin_range: pin.pin_range,
                  },
                }"
                class="anketo-button"
                ><img src="../../image/questionnaire.png" width="10%"
              /></router-link>
              <router-link
                :to="{
                  name: 'comkeijibanview',
                  params: {
                    company_name: pin.company_name,
                    pin_id: pin.id,
                    pin_name: pin.pin_name,
                    pin_type: pin.pin_type,
                    pin_range: pin.pin_range,
                  },
                }"
                class="keijiban-button"
                ><img src="../../image/board.png" width="10%"
              /></router-link>
            </div>
          </div>
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
      company_name: "", //company_nameは企業名と紐付ける必要あり。今はとりあえず「神奈川県」としている。
      companyPins: [],
    }
  },
  created() {
    firebase
      .firestore()
      .collection("companies")
      .doc(this.$auth.currentUser.uid)
      .get()
      .then((doc) => {
        this.company_name = doc.data().comname
        //console.log(this.company_name)
        firebase //pin_companyがcompany_nameと一致するpinを全て取得
          .firestore()
          .collection("pins")
          .where("pin_company", "==", this.company_name)
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
              this.companyPins.push({
                id: doc.id,
                ...doc.data(),
              })
            })
          })
      })
  },
}
</script>
<style scoped>
/* .pin-list {
  padding-bottom: 5%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
} */
.page-title {
  text-align: center;
}
.viewpin-img {
  display: flex;
  justify-content: center;
}
.page {
  padding-bottom: 10%;
}
.pin-box {
  padding-top: 1%;
  background-color: white;
  margin: 5% auto;
  width: 70%;
  box-shadow: 0px 11px 35px 2px rgb(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.pin-name {
  font-size: large;
  font-weight: bold;
}
.pin-menu {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.anketo-button,
.keijiban-button {
  margin-top: 2px;
  padding-top: 5px;
  text-decoration: none;
  text-align: center;
  border-top: 2px solid;
  border-color: #facc2e;
}
.anketo-button {
  border-right: 1px solid;
  border-color: #facc2e;
}
.keijiban-button {
  border-left: 1px solid;
  border-color: #facc2e;
}
.anketo-button:hover,
.keijiban-button:hover {
  background-color: #f5ecce;
}
</style>
