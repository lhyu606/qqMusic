<template>
  <div class="register" v-if="clouduserid === ''">
    <div class="bodyBox bgWhite text-c fs16"> 
      <div class="content">
        <div class="plr10 ptb8">
          <div class="header lh40">提示</div>
          <div class="body colb2 fs14">您还未注册，请注册后使用</div>
        </div>
        <div class="lh50 footer">
          <button open-type="getPhoneNumber" class="getPhoneNumber" @getphonenumber="getphonenumber">立即注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '@/utils/index'
export default {
  data () {
    return {
      openid: ''
    }
  },

  components: {
  },
  computed: {
    clouduserid () {
      // 默认为 '' ，即为 未注册
      return this.$store.state.clouduserid
    }
  },
  methods: {
    wxLogin () {
      let that = this
      wx.login({
        success (res) {
          console.log('小程序登录')
          console.log(res)
          if (res.code) {
            // https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
            // code 换取 openid （实际后台使用 openid 建立主账户，返回 openid 和 clouduserid 和 主账号）
            // 如果没有 主账号，则需要获取 用户手机号，然后发送后台(手机号 + openid) 建立主账户，返回 clouduserid 和 主账号
            that.codeChangeClouduserid(res.code)
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    },
    // todo
    register () {
      var that = this
      util.wXrequest({
        url: this.$store.state.ip + '/wechat_ticket/register.php',
        data: {
          code: 'code'
        },
        success (res) {
          if (res.data.code === '0') {
            if (res.data.result.clouduserid) {
              that.openid = res.data.result.openid
              // 如果 已有账户
              that.$store.commit('setClouduserid', res.data.result.clouduserid)
              // 去 商品页
              // that.toGoodPage() 
            } else {
              that.openid = res.data.result.openid
            }
            
            console.log(res.data.result)
          }
        }
      })
    },
    codeChangeClouduserid (code) {
      var that = this
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/miniProgram/login',
        data: {
          code: code,
          headShopNo: this.$store.state.headShopNo
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success (res) {
          if (res.data.code === '0') {
            console.log('code == 0')
            if (res.data.result.clouduserid) {
              console.log('登录成功')
              // 如果 已有账户
              that.$store.commit('setClouduserid', res.data.result.clouduserid)
              that.$store.commit('setTel', res.data.result.tel)
              // 去 商品页
              that.toGoodPage()
            } else {
              console.log('没有账户')
              that.openid = res.data.result.openid
            }
            console.log(res.data.result)
          }
        }
      })
    },
    getphonenumber (e) {
      // 请求后台 解析手机号（实际是娱加云账号，即第一次获取注册时的手机号） 并直接注册
      var that = this;
      if (e.mp.detail && e.mp.detail.errMsg == "getPhoneNumber:ok") {
        util.wXrequest({
          url: this.$store.state.ip + '/onlinemarket_service/miniProgram/decryptPhoneAndRegist',
          data: {
            encryptDataB64: e.mp.detail.encryptedData,
            ivB64: e.mp.detail.iv,
            openid: this.openid,
            headShopNo: this.$store.state.headShopNo
          },
          header: {
            'Content-Type':'application/json; charset=utf-8'
          },
          success (res) {
            console.log(res);
            if (res.data.code === '0') {
              // 有账户
              that.$store.commit('setClouduserid', res.data.result.clouduserid)
              that.$store.commit('setTel', res.data.result.tel)
              // 去 商品页
              that.toGoodPage()
            }
          }
        })
      } else {
        console.log('获取手机号失败')
        // 获取手机号失败
        wx.showToast({
          title: '获取手机号失败',
          icon: 'none',
          duration: 2000
        })
      }
    },
    toGoodPage () {
      // 去商品列表页
      wx.hideToast()
      wx.reLaunch({
        url: '/pages/good/main'
      })
    }
  },
  created () {
    console.log('created-----login')
    // 账户流程：
    // 1、 /wechat/login code 换取 openid
    // 2、 openid 查询 主账号
    // 2.1 有 账户，直接去 商品列表
    // 2.2 没有 账户，获取 手机号 /wechat/decryptData (也直接注册)
    // 3、 注册 system/getCloudUserIDForMiniProgram 
    // 4、 注册完成， 去 商品列表
  },
  mounted () {
    console.log('mounted-----login')
    if (this.clouduserid != '') {
      // 如果 已有 账户 直接去 商品页
      this.toGoodPage()
    } else {
      // 否则 需要登录 注册
      this.wxLogin()
      wx.showToast({
        title: '登录中',
        icon: 'none',
        duration: 2000
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
.register
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 100
  background rgba(7,17,27,.6)
.bodyBox
  position absolute
  top 50%
  left 50%
  transform translate3d(-50%, -86%, 0)
  width 300px
  border-radius 6px
.content
  display flex
  flex-direction column
.footer
  // border-top 1px solid #f0f0f0
  color $success
.getPhoneNumber
  color $success
  background white
</style>
