<template>
  <div class="contain">
    <div class="wraper"> 
      <!-- 头部 -->
      <goodHeader></goodHeader>
      <!-- 必点商品 -->
      <mustOrder></mustOrder>
      <!-- 商品列表 -->
      <goodList v-on:addCart='addCart'></goodList>
      <!-- 购物车 -->
      <shopCart></shopCart>
      <!-- 购物车列表 -->
      <shopCartList></shopCartList>
        <!-- 购物车小球 -->
        <div class="ballContainer">
          <div v-for="(ball, idx) in balls" 
            :key="idx" 
            class="ball" 
            :id="'ball' + idx"
            :style="{transform: ball.transform1}"
            v-show="ball.show">
            <div class="ballInner" :style="{transform: ball.transform2}"></div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import util from '@/utils/index'
import goodHeader from '@/components/good/goodHeader.vue'
import goodList from '@/components/good/goodList.vue'
import shopCart from '@/components/good/shopCart.vue'
import shopCartList from '@/components/good/shopCartList.vue'
import mustOrder from '@/components/good/mustOrder.vue'
export default {
  data () {
    return {
      balls: [],
      scene: '',
      firstIn: true
    }
  },

  components: {
    goodHeader,
    goodList,
    shopCart,
    shopCartList,
    mustOrder
  },

  computed: {
    dropBalls () {
      return this.$store.state.dropBalls
    },
    goodPageRefresh () {
      return this.$store.state.goodPageRefresh
    },
    clouduserid () {
      return this.$store.state.clouduserid
    },
    headShopNo () {
      return this.$store.state.headShopNo
    }
  },
  watch: {
    dropBalls () {
      if (util.getCurrentPageUrl() == 'pages/good/main') {
        if (this.dropBalls.length > 5) {
          this.dropBalls.shift()
        }
        this.addCart2()
      }
    }
  },
  methods: {
    initBalls () {
      // 初始化小球队列
      let ballNum = 10
      for (let i=0; i<ballNum; i++) {
        let obj = {
          show: false,
          transform1: '',
          transform2: ''
        }
        this.balls.push(obj)
      }
    },
    addCart2 () {
      // 购物车小球动画 利用贝塞尔曲线 做抛物线，只需要定好 初始位置 和 最终位置
      let dropBallId = this.dropBalls[this.dropBalls.length - 1].id
      let e = this.dropBalls[this.dropBalls.length - 1].e

      let duration = 550
      let id = 0
      // 标记 使用的 小球
      for (let i=0; i<this.balls.length; i++) {
        if (!this.balls[i].show) {
          id = i
          console.log(id)
          this.balls[id].show = true
          break
        }
      }
      // 初始位置
      this.balls[id].transform1 = 'translate3d(0px, -'+(this.$store.state.systemInfo.screenHeight - e.pageY - 90 - 20)+'px, 0)'
      this.balls[id].transform2 = 'translate3d('+(e.pageX-28 - 8)+'px, 0px, 0)'
      // 结束位置
      let timer1 = setTimeout(() => {
        clearTimeout(timer1)
        timer1 = null
        this.balls[id].transform1 = 'translate3d(0px, 0px, 0)'
        this.balls[id].transform2 = 'translate3d(0px, 0px, 0)'
      }, 0)
      // 动画结束 小球隐藏 去除标记 供下次使用
      let timer2 = setTimeout(() => {
        clearTimeout(timer2)
        timer2 = null
        this.balls[id].show = false
        // this.dropBalls.pop()
      }, duration)
    },
    addCart (e) {
      return false
      // 购物车小球动画 利用贝塞尔曲线 做抛物线，只需要定好 初始位置 和 最终位置
      let duration = 550
      let id = 0
      // 标记 使用的 小球
      for (let i=0; i<this.balls.length; i++) {
        if (!this.balls[i].show) {
          id = i
          this.balls[id].show = true
          break
        }
      }
      // 初始位置
      this.balls[id].transform1 = 'translate3d(0px, -'+(this.$store.state.systemInfo.screenHeight - e.pageY - 90 - 20)+'px, 0)'
      this.balls[id].transform2 = 'translate3d('+(e.pageX-28 - 8)+'px, 0px, 0)'
      // 结束位置
      let timer1 = setTimeout(() => {
        clearTimeout(timer1)
        timer1 = null
        this.balls[id].transform1 = 'translate3d(0px, 0px, 0)'
        this.balls[id].transform2 = 'translate3d(0px, 0px, 0)'
      }, 0)
      // 动画结束 小球隐藏 去除标记 供下次使用
      let timer2 = setTimeout(() => {
        clearTimeout(timer2)
        timer2 = null
        this.balls[id].show = false
      }, duration)
    },
    toShopList () {
      // 去 商家列表 选 商家， 获取 headShopNo
      wx.reLaunch({
        url: '/pages/shopList/main?scene=' + this.scene
      })
    },
    companyCodeChangeHeadShopNo () {
      // companyCode 换取 总店 号
      var that = this
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/public/getHeadShopNoByCompanyCode',
        data: {
          companyCode: this.scene.split(':')[2]
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success (res) {
          if (res.data.code === '0') {
            // todo
            let headShopNo = res.data.result.headShopNo
            that.$store.commit('setHeadShopNo', headShopNo)
            wx.setStorageSync('headShopNo', headShopNo)
            // 绑定卡台
            that.wxLogin()
          } else {
            // 换取 失败
            that.toShopList()
          }
        }
      })
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
            decryptData: this.scene,
            userType: 1,
            codeType: 1
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
              // 重新 设置 主卡
              that.$store.commit('setSetPrimaryCard', false)
              // 当前使用会员卡 置空
              that.$store.commit('setEcard', {})
              // 商品类别 置为 0
              that.$store.commit('setMenu', 0)
            } else {
              // 绑定卡台 失败
            }
            console.log(res.data.result)
          }
          // 绑定卡台 无论是否成功 都去 商品页
          that.$store.commit('setPrevScene', that.scene)
          that.$store.commit('setPrevCodeType', 1)
          that.scene = null
          wx.reLaunch({
            url: '/pages/good/main'
          })
          console.log('刷新备用    垃圾啊了多少街坊邻居阿达发')
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
          console.log('小程序登录')
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
          headShopNo: this.$store.state.headShopNo
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        title: '登录中',
        success (res) {
          if (res.data.code === '0') {
            console.log('code == 0')
            if (res.data.result.clouduserid) {
              console.log('登录成功')
              // 如果 已有账户
              that.$store.commit('setClouduserid', res.data.result.clouduserid)
              that.$store.commit('setTel', res.data.result.tel)
              that.$store.commit('setOpenid', res.data.result.openid)
              // 刷新 本页
              if (that.scene) {
                that.bindRoom()
              } else {
                wx.reLaunch({
                  url: '/pages/good/main'
                })
              }
            } else {
              console.log('没有业务账户')
              // 如果 已有 主账号【电话号码】则默默 注册，
              let VirtualReg = /^\d{11}$/ 
              if (VirtualReg.test(res.data.result.tel)) {
                console.log('默默注册')
                let phone = res.data.result.tel
                let openid = res.data.result.openid
                that.registerByPhone (phone, openid)
              } else {
                console.log('等待注册')
                if (that.scene) {
                  // 否则 等待 获取手机后 注册
                  that.openid = res.data.result.openid
                } else {
                  wx.reLaunch({
                    url: '/pages/scanQR/main'
                  })
                }
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
          headShopNo: this.$store.state.headShopNo
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
            that.bindRoom ()
          }
        }
      })
    }
  },
  created () {
    console.log('page--------商品列表begin')
  },
  mounted () {
    // wx.clearStorage({
    //   success: function () {
    //     console.log('清空存储成功')
    //   }
    // })
    console.log('mounted--------商品列表begin')
    /*  获取 小程序 进入参数 做登录、 注册、 绑定卡台 等操作
     *  具体 参数 有：
     *  @headShopNo (总店id)
     */ 
    // 小程序码（可绑定 卡台） 进入
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    // A9  1%3A326%3A11001034   1:326:11001034

    let that = this
    let options = util.getCurrentPageOptions()
    if (options.scene) {
      this.scene = decodeURIComponent(options.scene)
    }
    if (this.clouduserid == '') {
      // 0、无账户
      this.$store.commit('setGoodPageRefresh', false)
      // 登录
      if (this.scene) {
        // 1、如果 扫码 进入
        this.companyCodeChangeHeadShopNo()
      } else {
        // 2、非 扫码 进入
        wx.getStorage({
          key: 'headShopNo',
          success: function (res) {console.log('有 存 headShopNo')
            // 2.1、取本地 headShopNo 如果 有 存储直接 登录
            that.$store.commit('setHeadShopNo', res.data)
            that.wxLogin()
          },
          fail: function (res) {console.log('没 存 headShopNo')
            // 2.2、没有
            // 非扫码进入 去选商家
            
            that.toShopList()
            return false
          }
        })
      }
    }  else {
      if (this.scene) {
        this.companyCodeChangeHeadShopNo()
      } else {
        this.initBalls()
        if (this.$store.state.prevMenu != -1) {
          // 去 搜索商品页后 需要强刷
          this.$store.commit('setMenu', this.$store.state.prevMenu)
          this.$store.commit('setPrevMenu', -1)
        }
        
      }
    }
    this.$store.commit('setGoodPageRefresh', true)
  },
  onShow () {
    // 小程序 重新 扫码 后
    // 第一次 不做 处理，
    // 去 搜索商品页后 需要强刷
    this.$store.commit('setGoodPageRefresh', true)
    if (this.$store.state.prevMenu != -1) {
      this.$store.commit('setMenu', this.$store.state.prevMenu)
      this.$store.commit('setPrevMenu', -1)
      this.$store.commit('setGoods', [])
    } 
    if (!this.firstIn) {
      let options = util.getCurrentPageOptions()
      if (options.scene) {
        this.scene = decodeURIComponent(options.scene)
      }
      if (this.scene) {
        this.companyCodeChangeHeadShopNo()
      }
    }
    this.firstIn = false
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
// 购物车小球
.ballContainer
  position fixed
  bottom 50px
  left 40px
  z-index 1000
.ball
  position fixed
  left 28px
  bottom 50px
  // transition: all .5s cubic-bezier(0.66, -0.55, 0.9, 0.43)
  transition: all .5s cubic-bezier(0.045, -0.400, 0.455, -0.600)
  // cubic-bezier(0.045, -0.400, 0.455, -0.600)
.ballInner
  position fixed
  width 16px
  height 16px
  background $yellow
  border-radius 50%
  transition: all .5s linear


</style>