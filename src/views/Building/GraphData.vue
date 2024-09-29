<template>
  <Navbar :title="title"/>
  <div class="content-container">
    <div class="design"><strong>自定义构建</strong>/图谱数据</div>
    <el-card style="background-color: rgba(169,169,169,0.1)">

    </el-card>
  </div>
</template>

<script  lang="ts">

import Navbar from "@/components/Navbar.vue";
import {computed, onMounted, ref} from 'vue';
import type { ComponentSize } from 'element-plus'; 
import {reactive} from "@vue/runtime-core";

export default {
  name: "GraphData",
  components: {
    Navbar
  },

  setup(){
    const title = localStorage.getItem('ProjectName');
    return{
      title,
    };
  }
}

</script>



<style scoped>



</style>