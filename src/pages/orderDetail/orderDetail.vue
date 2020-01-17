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
          <div class="table colb2">{{companyAndRoom.RoomName}}卡台</div>
        </div>
      </div>
      <!-- 内容 -->
      <scroll-view scroll-y="true" class="body">
        <!-- 第一模块 -->
        <div class="pt20"></div>
        <div class="borderTB plr10 bgBrown">
          <div class="pl10 lh35 fs13" v-for="(food, index) in orderDetail.OrderDetail" :key='index'>
            <div class="flexlr">
              <div class="left">{{food.MaterialName}}</div>
              <div class="right">
                <span class="mr40">×{{food.OrderNumber}}</span>
                <span>￥{{food.SellPrice}}</span>
              </div>
            </div>
            <!-- 套餐子商品 -->
            <div 
              class="child flexlr colb2 plr10 lh25"
              v-if="food.ChildList.length" 
              v-for="(child, idx) in food.ChildList"
              :key="idx"
              >
              <div class="">{{child.MaterialName}}</div>
              <div class="">×{{child.OrderNumber}}</div>
            </div>
          </div>
          <!-- 总计 -->
          <div class="flexlr lh40 fs16">
            <span>总价</span>
            <span>￥{{orderDetail.TotalMoney}}</span>
          </div>
        </div>
        <!-- 第一模块 -->
        <!-- 第 2 模块 -->
        <div class="pt20"></div>
        <div class="borderTB plr10 bgBrown">
          <div class="plr10 flexlr lh40 fs16">
            <span>订单状态</span>
            <span class="colb2" v-if="orderDetail.Status=='已退款' && orderDetail.RefundStatus == '2'">部分退款</span>
            <span class="colb2" v-else>{{orderDetail.Status}}</span>
          </div>
          <div class="borderT"></div>
          <div class="plr10 lh25 fs13">
            <div class="flexlr">
              <span class="bottom-left">订单编号</span>
              <span class="bottom-right">{{orderDetail.OrderNo}}</span> 
            </div>
            <div class="flexlr">
              <span class="bottom-left">交易时间</span>
              <span class="bottom-right">{{orderDetail.OrderDatetime}}</span>
            </div>
            <div class="flexlr">
              <span class="bottom-left">支付方式</span>
              <span class="bottom-right">{{orderDetail.PaymentType}}</span>
            </div>
            <div class="flexlr" v-if="orderDetail.Status=='已消费'||orderDetail.Status=='已付款'">
              <span class="bottom-left">二维码</span>
              <span class="bottom-right">{{orderDetail.ValidateCode}}</span>
            </div>
            <div class="flexlr" v-if="orderDetail.Status=='已退款' && orderDetail.RefundStatus == '2'">
              <span class="bottom-left">退款金额</span>
              <span class="bottom-right">{{orderDetail.RefundMoney}}</span>
            </div>
          </div>
        </div>
        <!-- 第 2 模块 -->
        <div class="pt20"></div>
        <!-- 支付 -->
        <div class="pay" v-if="noPay">
          <div class="borderTB flexlr lh40 plr20 fs14 bgBrown">
            <div class="payText">
              <span v-show="payMode===1">使用微信支付</span>
              <span v-show="payMode===0">使用会员卡支付</span>
            </div>
            <div class="">
              <switch checked @change="switchPayMode" class="switch" />
            </div>
          </div>
          <div class="pt20"></div>
          <div class="button" @click="toPayReady">确认支付</div>
          <div class="pt20"></div>
          <div class="pt20"></div>
        </div>
        <!-- 支付 -->
      </scroll-view>
      <!-- 内容 -->
    </div>
  </div>
</template>
<script>
import util from '@/utils/index'
export default {
  data () {
    return {
      onlineOrderID: 0,
      orderDetail: {},
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
    },
    noPay () {
      // 是否已支付
      if (this.orderDetail.Status === '未付款' && this.orderDetail.AfterPaySign == '0') {
        return true
      }
      return false
    }
  },
  methods: {
    formatTime (timeStemp) {
      // 格式化时间
      let date = new Date(timeStemp)
      return util.formatTime(date)
    },
    switchPayMode (e) {
      // 切换支付模式
      if (e.mp.detail.value) {
        this.payMode = 1
      } else {
        this.payMode = 0
      }
    },
    getOrderDetailById () {
      // 查询 订单详情
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/order/getOrderDetailById',
        data: {
          clouduserid: this.$store.state.clouduserid,
          requestInfo: {
            OnlineOrderID: this.onlineOrderID
          }
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          console.log('订单详情')
          console.log(res.data)
          if (res.data.code === '0'){
            // 存储所有商品类别
            res.data.result.ConsumeDatetime = that.formatTime(res.data.result.ConsumeDatetime) 
            res.data.result.OrderDatetime = that.formatTime(res.data.result.OrderDatetime) 
            res.data.result.PaymentDatetime = that.formatTime(res.data.result.PaymentDatetime) 
            res.data.result.RefundDatetime = that.formatTime(res.data.result.RefundDatetime)
            that.orderDetail = res.data.result
          } else {
            that.orderDetail = {}
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
    toPayReady () {
      // 去支付
      wx.reLaunch({
        url: '/pages/payReady/main?payMode=' + this.payMode + '&onlineOrderID=' + this.onlineOrderID
      })
    }
  },
  created () {
    console.log('page---------订单详情')
  },
  mounted () {
    // 获取支付方式 订单id
    console.log('mounted--------订单详情')
    let options = util.getCurrentPageOptions()
    this.onlineOrderID = parseInt(options.onlineOrderID)

    this.getOrderDetailById()
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
  background $black
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
.bottom-left
  flex 0 0 80px
.bottom-right
  flex 1 1 auto
  text-align left
.switch
  zoom 0.7
.button
  margin: 0 auto
  width: 80%
  height: 40px
  line-height: 40px
  text-align: center
  font-size: 17px
  border-radius: 5px
  background: #cea16a
  color: #fff
</style>