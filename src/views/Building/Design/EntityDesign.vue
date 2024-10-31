<template>
  <Navbar :title="title"/>
  <div class="content-container">
    <div class="design"><strong>{{buildMethod}}</strong>/实体设计</div>
    <el-card style="background-color: rgba(169,169,169,0.1)">
      <el-row>
        <el-col :span="11" style="margin-right: 20px;" class="noWrapOverflowX">
          <el-row>
            <el-col :span="12">
              <span class="title">实体类型列表</span>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <el-button type="primary" class="button-box" @click="openAddEntityDialog">添加实体类型</el-button>
            </el-col>
          </el-row>

          <!-- 表格 -->
          <el-row>
            <el-table :data="entityList" stripe class="table-box">
              <el-table-column prop="type" label="实体类型" min-width="120" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="id" label="消歧标识" min-width="100" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="color" label="颜色" min-width="120" align="center" show-overflow-tooltip>
                <template #default="scope">
                  <div :style="{ backgroundColor: scope.row.color, width: '80px', height: '20px' }"></div>
                </template>
              </el-table-column>

              <!-- 操作列 -->
              <el-table-column fixed="right" label="操作" min-width="120" align="center" show-overflow-tooltip>
                <template #default="scope">
                  <el-link type="primary" class="operation" @click="editEntity(scope.row)">编辑</el-link>
                  <span style="margin: 0 8px;"></span>
                  <el-link type="danger" class="operation" @click="deleteEntity(scope.row)">删除</el-link>
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
                :total="entityList.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
          </div>
        </el-col>

        <el-col :span="12" class="noWrapOverflowX">
          <el-row>
            <el-col :span="12">
              <span class="title">属性列表</span>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <el-button type="primary" class="button-box" @click="openAddAttributeDialog">添加实体属性</el-button>
            </el-col>
          </el-row>

          <!-- 表格 -->
          <el-row>
            <el-table :data="tableData2" stripe class="table-box">
              <el-table-column prop="name" label="属性名称" min-width="120" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="dataclass" label="数据类型" min-width="100" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="union" label="单位" min-width="120" align="center" show-overflow-tooltip></el-table-column>

              <!-- 操作列 -->
              <el-table-column fixed="right" label="操作" min-width="120" align="center" show-overflow-tooltip>
                <template #default="scope">
                  <el-link type="primary" class="operation" @click="editAttribute(scope.row)">编辑</el-link>
                  <span style="margin: 0 8px;"></span>
                  <el-link type="danger" class="operation" @click="deleteAttribute(scope.row)">删除</el-link>
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
                :total="tableData2.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>

  <!-- 编辑和添加对话框 -->
  <el-dialog v-model="entityDialogVisible" width="40%" draggable>
    <template #header>
      <span style="font-size: 24px; font-weight: bold;">{{ isEditEntity ? '编辑实体类型' : '添加实体类型' }}</span>
    </template>
    <el-form :model="editEntityForm" style="padding: 20px">
      <el-form-item label="实体类型">
        <el-input v-model="editEntityForm.type" style="width: 50%"/>
      </el-form-item>
<!--      <el-form-item label="消歧标识">-->
<!--        <el-input v-model="editEntityForm.id" style="width: 50%"/>-->
<!--      </el-form-item>-->
      <el-form-item label="颜色">
        <el-color-picker v-model="editEntityForm.color" style="width: 50%"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="isEditEntity ? saveEntityEdit() : addEntity()">保存</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 添加属性对话框 -->
  <el-dialog v-model="attributeDialogVisible" width="40%" draggable>
    <template #header>
      <span style="font-size: 24px; font-weight: bold;">{{ isEditAttribute ? '编辑实体属性' : '添加实体属性' }}</span>
    </template>
    <el-form :model="editAttributeForm" style="padding: 20px">
      <el-form-item label="属性名称">
        <el-input v-model="editAttributeForm.name" style="width: 50%"/>
      </el-form-item>
      <el-form-item label="数据类型">
        <el-input v-model="editAttributeForm.dataclass" style="width: 50%"/>
      </el-form-item>
      <el-form-item label="单位">
        <el-input v-model="editAttributeForm.union" style="width: 50%"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="isEditAttribute ? saveAttributeEdit() : addAttribute()">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import {onMounted, ref} from 'vue';
import {allEntity, createEntity, updateEntity} from "@/api/index.js";
import {ElMessage} from "element-plus";

export default {
  name: "EntityDesign",
  components: {
    Navbar
  },
  setup() {
    const title = sessionStorage.getItem('ProjectName')
    const buildMethod = (sessionStorage.getItem('ProjectBuild')==="custom")?"自定义构建":"模版构建";
    const graphId = sessionStorage.getItem('ProjectId');

    const entityList=ref([]);
    // const entityList = ref([
    //   { entityClass: '原材料', Disambiguation: 'AA', color: '#FFFF00' }, // 黄色
    //   { entityClass: '产品', Disambiguation: 'AB', color: '#00FF00' }, // 绿色
    //   { entityClass: '班次', Disambiguation: 'AC', color: '#FF0000' }, // 红色
    //   { entityClass: '员工', Disambiguation: 'AD', color: '#0000FF' }, // 蓝色
    //   { entityClass: '设备', Disambiguation: 'AE', color: '#000000' }, // 黑色
    //   { entityClass: '生产线', Disambiguation: 'AF', color: '#FFFFFF' }, // 白色
    //   { entityClass: '爆破计划', Disambiguation: 'AG', color: '#800080' }, // 紫色
    //   { entityClass: '加工计划', Disambiguation: 'AH', color: '#A52A2A' } // 棕色
    // ]);

    function getAllEntity(){
      let config={
        params:{
          graphId:graphId,
        }
      }
      allEntity(config).then(res=>{
        if (res.code==='00000') {
          entityList.value=res.result;
        }
      })
      console.log("entityList",entityList.value)
    }

    onMounted(()=>{
      getAllEntity();
    })


    const entityDialogVisible = ref(false);
    const attributeDialogVisible = ref(false);
    const isEditEntity = ref(false); // 用于判断实体类型对话框
    const isEditAttribute = ref(false); // 用于判断属性对话框
    const editEntityForm = ref({ type: '', color: '',id:''});
    const editAttributeForm = ref({ name: '', dataclass: '', union: '' });


    const tableData2 = ref([
      { name: '时间', dataclass: '日期', union: '' },
      { name: '任务', dataclass: '字符串', union: '' },
      { name: '预估出矿量', dataclass: '数值', union: '' },
      { name: '实际出矿量', dataclass: '数值', union: '' }
    ]);

    // 打开添加实体对话框
    const openAddEntityDialog = () => {
      isEditEntity.value = false; // 设置为添加模式
      editEntityForm.value = { type: '', color: '', id:'' }; // 重置表单
      entityDialogVisible.value = true; // 显示对话框
    };

    // 编辑实体类型
    const editEntity = (row) => {
      isEditEntity.value = true; // 设置为编辑模式
      editEntityForm.value = { ...row }; // 将当前行的值复制到编辑表单
      entityDialogVisible.value = true; // 显示对话框
    };

    const saveEntityEdit = () => {
      // console.log("editEntityForm", editEntityForm.value);
      let config={
        params:{
          id:editEntityForm.value.id,
          name:editEntityForm.value.type,
          color:editEntityForm.value.color,
        }
      }
      updateEntity(config).then(res=>{
        if (res.code==='00000') {
          ElMessage({
            message: '更新成功',
            type: 'success', // 可以是 'success', 'warning', 'info', 'error'
          })
          entityDialogVisible.value = false; // 关闭对话框
          getAllEntity();
        }else{
          ElMessage({
            message: res.result,
            type: 'warning', // 可以是 'success', 'warning', 'info', 'error'
          })
        }
      })
    };

    const addEntity = () => {
      // console.log("editEntityForm",editEntityForm.value);
      let config={
        params:{
          name:editEntityForm.value.type,
          color:editEntityForm.value.color,
          graphId:graphId,
        }
      }
      createEntity(config).then(res=>{
        if (res.code==='00000') {
          ElMessage({
            message: '创建成功',
            type: 'success', // 可以是 'success', 'warning', 'info', 'error'
          })
          entityDialogVisible.value = false; // 关闭对话框
          getAllEntity();
        }else {
          ElMessage({
            message:res.result,
            type: 'warning',
          })
        }
      })

    };

    // 打开添加属性对话框
    const openAddAttributeDialog = () => {
      isEditAttribute.value = false; // 设置为添加模式
      editAttributeForm.value = { name: '', dataclass: '', union: '' }; // 重置表单
      attributeDialogVisible.value = true; // 显示对话框
    };

    // 编辑属性
    const editAttribute = (row) => {
      isEditAttribute.value = true; // 设置为编辑模式
      editAttributeForm.value = { ...row }; // 将当前行的值复制到编辑表单
      attributeDialogVisible.value = true; // 显示对话框
    };

    const saveAttributeEdit = () => {
      const index = tableData2.value.findIndex(item => item.name === editAttributeForm.value.name);
      if (index !== -1) {
        tableData2.value[index] = editAttributeForm.value; // 更新原数据
      }
      attributeDialogVisible.value = false; // 关闭对话框
    };

    const addAttribute = () => {
      tableData2.value.push({ ...editAttributeForm.value }); // 添加新属性
      attributeDialogVisible.value = false; // 关闭对话框
    };

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

    return {
      title,
      buildMethod,
      graphId,

      entityList,

      entityDialogVisible,
      attributeDialogVisible,
      isEditEntity,
      isEditAttribute,
      editEntityForm,
      editAttributeForm,
      tableData2,
      openAddEntityDialog,
      editEntity,
      saveEntityEdit,
      addEntity,
      openAddAttributeDialog,
      editAttribute,
      saveAttributeEdit,
      addAttribute,

      currentPage1,
      pageSize1,
      currentPage2,
      pageSize2,
      size,
      handleCurrentChange,
      handleSizeChange,
    };
  }
};
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

.button-box {
  display: flex;
  float: right;
}

.noWrapOverflowX{
  overflow-x: auto;
  white-space: nowrap;
}
</style>