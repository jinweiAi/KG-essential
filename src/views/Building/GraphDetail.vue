<template>
  <Navbar :title="title"/>
  <div class="content-container">
    <div class="design"><strong>{{buildMethod}}</strong>/图谱详情</div>

    <el-card style="background-color: rgba(169,169,169,0.1)">
      <el-row>
        <el-col :span="4">
          <el-row class="info-box">
            <div class="title">实体标签</div>
            <li v-for="item in itemType" :key="item" class="li-box" :style="{ color: categoryColor[item] }">
              {{item}}
            </li>
          </el-row>
          <el-row class="info-box">
            <div class="title">关系标签</div>
            <li v-for="relation in relationType" :key="relation" class="li-box">
              {{relation}}
            </li>
          </el-row>
        </el-col>
        <el-col :span="16">
          <el-row style="display: block;">
            <div id="graphContainer" style="height: 600px"></div>
          </el-row>
<!--          <el-row style="display: block;justify-self: center">-->
<!--            <el-checkbox-group-->
<!--                v-model="selectedRelation"-->
<!--                @change="handleCheckedChange"-->
<!--            >-->
<!--              <el-checkbox v-for="relation in relationType" :key="relation" :label="relation" :value="relation">-->
<!--                {{ relation }}-->
<!--              </el-checkbox>-->
<!--            </el-checkbox-group>-->
<!--          </el-row>-->
        </el-col>
        <el-col :span="4">
          <el-row class="info-box">
            <div class="title">实例信息</div>
            <div v-if="showNodeInfo" class="info-content">
              <!-- 节点名称 -->
              <div><strong>实例名称：</strong>{{ showNodeInfo.name}}</div>
              <!-- 节点基本信息 -->
              <div><strong>id：</strong>{{ showNodeInfo.id }}</div>
              <div><strong>实体类型：</strong>{{ showNodeInfo.category }}</div>
              <!-- 节点属性信息 -->
              <div v-if="showNodeInfo.property">
                <strong>属性:</strong>
                <li v-for="(value, key) in showNodeInfo.property" :key="key">
                  {{ key }}：{{ value }}
                </li>
              </div>
            </div>
          </el-row>
          <el-row class="info-box">
            <div class="title">关系信息</div>
            <div v-if="showLinkInfo" class="info-content">
              <div><strong>关系名称：</strong>{{ showLinkInfo.relation}}</div>
              <div><strong>头实例id：</strong>{{ showLinkInfo.source }}</div>
              <div><strong>头实例名称：</strong>{{ showLinkInfo.sourceName }}</div>
              <div><strong>尾实例id：</strong>{{ showLinkInfo.target }}</div>
              <div><strong>实例名称：</strong>{{ showLinkInfo.targetName }}</div>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import neo4j from 'neo4j-driver';
import {onMounted, ref} from "vue";
import * as echarts from 'echarts';
import {allEntity} from "@/api/index.js";

export default {
  name: "GraphDetail",
  components: {
    Navbar
  },
  setup() {
    const title = sessionStorage.getItem('ProjectName');
    const buildMethod = (sessionStorage.getItem('ProjectBuild')==="custom")?"自定义构建":"模版构建";
    const graphId = sessionStorage.getItem('ProjectId');

    // Neo4j 配置
    const driver = neo4j.driver(
        'bolt://localhost:7687',  // 这里填写你的 Neo4j 数据库的 URI
        neo4j.auth.basic('neo4j', '12345678')  // 替换为你的用户名和密码
    );

    const entityList=ref([]);
    const categoryColor=ref([]);
    async function getAllEntity(){
      let config={
        params:{
          graphId:graphId,
        }
      }
      return allEntity(config).then(res=>{
        if (res.code==='00000') {
          console.log(res.result);
          entityList.value=res.result;
        }
        console.log("entityList",entityList.value);
        entityList.value.forEach(item => {
          categoryColor.value[item.type] = item.color;
        });
        console.log("categoryColor",categoryColor.value);
      })
    }

    const queryResult=ref("");
    const nodes=ref([]);
    const links=ref([]);
    const relationType=ref([]);
    const itemType=ref([]);

    function extractProperties(properties) {
      let excludedKeys = ['name', 'node_name']; // 要排除的属性键
      let filteredProperties = Object.keys(properties)
          .filter(key => !excludedKeys.includes(key)) // 过滤掉 name 和 node_name
          .reduce((obj, key) => {
            obj[key] = properties[key]; // 保留其他属性
            return obj;
          }, {});
      return filteredProperties; // 返回过滤后的对象
    }

    const queryNeo4j = async()=> {
      const session = driver.session();
      try {
        // 执行查询语句
        let query="MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m";
        const result = await session.run(query);
        console.log("result",result);

        result.records.forEach(record => {
          const source = record.get('n');
          const target = record.get('m');
          const relationship = record.get('r');
          let head_node={
            id: source.properties.node_name,
            name: source.properties.name,
            category: source.labels[0],
            itemStyle:{color:categoryColor.value[source.labels[0]]},
            property:extractProperties(source.properties),
          };
          if (!nodes.value.some(node => JSON.stringify(node) === JSON.stringify(head_node))) {
            nodes.value.push(head_node);
          }
          if (target && relationship){
            let tail_node={
              id: target.properties.node_name,
              name: target.properties.name,
              category: target.labels[0],
              itemStyle:{color:categoryColor.value[target.labels[0]]},
              property:extractProperties(target.properties),
            };
            if (!nodes.value.some(node => JSON.stringify(node) === JSON.stringify(tail_node))) {
              nodes.value.push(tail_node);
            }
            links.value.push({ source: head_node.id, target: tail_node.id, value: relationship.type });
          }
        });
        // 变量记录已处理的边，避免相同节点对的边重叠
        const linkCount = {};
        // 为每个 link 设置不同的 curveness 值
        links.value.forEach(link => {
          const key = `${link.source}-${link.target}`;
          if (!linkCount[key]) {
            linkCount[key] = 0;
          }
          // 为边增加弧度值，不同的边使用不同的弧度值来防止重叠
          link.curveness = 0.2 + (linkCount[key] * 0.2);  // 每个额外的边增加弧度
          linkCount[key] += 1;
        });
        console.log("nodes",nodes);
        console.log("links",links);
      } catch (error) {
        console.error('Error querying Neo4j:', error);
      } finally {
        await session.close();
      }
      const chartDom = document.getElementById('graphContainer');
      const myChart = echarts.init(chartDom);

      relationType.value = [...new Set(links.value.map(link => link.value))];
      itemType.value = [...new Set(nodes.value.map(node => node.category ))];
      console.log("relationType",relationType.value);
      console.log("itemType",itemType.value);

      let option = {
        title: {
          text: '数据关系图',
          textStyle:{
            fontSize:28
          },
          left: "center",
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            let data = params.data;
            if (params.dataType==='node'){
              if (data) {
                let content = `<strong>${data.name || 'No Name'}</strong><br/>`; // 节点名称
                content += `id: ${data.id}<br/>`;
                content += `实体类型: ${data.category}<br/>`;
                // 判断并输出 property 属性
                if (data.property) {
                  content += `属性：<br/>`; // 输出 "属性：" 作为分隔
                  for (const key in data.property) {
                    content += `&ensp; ${key}: ${data.property[key]}<br/>`; // 输出每个属性和值
                  }
                }
                return content;
              }else return '';
            }
          }
        },
        series: [
          {
            type: 'graph',
            layout: 'force',
            draggable:true,
            symbolSize: 50,  // 节点大小
            nodes: nodes.value,
            links: links.value,
            categories: [...new Set(nodes.value.map(node => ({ name: node.category })))],
            roam: true,  // 启用拖拽和缩放
            scaleLimit: {
              min: 0.2, // 最小缩放比例
              max: 3    // 最大缩放比例
            },
            label: {
              show: true,
              position: 'inside',
              formatter: '{b}',
              align: 'center'
            },
            force: {
              edgeLength: 150,
              gravity: 0.2,
              repulsion: 700
            },
            lineStyle: {
              width: 2,
              curveness: 0.2 // 基础弧度，稍后会被 links 中的 curveness 覆盖
            },
            edgeSymbol: ['none', 'arrow'],
            edgeLabel: {
              show: true,
              formatter: '{c}'
            }
          },
        ]
      };
      // 渲染图表
      myChart.setOption(option);

      myChart.on('click', function (params) {
        // 检查是否点击的是节点（node），排除点击线条等其他元素的情况
        let data = params.data;
        if (params.dataType === 'node') {
          showNodeInfo.value=data;
          console.log("showNodeInfo",showNodeInfo.value);
        } else if (params.dataType === 'edge') {
          let startName;
          let endName;
          for(let i=0;i<nodes.value.length;i++){
            if (data.source===nodes.value[i].id){
              startName=nodes.value[i].name;
              break;
            }
          }
          for(let i=0;i<nodes.value.length;i++){
            if (data.target===nodes.value[i].id){
              endName=nodes.value[i].name;
              break;
            }
          }
          showLinkInfo.value={
            source:data.source,
            sourceName:startName,
            target:data.target,
            targetName:endName,
            relation:data.value,
          }
          console.log("showLinkInfo",showLinkInfo.value);
        }
      });
    }

    const showNodeInfo=ref('');
    const showLinkInfo=ref('');

    // queryNeo4j().then(({ nodes, links })=>{
    //   const chartDom = document.getElementById('graphContainer');
    //   const myChart = echarts.init(chartDom);
    //
    //   relationType.value = [...new Set(links.value.map(link => link.value))];
    //   itemType.value = [...new Set(nodes.value.map(node => node.category ))];
    //   console.log("relationType",relationType.value);
    //   console.log("itemType",itemType.value);
    //
    //   let option = {
    //     title: {
    //       text: '数据关系图',
    //       textStyle:{
    //         fontSize:28
    //       },
    //       left: "center",
    //     },
    //     tooltip: {
    //       trigger: 'item',
    //       formatter: function(params) {
    //         let data = params.data;
    //         if (params.dataType==='node'){
    //           if (data) {
    //             let content = `<strong>${data.name || 'No Name'}</strong><br/>`; // 节点名称
    //             content += `id: ${data.id}<br/>`;
    //             content += `实体类型: ${data.category}<br/>`;
    //             // 判断并输出 property 属性
    //             if (data.property) {
    //               content += `属性：<br/>`; // 输出 "属性：" 作为分隔
    //               for (const key in data.property) {
    //                 content += `${key}: ${data.property[key]}<br/>`; // 输出每个属性和值
    //               }
    //             }
    //             return content;
    //           }else return '';
    //         }
    //         // else if (params.dataType==='edge'){
    //         //   if (data) {
    //         //     let content = `<strong>${data.value || 'No Name'}</strong><br/>`; // 节点名称
    //         //     content += `头实例: ${data.source}<br/>`;
    //         //     content += `尾实例: ${data.target}<br/>`;
    //         //     return content;
    //         //   }else return '';
    //         // }else return '';
    //       }
    //     },
    //     // legend: [{
    //     //   type: 'scroll',
    //     //   orient: 'horizontal',
    //     //   bottom:0,
    //     //   data: [...new Set(nodes.value.map(node => ({ name: node.category })))],
    //     // }],
    //     series: [
    //       {
    //         type: 'graph',
    //         layout: 'force',
    //         draggable:true,
    //         symbolSize: 50,  // 节点大小
    //         nodes: nodes.value,
    //         links: links.value,
    //         categories: [...new Set(nodes.value.map(node => ({ name: node.category })))],
    //         roam: true,  // 启用拖拽和缩放
    //         scaleLimit: {
    //           min: 0.2, // 最小缩放比例
    //           max: 3    // 最大缩放比例
    //         },
    //         label: {
    //           show: true,
    //           position: 'inside',
    //           formatter: '{b}',
    //           align: 'center'
    //         },
    //         force: {
    //           edgeLength: 150,
    //           gravity: 0.2,
    //           repulsion: 700
    //         },
    //         lineStyle: {
    //           width: 2,
    //           curveness: 0.2 // 基础弧度，稍后会被 links 中的 curveness 覆盖
    //         },
    //         edgeSymbol: ['none', 'arrow'],
    //         edgeLabel: {
    //           show: true,
    //           formatter: '{c}'
    //         }
    //       },
    //     ]
    //   };
    //
    //   // 渲染图表
    //   myChart.setOption(option);
    //
    //   myChart.on('click', function (params) {
    //     // 检查是否点击的是节点（node），排除点击线条等其他元素的情况
    //     let data = params.data;
    //     if (params.dataType === 'node') {
    //       showNodeInfo.value=data;
    //       console.log("showNodeInfo",showNodeInfo.value);
    //     } else if (params.dataType === 'edge') {
    //       let startName;
    //       let endName;
    //       for(let i=0;i<nodes.value.length;i++){
    //         if (data.source===nodes.value[i].id){
    //           startName=nodes.value[i].name;
    //           break;
    //         }
    //       }
    //       for(let i=0;i<nodes.value.length;i++){
    //         if (data.target===nodes.value[i].id){
    //           endName=nodes.value[i].name;
    //           break;
    //         }
    //       }
    //       showLinkInfo.value={
    //         source:data.source,
    //         sourceName:startName,
    //         target:data.target,
    //         targetName:endName,
    //         relation:data.value,
    //       }
    //       console.log("showLinkInfo",showLinkInfo.value);
    //     }
    //   });
    // })


    //neovis.js方法 失败
    // const config = {
    //   container_id: "viz",
    //   neo4j: {
    //     server_url: "bolt://localhost:7687",
    //     server_user: "neo4j",
    //     server_password: "12345678",
    //   },
    //   initial_cypher: 'MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m',
    // };
    // function draw() {
      //获取dom元素
      // var viz1 = this.$refs.viz1;
      //创建veovis实例
      // var viz;


      //配置项
      // let config = {
      //   container_id: "viz",
      //   //neo4j服务器地址，用户名 和 密码
      //   neo4j: {
      //     serverUrl: "bolt://localhost:7687",
      //     serverUser: "neo4j",
      //     serverPassword: "12345678",
      //   },
      //   ///labels是节点央样式的配置：
      //   /// caption ：节点显示的文字对应内容
      //   /// community： 节点颜色
      //   /// size：节点大小
      //   /// font：节点字体大小设置
      //   //没有在这个地方配置的节点将会是默认样式
      //   // labels: {
      //   //   "CITY": { caption: "name", community: "#5496FF", size: 200, font: { size: 35, color: "#606266", }, },
      //   //   "基本待遇政策": { caption: "name", community: "#5496FF", size: 95, font: { size: 25, color: "#606266", } },
      //   //   "基本筹资政策": { caption: "name", community: "#5496FF", size: 95, font: { size: 25, color: "#606266", }, },
      //   // },
      //   ///relationships是关系线段样式的配置：
      //   /// caption ：线段显示的文字对应内容
      //   /// thickness： 线段粗细
      //   /// font：节点字体大小设置
      //   //没有在这个地方配置的线段将会是默认样式
      //   // relationships: {
      //   //   "待遇支付政策": { thickness: 1, caption: true, font: { size: 15, color: "#606266", }, },
      //   //   "待遇主体类别": { thickness: "count", caption: true, font: { size: 15, color: "#606266", }, },
      //   // },
      //   //是否显示箭头
      //   arrows: true,
      //   hierarchical: true,
      //   // 分层结构或者默认 "hubsize"（默认）和"directed".
      //   // hierarchical_sort_method: 'hubsize',
      //   hierarchical_sort_method: 'directed',
      //   //配置数据库查询语句，MATCH n RETURN n,尝试过不对，必须用 MATCH p=()-->() RETURN p
      //   initial_cypher: 'MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m',
      //   // session:driver.session(),
      // };
      // const vis = new NeoVis(config.value);
      // vis.render();
    // }

    onMounted(async () => {
      await getAllEntity();
      console.log("getAllEntity done");
      let generate=sessionStorage.getItem("GraphGenerate");
      console.log("generate",generate);
      if (generate==='true'){
        await queryNeo4j();
        console.log("queryNeo4j done");
      }else {
        console.log("Skipping queryNeo4j because generate is false");
      }
      // neovis.js方法 失败
      // const viz = new NeoVis(config.value);
      // viz.render();
      // console.log(viz);
    })

    return{
      title,
      buildMethod,
      graphId,

      entityList,
      categoryColor,

      driver,
      queryResult,
      queryNeo4j,

      nodes,
      links,
      relationType,
      itemType,

      showNodeInfo,
      showLinkInfo,

    }
  },
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

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.info-box{
  display: block;
  margin-top: 20px;
  height: 280px;
  background-color: rgba(169, 169, 169, 0.2);
  border-radius: 5px;
  padding: 10px;
  overflow: auto;
  white-space: nowrap;
}

.info-content{
  font-size: 14px;
  overflow-y: auto;
  white-space: nowrap;
  line-height: 1.8;
}

.li-box{
  padding-left: 5px;
  overflow-y: auto;
  white-space: nowrap;
  font-size: 14px;
  line-height: 1.6;
}
</style>