<template>
  <div class="cartList" @click="closeListBox" v-show='showListBox'>
    <div class="listBox" @click.stop="stop" v-show='showListBox' :class="{active: showListBox}" :animation="listAnimation">
      <div class="listTitle">
        <div class="conut">小计：<span class="red">￥{{cartTotalMoney}}</span></div>
        <div class="clear" @click="clearCart">清空</div>
      </div>
      <scroll-view scroll-y="true" class="listWrapper">
        <div class="listContent">
          <div class="a" v-for="(item, index) in cartList" :key="index" v-if="item" >
            <div class="item" v-for="(good, idx) in item" :key="idx" v-if="good" @click="showCombo(good)">
              <div class="left">
                <span class="lh24">{{good.MaterialName}}</span>
                <div class="sub" v-if="good.WinePresentSetName && good.WinePresentSetName !== ''">/{{good.WinePresentSetName}}</div>
                <div class="sub" v-if="good.MaterialRequestName && good.MaterialRequestName !== ''">/{{good.MaterialRequestName}}</div>
              </div>
              <div class="right" @click.stop="stop">
                <span class="red lh24">￥{{good.totalPrice}}</span>
                <div class="cartButton">
                  <div class="decrease" @click="goodDecrease(good)"></div>
                  <div class="goodNo">{{good.OrderNumber}}</div>
                  <div class="add" @click="goodAdd(good)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import util from '@/utils/index'
export default {
  data () {
    return {
      listAnimation: {},
      isUp: true,
      canClick: true,
      currentCartGood: {}
    }
  },

  computed: {
    cartList () {
      return this.$store.state.cartList || []
    },
    showListBox () {
      return this.$store.state.showListBox
    },
    cartTotalMoney () {
      return this.$store.state.cartTotalMoney
    },
    isClearCart () {
      return this.$store.state.clearCart
    }
  },
  watch: {
    showListBox () {
      if (this.showListBox) {
        this.doAnimation()
      }
    },
    isClearCart () {
      // 清空时 关闭 购物车列表
      if (this.isClearCart) {
        console.log('购物车清空 啦啦啦')
        this.$store.commit('setClearCart', false)
        if (!this.isUp) {
          // 防止 下单 清空时操作 
          this.closeListBox()
        }
      }
    }
  },

  methods: {
    stop (e) {
      console.log('阻止冒泡')
    },
    closeListBox () {
      // 关闭 购物车列表
      this.doAnimation()
      let timer = setTimeout(() => {
        clearTimeout(timer)
        timer = null
        this.$store.commit('setShowListBox', false)
      }, 300)
    },
    doAnimation () {
      // 小程序动画 开始
      const animationDuration = 300;
      const animation = wx.createAnimation({
        duration: animationDuration
      });
      this.$nextTick(() => { 
        if (this.isUp){
          this.isUp = false
          animation.translate3d(0, 0, 0).step();
          this.listAnimation = animation.export();
        } else {
          this.isUp = true
          animation.translate3d(0, 450, 0).step();
          this.listAnimation = animation.export();
        }
      })
    },
    showCombo (good) {
      // 展示口味选择
      this.currentCartGood = good
      this.getGoodById()
    },
    initCurrentCartGood (obj) {
      // 解析 购物车 口味字符串 到 SortRequest 数组
      let materialRequestName = this.currentCartGood.MaterialRequestName
      let sortArr = materialRequestName.split(',')
      let sortRequest = []
      for (let i=0; i<obj.SortRequest.length; i++) {
        if (sortArr.indexOf(obj.SortRequest[i].MaterialRequestName) >= 0) {
          // 已有口味
          sortRequest.push({
            name: obj.SortRequest[i].MaterialRequestName,
            lit_name: obj.SortRequest[i].MaterialRequestPy,
            active: true
          })
        } else {
          sortRequest.push({
            name: obj.SortRequest[i].MaterialRequestName,
            lit_name: obj.SortRequest[i].MaterialRequestPy,
            active: false
          })
        }
      }
      obj.sort_request = sortRequest
      obj.OnlineTempOrderID = this.currentCartGood.OnlineTempOrderID
      this.$store.commit('setCurrentGood', obj)
      this.$store.commit('setShowCombo', true)
    },
    getGoodById () {
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/goods/getGoodsById', 
        data: {
          clouduserid: this.$store.state.clouduserid,
          requestInfo: {
            MaterialID: this.currentCartGood.MaterialID,
            priceType: this.$store.state.ecard.pricetypeid || 0
          }
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          console.log('查询 购物车 单件商品')
          console.log(res.data)
          if (res.data.code === '0'){
            // 购物车 单件商品
            if (!res.data.result[0].SortRequest) {
              wx.showToast({
                title: '该商品没有口味',
                icon: 'none',
                duration: 2000
              })
              return false
            }
            that.initCurrentCartGood(res.data.result[0])
            console.log('that.package')
            console.log(res.data)
          } else {
            wx.showToast({
              title: res.data.msg || '',
              icon: 'none',
              duration: 2000
            })
            console.log('返回码不是 0')
          }
        }
      })
    },
    getCatalog () {
      // 更新购物车
      util.getCatalog()
    },
    goodAdd (good) {
      // 不允许 短时间内重复 点击
      if (this.canClick) {
        this.canClick = false
        let timer = setTimeout(() => {
          clearTimeout(timer)
          timer = null
          this.canClick = true
        }, 300)
      } else {
        return false
      }
      this.$store.commit('setCurrentGood', good)
      // 购物车 数量 加 1
      // @param type 0: 数量减 1，1: 数量加 1，2: 口味变更
      util.updateCart(1)
    },
    goodDecrease (good) {
      // 不允许 短时间内重复 点击
      if (this.canClick) {
        this.canClick = false
        let timer = setTimeout(() => {
          this.canClick = true
        }, 300)
      } else {
        return false
      }
      this.$store.commit('setCurrentGood', good)
      // 如果数量 为 1，直接删除， 数量大于 1，数量减 1
      if (this.cartList[good.MaterialSortID][good.MaterialID].OrderNumber == 1) {
        util.delMymaterial()
      } else if (this.cartList[good.MaterialSortID][good.MaterialID].OrderNumber > 1) {
        // @param type 0: 数量减 1，1: 数量加 1，2: 口味变更
        util.updateCart(0)
      }
    },
    clearCart () {
      // 清空购物车
      wx.showModal({
        title: '提示',
        content: '确认清空购物车吗？',
        success (res) {
          if (res.confirm) {
            console.log('用户确认清空购物车')
            util.clearCart()
          } else if (res.cancel) {
            console.log('用户取消确认清空购物车')
          }
        }
      })      
    }
  },
  created () {
    console.log('shopCartList')
  },
  mounted () {
    console.log('mounted------shopCartList')
    if (this.$store.state.clouduserid) {
      this.getCatalog()
    }
    this.isUp = true
    this.listAnimation = {}
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
.cartList
  position fixed
  z-index 1000
  top 0
  left 0
  right 0
  bottom 0
  font-size 14px
  background rgba(7,17,27,.6)
.listBox
  position absolute
  left 0
  right 0
  bottom 0
  height 375px
  border-top 1px solid #cea16a
  transform translate3d(0, 375px, 0)
  transition all 0.3s linear
.listTitle
  display flex
  justify-content space-between
  height 40px
  line-height 40px
  padding 0 18px
  color #cea16a
  background #201c19
  border-top 1px solid #cea16a
.listWrapper
  height 334px
  overflow hidden
  background #423c31
  width auto
  // transform translate(0, -100%)
  transition all 0.3s linear
.listWrapper.show
  // transform translate(0, 0)
.listContent
  padding 0 18px
  
.item
  position relative
  display flex
  justify-content space-between
  padding 5px 0
  border-bottom 1px solid #cea16a
.left
  color #ede2d9
.sub
  font-size 12px
  color $yellow
.right
  display flex
.cartButton
  display flex
  justify-content space-between
  padding-left 6px
  color #93999f
.decrease
  flex 1 1 24px
  width 24px
  height 24px
  background url('../../../static/remove.png') no-repeat
  background-size 24px 24px
.add
  flex 1 1 24px
  width 24px
  height 24px
  background url('../../../static/add.png') no-repeat
  background-size 24px 24px
.goodNo
  line-height 24px
  padding 0 4px
.red
  color #ff6a6b
</style>
