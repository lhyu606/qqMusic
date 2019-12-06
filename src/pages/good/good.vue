<template>
  <div class="contain">
    <div class="a" v-if="goodPageRefresh">
      <!-- 头部 -->
      <goodHeader></goodHeader>
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
export default {
  data () {
    return {
      balls: []
    }
  },

  components: {
    goodHeader,
    goodList,
    shopCart,
    shopCartList
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
      console.log(9999)
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
    toLogin () {
      // 去登陆
      wx.reLaunch({
        url: '/pages/login/main'
      })
    }
  },
  created () {
    console.log('page--------商品列表begin')
  },
  mounted () {
    wx.clearStorage({
      success: function () {
        console.log('清空存储成功')
      }
    })
    console.log('mounted--------商品列表begin')
    /*  获取 小程序 进入参数 做登录、 注册、 绑定卡台 等操作
     *  具体 参数 有：
     *  @headShopNo (总店id)
     *  @headShopNo (总店id)
     *  @headShopNo (总店id)
     *  @headShopNo (总店id)
     *  @headShopNo (总店id)
     */ 
    let options = util.getCurrentPageOptions()
    let key = options.key

    if (this.clouduserid == '') {
      this.$store.commit('setGoodPageRefresh', false)
      // 如果 没有 账户 需要去 登录页
      console.log('去登录')
      this.toLogin()
    }  else {
      this.initBalls()
      if (this.$store.state.prevMenu != -1) {
        // 去 搜索商品页后 需要强刷
        this.$store.commit('setMenu', this.$store.state.prevMenu)
        this.$store.commit('setPrevMenu', -1)
      }
      this.$store.commit('setGoodPageRefresh', true)
      // 每次均 刷新 分店和卡台信息
      this.$store.commit('setRefreshCompanyAndRoom', true)
    }
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