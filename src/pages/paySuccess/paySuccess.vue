<template>
	<div class="pay-success">
        <div class="pay-success-up">
            <div class="pay-success-up-title">
                <span class="pay-success-up-title-icon"></span>
                <span class="pay-success-up-title-word">支付成功</span>
            </div>
            <div class="pay-success-up-word" v-if="hasBind && order.AfterPaySign == 0">稍后服务员会将商品送到您卡台</div>
            <div class="pay-success-up-word" v-if="!hasBind">您的卡台已解绑</div>
            <div class="pay-success-up-ball">
                <div class="pay-success-up-ball-icon"></div>
            </div>
            <div class="pay-success-center">
                <div class="pay-success-center-left" @click="toChoiceGoods" v-if="hasBind">继续购物</div>
                <div class="pay-success-center-left" @click="toScan" v-if="!hasBind">扫码绑定</div>
                <div class="pay-success-center-mid"></div>
                <div class="pay-success-center-right" @click="toOrderDetail" v-if="hasBind">查看订单</div>
                <div class="pay-success-center-right-gray" v-show="!hasBind">查看订单</div>
            </div>
        </div>
        <div class="pay-success-padding"></div>
        <div class="pay-success-padding"></div>
        <div class="pay-success-bottom lh35 fs14">
            <div class="pay-success-bottom-title">
                <span class="pay-success-bottom-title-table" v-if="hasBind">{{companyAndRoom.RoomName}}卡台</span>
                <span class="pay-success-bottom-title-table-red" v-if="!hasBind">未绑定卡台</span>
                <span class="pay-success-bottom-title-price">￥{{order.TotalMoney}}</span>
            </div>
            <div class="pay-success-bottom-content">
                商品名称
                <span class="pay-success-bottom-content-item">
                    {{selectFoodsFirst}}
                    <span v-if="totalCount>1">等{{totalCount}}件</span>
                </span>
            </div>
            <div class="pay-success-bottom-content">
                支付方式
                <span class="pay-success-bottom-content-item">
                    <span>{{paymentType}}</span>
                </span>
            </div>
            <div class="pay-success-bottom-content">
                交易时间<span class="pay-success-bottom-content-item">{{OrderDatetime}}</span>
            </div>
            <div class="pay-success-bottom-content">
                订单编号<span class="pay-success-bottom-content-item">{{OrderNo}}</span>
            </div>
            <div class="order-history-all-item-content-sign pay-success-bottom-content">
                <span v-show="order.AfterPaySign == 1">后结</span>
                <span v-show="order.AfterPaySign == 0">现结</span>
                <span v-show="order.SynSign==2" class="red text-right">异常单</span>
                <!-- <span v-show="order.SynSign==2 && order.AfterPaySign == 1" class="order-history-all-item-content-btn" @click="refund">退款</span> -->
            </div>
        </div>
        <div class="pay-success-bottom-tip fs14 lh40" v-if="!hasBind">卡台点单，退款请联系场所管理员</div>
        <div class="pay-success-padding"></div>
        <div class="pay-success-padding"></div>
        <div class="pay-success-padding"></div>
        <div class="pay-success-padding"></div>
    </div>
</template>

<script>
import util from '@/utils/index'
export default {
data: function () {
	return {
    hasBind: true,
    order: {}
  }
},
components: {
},
  computed: {
	  paymentType () {
    	return this.order.PaymentType
	  },
	  companyAndRoom () {
      return this.$store.state.companyAndRoom
    },
	  order () {
      return this.$store.state.order
	  },
	  OrderNo () {
    	return this.order.OrderNo
	  },
	  OrderDatetime () {
    	return this.order.OrderDatetime
    },
	  totalPrice () {
	    if (this.order.OrderDetail === undefined) {
		    	return 0
	    }
	    let totalPrice = 0
	    this.order.OrderDetail.forEach((food) => {
		    let price = parseFloat(food.SellPrice) * 1000
		    totalPrice += parseInt(food.OrderNumber) * price
	    })
	    return totalPrice / 1000
	  },
	  totalCount () {
    	if (this.order.OrderDetail === undefined) {
	  	  return 0
    	}
    	let totalCount = 0
    	this.order.OrderDetail.forEach((food) => {
	  	  totalCount += parseInt(food.OrderNumber)
    	})
    	return totalCount
	  },
	  selectFoodsFirst () {
	  	if (this.order.OrderDetail === undefined) {
	  		return ''
      }
    	return this.order.OrderDetail[0].MaterialName
	  }
  },
	methods: {
    formatTime (timeStemp) {
      // 格式化时间
      let date = new Date(timeStemp)
      return util.formatTime(date)
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
            that.order = res.data.result
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
	toScan () {
		// 重新绑定 卡台
	},
  	toChoiceGoods () {
  		wx.reLaunch({
	        url: '/pages/good/main'
	      })	        
	},
  	toOrderDetail () {
  		wx.reLaunch({
	        url: '/pages/orderDetail/main?onlineOrderID=' + this.order.OnlineOrderID
	      })
	}
	},
	created () {
		console.log('page----支付成功')
	},
	mounted () {
		console.log('mounted----支付成功')
	    // 获取支付方式 订单id
	    let options = util.getCurrentPageOptions()
	    this.onlineOrderID = parseInt(options.onlineOrderID)

	    this.getOrderDetailById()
	}
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
	.pay-success
		position relative
		background #201c19
		.pay-success-up
			position relative
			height 374px
			width 100%
			background #cea16a
      .pay-success-up-title
				position absolute
				margin 0 auto
				left 0px
				right 0px
				text-align center
				top 30%
				font-size 0
        .pay-success-up-title-icon
					display inline-block
					vertical-align top
					width: 35px
					height: 35px
					background-image: url("../../../static/white_star.png")
					background-size: 35px 35px
					background-repeat: no-repeat
				.pay-success-up-title-word
					color #fff
					font-size 26px
			.pay-success-up-word
				position absolute
				margin 0 auto
				left 0px
				right 0px
				text-align center
				top 50%
				color #fff
				font-size 15px
			.pay-success-up-ball
				font-size 20px
				font-weight bold
				position absolute
				z-index 1
				height 50px
				width 50px
				border-radius 50%
				border 4px solid #cea16a
				background #423c31
				text-align center
				line-height 46px
				margin 0 auto
				left 0
				right 0
				bottom 20px
				color #cea16a
				.pay-success-up-ball-icon
					position absolute
					margin auto
					top 0
					bottom 0
					left 0
					right 0
					display inline-block
					vertical-align top
					width: 30px
					height: 28px
					background-image: url("../../../static/check_big.png")
					background-size: 30px 28px
					background-repeat: no-repeat
			.pay-success-center
				position absolute
				width 100%
				height 45px
				bottom 0
				left 0
				display flex
				color #cea16a
				font-size 16px
				.pay-success-center-left
					flex 1
					height 45px
					text-align center
					line-height 45px
					background #423c31						
				.pay-success-center-mid
					flex 0 0 2px
					height 45px
					text-align center
					line-height 45px
					background #cea16a						
				.pay-success-center-right
					flex 1
					height 45px
					text-align center
					line-height 45px
					background #423c31						
				.pay-success-center-right-gray
					flex 1
					height 45px
					text-align center
					line-height 45px
					background #999999
					color #cea16a
		.pay-success-padding
			width 100%
			height 20px
			background #201c19
		.pay-success-bottom
			width 100%
			background #423c31
			padding 0 10px 10px
			.pay-success-bottom-title
				height 35px
				position relative
				width 100%
				line-height 35px
				border-bottom 1px solid #cea16a
				color #cea16a
				.pay-success-bottom-title-table
					display inline-block
					position absolute
					left 0
				.pay-success-bottom-title-table-red
					display inline-block
					position absolute
					left 0
					color red
				.pay-success-bottom-title-price
					display inline-block
					position absolute
					right 0
			.pay-success-bottom-content
				height 35px
				position relative
				width 100%
				line-height 35px
				color #cea16a
				.pay-success-bottom-content-item
					display inline-block
					position absolute
					right 0
			.order-history-all-item-content-sign
				display flex
				height 25px
				justify-content space-between
				text-align left
				margin-top 6px
				padding-bottom 5px
				color #cea16a
				background #423c31
				line-height 25px
				span
					flex 1 1 33.3%
				.text-right
					text-align right
				.red
					color #ff5c6c
				.order-history-all-item-content-btn
					margin-left 15px
					flex 1 1 25px
					height 25px
					line-height 25px
					border-radius 6px
					text-align center
					background #cea16a
					color #ffffff
		.pay-success-bottom-tip
			width 100%
			height 45px
			text-align center
			line-height 45p			
			color #cea16a
			
</style>


