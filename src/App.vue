<template>
  <Header />
  <!-- 页面内容区域 -->
  <div>
    <router-view /> <!-- 加载页面内容 -->
  </div>
</template>


<script lang="js">
  import Header from "@/components/Header.vue";
  import Navbar from "@/components/Navbar.vue";

  export default {
    components: {Navbar, Header}
  };

</script>


<style scoped>

</style>