<template>
<div class="home">

  <div class="home-top">
    <div class="toptitle">
      <div class="pc-top-title">
        <h1>レファ協<br>ランダム検索</h1>
      </div>
      <img class="sp-top" src="/img/sp-top.png" />

      <div class="description">
        <p>レファレンス協同データベースからの<br>『簡易キーワード検索』と『ランダムピックアップ表示機能』を提供する個人運営のサービスです。beta版のため、動作はちょっと重めです。</p>
        <p>求める情報を探すよりは、セレンディピティを楽しむことがコンセプトのサ―ビスです。</p>
      </div>
    </div>

    <div class="topbox">

      <p class="exampletexts" v-on:click="setInputBox(currentInputWord)">
        <transition appear name='slide' tag='div' v-on:after-enter="next" mode="out-in">
          <span v-html="currentWord" :key='currentNumber'  />
        </transition>
      </p>
      <div>
        <input type="text" id="searchbox" v-model="keyword" placeholder="キーワード検索" @keydown.prevent.enter="moveNext">
      </div>
      <div class="or">
        <p>or</p>
      </div>
      <button v-on:click="getrandom" class="random-button">ランダムに表示</button>
    </div>
    <div class="tweet">
      <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false" data-size="large">Tweet</a>
    </div>
    <div class="scroll-container">
      <a v-show="promptScroll" class="scroll" href="#"><span></span><span></span><span></span></a>
    </div>
    <div v-show="loading" class="loader" id="loading"></div>
  </div>

  <div v-show="!loading" class="resultswrapper" id="resultswrapper">
    <div class="result" v-for="(refqa,index) in sharedState.message" v-bind:key='index'>
      <router-link :to="{ name: 'detail', params: { sysid: refqa.id }}">
        <div class="result-question">
          <p v-html="refqa.question"></p>
        </div>
        <div class="result-answer">
          <p v-html="refqa.answer"></p>
        </div>
      </router-link>
    </div>
  </div>
  <button v-show="moreKeyword" v-on:click="getMoreKeyword" class="more-button">もっと検索</button>
  <div v-show="moreLoading" class="loader more"></div>
</div>
</template>

<script>
import _ from 'lodash';
import axios from 'axios';
import examplesearch from "../assets/example.json"

export default {
  data() {
    return {
      refqas: [],
      keyword: '',
      sharedState: this.$store.state,
      loading: false,
      moreKeyword: false,
      promptScroll: false,
      moreLoading: false,
      //検索レコメンド用
      currentNumber: 0,
      words: examplesearch.words,
      inputwords: examplesearch.inputwords,
      path:location.pathname,
    }

  },
  watch: {
    keyword: function() {
      // lodash.debounceを利用してAPI呼び出しの負荷軽減
      this.loading = true;
      this.promptScroll = true;
      this.moreKeyword = false;
      this.debouncedGetAnswer();
    }
  },
  created: function() {
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 3000);
    //Detailからのリンク用。keywordが設定されている場合は検索ボックスに入力する。
    if(this.path.match(/\/keyword\/./)){this.keyword=this.$route.params.keyword}
    //twitterのjs読み込み
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://platform.twitter.com/widgets.js')
    document.head.appendChild(recaptchaScript)
  },
  //検索レコメンド用
  computed: {
    currentWord: function() {
      return this.words[this.currentNumber % this.words.length];
    },
    currentInputWord: function() {
      return this.inputwords[this.currentNumber % this.inputwords.length];
    },
  },
  methods: {
    //検索レコメンド用
    next: function() {
      setTimeout(() => {
        this.currentNumber += 1
      }, 3000)
    },
    setInputBox(searchtext) {
      document.getElementById("searchbox").value = searchtext;
      this.refqas = [];
      this.keyword = searchtext;
    },

    //検索ボックスからフォーカスを外す関数。スマホのソフトウェアキーボードを閉じるため。
    moveNext: function() {
      document.activeElement.blur();
    },
    //resisterContentで処理したデータをstoreに登録する関数
    setMessageAction: function() {
      this.$store.commit("setMessageAction", this.refqas)
    },
    //表示に反映するために、取得したレスポンスを処理する関数
    resisterContent: function(response) {
      const oParser = new DOMParser();
      const oDOM = oParser.parseFromString(response.data, "application/xml");
      const results = oDOM.getElementsByTagName('result');
      for (const result of results) {
        const question = result.getElementsByTagName("reference")[0].getElementsByTagName("question")[0];
        const answer = result.getElementsByTagName("reference")[0].getElementsByTagName("answer")[0];
        const id = result.getElementsByTagName("reference")[0].getElementsByTagName("sys-id")[0];
        //200文字以上のコンテンツはトップ画面では省略する。
        let dotquestion = "";
        let dotanswer = "";
        if (question.innerHTML.length > 200) {
          dotquestion = "..."
        }
        if (answer.innerHTML.length > 200) {
          dotanswer = "..."
        }
        const obj = {
          question: question.innerHTML.slice(0, 200) + dotquestion,
          answer: answer.innerHTML.slice(0, 200) + dotanswer,
          id: id.innerHTML,
        };
        this.refqas.push(obj)
      }
      this.$store.commit("setMessageAction", this.refqas)
      this.loading = false;
      this.promptScroll = false;
    },
    //キーワード検索用関数
    getAnswer: function() {
      if (this.keyword === '') {
        this.loading = false;
        return;
      }
      this.refqas = [];
      axios.get("https://falmy.herokuapp.com/?keyword=" + this.keyword)
        .then(response => {
          this.resisterContent(response);
          this.moreKeyword = true;
        })
        .catch(error => {
          this.$toasted.show('データ取得に失敗しました。時間を置いて再度お試しください。', {
            position: "top-center",
            duration: 10000
          });
        })
        .finally(() => {
          this.loading = false;
        })
    },
    //2004/3/6～現在までの間のランダムな日付を生成。2004/3/6はデータ登録日の最古と思われる日付。
    makeRandomDate: function() {
      const start = new Date(2004, 3, 6);
      const end = new Date;
      const querydate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      const month = ("00" + (querydate.getMonth() + 1)).slice(-2);
      const date = ("00" + querydate.getDate()).slice(-2);
      const regdate = querydate.getFullYear() + month + date;
      return regdate;
    },
    //ランダム取得用関数
    getrandom: function() {
      this.loading = true;
      this.promptScroll = true;
      this.refqas = [];
      this.keyword = "";
      const regdate = this.makeRandomDate();
      axios.get("https://falmy.herokuapp.com/random?regdate=" + regdate)
        .then(response => {
          this.resisterContent(response);
          this.moreKeyword = true;
        })
        .catch(error => {
          this.$toasted.show('データ取得に失敗しました。時間を置いて再度お試しください。', {
            position: "top-center",
            duration: 10000
          });
          this.moreKeyword = false;
        })
        .finally(() => {
          this.loading = false;
          this.promptScroll = false;
        })
    },
    //もっとキーワード検索用関数
    getMoreKeyword: function() {
      this.moreLoading = true;
      this.promptScroll = true;
      const regdate = this.makeRandomDate();
      //キーワードが入力されていない時＝「ランダムに表示(getrandom関数)」ボタンで呼び出されたときは
      //ランダムに検索できるようにquerytextに「""」を代入し、
      //https://falmy.herokuapp.com/more?keyword=''&regdate=「ランダム8桁」で検索している。
      let querytext = this.keyword;
      if (this.keyword === "") {
        querytext = "\'\'";
      }

      axios.get("https://falmy.herokuapp.com/more?keyword=" + querytext + "&" + "regdate=" + regdate)
        .then(response => {
          this.resisterContent(response);
        })
        .catch(error => {
          this.$toasted.show('データ取得に失敗しました。時間を置いて再度お試しください。', {
            position: "top-center",
            duration: 10000
          });
        })
        .finally(() => {
          this.loading = false;
          this.promptScroll = false;
          this.moreLoading = false;
        })
    },

  },


  /*
  //初期表示でランダムな記事を表示する。※created()は既にあるので使うときはがっちゃんこする。
  created() {
    this.getrandom();
  }
  //初期表示での特定キーワードの記事を表示する。しかし、記事詳細に遷移後、
  mounted() {
    axios.get("https://falmy.herokuapp.com/?keyword='読書'")
      .then(response => {
        this.resisterContent(response);
      })
  }
  */
}
</script>
<style>
.slide-enter-active {
  transition: all 0.6s ease 0s;
  position: absolute;
}

.slide-leave-active {
  transition: all 0.3s ease 0s;
  position: absolute;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
}

.slide-enter {
  transform: translateY(30px);
}

.slide-enter-to,
.slide-leave {
  transform: translateY(0);
}

.slide-leave-to {
  transform: translateY(-30px);
}

.scroll-container {}

.scroll {
  padding-top: 80px;
}

.scroll span {
  z-index: 100;
  position: fixed;
  bottom: 30px;
  left: 50%;
  width: 30px;
  height: 30px;
  margin-left: -12px;
  border-left: 1px solid #fff;
  border-bottom: 1px solid #fff;
  transform: rotate(-45deg);
  animation: sdb 2s infinite;
  opacity: 0;
  box-sizing: border-box;
}

.scroll span:nth-of-type(1) {}

.scroll span:nth-of-type(2) {
  bottom: 40px;
  animation-delay: .15s;
}

.scroll span:nth-of-type(3) {
  bottom: 50px;
  animation-delay: .3s;
}

@keyframes sdb {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

/*
全体
*/
.home {
  background-color: #fff;
}

.home-top {
  background-color: #f78200;
  min-height: 95vh;
  padding: 30px;

  text-align: center;
  color: #fff;
}

.home-top .toptitle .pc-top-title {
  display: none;
}

.home-top .toptitle .pc-top-title h1 {
  font-size: 2.5rem;
  line-height: 3rem;
}

.home-top .toptitle .sp-top {
  display: block;
  width: 100%;
}

.home-top .topbox .description {
  margin-top: 15px;
  font-size: 1rem;
  line-height: 1.75rem;
  font-weight: 300;
  border-top: 0.2px solid #fff;
  border-bottom: 0.2px solid #fff;
  letter-spacing: 0.1rem;
}

/*
事例レコメンド用
*/
.home-top .topbox .exampletexts {
  line-height: 45px;
  display: inline-block;
  vertical-align: top;
  height: 45px;
  border: 0.1px solid #fff;
  text-align: center;
  overflow-y: hidden;
  cursor: pointer;
  margin-top: 45px;
  font-size: 0.9rem;
  width: 100%;
  position: relative;
}

.home-top .topbox .exampletexts span {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
}



/*
検索ボックス
*/
.home-top .topbox #searchbox {
  margin: auto;
  padding: 0.5rem 1rem;
  display: block;
  width: 100%;
  font-size: 1.5rem;
  color: f78200;
}

.home-top .topbox .random-button,
.more-button {
  margin: 10px auto;
  display: inline-block;
  background-color: #f78200;
  color: #fff;
  font-size: 1.5rem;
  line-height: 1;
  text-decoration: none;
  letter-spacing: 0.05rem;
  padding: 0.5rem 1rem;
  border-radius: 3px;
  cursor: pointer;
  box-shadow: 0 3px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  -webkit-tap-highlight-color: transparent;
  transition: .3s ease-out;
}

.home-top .topbox .or {
  font-size: 1.2rem;
  line-height: 1.3rem;
}

.home-top .tweet {
  margin: 15px auto 0;
}

/*
検索結果
*/
.resultswrapper {
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
}

.resultswrapper .result {
  width: 100%;
  margin-top: 15px;
  margin-bottom: 15px;
  filter: drop-shadow(3px 3px 5px rgba(0, 0, 0, .3));
}

.resultswrapper .result .result-question,
.resultswrapper .result .result-answer {
  padding: 20px;
  color: #000;
  text-align: left;
  overflow: hidden;
}

.resultswrapper .result .result-question {
  background-color: #ccc;
  font-size: 1.3rem;
  line-height: 1.8rem;
  letter-spacing: 0.02rem;
}

.resultswrapper .result .result-answer {
  background-color: #eee;
  border: 1px solid #ccc;
  line-height: 1.4rem;
}

/*
loader
*/

.loader,
.loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}

.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(255, 255, 255, 0.2);
  border-right: 1.1em solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
  border-left: 1.1em solid #ffffff;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}

.more {
  border-top: 1.1em solid rgba(235, 136, 12, 0.2);
  border-right: 1.1em solid rgba(235, 136, 12, 0.2);
  border-bottom: 1.1em solid rgba(235, 136, 12, 0.2);
  border-left: 1.1em solid #f78200;

}

@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

/*
pc用レスポンシブ設定
*/
@media screen and (min-width: 768px) {
  .home-top {
    display: flex;
    flex-flow: wrap;
  }

  .home-top .toptitle {
    display: block;
    width: 50%;
    padding: 30px;
    margin: auto;
  }

  .home-top .topbox {
    width: 50%;
    margin: auto;
    padding-top: 100px;

  }

  .home-top .toptitle .pc-top-title h1 {
    font-size: 4rem;
    line-height: 5rem;
    margin: 30px auto;
    font-weight: 700;
    letter-spacing: 0.05rem;
  }

  .home-top .topbox .exampletexts {
    margin: auto;
    font-size: 1.3rem;
    width: 70%;

  }

  .home-top .topbox #searchbox {
    margin-top: 30px;
    height: 100px;
    width: 70%;
    font-size: 3rem;
  }

  .home-top .topbox .random-button,
  .more-button {
    margin: 10px auto;
    font-size: 3rem;
    padding: 1rem 1rem;
    width: 70%;
  }

  .home-top .topbox .or {
    font-size: 2rem;
  }

  .home-top .tweet {
    z-index: 100;
    position: fixed;
    right: 30px;
    bottom: 30px;
  }

  /*
  検索結果
  */
  .home-top .loader {
    display: block;
  }

  .resultswrapper {
    margin: 0px auto 0;
    flex-flow: wrap;
    width: 100%;
  }

  .resultswrapper .result {
    width: 30%;
  }

  .more-button {
    margin: 0 auto 30px;
    font-size: 2rem;
    width: 40%;
  }

}
</style>
