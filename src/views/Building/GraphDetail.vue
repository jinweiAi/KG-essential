<template>
  <Navbar :title="title"/>
  <div class="content-container">
    <div class="design"><strong>{{buildMethod}}</strong>/图谱详情</div>
  </div>
</template>


<script lang="ts">

import Navbar from "@/components/Navbar.vue";
export default {
  name: "GraphDetail",
  components: {Navbar},
  setup() {
    const title = sessionStorage.getItem('ProjectName');
    const buildMethod = (sessionStorage.getItem('ProjectBuild')==="custom")?"自定义构建":"模版构建";
    const graphId = sessionStorage.getItem('ProjectId');

    return{
      title,
      buildMethod,
      graphId,
    }
  },
}
</script>



<style scoped>
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