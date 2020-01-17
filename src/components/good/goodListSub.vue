<template>
  <div>
            <!-- 商品列表 -->
            <div class="hasGood" v-show="goods.length > 0">
              <div class="goodItem" v-for="(item, index) in goods" wx:key="MaterialID" @click="toGoodDetail(item)">
                <div class="goodImg" v-if="item.Picture.length > 0">
                  <img :src="item.Picture[0].PictureUrl">
                </div>
                <div class="goodImg" v-show="item.Picture.length == 0">
                  <img src="../../../static/foodDefaultS.png">
                </div>
                <div class="goodDes">
                  <div class="goodLine">{{item.MaterialName}}</div>
                  <div class="goodLine red">￥{{item.SellPrice}}</div>
                  <div class="goodLine">
                    <div class="combo" @click.stop="showCombo(item)" v-if="item.sort_request && item.sort_request.length > 0">口味</div>
                  </div>
                  <!-- 加购物车按钮 -->
                  <div class="shopcart" @click.stop="shopcartContain">
                    <div class="cartButton">
                      <div class="decrease" @click="goodDecrease(item)" :class="{hidden: item.OrderNumber < 1}"></div>
                      <div class="goodNo"  :class="{hidden: item.OrderNumber < 1}">{{item.OrderNumber}}</div>
                      <div class="add" @click="goodAdd(item)" @tap="getPosition"></div>
                    </div>
                  </div>
                </div>
              </div>
             <!--  <div class="pt20"></div>
              <div class="pt20"></div> -->
            </div>
            <div class="noGood" v-show="goods.length === 0">
              <div class="nothing">
                <img src="../../../static/nothingPic.png" class="nothingImg">
              </div>
              <div class="nothingText">暂时没有商品</div>
            </div>
  </div>
</template>

<script>
import Vue from 'vue'
import util from '@/utils/index'
export default {
  props: {
    goods: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      goodsType: [],
      isTop: false,
      canClick: true
    }
  },
  computed: {
    goodsType () {
      return this.$store.state.goodsType
    },
    // goods () {
    //   return this.$store.state.goods
    // },
    menu () {
      return this.$store.state.menu
    },
    ecard () {
      return this.$store.state.ecard
    },
    cartList () {
      return this.$store.state.cartList
    },
    dropBalls () {
      return this.$store.state.dropBalls
    }
  },
  components: {
    
  },
  methods: {
    shopcartContain () {
      // console.log('stop propagation....')
    },
    getPosition (e) {
      // 触发购物车小球
      if (!this.canClick) {
        return false
      }
      this.$emit('addCart', e)
      let ball = {}
      ball.id = this.$store.state.dropBallId
      ball.e = e
      this.dropBalls.push(ball)
      this.$store.commit('setDropBalls', this.dropBalls)
      this.$store.commit('setDropBallId', this.$store.state.dropBallId + 1)
    },
    goodAdd (item) {
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
      // 购物车商品 加 1
      this.$store.commit('setCurrentGood', item)
      // 如果数量 为 0，添加购物车， 数量大于 0，数量加 1
      if (!this.cartList[item.MaterialSortID] || !this.cartList[item.MaterialSortID][item.MaterialID]) {
        // 如果是套餐，去套餐详情页   MealType String 类型
        // 0 普通商品  1 开房配送  2 固定套餐  3 可选套餐 
        if (parseInt(item.MealType) > 0)  {
          this.toGoodDetail(item)
        } else {
        // 否则 添加购物车
          util.addCart({})
        }
      } else if (this.cartList[item.MaterialSortID][item.MaterialID].OrderNumber > 0) {
        // @param type 0: 数量减 1，1: 数量加 1，2: 口味变更
        if (item.MealType == '3') {
          // 可选套餐 去详情
          this.toGoodDetail(item)
        } else {
          util.updateCart(1)
        }
      }
    },
    goodDecrease (item) {
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
      // 购物车商品 减 1
      this.$store.commit('setCurrentGood', item)
      // 如果数量 为 1，直接删除， 数量大于 1，数量减 1
      if (this.cartList[item.MaterialSortID][item.MaterialID].OrderNumber == 1) {
        util.delMymaterial()
      } else if (this.cartList[item.MaterialSortID][item.MaterialID].OrderNumber > 1) {
        // @param type 0: 数量减 1，1: 数量加 1，2: 口味变更
        util.updateCart(0)
      }
    },
    getPackage (item) {
      // 查询 套餐详情
      let that = this
      let data = {
        wi: 1103,
        clouduserid: this.$store.state.clouduserid,
        requestInfo: {
          MaterialID: item.MaterialID,
          KmID: this.$store.state.ecard.ecardid || ''
        }
      }
      util.wXrequest({
        url: this.$store.state.ip + '/wechat_order_service/goods/getPackages', 
        data: util.emulateJSON(data),
        success(res) {
          if (res.data.code === 0){
            // 存储所有商品类别
            console.log('res.data')
            let goodPackage = res.data.result || []
            let len = goodPackage.length
            console.log(goodPackage, len)
            if (len) {
              for (let i=0; i<len; i++) {
                console.log(parseInt(item.OrderNumber), parseInt(goodPackage[i].OrderNumber))
                // 当前 商品数量 达到 最低点单数量 去套餐页
                if (parseInt(item.OrderNumber) + 1 >= parseInt(goodPackage[i].OrderNumber)) {
                  wx.navigateTo({
                    url: '/pages/package/main'
                  })
                  return false
                }
              }
              // 当前 商品数量 未到达 最低点单数量 直接当成 普通商品 数量加 1
              util.addCart({
                addSubGood: false
              })
            }
          } else {
            wx.showToast({
              title: res.data.msg || '',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    },
    toGoodDetail (item) {
      // 去商品详情
      this.$store.commit('setCurrentGood', item)
      // 0 普通商品
      // 1 开房配送
      // 2 固定套餐
      // 3 可选套餐

      if (item.MealType == '2') {
        // 2 固定套餐
        console.log(item)
        if (!this.cartList[item.MaterialSortID] || !this.cartList[item.MaterialSortID][item.MaterialID]) {
          wx.navigateTo({
            url: '/pages/package/main'
          })
        }
      } else if (item.MealType == '3') {
        // 3 可选套餐 
        // 【最低 点单数量 k 】
        // 点单一份当做普通商品直接加入购物车，当点单第k件商品时才弹出套餐方案
        this.getPackage(item)
      } else {
        // 单品
        return false
        wx.navigateTo({
          url: '/pages/singleGood/main'
        })
      }
      
    },
    showCombo (item) {
      console.log(item.sort_request)
      if (!item.sort_request || item.sort_request.length === 0) {
        // 没有口味
        wx.showToast({
          title: '该商品没有口味',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      this.$store.commit('setCurrentGood', item)
      this.$store.commit('setShowCombo', true)
    }
  },
  mounted () {
    console.log('mounted--------goodListSub1')
    console.log(this.goods)
  }
}
  
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
// 商品列表
.goodItem
  position relative
  padding 10px 0
  border-bottom 1px solid #2c2723
  display flex
  justify-content space-between
.goodImg
  width 70px
  height 70px
.goodImg img
  width 70px
  height 70px
.goodDes
  flex 1 1 196px
  padding 0 4px
  display flex
  justify-content space-between
  align-item center
  flex-direction column
  font-size 15px
  box-sizing border-box
.goodLine
  flex 1 1 33.3%
  width 196px
  text-align left
  color #ede2d9
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
.combo
  height 20px
  line-height 20px
  width 50px
  text-align center
  font-weight 400
  color #cea16a
  background #423c31
  font-size 10px
  border-radius 15px
.red
  color #ff5455
// 购物车按钮
.shopcart
  position absolute
  right 6px
  bottom 6px
  padding 3px 4px
.cartButton
  display flex
  justify-content space-between
.decrease
  flex 1 1 24px
  width 30px
  height 25px
  background url('../../../static/remove.png') no-repeat
  background-size 24px 24px
  z-index 1
  transition all 0.4s linear
.decrease.hidden
  transform translate3d(40px, 0, 0) rotate(180deg)
  opacity 0
.add
  flex 1 1 24px
  width 24px
  height 24px
  background url('../../../static/add.png') no-repeat
  background-size 24px 24px
  z-index 10
.goodNo
  line-height 24px
  color #ede2d9
  padding 0 4px
  z-index 1
  transition all 0.2s linear
.goodNo.hidden
  opacity 0
.noGood
  text-align center
  color #ffffff
  font-size 14px
.nothingImg
  width 190px
  height 190px
</style>
