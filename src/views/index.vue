<template>
  <div id="Index">
    <el-container>
      <!-- header -->
      <el-header>
        <!-- logo -->

        <!-- menu -->
        <el-menu
          :default-active="headMenu.activeIndex"
          :class="headMenu.class"
          :mode="headMenu.mode"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item  v-for="(menu,index) in headMenu.data" :key="index"  :index="menu.index">{{menu.text}}</el-menu-item>
        </el-menu>
      </el-header>
      <!-- container -->
      <el-container>
        <!-- aside -->
        <el-aside v-if="true">
          <el-menu :default-openeds="openedsIndex" :default-active="aside.activeIndex">
            <el-submenu  v-for="(submenu,index) in aside.submenu" :key="index"  :index="submenu.index">
              <template #title><i :class="submenu.icon"></i>{{submenu.text}}</template>
              <!-- group menu -->
              <el-menu-item-group v-for="(group,ind) in submenu.group" :key="ind" :title="group.title">
                <el-menu-item v-for="(data,i) in group.data" :key="i" :index="data.index">
                  <router-link :to="data.link">{{data.text}}</router-link>
                </el-menu-item>
              </el-menu-item-group>
              <!-- submenu -->
              <el-menu-item v-for="(data,i) in submenu.data" :key="i" :index="data.index">
                <router-link @click="handleBreadcrumb(submenu,data)" :to="data.link">{{data.text}}</router-link>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-main>
          <!-- 面包屑 -->
          <el-breadcrumb v-if="currentList.length>0" separator="/">
            <el-breadcrumb-item v-for="(item,i) in currentList" :key="i" :index="i.index" :to="{ path: item.path }">{{item.text}}</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- 路由出口 -->
          <!-- 路由匹配到的组件将渲染在这里 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import {router} from '@/router'

export default {
  name: "Index",
  components: {},
  data() {
    return {
      // 头部导航菜单
      headMenu:{
        activeIndex:'2', // 默认页面 index
        class:"el-menu-demo",
        mode:"horizontal",
        data:[
        {index:"0",text:"首页"},
        {index:"1",text:"权限管理"},
        {index:"2",text:"数据库管理"},
        {index:"3",text:"人员查询"},
        {index:"4",text:"企业查询"},
        {index:"5",text:"分析管理"},
        {index:"6",text:"爬虫管理"},
        {index:"7",text:"消息中心"},
      ]},
      // 替换的菜单
      aside:{
      },
      // 默认展开menu
      openedsIndex:["0-1","1-1","2-1","3-1","4-1","5-1","6-1","7-1"],
      // 菜单集
      asides:{
        aside0:{
          activeIndex:'0-1-1',
          submenu:[
            {
              index:"0-1",
              text:"首页",
              icon:"el-icon-message",
              data:[
                {index:"0-1-1",text:"消息中心",link:""},

              ]
            },
          ]
        },
        aside1:{
          activeIndex:'1-1-1',
          submenu:[
            {
              index:"1-1",
              text:"权限管理",
              icon:"el-icon-message",
              data:[
                {index:"1-1-1",text:"用户管理",link:""},
                {index:"1-1-2",text:"权限管理",link:""},
                {index:"1-1-3",text:"项目管理",link:""},
                {index:"1-1-4",text:"菜单管理",link:""},
                {index:"1-1-5",text:"消息中心",link:""},
              ]
            },
          ]
        },
        aside2:{
          activeIndex:'2-1-1',
          submenu:[
            {
              index:"2-1",
              text:"数据管理",
              icon:"el-icon-message",
              data:[
                {index:"2-1-1",text:"数据库",link:"/database"},
                {index:"2-1-2",text:"数据类型",link:"/databasetype"},
                {index:"2-1-3",text:"表管理",link:"/tables"},
                {index:"2-1-4",text:"索引类型",link:"/userindex"},
                {index:"2-1-5",text:"字段管理",link:"/columns"},
              ]
            },
            {
              index:"2-2",
              text:"数据迁移",
              icon:"el-icon-message",
              data:[
                {index:"2-2-1",text:"简单复制",link:"/user"},
                {index:"2-2-2",text:"复杂清洗",link:"/table"},
              ]
            },
            {
              index:"2-3",
              text:"代码管理",
              icon:"el-icon-message",
              data:[
                {index:"2-3-1",text:"项目管理",link:"/user"},
                {index:"2-3-2",text:"代码生成配置",link:"/table"},
              ]
            },
         ]
        },
        aside3:{
          activeIndex:'3-1-1',
          openedsIndex:[],
          submenu:[
            {
              index:"3-1",
              text:"人员查询",
              icon:"el-icon-message",
              data:[
                {index:"3-1-1",text:"查询条件配置",link:"/user"},
                {index:"3-1-2",text:"查询类型配置",link:"/table"},
                {index:"3-1-3",text:"查询",link:"/table"},
                {index:"3-1-4",text:"查询日志",link:"/table"},
                {index:"3-1-5",text:"日志分析",link:"/table"},
              ]
            }
          ]
        },
        aside4:{
          activeIndex:'4-1-1',
          submenu:[
            {
              index:"4-1",
              text:"企业查询",
              icon:"el-icon-message",
              data:[
                {index:"4-1-1",text:"查询条件配置",link:"/user"},
                {index:"4-1-2",text:"查询类型配置",link:"/table"},
                {index:"4-1-3",text:"查询",link:"/table"},
                {index:"4-1-4",text:"查询日志",link:"/table"},
                {index:"4-1-5",text:"日志分析",link:"/table"},
              ]
            }
          ]
        },
        aside5:{
          activeIndex:'5-1-1',
          submenu:[
            {
              index:"5-1",
              text:"分析管理",
              icon:"el-icon-message",
              data:[
                {index:"5-1-1",text:"模板管理",link:""},
                {index:"5-1-2",text:"图形搭配",link:""},
              ]
            }
          ]
        },
        aside6:{
          activeIndex:'6-1-1',
          submenu:[
            {
              index:"6-1",
              text:"爬虫管理",
              icon:"el-icon-message",
              data:[
                {index:"6-1-1",text:"机器信息",link:""},
                {index:"6-1-2",text:"爬虫项目信息",link:""},
                {index:"6-1-3",text:"爬虫项目管理",link:""},
              ]
            }
          ]
        },
        aside7:{
          activeIndex:'7-1-1',
          submenu:[
            {
              index:"7-1",
              text:"消息中心",
              icon:"el-icon-message",
              data:[
                {index:"7-1-1",text:"消息中心",link:""},
                {index:"7-1-2",text:"消息统计分析",link:""},
                {index:"7-1-2",text:"网站链接",link:""},
              ]
            }
          ]
        },
      },
      // 面包屑
      currentList:[]

    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.aside = this.asides["aside"+this.headMenu.activeIndex];
      router.push("/home"+this.headMenu.activeIndex);
      this.currentList.push({path:"/home"+this.headMenu.activeIndex,text:this.headMenu.data[this.headMenu.activeIndex].text})
    },
    handleSelect(index){
      // 切换aside
      this.aside = this.asides["aside"+index];
      // 更换默认页面
      var path = '/home'+index;
      router.push(path);
      this.currentList=[];
      this.currentList[0]={path:path,text:this.headMenu.data[index].text};
    },
    handleBreadcrumb(submenu,data){
      this.currentList[1]={text:submenu.text};
      this.currentList[2]={text:data.text};

    }
  },
};
</script>
<style lang="scss" scoped>
#Index {
  .el-header {
    padding: 0px;
  }
}
</style>