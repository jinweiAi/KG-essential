<!-- Navbar.vue -->
<template>
  <div class="Navbar">
    <span class="theme">知识图谱构建平台</span>
    <div>
      <a href="#home">图谱探索</a>
      <a href="#about">构建工具</a>
      <a href="#services">用户中心</a>
      <a href="#concat">帮助文档</a>
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
</template>
  
  <script>
  export default {
    name: "Navbar"
  };
  </script>
  
  <style scoped >
 .Navbar{
  background-color: rgb(56,102,165);
  overflow: visible;
  height:80px;
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

 a{
  float:left;
  display: block;
  color: rgba(255, 255, 255, 0.9);
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

a:hover{
  background-color: rgba(240, 237, 237, 0.925);
}



.menu {
  position: absolute;
  right: 40px;
  margin-left: auto; /* 将菜单字段推到右端 */
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