<template>
<div class="home">

  <div class="home-top">
    <div class="pc-top-title">
      <h1>レファ協<br>ランダム検索</h1>
    </div>
    <div class="toptitle">


    <img class="sp-top" src="/img/sp-top.png" /></li>

    <!--<p>{{ sharedState.message }}</p>-->
    <!--<button v-on:click="setMessageAction">setMessageAction</button>-->

    <div class="description">
      <p>レファレンス事例共同データベースからのキーワード簡易検索とランダム表示を行うサービスです。</p>
    </div>
    </div>
<div class="topbox">
    <div>
      <input type="text" id="searchbox" v-model="keyword" placeholder="キーワード検索" @keydown.prevent.enter="moveNext">
    </div>
    <div class="or">
      <p>or</p>
    </div>
    <button  v-on:click="getrandom" class="random-button">ランダムに表示</button>
  </div>
<div v-show="loading" class="loader" id="loading"></div>
  </div>



<div v-show="!loading" class="resultswrapper" id="resultswrapper">
    <div class="result" v-for="refqa in sharedState.message">
      <router-link :to="{ name: 'about', params: { sysid: refqa.id }}">
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

</div>
</template>

<script>
import _ from 'lodash';
export default {
  data() {
    return {
      refqas: [],
      keyword: '',
      message: '',
      sharedState: this.$store.state,
      todos: [],
      loading: false,
      moreKeyword:false,
    }

  },
  watch: {
    keyword: function(newKeyword, oldKeyword) {
      // lodash.debounceを利用してAPI呼び出しの負荷軽減
      this.loading = true;
      this.debouncedGetAnswer();
    }
  },
  created: function() {
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 5000);
  },
  methods: {
    moveNext: function() {
      document.activeElement.blur();
    },

    setMessageAction: function() {
      this.$store.commit("setMessageAction", this.refqas)
    },

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
      this.message = '';
      this.loading = false;
    },

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
        })
        this.moreKeyword=true;
    },

    makeRandomDate: function() {
      const start = new Date(2004, 3, 6);
      const end = new Date;
      const querydate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      const m = ("00" + (querydate.getMonth() + 1)).slice(-2);
      const d = ("00" + querydate.getDate()).slice(-2);
      const regdate = querydate.getFullYear() + m + d;
      return regdate;
    },

    getrandom: function() {
      this.loading = true;
      this.refqas = [];
      const regdate = this.makeRandomDate();
      //axios.get("http://192.168.1.12:8000/random?regdate=" + regdate)
      axios.get("https://falmy.herokuapp.com/random?regdate=" + regdate)
        .then(response => {
          this.resisterContent(response);
        })
    },
    getMoreKeyword: function(){
      const regdate = this.makeRandomDate();
      axios.get("https://falmy.herokuapp.com/more?keyword=" + this.keyword + "&" + "regdate=" + regdate)
        .then(response => {
          this.resisterContent(response);
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
.home{
  background-color: #fff;
}
.home-top {
  background-color: #f78200;
  min-height: 100vh;
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
  margin-top: 30px;
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
  /*背景色*/
  color: #fff;
  /*文字色*/
  font-size: 1.5rem;
  /*文字サイズ*/
  line-height: 1;
  text-decoration: none;
  letter-spacing: 0.05rem;
  /*字間*/
  padding: 0.5rem 1rem;
  /*ボタン内の余白*/
  border-radius: 3px;

  /*角の丸み*/
  cursor: pointer;
  box-shadow: 0 3px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  /*影*/
  -webkit-tap-highlight-color: transparent;
  transition: .3s ease-out;
  /*変化を緩やかに*/
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
}

@media screen and (min-width: 768px) {
  .home-top{
    display: flex;
    flex-flow: wrap;
  }
.toptitle{
  display: block;
  width: 50%;
  padding: 30px;
}
  .topbox{
    width: 50%;

  }

  h1 {
    font-size: 4rem;
    line-height: 5rem;
    margin: 30px auto;
    font-weight: 700;
    letter-spacing: 0.05rem;
  }

  #searchbox {
    height: 100px;
    width: 70%;
    margin: 40% auto 0;
    font-size: 3rem;
  }
  .random-button {
    margin: 10px auto;
    font-size: 3rem;
    padding: 1rem 1rem;
    width: 70%;
  }
  .loader{
    display: block;
  }

  .resultswrapper {
    margin: 30px auto;
    flex-flow: wrap;
    width: 100%;
  }
  .result {
    width: 30%;
  }
  .more-button{
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
