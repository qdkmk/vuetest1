<template>
<div id="app">
  <div id="nav">
    <a href="#">About Me</a>
    <span>|</span>
    <a href="#">このwebアプリについて</a>
  </div>
  <router-view />
  <div class="footer">
  </div>
</div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

a {
  text-decoration: none;
}

#app {
  font-family: 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  z-index: 99;
  position: relative;
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

.footer {
  z-index: 99;
  position: relative;
  padding: 15px;
  background: #333;
}
</style>
