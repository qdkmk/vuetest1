<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2>この記事のシステムIDは{{$route.params.sysid}}です。</h2>

    <div class="columns" v-for="refqa in refqas">
      <div class="card">
          <div class="card-divider">
            <span v-html="refqa.question"></span>
          </div>
          <div class="card-section">
            <span v-html="refqa.answer"></span>
          </div>
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
    axios.get("http://localhost:8000/detail?sysid=" + this.$route.params.sysid)
      .then(response => {
        const oParser = new DOMParser();
        const oDOM = oParser.parseFromString(response.data, "application/xml");
        const results = oDOM.getElementsByTagName('result');
        for (const result of results) {
          const question = result.getElementsByTagName("reference")[0].getElementsByTagName("question")[0];
          const answer = result.getElementsByTagName("reference")[0].getElementsByTagName("answer")[0];
          const id = result.getElementsByTagName("reference")[0].getElementsByTagName("sys-id")[0];
          const obj = {
            question: question.innerHTML.replace(/\n/g,"<BR>") +'\n',
            answer: answer.innerHTML.replace(/\n/g,"<BR>") +'\n',
            id: "http://crd.ndl.go.jp/reference/detail?page=ref_view&id=" + id.innerHTML
          };
          this.refqas.push(obj)
        }
      })
  }
}
</script>
