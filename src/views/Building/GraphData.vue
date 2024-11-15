<template>
  <Navbar :title="title"/>
  <div class="content-container">
    <div class="design"><strong>{{buildMethod}}</strong>/图谱数据
      <button class="generate-button" @click="generate">
        生成图谱
      </button>
    </div>

    <el-card style="background-color: rgba(169,169,169,0.1)">
      <el-row>
        <el-col :span="11" style="margin-right: 20px;" class="noWrapOverflowX">
          <el-row>
            <el-col :span="12">
              <span class="title">实体列表</span>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <!-- <el-button type="primary" class="button-box" @click="dialogFormVisible = true">添加实体类型</el-button> -->
              <el-input v-model="input" style="width: 120px" placeholder="请输入实体名称" />
            </el-col>
          </el-row>
          <!-- table -->
          <el-row>
            <el-table
                :data="entityTable"
                stripe
                class="table-box"
                :max-height="500"
            >
              <el-table-column prop="itemName" label="实体实例名称" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="entityName" label="实体类型" align="center" show-overflow-tooltip></el-table-column>
              <!-- 操作列 -->
              <el-table-column fixed="right" label="操作" align="center" show-overflow-tooltip>
                <template #default="scope" >
                  <el-link type="primary" class="operation" @click="previewFile(scope.row)">属性</el-link>
                  <el-link type="danger" @click="deleteFile(scope.row)">删除</el-link>
                </template>
              </el-table-column>

            </el-table>
          </el-row>
          <div class="demo-pagination-block">
            <el-pagination
                v-model:current-page="currentPage1"
                v-model:page-size="pageSize1"
                :page-sizes="[10, 20, 50, 100]"
                :size="size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="entityTable.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
          </div>
        </el-col>

        <el-col :span="12" class="noWrapOverflowX">
          <el-row>
            <el-col :span="12">
              <span class="title">关系列表</span>
            </el-col>
            <el-col :span="12" style="display: flex; justify-content: flex-end; overflow-x: auto; white-space: nowrap;">
              <!-- <el-button type="primary" class="button-box" @click="dialogFormVisible = true">添加实体属性</el-button> -->
              <el-input v-model="input" style="width: 120px;margin-right: 10px" placeholder="请输入起始实体" />
              <el-input v-model="input" style="width: 120px" placeholder="请输入目标实体" />
            </el-col>
          </el-row>
          <!-- table -->
          <el-row>
            <el-table
                :data="relationTable"
                stripe
                class="table-box"
                :max-height="500"
            >
              <el-table-column prop="relationName" label="关系名称" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="headItemName" label="起始实体" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="tailItemName" label="目标实体" align="center" show-overflow-tooltip></el-table-column>

              <!-- 操作列 -->
              <el-table-column fixed="right" label="操作" align="center" show-overflow-tooltip>
                <template #default="scope" >
                  <el-link type="danger" @click="deleteFile(scope.row)">删除</el-link>
                </template>
              </el-table-column>

            </el-table>
          </el-row>
          <div class="demo-pagination-block">
            <el-pagination
                v-model:current-page="currentPage2"
                v-model:page-size="pageSize2"
                :page-sizes="[10, 20, 50, 100]"
                :size="size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="relationTable.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
          </div>
        </el-col>
      </el-row>

    </el-card>
  </div>
</template>

<script>

import Navbar from "@/components/Navbar.vue";
import { onMounted, ref} from 'vue';
import {allEntityItems, allItemRelation, generateGraph} from "@/api/index.js";
import {ElMessage} from "element-plus";

export default {
  name: "GraphData",
  components: {
    Navbar
  },

  setup(){
    const title = sessionStorage.getItem('ProjectName');
    const buildMethod = (sessionStorage.getItem('ProjectBuild')==="custom")?"自定义构建":"模版构建";
    const graphId = sessionStorage.getItem('ProjectId');

    const entityTable=ref([]);
    const relationTable=ref([]);
    const input = ref('');

    const getAll=()=>{
      let config={
        params:{
          graphId:graphId,
        }
      }
      allEntityItems(config).then(res=>{
        if (res.code==='00000') {
          entityTable.value=res.result;
        }
      })
      allItemRelation(config).then(res=>{
        if (res.code==='00000') {
          relationTable.value=res.result;
        }
      })
      console.log("entityTable",entityTable.value);
      console.log("relationTable",relationTable.value);
    }

    onMounted(()=>{
      getAll();
    })

    const generate=()=>{
      let config={
        params: {
          graphId:graphId,
        }
      }
      generateGraph(config).then(res=>{
        if (res.code==='00000') {
          ElMessage({
            message: '生成图谱成功，在图谱详情页面查看',
            type: 'success', // 可以是 'success', 'warning', 'info', 'error'
          })
          sessionStorage.setItem('GraphGenerate', true);
        }
      })
    }

    const currentPage1 = ref(1)
    const pageSize1 = ref(100)
    const currentPage2 = ref(1)
    const pageSize2 = ref(100)
    const size = ref('small')
    // 处理分页
    const handleSizeChange = (size) => {
      console.log(`${size} items per page`)
    }
    const handleCurrentChange = (page) => {
      console.log(`current page: ${page}`)
    }

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

    return{
      title,
      buildMethod,
      graphId,

      entityTable,
      relationTable,
      getAll,

      input,

      previewFile,
      deleteFile,

      generate,

      currentPage1,
      pageSize1,
      currentPage2,
      pageSize2,
      size,
      handleSizeChange,
      handleCurrentChange,
    };
  }
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
  display: flex;
  justify-content: space-between; /* 将内容和按钮分布到两边 */
  align-items: center; /* 垂直居中 */
}

.generate-button {
  background-color: #205cb1;
  color: white;
  border: none;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin-left: auto; /* 将按钮推到最右侧 */
  cursor: pointer;
}

.generate-button:hover {
  background-color: #45a049;
}

.demo-pagination-block {
  margin-top: 20px;
  margin-bottom: 10px;
  float: right;
  display: flex;
}


.title {
  font-size: 20px;
  font-weight: bold;
}

.table-box {
  margin-top: 15px;
  max-height: 550px;
}

.operation {
  margin-right: 10px;
}

.noWrapOverflowX{
  overflow-x: auto;
  white-space: nowrap;
}

</style>