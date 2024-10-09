<template>
  <Navbar :title="title"/>
  <div class="content-container">
    <div class="design"><strong>{{buildMethod}}</strong>/图谱数据
      <button class="generate-button">
        生成图谱
      </button>
    </div>

    <el-card style="background-color: rgba(169,169,169,0.1)">
      <el-row>

        <el-col :span="11" style="margin-right: 20px;">
          <el-row>
            <el-col :span="12">
              <span class="entitytable">实体列表</span>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <!-- <el-button type="primary" class="button-box" @click="dialogFormVisible = true">添加实体类型</el-button> -->
              <el-input v-model="input" style="width: 120px" placeholder="请输入实体名称" />
              <span style="margin: 0 8px;"></span>
            </el-col>
          </el-row>
          <!-- table -->
          <el-row>
            <el-table
                :data="entityTable"
                stripe
                class="table-box"
                style="width: 100%;"
            >
              <el-table-column prop="entityname" label="实体名称" ></el-table-column>
              <el-table-column prop="entityclass" label="实体类型"></el-table-column>
              <!-- 操作列 -->
              <el-table-column fixed="right" label="操作" >
                <template #default="scope" >
                  <el-link type="primary" class="operation" @click="previewFile(scope.row)">属性</el-link>
                  <span style="margin: 0 8px;"> </span>
                  <el-link type="danger" class="operation" @click="deleteFile(scope.row)">删除</el-link>
                </template>
              </el-table-column>

            </el-table>
          </el-row>
        </el-col>


        <el-col :span="12">
          <el-row>
            <el-col :span="12">
              <span class="relationtable">关系列表</span>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <!-- <el-button type="primary" class="button-box" @click="dialogFormVisible = true">添加实体属性</el-button> -->
              <el-input v-model="input" style="width: 120px" placeholder="请输入起始实体" />
              <span style="margin: 0 8px;"></span>
              <el-input v-model="input" style="width: 120px" placeholder="请输入目标实体" />
            </el-col>
          </el-row>
          <!-- table -->
          <el-row>
            <el-table
                :data="relationTable"
                stripe
                class="table-box"
            >
              <el-table-column prop="relationname" label="关系名称" ></el-table-column>
              <el-table-column prop="beginentity" label="起始实体" ></el-table-column>
              <el-table-column prop="targetentity" label="目标实体"></el-table-column>

              <!-- 操作列 -->
              <el-table-column fixed="right" label="操作">
                <template #default="scope" >
                  <el-link type="danger" class="operation" @click="deleteFile(scope.row)">删除</el-link>
                </template>
              </el-table-column>

            </el-table>
          </el-row>
        </el-col>
      </el-row>

      <div class="demo-pagination-block">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="entityTable.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>

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
    const buildMethod = (localStorage.getItem('ProjectBuild')==="custom")?"自定义构建":"模版构建";

    const entityTable=ref(
        [
          {entityname:"李四",entityclass:"产品"},
          {entityname:"王五",entityclass:"产品"},
          {entityname:"赵六",entityclass:"产品"},
          {entityname:"张三",entityclass:"产品"},
          {entityname:"南京",entityclass:"城市"},
          {entityname:"浦口",entityclass:"城市"},
          {entityname:"徐州",entityclass:"城市"},
          {entityname:"北京",entityclass:"城市"},
        ]
    )
    const input = ref('')

    const relationTable=ref(
        [
          {relationname:"构成",beginentity:"浦口",targetentity:"赵刘"},
          {relationname:"构成",beginentity:"北京",targetentity:"王五"},
          {relationname:"构成",beginentity:"南京",targetentity:"李四"},
          {relationname:"构成",beginentity:"徐州",targetentity:"张三"},
        ]
    )
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
      input,
      title,
      buildMethod,
      entityTable,
      relationTable,
      previewFile,
      deleteFile,
      currentPage,
      pageSize,
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

</style>