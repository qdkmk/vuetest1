<template>
<div class="home">

  <p>{{msg}}</p>
  <div class="columns medium-3" v-for="refqa in refqas">
    <div class="card">
      <router-link :to="{ name: 'about', params: { sysid: refqa.id }}" >
        <div class="card-divider">
          {{ refqa.question }}
        </div>
        <div class="card-section">
          <p>{{ refqa.answer }}.</p>
        </div>
      </router-link > |
    </div>
  </div>
</div>
</template>

<script>
// @ is an alias to /src


export default {
  data() {
    return {
      msg: 'Heello World!',
      refqas: []
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
            question: question.innerHTML,
            answer: answer.innerHTML,
            id: id.innerHTML
          };
          this.refqas.push(obj)
        }
      })
  }
}
</script>
