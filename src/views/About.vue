<template>
<div class="about">
  <div class="nav">
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
      <a href="#originalurl">
        <li>元記事URL</li>
      </a>
    </ol>
    <div class="tweet-pc">
      <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false" data-size="large">Tweet</a>
    </div>
  </div>
  <div class="article-detail-container">



    <div class="article-detail" v-for="refqa in refqas">
      <h3 id="question">質問</h3>
      <p v-html="refqa.question"></p>
      <h3 id="answer">回答</h3>
      <p v-html="refqa.answer"></p>
      <h3 id="process">回答プロセス</h3>
      <p v-html="refqa.ansproc"></p>
      <h3 id="preres">事前調査事項</h3>
      <p v-html="refqa.preres"></p>
      <h3 id="originalurl">元記事URL</h3>
      <p v-html="refqa.url"></p>
    </div>
  </div>
  <div class="tweet-sp">
    <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false" data-size="large">Tweet</a>
  </div>
  <div id="gotop">
    <a href="#" id="return-top"><i class="fa fa-chevron-up"></i></a>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      refqas: []
    }
  },
  created() {
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://platform.twitter.com/widgets.js')
    document.head.appendChild(recaptchaScript)
  },
  mounted() {
    //axios.get("http://192.168.1.12:8000/detail?sysid=" + this.$route.params.sysid)
    axios.get("https://falmy.herokuapp.com/detail?sysid=" + this.$route.params.sysid)
      .then(response => {
        const oParser = new DOMParser();
        const oDOM = oParser.parseFromString(response.data, "application/xml");
        const results = oDOM.getElementsByTagName('result');

        let ansprocElm = oDOM.createElement("ans-proc");
        ansprocElm.innerHTML = ("not found");
        let preresElm = oDOM.createElement("pre-res");
        preresElm.innerHTML = ("not found");

        for (const result of results) {
          const question = result.getElementsByTagName("reference")[0].getElementsByTagName("question")[0];
          const answer = result.getElementsByTagName("reference")[0].getElementsByTagName("answer")[0];
          const ansproc = result.getElementsByTagName("reference")[0].getElementsByTagName("ans-proc")[0] || ansprocElm;
          console.log(ansproc);
          const preres = result.getElementsByTagName("reference")[0].getElementsByTagName("pre-res")[0] || preresElm;
          const url = result.getElementsByTagName("reference")[0].getElementsByTagName("url")[0];

          const obj = {
            question: question.innerHTML.replace(/\n/g, "<BR>") + '\n',
            answer: answer.innerHTML.replace(/\n/g, "<BR>") + '\n',
            ansproc: ansproc.innerHTML.replace(/\n/g, "<BR>") + '\n',
            preres: preres.innerHTML.replace(/\n/g, "<BR>") + '\n',
            url: url.innerHTML.replace(/\n/g, "<BR>") + '\n',
          };
          this.refqas.push(obj)
        }
      })
  }
}
</script>

<style>
.nav {
  display: none;
  z-index: 80;
}

.tweet-sp {
  text-align: left;
  margin: 0 auto 15px 30px;
}

.article-detail-container {
  padding: 10px;
  position: relative;
  width: 100%;
  display: flex;
}

.article-detail {
  width: 100%;
  display: block;
  text-align: left;
  padding: 15px;
}

.article-detail h3 {
  border-bottom: 1px solid #999999;
  color: #333;
  font-size: 2rem;
  margin: 0 0 20px;
  padding: 15px 0 10px;
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

@media screen and (min-width: 768px) {
  .tweet-sp {
    display: none;
  }

  .tweet-pc {
    margin-top: 15px;
    text-align: right;
  }

  .article-detail-container {
    padding: 30px;
  }

  .article-detail {
    width: 75%;
  }

  .nav {
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

  .nav h2 {
    font-size: 1rem;
    border-bottom: 1px solid #999999;
    color: #333;
  }

  .nav a {
    text-decoration: none;
    display: block;
    background-color: #666;
    margin-bottom: 10px;
    color: #fff;
  }

  .nav a :hover {
    opacity: 0.7;
  }

  .nav ol {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .nav li {
    padding: 10px 15px;
    font-size: 1.3rem;
    line-height: 3rem;
    list-style: none;
  }
}
</style>
