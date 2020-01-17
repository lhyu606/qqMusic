<template>
  <div class="contain">
    <div class="tip lh30 fs15">
      <img src="../../../static/tip.png" class="tipPic">付款可能存在延时，请勿重复支付噢！
    </div>
    <div class="lh50 colYellow plr10 fs16 bgBrown">
      <div class="flexlr">
        <div class="left">商品名称</div>
        <div class="right text-r">{{ordername}}</div>
      </div>
      <div class="flexlr borderT">
        <div class="left">支付金额</div>
        <div class="right text-r">￥{{money}}</div>
      </div>
    </div>
    <div class="pt20"></div>
    <div class="botton" @click="payCard">
      确认支付
    </div>
  </div>
</template>
<script>
import util from '@/utils/index'
export default {
  data () {
    return {
      ip: '',
      orderno: '',
      ordername: '',
      money: 0
    }
  },

  components: {
  },

  computed: {
    companyAndRoom () {
      return this.$store.state.companyAndRoom
    },
    clouduserid () {
      return this.$store.state.clouduserid
    },
    applyCard () {
      return this.$store.state.applyCard
    }
  },
  watch: {

  },
  methods: {
    getIP () {
      // IP地址查询接口
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/Member/Integration/getIp',
        data: {
          clouduserid: this.clouduserid,
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          //  获取 ip  成功
          if (res.data.ret == 0) {
            that.ip = res.data.ip
          } else {
            // 失败
            console.log('获取 ip 失败')
          }
        }
      })
    },
    payCard () {
      // 确认 支付
      // userType 0 微信公众好用户  1 小程序用户
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/member/pay',
        data: {
          ip: this.ip,
          orderno: this.orderno,
          type: 'JSAPI',
          shopno: this.companyAndRoom.CompanyID,
          money: this.money,
          kmnotifyurl: this.$store.state.ip + '/wechat_member/#/cardDetail?orderno=' + this.orderno+ '&clouduserid=' + this.clouduserid,
          merchanturl: util.getCurrentPageUrl(),
          userType: 1
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.ret == 0) {
          //  获取 支付参数  成功
            if (res.data.data.result && res.data.data.result.paypackage) {
              that.callUpWxPay(res.data.data.result.paypackage)
            } else {
              wx.showToast({
                title: res.data.msg || '发起支付失败',
                icon: 'none',
                duration: 2000
              })
            }
          } else {
            wx.showToast({
              title: res.data.msg || '发起支付失败',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail (res) {
          wx.showToast({
            title: '发起支付失败',
            icon: 'cancel',
            duration: 2000
          })
        }
      })
    },
    callUpWxPay (payParam) {
      let that = this
      // 唤起 小程序 支付 api
      console.log('支付参数：', payParam)
      wx.requestPayment(
      {
        'timeStamp': payParam.timeStamp,
        'nonceStr': payParam.nonceStr,
        'package': payParam.package,
        'signType': payParam.signType,
        'paySign': payParam.paySign,
        success: function(res){
          console.log('支付成功')
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          })
          let timer = setTimeout(() => {
            clearTimeout(timer)
            timer = null
            wx.reLaunch({
              url: '/pages/good/main'
            })
          }, 2000)
        },
        fail: function(res){
          console.log('支付失败')
          wx.showToast({
            title: '支付失败',
            icon: 'cancel',
            duration: 2000
          })
        }
      }) 
    }
  },
  created () {
    console.log('page--------购卡充值begin')
  },
  mounted () {
    console.log('mounted--------购卡充值begin')
    // 获取支付方式 订单id
    let options = util.getCurrentPageOptions()
    this.orderno = options.orderno
    this.ordername = options.ordername
    this.money = options.money
    this.getIP()
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
  padding 10px 0
  min-height 100%
.tip
  background #fdf7d3
  color $yellow
.tipPic
  width 20px
  height 20px
  margin 5px
  vertical-align top
.borderT
  border-top 1px solid rgba(0, 0, 0, 0.1)
.botton
  width: 90%
  height: 45px
  background: $yellow
  margin: 20px auto 0
  left: 0
  right: 0
  border-radius: 5px
  text-align: center
  line-height: 45px
  color: #fff
  font-size: 16px
</style>