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
              <div class="goodName">{{item.materialname}}</div>
              <div class="goodNum">{{item.realordernumber + item.materialunit}}</div>
              <div class="goodMoney text-r"> ￥{{item.subtotal}}</div>
            </div>
            <div class="des pr10 lh20 text-r" v-if="item.remark !== ''">
              {{item.remark}}
            </div>
          </div>
        </div>
        <div class="pt20"></div>
        <!-- 备注 -->
        <div class="remark linetb plr10 colYellow lh20 fs14">
          <div class="">备注：</div>
          <div class="text-r">{{uncheckData.checkoutremark}}</div>
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
        <div class="noAfter">
          <div class="totlePrice">需支付：￥{{uncheckData.checkoutpaymoney}}</div>
          <div class="obutton" @click="toAfterPay()">下单支付</div>
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
      uncheckData: {},  // 未结账单
      cartDetail: [{}], // 商品列表
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
    clouduserid () {
      return this.$store.state.clouduserid
    }
  },
  methods: {
    getUnCheckoutOrderFromOffline () {
      // 查询 购物车详情
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/sync_service/market/order/getUnCheckoutOrderFromOffline', 
        data: {
          "clouduserid":this.clouduserid,
          "companyID": this.companyAndRoom.CompanyID,
          "openkmid": this.$store.state.ecard.ecardid || ''
        },
        header: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        success(res) {
          console.log('查询 购物车详情')
          console.log(res.data)
          if (res.data.ret === '0'){
            // 存储所有商品类别
            that.uncheckData = res.data.data
            that.cartDetail = res.data.data.uncheckwinedetaillist
            console.log('that.cartDetail')
            console.log(that.cartDetail)
          } else {
            that.cartDetail = [{}]
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
    checkPayMode (payMode) {
      console.log(payMode)
      // 切换支付方式
      this.payMode = payMode
    },
    toAfterPay (isAfter) {
      // 落单，去支付
      if (isAfter === 0) {
        // 后结，先下单
      }
      // 
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/sync_service/online/order/orderSubmitNoPay', 
        data: {
          clouduserid: this.$store.state.clouduserid,
          companyID: this.$store.state.companyAndRoom.CompanyID,
          openkmid: this.$store.state.ecard.ecardid,
          checkoutpaymoney: this.uncheckData.checkoutpaymoney,
          materialList: this.cartDetail
        },
        header: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        success(res) {
          if (res.data.ret === '0') {
            // 清空购物车
            util.clearCart() 
            // 去支付
            wx.navigateTo({
              url: '/pages/afterPayReady/main?payMode=' + that  .payMode + '&onlineOrderID=' + res.data.data.onlineorderid
            })
          } else {
            wx.showToast({
              title: '结账失败',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail (res) {
          wx.showToast({
            title: '通讯失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  created () {
    console.log('page-----购物车详情')
  },
  mounted () {
    console.log(this.roomSetting)
    this.getUnCheckoutOrderFromOffline()
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
.goodName
  flex 1 1 auto
.goodNum
  flex 0 0 50px
.goodMoney
  flex 0 0 80px
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