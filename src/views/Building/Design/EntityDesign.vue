<template>
  <!--  <Navbar />-->
  <div class="design">自定义构建/实体设计</div>
  <div class="content-container">
    <div class="left-section">
      <div class="button and con">
         <h2 class="section-title">实体类型列表</h2>
      </div>
      <div class="table-box">
        <button class="add-button">添加实体类型</button>
        <el-table :data="leftTableData" style="width: 100%">
          <el-table-column prop="entityType" label="实体类型"  />
          <el-table-column prop="disambiguationFlag" label="消歧标识"  />
          <el-table-column prop="color" label="颜色" />
          <el-table-column prop="operation" label="操作"  />
        </el-table>
      </div>
    </div>
    <div class="right-section">
      <div class="button and con">
          <h2 class="section-title">属性列表</h2>
      </div>
      <div class="table-box">
        <button class="add-button">添加实体属性</button>
        <el-table :data="rightTableData" style="width: 100%">
          <el-table-column prop="attributeName" label="属性名称"  />
          <el-table-column prop="dataType" label="数据类型"  />
          <el-table-column prop="unit" label="单位"  />
          <el-table-column prop="operation" label="操作" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref } from 'vue';

// 左侧表格数据
const leftTableData = ref([]);

// 右侧表格数据
const rightTableData = ref([]);

// 添加实体类型
const addEntityType = () => {
  // 添加实体类型的逻辑
  console.log("添加实体类型");
};

// 添加实体属性
const addAttribute = () => {
  // 添加实体属性的逻辑
  console.log("添加实体属性");
};
</script>


<style scoped>
.design {
  width: calc(100% - 10px); /* 除去侧边栏宽度 */
  font-size: 20px; /* 字号加大 */
  padding: 10px; /* 内边距增加空间 */
  background-color: #f0f0f0; /* 背景颜色以便框显示 */
  border: 1px solid #ccc; /* 边框显示框 */
  box-sizing: border-box; /* 包括边框和内边距在内的宽度计算 */
  margin-bottom: 0; /* 确保与下方内容区域没有额外间隔 */
  margin-left: 10px;
}

.content-container {
  display: flex;
  justify-content: space-between;
  margin-top: 30px; /* 确保与上方 .design 区域没有间隔 */
  margin-left: 10px;
  height: calc(100vh - 80px); /* 确保填充剩余高度，80px 为 .design 高度 */
  background-color: #f5f5f5; /* 浅灰色背景 */
  overflow-x: hidden; /* 允许水平滚动 */
  padding-bottom: 80px; /* 增加底部内边距，以避免滚动条覆盖内容 */
  box-sizing: border-box; /* 包括 padding 和 border 在内的宽度和高度计算 */
  position: relative; /* 确保伪元素定位正确 */
}

.content-container::after {
  content: '';
  display: block;
  height: 80px; /* 与 padding-bottom 的值相同 */
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}


.left-section, .right-section {
  display: flex;
  flex-direction: column; /* 确保按钮和表格从上到下排列 */
  width: 50%; /* 每个区域占据父容器的一半宽度 */
  padding: 20px;
  box-sizing: border-box;
  height: 100%;
}



.left-section .table-box,
.right-section .table-box {
  width: 100%; /* 确保表格容器占满父容器 */
  display: flex;
  justify-content: center; /* 水平居中对齐表格 */
  height: 70%;
  position: relative;
  box-sizing:border-box;
  padding: 20px;
}

.add-button {
  position: absolute; /* 绝对定位 */
  top: -49px; /* 按钮距离顶部 10px */
  right: 10px; /* 按钮距离右侧 10px */
  padding: 10px 20px;
  font-size: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-button:hover {
  background-color: #0056b3; /* 按钮悬停效果 */
}


.left-section .el-table,
.right-section .el-table {
  width: 80%; /* 表格宽度占父容器的 80% */
  margin: 0 auto; /* 水平居中对齐表格 */
  height: 100%;
}

</style>





