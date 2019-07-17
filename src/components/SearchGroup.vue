<template>
<div class="SearchGroup">
  <p class="exampletexts" v-on:click="setInputBox(currentInputWord)">
    <transition appear name='slide' tag='div' v-on:after-enter="next" mode="out-in">
      <span v-html="currentWord" :key='currentNumber' />
    </transition>
  </p>
  <div>
    <input type="text" id="searchbox" v-model="searchBoxText" placeholder="キーワード検索" @keydown.prevent.enter="moveNext">
  </div>
  <div class="or">
    <p>or</p>
  </div>
  <button v-on:click="getrandom" class="random-button">ランダムに表示</button>
</div>
</template>

<script>
import examplesearch from "../assets/example.json";
import axios from 'axios';
export default {
  name: 'SearchGroup',
  data() {
    return {
      refqas: [],
      searchBoxText: this.keyword,
      sharedState: this.$store.state,
      //検索レコメンド用
      currentNumber: 0,
      words: examplesearch.words,
      inputwords: examplesearch.inputwords,
    }
  },
  props: {
    keyword: String
  },
  mounted: function() {
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 600);
    // searchBoxTextに文言がある、かつ、表示レコードが登録されていない場合には検索を即実行。
    // mount時にsearchBoxTextに文言があるのはpropsとしてkeywordが渡されているため。(Detailのタグ→Home→SearchGroup)
    //表示レコードが登録されていないのは初期描画のため。（戻るボタンによる遷移ではないと判断）
    if (this.searchBoxText !== "" && this.sharedState.message.length === 0) {
      this.debouncedGetAnswer();
    } else if (this.searchBoxText === "") {
      // searchBoxTextに文言なしの場合はトップページへ飛ばす
      this.$router.push({
        path: "/"
      })
    }
  },
  watch: {
    searchBoxText: function() {
      //keywordによる検索の場合はurlも書き換える
      if (location.pathname.match(/\/keyword\/./)) {
        const [allpath, path] = location.pathname.match(/(\/keyword\/).*/);
        this.$router.push({
          path: `${this.searchBoxText}`,
        })
      }
      this.debouncedGetAnswer();
    }
  },
  computed: {
    //検索レコメンド用。
    currentWord: function() {
      return this.words[this.currentNumber % this.words.length];
    },
    currentInputWord: function() {
      return this.inputwords[this.currentNumber % this.inputwords.length];
    },
  },
  methods: {
    //表示に反映するために、取得したレスポンスを処理する関数
    resisterContent: function(response) {
      const oParser = new DOMParser();
      const oDOM = oParser.parseFromString(response.data, "application/xml");
      const results = oDOM.getElementsByTagName('result');
      //データがない場合もある項目のエスケープ用
      let ansprocElm = oDOM.createElement("ans-proc");
      ansprocElm.innerHTML = ("not found");
      let preresElm = oDOM.createElement("pre-res");
      preresElm.innerHTML = ("not found");
      let bibldescElm = oDOM.createElement("bibl-desc");
      bibldescElm.innerHTML = ("not found");
      let libnameElm = oDOM.createElement("lib-name");
      libnameElm.innerHTML = ("not found");
      let restypeElm = oDOM.createElement("res-type");
      restypeElm.innerHTML = ("not found");
      let crtdateElm = oDOM.createElement("crt-date");
      crtdateElm.innerHTML = ("00000000");
      let keywordsElm = oDOM.createElement("keyword");
      keywordsElm.innerHTML = ("");

      for (const result of results) {
        const question = result.getElementsByTagName("reference")[0].getElementsByTagName("question")[0];
        const answer = result.getElementsByTagName("reference")[0].getElementsByTagName("answer")[0];
        const id = result.getElementsByTagName("reference")[0].getElementsByTagName("sys-id")[0];

        const ansproc = result.getElementsByTagName("reference")[0].getElementsByTagName("ans-proc")[0] || ansprocElm;
        const preres = result.getElementsByTagName("reference")[0].getElementsByTagName("pre-res")[0] || preresElm;
        const bibldesc = result.getElementsByTagName("reference")[0].getElementsByTagName("bibl-desc")[0] || bibldescElm;
        const libname = result.getElementsByTagName("reference")[0].getElementsByTagName("lib-name")[0] || libnameElm;
        const restype = result.getElementsByTagName("reference")[0].getElementsByTagName("res-type")[0] || restypeElm;
        const crtdate = result.getElementsByTagName("reference")[0].getElementsByTagName("crt-date")[0] || crtdateElm;
        const keywords = result.getElementsByTagName("reference")[0].getElementsByTagName("keyword")|| keywordsElm;
        const keywordsArray = Array.prototype.slice.call(keywords);
        const url = result.getElementsByTagName("reference")[0].getElementsByTagName("url")[0];
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
          questionAll: question.innerHTML.replace(/\n/g, "<BR>") + '\n',
          answer: answer.innerHTML.slice(0, 200) + dotanswer,
          answerAll: answer.innerHTML.replace(/\n/g, "<BR>") + '\n',
          id: id.innerHTML,

          ansproc : ansproc.innerHTML.replace(/\n/g, "<BR>") + '\n',
          preres: preres.innerHTML.replace(/\n/g, "<BR>") + '\n',
          bibldesc: bibldesc.innerHTML.replace(/\n/g, "<BR>") + '\n',
          libname: libname.innerHTML.replace(/\n/g, "<BR>") + '\n',
          restype: restype.innerHTML.replace(/\n/g, "<BR>") + '\n',
          crtdate: crtdate.innerHTML.slice(0, 4) + "/" + crtdate.innerHTML.slice(4, 6) + "/" + crtdate.innerHTML.slice(6) + '\n',
          keywords: keywordsArray.map(item => item.innerHTML),
          url: url.innerHTML.replace(/&amp;/g, '&') + '\n',
        };
        this.refqas.push(obj)
      }
      this.$store.commit("clearMessageAction")
      this.$store.commit("setMessageAction", this.refqas)
      //レスポンスの結果数が10（デフォルト）でない場合はもっと検索ボタンを非表示にして、メッセージを表示。
      if (results.length === 10) {
        this.$store.commit("setMoreKeyWordButtonAction", true);
        this.$store.commit("setNoMoreFlagAction", false);
      } else {
        this.$store.commit("setMoreKeyWordButtonAction", false);
        this.$store.commit("setNoMoreFlagAction", true);
      }
      this.refqas = [];
    },
    //キーワード検索用関数
    getAnswer: function() {
      if (this.searchBoxText === '') {
        return;
      }
      this.refqas = [];
      this.$store.commit("setPromptScrollAction", true)
      this.$store.commit("setLoadingAction", true);
      axios.get("https://falmy.herokuapp.com/?keyword=" + this.searchBoxText)
        .then(response => {
          this.resisterContent(response);
          this.$store.commit("setKeyWordAction", this.searchBoxText);
        })
        .catch(error => {
          this.$toasted.show('データ取得に失敗しました。時間を置いて再度お試しください。', {
            position: "top-center",
            duration: 10000
          });
        })
        .finally(() => {
          this.$store.commit("setLoadingAction", false)
          this.$store.commit("setPromptScrollAction", false)
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
      this.$store.commit("setLoadingAction", true)
      this.$store.commit("setPromptScrollAction", true)
      this.$store.commit("setKeyWordAction", "");
      this.refqas = [];
      this.searchBoxText = "";
      const regdate = this.makeRandomDate();
      axios.get("https://falmy.herokuapp.com/random?regdate=" + regdate)
        .then(response => {
          this.$store.commit("clearMessageAction")
          this.resisterContent(response);
        })
        .catch(error => {
          this.$toasted.show('データ取得に失敗しました。時間を置いて再度お試しください。', {
            position: "top-center",
            duration: 10000
          });
          this.$store.commit("setMoreKeyWordButtonAction", true)
        })
        .finally(() => {
          this.$store.commit("setLoadingAction", false)
          this.$store.commit("setPromptScrollAction", false)
        })
    },
    //検索レコメンド用
    next: function() {
      setTimeout(() => {
        this.currentNumber += 1
      }, 3000)
    },
    //検索ボックスに値を入力する関数。
    //同時に検索の前準備として、過去の検索結果をリセットし、検索に使用する変数に検索ワードを代入している。
    setInputBox(searchtext) {
      document.getElementById("searchbox").value = searchtext;
      this.refqas = [];
      this.searchBoxText = searchtext;
    },
    //スマホ用。ソフトウェアキーボードを閉じるために呼ぶ。
    moveNext: function() {
      document.activeElement.blur();
    },
    //resisterContentで処理したデータをstoreに登録する関数
    setMessageAction: function() {
      this.$store.commit("setMessageAction", this.refqas)
    },
  }
}
</script>

<style scoped>
.SearchGroup .description {
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

.SearchGroup .exampletexts {
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

.SearchGroup .exampletexts span {
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
.SearchGroup #searchbox {
  font-family: "YakuHanJPs", 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
  margin: auto;
  padding: 0.5rem 1rem;
  display: block;
  width: 100%;
  font-size: 1.5rem;
  color: f78200;
}

.SearchGroup .random-button {
  font-family: "YakuHanJPs", 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
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

.SearchGroup .or {
  font-size: 1.2rem;
  line-height: 1.3rem;
}

@media screen and (min-width: 768px) {
  .SearchGroup .exampletexts {
    margin: auto;
    font-size: 1.3rem;
    width: 70%;

  }

  .SearchGroup #searchbox {
    margin-top: 30px;
    height: 100px;
    width: 70%;
    font-size: 3rem;
  }

  .SearchGroup .random-button{
    margin: 10px auto;
    font-size: 3rem;
    padding: 1rem 1rem;
    width: 70%;
  }


  .SearchGroup .or {
    font-size: 2rem;
  }


}
</style>
