<template>
<div id="app">
  <div id="nav">
    <a class="nav-top" href="https://testreftika.web.app/">Top</a>
    <span class="nav-span">|</span>
    <router-link class="nav-service" :to="{ name: 'aboutservice'}">
      <span>このwebアプリについて</span>
    </router-link>
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
  display: flex;
  justify-content: space-around;
  background-color: #333;
  color: #fff;
}

#nav a {
  color: #fff;
}

#nav a.router-link-exact-active {
  color: #fff;
}
.nav-top,
.nav-service{
  padding: 10px;
}
.nav-top:hover,
.nav-service:hover{
  opacity: 0.8;
}
.nav-top{
  display: block;
  width: 35%;
}
.nav-service{
  width: 65%;
}
.nav-span{
  padding: 10px;
}

.footer {
  z-index: 99;
  position: relative;
  padding: 15px;
  background: #333;
}
</style>
