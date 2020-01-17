<template>
  <div>
    <div class="contain fs14" id="contain" v-if="showCombo" @click="closeCombo">
      <div class="comboBox bgBlack" @click.stop="stopPropagation">
        <div class="header">
          <div class="title lh40 fs16 text-c colYellow">{{currentGood.MaterialName}}</div>
          <div class="closeButton" @click="closeCombo"></div>
        </div>
        <scroll-view scroll-y="true" class="body plr10">
          <div class="comboItems"
            v-for="(item, index) in currentGood.sort_request" 
            :key="index"
            @click="chooseCombo(index)">
            <div class="comboItem bgBrown colYellow fs14 lh20" :class="{active: item.active}">
              {{item.name}}
            </div>
            <div class="gap"></div>
          </div>
        </scroll-view>
        <div class="footer bgBrown colYellow flexlr">
          <div class="totle lh35 pl10">单价：<span class="red">￥{{currentGood.SellPrice}}</span></div>
          <div class="button plr10">
            <div class="bgYellow lh35 colWhite comfirm" @click='comfirmCombo'>确定</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import util from '@/utils/index'
export default {
  data () {
    return {
      companyAndRoom: {},
      roomSetting: {}
    }
  },
  computed: {
    showCombo () {
      return this.$store.state.showCombo
    },
    currentGood () {
      // 当前商品
      return this.$store.state.currentGood
    },
    cartList () {
      return this.$store.state.cartList
    }
  },
  components: {
    
  },

  methods: {
    closeCombo () {
      // 关闭口味框
      this.$store.commit('setShowCombo', false)
    },
    chooseCombo (index) {
      this.currentGood.sort_request[index].active = !this.currentGood.sort_request[index].active
      return false
      // 更新到购物车
      // 购物车没有 该商品
      // if (!this.cartList[this.currentGood.MaterialSortID]) {
      //   Vue.set(this.cartList,this.currentGood.MaterialSortID, [])
      // }
      // if (this.cartList[this.currentGood.MaterialSortID][this.currentGood.MaterialID]) {
      //   // 有商品
      //   let cartSortRequest = this.cartList[this.currentGood.MaterialSortID][this.currentGood.MaterialID].sort_request
      //   for (let i=0; i<cartSortRequest.length; i++) {
      //     // 找到同口味
      //     if (cartSortRequest[i].lit_name === this.currentGood.sort_request[index].lit_name) {
      //       cartSortRequest[i].active = this.currentGood.sort_request[index].active
      //     }
      //   }
      // } else {
      //   // 无商品
      //   Vue.set(this.cartList[this.currentGood.MaterialSortID],this.currentGood.MaterialID, this.currentGood)
      // }
      // this.$store.commit('setCartList', this.cartList)
    },
    comfirmCombo () {
      console.log(this.currentGood)
      // 购物车 有该商品，则更新购物车（/cart/updateCart），否则，添加购物车（/cart/addCart）
      this.closeCombo()
      // 如果是套餐 就 先选子商品 否则 正常 添加购物车 或 更改 口味
      if (this.currentGood.OrderNumber == 0 && (this.currentGood.MealType == '2' || this.currentGood.MealType == '3')) {
        wx.navigateTo({
          url: '/pages/package/main'
        })
      } else {
        util.comfirmCombo()
      }
    },
    stopPropagation () {
      // 什么都不做，阻止冒泡
    }
  },
  created () {
    console.log('component--------口味')
    console.log(this.showCombo)
  },
  mounted () {
    console.log('component--------口味')
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
div
  box-sizing border-box
.contain
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 10000
  background rgba(7,17,27,.6)
.comboBox
  position absolute
  top 20%
  left 50%
  transform translate(-50%, -0%)
  width 320px
  border 1px solid #cea16a
  border-radius 6px
.header
  position relative
.closeButton
  position absolute
  top 0px
  right 0px
  width 41px
  height 41px
  padding 10px
  background url('../../../static/close.png') no-repeat center center
  background-size 21px 21px
.body
  box-sizing border-box
  text-align justify
  max-height 250px
  padding-bottom 12px
  overflow scroll
.comboItems
  display inline-block
.comboItem
  display inline-block
  border 1px solid #cea16a
  border-radius 10px
  width 89px
  padding 0 8px
  margin-top 8px
  text-align center
  vertical-align top
.comboItem.active
  background $yellow
  color white
.footer
  padding 5px 0
  margin-top 12px
.totle
  flex 0 0 50%
  padding-left 10px
  text-align left
.button
  flex 0 0 50%
.comfirm
  border-radius 41px
  text-align center
.gap
  display inline-block
  width 10px
</style>
