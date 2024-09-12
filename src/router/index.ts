import { createRouter, createWebHistory } from 'vue-router'

// 导入你的组件
import EntityDesign from '@/views/Building/Design/EntityDesign.vue'
import RelationDesign from '@/views/Building/Design/RelationDesign.vue'
import StructuralData from '@/views/Building/Data/StructuralData.vue'
import UnstructuralData from '@/views/Building/Data/UnstructuralData.vue'
import StructuredMapping from '@/views/Building/GraphMapping/StructuredMapping.vue'
import UnstructuredMapping from '@/views/Building/GraphMapping/UnstructuredMapping.vue'
import GraphData from '@/views/Building/GraphData.vue'
import GraphDetail  from "@/views/Building/GraphDetail.vue"


const routes = [
    {
        path: '/',
        name: 'EntityDesign',
        component: EntityDesign
    },
    {
        path: '/EntityDesign',
        name: 'EntityDesign',
        component: EntityDesign
    },
    {
        path: '/RelationDesign',
        name: 'RelationDesign',
        component: RelationDesign
    },
    {
        path: '/StructuralData',
        name: 'StructuralData',
        component: StructuralData
    },
    {
        path: '/UnstructuralData',
        name: 'UnstructuralData',
        component:UnstructuralData
    },
    {
        path: '/StructuredMapping',
        name: 'StructuredMapping',
        component:StructuredMapping
    },
    {
        path: '/UnstructuredMapping',
        name: 'UnstructuredMapping',
        component:UnstructuredMapping
    },
    {
        path: '/GraphData',
        name: 'GraphData',
        component:GraphData
    },
    {
        path: '/GraphDetail',
        name: 'GraphDetail',
        component:GraphDetail
    },
    // ...其他路由配置
    // {
    //     path: '/about',
    //     name: 'About',
    //     component: About
    // }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
