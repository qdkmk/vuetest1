<template>
<div class="Sns">

  <ul>
    <!-- Facebook -->
    <li>
      <a :href="fbUrl" target="_blank">hreherh<img src="fb.png"></a>
    </li>
    <!-- Twitter -->
    <li>
      <a :href="twUrl" target="_blank">tweet<img src="tw.png"></a>
    </li>
    <!-- はてブ -->
    <li>
      <a :href="hbUrl" target="_blank">はてぶ<img src="hb.png"></a>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  'name': 'Sns',
  data: function() {
    return {
      // Facebookのシェア用URL 空でもOK
      fbUrl: '',
      twUrl: '',
      hbUrl: '',
    }
  },
  methods: {

    // シェア用のURLを作成します。

    createSnsUrl: function() {
      // 現在のurlをエンコード
      var url = encodeURIComponent(location.href);
      // Facebook用のurl作成
      this.fbUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + url;

      var txt = encodeURIComponent(document.querySelector("title").innerHTML);
      this.twUrl = 'https://twitter.com/intent/tweet?text=' + txt + '&hashtags=レファレンス事例' + '&url=' + url;

      this.hbUrl = 'https://b.hatena.ne.jp/add?mode=confirm&title=' + txt + '&url=' + url;
    }
  },
  created: function() {
    // 初期表示時
    this.createSnsUrl();
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
