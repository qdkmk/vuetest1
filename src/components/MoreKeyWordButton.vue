<template>
  <div class="MoreKeyWordButton">
<button v-on:click="getMoreKeyword" class="more-button">もっと検索</button>

  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'MoreKeyWordButton',

  data(){
    return{
    refqas : [],
    }
  },
  methods: {
    //もっとキーワード検索用関数
    getMoreKeyword: function() {
      this.$store.commit("setLoadingAction",true)
      this.$store.commit("setPromptScrollAction",true)
      const regdate = this.makeRandomDate();
      //キーワードが入力されていない時＝「ランダムに表示(getrandom関数)」ボタンで呼び出されたときは
      //ランダムに検索できるようにquerytextに「""」を代入し、
      //https://falmy.herokuapp.com/more?keyword=''&regdate=「ランダム8桁」で検索している。
      let querytext = this.$store.state.keyword;
      if (this.$store.state.keyword === "") {
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
          this.$store.commit("setLoadingAction",false)
          this.$store.commit("setPromptScrollAction",false)
        })
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
          questionAll: question.innerHTML,
          answer: answer.innerHTML.slice(0, 200) + dotanswer,
          answerAll: answer.innerHTML,
          id: id.innerHTML,
        };
        this.refqas.push(obj)
      }
      this.$store.commit("setMessageAction", this.refqas)
      //レスポンスの結果数が10（デフォルト）でない場合はもっと検索ボタンを非表示にして、メッセージを表示。
      if (results.length === 10) {
        this.$store.commit("setMoreKeyWordButtonAction", true);
        this.$store.commit("setNoMoreFlagAction", false);
      } else {
        this.$store.commit("setMoreKeyWordButtonAction", false);
        this.$store.commit("setNoMoreFlagAction", true);
      }
      this.refqas=[];
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
    //resisterContentで処理したデータをstoreに登録する関数
    setMessageAction: function() {
      this.$store.commit("setMessageAction", this.refqas)
    },
  }
}
</script>

<style scoped>

.more-button {
  font-family:"YakuHanJPs", 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
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
  width: 90%;
}


@media screen and (min-width: 768px) {
  .more-button {
    margin: 10px auto;
    font-size: 2rem;
    padding: 1rem 1rem;
    width: 40%;;
  }

}
</style>
