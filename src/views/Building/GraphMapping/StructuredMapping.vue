<template>
  <Navbar :title="title"/>
  <div class="content-container">
    <div class="design"><strong>{{buildMethod}}</strong>/结构化映射</div>
    <el-card style="background-color: rgba(169,169,169,0.1)">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button type="primary" class="button-box" @click="createDialogVisible = true">添加任务</el-button>
        </el-col>
        <el-col :span="12">
          <el-input v-model="searchQuery" placeholder="按任务名称搜索" class="input-box" @input="handleSearch">
            <template #prepend>
              <el-button icon="Search"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-col class="noWrapOverflowX">
        <el-table
            :data="searchedTask"
            stripe
            class="table-box"
        >
          <el-table-column prop="id" label="序号" width="60"></el-table-column>
          <el-table-column prop="name" label="任务名称" width="150"></el-table-column>
          <el-table-column prop="type" label="文件类型" width="100"></el-table-column>
          <el-table-column prop="sourceName" label="数据来源" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="description" label="任务描述" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column
              prop="status"
              label="状态"
              min-width="100"
              :filters="[
              { text: '已抽取', value: '已抽取' },
              { text: '未抽取', value: '未抽取' },
              { text: '抽取失败', value: '抽取失败' },
              { text: '抽取中', value: '抽取中' },
            ]"
              :filter-method="filterTag"
              filter-placement="bottom-end"
          >
            <template #default="scope">
              <el-tag
                  :type="scope.row.status === '未抽取' ? 'warning' : scope.row.status === '已抽取' ? 'success' : scope.row.status === '抽取中' ? 'info' : 'danger'"
                  disable-transitions
              >{{ scope.row.status }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="200"></el-table-column>

          <!-- 操作列 -->
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope" >
              <el-link type="primary" class="operation" @click="editTask(scope.row)">编辑</el-link>
              <el-link type="success" class="operation" @click="doTask(scope.row)" :disabled="scope.row.status!=='未抽取'">抽取</el-link>
              <el-link type="danger" @click="deleteTask(scope.row)">删除</el-link>
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
              :total=searchedTask.length
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-card>

    <!--创建任务对话框-->
    <el-dialog v-model="createDialogVisible" width="40%" draggable>
      <template #header>
        <span style="font-size: 24px;font-weight: bold;">新建任务</span>
      </template>
      <el-form :model="createForm" :rules="rules" style="padding: 20px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="createForm.name" style="width: 50%"/>
        </el-form-item>
        <el-form-item label="文件来源" prop="file">
          <el-select v-model="createForm.file" placeholder="选择文件" style="width: 50%">
<!--            <template #header>-->
<!--              <el-input v-model="searchFile" placeholder="请输入文件名称">-->
<!--                <template #prepend>-->
<!--                  <el-button @click="handleFileSearch" icon="Search"></el-button>-->
<!--                </template>-->
<!--              </el-input>-->
<!--            </template>-->
            <el-option
                v-for="item in fileList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述" prop="description">
          <el-input v-model="createForm.description" type="textarea"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="createTask">新建</el-button>
        </div>
      </template>
    </el-dialog>

    <!--编辑任务对话框-->
    <el-dialog v-model="editDialogVisible" width="40%" draggable>
      <template #header>
        <span style="font-size: 24px;font-weight: bold;">修改图谱</span>
      </template>
      <el-form :model="editedTask" :rules="rules" style="padding: 20px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="editedTask.name" style="width: 50%"/>
        </el-form-item>
        <el-form-item label="文件来源" prop="file">
          <el-select v-model="editedTask.file" placeholder="选择文件" style="width: 50%">
            <template #header>
              <el-input v-model="searchFile" placeholder="请输入文件名称">
                <template #prepend>
                  <el-button @click="handleFileSearch" icon="Search"></el-button>
                </template>
              </el-input>
            </template>
            <el-option
                v-for="item in fileList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述" prop="description">
          <el-input v-model="editedTask.description" type="textarea" placeholder="demo"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :disabled="isContentSame" type="primary" @click="editConfirm">确认修改</el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script>
import Navbar from "@/components/Navbar.vue";
import {computed, onMounted, ref} from 'vue';
import {createNewTask, deleteTaskById, getAllFile, getAllTask, handleTask, updateTask} from "@/api/index.js";
import {reactive} from "@vue/runtime-core";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "StructuredMapping",
  components: {
    Navbar
  },
  setup(){
    const title = sessionStorage.getItem('ProjectName');
    const buildMethod = (sessionStorage.getItem('ProjectBuild')==="custom")?"自定义构建":"模版构建";
    const graphId = sessionStorage.getItem('ProjectId');

    //对应的文件列表
    const fileList=ref([]);

    //TODO:文件搜索功能
    const searchFile=ref("");
    const handleFileSearch=()=>{

    }

    const createDialogVisible=ref(false);
    const createForm = reactive({
      name: '',
      file: '',
      description:'',
    });
    const rules=ref({
      name: [
        { required: true, message: '任务名不能为空', trigger: 'blur' },
      ],
      file: [
        { required: true, message: '请选择需要抽取文件', trigger: 'blur' },
      ],
      description: [
        { required: true, message: '任务描述不能为空', trigger: 'blur' },
      ]
    })

    const createTask=()=>{
      console.log("createForm",createForm);
      let config={
        params:{
          name:createForm.name,
          fileId:createForm.file,
          description:createForm.description,
          graphId:graphId
        },
      }
      createNewTask(config).then(res=>{
        if (res.code==='00000'){
          ElMessage({
            message: '创建成功',
            type: 'success', // 可以是 'success', 'warning', 'info', 'error'
          })
          getTaskList();
        }else{
          ElMessage({
            message: '创建失败，请重试',
            type: 'error', // 可以是 'success', 'warning', 'info', 'error'
          })
        }
        createDialogVisible.value=false;
        createForm.name='';
        createForm.file= '';
        createForm.description='';
      })
    }

    // 搜索框的数据
    const searchQuery = ref('');

    // 处理搜索事件
    const handleSearch = () => {
      console.log('搜索:', searchQuery.value);
      if (searchQuery.value) {
        searchedTask.value=[];
        for (let i=0;i<originTask.value.length;i++) {
          if (originTask.value[i].name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
            searchedTask.value.push(originTask.value[i]);
          }
        }
      }else {
        searchedTask.value = originTask.value;
      }
      console.log("searchedTask",searchedTask.value);
    };

    // 表格数据
    const originTask = ref([]);
    const searchedTask = ref([]);

    async function getFile(){
      let config={
        params:{
          graphID:graphId
        }
      }
      return getAllFile(config).then(res=>{
        if (res.code==='00000') {
          // console.log(res.result);
          res.result.forEach(item => {
            let list = {
              id: item.id,
              name: item.name,
            }
            fileList.value.push(list);
          })
          console.log("fileList", fileList.value);
        }
      })
    }

    function getTaskList(){
      let config={
        params:{
          graphID:graphId
        }
      }
      getAllTask(config).then(res=>{
        originTask.value=[];
        if (res.code==='00000') {
          // console.log(res.result);
          res.result.forEach(item => {
            let taskStatus;
            if (item.status==='waiting'){
              taskStatus='未抽取';
            }else if(item.status==='success'){
              taskStatus='已抽取';
            }else if(item.status==='error'){
              taskStatus='文件失效';
            }else{
              taskStatus='抽取中';
            }
            let fileName='';
            for(let i=0;i<fileList.value.length;i++) {
              if (fileList.value[i].id===item.source) {
                fileName=fileList.value[i].name;
                break;
              }
            }
            if (fileName===''){
              taskStatus='文件失效';
              fileName='未找到文件';
            }
            let list = {
              id: item.id,
              name: item.name,
              type: item.type,
              sourceId:item.source,
              sourceName: fileName,
              description: item.description,
              status: taskStatus,
              updateTime: item.updateTime,
            }
            originTask.value.push(list);
          })
          console.log("originTask", originTask.value);
          searchedTask.value=originTask.value;
        }
      })
    }

    onMounted(async () => {
      await getFile();
      getTaskList();   // getFile 完成后再执行 getTaskList
    });

    
    // 操作处理函数
    const editDialogVisible=ref(false);
    const editedTask=reactive({
      id:'',
      name: '',
      file: '',
      description:'',
    })
    const preTask=ref({
      id:'',
      name: '',
      file: '',
      description:'',
    });
    const editTask = (row) => {
      console.log('编辑任务: ', row);
      editDialogVisible.value=true;
      preTask.id=editedTask.id=row.id;
      preTask.name=editedTask.name=row.name;
      preTask.description=editedTask.description=row.description;
      preTask.file=editedTask.file=row.sourceId;
    };

    // 计算属性判断当前输入的内容是否与原内容相同
    const isContentSame = computed(() => {
      return  editedTask.name === preTask.name && editedTask.file === preTask.file && editedTask.description === preTask.description;
    });
    const editConfirm=()=>{
      console.log("editedTask",editedTask)
      let config={
        params:{
          id:editedTask.id,
          name:editedTask.name,
          fileId:editedTask.file,
          description:editedTask.description,
          graphId:graphId,
        }
      }
      updateTask(config).then(res=>{
        if (res.code==='00000') {
          ElMessage({
            message: '修改成功',
            type: 'success', // 可以是 'success', 'warning', 'info', 'error'
          })
          getTaskList();
        }else{
          ElMessage({
            message: '失败，请重试！',
            type: 'error', // 可以是 'success', 'warning', 'info', 'error'
          })
        }
        editDialogVisible.value=false;
      })
    }

    //TODO:抽取核心功能实现
    const doTask = (row) => {
      console.log('抽取: ', row);
      let config={
        params:{
          taskId:row.id,
        }
      }
      handleTask(config).then(res=>{
        if (res.code==='00000') {
          ElMessage({
            type: 'success',
            message:'任务完成'
          })
          getTaskList();
        }
      })
    };

    const deleteTask = (row) => {
      console.log('删除任务: ', row);
      ElMessageBox.confirm(
          '是否删除该任务？',
          {
            confirmButtonText: '确认删除',
            cancelButtonText: '取消',
          }
      ).then(() =>{
        let config={
          params:{id:row.id}
        }
        deleteTaskById(config).then(res=>{
          if (res.code==='00000') {
            ElMessage({
              message: '删除成功',
              type: 'success', // 可以是 'success', 'warning', 'info', 'error'
            })
            getTaskList();
          }else{
            ElMessage({
              message: '失败，请重试！',
              type: 'error', // 可以是 'success', 'warning', 'info', 'error'
            })
          }
        })
      }).catch(() => {})
    };


    /** 分页 **/
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

    const filterTag = (value, row) => {
      return row.category === value;
    }

    return{
      title,
      buildMethod,

      fileList,
      searchFile,
      handleFileSearch,

      createDialogVisible,
      createForm,
      rules,
      createTask,
      
      searchQuery,
      handleSearch,

      originTask,
      searchedTask,

      editDialogVisible,
      editedTask,
      editTask,
      preTask,
      isContentSame,
      editConfirm,

      deleteTask,
      doTask,
      
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      size,
      pageSize,

      filterTag,
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

.noWrapOverflowX{
  overflow-x: auto;
  white-space: nowrap;
}

</style>