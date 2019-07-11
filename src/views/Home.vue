<template>
<div class="home">

  <div class="home-top">
    <div class="pc-top-title">
      <h1>レファ協<br>ランダム検索</h1>
    </div>
    <div class="toptitle">
      <img class="sp-top" src="/img/sp-top.png" />

      <!--<p>{{ sharedState.message }}</p>-->
      <!--<button v-on:click="setMessageAction">setMessageAction</button>-->

      <div class="description">
        <p>レファレンス協同データベースからの<br>『簡易キーワード検索』と『ランダムピックアップ表示機能』を提供する個人運営のサービスです。beta版のため、動作はちょっと重めです。</p>
      </div>
    </div>
    <div class="topbox">
      <p class="exampletexts">
        <span v-on:click="setInputBox('モチモチ')">モチモチの木のアクセントは？</span>
        <span v-on:click="setInputBox('江戸時代　米　値段')">江戸時代の米の値段は？</span>
        <span v-on:click="setInputBox('おいしい　カニ')">おいしいカニの見分け方</span>
        <span v-on:click="setInputBox('最後　仇討ち')">最後に仇討ちをした人は誰？</span>
        <span v-on:click="setInputBox('大仏　ぶつぶつ')">奈良の大仏さまの頭のぶつぶつはいくつ？</span>
        <span v-on:click="setInputBox('手話　誰が')">手話は誰が作ったの？</span>
        <span v-on:click="setInputBox('蛍 すぐ死ぬ')">蛍はなぜすぐ死んでしまうのか</span>
        <span v-on:click="setInputBox('トナカイ　名前')">サンタクロースのトナカイの名前は？</span>
        <span v-on:click="setInputBox('歳 おすすめ　絵本')">○歳の子どもにお勧めの絵本は？</span>
        <span v-on:click="setInputBox('市場動向')">○○の市場動向を調べたい！</span>
      </p>

      <div>
        <input type="text" id="searchbox" v-model="keyword" placeholder="キーワード検索" @keydown.prevent.enter="moveNext">
      </div>
      <div class="or">
        <p>or</p>
      </div>
      <button v-on:click="getrandom" class="random-button">ランダムに表示</button>
    </div>
    <div class="tweet-pc">
      <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false" data-size="large">Tweet</a>
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
  <button v-show="moreKeyword" v-on:click="getMoreKeyword" class="random-button more-button">もっと検索</button>
</div>
</template>

<script>
import _ from 'lodash';
import axios from 'axios';

export default {
  data() {
    return {
      refqas: [],
      keyword: '',
      sharedState: this.$store.state,
      loading: false,
      moreKeyword: false,
      show:false,
    }

  },
  watch: {
    keyword: function() {
      // lodash.debounceを利用してAPI呼び出しの負荷軽減
      this.loading = true;
      this.moreKeyword = false;
      this.debouncedGetAnswer();
    }
  },
  created: function() {
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 3000);

    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://platform.twitter.com/widgets.js')
    document.head.appendChild(recaptchaScript)
  },
  methods: {
    setInputBox(searchtext){
      document.getElementById( "searchbox" ).value = searchtext;
      this.keyword=searchtext;
    },
    doClick:function(){
      this.$toasted.show('hello billo',{
        position: "top-center",
        duration : 10000
      });
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
    },
    //キーワード検索用関数
    getAnswer: function() {
      if (this.keyword === '') {
        this.loading = false;
        return;
      }
      this.refqas = [];
      //axios.get("http://192.168.1.12:8000/?keyword=" + this.keyword)
      axios.get("https://falmy.herokuapp.com/?keyword=" + this.keyword)
        .then(response => {
          this.resisterContent(response);
          this.moreKeyword = true;
        })
        .catch(error => {
          this.$toasted.show('データ取得に失敗しました。時間を置いて再度お試しください。',{
            position: "top-center",
            duration : 10000
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
      this.refqas = [];
      this.keyword="";
      const regdate = this.makeRandomDate();
      //axios.get("http://192.168.1.12:8000/random?regdate=" + regdate)
      axios.get("https://falmy.herokuapp.com/random?regdate=" + regdate)
        .then(response => {
          this.resisterContent(response);
          this.moreKeyword = true;
        })
        .catch(error => {
          this.$toasted.show('データ取得に失敗しました。時間を置いて再度お試しください。',{
            position: "top-center",
            duration : 10000
          });
          this.moreKeyword = false;
        })
        .finally(() => {
          this.loading = false;
          })
    },
    //もっとキーワード検索用関数
    getMoreKeyword: function() {
      const regdate = this.makeRandomDate();
      //キーワードが入力されていない時＝「ランダムに表示(getrandom関数)」ボタンで呼び出されたときは
      //ランダムに検索できるようにquerytextに「""」を代入し、
      //https://falmy.herokuapp.com/more?keyword=''&regdate=「ランダム8桁」で検索している。
      let querytext = this.keyword;
      if(this.keyword === ""){
        querytext = "\'\'";
      }

      axios.get("https://falmy.herokuapp.com/more?keyword=" + querytext + "&" + "regdate=" + regdate)
        .then(response => {
          this.resisterContent(response);
        })
        .catch(error => {
          this.$toasted.show('データ取得に失敗しました。時間を置いて再度お試しください。',{
            position: "top-center",
            duration : 10000
          });
        })
        .finally(() => {
          this.loading = false;
        })
    },
  },

  /*
  //初期表示でランダムな記事を表示する。※created()は既にあるので使うときはがっちゃんこする。
  created() {
    this.getrandom();
  }
  //初期表示での特定キーワードの記事を表示する。しかし、記事詳細に遷移後、
  //ブラウザの戻るボタンでトップページに戻ると再度実行されしまう点でuiがよくない。
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
.exampletexts{
  line-height: 45px;
  display: inline-block;
  vertical-align: top;
  height: 45px;
  border: 0.1px solid #fff;
  text-align: center;
  overflow-y: hidden;
  cursor: pointer;
  margin-top: 45px;
  font-size: 1rem;
  width: 100%;
}

.exampletexts span{
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
  animation: ShiftText 15s linear infinite;
}
@keyframes ShiftText{
  0%,10%{
    top: 0;
  }
  11%,20%{
    top: -45px;
  }
  21%,30%{
    top: -90px;
  }
  31%,40%{
    top: -135px;
  }
  41%,50%{
    top: -180px;
  }
  51%,60%{
    top: -225px;
  }
  61%,70%{
    top: -270px;
  }
  71%,80%{
    top: -315px;
  }
  81%,90%{
    top: -360px;
  }
  91%,100%{
    top: -405px;
  }
}

.modal {
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  max-width: 300px;
  margin: 0 auto;
  padding: 30px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.3);
}

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

.pc-top-title {
  display: none;
}

.sp-top {
  display: block;
  width: 100%;
}

.description {
  margin-top: 15px;
  font-size: 1rem;
  line-height: 1.75rem;
  font-weight: 300;
  border-top: 0.2px solid #fff;
  border-bottom: 0.2px solid #fff;
  letter-spacing: 0.1rem;
}

h1 {
  font-size: 2.5rem;
  line-height: 3rem;
}

#searchbox {
  margin:auto;
  padding: 0.5rem 1rem;
  display: block;
  width: 100%;
  font-size: 1.5rem;
  color: f78200;
}

.random-button {
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
.or{
  font-size: 1.2rem;
  line-height: 1.3rem;
}
.tweet-pc{
  margin:15px auto 0;
}

.result-question,
.result-answer {
  padding: 20px;
  color: #000;
  text-align: left;
  overflow: hidden;
}

.result-question {
  background-color: #ccc;
  font-size: 1.3rem;
  line-height: 1.8rem;
  letter-spacing: 0.02rem;
}

.result-answer {
  background-color: #eee;
  border: 1px solid #ccc;
  line-height: 1.4rem;
}

.resultswrapper {
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
}

.result {
  width: 100%;
  margin-top: 15px;
  margin-bottom: 15px;
  filter: drop-shadow(3px 3px 5px rgba(0,0,0,.3));
}

@media screen and (min-width: 768px) {
  .home-top {
    display: flex;
    flex-flow: wrap;
  }

  .toptitle {
    display: block;
    width: 50%;
    padding: 30px;
    margin: auto;
  }

  .topbox {
    width: 50%;
    margin: auto;
    padding-top: 100px;

  }

  h1 {
    font-size: 4rem;
    line-height: 5rem;
    margin: 30px auto;
    font-weight: 700;
    letter-spacing: 0.05rem;
  }
.exampletexts{
  margin: auto;
  font-size: 1.3rem;
  width: 70%;

}
  #searchbox {
    margin-top: 30px;
    height: 100px;
    width: 70%;
    font-size: 3rem;
  }

  .random-button {
    margin: 10px auto;
    font-size: 3rem;
    padding: 1rem 1rem;
    width: 70%;
  }
  .or{
    font-size: 2rem;
  }
.tweet-pc{
  z-index: 100;
  position: fixed;
  right: 30px;
  bottom: 30px;
}
  .loader {
    display: block;
  }

  .resultswrapper {
    margin: 0px auto 0;
    flex-flow: wrap;
    width: 100%;
  }

  .result {
    width: 30%;
  }

  .more-button {
    margin: 0 auto 30px;
    font-size: 2rem;
    width: 40%;
  }
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
</style>
