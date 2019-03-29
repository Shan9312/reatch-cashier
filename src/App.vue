<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App',
}
</script>

<style lang="less">
 @import url('./assets/css/reset.css');
 @import url('./assets/css/common.less');
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