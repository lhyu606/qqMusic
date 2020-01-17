<template>
  <div class="contain">
    <div class="plr10">
      <div class="fs16 welcome">
        <img src="../../../static/smile.png" class="smile"> Hi, 亲！
        <br>
        请验证会员卡的手机号
      </div>
      <div class="mobileShow">
        {{mobileShow}}
      </div>
    </div>
    <!--  -->
    <div class="plr10 lh50 bgWhite fs14">
      <!-- <div class="line flexlr">
        <div class="left">图形验证码</div>
        <div class="middle">
          <input type="text" v-model="picWord" placeholder="请输入验证码" class="recommend">
        </div>
        <div class="right">
          <img class="picWord" :src="picWordSrc" @click="chagePicWord">
        </div>
      </div> -->
      <!-- <div class="borderT1"></div> -->
      <div class="line flexlr">
        <div class="left">手机验证码</div>
        <div class="middle">
          <input type="text" v-model="volidCode" placeholder="请输入验证码" class="recommend">
        </div>
        <div class="right">
          <div class="getVolidCode" v-show="cutDown==0 || cutDown==60" @click="sendCode">发送验证码</div>
          <div class="getVolidCode" v-show="cutDown>0 && cutDown<60">{{cutDown}} 秒</div>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="nextStep" @click="checkCode">下一步</div>
  </div>
</template>
<script>
import util from '@/utils/index'
export default {
  data () {
    return {
      picWordSrc: this.$store.state.ip + '/yjmemberserver/verifyCode/create?random=',
      mobile: '',
      mobileShow: '',
      cutDown: 0,
      picWord: '',
      volidCode: '',
      timestemp: '',
      interval: null
    }
  },

  components: {
  },

  computed: {
    companyAndRoom () {
      return this.$store.state.companyAndRoom
    },
    clouduserid () {
      return this.$store.state.clouduserid
    },
    unbindList () {
      return this.$store.state.unbindList
    }
  },
  watch: {
    cutDown () {
      if (this.cutDown <= 0) {
        this.chagePicWord()
        this.picWord = ''
      }
    }
  },
  methods: {
    sendCode () {
      // 发送 手机验证码
      // if (this.picWord === '') {
      //   wx.showToast({
      //     title: '请输入图形验证码',
      //     icon: 'none',
      //     duration: 2000
      //   })
      //   return
      // }

      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/system/send/validation_code',
        data: {
          shopno: this.companyAndRoom.CompanyID,
          mobile: this.mobile
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          // todo
          if (res.data.ret != 0) {
            wx.showToast({
              title: '验证码发送成功',
              icon: 'none',
              duration: 2000
            })
            // 倒计时
            that.cutDown = 60
            that.interval = setInterval(() => {
              that.cutDown--
              if (that.cutDown == 0) {
                clearInterval(that.interval)
                that.interval = null
              }
            }, 1000)
          } else {
            wx.showToast({
              title: '验证码发送失败',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail (res) {
          wx.showToast({
            title: '验证码发送失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    checkCode () {
      // 验证码
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/system/check/validation_code',
        data: {
          validationcode: this.volidCode,
          mobile: this.mobile
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.ret == 0) {
            // 验证 成功
            that.toBindList()
          } else {
            wx.showToast({
              title: res.data.msg || '验证失败',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    },
    checkPicWord () {
      // 校验 图形码
      if (this.picWord === '') {
        wx.showToast({
          title: '请输入图形验证码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.volidCode === '') {
        wx.showToast({
          title: '请输入手机验证码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      // todo
      this.toBindList()
      // todo
      let that = this
      let data = {
        code: this.picWord
      }
      util.wXrequest({
        url: this.$store.state.ip + '/wechat_member/index.php/public/check_verify',
        data: util.emulateJSON(data),
        success(res) {
          if (res.data.ret == 0) {
            // 图形验证码 校验成功 注册 会员
            that.toBindList()
          } else {
            wx.showToast({
              title: '图形验证码校验失败',
              icon: 'none',
              duration: 2000
            })
            that.chagePicWord()
            that.picWord = ''
            that.volidCode = ''
          }
        }
      })
    },
    toBindList () {
      // 去 绑卡 列表
      console.log('去 绑卡 列表')
      wx.navigateTo({
        url: '/pages/bindList/main'
      })
    },
    chagePicWord () {
      // 更新 图形验证码
      this.picWordSrc = this.picWordSrc.substring(0, this.picWordSrc.indexOf('?random=')) + '?random=' + this.getTimestemp()
    },
    getTimestemp () {
      this.timestemp = new Date().getTime()
      return this.timestemp
    }
  },
  created () {
    console.log('page--------号码验证begin')
  },
  mounted () {
    console.log('mounted--------号码验证begin')
    console.log(this.unbindList)
    this.mobile = this.unbindList[0].mobile
    this.mobileShow = ''
    this.mobileShow += this.unbindList[0].mobile.substring(0, 3)
    this.mobileShow += '****'
    this.mobileShow += this.unbindList[0].mobile.substring(7)
    this.chagePicWord()
    if (this.interval) {
      clearInterval(this.interval)
      this.volidCode = ''
      this.cutDown = 60
    }
    this.volidCode = ''
    this.cutDown = 60
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
.contain
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  padding 10px 0
  min-height 100%
  background #ddd
.welcome
  color rgba(0,0,0,.5)
.smile
  width 40px
  height 40px
.mobileShow
  height 60px
  line-height 60px
  color #000
  font-size 18px
  text-align center
input
  height 50px
  line-height 50px
.left
  flex 0 0 75px
  margin-right 10px
  text-align-last justify
.right
  flex 0 0 100px
.picWord
  width 100px 
  height 40px
  vertical-align middle
  background #fff
.line
  background #fff
.borderT1
  border-top 1px solid rgba(0,0,0,0.1)
.getVolidCode
  background #ffa500
  color #fff
  width 100px
  height 40px
  border-radius 4px
  text-align center
  line-height 40px
  margin-top 5px
.nextStep
  height: 38px
  width: 95%
  background: $yellow
  margin: 30px auto
  text-align: center
  line-height: 38px
  color: #fff
  border-radius: 5px
  font-size 14px
</style>