<template>
<div class="resultswrapper" id="resultswrapper">
  <div class="result" v-for="(refqa,index) in sharedState.message" v-bind:key='index'>

    <div  v-on:click="toggleDetail(index)" >
    <div class="result-question">
      <p v-html="refqa.question"></p>
    </div>
    <div class="result-answer">
      <p v-html="refqa.answer" ></p>
    </div>
</div>

  </div>
  <div class="no-more" v-show="sharedState.noMoreFlag">
    <p>検索結果は以上です。</p>
  </div>
  <Modal  @close="toggleDetail(modalIndex)" class="modal" v-if="isDetail[modalIndex]" :question=sharedState.message[modalIndex].questionAll :answer=sharedState.message[modalIndex].answerAll :id=sharedState.message[modalIndex].id :num=modalIndex />
</div>
</template>

<script>
import Modal from "./Modal.vue"
//storeのデータを参照して結果を表示する
export default {
  components: { Modal },
  name: 'Result',
  data() {
    return {
      sharedState: this.$store.state,
      isDetail: [],
      modalIndex:0
    }
  },
  computed: {
    attrs: function() {
      return function(index,isDetail) {
        return this.isDetail[index]? this.sharedState.message[index].answerAll: this.sharedState.message[index].answer
        }
      }
    },
    methods:{
      toggleDetail:function(index){
        this.$set(this.isDetail, index, !this.isDetail[index]);
        this.modalIndex = index;
      }
    }
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

.no-more {
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
