<template>
  <div id="app">
    <div id="nav">
      <!--
      <router-link to="/">Home</router-link> |
      <router-link :to="{ name: 'about', params: { sysid:'1000083444' }}" >About</router-link > |
      -->
      <a href="#">About Me</a>
      <span>|</span>
      <a href="#">このwebアプリについて</a>
    </div>
    <router-view/>
    <div class="footer">

    </div>
  </div>
</template>

<style>
*{
  box-sizing: border-box;
}
body{
  margin: 0;
}
a{
  text-decoration: none;
}
#app {
  font-family: 'Roboto','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 10px;
  display: flex;
  justify-content: space-around;
  background-color: #333;
  color: #fff;
}

#nav a {
  color: #fff;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.footer{
  padding: 15px;
  background: #333;
}
</style>
