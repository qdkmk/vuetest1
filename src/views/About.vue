<template>
<div class="about">
  <h1>This is an about page</h1>
  <h2>この記事のシステムIDは{{$route.params.sysid}}です。</h2>
  <div class="article-detail-container">
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
    </div>


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


</div>
</template>


<script>
// @ is an alias to /src


export default {
  data() {
    return {
      refqas: []
    }
  },

  mounted() {
    axios.get("http://192.168.1.12:8000/detail?sysid=" + this.$route.params.sysid)
      .then(response => {
        const oParser = new DOMParser();
        const oDOM = oParser.parseFromString(response.data, "application/xml");
        const results = oDOM.getElementsByTagName('result');


        let ansprocElm = oDOM.createElement("ans-proc");
        ansprocElm.innerHTML=("not found");
        let preresElm = oDOM.createElement("pre-res");
        preresElm.innerHTML=("not found");



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
            ansproc:ansproc.innerHTML.replace(/\n/g, "<BR>")  + '\n',
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



.article-detail-container {
  position: relative;
  width: 100%;
  padding: 30px;
  display: flex;
}

.article-detail {
  display: block;
  width: 75%;
  text-align: left;
  padding: 15px;
}

.article-detail h3 {
  border-bottom: 1px solid #999999;
  color: #333;
  font-size: 30px;
  margin: 0 0 20px;
  padding: 15px 0 10px;
}

.nav {
  background-color: #ddd;
  position: absolute;
  display: block;
  right:0;
  top:0;
  text-align: left;
  width: 20%;
  margin-right: 3%;
  padding: 15px;
}
.nav h2{
  font-size: 20px;
  border-bottom: 1px solid #999999;
  color: #333;
}
.nav a {
  text-decoration: none;
}

.nav li {
  font-size: 25px;
  list-style: none;
}
@media screen and (max-width: 768px){
  .nav{
  display: none;
  }
  .article-detail-container {
    padding: 10px;
  }
  .article-detail {
    width: 100%;
}
}
</style>
