<template>
  <div class="contain">
    <div class="scan">
      <div class="img" v-for="(item, index) in imgs" :id="'img' + item" :key="index"></div>
      <div class="button" :class="{clickDown: isClickDown}" @click="callScan">
        <img src="http://yjtest.evideo.net.cn/wechat_order_service/Public/images/page_bind_btn.png" class="buttonImg"></img>
      </div>
    </div>
    <!-- <web-view class="outer" src="https://yjyf.evideo.net.cn/wechat_order_service/#/goods_list?menu=1&openid=o8TkNt2oYYCK9aR8Uh9CmBaan8ls&ecardid=&wechatPubID=gh_8f8b01d7b157&lowwinecharge=3888.00&headShopNo=1&clouduserid=67"> -->
    <!-- <web-view class="outer" src="https://yjyf.evideo.net.cn/wechat_member/#/addCard?clouduserid=59&shopNo=48&weChatId=gh_8f8b01d7b157&isonline=0&companyId=1&openid=o8TkNtwGXj78ANZY6cH3bDyPLvek"> -->
      
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
      animationTimer: null
    }
  },

  components: {

  },

  methods: {
    doAnimation () {
      // 圈圈动画
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
          let result = res.result
          result = result.split('?')[1]
          result = result.split('=')[1]
          that.bindRoom(result)
          // that.doAnimation()
          // that.$store.commit('setGoodPageRefresh', false)
        },
        fail (res) {
          that.doAnimation()
        }
      })
    },
    bindRoom (os) {
      // 绑定卡台
      let newOs = decodeURIComponent(os)
      let that = this
      // userType 1 小程序 0 公众号
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/public/bindRoom',
        data: {
          clouduserid: this.$store.state.clouduserid,
          requestInfo: {
            decryptData: newOs,
            userType: 1
          }
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.code === '0'){
            // 绑定卡台成功 去商品列表
            wx.reLaunch({
              url: '/pages/good/main'
            })
            that.$store.commit('setGoodPageRefresh', false)
          } else {
            // 解绑失败
            wx.showToast({
              title: '绑定卡台失败',
              icon: 'cancel',
              duration: 2000
            })
          }
        },
        fail (res) {
          // 通讯失败，解绑失败
          wx.showToast({
            title: '绑定卡台失败',
            icon: 'cancel',
            duration: 2000
          })
        }
      })
    }
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
  }
}
// http://yjtest.evideo.net.cn/wechat_order_service/Public/images/area.png
// http://yjtest.evideo.net.cn/wechat_order_service/Public/images/page_bind_btn.png
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
  background url('http://yjtest.evideo.net.cn/wechat_order_service/Public/images/page_bind_bg.png') no-repeat
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
  background url('http://yjtest.evideo.net.cn/wechat_order_service/Public/images/area.png') no-repeat
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