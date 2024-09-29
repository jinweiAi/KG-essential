<template>
  <Navbar :title="title"/>
  <div class="content-container">
    <div class="design"><strong>自定义构建</strong>/图谱数据
      <button class="generate-button">
        生成图谱
      </button>
    </div>
    
    <el-card style="background-color: rgba(169,169,169,0.1)">
      <el-row>

        <!-- 实体列表 -->
        <el-col :span="11" style="margin-right: 20px;">
          <el-row>
            <el-col :span="12">
              <span class="entitytable">实体列表</span>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <el-input v-model="entitySearch" style="width: 120px" placeholder="请输入实体名称" />
              <span style="margin: 0 8px;"></span>
            </el-col>
          </el-row>
          <el-row>
            <el-table
              :data="paginatedEntityTable"
              stripe
              class="table-box"
              style="width: 100%;"
            >
              <el-table-column prop="entityname" label="实体名称"></el-table-column>
              <el-table-column prop="entityclass" label="实体类型"></el-table-column>
              <el-table-column fixed="right" label="操作">
                <template #default="scope">
                  <el-link type="primary" class="operation" @click="previewFile(scope.row)">属性</el-link>
                  <span style="margin: 0 8px;"></span>
                  <el-link type="danger" class="operation" @click="deleteEntity(scope.row)">删除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <!-- 实体列表分页 -->
          <div class="demo-pagination-block">
            <el-pagination
              v-model:current-page="entityCurrentPage"
              v-model:page-size="entityPageSize"
              :page-sizes="[5, 10, 20, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="filteredEntityTable.length"
              @size-change="handleEntitySizeChange" 
              @current-change="handleEntityCurrentChange" 
            />
          </div>
        </el-col>

        <!-- 关系列表 -->
        <el-col :span="12">
          <el-row>
            <el-col :span="12">
              <span class="relationtable">关系列表</span>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <el-input v-model="startEntitySearch" style="width: 120px" placeholder="请输入起始实体" />
              <span style="margin: 0 8px;"></span>
              <el-input v-model="targetEntitySearch" style="width: 120px" placeholder="请输入目标实体" />
            </el-col>
          </el-row>
          <el-row>
            <el-table
              :data="paginatedRelationTable"
              stripe
              class="table-box"
              style="width: 100%;"
            >
              <el-table-column prop="relationname" label="关系名称"></el-table-column>
              <el-table-column prop="beginentity" label="起始实体"></el-table-column>
              <el-table-column prop="targetentity" label="目标实体"></el-table-column>
              <el-table-column fixed="right" label="操作">
                <template #default="scope">
                  <el-link type="danger" class="operation" @click="deleteRelation(scope.row)">删除</el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <!-- 关系列表分页 -->
          <div class="demo-pagination-block">
            <el-pagination
              v-model:current-page="relationCurrentPage"
              v-model:page-size="relationPageSize"
              :page-sizes="[5, 10, 20, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="filteredRelationTable.length"
              @size-change="handleRelationSizeChange" 
              @current-change="handleRelationCurrentChange" 
            />
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>


<script lang="ts">
import { ref, computed } from 'vue';
import Navbar from "@/components/Navbar.vue";

export default {
  name: "GraphData",
  components: {
    Navbar
  },
  setup() {
    const title = localStorage.getItem('ProjectName') || '默认项目名称';

    // 搜索和表格数据
    const entitySearch = ref('');
    const startEntitySearch = ref('');
    const targetEntitySearch = ref('');

    const entitytable = ref([
      { entityname: "李四", entityclass: "产品" },
      { entityname: "王五", entityclass: "产品" },
      { entityname: "赵六", entityclass: "产品" },
      { entityname: "张三", entityclass: "产品" },
      { entityname: "南京", entityclass: "城市" },
      { entityname: "浦口", entityclass: "城市" },
      { entityname: "徐州", entityclass: "城市" },
      { entityname: "北京", entityclass: "城市" },
    ]);

    const relationtable = ref([
      { relationname: "构成", beginentity: "浦口", targetentity: "赵刘" },
      { relationname: "构成", beginentity: "北京", targetentity: "王五" },
      { relationname: "构成", beginentity: "南京", targetentity: "李四" },
      { relationname: "构成", beginentity: "徐州", targetentity: "张三" },
    ]);

    // 实体表格分页相关数据
    const entityCurrentPage = ref(1);
    const entityPageSize = ref(5);

    // 关系表格分页相关数据
    const relationCurrentPage = ref(1);
    const relationPageSize = ref(5);

    // 过滤和分页计算
    const filteredEntityTable = computed(() =>
      entitytable.value.filter(item =>
        item.entityname.includes(entitySearch.value)
      )
    );

    const filteredRelationTable = computed(() =>
      relationtable.value.filter(
        item =>
          item.beginentity.includes(startEntitySearch.value) &&
          item.targetentity.includes(targetEntitySearch.value)
      )
    );

    // 实体表格的分页数据
    const paginatedEntityTable = computed(() => {
      const start = (entityCurrentPage.value - 1) * entityPageSize.value;
      const end = start + entityPageSize.value;
      return filteredEntityTable.value.slice(start, end);
    });

    // 关系列表的分页数据
    const paginatedRelationTable = computed(() => {
      const start = (relationCurrentPage.value - 1) * relationPageSize.value;
      const end = start + relationPageSize.value;
      return filteredRelationTable.value.slice(start, end);
    });

    // 实体表格分页事件
    const handleEntitySizeChange = (newSize: number) => {
      entityPageSize.value = newSize;
    };

    const handleEntityCurrentChange = (newPage: number) => {
      entityCurrentPage.value = newPage;
    };

    // 关系列格分页事件
    const handleRelationSizeChange = (newSize: number) => {
      relationPageSize.value = newSize;
    };

    const handleRelationCurrentChange = (newPage: number) => {
      relationCurrentPage.value = newPage;
    };

    return {
      title,
      entitySearch,
      startEntitySearch,
      targetEntitySearch,
      entitytable,
      relationtable,
      filteredEntityTable,
      filteredRelationTable,
      paginatedEntityTable,
      paginatedRelationTable,
      entityCurrentPage,
      entityPageSize,
      relationCurrentPage,
      relationPageSize,
      handleEntitySizeChange,
      handleEntityCurrentChange,
      handleRelationSizeChange,
      handleRelationCurrentChange,
    };
  }
};
</script>


<style scoped>
.content-container {
  margin-left: 20%;
  padding: 20px;
  flex-grow: 1;
  overflow-y: auto;
}

.design {
  font-size: 15px;
  padding: 15px;
  background-color: #fef9f9;
  border:1px solid;
  box-sizing: border-box;
  margin-bottom: 15px;
}

.generate-button {
  background-color: #205cb1;
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 800px;
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
