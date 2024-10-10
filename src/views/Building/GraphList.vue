<template>
  <!-- 搜索和按钮区域 -->
  <el-card class="header">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input v-model="searchQuery" placeholder="搜索图谱" @input="handleSearch">
          <template #prepend>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="createDialogVisible = true">新建图谱</el-button>
      </el-col>
    </el-row>
  </el-card>

  <!-- 卡片区域 -->
  <div class="card-container">
    <el-card
        v-for="graph in graphData"
        :key="graph.id"
        class="graph-card"
    >
      <!-- 卡片头部 -->
      <div slot="header" class="card-header">
        <span>{{ graph.name }}</span>
        <div class="card-header-icons">
          <el-icon class="each-icons" @click="edit(graph)"><Edit /></el-icon>
          <el-icon class="each-icons" @click="confirmDelete(graph)"><Delete /></el-icon>
        </div>
      </div>

      <div class="card-body">
        <p>图谱模式: {{ graph.mode }}</p>
<!--        <p>创建人: {{ graph.creator }}</p>-->
        <p>实体数量: {{ graph.entityCount }}</p>
        <p>关系数量: {{ graph.relationCount }}</p>
        <p class="description">图谱描述: {{ graph.description }}</p>
<!--        <el-tooltip :visible="visible">-->
<!--          <p v-if="visible">{{ graph.description }}</p>-->
<!--          <p v-else @mouseenter="visible=true" @mouseleave="visible = false" class="description" ref="textElement">图谱描述: {{ graph.description }}</p>-->
<!--        </el-tooltip>-->
        
<!--        <div @mouseover="visible = true" @mouseleave="visible = false">-->
<!--          <span v-if="visible">图谱描述: {{ graph.description }}</span>-->
<!--          <span v-else class="description">图谱描述: {{ graph.description }}</span>-->
<!--        </div>-->
<!--        <el-tooltip :disabled="tooltipShow" placement="top">-->
<!--          <div slot="content" style="width: 350px">-->
<!--            {{ graph.description }}-->
<!--          </div>-->
<!--          <p @mouseenter="mouseEnter" @mouseleave="mouseLeave" class="description">图谱描述: {{ graph.description || '-&#45;&#45;' }}</p>-->
<!--        </el-tooltip>-->

      </div>
      <div class="card-footer">
        <el-button type="primary" @click="enterGraph(graph)">进入图谱</el-button>
      </div>
    </el-card>
  </div>

  <!--创建图谱对话框-->
  <el-dialog v-model="createDialogVisible" width="40%" draggable>
    <template #header>
      <span style="font-size: 24px;font-weight: bold;">新建图谱</span>
    </template>
    <el-form :model="createForm" :rules="rules" style="padding: 20px">
      <el-form-item label="图谱名称" prop="name">
        <el-input v-model="createForm.name" style="width: 50%"/>
      </el-form-item>
      <el-form-item label="构建方式" prop="buildMethod">
        <el-select v-model="createForm.buildMethod" placeholder="选择构建方式" style="width: 50%">
          <el-option label="模版构建" value="template" />
          <el-option label="自定义构建" value="custom" />
        </el-select>
      </el-form-item>
      <el-form-item label="图谱描述" prop="description">
        <el-input v-model="createForm.description" type="textarea" placeholder="demo"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="createNewGraph">创建</el-button>
      </div>
    </template>
  </el-dialog>

  <!--编辑图谱对话框-->
  <el-dialog v-model="editDialogVisible" width="40%" draggable>
    <template #header>
      <span style="font-size: 24px;font-weight: bold;">修改图谱</span>
    </template>
    <el-form :model="editedGraph" :rules="rules" style="padding: 20px">
      <el-form-item label="图谱名称" prop="name">
        <el-input v-model="editedGraph.name" style="width: 50%"/>
      </el-form-item>
      <el-form-item label="构建方式" prop="buildMethod">
        <el-select v-model="editedGraph.buildMethod" placeholder="选择构建方式" style="width: 50%">
          <el-option label="模版构建" value="template" />
          <el-option label="自定义构建" value="custom" />
        </el-select>
      </el-form-item>
      <el-form-item label="图谱描述" prop="description">
        <el-input v-model="editedGraph.description" type="textarea" placeholder="demo"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button :disabled="isContentSame" type="primary" @click="editGraph">确认修改</el-button>
      </div>
    </template>
  </el-dialog>

</template>


<script>
import {computed, onMounted, ref} from 'vue';
import { reactive } from "@vue/runtime-core";
import { useRouter, useRoute } from 'vue-router';
import {Edit, Delete, Search} from '@element-plus/icons-vue';
import {allGraphList,createGraph,updateGraph,deleteGraph} from "@/api/index.js";
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'GraphList',
  components:{
    Search,
    Edit,
    Delete
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    // 搜索框的数据
    const searchQuery = ref('');
    // 创建对话框
    const createDialogVisible = ref(false);
    const editDialogVisible = ref(false);

    const rules=ref({
      name: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { min: 2, max: 15, message: '用户名长度应在2到15个字符之间', trigger: 'blur' }
      ],
      buildMethod: [
          { required: true, message: '请选择构建方式', trigger: 'blur' },
      ],
      description: [
        { required: true, message: '图谱描述不能为空', trigger: 'blur' },
      ]
    })

    const createForm = reactive({
      name: '',
      buildMethod: '',
      description: 'demo',
    })

    //所有图谱
    const allGraphData = ref([]);
    // 被搜索后的图谱数据
    const graphData = ref([]);
    // 处理搜索事件
    const handleSearch=() => {
      if (searchQuery.value) {
        graphData.value=[];
        for (let i=0;i<allGraphData.value.length;i++) {
          if (allGraphData.value[i].name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
            graphData.value.push(allGraphData.value[i]);
          }
        }
      }else {
        graphData.value = allGraphData.value;
      }
      console.log("graphData",graphData.value);
    }

    //获取数据库中所有图谱
    function allGraph(){
      allGraphList().then(res=>{
        allGraphData.value=[];
        if (res.code==='00000'){
          res.result.forEach(item=>{
            var build='模版构建'
            if (item.build==='custom'){
              build='自定义构建'
            }
            let list={
              id:item.id,
              name:item.name,
              mode:build,
              entityCount:0,//TODO:后端处理
              relationCount:0,//TODO:后端处理
              description:item.description,
            }
            allGraphData.value.push(list);
          })
          console.log("allGraphData",allGraphData.value);
          graphData.value=allGraphData.value;
        }
      })
    }

    onMounted(()=>{
      allGraph();
    })

    // const tooltipShow=ref(false);

    // const mouseEnter=()=> {
    //   const element = this.$refs.textElement;
    //   if (element.scrollWidth > element.clientWidth) {
    //     console.log('文本被隐藏了');
    //     visible.value=true;
    //   } else {
    //     console.log('文本未被隐藏');
    //     visible.value=false;
    //   }
    // }

    // const mouseLeave=()=> {
    //   this.tooltipShow = true;
    // }

    // const visible=ref(false);


    // 处理新建图谱
    const createNewGraph = () => {
      console.log('新建图谱');
      console.log('createForm',createForm);
      let config = {
        "name": createForm.name,
        "build": createForm.buildMethod,
        "description":createForm.description,
      }
      createGraph(config).then(res=>{
        if (res.code==='00000'){
          ElMessage({
            message: '创建成功',
            type: 'success', // 可以是 'success', 'warning', 'info', 'error'
          });
        }else {
          ElMessage({
            message:'创建失败',
            type:'error',
          })
        }
      })
      createDialogVisible.value = false;
      allGraph();
      createForm.name='';
      createForm.buildMethod='';
      createForm.description='';
    };

    //修改图谱基本信息
    const curGraph = reactive({
      id:'',
      name:'',
      buildMethod:'',
      entityCount:'',
      relationCount:'',
      description:'',
    });
    const editedGraph = reactive({
      id:'',
      name:'',
      buildMethod:'',
      description:'',
    })
    const edit=(graph)=>{
      console.log('graph',graph);
      curGraph.id=editedGraph.id=graph.id;
      curGraph.name=editedGraph.name=graph.name;
      curGraph.entityCount=graph.entityCount;
      curGraph.relationCount=graph.relationCount;
      if (graph.mode==='自定义构建'){
        curGraph.buildMethod=editedGraph.buildMethod='custom';
      }else{
        curGraph.buildMethod=editedGraph.buildMethod='template';
      }
      curGraph.description=editedGraph.description=graph.description;
      console.log('curGraph',curGraph);
      editDialogVisible.value=true;
    }
    // 计算属性判断当前输入的内容是否与原内容相同
    const isContentSame = computed(() => {
      return (
          editedGraph.name === curGraph.name && editedGraph.buildMethod === curGraph.buildMethod &&
          editedGraph.description === curGraph.description
      );
    });
    const editGraph=()=>{
      let config={
        "id":editedGraph.id,
        "name":editedGraph.name,
        "build":editedGraph.buildMethod,
        "description":editedGraph.description,
      }
      console.log('config',config);
      updateGraph(config).then(res=>{
        if (res.code==='00000'){
          ElMessage({
            message: '修改成功',
            type: 'success', // 可以是 'success', 'warning', 'info', 'error'
          });
          editDialogVisible.value = false;
          allGraph();
        }
      })
    }

    //删除图谱
    const confirmDelete = (graph) => {
      ElMessageBox.confirm(
          '是否删除该图谱？',
          {
            confirmButtonText: '确认删除',
            cancelButtonText: '取消',
          }
      ).then(() => {
        let config={
          "id":graph.id,
          "name":graph.name,
          "build":graph.buildMethod,
          "description":graph.description,
        }
        deleteGraph(config).then(res=>{
          if (res.code==='00000'){
            ElMessage({
              type: 'success',
              message: '图谱已删除',
            })
            allGraph();
          }
        })

      }).catch(() => {})
    }

    // 进入图谱
    const enterGraph = (graph) => {
      router.push({
        path: '/EntityDesign',
        query:{
          name:graph.name,
        }
      });
      localStorage.setItem('ProjectName', graph.name)
      localStorage.setItem('ProjectId', graph.id)
      localStorage.setItem('ProjectBuild', graph.buildMethod)
      console.log(`进入图谱: ${name}`);
    };

    return {
      searchQuery,
      allGraphData,
      graphData,
      createDialogVisible,
      editDialogVisible,
      rules,
      createForm,
      handleSearch,
      createNewGraph,
      curGraph,
      editedGraph,
      edit,
      editGraph,
      isContentSame,
      enterGraph,
      confirmDelete,
    };
  }
}
</script>

<style scoped>
.header {
  margin: 10px;
}

.search-input {
  width: 90%;
}

.search_button{
  vertical-align: middle;
  display: inline-block;
}
.create_button{
  vertical-align: middle;
  display: inline-block;
  width: 60%;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 20px;
  margin: 10px;
}

.graph-card {
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-size: large;
  font-weight: bold;
  margin-bottom: 20px;
}

.card-header-icons {
  display: flex;
  float: right;
  gap: 10px;
}

.each-icons {
  padding: 3px; /* 调整背景大小 */
  background-color: rgba(135, 206, 250, 0.3); /* 设置背景颜色 */
  border-radius: 30%; /* 设置圆角 */
  cursor: pointer;
  transition: background-color 0.3s; /* 添加hover时的背景变换效果 */
}

.card-body {
  margin-bottom: 30px;
}

.card-body p {
  margin: 0;
  font-size: 14px;
  line-height: 26px;
}

.description {
  margin: 0;
  font-size: 14px;
  line-height: 26px;
  white-space: nowrap;        /* 不换行 */
  overflow: hidden;           /* 隐藏超出的内容 */
  text-overflow: ellipsis;    /* 以省略号显示超出的内容 */
}

.card-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}


</style>