<template>
  <div class="contain">
    <div class="wrapper">
      <!-- header -->
      <div class="header">
        <div class="position">
          <img src="../../../static/position.png" class="positionImg">
        </div>
        <div class="message">
          <div class="company">{{companyAndRoom.CompanyName}}</div>
          <div class="table">{{companyAndRoom.RoomName}}卡台</div>
        </div>
      </div>
      <!-- body -->
      <scroll-view scroll-y="true" class="body">
        <div class="pt20"></div>
        <!-- 商品列表 -->
        <div class="linetb plr10">
          <div class="item fs13" 
            v-for="(item, index) in cartDetail" 
            :class="{borderT: index != 0}"
            :key="item.OnlineTempOrderID">
            <div class="title flexlr lh35">
              <div class="goodName">{{item.MaterialName}}</div>
              <div class="num">×{{item.OrderNumber}} ￥{{item.SellPrice}}</div>
            </div>
            <div class="des pr10 lh25" v-if="item.WinePresentSetName&&item.WinePresentSetName !== ''">
              <div class="WinePresentSetName">/{{item.WinePresentSetName}}</div>
              <div class="childItem flexlr col999" v-for="(child, idx) in item.ChlidList" :key="child.MaterialID">
                <div class="childName">{{child.MaterialName}}</div>
                <div class="childNum">×{{child.OrderNumber}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="pt20"></div>
        <!-- 总计 -->
        <div class="plr20 linetb flexlr lh40 fs16">
          <div class="totleText">总计：</div>
          <div class="totlePay">￥{{totlePrice}}</div>
        </div>
        <div class="pt20"></div>
        <!-- 支付方式 -->
        <div class="linetb lh40 fs14">
          <div class="plr20">
            选择支付方式
          </div>
          <div class="borderT flexlr payLine" @click="checkPayMode(1)">
            <div class="payIcon wxPayIcon"></div>
            <div class="payText lh40">
              <div class="fs17">使用微信支付</div>
              <div class="fs14 col999 lh10">推荐微信用户在线支付使用</div>
            </div>
            <div class="choose" :class="{active: payMode===1}"></div>
          </div>
          <div class="borderT flexlr payLine" @click="checkPayMode(0)">
            <div class="payIcon memberPayIcon"></div>
            <div class="payText lh40">
              <div class="fs17">使用会员卡支付</div>
              <div class="fs14 col999 lh10">使用会员卡余额支付</div>
            </div>
            <div class="choose" :class="{active: payMode===0}"></div>
          </div>
        </div>
        <div class="pt20"></div>
      </scroll-view>
      <!-- footer -->
      <div class="footer">
        <div class="hasAfter" v-if="roomSetting.IsOpenOrderSheet === '0'">
          <div class="tbutton" @click="toPay(0)">先下单</div>
          <div class="tbutton" @click="toPay(1)">先付款</div>
        </div>
        <div class="noAfter" v-if="roomSetting.IsOpenOrderSheet === '1'">
          <div class="totlePrice">需支付：￥{{totlePrice}}</div>
          <div class="obutton" @click="toPay(1)">下单支付</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import util from '@/utils/index'
export default {
  data () {
    return {
      cartDetail: [{}],
      payMode: 1    // 1 微信支付 0 会员卡支付
    }
  },
  watch: {

  },
  computed: {
    companyAndRoom () {
      return this.$store.state.companyAndRoom
    },
    roomSetting () {
      return this.$store.state.roomSetting
    },
    ecard () {
      return this.$store.state.ecard
    },
    clouduserid () {
      return this.$store.state.clouduserid
    },
    totlePrice () {
      // 商品总价
      let totlePrice = 0
      this.cartDetail.forEach((food) => {
        let price = parseFloat(food.SellPrice) * 1000
        totlePrice += parseInt(food.OrderNumber) * price
      })
      return totlePrice / 1000
    }
  },
  methods: {
    getCartDetail () {
      // 查询 购物车详情
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/cart/getDetail',
        data: {
          clouduserid: this.$store.state.clouduserid
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.code === '0'){
            // 存储所有商品类别
            that.cartDetail = res.data.result
          } else {
            that.cartDetail = [{}]
            wx.showToast({
              title: res.data.msg || '',
              icon: 'none',
              duration: 2000
            })
            console.log('返回码不是 0')
          }
        },
        fail (res) {
          console.log(res)
        }
      })
    },
    checkPayMode (payMode) {
      console.log(payMode)
      // 切换支付方式
      this.payMode = payMode
    },
    toPay (isAfter) {
      // 落单
      let that = this
      // isOpenOrderSheet: 0 先下单，后结     1 直接结账支付 
      let isOpenOrderSheet = 1
      if (isAfter === 0) {
          isOpenOrderSheet = 0
      }
      // 拼装 商品（购物车 商品Id）
      let requestInfo = {}
      requestInfo.isOpenOrderSheet = isOpenOrderSheet
      requestInfo.KmID = this.ecard.ecardid || ''
      requestInfo.priceTypeId = this.ecard.pricetypeid || 0
      requestInfo.temporderids = this.getTemporderids()
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/order/orderForm',
        data: {
          clouduserid: this.$store.state.clouduserid,
          requestInfo: requestInfo
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.code === '0'){
            // 落单成功
            // 清空购物车
            util.clearCart()
              // 只是先下单，提示成功，返回
            if (isOpenOrderSheet === 0) {
              wx.showToast({
                title: '下单成功',
                icon: 'none',
                duration: 2000
              })
              let timer = setTimeout(() => {
                clearTimeout(timer)
                timer = null
                wx.reLaunch({
                  url: '/pages/good/main'
                })
              }, 2000)
              return false
            }
              // 立即去支付
            let OnlineOrderID = res.data.result.OnlineOrderID
            wx.reLaunch({
              url: '/pages/payReady/main?payMode=' + that.payMode + '&onlineOrderID=' + OnlineOrderID
            })
          } else {
            wx.showToast({
              title: res.data.msg || '',
              icon: 'none',
              duration: 2000
            })
            console.log('返回码不是 0')
          }
        },
        fail (res) {
          console.log(res)
        }
      })
      // 清空购物车
      // util.clearCart()
      
    },
    getTemporderids () {
      // 拼装购物车 商品id
      let result = []
      for (let i=0; i<this.cartDetail.length; i++) {
        result.push(this.cartDetail[i].OnlineTempOrderID)
        if (this.cartDetail[i].hasOwnProperty('ChlidList') && this.cartDetail[i].ChlidList.length > 0) {
          this.cartDetail[i].ChlidList.forEach(itemIn => {
            result.push(itemIn.OnlineTempOrderID)
          })
        }
      }
      return result
    }
  },
  created () {
    console.log('page-----购物车详情')
  },
  mounted () {
    this.getCartDetail()
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
div
  box-sizing border-box
.contain
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  background #423c31
  overflow hidden
.wrapper
  width 100%
  height 100%
  display flex
  flex-direction column
  color #cea16a
// header
.header
  flex 0 0 75px
  display flex
  justify-content space-between
  border-bottom 3px solid #cea16a
.position
  width 31px
  height 42.5px
  margin 14px
.positionImg
  width 31px
  height 42.5px
.message
  flex 1 1 auto
  text-align left
.company
  margin-top 13px
  font-size 18px
  line-height 28px
.table
  font-size 13px
  line-height 20px
// body
.body
  flex 1 1 auto
  overflow scroll 
  background #201c19
.pt20
  height 20px
  background #201c19
.linet
  border-top 1px solid #cea16a
.linetb
  border-top 1px solid #cea16a
  border-bottom 1px solid #cea16a
  background #423c31
.payLine
  height 60px
  overflow hidden
.payIcon
  flex 0 0 75px
.wxPayIcon
  background url('../../../static/wechat_c.png') no-repeat
  background-size 50px 50px
  background-position 20px center
.memberPayIcon
  background url('../../../static/VIP.png') no-repeat
  background-size 50px 50px
  background-position 20px center
.choose
  flex 0 0 60px
.choose.active
  background url('../../../static/check.png') no-repeat
  background-size 30px 30px
  background-position 20px center
.payText
  flex 1 1 auto
// footer
.footer
  flex 0 0 50px
  font-size 15px
  border-top 1px solid #cea16a
.hasAfter
  display flex
  text-align center
  line-height 49px
.tbutton
  flex 1 1 50%
  height 49px
  background #cea16a
  color #ffffff
.tbutton:first-child
  border-right 1px solid #ffffff
.noAfter
  display flex
  line-height 49px
.totlePrice
  flex 1 1 auto
  padding-left 20px
  color #cea16a
.obutton
  flex 0 0 124px
  text-align center
  background $yellow
  color #ffffff

</style>