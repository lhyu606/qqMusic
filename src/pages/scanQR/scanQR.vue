<template>
  <div class="contain">
    <div class="scan">
      <div class="img" v-for="(item, index) in imgs" :id="'img' + item" :key="index"></div>
      <div class="button" :class="{clickDown: isClickDown}" @click="callScan">
        <img src="https://yjevideocloud.oss-cn-shenzhen.aliyuncs.com/xcx/page_bind_btn.png" class="buttonImg"></img>
      </div>
    </div>
    </web-view>
  </div>
</template>
<script>
import util from '@/utils/index'

export default {
  data () {
    return {
      imgs: [1,2,3,4,5,6],
      isClickDown: false,
      animationTimer: null,
      scene: '',
      newHeadShopNo: 0,
      changeHeadShopNo: false
    }
  },

  components: {

  },

  methods: {
    doAnimation () {
      // 圈圈动画
      let timer = setTimeout(() => {
        clearTimeout(timer)
        timer = null
        this.imgs.push(this.imgs.shift())
      }, 0)
      
      this.animationTimer = setInterval(() => {
        this.imgs.push(this.imgs.shift())
      }, 2000)
      this.$store.commit('setScanQrTimer', this.animationTimer)
    },
    callScan () {
      if (this.isClickDown) {
        // 阻止短时间重复
        return
      }
      this.isClickDown = true
      let timer = setTimeout( () => {
        clearTimeout(timer)
        timer = null
        this.isClickDown = false
      }, 300)
      // 终止动画
      clearInterval(this.animationTimer)
      this.animationTimer = null
      // 换起微信 扫描
      let that = this
      wx.scanCode({
        success (res) {
          that.doAnimation()
          console.log(res)
          let result = ''
          let codeType = 1
          if (res.scanType === "WX_CODE") {
            console.log('WX_CODE')
            // 码类型 为 微信 码 【 此处 为 小程序 码】
            result = res.path
            result = result.split('?')[1] + ''
            result = result.split('=')[1] + ''
            codeType = 1
          } else if(res.scanType === "QR_CODE") {
            console.log('QR_CODE')
            // 码类型 为 普通二维码 
            result = res.result
            result = result.split('?')[1] + ''
            result = result.split('=')[1] + ''
            codeType = 0
          }
          that.qrCodeBindRoom(result, codeType)
        },
        fail (res) {
          that.doAnimation()
        }
      })
    },
    qrCodeBindRoom (os, codeType) {
      // 普通二维码 绑定卡台
      let newOs = decodeURIComponent(os)
      console.log(newOs)
      let that = this
      // userType 1 小程序 0 公众号
      // codeType 1 小程序 0 公众号
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/public/bindRoom',
        data: {
          clouduserid: this.$store.state.clouduserid,
          requestInfo: {
            decryptData: newOs,
            userType: 1,
            codeType: codeType
          }
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.code === '0'){
            // 绑定卡台成功 去商品列表
            // 切换 卡台后 主卡 需要 重新 获取 设置
            that.$store.commit('setSetPrimaryCard', false)
            // 当前使用会员卡 置空
            that.$store.commit('setEcard', {})
            // 商品类别 置为 0
            that.$store.commit('setMenu', 0)

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
            that.$store.commit('setGoodPageRefresh', false)

            that.$store.commit('setPrevScene', newOs)
            that.$store.commit('setPrevCodeType', codeType)

            // 获取 总店号
            let headShopNo = res.data.result.headShopNo
            // 如果 切换 总店号，重新 登录
            if (headShopNo != that.$store.state.headShopNo) {
              that.changeHeadShopNo = true
              // todo
              that.$store.commit('setHeadShopNo', headShopNo)
              wx.setStorageSync('headShopNo', headShopNo)
              that.$store.commit('setHeadShopNoChange', true)

              that.newHeadShopNo = headShopNo
              that.wxLogin()
            } else {
              // 否则 正常
              wx.reLaunch({
                url: '/pages/good/main'
              })
              console.log('正常了')
            }

            
          } else {
            // 绑定卡台失败
            wx.showToast({
              title: '绑定卡台失败',
              icon: 'cancel',
              duration: 2000
            })
          }
        },
        fail (res) {
          // 通讯失败，绑定卡台失败
          wx.showToast({
            title: '绑定卡台失败',
            icon: 'cancel',
            duration: 2000
          })
        }
      })
    },
    wxLogin () {
      wx.showLoading({
        title: '登录中',
        mask: true
      })
      let that = this
      wx.login({
        success (res) {
          console.log('小程序登录222')
          console.log(res)
          if (res.code) {
            // https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
            // code 换取 openid （实际后台使用 openid 建立主账户，返回 openid 和 clouduserid 和 主账号）
            // 如果没有 主账号，则需要获取 用户手机号，然后发送后台(手机号 + openid) 建立主账户，返回 clouduserid 和 主账号
            that.codeChangeClouduserid(res.code)
          } else {
            wx.hideLoading()
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    },
    codeChangeClouduserid (code) {
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/miniProgram/login',
        data: {
          code: code,
          headShopNo: this.newHeadShopNo
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        title: '登录中',
        success (res) {
          if (res.data.code === '0') {
            if (res.data.result.clouduserid) {

              console.log('登录成功222')
              // 如果 已有账户
              that.$store.commit('setClouduserid', res.data.result.clouduserid)
              that.$store.commit('setTel', res.data.result.tel)
              that.$store.commit('setOpenid', res.data.result.openid)
              if (that.changeHeadShopNo) {
                that.changeHeadShopNo = false
                // 切换 总店了，重新绑定 卡台
                that.qrCodeBindRoom (that.$store.state.prevScene, that.$store.state.prevCodeType)
              } else {
                // 去 商品 页
                wx.reLaunch({
                  url: '/pages/good/main'
                })
              }
              
            } else {
              console.log('没有业务账户')
              // 如果 已有 主账号【电话号码】则默默 注册，
              let virtualReg = /^\d{11}$/ 
              if (virtualReg.test(res.data.result.tel)) {
                console.log('默默注册')
                let phone = res.data.result.tel
                let openid = res.data.result.openid
                that.registerByPhone (phone, openid)
              } else {
                console.log('等待注册')
                // 否则 等待 获取手机后 注册
                wx.reLaunch({
                  url: '/pages/register/main'
                })
              }
            }
            console.log(res.data.result)
          }
        }
      })
    },
    registerByPhone (phone, openid) {
      // 已有 主账号，切换 总店后，没有 业务Id(clouduserid), 
      // phone, openid, tel 默默注册
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/miniProgram/getCloudUserIDForMiniProgram',
        data: {
          phone: phone,
          openid: openid,
          headShopNo: this.newHeadShopNo
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success (res) {
          if (res.data.code === '0') {
            that.$store.commit('setClouduserid', res.data.result.clouduserid)
            that.$store.commit('setTel', res.data.result.tel)
            that.$store.commit('setOpenid', res.data.result.openid)
            // 注册成功，重新 绑定卡台
            that.qrCodeBindRoom (that.$store.state.prevScene, that.$store.state.prevCodeType)
          }
        }
      })
    },
    getCompanyAndRoom () {
      // 查询 分店信息 和 绑定卡台
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/public/getCompanyAndRoom', 
        data: {
          clouduserid: this.$store.state.clouduserid,
          requestInfo: {}
        },
        header: {
          'content-type': 'application/json; charset=UTF-8'
        },
        success(res) {
          if (res.data.code === '0'){
            // 有卡台了，去 商品页
            wx.reLaunch({
              url: '/pages/good/main'
            })
          }
        },
        fail (res) {
          console.log(res)
        }
      })
    },
  },
  created () {
    console.log('page--------扫码')
  },
  mounted () {
    console.log('mounted--------扫码')
    // 如果 已经存在 定时器，则 清空
    if (this.$store.state.scanQrTimer) {
      clearInterval(this.animationTimer)
      this.animationTimer = null
    }
    this.doAnimation()

  },
  onShow () {
    // 立即 查询 是否 已有卡台
    this.getCompanyAndRoom()
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
  overflow hidden
  background url('https://yjevideocloud.oss-cn-shenzhen.aliyuncs.com/xcx/page_bind_bg.png') no-repeat
  background-size 100% 100%
.scan
  position absolute
  left 50%
  bottom 0
  width 142px
  height 147px
  transform translate3d(-50%, -180px, 0)
.buttonImg
  width 142px
  height 147px
.img
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  width 142px
  height 147px
  z-index 1
  background url('https://yjevideocloud.oss-cn-shenzhen.aliyuncs.com/xcx/area.png') no-repeat
  background-size 100% 100%
#img0
  transform scale(0.7)
  opacity 0.36
#img1
  transform scale(1.1)
  opacity 0.3
  transition all 2s linear
#img2
  transform scale(1.4)
  opacity 0.24
  transition all 2s linear
#img3
  transform scale(1.7)
  opacity 0.18
  transition all 2s linear
#img4
  transform scale(2.0)
  opacity 0.12
  transition all 2s linear
#img5
  transform scale(2.3)
  opacity 0
  transition all 2s linear
.button
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  z-index 10
  transition all 0.15s linear
.button.clickDown
  transform scale(0.9)
  
.outer
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  z-index 100
  background #ffffff
</style>