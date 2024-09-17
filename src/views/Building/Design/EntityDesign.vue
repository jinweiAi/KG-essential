<template>
<!--  <Navbar />-->

  <Navbar :title="title"/>
  <div class="content-container">
    <span>entity-design</span>




  </div>

</template>


<script setup>
import Navbar from "@/components/Navbar.vue";
import {onMounted, ref} from 'vue';
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const title = ref('')

onMounted(()=>{
  title.value=route.query.name
  console.log('get title:',title.value)

})

// export default {
//   name:"EntityDesign",
//   components: {Navbar},
//   // mounted() {
//   //   const router = useRouter()
//   //   const route = useRoute()
//   //   const title = route.params.graphName
//   //   console.log('receive title:',title);
//   //
//   //   router.push({
//   //     path: '/EntityDesign',
//   //     params:{
//   //       title:title
//   //     }
//   //   });
//   //
//   // },
//   setup(){
//     const router = useRouter()
//     const route = useRoute()
//     const title = ref('')
//
//
//     onMounted(()=>{
//       title.value=route.params.graphName
//     })
//
//
//
//     return {
//       title,
//     }
//
//   }
// };
</script>


<style scoped>
.content-container {
  margin-left: 20%; /* 给内容部分留出导航栏的宽度 */
  padding: 20px;
  flex-grow: 1; /* 内容部分占据剩余的宽度 */
  overflow-y: auto; /* 如果内容超出页面高度，允许滚动 */
}
</style>