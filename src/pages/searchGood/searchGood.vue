<template>
  <div class="contain">
    <div class="wrapper">
      <!-- 搜索框 -->
      <div class="header">
        <div class="input">
          <input type="text" class="word" name="" v-model="word">
        </div>
        <div class="button" @click="clear">清空</div>
      </div>
      <!-- 商品列表 -->
      <scroll-view 
        class="content" 
        scroll-y="true" 
        scroll-with-animation="true"
        @scrolltolower="scrolltolower">
        <div class="goodList">
          <goodListSub :goods="goodsByWord"></goodListSub>
        </div>
      </scroll-view>
      <!-- 购物车 -->
      <div class="cart" v-if="goodPageRefresh">
        <!-- 购物车 -->
        <shopCart></shopCart>
        <!-- 购物车列表 -->
        <shopCartList></shopCartList>
      </div>
    </div>
    <!-- 口味 -->
    <combo></combo>
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
</template>
<script>
import util from '@/utils/index'
import shopCart from '@/components/good/shopCart.vue'
import shopCartList from '@/components/good/shopCartList.vue'
import goodListSub from '@/components/good/goodListSub.vue'
import combo from '@/components/good/combo.vue'
export default {
  data () {
    return {
      word: '',
      canSearch: true,
      goodsByWord: [],
      balls: []
    }
  },
  components: {
    shopCart,
    shopCartList,
    goodListSub,
    combo
  },
  computed: {
    cartList () {
      return this.$store.state.cartList
    },
    dropBalls () {
      return this.$store.state.dropBalls
    },
    goodPageRefresh () {
      return !this.$store.state.goodPageRefresh
    }
  },
  watch: {
    word () {
      if (this.word == '') {
        return
      }
      if (this.canSearch) {
          this.canSearch = false
          this.timer = setTimeout(() => {
              this.canSearch = true
              clearTimeout(this.timer)
              this.timer = null
              this.getgoodList()
          }, 400)
      }
    },
    dropBalls () {
      if (util.getCurrentPageUrl() == 'pages/searchGood/main') {
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
    getgoodList () {
      if (this.word == '') {
        return
      }
      let sourceWord = this.word
      let word = encodeURIComponent(this.word)
      let data = {
        wi: 1104,
        clouduserid: this.$store.state.clouduserid,
        requestInfo: {
          page: 1,
          pagesize: 100,
          keyword: word,
          priceTypeId: this.$store.state.ecard.pricetypeid || 0
        }
      }
      // 查询 商品结果模糊搜索
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/wechat_order_service/goods/selectByName', 
        data: util.emulateJSON(data),
        success(res) {
          if (res.data.code === 0){
            if (sourceWord != that.word) {
              // 不是当前关键词， 返回
              return false
            }
            wx.hideToast({})
            // 存储所有商品类别
            that.goodsByWord = that.initGoods(res.data.result)
            that.$store.commit('setGoods', that.goodsByWord)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
            console.log('返回码不是 0')
            // 去扫描绑定卡台
          }
        },
        fail (res) {
          console.log(res)
        }
      })
    },
    // 根据购物车，初始化商品
    initGoods (dataResult) {
      let goods = dataResult
      // 没有商品 返回 []
      if (goods.length === 0) {
        return []
      }
      for (let i=0; i<goods.length; i++) {
        let good = goods[i]
        if (!good.sort_request) {
          good.sort_request = []
        }
        if (!good.Picture) {
          good.Picture = []
        }
        if (this.cartList[good.MaterialSortID] && this.cartList[good.MaterialSortID][good.MaterialID]) {
          // 购物车里有 该商品
          goods[i].OrderNumber = this.cartList[good.MaterialSortID][good.MaterialID].OrderNumber
          // 设置口味
          for (let j=0; j<good.sort_request.length; j++) {
            let subSortRequest = {}
              goods[i].sort_request[j].active = false
          }
        } else {
          // 购物车里没有 该商品
          goods[i].OrderNumber = 0
          // 设置口味
          for (let j=0; j<good.sort_request.length; j++) {
            goods[i].sort_request[j].active = false
          }
        }
      }
      return goods
    },
    scrolltolower () {
      return false
      this.getgoodList()
    },
    clear () {
      // 清空 关键词
      this.word = ''
    }
  },
  created () {
    console.log('page------搜索商品')
  },
  mounted () {
    console.log('mounted------搜索商品')
    this.goodsByWord = []
    this.initBalls()
    // 预载 之前 搜索记录
    if (this.word != '') {
      this.getgoodList()  
    }
    // 保存 商品列表页 类型
    let prevMenu = this.$store.state.menu
    this.$store.commit('setMenu', -1)
    this.$store.commit('setPrevMenu', prevMenu)

    wx.hideLoading()
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
  background #201c19
  overflow hidden
.wrapper
  width 100%
  height 100%
  display flex
  flex-direction column
.header
  flex 0 0 50px
  width 100%
  height 50px
  padding 5px
  display flex
  justify-content space-between
.input
  flex 1 1 auto
  margin-right 12px
.word
  appearance: none
  background-color: #fff
  background-image: none
  border-radius: 4px
  border: 1px solid rgb(217, 191, 195)
  box-sizing: border-box
  color: rgb(61, 31, 36)
  font-size: 14px
  height: 36px
  line-height: 1
  outline: 0
  padding: 3px 10px
  transition: border-color .2s cubic-bezier(.645,.045,.355,1)
.button
  flex 0 0 70px
  background: #cea16a
  height: 36px
  line-height: 36px
  text-align: center
  font-size: 17px
  color: #fff
  border-radius: 5px
.content
  flex 1 1 auto
  overflow scroll
.goodList
  padding 0 12px
.text
  height 1500px
.cart
  flex 0 0 50px
  position relative
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