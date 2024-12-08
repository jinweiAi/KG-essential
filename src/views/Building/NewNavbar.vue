<!-- Navbar.vue -->
<template>
  <!--侧边栏-->
  <el-aside>
    <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical-demo"
        @select="handleSelect"
        unique-opened
        router
    >
      <header style="background-color: rgba(169,169,169,0.5)">
        <div class="title-inner">{{ title }}</div>
      </header>
      <!-- 带有子列表的菜单项 -->
      <el-sub-menu index="Data">
        <template #title>
          <el-icon><Histogram /></el-icon>
          <span><pre>   数据管理</pre></span>
        </template>
        <el-menu-item index="StructuralData" :disabled="buildMethod==='自定义构建'"><pre>  结构化数据</pre></el-menu-item>
        <el-menu-item index="UnstructuralData" :disabled="buildMethod==='模版构建'"><pre>  非结构化数据</pre></el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="Design">
        <template #title>
          <el-icon><Suitcase /></el-icon>
          <span><pre>   本体设计</pre></span>
        </template>
        <el-menu-item index="LLMDesign"><pre>  大语言模型设计</pre></el-menu-item>
        <el-menu-item index="EntityDesign"><pre>  实体设计</pre></el-menu-item>
        <el-menu-item index="RelationDesign"><pre>  关系设计</pre></el-menu-item>
      </el-sub-menu>

      <!-- 另一个带子菜单的项 -->
      <el-sub-menu index="GraphMapping">
        <template #title>
          <el-icon><DataLine /></el-icon>
          <span><pre>   图谱映射</pre></span>
        </template>
        <el-menu-item index="StructuredMapping" :disabled="buildMethod==='自定义构建'"><pre>  结构化映射</pre></el-menu-item>
        <el-menu-item index="UnstructuredMapping" :disabled="buildMethod==='模版构建'"><pre>  非结构化映射</pre></el-menu-item>
      </el-sub-menu>

      <!-- 没有子菜单的菜单项 -->
      <el-menu-item index="GraphData">
        <el-icon><Grid /></el-icon>
        <span>图谱数据</span>
      </el-menu-item>

      <el-menu-item index="GraphDetail">
        <template #title>
          <el-icon><More /></el-icon>
          <span>图谱详情</span>
        </template>
      </el-menu-item>

      <!-- 没有子菜单的菜单项 -->

      <div class="out_container">
        <el-button type="text" class="out_button" size="large" @click="out2GraphListPage">退出当前图谱</el-button>
      </div>

    </el-menu>



  </el-aside>

</template>

<script setup>
import {onMounted, ref} from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { Suitcase,Histogram,DataLine,Grid,More } from '@element-plus/icons-vue';
const router = useRouter()
const route = useRoute()
const activeIndex = ref('EntityDesign') // 默认选中的菜单项
const title = sessionStorage.getItem('ProjectName')
const buildMethod = sessionStorage.getItem('ProjectBuild');

console.log("buildMethod",buildMethod)

onMounted(()=>{
  activeIndex.value = route.name || 'EntityDesign'; // 使用当前的路由名称或默认值
})

const handleSelect = (key) => {
  console.log(`Selected: ${key}`);
  activeIndex.value=key;
  // router.push({
  //   path:"/"+key
  // })
};

const out2GraphListPage=()=>{
  console.log("out2GraphListPage")
  router.push({
    path: '/',
  });
}

</script>

<style >
template{
  /* 100%窗口高度 */
  height: 100%;
  /* 弹性布局 居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e2c8db;
}

el-aside{
  /* 固定定位 */
  position: fixed;
  width: 300px;
  height: 650px;
  background-color: #c584b3;
}
</style>