<template>
<div class="detail">
  <div class="detail-nav">
    <h2>目次</h2>
    <ol>
      <a href="#question">
        <li>質問</li>
      </a>
      <a href="#answer">
        <li>回答</li>
      </a>
      <a href="#process">
        <li>回答プロセス</li>
      </a>
      <a href="#preres">
        <li>事前調査事項</li>
      </a>
      <a href="#bibldesc">
        <li>参考資料</li>
      </a>
      <a href="#libname">
        <li>提供館</li>
      </a>
      <a href="#restype">
        <li>調査種別</li>
      </a>
      <a href="#crtdate">
        <li>事例作成日</li>
      </a>
      <a href="#originalurl">
        <li>元記事URL</li>
      </a>
      <a href="#keyword">
        <li>キーワード</li>
      </a>
    </ol>
    <div class="detail-tweet-pc">
      <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false" data-size="large">Tweet</a>
    </div>
  </div>
  <div class="article-detail-container">



    <div class="article-detail">
      <h3 id="question">質問</h3>
      <p v-html="question"></p>
      <h3 id="answer">回答</h3>
      <p v-html="answer"></p>
      <h3 id="process">回答プロセス</h3>
      <p v-html="ansproc"></p>
      <h3 id="preres">事前調査事項</h3>
      <p v-html="preres"></p>
      <h3 id="bibldesc">参考資料</h3>
      <p v-html="bibldesc"></p>
      <h3 id="libname">提供館</h3>
      <p v-html="libname"></p>
      <h3 id="restype">調査種別</h3>
      <p v-html="restype"></p>
      <h3 id="crtdate">事例作成日</h3>
      <p v-html="crtdate"></p>
      <h3 id="originalurl">元記事URL</h3>
      <a v-bind:href="url">
      <p v-html="url"></p>
      </a>
      <h3 id="keyword">キーワード</h3>
      <span v-for="keyword in keywords" class="tag" v-bind:key=keyword>
        <a v-bind:href="'https://testreftika.web.app/keyword/' + keyword">{{keyword}}</a>
        <!--<a v-bind:href="'http://localhost:8081/keyword/' + keyword">{{keyword}}</a>-->
      </span>
    </div>
  </div>
  <div class="detail-tweet-sp">
    <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false" data-size="large">Tweet</a>
  </div>
  <div id="gotop">
    <a href="#" id="return-top"><i class="fa fa-chevron-up"></i></a>
  </div>
  <img v-show="loading" class="loader" src="../assets/tail-spin.svg"></img>
</div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      refqas: [],
      loading:false,
      sharedState: this.$store.state,
      question : "",
      answer : "",
      ansproc : "",
      preres : "",
      bibldesc : "",
      libname : "",
      restype : "",
      crtdate : "",
      keywords : "",
      url : ""
    }
  },
  created() {
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://platform.twitter.com/widgets.js')
    document.head.appendChild(recaptchaScript)

    //Home.vueから（＝Modal.vueから）のアクセスでない場合は、get関数でデータ取得
    //Home.vueから（＝Modal.vueから）のアクセスの場合はstoreのデータを使用する。
    if (this.$store.state.message[this.$route.params.num] === undefined) {
      this.get();
    } else {
      this.question= this.$store.state.message[this.$route.params.num].questionAll,
      this.answer= this.$store.state.message[this.$route.params.num].answerAll,
      this.ansproc= this.$store.state.message[this.$route.params.num].ansproc,
      this.preres= this.$store.state.message[this.$route.params.num].preres,
      this.bibldesc= this.$store.state.message[this.$route.params.num].bibldesc,
      this.libname= this.$store.state.message[this.$route.params.num].libname,
      this.restype= this.$store.state.message[this.$route.params.num].restype,
      this.crtdate= this.$store.state.message[this.$route.params.num].crtdate,
      this.keywords= this.$store.state.message[this.$route.params.num].keywords,
      this.url= this.$store.state.message[this.$route.params.num].url
    }
  },
  methods: {
    reflesh: function() {
      this.$store.commit("clearMessageAction");
    },
    get: function() {
      this.loading = true;
      axios.get("https://falmy.herokuapp.com/detail?sysid=" + this.$route.params.sysid)
        .then(response => {
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
          const ansproc = result.getElementsByTagName("reference")[0].getElementsByTagName("ans-proc")[0] || ansprocElm;
          const preres = result.getElementsByTagName("reference")[0].getElementsByTagName("pre-res")[0] || preresElm;
          const bibldesc = result.getElementsByTagName("reference")[0].getElementsByTagName("bibl-desc")[0] || bibldescElm;
          const libname = result.getElementsByTagName("reference")[0].getElementsByTagName("lib-name")[0] || libnameElm;
          const restype = result.getElementsByTagName("reference")[0].getElementsByTagName("res-type")[0] || restypeElm;
          const crtdate = result.getElementsByTagName("reference")[0].getElementsByTagName("crt-date")[0] || crtdateElm;
          const keywords = result.getElementsByTagName("reference")[0].getElementsByTagName("keyword") || keywordsElm;
          const keywordsArray = Array.prototype.slice.call(keywords);
          const url = result.getElementsByTagName("reference")[0].getElementsByTagName("url")[0];
          this.question = question.innerHTML.replace(/\n/g, "<BR>") + '\n',
            this.answer = answer.innerHTML.replace(/\n/g, "<BR>") + '\n',
            this.ansproc = ansproc.innerHTML.replace(/\n/g, "<BR>") + '\n',
            this.preres = preres.innerHTML.replace(/\n/g, "<BR>") + '\n',
            this.bibldesc = bibldesc.innerHTML.replace(/\n/g, "<BR>") + '\n',
            this.libname = libname.innerHTML.replace(/\n/g, "<BR>") + '\n',
            this.restype = restype.innerHTML.replace(/\n/g, "<BR>") + '\n',
            this.crtdate = crtdate.innerHTML.slice(0, 4) + "/" + crtdate.innerHTML.slice(4, 6) + "/" + crtdate.innerHTML.slice(6) + '\n',
            this.keywords = keywordsArray.map(item => item.innerHTML),
            this.url = url.innerHTML.replace(/&amp;/g, '&') + '\n'
          }
        })
        .catch(error => {
          this.$toasted.show('データ取得に失敗しました。時間を置いて再度お試しください。', {
            position: "top-center",
            duration: 10000
          });
        })
        .finally(()=>{
          this.loading = false;
        });
    }
  },
  mounted() {


}
}
</script>

<style scoped>
.detail-nav {
  display: none;
  z-index: 80;
}

.detail-tweet-pc {
  display: none;
}

.detail-tweet-sp {
  display: block;
  text-align: left;
  margin: 0 auto 15px 25px;
}

.article-detail-container {
  padding: 10px;
  position: relative;
  width: 100%;
  display: flex;
}

.article-detail-container .article-detail {
  width: 100%;
  display: block;
  text-align: left;
  padding: 15px;
}

.article-detail-container .article-detail h3 {
  border-bottom: 1px solid #999999;
  color: #333;
  font-size: 2rem;
  margin: 0 0 20px;
  padding: 15px 0 10px;
}

.article-detail-container .article-detail a {
  color: #000;
}

.article-detail-container .article-detail a:hover {
  opacity: 0.7;
}

#return-top {
  background-color: #333;
  border-radius: 50%;
  color: #fff;
  font-size: 1rem;
  height: 50px;
  line-height: 50px;
  outline: 0;
  position: fixed;
  bottom: 20px;
  right: 20px;
  text-align: center;
  width: 50px;
  z-index: 80;
}

.article-detail-container .article-detail .tag {
  display: inline-block;
  margin: 5px;
  padding: 5px;
  background-color: #f78200;
  border-radius: 3px;
}

.article-detail-container .article-detail .tag a {
  color: #fff;
}
/*
loader
*/
.loader {
  display: block;
  width: 15%;
  height: 15%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateY(-50%);
  transform: translateX(-50%);
  z-index: 10;
}
@media screen and (min-width: 768px) {
  .detail-tweet-sp {
    display: none;
  }

  .detail-tweet-pc {
    display: block;
    margin-top: 10px;
    text-align: left;
  }

  .article-detail-container {
    padding: 30px;
    width: 70%;
  }

  .article-detail {
    line-height: 1.6rem;
  }

  .detail-nav {
    display: block;
    background-color: #ddd;
    position: fixed;
    right: 0;
    height: 100vh;
    text-align: left;
    width: 20%;
    margin-right: 3%;
    padding: 15px;
  }

  .detail-nav h2 {
    font-size: 1rem;
    border-bottom: 1px solid #999999;
    color: #333;
    margin-top: 0px;
  }

  .detail-nav a {
    text-decoration: none;
    display: block;
    background-color: #666;
    margin-bottom: 10px;
    color: #fff;
  }

  .detail-nav a :hover {
    opacity: 0.7;
  }

  .detail-nav ol {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .detail-nav li {
    padding: 5px 15px;
    font-size: 1.1rem;
    line-height: 1.8rem;
    list-style: none;
  }
}
</style>
