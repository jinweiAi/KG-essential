<template>
  <Navbar :title="title"/>
  <div class="content-container">
    <div class="design"><strong>{{buildMethod}}</strong>/大语言模型设计</div>
    <el-card style="background-color: rgba(169,169,169,0.1);height: 670px" v-loading="loading">
      <div style="font-size: 14px">* 为便利您的本体设计过程，您可以选择利用大语言模型读取非结构化文件，为您推荐可能需要的实体、实体属性和实体之间的关系，生成推荐内容后，您可以进行更改内容、选择后提交，应用于本体设计</div>
      <div style="border-radius: 15px">
        <el-row class="box">
          <el-select v-model="targetFileId" placeholder="选择文件" style="width: 30%;">
            <el-option
                v-for="item in fileList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
          <el-button type="primary" @click="LLMGenerate">LLM生成</el-button>
          <div class="try_again" @click="LLMGenerate">
            <el-icon><Refresh /></el-icon>
            <div style="font-size: 12px">效果不好，再试一次</div>
          </div>
        </el-row>
        <el-row v-if="showForm">
          <el-col :span="10">
            <div class="title">实体及其属性</div>
            <!-- 遍历 entityForm 对象 -->
            <div class="form">
              <div v-for="(item, index) in entityForm" :key="index">
                <div class="input_entity">
                  <!-- 点击时触发折叠/展开 -->
                  <el-icon  @click="toggleCollapse(index)" size="small"><ArrowRight v-if="!collapsedList[index]"/><ArrowDown v-if="collapsedList[index]"/></el-icon>
                  <input v-model="item.entity" class="input">
                  <el-icon @click="entityCheck(index)"><CircleCheck class="unselect_checkbox" v-if="!item.entityCheck"/><CircleCheckFilled class="select_checkbox" v-if="item.entityCheck"/></el-icon>
                </div>

                <!-- 遍历该实体的所有字段 -->
                <div v-if="!collapsedList[index] && item.property.length" v-for="(property, propertyIndex) in item.property" :key="propertyIndex">
                  <div class="input_property">
                    <input v-model="item.property[propertyIndex]" style="margin-left: 20px" class="input"/>
                    <el-icon @click="propertyCheck(index,propertyIndex)"><CircleCheck class="unselect_checkbox" v-if="!item.propertyCheck[propertyIndex]"/><CircleCheckFilled class="select_checkbox" v-if="item.propertyCheck[propertyIndex]"/></el-icon>
<!--                    <el-icon @click="removeProperty(index, propertyIndex)" class="delete-btn"><Remove /></el-icon>-->
                  </div>
                </div>
                <!-- 添加字段按钮 -->
<!--                <el-icon @click="addProperty(index)" class="add-field-btn"><CirclePlus /></el-icon>-->
              </div>
            </div>

            <el-button type="primary" class="submit-btn" @click="submitEntity" :disabled="!choseEntity">提交</el-button>
          </el-col>
          <el-col :span="14" style="padding-left: 15px">
            <div class="title">实体之间的关系</div>
            <div class="form">
              <el-row class="subtitle_container">
                <el-col :span="7">
                  <div class="subtitle">头实体</div>
                </el-col>
                <el-col :span="7">
                  <div class="subtitle">关系</div>
                </el-col>
                <el-col :span="7">
                  <div class="subtitle">尾实体</div>
                </el-col>
                <el-col :span="3">
                  <el-icon @click="relationCheckAll"><CircleCheck class="unselect_checkbox" v-if="!allRelation"/><CircleCheckFilled class="select_checkbox" v-if="allRelation"/></el-icon>
                </el-col>
              </el-row>
              <div v-for="(item, index) in relationForm" :key="index">
                <el-row style="margin-bottom: 10px;display: flex;flex-direction: row">
                  <el-col :span="7">
                    <input v-model="item.headEntity" class="input_relation">
                  </el-col>
                  <el-col :span="7">
                    <input v-model="item.relation" class="input_relation">
                  </el-col>
                  <el-col :span="7">
                    <input v-model="item.tailEntity" class="input_relation">
                  </el-col>
                  <el-col :span="3">
                    <el-icon @click="relationCheck(index)"><CircleCheck class="unselect_checkbox" v-if="!item.check"/><CircleCheckFilled class="select_checkbox" v-if="item.check"/></el-icon>
                  </el-col>

                </el-row>
              </div>
            </div>
            <el-button type="primary" class="submit-btn" @click="submitRelation" :disabled="!(submitEntityTask && choseRelation)">提交</el-button>
          </el-col>
        </el-row>



      </div>

    </el-card>

  </div>
</template>


<script>
import Navbar from "@/components/Navbar.vue";
import {createEntitiesAndProperties, createRelations, getAllFile, useAPI} from "@/api/index.js";
import {computed, onMounted, ref} from "vue";
import { Refresh,Remove,CirclePlus,ArrowRight,ArrowDown,CircleCheck,CircleCheckFilled, } from '@element-plus/icons-vue';
import {reactive} from "@vue/runtime-core";
import {ElMessage} from "element-plus";

export default {
  name: "LLMDesign",
  components: {
    Navbar,
    Refresh,
    Remove,
    CirclePlus,
    ArrowRight,
    ArrowDown,
    CircleCheck,
    CircleCheckFilled,
  },
  setup() {
    const title = sessionStorage.getItem('ProjectName')
    const buildMethod = (sessionStorage.getItem('ProjectBuild')==="custom")?"自定义构建":"模版构建";
    const graphId = sessionStorage.getItem('ProjectId');

    const fileList=ref([]);
    const targetFileId=ref("");
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

    onMounted(async () => {
      await getFile();
    });

    const loading=ref(false);
    const showForm=ref(false);

    const originEntityList=ref([]);
    const originRelationList=ref([]);
    const entityForm=reactive([]);
    const relationForm=reactive([]);
    const collapsedList=ref([]);
    const submitEntityTask=ref(false);

    const LLMGenerate=()=>{
      console.log("targetFileId",targetFileId.value);
      let config={
        params:{
          fileId:targetFileId.value,
        }
      }
      loading.value = true;
      useAPI(config).then(res=>{
        loading.value = false;
        if (res.code==='00000') {
          ElMessage({
            message: '生成成功',
            type: 'success', // 可以是 'success', 'warning', 'info', 'error'
          })
          console.log(res.result);
          originEntityList.value=res.result['entity'];
          originEntityList.value.forEach((item)=>{
            let each={
              entity:item.entity,
              property:item.property,
              entityCheck:false,
              propertyCheck:new Array(item.property.length).fill(false),
            }
            entityForm.push(each);
          })
          // entityForm.value=originEntityList.value;
          console.log("originEntityList",originEntityList.value);
          console.log("entityForm",entityForm);
          originRelationList.value=res.result['relation'];
          originRelationList.value.forEach((item)=>{
            let each={
              headEntity:item.headEntity,
              relation:item.relation,
              tailEntity:item.tailEntity,
              check:false,
            }
            relationForm.push(each);
          })
          // relationForm.value=originRelationList.value;
          console.log("originRelationList",originRelationList.value);
          console.log("relationForm",relationForm);
          showForm.value=true;
          submitEntityTask.value=false;
          console.log("submitEntityTask",submitEntityTask.value);
          collapsedList.value=new Array(entityForm.length).fill(false);
        }
      })
    }

    const toggleCollapse = (index) => {
      // console.log("index",index);
      collapsedList.value[index] = !collapsedList.value[index];
      // console.log("collapsedList",collapsedList.value);
    }

    const choseEntity= computed(() => {
      return entityForm.some(item => item.entityCheck);
    });

    const entityCheck=(index)=>{
      entityForm[index].entityCheck=!entityForm[index].entityCheck;
      entityForm[index].propertyCheck=new Array(entityForm[index].property.length).fill(entityForm[index].entityCheck);
      // console.log('entityCheck',entityForm[index].entityCheck);
      // console.log('propertyCheck',entityForm[index].propertyCheck);
    }

    const propertyCheck=(index,propertyIndex)=>{
      entityForm[index].propertyCheck[propertyIndex]=!entityForm[index].propertyCheck[propertyIndex];
      if(entityForm[index].propertyCheck[propertyIndex]){
        entityForm[index].entityCheck=true;
      }
    }

    const allRelation=ref(false);
    const choseRelation= computed(() => {
      return relationForm.some(item => item.check);
    });
    const relationCheckAll=()=>{
      allRelation.value=!allRelation.value;
      relationForm.forEach((item)=>{
        item.check=allRelation.value;
      })
    }

    const relationCheck=(index)=>{
      relationForm[index].check=!relationForm[index].check;
      if (relationForm[index].check){
        allRelation.value=true;
      }else if (relationForm.every(item => !item.check)) {
        allRelation.value=false;
      }
    }


    const submitEntity=()=>{
      console.log('entityForm',entityForm);
      let submitEntityList=[];
      entityForm.forEach((item)=>{
        if (item.entityCheck) {
          let propertyList=[];
          for(let i=0;i<item.property.length;i++){
            if(item.propertyCheck[i]){
              propertyList.push(item.property[i]);
            }
          }
          let each={
            entity:item.entity,
            property:propertyList,
          }
          submitEntityList.push(each);
        }
      })
      console.log("submitEntityList",submitEntityList);
      let config={
        "entityList":submitEntityList,
        "graphId":graphId,
      }
      createEntitiesAndProperties(config).then(res=>{
        if (res.code==='00000') {
          ElMessage({
            message:"实体及其属性创建成功！",
            type: 'success',
          })
          submitEntityTask.value=true;
        }
      })
    }

    const submitRelation=()=>{
      console.log('relationForm',relationForm);
      let submitRelationList=[];
      relationForm.forEach((item)=>{
        if(item.check){
          let each={
            headEntity:item.headEntity,
            relation:item.relation,
            tailEntity:item.tailEntity,
          }
          submitRelationList.push(each);
        }
      })
      console.log("submitRelationList",submitRelationList);
      let config={
        "relationList":submitRelationList,
        "graphId":graphId,
      }
      createRelations(config).then(res=>{
        if (res.code==='00000') {
          ElMessage({
            message:"关系创建成功！",
            type: 'success',
          })
        }
      })
    }
    return {
      title,
      buildMethod,
      graphId,

      fileList,
      targetFileId,

      loading,
      showForm,
      originEntityList,
      originRelationList,
      entityForm,
      relationForm,
      LLMGenerate,

      collapsedList,
      toggleCollapse,

      choseEntity,
      entityCheck,
      propertyCheck,
      choseRelation,
      relationCheck,
      allRelation,
      relationCheckAll,

      submitEntityTask,
      submitEntity,
      submitRelation,
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

.box {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  gap: 10px; /* 设置每个元素之间的间隔 */
}

.try_again {
  color: grey;
  align-items: center;
  display: flex;
  flex-direction:row;
}

::v-deep(.selected-row) {
  background-color: rgb(220,220,220); /* 淡蓝色背景 */
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-left: 10px;
}

.subtitle_container{
  display: flex;                /* 使用 flexbox 来横向排列 */
  white-space: nowrap;          /* 防止换行 */
  overflow-x: auto;             /* 在内容溢出时显示横向滚动条 */
  padding: 10px 0;              /* 如果需要上下内边距可以调整 */
  width: 100%;                     /* 让父容器宽度为100% */
  box-sizing: border-box;          /* 确保内外边距不会影响布局 */
}
.subtitle {
  font-size: 14px;
  margin-bottom: 10px;
  width: 100px;
  margin-right: 10px;
  flex-shrink: 0;
}

.form{
  overflow: auto;
  white-space: nowrap;
  height: 400px;
  background-color: rgb(225,225,225,0.4);
  border-radius: 15px;
  padding: 20px 40px;
}

.plus_icon {
  color: rgb(	255 48 48 );
}
.sub_icon {
  color: rgb(118 238 0);
}

.input{
  background-color: transparent;
  width: 100%;
  color: rgba(0,0,0,0.5);
  border: none;
  /* 下边框样式 */
  border-bottom: 1px solid rgba(0,0,0,0.3);
  padding-bottom: 5px;
  font-size: 14px;
}

.input:focus{
  color: #000000;
  outline: none;
  border-bottom: 1px solid rgba(0,0,0,0.6);
  transition: 0.5s;
}

.input_entity {
  width: 150px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap:10px;
  margin: 10px 0px;
}

.input_property {
  margin-left: 20px;
  width: 150px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap:10px;
  margin-top: 10px;
}

.input_relation{
  margin-right: 10px;
  width: 80%;
  background-color: transparent;
  color: rgba(0,0,0,0.5);
  border: none;
  /* 下边框样式 */
  border-bottom: 1px solid rgba(0,0,0,0.3);
  padding-bottom: 5px;
  font-size: 14px;
}
.input_relation:focus{
  color: #000000;
  outline: none;
  border-bottom: 1px solid rgba(0,0,0,0.6);
  transition: 0.5s;
}

.unselect_checkbox {
  color: rgb(190 190 190);
}

.select_checkbox {
  color: rgb(	50 205 50);
}


.submit-btn {
  float: right;
  margin-right: 10px;
  margin-top: 10px;
}

</style>