<template>
<div class="aboutservice">
<h1>reftikaについて</h1>
<div class="service-description">
<p>reftikaはレファレンス協同データベースからの『簡易キーワード検索』と『ランダムピックアップ表示機能』を提供する非公式・個人運営のサービスです。
  beta版のため、動作はちょっと重めです。
少しでも多くの方にレファレンスサービス利用の気軽さと面白さ、奥深さを知っていただけるようなサービスを目指しています。</p>
<hr class="dot">
<p>ユニークなレファレンス事例は、レファレンス協同データベースの
<a href="http://crd.ndl.go.jp/jp/library/user_general.html">レファ協活用術！</a>
のページなどで紹介されています。
</p>
<p>例えば、以下のようなレファレンス事例があります。</p>
<div class="service-sample-wrapper">
<div class="service-sample">
<a href="http://crd.ndl.go.jp/reference/detail?page=ref_view&id=1000070023">カラスが石鹸を食べるというのは事実か。また、なぜ石鹸を食べるのか。（鳥取県立図書館）</a>
</div>
<div class="service-sample">
<a href="http://crd.ndl.go.jp/reference/detail?page=man_view&id=2000012251">クラシック音楽作品の日本での演奏記録を調べる（桐朋学園大学音楽学部附属図書館）</a>
</div>
<div class="service-sample">
  <a href="http://crd.ndl.go.jp/GENERAL/servlet/detail.reference?id=1000027085">自転車のことを「チャリンコ」「ママチャリ」「ケッタマシーン」などと呼ぶが、どういう語源か。 （岐阜県図書館）</a>
</div>
<div class="service-sample">
  <a href="http://crd.ndl.go.jp/reference/detail?page=ref_view&id=1000088556">ショッピングセンターにおける、テナントとの契約についての書式が載っている資料を探している。（横浜市中央図書館）</a>
</div>
</div>
<p>
  レファレンス協同データベースのウェブサイトや、このサイトの『簡易キーワード検索』・『ランダムピックアップ表示機能』をぜひ利用して、様々なレファレンス事例を見つけてみてください！
  </p>
  <hr class="dot">
  <p>
  このサイトは、レファレンス協同データベースの外部提供インタフェース(API)を利用しています。
  </p>
</div>
<a class="bannerwrapper" href="http://crd.ndl.go.jp/reference/">
<img class="banner" src="/img/crd_bn04.gif" />
</a>
</div>

</template>

<script>
export default {
  data() {
    return {
    }
  },
}
</script>

<style>
h1{
  font-weight: 300;
  margin-bottom: 15px;
}
.aboutservice{
  margin: auto;
  font-size: 1rem;
  line-height: 1.75rem;
  font-weight: 300;
  letter-spacing: 0.1rem;
  padding: 10px 15px 15px;
}
.service-description{
  padding: 15px;
}
.service-description .service-sample{
  background-color: #eee;
  padding: 15px;
  margin-bottom:15px;
}
.service-description .service-sample:hover{
  opacity: 0.8;
}
.service-description a{
  color: #000;
}
hr.dot{
  border-top: 1px dashed #8c8b8b;
  border-bottom: 1px dashed #fff;
}
.bannerwrapper{
  display: block;
  margin-bottom: 15px;
}
.banner{
  margin: auto;
  width: 300px;
}
@media screen and (min-width: 768px) {
  .aboutservice{
    padding: 30px;
  }
  .service-description{
    width: 60%;
    margin: auto;
  }
  .service-sample-wrapper{
    display: flex;
    flex-flow:row;
    flex-wrap:wrap;
    justify-content:center;

  }
  .service-sample{
    width: 35%;
    margin: 15px;

  }
}
</style>
