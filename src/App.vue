<template>
  <div id="app">
    <el-container>
      <el-aside style='width: 200px;'>
        <el-menu
          default-active="2"
          class="me-menu"
          @open='hd-open'
          @close='hd-close'
          background-color='#545c64'
          text-color='#fff'
          active-text-color='#ffd04b'>
            <router-link to='home' @click='goto'>
              <el-menu-item index='2'>
                <i class='el-icon-document'></i>
                <span>首页</span>
              </el-menu-item>
            </router-link>
            <el-submenu index='1'>
              <template slot='title'>
                <i class='el-icon-menu'></i>
                <span>导航二</span>
              </template>
              <el-menu-item-group>
                <template slot='title'>分组一</template>
                <el-menu-item index='1-1'>选项1</el-menu-item>
                <el-menu-item index='1-2'>选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title='分组二'>
                <el-menu-item index='1-3'>选项3</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title='分组三'>
                <el-menu-item index='1-4'>选项4</el-menu-item>
              </el-menu-item-group>
              <el-submenu index='1-5' title='选项5'>
                <template slot='title'>
                  <span>选项5四</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index='1-5-1'>选项5-1</el-menu-item>
                  <el-menu-item index='1-5-2'>选项5-2</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-submenu>
            <el-menu-item disabled>
              <i class='el-icon-document'></i>
              <span>导航三</span>
            </el-menu-item>
            <el-menu-item index='4'>
              <i class='el-icon-document'></i>
              <span>导航四</span>
            </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <el-row>
            <el-col :span='8' class='brand'>
              <img src='/static/img/elmentLogo.svg'>博客管理
            </el-col>

            <el-col :span='16' class='operation'>
              <el-badge :value="12" :max="99" class="opitem">
                  <el-button size="small"><i class="el-icon-message fs16"></i></el-button>
                </el-badge>
                <el-badge :value="100" :max="99" class="opitem">
                  <el-button size="small"><i class="el-icon-bell fs16"></i></el-button>
                </el-badge>
              <div class='opitem user-box'>
                <img src='/static/img/elmentLogo.svg' class='user-img'>
                <span class='welcom'>
                  <span class='wel-text'>欢迎</span><br/>
                  <span class='wel-user'>{{ username }}</span>
                </span>
              </div>
              <div class='opitem'>
                <el-dropdown>
                  <span class="el-dropdown-link">
                    退出<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>修改密码</el-dropdown-item>
                    <el-dropdown-item>退出</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for='(item, idx) in bread' :to="{ path: item.to }" :key=idx>
              <router-link :to='item.to'>{{ item.text }}</router-link>
            </el-breadcrumb-item>
          </el-breadcrumb>
          <router-view/>
        </el-main>
        <el-footer>
          footer
        </el-footer>
      </el-container>
    </el-container>
    
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      bread: [
        { text: '首页', to: '/'},
        { text: '百度', to: '/menu'},
        { text: '热词', to: ''}
      ],
      username: 'jiouai'
    }
  },
  created() {
    console.log(this.bread)
  },
  methods: {
    goto() {
      console.log(this)
    }
  }
}
</script>

<style>
a {
  text-decoration: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
}
.el-container{
  height: 100%;
}
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
.el-aside{
  height: 100%;
  background-color: #545c64;
  text-align: left;
}
.el-menu{
  border: none;
}
.el-main {
    color: #333;
    text-align: center;
    padding: 0;
  }
.el-breadcrumb {
  box-sizing: border-box;
    background-color: #eff2f7;
    margin-bottom: 5px;
    width: 100%;
    padding: 20px;
}
.brand{
  text-align: left;
  font-size: 18px;
  line-height: 60px;
  vertical-align: middle;
}
.brand img{
  width: 30px;
  height: 30px;
  margin-right: 8px;
  line-height: 60px;
  vertical-align: sub;
}
.operation{
  box-sizing: border-box;
  padding: 14px 0 10px;
  height: 60px;
  text-align: right;
  line-height: 18px;
}
.opitem{
  display: inline-block;
  margin-right: 16px;
}
.user-box {
  margin-left: 20px;
}
.user-box .user-img{
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  vertical-align: middle;
}
.user-box .welcom{
  display: inline-block;
  vertical-align: middle;
}
.wel-text{
  color: #ffffff;
}
.wel-user{
  color: #67C23A;
}
.el-button--small, .el-button--small.is-round{
  padding: 5px 8px;
}
.fs16{
  font-size: 16px;
}
</style>
