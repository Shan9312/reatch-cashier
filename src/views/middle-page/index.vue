<template>
  <div>
    <!-- 中间页跳转美团等第三方商户 -->
  </div>
</template>

<script>
  import {
    UtilsFunction
  } from '@/common/utils.js'; // 引用的数据格式处理的 函数

  export default {
    name: 'MiddlePage',
    data() {
      return {
        link: UtilsFunction.getUrlParams('redirect_url')
      }
    },
    computed: {

    },
    created() {
      if (this.link) window.location.replace(url);
    },

    methods: {},
  };
</script>