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

    <div class="page">
      <div class="page-title">
        <h1>ピンを見る</h1>
        <img src="../../image/viewpin.png" width="5%" />
      </div>
      <hamburger />
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
import hamburger from "../../components/comhamburger.vue"

export default {
  components: { hamburger },

  data() {
    return {
      company_name: "",
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
