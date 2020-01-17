<template>
  <div class="register">
    <div class="bodyBox bgWhite text-c fs16"> 
      <div class="content" v-if="showRegister">
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
      openid: '',
      showRegister: false
    }
  },

  components: {
  },
  computed: {
    clouduserid () {
      // 默认为 '' ，即为 未注册
      return this.$store.state.clouduserid
    },
    prevScene () {
      return this.$store.state.prevScene
    },
    prevCodeType () {
      return this.$store.state.prevCodeType
    }
  },
  methods: {
    getphonenumber (e) {
      this.showRegister = false
      // 请求后台 解析手机号（实际是娱加云账号，即第一次获取注册时的手机号） 并直接注册
      var that = this;
      if (e.mp.detail && e.mp.detail.errMsg == "getPhoneNumber:ok") {
        util.wXrequest({
          url: this.$store.state.ip + '/onlinemarket_service/miniProgram/decryptPhoneAndRegist',
          data: {
            encryptDataB64: e.mp.detail.encryptedData,
            ivB64: e.mp.detail.iv,
            openid: this.$store.state.openid,
            headShopNo: this.$store.state.headShopNo
          },
          header: {
            'Content-Type':'application/json; charset=utf-8'
          },
          title: '注册中',
          success (res) {
            console.log(res);
            if (res.data.code === '0') {
              // 有账户
              if (res.data.result.clouduserid) {
                that.$store.commit('setClouduserid', res.data.result.clouduserid)
                that.$store.commit('setTel', res.data.result.tel)
                // 去 商品页
                that.toGoodPage()
              } else {
                // 注册失败 联系管理员
                wx.showToast({
                  title: '注册失败，请联系管理员',
                  icon: 'none',
                  duration: 2000
                })
              }
            } else {
              // 注册失败 联系管理员
              wx.showToast({
                title: '注册失败，请联系管理员',
                icon: 'none',
                duration: 2000
              })
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
    bindRoom () {
      // 绑定卡台
      // 普通二维码 绑定卡台
      let that = this
      // userType 1 小程序 0 公众号
      // codeType 1 小程序 0 公众号 【二维码 类型】
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/public/bindRoom',
        data: {
          clouduserid: this.$store.state.clouduserid,
          requestInfo: {
            decryptData: this.prevScene,
            userType: 1,
            codeType: this.prevCodeType
          }
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.code === '0'){
            if (res.data.result.clouduserid) {
              // 绑定卡台 成功
              // 存储 最低消费金额
              let lowwinecharge = res.data.result.lowwinecharge || 0
              wx.setStorageSync('lowwinecharge', lowwinecharge)
              // 必点商品 
              let roomfirstwineidliststr = res.data.result.roomfirstwineidliststr
              if (roomfirstwineidliststr && roomfirstwineidliststr != '') {
                let mustOrder = []
                roomfirstwineidliststr = roomfirstwineidliststr.split('|')
                roomfirstwineidliststr.forEach(item => {
                  mustOrder.push(parseInt(item))
                })
                that.$store.commit('setMustOrder', mustOrder)
              }
            } else {
              // 绑定卡台 失败
            }
            console.log(res.data.result)
          }
          // 绑定卡台 无论是否成功 都去 商品页
          wx.reLaunch({
            url: '/pages/good/main'
          })
        }
      })
    },
    toGoodPage () {
      // todo 放在 绑定 卡台 后 如果有 必点商品
      // 打开 必点商品
      // this.$store.commit('setShowMustOrder', true)
      
      // 去商品列表页
      console.log('this.prevScene')
      console.log(this.prevScene)
      if (this.prevScene && this.prevScene != '') {
        // 重新 绑定卡台
        this.bindRoom()
      } else {
        // 直接 去 商品页
        wx.hideToast()
        wx.reLaunch({
          url: '/pages/good/main'
        })
      }
    },
    toShopList () {
      // 去 商家列表 选 商家， 获取 headShopNo
      wx.reLaunch({
        url: '/pages/shopList/main'
      })
    }
  },
  created () {
    console.log('created-----register')
    // 账户流程：
    // 1、 /miniProgram/login code 换取 openid
    // 2、 openid 查询 主账号
    // 2.1 有 账户，直接去 商品列表
    // 2.2 没有 账户，获取 手机号 
    // 3、 注册 /miniProgram/decryptPhoneAndRegist (也直接注册)
    // 4、 注册完成， 去 商品列表
  },
  mounted () {
    console.log('mounted-----register')
    this.showRegister = true
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
  z-index 100000
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
