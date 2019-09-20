<template>
  <div class="login">
    <!-- <loginbg></loginbg> -->
    <xlbg></xlbg>
    <div class="bgMask">
      
    </div>
    <div class="contain">
      <h2 class="login-title">欢迎来到xx监控系统</h2>
      <div class="item">
        <div class="label">
          账号：
        </div>
        <el-input
          popper-class="my-autocomplete"
          v-model="account"
          placeholder="请输入账号"
          size="medium"
          @select="handleSelect">
          <i
            class="el-icon-s-custom el-input__icon"
            slot="suffix"
            @click="handleIconClick">
          </i>
        </el-input>
      </div>
      <!-- 密码 -->
      <div class="item mt10">
        <div class="label">
          密码：
        </div>
        <el-input 
          placeholder="请输入密码" 
          v-model="password" 
          size="medium"
          show-password></el-input>
      </div>
      <!-- 按钮 -->
      <div class="submit-botton">
        <el-button type="primary" size="medium" @click="submit">登录</el-button>
      </div>
      
    </div>
  </div>
</template>

<script>
import loginbg from '@/components/loginBg.vue'
import xlbg from '@/components/xlbg.vue'
export default {
 data () {
   return {
    item: {
      address: 'ads',
      value: 1
    },
    account: 123,
    password: 123,
   }
 },
 components: {
  loginbg,
  xlbg
 },
 mounted() {
   
 },
 methods: {
  submit () {
    console.log(this.account, this.password)
  },
  handleSelect () {

  },
  handleIconClick () {

  }
 }
}
</script>

<style scoped>
.login {
  position: fixed;
  top: 0;
  left: 0;
  /*right: 0;
  bottom: 0;*/
  width: 100%;
  height: 100%;
  background: #080325;
  /*background: url('../common/image/loginbg.jpg') center center no-repeat;*/
  background-size: 100% 100%;
}
/*.bgMask {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 500px;
  width: 670px;
  border: 1px solid #eee;
  background: url('../common/image/bannerPathway.png') no-repeat -2430px 0px;
}*/
.contain {
  position: absolute;
  top: 60%;
  left: 80%;
  transform: translate(-50%, -90%);
  width: 330px;
  min-height: 260px;
  padding: 15px 12px;
  border-radius: 8px;
  background: #f3f3f3;
  line-height: 40px;
  z-index: 10;
}
.login-title {

}
.item {
  display: flex;
  padding-right: 30px;
}
.label {
  flex: 0 0 100px;
}
.submit-botton {
  margin-top: 35px;
}
.mt10 {
  margin-top: 10px;
}

</style>
