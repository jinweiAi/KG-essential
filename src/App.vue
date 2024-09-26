<template>
  <Header/>
  <!-- 页面内容区域 -->
  <div>
    <router-view /> <!-- 加载页面内容 -->
  </div>
</template>


<script lang="js">

    // import Navbar from "@/components/Navbar.vue";
    import Header from "@/components/Header.vue";
    import Navbar from "@/components/Navbar.vue";

    export default {
      components: {Navbar, Header}
    };

</script>


<style>
.content-container {
  margin-left: 20%; /* 给内容部分留出导航栏的宽度 */
  padding: 20px;
  flex-grow: 1; /* 内容部分占据剩余的宽度 */
  overflow-y: auto; /* 如果内容超出页面高度，允许滚动 */
}

</style>