<template>
  <div class="opopopopop">
  <div class="popMask" @click="closeMessagePay" v-if="mustOrder.length>0">
    <div class="popBox" @click.stop="stopPropagation">
      <div class="flextb bgBlack text-c fs16">
        <div class="header lh50 colWhite">必点商品</div>
        <scroll-view scroll-y="true"  class="body plr10 text-j fs14">
          <!-- 商品列表 -->
          <goodListSub :goods="mustGoods" v-on:addCart='addCart'></goodListSub>
        </scroll-view>
        <div class="footer text-c lh50">
          <div class="cancel red" @click="closeMustOrder">已完成</div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Vue from 'vue'
import util from '@/utils/index'
import goodListSub from '@/components/good/goodListSub.vue' 
export default {
  data () {
    return {
      companyAndRoom: {},
      mustGoods: [],
      isLoadingGoods: false // 是否在 加载数据
    }
  },
  components: {
    goodListSub
  },
  computed: {
    mustOrder () {
      // 必点商品 列表
      return this.$store.state.mustOrder
    },
    setPrimaryCard () {
      return this.$store.state.setPrimaryCard
    },
    companyAndRoom () {
      return this.$store.state.companyAndRoom
    },
    currentGood () {
      // 当前商品
      return this.$store.state.currentGood
    },
    cartList () {
      return this.$store.state.cartList
    },
    clouduserid () {
      return this.$store.state.clouduserid
    },
    newCartList () {
      let result = []
      for (let key in this.cartList) {
        for (let k in this.cartList[key]) {
          result.push(this.cartList[key][k])
        }        
      }
      return result
    },
    cartLength () {
      // 购物车 商品数量
      let length = 0
      for (let i=0; i<this.newCartList.length; i++) {
        length++
      }
      return length
    }
  },
  watch: {
    mustOrder () {
      console.log('this.doRequest---mustOrder')
      this.doRequest()
    },
    setPrimaryCard () {
      console.log('this.doRequest---setPrimaryCard')
      this.doRequest()
    },
    cartList () {
      this.checkCartList()
    },
    mustGoods () {
      this.checkCartList()
    }
  },
  methods: {
    doRequest () {
      console.log('==============+++++++++++++.')
      console.log(this.clouduserid, this.mustOrder, this.$store.state.setPrimaryCard)
      // 是否 开始 请求 必点商品
      let result = false
      // if (this.clouduserid != '') {

      if (this.clouduserid != '' && this.mustOrder.length>0 && this.$store.state.setPrimaryCard) {
        result = true
      }
      if (result) {console.log('请求必点商品')
        this.getGoodByIds()
      }
      return result
    },
    checkCartList () {
      let len = this.mustGoods.length
      console.log('商品 数量=====')
      console.log(len)
      if (len === 0 || this.cartLength === 0) {
        // 如果 购物车 数量 为 0 必点商品 数量 全部 置 0
        for (let i=0; i<len; i++) {
          this.mustGoods[i].OrderNumber = 0
        }
        return
      }
      for (let i=len-1; i>=0; i--) {
        let good = this.mustGoods[i]
        if (this.cartList[good.MaterialSortID] && this.cartList[good.MaterialSortID][good.MaterialID]) {
          console.log('购物车有该类 则 同步数量')
          // 购物车有该类 则 同步数量
          this.mustGoods[i].OrderNumber = this.cartList[good.MaterialSortID][good.MaterialID].OrderNumber
        } else { console.log('购物车 没有 该类 则 数量 为 0')
          // 购物车 没有 该类 则 数量 为 0
          this.mustGoods[i].OrderNumber = 0
        }
      }
    },
    getGoodByIds () {
      // 获取必点商品 列表
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/goods/getGoodsByIds', 
        data: {
          clouduserid: this.$store.state.clouduserid,
          requestInfo: {
            MaterialIDList: this.mustOrder, //[],//[423, 424, 93, 169, 194],//614, 
            priceType: this.$store.state.ecard.pricetypeid || 0
          }
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          console.log('查询 多件商品')
          console.log(res.data)
          if (res.data.code === '0'){
            // 如果有 必点商品 则 展示
            if (res.data.result.length > 0) {
              that.$store.commit('setShowMustOrder', true)
            }
            // 购物车 单件商品
            that.mustGoods = that.initGoods(res.data.result)
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
    // 根据购物车，初始化商品
    initGoods (dataResult) {
      let goods = dataResult
      // 没有商品 返回 []
      if (goods.length === 0) {
        return []
      }
      for (let i=0; i<goods.length; i++) {
        let good = goods[i]
        good.sort_request = good.SortRequest
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
            goods[i].sort_request[j].name = goods[i].sort_request[j].MaterialRequestName
            goods[i].sort_request[j].lit_name = goods[i].sort_request[j].MaterialRequestPy
            goods[i].sort_request[j].active = false
          }
        } else {
          // 购物车里没有 该商品
          goods[i].OrderNumber = 0
          // 设置口味
          for (let j=0; j<good.sort_request.length; j++) {
            goods[i].sort_request[j].name = goods[i].sort_request[j].MaterialRequestName
            goods[i].sort_request[j].lit_name = goods[i].sort_request[j].MaterialRequestPy
            goods[i].sort_request[j].active = false
          }
        }
      }
      return goods
    },
    comfirmAllAddCart () {
      // 确认 全部 加入 购物车
      console.log('确认 全部 加入 购物车')
    },
    openMustOrder () {
      // 打开 必点商品
      this.$store.commit('setShowMustOrder', true)
    },
    closeMustOrder () {
      // 关闭 必点商品
      this.$store.commit('setShowMustOrder', false)
      // 必点 商品 列表 置空
      this.$store.commit('setMustOrder', [])
    },
    stopPropagation () {
      // 什么都不做，阻止冒泡
    },
    addCart (e) {
      // 事件传递，购物车小球
      this.$emit('addCart', e)
    }
  },
  created () {
    console.log('component--------必点商品')
    console.log(this.showCombo)
  },
  mounted () {
    console.log('mounted--------必点商品')
    // this.openMustOrder()
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
div
  box-sizing border-box
  transition all 0.3s linear ease-in-out
.popMask
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 200
  background rgba(7,17,27,.6)
.popBox
  position absolute
  top 50%
  left 50%
  transform translate3d(-50%, -50%, 0)
  width 320px
  border-radius 6px
  overflow hidden
  background $black
.header
  border-bottom 1px solid rgba(0,0,0,0.3)
.footer
  border-top 1px solid rgba(0,0,0,0.3)
.cancel
  flex 0 0 50%
  border-right 1px solid rgba(0,0,0,0.3)
.body
  min-height 92px
  max-height 322px
  position relative
</style>
