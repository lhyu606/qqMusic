<template>
  <div class="contain">
    <div class="header borderB" >
      <div class="title fs18" @click="openTitles">
        {{titles[titleIndex]}}
        <span class="caret" :class="{active: selectTitle}"></span>
      </div>
      <div class="titleBox borderB" :class="{active: selectTitle}">
        <div class="subTitle" v-for="(item, index) in titles" :key="index" @click="checkTitle(index)">
          {{item}}
        </div>
      </div>
    </div>
    <!-- 在线商城订单 -->
    <scroll-view 
      scroll-y="true" 
      @scrolltolower="scrolltolower" 
      lower-threshold="50" 
      class="body" 
      v-if="titleIndex===0"
      key="titleIndex0">
      <div class="headerCover" v-if="!refresh"></div>
      <div class="listnone" v-if="orderList.length === 0"> 
        <div class="noneImg text-c">
          <img src="../../../static/nothingPic.png">
        </div>
        <div class="noneText text-c colb2 fs14">暂时没有订单</div>
      </div>
      <div class="list" v-if="orderList.length > 0">
        <div class="item" v-for="(item, index) in orderList" :key="item.OrderNo" @click="toOrderDetail(item.OnlineOrderID)">
          <div class="pt20"></div>
          <div class="borderTB plr10 itemContent">
            <div class="lh40 fs16 flexlr">
              <div class="title-left pl10">{{item.CompanyName}}-{{item.RoomName}}</div>
              <div class="title-right">
                <span v-if="item.Status=='已退款' && item.RefundStatus == '2'">部分退款</span>
                <span v-else>{{item.Status}}</span>
              </div>
            </div>
            <div class="borderT lh25 flexlr content">
              <div class="conLeft">
                <img src="../../../static/ktv.png" v-if="!item.LogoUrl || item.LogoUrl==''" class="orderImg">
                <img :src="item.LogoUrl" class="orderImg" v-else>
              </div>
              <div class="conCenter flextb">
                <div class="fs16 goodName">{{item.MaterialName}}</div>
                <div class="fs12 colb2">总价：{{item.TotalMoney}}</div>
              </div>
              <div class="conRight flextb fs16">
                <div v-show="item.Status=='未付款'">下单时间：</div>
                <div v-show="item.Status=='未付款'" class="time-in">{{item.OrderDatetime}}</div>
                <div v-show="item.Status=='已付款'">支付时间：</div>
                <div v-show="item.Status=='已付款'" class="time-in">{{item.PaymentDatetime}}</div>
                <div v-show="item.Status=='未消费'">支付时间：</div>
                <div v-show="item.Status=='未消费'" class="time-in">{{item.PaymentDatetime}}</div>
                <div v-show="item.Status=='已消费' && item.AfterPaySign == 0 && !item.showPaymentDatetime">消费时间：</div>
                <div v-show="item.Status=='已消费' && item.AfterPaySign == 0 && !item.showPaymentDatetime" class="time-in">{{item.ConsumeDatetime}}</div>
                <div v-show="item.Status=='已消费' && item.AfterPaySign == 0 && item.showPaymentDatetime">支付时间：</div>
                <div v-show="item.Status=='已消费' && item.AfterPaySign == 0 && item.showPaymentDatetime" class="time-in">{{item.PaymentDatetime}}</div>
                <div v-show="item.Status=='已消费' && item.AfterPaySign == 1">支付时间：</div>
                <div v-show="item.Status=='已消费' && item.AfterPaySign == 1" class="time-in">{{item.PaymentDatetime}}</div>
                <div v-show="item.Status=='已退款'">退款时间：</div>
                <div v-show="item.Status=='已退款'" class="time-in">{{item.RefundDatetime}}</div>

                <div v-show="item.Status=='退款中'">支付时间：</div>
                <div v-show="item.Status=='退款中'" class="time-in">{{item.PaymentDatetime}}</div>
              </div>
            </div>
            <div class="lh35 colb2 fs16 flexlr">
              <span v-show="item.AfterPaySign == 1">后结</span>
              <span v-show="item.AfterPaySign == 0">现结</span>
              <span v-show="item.SynSign!=0 && item.RefundStatus == '1' && item.StatusSign==2 && item.QuitOnlineOrderID==0" class="red text-right">异常单</span>
              <!-- v-show="order.SynSign!=0 && order.RefundStatus=='1' && order.StatusSign==2 && order.QuitOnlineOrderID==0 && isAuthRefund==0"  item.hasRefund 退款成后隐藏 按钮  -->
              <span 
                v-show="item.SynSign!=0 && item.RefundStatus == '1' && item.StatusSign==2 && item.QuitOnlineOrderID==0 && isAuthRefund==0"
                class="refund-btn" 
                :class="{hasRefund: item.hasRefund}"
                @click.stop="refund(item)"
                >退款</span>
            </div>
          </div>
        </div>
        <div class="pt20"></div>
        <div class="text-c">
          <span class="fs12 colb2" v-show="isOver">已经没有更多了</span>
        </div>
        <div class="pt20"></div>
      </div>
    </scroll-view>
    <!-- 在线商城订单 -->
    <!-- 卡台商品单 -->
    <scroll-view 
      scroll-y="true" 
      class="body" 
      v-if="titleIndex===1"
      key="titleIndex0">
      <div class="headerCover"></div>
      <div class="listnone" v-if="allOrderFromOffline.length === 0"> 
        <div class="noneImg text-c">
          <img src="../../../static/nothingPic.png">
        </div>
        <div class="noneText text-c colb2 fs14">暂时没有订单</div>
      </div>
      <div class="item" v-for="(item, index) in allOrderFromOffline" :key="index" v-if="allOrderFromOffline.length > 0">
        <div class="pt20"></div>
        <div class="flextb bordertb offline-item lh24 fs16 plr10">
          <div class="flexlr">
            <div class="line">{{item.materialname}}</div>
            <div class="line text-r">{{item.ordernumber + item.materialunit}}</div>
            <div class="line text-r">{{item.totalmoney}}</div>
          </div>
          <div class="flexlr">
            <div class="line">
              <span :class="{red: item.isRed}">{{item.checkoutstatus}}</span>
            </div>
            <div class="line">{{item.orderdatetime}}</div>
            <div class="line text-r">{{item.remark}}</div>
          </div>
        </div>
      </div>
      <div class="line-bottom" v-if="allOrderFromOffline.length > 0">-------- 我是有底线的 --------</div>
    </scroll-view>
    <!-- 卡台商品单 -->
  </div>
</template>
<script>
import Vue from 'vue'
import util from '@/utils/index'
export default {
  data () {
    return {
      titles: ['在线商城订单', '卡台商品单'],
      titleIndex: 0,
      selectTitle: false,
      orderList: [],
      refresh: false,
      page: 1,
      pagesize: 20,
      isOver: false,
      allOrderFromOffline: [],   // 卡台商品单
      isAuthRefund: false
    }
  },
  computed: {
    companyAndRoom () {
      return this.$store.state.companyAndRoom
    },
    ecard () {
      return this.$store.state.ecard
    },
  },
  methods: {
    formatTime (timeStemp) {
      // 格式化时间
      let date = new Date(timeStemp)
      return util.formatTime(date)
    },
    getCompanyMsg () {
      // 获取总店信息，是否允许自助 退款
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/company_admin/index.php/Interface/getCompanyMsg', 
        data: '{"companyid":"'+this.$store.state.headShopNo+'"}',
        success(res) {
          if (res.data.ret === 0 && res.data.msg) {
            that.isAuthRefund = res.data.msg.IsAuthRefund
          }
        }
      })
    },
    getOrderHistory () {
      // 查询 订单列表
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/order/getMyOrderList', 
        data: {
          clouduserid: this.$store.state.clouduserid,
          requestInfo: {
            page: that.page,
            pagesize: that.pagesize
          }
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          // 页码加 1
          that.page++
          if (res.data.code === '0'){
            // 存储所有商品类别
            if (!res.data.result) {
              // 返回结果长度小于 单页请求数，则 结束
              that.isOver = true
              return
            }
            // 过滤 隐藏新生成的退款单，只显示原单(状态从异常单变成退款单)
            // for (let i=res.data.result.length-1; i>=0; i--) {
            //     let item = res.data.result[i]
            //     if (item.RefundStatus === 1 && item.QuitOnlineOrderID !== 0 && item.SynSign==2) {
            //         res.data.result.splice(i, 1)
            //     }
            // }
            // 如果 第一页 请求为空，则再请求一次
            if (that.page === 2 && res.data.result.length === 0) {
                that.getOrderHistory()
            }
            // 处理时间
            for (let i=0; i<res.data.result.length; i++) {
              if (!res.data.result[i].ConsumeDatetime) {
                // 没有 消费时间，则 显示支付时间
                Vue.set(res.data.result[i], 'showPaymentDatetime', true)
              }
              res.data.result[i].ConsumeDatetime = that.formatTime(res.data.result[i].ConsumeDatetime) 
              res.data.result[i].OrderDatetime = that.formatTime(res.data.result[i].OrderDatetime) 
              res.data.result[i].PaymentDatetime = that.formatTime(res.data.result[i].PaymentDatetime) 
              res.data.result[i].RefundDatetime = that.formatTime(res.data.result[i].RefundDatetime) 
              // 标记 是否 退款 成功 【仅用于 当前页面 退款 成功后，置灰 退款 按钮】
              Vue.set(res.data.result[i], 'hasRefund', false)
            }
            if (that.page == 2) {
              // 如果 当前是第一页，清空 历史 记录, 在 此处 清空是为了 减小空白数据时间
              that.orderList = []
            }
            that.orderList = that.orderList.concat(res.data.result)
          } else {
            // that.orderList = []
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
    getAllOrderFromOffline () {
      // 获取卡台商品单
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/sync_service/market/order/getAllOrderFromOffline', 
        data: {
          clouduserid: this.$store.state.clouduserid,
          companyID: this.companyAndRoom.CompanyID,
          openkmid: this.$store.state.ecard.ecardid || ''
        },
        header:{
          'content-type': 'application/json;charset=UTF-8'
        },
        success(res) {
          console.log('res.data')
          console.log(res.data)
          if (res.data.ret === '0'){
            // 存储所有商品类别
            for (let i=0; i<res.data.data.roomcurrwinelist.length; i++) {
              let item = res.data.data.roomcurrwinelist[i]
              if (item.checkoutstatus.includes('未结')) {
                item.isRed = true
              } else {
                item.isRed = false
              }
            }
            that.allOrderFromOffline = res.data.data.roomcurrwinelist
          } else {
            // that.orderList = []
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
    refund (item) {
      // 退款
      let onlineorderid = item.OnlineOrderID
      console.log('退款')
      if (item.hasRefund) {
        return false
      }
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/sync_service/online/order/checkRefund', 
        data: {
          onlineorderid: onlineorderid,
          companyid: this.$store.state.companyAndRoom.CompanyID
        },
        header:{
          'content-type': 'application/json;charset=UTF-8'
        },
        success (res) {
          if (res.data.ret === '0') {
            item.hasRefund = true // 隐藏 退款 按钮
            wx.showToast({
              title: '退款成功',
              icon: 'none',
              duration: 2000
            })
            // 页码 切为 1
            // that.page = 1
          } else {
            wx.showToast({
              title: '退款失败',
              icon: 'none',
              duration: 2000
            })
          }
          // 刷新 页面 数据， 此处模拟 切换 tab，实际为 刷新 效果
          that.checkTitle(0)
        },
        fail () {
          wx.showToast({
            title: '通讯失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    openTitles () {
      // 打开选项卡
      this.selectTitle = !this.selectTitle
    },
    checkTitle (index) {
      // 切换列表
      this.selectTitle = false
      this.titleIndex = index
      this.page = 1
      // this.orderList = []
      this.allOrderFromOffline = []
      if (this.titleIndex === 1) {
        this.getAllOrderFromOffline()
      } else {
        this.getOrderHistory()
      }
    },
    scrolltolower(e) {
      // 加载更多
      if (this.isOver) {
        //  没有更多数据
        return false
      }
      this.getOrderHistory()
    },
    toOrderDetail (onlineOrderID) {
      // 去订单详情
      wx.navigateTo({
        url: '/pages/orderDetail/main?onlineOrderID=' + onlineOrderID
      })
    }
  },
  created () {
    console.log('page-----orderHistory订单列表')
  },
  mounted () {
    console.log('mounted-----订单列表')
    this.page = 1
    this.titleIndex = 0
    this.orderList = []
    this.getOrderHistory()
    this.getCompanyMsg()

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
  background $black
.header
  position fixed
  top 0
  left 0
  right 0
  height 45px
  z-index 10
  background $brown
.header.refresh
  position relative
.title
  position relative
  color $yellow
  line-height 44px
  text-align center
  z-index 10
  background $brown
.caret
  position: absolute
  top: 11px
  right: 14px
  border: none
  width: 20px
  height: 20px
  background url('../../../static/pullUp.png') no-repeat
  background-size 20px 20px
.caret.active
  background url('../../../static/pullDown.png') no-repeat
  background-size 20px 20px
.titleBox
  position absolute
  top -110px
  left 0
  right 0
  z-index 1
  background $black
  padding 10px 16px 0 16px
  transition all 0.3s linear
.titleBox.active
  top 45px
.subTitle
  height: 30px
  width: 100%
  line-height: 30px
  font-size: 16px
  border-radius: 8px
  background: #cea16a
  color: #fff
  text-align: center
  margin-bottom: 15px
// 内容部分
.body
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  overflow scoll
  z-index 1
.headerCover
  height 45px
.noneImg
  padding 20px 0 0
.noneImg img
  width 190px
  height 190px
.itemContent
  background $brown
  color $yellow
.content
  padding 10px 10px 0px
.conLeft
  flex 0 0 50px
  height 50px
.orderImg
  width 50px
  height 50px
  border-radius 5px
.conCenter
  flex 0 0 160px
  padding-left 10px
  padding-right 5px
.goodName
  width 160px
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
.conRight
  flex 0 0 120px
.time-in
  font-size 12px
  color #b2b2b2
.refund-btn
  height 28px
  line-height 28px
  background $yellow
  color #fff
  text-align center
  padding 0 10px
  border-radius 3px
.refund-btn.hasRefund
  background #b2b2b2
// 卡台商品单
.offline-item
  background $brown
.line
  flex 1 1 33%
  color $yellow
  white-space nowrap
.line-bottom
  text-align center
  color $yellow
  font-size 14px
  padding 30px 0 40px
.red
  color #ff5c6c
</style>