<template>
  <div>
    <!-- 溜井信息 -->
    <el-row :gutter="2">
      <!-- 左边占6/10 -->
      <el-col :span="14">
        <el-card class="box-card1" shadow="always">
          <div slot="header" class="clearfix">
            <span class="blockquote">溜井信息</span>
            <div style="float:right;">
              <el-button plain type="primary">批量启用</el-button>
              <el-button plain type="warning">批量禁用</el-button>
              <el-button plain type="primary">+  新增计划</el-button>
            </div>
          </div>
          <el-table
              v-model:selection="wellInfoMultipleSelection"
              @selection-change="wellInfoHandleSelectionChange"
              :data="wellInfo"
              class="table-box"
              border
          >
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column prop="name" label="溜井名称" min-width="90px"></el-table-column>
            <el-table-column prop="volume" label="溜井存量" min-width="90px"></el-table-column>
            <el-table-column prop="status" label="状态" width="60px"></el-table-column>
            <el-table-column prop="level" label="使用水平" min-width="90px"></el-table-column>
            <el-table-column prop="unit" label="使用单位" min-width="90px"></el-table-column>
            <el-table-column prop="others" label="其他开口" min-width="90px"></el-table-column>
            <el-table-column prop="target_fe" label="目标品位Fe" min-width="100px"></el-table-column>
            <el-table-column prop="actual_fe" label="实际品位Fe" min-width="100px"></el-table-column>
            <el-table-column prop="action" label="序号" width="60px">
              <template #default="scope">
                <el-link type="primary"  @click="wellInfoHandleEdit(scope.row)">编辑</el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 右边占4/10 -->
      <el-col :span="10">
        <el-card class="box-card1" shadow="always">
          <div slot="header" class="clearfix">
            <span class="blockquote">工作面信息</span>
          </div>
          <el-table :data="workInfo" class="table-box" border>
            <el-table-column prop="order" label="序号"></el-table-column>
            <el-table-column prop="area" label="区域" >
              <template v-slot="scope">
                <el-popover
                    placement="bottom"
                    width="400"
                    trigger="hover"
                >
                  <!-- 弹出的表格内容 -->
                  <span>水平：-235M;区域：-235M东北;联络道：4LN;进路：N23</span>
                  <el-table :data="areaInfo" border class="inner-table-box">
                    <el-table-column prop="diamondShape" label="菱形块号"></el-table-column>
                    <el-table-column prop="collapseAmount" label="崩矿量"></el-table-column>
                    <el-table-column prop="miningCars" label="出矿车数"></el-table-column>
                    <el-table-column prop="geoFe" label="地质样Fe"></el-table-column>
                  </el-table>
                  <template #reference>
                    <!-- 原区域单元格 -->
                    <el-link type="primary"> {{ scope.row.area }} </el-link>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="latest" label="最新菱形形状号" min-width="120px"></el-table-column>
            <el-table-column prop="number" label="崩矿量"></el-table-column>
            <el-table-column prop="depth" label="出矿车数"></el-table-column>
            <el-table-column prop="fe" label="地矿样Fe"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>


    <!-- 第二部分：溜井配矿计划 -->
    <el-card class="box-card2" shadow="always">
      <div slot="header" class="clearfix">
        <span class="blockquote">溜井配矿计划</span>
        <span class="info-box">班组：班组｜班次：早班｜日期：2024-06-10</span>
        <div style="float:right;">
          <el-button plain type="primary">批量下发</el-button>
          <el-button plain type="primary">+  新增计划</el-button>
        </div>
      </div>
      <el-table
          v-model:selection="planInfoMultipleSelection"
          @selection-change="planInfoHandleSelectionChange"
          :data="planInfo"
          class="table-box"
          border
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="level" label="水平">
          <template v-slot="scope">
            <el-select v-model="selectedLevel[scope.$index]">
              <el-option
                  v-for="(option, index) in scope.row.level"
                  :key="index"
                  :label="option"
                  :value="option"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="area" label="区域">
          <template v-slot="scope">
            <el-select v-model="selectedArea[scope.$index]">
              <el-option
                  v-for="(option, index) in scope.row.area"
                  :key="index"
                  :label="option"
                  :value="option"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="connection" label="联络道">
          <template v-slot="scope">
            <el-select v-model="selectedConnection[scope.$index]">
              <el-option
                  v-for="(option, index) in scope.row.connection"
                  :key="index"
                  :label="option"
                  :value="option"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="enter" label="进路">
          <template v-slot="scope">
            <el-select v-model="selectedEnter[scope.$index]">
              <el-option
                  v-for="(option, index) in scope.row.enter"
                  :key="index"
                  :label="option"
                  :value="option"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="well" label="溜井">
          <template v-slot="scope">
            <el-select v-model="selectedWell[scope.$index]">
              <el-option
                  v-for="(option, index) in scope.row.well"
                  :key="index"
                  :label="option"
                  :value="option"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="cars" label="车数"></el-table-column>
        <el-table-column prop="fe" label="预计品位"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <div v-if="scope.row.status === 'undo'">
              <el-link type="primary" class="operation" @click="planInfoHandleEdit(scope.row)">编辑</el-link>
              <el-link type="primary" class="operation" @click="planInfoDo(scope.row)">下发</el-link>
              <el-icon size="11" class="each-icons" @click="planInfoDelete(scope.row)"><Delete /></el-icon>
            </div>
            <div v-else>
              <span style="color: lightgrey">已下发</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {ref} from "vue";
import {Delete} from '@element-plus/icons-vue';

export default {
  components:{
    Delete,
  },
  setup(){
    const wellInfo=ref([
      { name: '1-5', volume: '876', status: '启用', level: '-303', unit: '回采', others: '-288', target_fe: '40', actual_fe:'39' },
      { name: '1-5', volume: '876', status: '启用', level: '-303', unit: '回采', others: '-288', target_fe: '40', actual_fe:'39' },
      { name: '1-5', volume: '876', status: '启用', level: '-303', unit: '回采', others: '-288', target_fe: '40', actual_fe:'39' },
      { name: '1-5', volume: '876', status: '禁用', level: '-303', unit: '回采', others: '-288', target_fe: '40', actual_fe:'39' },
    ])

    const wellInfoMultipleSelection = ref([]);

    // 处理表格选择
    const wellInfoHandleSelectionChange = (val) => {
      wellInfoMultipleSelection.value = val;
      //TODO:
    };

    const wellInfoHandleEdit=(row)=>{
      console.log('Editing:', row);
      //TODO:
    }

    const workInfo=ref([
      { order: '01', area: '-235M', latest: 'DN030427',number:'566', depth: '20', fe: '36' },
      { order: '02', area: '-235M', latest: 'DN030427',number:'566', depth: '20', fe: '36' },
      { order: '03', area: '-235M', latest: 'DN030427',number:'566', depth: '20', fe: '36' },
      { order: '04', area: '-235M', latest: 'DN030427',number:'566', depth: '20', fe: '36' },
      { order: '05', area: '-235M', latest: 'DN030427',number:'566', depth: '20', fe: '36' },
      { order: '06', area: '-235M', latest: 'DN030427',number:'566', depth: '20', fe: '36' },
    ])

    const areaInfo=ref([
      {diamondShape:'DN030427',collapseAmount:'566',miningCars:'20',geoFe:'36'},
      {diamondShape:'DN030427',collapseAmount:'566',miningCars:'20',geoFe:'36'},
      {diamondShape:'DN030427',collapseAmount:'566',miningCars:'20',geoFe:'36'},
      {diamondShape:'DN030427',collapseAmount:'566',miningCars:'20',geoFe:'36'},
      {diamondShape:'DN030427',collapseAmount:'566',miningCars:'20',geoFe:'36'},
      {diamondShape:'DN030427',collapseAmount:'566',miningCars:'20',geoFe:'36'},
    ])

    const planInfo=ref([
      { level: ['-235M','a','b'], area: ['-235M东北','e','f'], connection: ['4LN','5LN','11LN'],enter:['N23','N26','N30'], well: ['256','1024'], cars: '5', fe: '40.1',status:'undo'},
      { level: ['-235M','a','b'], area: ['-235M东北','e','f'], connection: ['4LN','5LN','11LN'],enter:['N23','N26','N30'], well: ['256','1024'], cars: '3', fe: '40.1',status:'done'},
      { level: ['-235M','a','b'], area: ['-235M东北','e','f'], connection: ['4LN','5LN','11LN'],enter:['N23','N26','N30'], well: ['256','1024'], cars: '10', fe: '40.1',status:'undo'},
      { level: ['-235M','a','b'], area: ['-235M东北','e','f'], connection: ['4LN','5LN','11LN'],enter:['N23','N26','N30'], well: ['256','1024'], cars: '8', fe: '40.1',status:'done'},
    ])

    const planInfoMultipleSelection = ref([]);

    // 处理表格选择
    const planInfoHandleSelectionChange = (val) => {
      planInfoMultipleSelection.value = val;
      //TODO:
    };

    // 初始化 selectedXXX数组以存储每一行的选定单位
    const selectedLevel= ref(planInfo.value.map(item => item.level[0])); // 默认显示第一项
    const selectedArea=ref(planInfo.value.map(item => item.area[0]));
    const selectedConnection=ref(planInfo.value.map(item => item.connection[0]));
    const selectedEnter=ref(planInfo.value.map(item => item.enter[0]));
    const selectedWell=ref(planInfo.value.map(item => item.well[0]));

    const planInfoHandleEdit=(row)=>{
      console.log(row)
      //TODO:
    }

    const planInfoDo = (row)=>{
      console.log(row)
      //TODO:
    }

    const planInfoDelete=(row)=>{
      console.log(row)
      //TODO:
    }



    return{
      wellInfo,
      wellInfoMultipleSelection,
      wellInfoHandleSelectionChange,
      wellInfoHandleEdit,

      workInfo,
      areaInfo,

      planInfo,
      planInfoMultipleSelection,
      planInfoHandleSelectionChange,

      selectedLevel,
      selectedArea,
      selectedConnection,
      selectedEnter,
      selectedWell,

      planInfoHandleEdit,
      planInfoDo,
      planInfoDelete,

    }
  }

};
</script>

<style scoped>
.blockquote {
  border-left: 4px solid #1870c9;
  padding-left: 10px;
  color: black;
  font-size: large;
  font-weight: bold;
}

.box-card1 {
  margin: 10px;
  height: 350px;
}

.box-card2 {
  margin: 10px;
  height: 350px;
}


.table-box{
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
  max-height: 250px;
  overflow-y: auto;
}

:deep(.table-box) thead tr>th{
  background-color: rgba(113, 189, 251, 0.3);
  color: black;
}

.inner-table-box{
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  max-height: 200px;
  overflow-y: auto;
}

.info-box{
  margin-left: 30px;
  background-color: #dfdfdf;
  color: #1870c9;
  padding: 5px 15px 5px 15px;
  font-size: small;
}

.each-icons {
  color: darkorange;
}

.operation {
  margin-right: 10px;
}

</style>
