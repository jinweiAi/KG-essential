<template>
  <!-- 搜索和按钮区域 -->
  <el-card class="header">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input v-model="searchQuery" placeholder="请输入图谱名称">
          <template #append>
            <el-button @click="handleSearch" icon="Search"></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="dialogFormVisible = true">新建图谱</el-button>
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
          <el-icon class="each-icons"><Edit /></el-icon>
          <el-icon class="each-icons"><Delete /></el-icon>
        </div>
      </div>

      <div class="card-body">
        <p>图谱模式: {{ graph.mode }}</p>
        <p>创建人: {{ graph.creator }}</p>
        <p>实体数量: {{ graph.entityCount }}</p>
        <p>关系数量: {{ graph.relationCount }}</p>
        <p>图谱描述: {{ graph.description || '---' }}</p>
      </div>
      <div class="card-footer">
        <el-button type="primary" @click="enterGraph(graph.name)">进入图谱</el-button>
      </div>
    </el-card>
  </div>

  <el-dialog v-model="dialogFormVisible" width="40%" draggable>
    <template #title>
      <span style="font-size: 24px;font-weight: bold;">新建图谱</span>
    </template>
    <el-form :model="createForm"  style="padding: 20px">
      <el-form-item label="图谱名称">
        <el-input v-model="createForm.name" style="width: 50%"/>
      </el-form-item>
      <el-form-item label="构建方式">
        <el-select v-model="createForm.buildMethod" placeholder="Please select a method" style="width: 50%">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="图谱描述">
        <el-input v-model="createForm.description" type="textarea" placeholder="demo"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="createNewGraph">创建</el-button>
      </div>
    </template>
  </el-dialog>

</template>


<script>
import { ref } from 'vue';
import { reactive } from "@vue/runtime-core";
import { useRouter, useRoute } from 'vue-router';
import { Edit,Delete } from '@element-plus/icons-vue';

export default {
  name: 'GraphList',
  components:{
    Edit,
    Delete
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    // 搜索框的数据
    const searchQuery = ref('');
    // 创建对话框
    const dialogFormVisible = ref(false);

    const createForm = reactive({
      name: '',
      buildMethod: '',
      description: '',
    })

    // 图谱数据
    const graphData = ref([
      {
        id: 1,
        name: 'ZB图谱',
        mode: '自定义构建',
        creator: '超级管理员',
        entityCount: 7721,
        relationCount: 8679,
        description: '---',
      },
      {
        id: 2,
        name: '模板构建示例',
        mode: '模板构建',
        creator: '超级管理员',
        entityCount: 188,
        relationCount: 171,
        description: '',
      },
      {
        id: 3,
        name: 'TE_KG',
        mode: '模板构建',
        creator: '赵',
        entityCount: 0,
        relationCount: 0,
        description: 'TE_KG',
      },
      {
        id: 4,
        name: '梅山',
        mode: '自定义构建',
        creator: '超级管理员',
        entityCount: 0,
        relationCount: 0,
        description: '演示demo',
      },
    ]);

    // 处理搜索事件
    const handleSearch = () => {
      console.log('搜索:', searchQuery.value);
    };

    // 处理新建图谱
    const createNewGraph = () => {
      dialogFormVisible.value = false
      console.log('新建图谱');
      console.log('createForm',createForm);
    };

    // 进入图谱
    const enterGraph = (name) => {
      router.push({
        path: '/EntityDesign',
        query:{
          name:name
        }
      });
      localStorage.setItem('ProjectName', name)
      console.log(`进入图谱: ${name}`);
    };

    return {
      searchQuery,
      graphData,
      dialogFormVisible,
      createForm,
      handleSearch,
      createNewGraph,
      enterGraph,
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

.card-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}


</style>