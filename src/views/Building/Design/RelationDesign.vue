<template>
  <Navbar :title="title"/>
  <div class="content-container">
    <div class="design"><strong>{{buildMethod}}</strong>/关系设计</div>
    <el-card style="background-color: rgba(169,169,169,0.1)">
      <el-row>
        <el-col :span="12">
          <span class="title">关系类型列表</span>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" class="button-box" @click="openAddDialog">添加关系列表</el-button>
        </el-col>
      </el-row>
<!--      <el-row :gutter="20">-->
<!--        <el-col class="select-item">-->
<!--          <span>起始实体类型</span>-->
<!--          <el-select v-model="startEntityType_options" placeholder="请输入关键词" class="selector">-->
<!--            <el-option-->
<!--                v-for="(item, index) in startEntityType_options"-->
<!--                :key="index"-->
<!--                :label="item"-->
<!--                :value="item"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--          <span>结束实体类型</span>-->
<!--          <el-select v-model="endEntityType_options" placeholder="请输入关键词" class="selector">-->
<!--            <el-option-->
<!--                v-for="(item, index) in endEntityType_options"-->
<!--                :key="index"-->
<!--                :label="item"-->
<!--                :value="item"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--          <span>关系名称</span>-->
<!--          <el-select v-model="relationNames_options" placeholder="请输入关键词" class="selector">-->
<!--            <el-option-->
<!--                v-for="(item, index) in relationNames_options"-->
<!--                :key="index"-->
<!--                :label="item"-->
<!--                :value="item"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--        </el-col>-->
<!--      </el-row>-->

      <!-- 表格 -->
      <el-col class="noWrapOverflowX">
        <el-table :data="tripleList" class="table-box" stripe>
          <el-table-column prop="relation" label="关系名称" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="startEntity" label="起始实体类型" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="endEntity" label="结束实体类型" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <!-- 操作列 -->
          <el-table-column fixed="right" label="操作" width="200"  align="center" show-overflow-tooltip>
            <template #default="scope">
  <!--            <el-link type="primary" @click="editItem(scope.row)" class="operation">编辑</el-link>-->
              <el-link type="danger" @click="deleteItem(scope.row)">删除</el-link>
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
              :total=tripleList.length
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-card>
  </div>

  <el-dialog v-model="dialogFormVisible" width="40%" draggable>
    <template #header>
      <span style="font-size: 24px;font-weight: bold;">{{ isEdit ? '编辑关系' : '添加关系' }}</span>
    </template>
    <el-form :model="dataForm"  style="padding: 20px" label-position="right" label-width="100px">
      <el-form-item label="起始实体类型">
        <el-select v-model="dataForm.startEntity" style="width: 60%" placeholder="请选择起始实体类型">
          <el-option
              v-for="item in entityList"
              :key="item.id"
              :label="item.type"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关系名称">
        <el-input v-model="dataForm.relation" style="width: 60%"/>
      </el-form-item>
      <el-form-item label="结束实体类型">
        <el-select v-model="dataForm.endEntity" style="width: 60%" placeholder="请选择结束实体类型">
          <el-option
              v-for="item in entityList"
              :key="item.id"
              :label="item.type"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script>
import Navbar from "@/components/Navbar.vue";
import {onMounted, ref} from 'vue';
import {reactive} from "@vue/runtime-core";
import {addRelationEntity, allTriple, allEntity, allRelation, deleteGraph, deleteTriple} from "@/api/index.js";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "RelationDesign",
  components: {
    Navbar
  },
  setup(){
    const title = sessionStorage.getItem('ProjectName');
    const buildMethod = (sessionStorage.getItem('ProjectBuild')==="custom")?"自定义构建":"模版构建";
    const graphId = sessionStorage.getItem('ProjectId');

    const entityList=ref([]);
    const relationList=ref([]);
    const tripleList=ref([]);

    function getAllEntity(){
      let config={
        params:{
          graphId:graphId,
        }
      }
      allEntity(config).then(res=>{
        if (res.code==='00000') {
          entityList.value = res.result;
        }
        console.log("entityList",entityList.value);
      })
    }

    function getAllTriple(){
      let config={
        params: {
          graphId:graphId,
        }
      }
      allTriple(config).then(res=>{
        tripleList.value=[];
        if (res.code==='00000') {
          console.log("allTriple res:",res.result)
          res.result.forEach(item=>{
            let list={
              id:item[0],
              relation:item[2],
              startEntity:item[1],
              endEntity:item[3],
            }
            tripleList.value.push(list);
          })
        }
      })
      console.log("tripleList",tripleList);
    }

    function getAllRelation(){
      let config={
        params:{
          graphId:graphId,
        }
      }
      allRelation(config).then(res=>{
        console.log("res",res.result);
        if (res.code==='00000') {
          relationList.value=[];
          relationList.value=res.result;
        }
        console.log("relationList",relationList.value);
      })
    }

    onMounted(()=>{
      getAllEntity();
      getAllTriple();
      getAllRelation();
    })

    const dataForm = reactive({
      id:'',
      relation: '',
      startEntity: '',
      endEntity: '',
    })

    const isEdit=ref(false);
    const dialogFormVisible = ref(false);

    const openAddDialog = () => {
      isEdit.value = false; // 设置为添加模式
      dataForm.value = { id:'', relation: '', startEntity: '', endEntity:'' }; // 重置表单
      dialogFormVisible.value = true; // 显示对话框
      console.log("isEdit",isEdit.value);
      console.log(dataForm.value);
    };

    const handleConfirm=()=>{
      if (isEdit.value){
        // editRelation();
      }else{
        addRelation();
      }
    }

    // 处理新添加的关系
    const addRelation = () => {
      console.log(("enter addRelation"));
      console.log('dataForm',dataForm);
      let config={
        params:{
          relation:dataForm.relation,
          startEntityId:dataForm.startEntity,
          endEntityId:dataForm.endEntity,
          graphId:graphId,
        }
      }
      addRelationEntity(config).then(res=>{
        if (res.code==='00000') {
          ElMessage({
            message: '添加成功',
            type: 'success', // 可以是 'success', 'warning', 'info', 'error'
          });
          getAllTriple();
        }else{
          ElMessage({
            message:res.result,
            type: 'error',
          })
        }
        dialogFormVisible.value = false
      })
    };

    // 编辑操作
    const editItem = (row) => {
      console.log('row', row);
      console.log(row.startEntity);
      console.log(row.endEntity);
      dataForm.id = row.id;
      entityList.value.forEach(item => {
        if (item.type === row.endEntity) {
          dataForm.endEntity=item.id;
        }
        if (item.type === row.startEntity) {
          dataForm.startEntity=item.id;
        }
      })
      dataForm.relation=row.relation;
      dialogFormVisible.value = true; // 显示对话框
      isEdit.value=true;
      console.log("dataForm",dataForm);
    };

    const editRelation=()=>{
      console.log(("enter editRelation"));
    }

    // 删除操作
    const deleteItem = (row) => {
      console.log('删除:', row);
      ElMessageBox.confirm(
          '是否删除该三元组？',
          {
            confirmButtonText: '确认删除',
            cancelButtonText: '取消',
          }
      ).then(() => {
        let config={
          params:{
            id:row.id,
          }
        }
        deleteTriple(config).then(res=>{
          if (res.code==='00000'){
            ElMessage({
              type: 'success',
              message: '三元组已删除',
            })
            getAllTriple();
          }
        })
      }).catch(() => {})
    };

    const currentPage = ref(1)
    const pageSize = ref(100)

    const size = ref('small')
    // 处理分页
    const handleSizeChange = (size) => {
      console.log(`${size} items per page`)
    }
    const handleCurrentChange = (page) => {
      console.log(`current page: ${page}`)
    }

    return{
      title,
      buildMethod,
      graphId,

      entityList,
      relationList,
      tripleList,

      isEdit,
      dialogFormVisible,
      dataForm,
      handleConfirm,
      addRelation,
      openAddDialog,
      editItem,
      editRelation,
      deleteItem,

      currentPage,
      pageSize,
      size,
      handleCurrentChange,
      handleSizeChange,


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

.design {
  font-size: 15px;
  padding: 15px;
  background-color: #fef9f9;
  border:1px solid;
  box-sizing: border-box;
  margin-bottom: 15px;
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

.noWrapOverflowX{
  overflow-x: auto;
  white-space: nowrap;
}
</style>