<template>
<div class="resultswrapper" id="resultswrapper">
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
  <div class="no-more" v-show="sharedState.noMoreFlag">
    <p>検索結果は以上です。</p>
  </div>
</div>
</template>

<script>
//storeのデータを参照して結果を表示する
export default {
  name: 'Result',
  data() {
    return {
      sharedState: this.$store.state,
    }
  },
  props: {},
}
</script>

<style scoped>
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
  text-align: justify;
  overflow: hidden;
}

.resultswrapper .result .result-question {
  background-color: #eee;
  border: 1px solid #ddd;
  font-size: 1.3rem;
  line-height: 1.8rem;
  letter-spacing: 0.03rem;

}

.resultswrapper .result .result-answer {
  background-color: #fff;
  border: 1px solid #eee;
  line-height: 1.4rem;
  text-align: justify;
}
.no-more{
  display: block;
  width: 100%;
}

/*
  pc用レスポンシブ設定
  */
@media screen and (min-width: 768px) {

  /*
    検索結果
    */

  .resultswrapper {
    margin: 0px auto 0;
    flex-flow: wrap;
    width: 100%;
  }

  .resultswrapper .result {
    width: 30%;
  }

  .resultswrapper .result .result-question {
    font-size: 1.4rem;
    line-height: 1.8rem;
    letter-spacing: 0.06rem;
  }

  .resultswrapper .result .result-answer {
    line-height: 1.6rem;
    letter-spacing: 0.05rem;
  }

}
</style>
