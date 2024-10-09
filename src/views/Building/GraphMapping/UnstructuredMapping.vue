<template>
  <Navbar :title="title"/>
  <div class="content-container">
    <div class="design"><strong>{{buildMethod}}</strong>/非结构化映射</div>
<!--    <el-card style="background-color: rgba(169,169,169,0.1)">-->
<!--      <el-row :gutter="20">-->
<!--        <el-col :span="12">-->
<!--          <el-button type="primary" class="button-box">添加任务</el-button>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-input v-model="searchQuery" placeholder="请输入任务名称" class="input-box">-->
<!--            <template #append>-->
<!--              <el-button @click="handleSearch" icon="Search"></el-button>-->
<!--            </template>-->
<!--          </el-input>-->
<!--        </el-col>-->
<!--      </el-row>-->

<!--      &lt;!&ndash; 表格 &ndash;&gt;-->
<!--      <el-table-->
<!--          :data="tableData"-->
<!--          stripe-->
<!--          class="table-box"-->
<!--      >-->
<!--        <el-table-column prop="id" label="序号" width="60"></el-table-column>-->
<!--        <el-table-column prop="name" label="任务名称" width="100"></el-table-column>-->
<!--        <el-table-column prop="type" label="文件类型" width="120"></el-table-column>-->
<!--        <el-table-column prop="source" label="数据来源" width="150" show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column prop="description" label="任务描述" min-width="120" show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column prop="status" label="状态" width="80"></el-table-column>-->
<!--        <el-table-column prop="uploadTime" label="更新时间" width="200"></el-table-column>-->

<!--        &lt;!&ndash; 操作列 &ndash;&gt;-->
<!--        <el-table-column fixed="right" label="操作" width="150">-->
<!--          <template #default="scope" >-->
<!--            <el-link type="primary" class="operation" @click="previewFile(scope.row)">预览</el-link>-->
<!--            <el-link type="success" class="operation" @click="downloadFile(scope.row)">抽取</el-link>-->
<!--            <el-link type="danger" class="operation" @click="deleteFile(scope.row)">删除</el-link>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->

<!--      <div class="demo-pagination-block">-->
<!--        <el-pagination-->
<!--            v-model:current-page="currentPage"-->
<!--            v-model:page-size="pageSize"-->
<!--            :page-sizes="[10, 20, 50, 100]"-->
<!--            :size="size"-->
<!--            layout="total, sizes, prev, pager, next, jumper"-->
<!--            :total=tableData.length-->
<!--            @size-change="handleSizeChange"-->
<!--            @current-change="handleCurrentChange"-->
<!--        />-->
<!--      </div>-->
<!--    </el-card>-->

  </div>
</template>

<script lang="ts">

import Navbar from "@/components/Navbar.vue";

export default {
  name: "UnstructuredMapping",
  components: {Navbar},
  setup() {
    const title = localStorage.getItem('ProjectName');
    const buildMethod = (localStorage.getItem('ProjectBuild')==="custom")?"自定义构建":"模版构建";

    return{
      title,
      buildMethod,
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