<template>
  <div class="register" v-if="clouduserid === ''">
    <div class="bodyBox bgWhite text-c fs16"> 
      <div class="content">
        <div class="plr10 ptb8" @click="register">
          <div class="header lh40">提示</div>
          <div class="body colb2 fs14">您还未注册，请注册后使用</div>
        </div>
        <div class="lh50 footer">
          <button open-type="getPhoneNumber" class="getPhoneNumber" @click="getPhoneNumber">立即注册</button>
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
        url: 'http://192.168.73.147/private/mock/register.php',
        data: {
          code: 'code'
        },
        success (res) {
          if (res.data.code === '0') {
            if (res.data.result.clouduserid) {
              // 如果 已有账户
              that.$store.commit('setClouduserid', res.data.result.clouduserid)
              // 刷新 商品页
              that.$store.commit('setGoodPageRefresh', true) 
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
        url: 'http://192.168.73.147/private/mock/getClouduserid.php',
        data: {
          code: 'code'
        },
        success (res) {
          if (res.data.code === '0') {
            if (res.data.result.clouduserid) {
              console.log('登录成功')
              // 如果 已有账户
              that.$store.commit('setClouduserid', res.data.result.clouduserid)
              // 刷新 商品页
              that.$store.commit('setGoodPageRefresh', true) 
            } else {
              that.openid = res.data.result.openid
            }
            
            console.log(res.data.result)
          }
        }
      })
      // util.wXrequest({
      //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid='+that.$store.state.appId+'&secret='+that.$store.state.appSecret+'&js_code='+code+'&grant_type=authorization_code', 
      //   method: 'get',
      //   success(res) {
      //     console.log('res.data---------------------')
      //     console.log(res.data.openid)
      //   }
      // })
    },
    getPhoneNumber (e) {
      // todo
      // this.$store.commit('setClouduserid', '1')
      return false
      // 请求后台 解析手机号
      var that = this;
      console.log('e.detail.errMsg == "getPhoneNumber:ok"');
      console.log(e.detail);
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        util.wXrequest({
          url: 'http://localhost/index/users/decodePhone',
          data: {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            sessionKey: that.data.session_key,
            uid: "",
          },
          method: "post",
          success: function (res) {
            console.log(res);
            // 保存 业务id ，关闭注册框
          }
        })
      } else {
        console.log('asdffjlj')
        // 获取手机号失败
        wx.showToast({
          title: '获取手机号失败',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  created () {
    console.log('created-----register')
  },
  mounted () {
    console.log('mounted-----register')
    console.log(this.clouduserid === '')
    this.wxLogin()
    this.$store.commit('setGoodPageRefresh', false)
    // this.$store.commit('setClouduserid', '1')
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
