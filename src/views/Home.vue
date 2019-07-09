<template>
<div class="home">

  <div class="home-top">
    <h2>レファレンス事例協同データベース検索</h2>

    <!--<p>{{ sharedState.message }}</p>-->
    <!--<button v-on:click="setMessageAction">setMessageAction</button>-->

    <div>
      <input type="text" id="searchbox" v-model="keyword" placeholder="キーワードを入力して検索">
    </div>

    <p v-cloak>
      {{ message }}
    </p>
  </div>
  <div class="resultswrapper">

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

<infinite-loading @infinite="infiniteHandler" :distance="10"></infinite-loading>

</div>
</template>

<script>

import InfiniteLoading from 'vue-infinite-loading';
var todos = [];
for(var i=0;i<100;i++){
    todos.push({
        text: "コンテンツ" + i, done: false
    });
}
export default {
  components: {
  InfiniteLoading
},
  data() {
    return {
      refqas: [],
      keyword: '',
      message: '',
      sharedState: this.$store.state,
      todos:[],
      page:0,
    }

  },
  watch: {
    keyword: function(newKeyword, oldKeyword) {
      // lodash.debounceを利用してAPI呼び出しの負荷軽減
      this.message = '入力が終わるのを待ってます･･･';
      this.debouncedGetAnswer();
    }
  },
  created: function() {
    // lodash.debounce によって、1秒間操作が無くなった時点でAPI呼び出し実施
    // キー入力の度にAPIを呼び出すような負荷をかけないため
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 5000);
  },
  methods: {

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
        //200文字以上のコンテンツは省略する。
        let dotquestion = "";
        let dotanswer = "";
        if(question.innerHTML.length > 200){dotquestion = "..."}
        if(answer.innerHTML.length > 200){dotanswer = "..."}
        const obj = {
          question: question.innerHTML.slice(0,200) + dotquestion,
          answer: answer.innerHTML.slice(0,200) + dotanswer,
          id: id.innerHTML,
        };
        this.refqas.push(obj)
      }
      this.$store.commit("setMessageAction", this.refqas)
    },

    getAnswer: function() {
      if (this.keyword === '') {
        this.items = null;
        this.message = '';
        return;
      }

      this.message = 'loading...';
      this.refqas = [];
      //axios.get("http://192.168.1.12:8000/?keyword=" + this.keyword)
      axios.get("https://falmy.herokuapp.com/?keyword=" + this.keyword)
        .then(response => {
          this.resisterContent(response);
        })
        this.message="";
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

      randomGet: function($state) {
        const regdate = this.makeRandomDate();
      //axios.get("http://192.168.1.12:8000/random?regdate=" + regdate)
      axios.get("https://falmy.herokuapp.com/random?regdate=" + regdate)
        .then(response => {
          this.resisterContent(response);
          if(response.data && this.refqas.length < 50){$state.loaded()}else{$state.complete()}
        })

    },
    infiniteHandler($state) {
      this.randomGet($state);
        },

  },
  /*
  destroyed() {
    axios.get("https://falmy.herokuapp.com/?keyword='読書'")
      .then(response => {
        this.resisterContent(response);
      })
  }
  */
}
</script>
<style>
.home-top {
  background-color: #ddd;
  min-height: 250px;
  padding: 30px;
  margin-bottom: 30px;
  text-align: center;
}

#searchbox {
  width: 90%;
  margin: 30px auto;
}

.random-button {
  display: inline-block;
  background-color: #26a69b;
  /*背景色*/
  color: #FFF;
  /*文字色*/
  font-size: 1em;
  /*文字サイズ*/
  line-height: 1;
  text-decoration: none;
  letter-spacing: 0.05em;
  /*字間*/
  padding: 0.5em 1em;
  /*ボタン内の余白*/
  border-radius: 3px;
  /*角の丸み*/
  cursor: pointer;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  /*影*/
  -webkit-tap-highlight-color: transparent;
  transition: .3s ease-out;
  /*変化を緩やかに*/
}

.resultswrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
}

.result {
  width: 30%;
  margin-bottom: 30px;
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
  line-height: 1.6rem;

}

.result-answer {
  background-color: #eee;
  border: 1px solid #ccc;
}

@media screen and (max-width: 768px) {
  .resultswrapper {
    flex-flow: column;
    width: 90%;
    margin: 0 auto;
  }

  .result {
    width: 100%;
  }
}
</style>
