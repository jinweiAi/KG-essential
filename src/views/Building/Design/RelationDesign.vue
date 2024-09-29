<template>
  <Navbar :title="title"/>
  <div class="content-container">
    <div class="design"><strong>自定义构建</strong>/关系设计</div>
    <el-card style="background-color: rgba(169,169,169,0.1)">
      <el-row>
        <el-col :span="12">
          <span class="title">关系类型列表</span>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" class="button-box" @click="dialogFormVisible = true">添加关系列表</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col class="select-item">
          <span>起始实体类型</span>
          <el-select v-model="startEntityType_options" placeholder="请输入关键词" class="selector">
            <el-option
                v-for="(item, index) in startEntityType_options"
                :key="index"
                :label="item"
                :value="item"
            ></el-option>
          </el-select>
          <span>结束实体类型</span>
          <el-select v-model="endEntityType_options" placeholder="请输入关键词" class="selector">
            <el-option
                v-for="(item, index) in endEntityType_options"
                :key="index"
                :label="item"
                :value="item"
            ></el-option>
          </el-select>
          <span>关系名称</span>
          <el-select v-model="relationNames_options" placeholder="请输入关键词" class="selector">
            <el-option
                v-for="(item, index) in relationNames_options"
                :key="index"
                :label="item"
                :value="item"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="tableData" class="table-box" stripe>
        <el-table-column prop="relationName" label="关系名称" min-width="100" align="center"></el-table-column>
        <el-table-column prop="startEntityType" label="起始实体类型" min-width="100" align="center"></el-table-column>
        <el-table-column prop="endEntityType" label="结束实体类型" min-width="100" align="center"></el-table-column>
        <!-- 操作列 -->
        <el-table-column fixed="right" label="操作" width="120"  align="center">
          <template #default="scope">
            <el-link type="primary" @click="editItem(scope.row)" class="operation">编辑</el-link>
            <el-link type="danger" @click="deleteItem(scope.row)" class="operation">删除</el-link>
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

  <el-dialog v-model="dialogFormVisible" width="40%" draggable>
    <template #title>
      <span style="font-size: 24px;font-weight: bold;">添加关系</span>
    </template>
    <el-form :model="createForm"  style="padding: 20px">
      <el-form-item label="起始实体类型">
        <el-input v-model="createForm.startEntity" style="width: 50%"/>
      </el-form-item>
      <el-form-item label="关系名称">
        <el-input v-model="createForm.relation" style="width: 50%"/>
      </el-form-item>
      <el-form-item label="结束实体类型">
        <el-input v-model="createForm.endEntity" style="width: 50%"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="addRelation">添加</el-button>
      </div>
    </template>
  </el-dialog>

</template>


<script lang="ts">
import Navbar from "@/components/Navbar.vue";
import {computed, onMounted, ref} from 'vue';
import type { ComponentSize } from 'element-plus'; 
import {reactive} from "@vue/runtime-core";

export default {
  name: "RelationDesign",
  components: {
    Navbar
  },
  setup(){
    const title = localStorage.getItem('ProjectName');

    const selectedStartType = ref('');
    const selectedEndType = ref('');
    const selectedRelationName = ref('');

    // 表格数据
    const tableData = ref([
      { relationName: '执行', startEntityType: '员工', endEntityType: '爆破计划' },
      { relationName: '位于', startEntityType: '设备', endEntityType: '生产线' },
      { relationName: '属于', startEntityType: '员工', endEntityType: '班次' },
      { relationName: '构成', startEntityType: '原材料', endEntityType: '产品' }
    ]);

    // 数据选项数组
    const startEntityType_options = computed(() => tableData.value.map(item => item.startEntityType));
    const endEntityType_options = computed(() => tableData.value.map(item => item.endEntityType));
    const relationNames_options = computed(() => tableData.value.map(item => item.relationName));

    // 编辑操作
    const editItem = (row) => {
      console.log('编辑:', row);
    };

    // 删除操作
    const deleteItem = (row) => {
      console.log('删除:', row);
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

    // 创建对话框
    const dialogFormVisible = ref(false);

    const createForm = reactive({
      relation: '',
      startEntity: '',
      endEntity: '',
    })

    // 处理新添加的关系
    const addRelation = () => {
      dialogFormVisible.value = false
      console.log('添加关系');
      console.log('createForm',createForm);
    };

    return{
      title,
      selectedEndType,
      selectedStartType,
      selectedRelationName,
      startEntityType_options,
      endEntityType_options,
      relationNames_options,
      tableData,
      editItem,
      deleteItem,
      currentPage,
      pageSize,
      handleCurrentChange,
      handleSizeChange,
      dialogFormVisible,
      createForm,
      addRelation,
    }
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

.button-box {
  display: flex;
  float: right;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.select-item {
  display: flex;
  margin-top: 15px;
  overflow-x: auto;
  white-space: nowrap;
}

.select-item span {
  margin-right: 5px; /* 标签和选择框之间的距离 */
  font-size: 14px;
}

.selector {
  width: 180px;
  margin-right: 30px;
}

el-select {
  width: 100%;
}

.table-box {
  margin-top: 30px;
  max-height: 550px;
}

.operation {
  margin-left: 10px;
  margin-right: 10px;
}

.demo-pagination-block {
  margin-top: 20px;
  margin-bottom: 10px;
  float: right;
  display: flex;
}
</style>
