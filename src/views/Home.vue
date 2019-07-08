<template>
<div class="home">

  <div class="home-top">
  <h2>レファレンス事例協同データベース検索</h2>
  <div>
    <input type="text" id="searchbox" v-model="keyword">
  </div>
  <p v-cloak>
    {{ message }}
  </p>
</div>
<div class="resultswrapper">

    <div class="result" v-for="refqa in refqas">
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

</div>
</template>

<script>
// @ is an alias to /src


export default {
  data() {
    return {
      refqas: [],
      keyword: '',
      message: '',
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
    getAnswer: function() {
      if (this.keyword === '') {
        this.items = null;
        this.message = '';
        return;
      }

      this.message = 'loading...';
      this.refqas = [];
      axios.get("http://192.168.1.12:8000/?keyword=" + this.keyword)
        .then(response => {
          const oParser = new DOMParser();
          const oDOM = oParser.parseFromString(response.data, "application/xml");
          const results = oDOM.getElementsByTagName('result');
          for (const result of results) {
            const question = result.getElementsByTagName("reference")[0].getElementsByTagName("question")[0];
            const answer = result.getElementsByTagName("reference")[0].getElementsByTagName("answer")[0];
            const id = result.getElementsByTagName("reference")[0].getElementsByTagName("sys-id")[0];
            const obj = {
              question: question.innerHTML,
              answer: answer.innerHTML,
              id: id.innerHTML
            };
            this.refqas.push(obj)
          }
        })
      this.message = '';
    }
  },
  mounted() {
    axios.get("http://192.168.1.12:8000/?keyword='読書'")
      .then(response => {
        const oParser = new DOMParser();
        const oDOM = oParser.parseFromString(response.data, "application/xml");
        const results = oDOM.getElementsByTagName('result');
        for (const result of results) {
          const question = result.getElementsByTagName("reference")[0].getElementsByTagName("question")[0];
          const answer = result.getElementsByTagName("reference")[0].getElementsByTagName("answer")[0];
          const id = result.getElementsByTagName("reference")[0].getElementsByTagName("sys-id")[0];
          const obj = {
            question: question.innerHTML.replace(/\n/g, "<BR>").slice(0,150) + "...",
            answer: answer.innerHTML.replace(/\n/g, "<BR>").slice(0,150) + "...",
            id: id.innerHTML
          };
          this.refqas.push(obj)
        }
      })
  }

}
</script>
<style>
.home-top{
  background-color: #ddd;
  min-height: 250px;
  padding: 30px;
  margin-bottom: 30px;
  text-align: center;
}
#searchbox{
  width: 90%;
  margin: 30px auto;
}


.resultswrapper{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
}
.result{
  width: 30%;
  margin-bottom: 30px;
}
.result-question ,.result-answer{
  padding: 20px;
  color: #000;
  text-align: left;
  overflow: hidden;
}
.result-question{
  background-color: #ccc;
  font-size: 1.3rem;
  line-height: 1.6rem;

}

.result-answer{
  background-color: #eee;
  border: 1px solid #ccc;
}
@media screen and (max-width: 768px){
  .resultswrapper{
    flex-flow: column;
    width: 90%;
    margin: 0 auto;
  }
  .result{
    width: 100%;
  }
}
</style>
