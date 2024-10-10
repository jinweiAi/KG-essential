<template>

  <Navbar :title="title"/>
  <div class="content-container">
    <div class="design"><strong>{{buildMethod}}</strong>/结构化数据</div>
    <el-card style="background-color: rgba(169,169,169,0.1)">
      <el-row :gutter="20">
        <el-col :span="12" class="button-block">
          <el-button type="primary" class="button-box" @click="uploadDialogVisible = true">添加文件</el-button>
<!--          <el-button type="primary" class="button-box">模块下载</el-button>-->
          <el-button type="primary" class="button-box" @click="deleteMulti">批量删除</el-button>
          <el-button type="primary" class="button-box" @click="downloadMulti">批量下载</el-button>
        </el-col>
        <el-col :span="12">
          <el-input v-model="searchQuery" placeholder="按文件名称搜索" class="input-box" @input="handleSearch">
            <template #prepend>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
          v-model:selection="multipleSelection"
          :data="searchedList"
          @selection-change="handleSelectionChange"
          stripe
          class="table-box"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="id" label="序号" width="60"></el-table-column>
        <el-table-column prop="name" label="文件名称" min-width="200"></el-table-column>
        <el-table-column prop="type" label="文件类型" width="120"></el-table-column>
        <el-table-column prop="size" label="文件大小" width="80"></el-table-column>
        <el-table-column prop="uploadTime" label="更新时间" width="220"></el-table-column>

        <!-- 操作列 -->
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope" >
            <el-link type="primary" class="operation" @click="previewFile(scope.row)">预览</el-link>
            <el-link type="success" class="operation" @click="downloadFile(scope.row)">下载</el-link>
            <el-link type="danger" class="operation" @click="deleteOne(scope.row)">删除</el-link>
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
            :total=searchedList.length
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>

    </el-card>

    <el-dialog  v-model="uploadDialogVisible" width="40%" draggable>
      <template #header>
        <span style="font-size: 24px;font-weight: bold;">上传文件</span>
      </template>
<!--      <el-upload :file-list="fileList" :on-change="changeFile" drag :limit="1" accept=".xlsx"-->
<!--                 action="http://localhost:9090/task/uploadFile" name="file" :on-success="uploadSuccess" :on-remove="removeFile"-->
<!--                 :data="{ graphID: graphId }">-->
<!--        选择文件或拖拽-->
<!--      </el-upload>-->
<!--      <el-upload :file-list="fileList" :on-change="changeFile" drag :limit="1" accept=".xlsx"-->
<!--                 name="file" :on-success="uploadSuccess" :on-remove="removeFile">-->
<!--        选择文件或拖拽-->
<!--      </el-upload>-->
      <el-upload
          :file-list="fileList"
          :on-change="changeFile"
          class="upload-demo"
          action="http://localhost:9090/task/uploadFile"
          :auto-upload="false"
          accept=".xlsx"
          drag
          name="file"
          :on-remove="removeFile"
      >选择文件或拖拽
<!--        <template #trigger>-->
<!--          <el-button type="primary">select file</el-button>-->
<!--        </template>-->

<!--        <el-button class="ml-3" type="success" @click="submitUpload">-->
<!--          upload to server-->
<!--        </el-button>-->

<!--        <template #tip>-->
<!--          <div class="el-upload__tip">-->
<!--            jpg/png files with a size less than 500kb-->
<!--          </div>-->
<!--        </template>-->
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button :disabled="ableToUpload" type="primary" @click="submitUpload">上传文件</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="excelFormVisible" width="80%" draggable>
<!--      <iframe src=previewSrc width="600" height="400"></iframe>-->
      <vue-office-excel
          :src="previewSrc"
          style="height: 200px"
          @rendered="renderedHandler"
          @error="errorHandler"
      />
    </el-dialog>


  </div>

</template>

<!--<script type="text/javascript" src="https://cdn.bootcss.com/qs/6.7.0/qs.min.js"></script>-->
<script >
import Navbar from "@/components/Navbar.vue";
import {computed, onMounted, ref} from 'vue';
import {getAllFile, deleteFileById, downloadOne, downloadFiles} from "@/api/index.js"
import axios from 'axios';
import {ElMessage} from "element-plus";
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'
import qs from 'qs'

export default {
  name: "StructuralData",
  components: {
    Navbar,
    VueOfficeExcel,
  },
  setup(){
    const title = localStorage.getItem('ProjectName');
    const buildMethod = (localStorage.getItem('ProjectBuild')==="custom")?"自定义构建":"模版构建";
    const graphId = localStorage.getItem('ProjectId');

    console.log(title);

    const originList=ref([]);
    const searchedList=ref([]);
    // 搜索框的数据
    const searchQuery = ref('');
    // 处理搜索事件
    const handleSearch = () => {
      console.log('搜索:', searchQuery.value);
      if (searchQuery.value) {
        searchedList.value=[];
        for (let i=0;i<originList.value.length;i++) {
          if (originList.value[i].name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
            searchedList.value.push(originList.value[i]);
          }
        }
      }else {
        searchedList.value = originList.value;
      }
      console.log("searchedList",searchedList.value);
    };

    function getFileList(){
      let config={
        params:{
          graphID:graphId
        }
      }
      getAllFile(config).then(res=>{
        originList.value=[];
        if (res.code==='00000') {
          console.log(res.result);
          res.result.forEach(item => {
            let list = {
              id: item.id,
              name: item.name,
              type: item.type,
              size: item.size,
              uploadTime: item.updateTime,
            }
            originList.value.push(list);
          })
          console.log("originList", originList.value);
          searchedList.value=originList.value;
        }
      })
    }

    onMounted(()=>{
      getFileList();
    })

    const multipleSelection = ref([]);

    // 处理表格选择
    const handleSelectionChange = (val) => {
      multipleSelection.value = val;
    };

    const deleteMulti=()=>{
      console.log("multipleSelection",multipleSelection.value);
      let idArray=[];
      for(let i=0;i<multipleSelection.value.length;i++){
        idArray.push(multipleSelection.value[i].id);
      }
      console.log(typeof idArray);
      console.log("idArray",idArray);
      let config={
        params:{
          idList:idArray,
        },
        paramsSerializer: {
          serialize: params => {
            return qs.stringify(params, {indices:false})
          }
        }
      }
      deleteFileById(config).then(res=>{
        console.log(res);
        if (res.code === '00000') {
          ElMessage({
            message: '删除成功',
            type: 'success', // 可以是 'success', 'warning', 'info', 'error'
          })
          getFileList();
        }else{
          ElMessage({
            message: "id为"+res.data.result+"的文件删除失败！",
            type: 'error', // 可以是 'success', 'warning', 'info', 'error'
          });
        }
      })
    }

    //文件上传处理
    const uploadDialogVisible = ref(false);
    
    const fileList = ref([]);
    
    const changeFile = (file) =>{
      fileList.value=[file];
      console.log(fileList.value);
    }

    const uploadSuccess = (response,file)=>{
      fileList.value.push(file);
      console.log(fileList.value);
    }

    const removeFile = (response,file)=>{
      fileList.value.splice(fileList.value.indexOf(file),1);
      console.log(fileList.value);
    }

    // const upload = async()=>{
    //   console.log("上传文件")
    //   if (fileList.value.length>0){
    //     const formData = new FormData(); // 创建一个 FormData 对象
    //     formData.append("file", fileList.value[0].raw); // 将文件添加到 FormData
    //     formData.append("graphID", graphId); // 添加其他参数
    //     uploadFile(formData).then(res=>{
    //       if (res.code==='00000'){
    //         console.log("上传成功")
    //       }else {
    //         console.log("上传失败请重试")
    //       }
    //     })
    //   }
    // }

    const ableToUpload = computed(()=>{
      return fileList.value.length===0;
    })

    const submitUpload=()=>{
      console.log("fileList",fileList.value)
      if (fileList.value.length>0){
        const formData = new FormData(); // 创建一个 FormData 对象
        formData.append("file", fileList.value[0].raw); // 将文件添加到 FormData
        formData.append("graphID", graphId); // 添加其他参数

        axios.post("http://localhost:9090/task/uploadFile", formData)
          .then(res => {
            console.log(res);
            if (res.data.code === '00000') {
              console.log("上传成功");
              uploadDialogVisible.value=false;
              ElMessage({
                message: '上传成功',
                type: 'success', // 可以是 'success', 'warning', 'info', 'error'
              });
              getFileList();
            } else {
              ElMessage({
                message: res.data.result,
                type: 'error', // 可以是 'success', 'warning', 'info', 'error'
              });
            }
            fileList.value=[];
          })
          .catch(err => {
            console.error("上传出现错误", err);
          });
      }
    }

    const currentPage = ref(1)
    const pageSize = ref(100)

    const size = ref('small')

    const excelFormVisible=ref(false);
    const previewSrc=ref("");

    const renderedHandler = () => {
      console.log('Excel rendered successfully.');
    };

    const errorHandler = (error) => {
      console.error('Error rendering Excel:', error);
    };
    // 操作处理函数
    const previewFile = (row) => {
      //TODO:
      console.log('预览文件: ', row);
      // previewSrc.value = "http://localhost:9090/files/%E6%B5%8B%E8%AF%952.xlsx";
      // window.open("https://view.officeapps.live.com/op/view.aspx?src="+encodeURIComponent(previewSrc))
      excelFormVisible.value=true;

      // let config={
      //   params:{
      //     id:row.id,
      //   }
      // }
      // fetchContent(config).then(res=>{
      //   console.log(res);
      //   if (res.code === "00000") {
      //     console.log(res.result);
          // 解码返回的base64字符串为ArrayBuffer
          // excelFormVisible.value=true;
          // const binaryString = atob(res.result);
          // const len = binaryString.length;
          // const bytes = new Uint8Array(len);
          // for (let i = 0; i < len; i++) {
          //   bytes[i] = binaryString.charCodeAt(i);
          // }
          // const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          // 创建预览 URL
          // previewSrc.value = URL.createObjectURL(blob);
          // previewSrc.value = "http://localhost:9090/files/%E6%B5%8B%E8%AF%952.xlsx";
          // const reader = new FileReader();
          // reader.onload = (e) => {
          //   console.log(e.target.result); // 查看读取的内容
          // };
          // reader.readAsText(blob);
          // window.open("https://view.officeapps.live.com/op/view.aspx?src="+encodeURIComponent(previewSrc))
          // console.log("previewSrc",previewSrc.value);
      //   } else {
      //     console.error(res.msg);
      //   }
      // })
      // const blob = new Blob([file], { type: file.type });
      // previewSrc.value = URL.createObjectURL(blob);
    };

    function download(result,name){
      const url = window.URL.createObjectURL(new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    const downloadFile = async (row) => {
      console.log('下载文件: ', row.name);
      let config = {
        params: {
          id: row.id,
        },
        responseType: 'blob'
      }
      await downloadOne(config).then((res => {
        let name = row.name;
        download(res,name);
      }))
    };

    const downloadMulti = async () => {
      console.log("multipleSelection",multipleSelection.value);
      let idArray=[];
      for(let i=0;i<multipleSelection.value.length;i++){
        idArray.push(multipleSelection.value[i].id);
      }
      let config={
        params:{
          fileIds:idArray,
        },
        paramsSerializer: {
          serialize: params => {
            return qs.stringify(params, {indices:false})
          }
        },
        responseType: 'blob',
      }
      await downloadFiles(config).then(res=>{
        download(res,'结构化数据文件.zip');
      })
    }

    const deleteOne = (row) => {
      console.log('删除文件: ', row.name);
      let config={
        params:{
          idList:row.id,
        }
      }
      deleteFileById(config).then(res=>{
        console.log(res);
        if (res.code === '00000') {
          ElMessage({
            message: '删除成功',
            type: 'success', // 可以是 'success', 'warning', 'info', 'error'
          })
          getFileList();
        }else{
          ElMessage({
            message: "id为"+res.data.result+"的文件删除失败！",
            type: 'error', // 可以是 'success', 'warning', 'info', 'error'
          });
        }
      })
    };

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
      originList,
      searchedList,
      searchQuery,
      handleSearch,
      uploadDialogVisible,
      fileList,
      changeFile,
      uploadSuccess,
      removeFile,
      ableToUpload,
      submitUpload,
      previewSrc,
      renderedHandler,
      errorHandler,
      excelFormVisible,
      previewFile,
      downloadFile,
      downloadMulti,
      deleteOne,
      multipleSelection,
      deleteMulti,
      handleSelectionChange,
      handleSizeChange,
      handleCurrentChange,
      pageSize,
      currentPage,
      size,
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

.button-block {
  display: flex;
  gap: 20px; /* 设置元素之间的间距 */
  align-items: center; /* 垂直居中 */
  overflow-x: auto;
  white-space: nowrap;
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

.preview-box {
  width: 60%;
  height: 60%;
}

</style>