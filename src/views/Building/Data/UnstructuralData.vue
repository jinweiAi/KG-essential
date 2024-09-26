<template>
  <Navbar />
  <div class="content-container">
    <div class="design"><strong>自定义构建</strong>/非结构化数据</div>
    <span>unstructural-data</span>


  </div>


</template>


<script lang="js">

  import Navbar from "@/components/Navbar.vue";

  export default {
    name:"UnstructuralData",
    components: {Navbar}
  };
</script>

<style>
.content-container {
  margin-left: 20%; /* 给内容部分留出导航栏的宽度 */
  padding: 20px;
  flex-grow: 1; /* 内容部分占据剩余的宽度 */
  overflow-y: auto; /* 如果内容超出页面高度，允许滚动 */
}

.design {
  font-size: 15px;
  padding: 15px;
  background-color: #fef9f9;
  border:1px solid;
  box-sizing: border-box;
  margin-bottom: 15px;
}

</style>