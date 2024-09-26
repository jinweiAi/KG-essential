<template>
  <Navbar :title="title"/>
  <div class="content-container">
    <div class="design"><strong>自定义构建</strong>/实体设计</div>
    <el-card style="background-color: rgba(169,169,169,0.1)">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button type="primary" class="button-box">添加文件</el-button>
        </el-col>
        <el-col :span="12">
          <el-input v-model="searchQuery" placeholder="请输入任务名称" class="input-box">
            <template #append>
              <el-button @click="handleSearch" icon="Search"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
          :data="tableData"
          stripe
          class="table-box"
      >
        <el-table-column prop="id" label="序号" width="60"></el-table-column>
        <el-table-column prop="name" label="任务名称" width="100"></el-table-column>
        <el-table-column prop="type" label="文件类型" width="120"></el-table-column>
        <el-table-column prop="source" label="数据来源" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="description" label="任务描述" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" width="80"></el-table-column>
        <el-table-column prop="uploadTime" label="更新时间" width="200"></el-table-column>

        <!-- 操作列 -->
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope" >
            <el-link type="primary" class="operation" @click="previewFile(scope.row)">预览</el-link>
            <el-link type="success" class="operation" @click="downloadFile(scope.row)">下载</el-link>
            <el-link type="danger" class="operation" @click="deleteFile(scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>

      <div class="demo-pagination-block">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total=tableData.length
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>

    </el-card>

  </div>

</template>

<script lang="ts">
import Navbar from "@/components/Navbar.vue";
import { ref } from 'vue';
import type { ComponentSize } from 'element-plus';

export default {
  name: "StructuredMapping",
  components: {
    Navbar
  },
  setup(){
    const title = localStorage.getItem('ProjectName');

    // 搜索框的数据
    const searchQuery = ref('');

    // 处理搜索事件
    const handleSearch = () => {
      console.log('搜索:', searchQuery.value);
    };

    // 表格数据
    const tableData = ref([
      {
        id: 1,
        name: '抽取',
        type: 'EXCEL格式',
        source:'原材料产品.xlsx',
        description:'xxxxxxx',
        status:'已抽取',
        uploadTime: '2024-06-21 11:26:54',
      },
      {
        id: 2,
        name: '抽取',
        type: 'EXCEL格式',
        source:'原材料产品2.xlsx',
        description:'xxxxxxxaaaaa',
        status:'已抽取',
        uploadTime: '2024-06-21 11:26:54',
      },
    ]);

    // 操作处理函数
    const previewFile = (row) => {
      console.log('预览文件: ', row.name);
    };

    const downloadFile = (row) => {
      console.log('下载文件: ', row.name);
    };

    const deleteFile = (row) => {
      console.log('删除文件: ', row.name);
    };

    const currentPage = ref(1)
    const pageSize = ref(100)

    const size = ref<ComponentSize>('small')
    // 处理分页
    const handleSizeChange = (size) => {
      console.log(`${size} items per page`)
    }
    const handleCurrentChange = (page) => {
      console.log(`current page: ${page}`)
    }

    return{
      title,
      searchQuery,
      handleSearch,
      tableData,
      previewFile,
      downloadFile,
      deleteFile,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      size,
      pageSize,
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

.button-box {
  flex: 1; /* 每个按钮等分宽度 */
  min-width: 50px;
}

.input-box {
  float: right;
  display: flex;
  width: 50%;
  min-width: 200px;
}

.table-box {
  margin-top: 30px;
  max-height: 600px;
}

.operation {
  margin-right: 10px;
}

.demo-pagination-block {
  margin-top: 20px;
  margin-bottom: 10px;
  float: right;
  display: flex;
}

</style>