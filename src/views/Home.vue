<template>
<div class="home">

  <div class="home-top">
    <div class="toptitle">
      <div class="pc-top-title">
        <h1>レファ協<br>ランダム検索</h1>
      </div>
      <img class="sp-top" src="/img/sp-top.png" />
      <div class="description">
        <p>レファレンス協同データベースからの<br>『簡易キーワード検索』と『ランダムピックアップ表示機能』を提供する個人運営のサービスです。beta版のため、動作はちょっと重めです。</p>
        <p>求める情報を探すよりは、セレンディピティを楽しむことがコンセプトのサ―ビスです。</p>
      </div>
    </div>

    <div class="topbox">
      <SearchGroup :keyword=this.keyword />
    </div>
    <div class="tweet">
      <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false" data-size="large">Tweet</a>
    </div>
    <div class="scroll-container">
      <a v-show="sharedState.promptScroll" class="scroll" href="#"><span></span><span></span><span></span></a>
    </div>
  </div>
  <Result />
  <MoreKeyWordButton v-show="sharedState.moreKeyword" />
  <img v-show="sharedState.loading" class="loader" src="../assets/tail-spin.svg"></img>
</div>
</template>

<script>
import SearchGroup from "../components/SearchGroup"
import MoreKeyWordButton from "../components/MoreKeyWordButton"
import Result from "../components/Result"

export default {
  components: {
    SearchGroup,
    MoreKeyWordButton,
    Result
  },

  data() {
    return {
      keyword: '',
      sharedState: this.$store.state,
    }
  },
  created: function() {
    //Detailからのリンク用。/keyword/へのアクセスの場合は検索ボックスにパラメーターを入力する。
    if (location.pathname.match(/\/keyword\/./)) {
      this.keyword = this.$route.params.keyword
    }
    //twitterのjs読み込み
    let recaptchaScript = document.createElement('script');
    recaptchaScript.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    document.head.appendChild(recaptchaScript);
  },

}
</script>
<style>
/*
全体
*/
.home {
  background-color: #fff;
}

.home-top {
  background-color: #f78200;
  min-height: 95vh;
  padding: 30px;

  text-align: center;
  color: #fff;
}

.home-top .toptitle .pc-top-title {
  display: none;
}

.home-top .toptitle .pc-top-title h1 {
  font-size: 2.5rem;
  line-height: 3rem;
}

.home-top .toptitle .sp-top {
  display: block;
  width: 100%;
}


.home-top .tweet {
  margin: 15px auto 0;
}

/*
loader
*/
.loader {
  width: 15%;
  height: 15%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateY(-50%);
  transform: translateX(-50%);
  z-index: 10;
}

/*
scroll prompt
*/
.scroll {
  padding-top: 80px;
}

.scroll span {
  z-index: 100;
  position: fixed;
  bottom: 30px;
  left: 50%;
  width: 30px;
  height: 30px;
  margin-left: -12px;
  border-left: 1px solid #fff;
  border-bottom: 1px solid #fff;
  transform: rotate(-45deg);
  animation: sdb 2s infinite;
  opacity: 0;
  box-sizing: border-box;
}

.scroll span:nth-of-type(1) {}

.scroll span:nth-of-type(2) {
  bottom: 40px;
  animation-delay: .15s;
}

.scroll span:nth-of-type(3) {
  bottom: 50px;
  animation-delay: .3s;
}

@keyframes sdb {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}


/*
pc用レスポンシブ設定
*/
@media screen and (min-width: 768px) {
  .home-top {
    display: flex;
    flex-flow: wrap;
  }

  .home-top .toptitle {
    display: block;
    width: 50%;
    padding: 30px;
    margin: auto;
  }

  .home-top .topbox {
    width: 50%;
    margin: auto;
    padding-top: 100px;

  }

  .home-top .toptitle .pc-top-title h1 {
    font-size: 4rem;
    line-height: 5rem;
    margin: 30px auto;
    font-weight: 700;
    letter-spacing: 0.05rem;
  }


  .home-top .tweet {
    z-index: 100;
    position: fixed;
    right: 30px;
    bottom: 30px;
  }

  /*
  検索結果
  */
  .home-top .loader {
    display: block;
  }

}
</style>
