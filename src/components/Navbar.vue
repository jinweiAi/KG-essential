<!-- Navbar.vue -->
<template>
  <!--侧边栏-->
  <el-aside>
    <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical-demo"
        @select="handleSelect"
        unique-opened
        router
    >
      <header style="background-color: rgba(169,169,169,0.5)">
        <div class="title-inner">{{ title }}</div>
      </header>
      <!-- 带有子列表的菜单项 -->
      <el-sub-menu index="Design">
        <template #title>
          <el-icon><Suitcase /></el-icon>
          <span><pre>   本体设计</pre></span>
        </template>
        <el-menu-item index="EntityDesign"><pre>  实体设计</pre></el-menu-item>
        <el-menu-item index="RelationDesign"><pre>  关系设计</pre></el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="Data">
        <template #title>
          <el-icon><Histogram /></el-icon>
          <span><pre>   数据管理</pre></span>
        </template>
        <el-menu-item index="StructuralData"><pre>  结构化数据</pre></el-menu-item>
        <el-menu-item index="UnstructuralData"><pre>  非结构化数据</pre></el-menu-item>
      </el-sub-menu>

      <!-- 另一个带子菜单的项 -->
      <el-sub-menu index="GraphMapping">
        <template #title>
          <el-icon><DataLine /></el-icon>
          <span><pre>   图谱映射</pre></span>
        </template>
        <el-menu-item index="StructuredMapping"><pre>  结构化映射</pre></el-menu-item>
        <el-menu-item index="UnstructuredMapping"><pre>  非结构化映射</pre></el-menu-item>
      </el-sub-menu>

      <!-- 没有子菜单的菜单项 -->
      <el-menu-item index="GraphData">
        <el-icon><Grid /></el-icon>
        <span>图谱数据</span>
      </el-menu-item>

      <el-menu-item index="GraphDetail">
        <template #title>
          <el-icon><More /></el-icon>
          <span>图谱详情</span>
        </template>
      </el-menu-item>
    </el-menu>

  </el-aside>

</template>

<!--<template>-->
<!--  <el-aside>-->
<!--    <el-menu-->
<!--        :default-active="activeIndex"-->
<!--        @select="handleSelect"-->
<!--        class="el-menu-vertical-demo"-->
<!--        router-->
<!--        unique-opened-->
<!--    >-->
<!--      <header style="background-color: rgba(169,169,169,0.5)">-->
<!--        <div class="title-inner">{{ title }}</div>-->
<!--      </header>-->
<!--      <div v-for="(item,index) in menu" :key="index">-->
<!--        &lt;!&ndash; 一级&ndash;&gt;-->
<!--        <el-menu-item  v-if="item.Subclass.length === 0" :index="item.id">-->
<!--          &lt;!&ndash; vue3中图标是以组件的形式引入 遍历的时候要用组件的形式遍历&ndash;&gt;-->
<!--          <el-icon><Component :is="item.icon"></Component></el-icon>-->
<!--          <span>{{item.title}}</span>-->
<!--        </el-menu-item>-->

<!--        &lt;!&ndash; 二级三级&ndash;&gt;-->
<!--        <el-sub-menu  v-if="item.Subclass.length>0" :index="item.id" >-->
<!--          <template #title>-->
<!--            <el-icon><Component :is="item.icon"></Component></el-icon>-->
<!--            <span>{{item.title}}</span>-->
<!--          </template>-->
<!--          <div v-for="(itemTwo,index) in item.Subclass " :key='index'>-->
<!--            <el-menu-item :index="itemTwo.id">{{itemTwo.title}}</el-menu-item>-->
<!--          </div>-->
<!--        </el-sub-menu>-->
<!--      </div>-->
<!--    </el-menu>-->
<!--  </el-aside>-->
<!--</template>-->


<script setup>
import {onMounted, ref} from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { Suitcase,Histogram,DataLine,Grid,More } from '@element-plus/icons-vue';
import {reactive, shallowRef} from "@vue/runtime-core";
const router = useRouter()
const route = useRoute()
const activeIndex = ref('EntityDesign') // 默认选中的菜单项
const title = ref('')
// defineProps({
//   title: {
//     type: String,
//     required: true
//   }
// });

onMounted(()=>{
  title.value=localStorage.getItem('ProjectName')
  activeIndex.value = route.name || 'EntityDesign'; // 使用当前的路由名称或默认值
})

const handleSelect = (key) => {
  console.log(`Selected: ${key}`);
  activeIndex.value=key;
  router.push({
    path:"/"+key
  })
};

// const Array=[
//   {
//     id:'Design',
//     icon:Suitcase,
//     title:'本体设计',
//     router:'',
//     Subclass:[
//       {
//         id:'EntityDesign',
//         title:'实体设计',
//         router:'EntityDesign',
//       },
//       {
//         id:'RelationDesign',
//         title:'关系设计',
//         router:'RelationDesign',
//       }
//     ]//是否有二级三级等等菜单
//   },
//   {
//     id:'Data',
//     icon:Histogram,
//     title:'用户列表',
//     router:'',
//     Subclass:[
//       {
//         id:'StructuralData',
//         title:'结构化数据',
//         router:'StructuralData',
//       },
//       {
//         id:'UnstructuralData',
//         title:'非结构化数据',
//         router:'UnstructuralData',
//       }
//     ]//是否有二级三级等等菜单
//   },
//   {
//     id:'GraphMapping',
//     icon:DataLine,
//     title:'图谱映射',
//     router:'',
//     Subclass:[
//       {
//         id:'StructuredMapping',
//         title:'结构化映射',
//         router:'StructuredMapping',
//       },
//       {
//         id:'UnstructuredMapping',
//         title:'非结构化映射',
//         router:'UnstructuredMapping',
//       }
//     ]//是否有二级三级等等菜单
//   },
//   {
//     id:'GraphData',
//     icon:Grid,
//     title:'图谱数据',
//     router:'GraphData',
//     Subclass:[]//是否有二级三级等等菜单
//   },
//   {
//     id:'GraphDetail',
//     icon:More,
//     title:'图谱详情',
//     router:'GraphDetail',
//     Subclass:[]//是否有二级三级等等菜单
//   }
// ]
// const menu = shallowRef(Array)

// onMounted(()=>{
//   activeIndex.value = route.name || 'EntityDesign'; // 使用当前的路由名称或默认值
// })

// export default {
//   name: 'Navbar',
//   props:{
//     title: {
//       type: String,
//       required: true
//     }
//   },
//   setup(props){
//     const router = useRouter()
//     const route = useRoute()
//     const activeIndex = ref('EntityDesign') // 默认选中的菜单项
//     const NavTitle = props.title
//
//
//     // onMounted(()=>{
//     //   title.value=defineProps({
//     //     title: {
//     //       type: String,
//     //       required: true
//     //     }
//     //   });
//     // })
//
//     const handleSelect = (key) => {
//       console.log(`Selected: ${key}`);
//       activeIndex.value=key;
//       router.push({
//         path:"/"+key
//       })
//     };
//
//     return{
//       activeIndex,
//       NavTitle,
//       handleSelect,
//     }
//   }
// }

</script>

<style scoped >

.title-inner {
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
}
 .el-menu-vertical-demo {
   height: 100%;
   width: 20%;
   overflow: visible;
   position: fixed;
 }

 .custom-menu-item el-menu-item, .custom-menu-item el-sub-menu__title {
   font-size: 14px; /* 保持字体大小一致 */
   font-weight: normal; /* 保持字体粗细一致 */
   line-height: 56px; /* 统一行高 */
   height: 56px; /* 统一高度 */
   padding-left: 20px; /* 设置统一的内边距 */
   display: flex;
   align-items: center; /* 确保内容垂直居中 */
 }

 /* 在鼠标悬停时效果 */
 .custom-menu-item el-menu-item:hover, .custom-menu-item el-sub-menu__title:hover {
   background-color: #f0f0f0; /* 鼠标悬停时的背景色 */
 }

.custom-menu-item el-menu-item:hover, .custom-menu-item el-sub-menu__title:active {
  background-color: #f0f0f0; /* 鼠标点击时的背景色 */
}

 /* 去除箭头的内边距，保证一致性 */
 .custom-menu-item .el-sub-menu__title i {
   margin-right: 10px;
 }

 .el-sub-menu :deep(.el-sub-menu__icon-arrow) {
   .el-icon-arrow-down {
     display: none;
   }
 }

el-aside {
 background-color: #fff !important;
 margin-right: 10px;
}
el-menu {
 border-right: solid 1px #fff;
}
el-menu-item {
 width: 92%;
 margin: 0 auto;
 padding: 0 10px !important;
 height: 40px;
 line-height: 40px;
 font-size: 13px;
}
.el-menu-item > i {
 margin-right: 30px !important;
}
el-menu-item:focus,
el-menu-item:hover {
 outline: 0;
 background-color: #f0f0f0 !important;
}

el-menu-item.is-active {
  background-color: rgba(0, 0, 0, 0);
}
.logout-fix {
 position: fixed;
 left: 30px;
 bottom: 20px;
}
.logout-fix .logout-name {
 min-width: 60px;
 background-color: #7e57c2 !important;
 border-color: #7e57c2 !important;
 color: #fff;
 border-radius: 16px;
 font-size: 14px;
 height: 32px;
 text-align: center;
 padding: 0 10px;
 margin-left: -10px;
 line-height: 32px;
 margin-bottom: 14px;
 cursor: pointer;
}
.logout-fix .logout {
 color: #00000099;
 font-size: 14px;
 cursor: pointer;
}
.logout-fix .logout:hover {
 color: #000000;
}
</style>