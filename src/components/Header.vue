<template>
  <div class="Navbar">
    <span class="theme">知识图谱构建平台</span>
    <div>
      <button
          class="a"
          :class="{ active: activeButton === 'explore' }"
          @click="goToRoute('explore')"
      ><el-icon size="15" class="icon-box"><ChatRound /></el-icon>图谱探索</button>
      <button
          class="a"
          :class="{ active: activeButton === 'tools' }"
          @click="goToRoute('tools')"
      ><el-icon size="15" class="icon-box"><Operation /></el-icon>构建工具</button>
      <button
          class="a"
          :class="{ active: activeButton === 'user' }"
          @click="goToRoute('user')"
      ><el-icon size="15" class="icon-box"><User /></el-icon>用户中心</button>
      <button
          class="a"
          :class="{ active: activeButton === 'help' }"
          @click="goToRoute('help')"
      ><el-icon size="15" class="icon-box"><Document /></el-icon>帮助文档</button>
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
</template>

<script>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { ChatRound,Operation,User,Document } from '@element-plus/icons-vue';

export default {
  name: 'GraphList',
  components:{
    ChatRound,
    Operation,
    User,
    Document
  },
  setup(){
    const router = useRouter()
    const route = useRoute()
    const activeButton= ref('tools')

    function goToRoute(route) {
      // 根据点击的按钮设置当前活动按钮
      activeButton.value = route;

      // 路由跳转，根据 route 参数设置不同的路由
      switch (route) {
        case 'explore':
          console.log('to explore page')
          // router.push({
          //   path: '/',
          // }); // 跳转到“图谱探索”页面
          break;
        case 'tools':
          console.log('to tools page')
          router.push({
            path: '/',
          }); // 跳转到“构建工具”页面
          break;
        case 'user':
          console.log('to user page')
          // router.push({
          //   path: '/',
          // }); // 跳转到“用户中心”页面
          break;
        case 'help':
          console.log('to help page')
          // router.push({
          //   path: '/',
          // }); // 跳转到“帮助文档”页面
          break;
        default:
          break;
      }
    }

    return{
      activeButton,
      goToRoute,
    }
  }
}


</script>

<style scoped>

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
.icon-box{
  margin-right: 5px;
  text-decoration: none;
  position: relative;
}

.a{
  background-color: transparent; /* 背景透明 */
  margin: 20px;
  border: none; /* 无边框 */
  float:left;
  display: block;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  text-decoration: none;
  position: relative;
  transition: background-color 0.3s ease;
  font-size: 18px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
}

/* 选中状态的按钮样式 */
.active {
  color: white; /* 点击后文字变为蓝色 */
}

/* 你也可以添加 hover 效果 */
.a:hover {
  color: white; /* 鼠标悬停时变为灰色 */
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
</style>