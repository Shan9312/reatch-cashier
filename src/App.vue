<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
  export default {
    name: 'App',
  }
</script>

<style lang="less">
  @import "assets/css/common.less";
  @import "assets/css/reset.css";

  #app {
    width: 100%;
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    font-size: 0.2rem;
  }
</style>