<template>
  <div class="shopCart">
    <div class="content">
      <!-- 小车 -->
      <div class="cart" :class="{hasGood: cart.length > 0, bounceIn: addBounceIn}" @click="checkListBox">
        <div class="cartNo" v-show="cart.length > 0">{{cartLength}}</div>
      </div>
      <!-- 总计 -->
      <div class="totle">
        <div class="text" v-show="cart.length > 0">总计：<span class="red">￥{{cartTotalMoney}}</span></div>
        <div class="text red" v-show="cart.length == 0">购物车是空的</div>
      </div>
      <div class="submit" :class="{hasGood: cart.length > 0}" @click="toPayList">选好了</div>
    </div>
  </div>
</template>
<script>
import util from '@/utils/index'
export default {
  data () {
    return {
      companyAndRoom: {},
      cartLengths: [],
      addBounceIn: false
    }
  },

  computed: {
    cart () {
      return this.$store.state.cartList
    },
    cartLength () {
      // 购物车 商品数量
      let length = 0
      for (let i=0; i<this.cart.length; i++) {
        if (this.cart[i]) {
          for (let j=0; j<this.cart[i].length; j++) {
            if (this.cart[i][j]) {
              length += this.cart[i][j].OrderNumber
            }
          }
        }
      }
      return length
    },
    cartTotalMoney () {
      // 计算总价
      return this.$store.state.cartTotalMoney
    }
  },
  watch: {
    cartLength () {
      // 购物车动弹 动画
      this.cartLengths.push(this.cartLength)
      this.cartLengths.shift()
      if (this.cartLengths[1] - this.cartLengths[0] > 0) {
        let timer0 = setTimeout(() => {
          clearTimeout(timer0)
          timer0 = null
          this.addBounceIn = true
          let timer1 = setTimeout(() => {
            clearTimeout(timer1)
            timer1 = null
            this.addBounceIn = false
          }, 750)
        }, 500)
        
      }
    }
  },
  methods: {
    checkListBox () {
      // 打开购物车列表
      // 如果购物车为空，return false
      if (this.cart.length === 0) {
        return false
      }
      this.$store.commit('setShowListBox', !this.$store.state.showListBox)
    },
    toPayList () {
      // 去购物车详情
      wx.navigateTo({
        url: '/pages/payList/main'
      })
    }
  },
  created () {
    console.log('shopCart')
  },
  mounted () {
    console.log('mounted--------shopCart')
    console.log(this.cart)
    // 初始 购物车数量变化
    this.cartLengths.push(this.cartLength)
    this.cartLengths.push(this.cartLength)
    console.log(this.cartLengths)
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
@import "../../stylus/common.css"
.shopCart
  position absolute
  left 0
  right 0
  bottom 0
  height 50px
  background #201c19
  border-top 1px solid #2c2723
  font-weight 400
.content
  padding-left 70px
  display flex
  justify-content space-between
.cart
  position absolute
  left 5px
  bottom 5px
  width 60px
  height 60px
  border-radius 50%
  background-color #352f2a
  background-image url('../../../static/shopCartGray.png')
  background-repeat no-repeat
  background-position center center
  background-size 40px 40px
.cart.hasGood
  background-color #e9c088
  background-image url('../../../static/shopCart.png')
  background-repeat no-repeat
  background-position center center
  background-size 40px 40px
.cartNo
  position absolute
  font-size 15px
  height 25px
  z-index 50px
  line-height 22px
  width 25px
  text-align center
  background #f01414
  color #fff
  border-radius 50%
  border 1px solid #fff
  top 0
  right -5px
.submit
  flex 0 0 100px
  text-align center
  line-height 50px
  color #524a43
  background #352f2a
.submit.hasGood
  color #ffffff
  background #cea16a
.totle
  flex 1 1 auto
  line-height 50px
  color #ffffff
  font-size 16px
.red
  color #ff5455
</style>