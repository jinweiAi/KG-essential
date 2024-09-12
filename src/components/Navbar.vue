<!-- Navbar.vue -->
<template>
  <div class="Navbar">
    <span class="theme">知识图谱构建平台</span>
    <div>
      <button class="a">图谱探索</button>
      <button @click="toBuildingPage" class="a">构建工具</button>
      <button href="#services" class="a">用户中心</button>
      <button href="#concat" class="a">帮助文档</button>
    </div>
    <div class="menu">
      <span class="menu-label">超级管理员</span>
      <div class="dropdown">
        <a href="#information">信息</a>
        <a href="#settings">设置</a>
        <a href="#logout">退出</a>
      </div>
    </div>
  </div>


<!--    </el-menu>-->
<!--&lt;!&ndash;      <div class="logout-fix">&ndash;&gt;-->
<!--&lt;!&ndash;        <el-tooltip&ndash;&gt;-->
<!--&lt;!&ndash;            class="item"&ndash;&gt;-->
<!--&lt;!&ndash;            effect="light"&ndash;&gt;-->
<!--&lt;!&ndash;            :content="getUserRole"&ndash;&gt;-->
<!--&lt;!&ndash;            placement="right"&ndash;&gt;-->
<!--&lt;!&ndash;        >&ndash;&gt;-->
<!--&lt;!&ndash;          <div class="logout-name">{{ getUsername() }}</div>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-tooltip>&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="logout" @click="logout()">退出登录</div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--  </el-aside>-->

<!--  侧边栏-->
  <el-aside>
    <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical-demo"
        @select="handleSelect"
        unique-opened
        router
    >
      <!-- 带有子列表的菜单项 -->
      <el-sub-menu index="Design" class="custom-menu-item">
        <template #title>
          <!--        <el-icon>< /></el-icon>-->
          <span>本体设计</span>
        </template>
        <el-menu-item index="EntityDesign">实体设计</el-menu-item>
        <el-menu-item index="RelationDesign">关系设计</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="Data" class="custom-menu-item">
        <template #title>
          <!--        <el-icon><Grid /></el-icon>-->
          <span>数据管理</span>
        </template>
        <el-menu-item index="StructuralData">结构化数据</el-menu-item>
        <el-menu-item index="UnstructuralData">非结构化数据</el-menu-item>
      </el-sub-menu>

      <!-- 另一个带子菜单的项 -->
      <el-sub-menu index="GraphMapping" class="custom-menu-item">
        <template #title>
          <!--        <el-icon><Picture /></el-icon>-->
          <span>图谱映射</span>
        </template>
        <el-menu-item index="StructuredMapping">结构化映射</el-menu-item>
        <el-menu-item index="UnstructuredMapping">非结构化映射</el-menu-item>
      </el-sub-menu>

      <!-- 没有子菜单的菜单项 -->
      <el-sub-menu index="GraphData" class="custom-menu-item">
        <template #title>
          <!--        <el-icon><Picture /></el-icon>-->
          <span>图谱数据</span>
        </template>
      </el-sub-menu>

      <el-sub-menu index="GraphDetail" class="custom-menu-item">
        <template #title>
          <!--        <el-icon><Picture /></el-icon>-->
          <span>图谱详情</span>
        </template>
      </el-sub-menu>
    </el-menu>

  </el-aside>

</template>
  
<script>
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router'

  export default {
    name: "Navbar",
    setup() {
      const activeIndex = ref('EntityDesign'); // 默认选中的菜单项

      const handleSelect = (key) => {
        console.log(`Selected: ${key}`);
        activeIndex.value=key;
        router.push({
          path:"/"+key
        })
      };

      const router = useRouter()
      const route = useRoute()

      function toBuildingPage() {
        console.log("toBuildPage")
        router.push({
          path: '/EntityDesign',
          // query: {
          //   title: ''
          // }
        })
      }

      // function toUserPage() {
      //
      //   router.push({
      //     path: '/EntityDesign',
      //     // query: {
      //     //   title: ''
      //     // }
      //   })
      // }
      //
      // function toExplorePage() {
      //   router.push({
      //     path: '/EntityDesign',
      //     // query: {
      //     //   title: ''
      //     // }
      //   })
      // }

      return {
        activeIndex,
        handleSelect,
        toBuildingPage,
      };
    }
  };
  </script>
  
<style scoped >

.Navbar{
  background-color: rgb(56,102,165);
  overflow: visible;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.theme{
  position:absolute;
  left:40px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 25px;
  line-height: 60px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
}

.a{
  background-color: transparent; /* 背景透明 */
  border: none; /* 无边框 */
  float:left;
  display: block;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  padding: 14px 20px;
  text-decoration: none;
  margin: 0 10px;
  position: relative;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  font-size: 18px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
}

.a:hover{
  color: white;
}

.a:active{
  color: white;
}


.menu {
  position: absolute;
  right: 40px;
  font-size: 14px;
}

.menu-label {
  color: rgba(255, 255, 255, 0.8); /* 使用稍透明的白色 */
  font-size: 20px;
  cursor: pointer; /* 鼠标悬停时显示指针光标 */
}

.dropdown {
  display: none; /* 初始隐藏下拉菜单 */
  position: absolute;
  top: 100%; /* 使下拉菜单出现在菜单字段下方 */
  right: 0; /* 对齐到菜单字段的右侧 */
  background-color: rgb(56, 102, 165);
  border-radius: 4px; /* 添加圆角效果 */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3); /* 添加阴影效果 */
  white-space: nowrap; /* 防止文本换行 */
}

.menu:hover .dropdown {
  display: block; /* 鼠标悬浮时显示下拉菜单 */
}

.dropdown a {
  display: block;
  padding: 10px 20px;
  color: rgba(242, 241, 241, 0.8); /* 使用稍透明的白色 */
  text-decoration: none;
}

 .el-menu-vertical-demo {
   height: 100%;
   width: 20%;
   overflow: visible;
   position: fixed;
 }

 .custom-menu-item .el-menu-item, .custom-menu-item .el-sub-menu__title {
   font-size: 14px; /* 保持字体大小一致 */
   font-weight: normal; /* 保持字体粗细一致 */
   line-height: 56px; /* 统一行高 */
   height: 56px; /* 统一高度 */
   padding-left: 20px; /* 设置统一的内边距 */
   display: flex;
   align-items: center; /* 确保内容垂直居中 */
 }

 /* 在鼠标悬停时效果 */
 .custom-menu-item .el-menu-item:hover, .custom-menu-item .el-sub-menu__title:hover {
   background-color: #f0f0f0; /* 鼠标悬停时的背景色 */
 }

.custom-menu-item .el-menu-item:hover, .custom-menu-item .el-sub-menu__title:active {
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


.title {
  padding: 16px;
}
.title-inner {
 background-color: #9fa8da !important;
 border-color: #9fa8da !important;
 border-radius: 8px !important;
 line-height: 40px;
 height: 40px;
 text-align: center;
 font-size: 21px;
 font-weight: bold;
}
.el-aside {
 background-color: #fff !important;
 margin-right: 10px;
}
.el-menu {
 border-right: solid 1px #fff;
}
.el-menu-item {
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
.el-menu-item:focus,
.el-menu-item:hover {
 outline: 0;
 background-color: #f0f0f0 !important;
}

.el-menu-item.is-active {
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