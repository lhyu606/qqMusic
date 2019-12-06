<template>
  <scroll-view scroll-y="true" class="contain">
    <div class="tip lh30 fs15">
      <img src="../../../static/tip.png" class="tipPic">付款可能存在延时，请勿重复支付噢！
    </div>
    <div class="order lh40 plr10 fs14">
      <div class="flexlr">
        <div class="left">订单编号</div>
        <div class="right">{{order.OrderNo}}</div>
      </div>
      <div class="flexlr">
        <div class="left">商品名称</div>
        <div class="right">
          {{selectFoodsFirst}} <span v-if="totalCount>1">等 {{totalCount}} 件</span>
        </div>
      </div>
      <div class="flexlr">
        <div class="left">支付金额</div>
        <div class="right">￥{{order.TotalMoney}}</div>
      </div>
    </div>
    <div class="pt20"></div>
    <div class="order lh40 fs14">
      <div class="plr10 borderT">
        <!-- 微信支付 -->
        <div class="" v-if="payMode === 1">
          <div class="borderB lh40">支付方式</div>
          <div class="plr10 flexlr payLine">
            <div class="wxIcon"></div>
            <div class="payText flextb lh30">
              <div class="fs17 bold">微信支付</div>
              <div class="fs14">推荐微信用户使用</div>
            </div>
            <div class="payCheck"></div>
          </div>
        </div>
        <!-- 会员支付 -->
        <div class="rgba7" v-if="payMode === 0">
          <div class="borderB lh40">会员卡支付</div>
          <div class="item flexlr" 
            v-for="(item, index) in cards" 
            :key="item.ecardid" 
            v-if="item.uselinemarket !== 1"
            @click="checkCard(index)">
            <div class="imgBox">
              <img :src="item.cardlogourl" v-if="item.cardlogourl && item.cardlogourl !== ''" class="realImg">
              <div class="img" v-else>{{item.gradename}}</div>
            </div>
            <div class="content flextb rgba7 lh16">
              <div class="bold fs15">{{item.gradename}}</div>
              <div class="fs12">卡号：{{item.cardnum}}</div>
              <div class="flexlr fs12">
                <div class="left"><span class="colYellow">￥{{item.accountcash}}</span> 本金</div>
                <div class="right"><span class="colYellow">￥{{item.accountpresent}}</span> 赠送</div>
              </div>
            </div>
            <div class="choose" :class="{active: cardIndex === index}"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="pt20"></div>
    <div class="button" @click="pay">确认支付</div>
    <div class="pt20"></div>
    <div class="pt20"></div>
    <!-- 支付密码支付   【会员支付】 -->
    <div class="passwordPay popMask" @click="closePasswordPay" v-show="passwordPay">
      <div class="popBox" @click.stop="stopPropagation">
        <div class="flextb bgWhite text-c fs16">
          <div class="header lh50">请输入支付密码</div>
          <div class="body plr10 text-j fs14">
            <div class="lh30 text-c">会员卡支付 {{order.TotalMoney}}</div>
            <div class="ptb8">
              <input type="text" v-model="password" class="input" placeholder="请输入支付密码">
            </div>
            <div class="lh30 colb2">
              <div class="pt10"></div>
              <div class="">1.请联系商家获取初始密码</div>
              <div class="">2.若需修改密码，请移步商家平台</div>
            </div>
          </div>
          <div class="footer flexlr text-c lh50">
            <div class="cancel" @click="closePasswordPay">取消</div>
            <div class="comfirm" @click="memberPasswordPay">确定</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 支付密码支付 -->
    <!-- 手机验证码支付   【会员支付】-->
    <div class="messagePay popMask" @click="closeMessagePay" v-show="messagePay">
      <div class="popBox" @click.stop="stopPropagation">
        <div class="flextb bgWhite text-c fs16">
          <div class="header lh50">付款确认</div>
          <div class="body plr10 text-j fs14">
            <div class="lh30">本次交易需要短信确认，校验码已发送至您手机{{mobile}}</div>
            <div class="ptb8 flexlr">
              <input type="text" v-model="messageWord" class="input" placeholder="请输入短信验证码">
              <div class="sendMessage" v-show="!showCutDown" @click="sendCode">发送验证码</div>
              <div class="sendMessage" v-show="showCutDown">{{cutDown}} 秒</div>
            </div>
            <div class="pt10"></div>
          </div>
          <div class="footer flexlr text-c lh50">
            <div class="cancel" @click="closePasswordPay">取消</div>
            <div class="comfirm" @click="memberVerifyPay">确定</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 手机验证码支付 -->
  </scroll-view>
</template>
<script>
import util from '@/utils/index'
export default {
  data () {
    return {
      order: {},
      payMode: 0,    // 1 微信支付 0 会员卡支付
      onlineOrderID: 0,   // 订单 id
      cardIndex: 0,
      passwordPay: false,
      messagePay: false,
      password: '',    // 支付密码
      messageWord: '',  // 手机验证码
      cutDown: 60,       // 倒计时
      showCutDown: false // 展示倒计时
    }
  },

  computed: {
    selectFoodsFirst () {
      if (this.order.OrderDetail === undefined) {
        return ''
      }
      return this.order.OrderDetail[0].MaterialName
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
    cards () {
      return this.$store.state.cards
    },
    companyAndRoom () {
      return this.$store.state.companyAndRoom
    }
  },
  watch: {
    cutDown () {
      if (this.cutDown == 60 || this.cutDown == 0) {
        this.showCutDown = false
      } else {
        this.showCutDown = true
      }
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
    pay () {
      // payMode  0 会员卡支付  1 微信支付
      if (this.payMode == 0) {
        this.memberPay()
      } else {
        this.wxPay()
      }
    },
    wxPay () {
      // 微信支付
      // IsOpenAfterPay   0 现结,   1 后结
      // UserType  0普通微信用户，1小程序用户，默认为0
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/Wxpay/getWxJsapiConfig',
        data: {
          clouduserid: this.$store.state.clouduserid,
          requestInfo: {
            OnlineOrderID: this.order.OnlineOrderID,
            kmnotifyurl: this.$store.state.ip + '/wechat_order_service/#/pay_success?onlineOrderID=' + this.order.OnlineOrderID + '&clouduserid=' + this.$store.state.clouduserid,
            merchanturl: util.getCurrentPageUrl(),
            IsOpenAfterPay: 1,
            winelistidlist: '',
            UserType: 1
          }
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          console.log('支付参数')
          console.log(res.data)
          if (res.data.code === '0'){
            // 唤起支付
            if (res.data.result.result && res.data.result.result.paypackage) {
              // 返回结果 正确
              that.callUpWxPay(res.data.result.result.paypackage)
            } else {
              // 结果 错误
              console.log('K米 返回结果错误')
            }
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
          wx.reLaunch({
            url: '/pages/paySuccess/main?onlineOrderID=' + that.onlineOrderID
          })
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
    },
    memberPay () {
      // 会员卡支付  yjmemberserver/member/pay/verfity
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/member/pay/verfity',
        data: {
          shopno: this.companyAndRoom.CompanyID
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.ret === 0) {
            if (res.data.result === 0) {
              // 直接 会员支付
              that.comfirmMemberPay('')
            }
            if (res.data.result === 1) {
              // 密码支付
              that.passwordPay = true
            }
            if (res.data.result === 2) {
              // 手机验证码支付
              // let before = that.cardList[this.selectCard].mobile.substring(0, 3)
              // let after = that.cardList[this.selectCard].mobile.substring(7)
              // that.mobile = before + '****' + after
              that.messagePay = true
              if (that.cutDown === 60) {
                that.sendCode()
              }
            }
          }
        }
      })
    },
    sendCode () {
      // 发送验证码
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/system/send/validation_code',
        data: {
          shopno: this.companyAndRoom.CompanyID,
          mobile: this.cards[this.cardIndex].mobile
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.ret === 0) {
            that.cutDown = 60
            // 倒计时
            let interval = setInterval(() => {
              that.cutDown--
              if (that.cutDown == 0) {
                clearInterval(interval)
                interval = null
              }
            }, 1000)
          } else {
            console.log('返回码不是 0')
            wx.showToast({
              title: '发送短信验证码失败',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    },
    memberVerifyPay () {
      // 验证手机号 后 会员卡最终 支付
      if (this.messageWord == '') {
        wx.showToast({
          title: '请输入验证码',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/system/check/validation_code',
        data: {
          validationcode: this.messageWord,
          mobile: this.cards[this.cardIndex].mobile
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.ret === 0) {
            // 密码通过
            that.comfirmMemberPay()
          } else {
            console.log('返回码不是 0')
            wx.showToast({
              title: res.data.msg || '密码错误',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    },
    memberPasswordPay () {
      // 验证密码 后 会员卡最终 支付
      if (this.password == '') {
        wx.showToast({
          title: '请输入密码',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/member/password/verfity',
        data: {
          password: this.password,
          ecardid: this.cards[this.cardIndex].ecardid
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.ret === 0) {
            // 密码通过
            that.comfirmMemberPay(that.password)
          } else {
            console.log('返回码不是 0')
            wx.showToast({
              title: res.data.msg || '密码错误',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    },
    comfirmMemberPay (password = '') {
      // 会员卡最终 支付
      // isAfterPay   是否后结，0不是，1是
      if (this.cards.length == 0) {
        wx.showToast({
          title: '没有可用会员卡',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/Wxpay/payMember',
        data: {
          clouduserid: this.$store.state.clouduserid,
          requestInfo: {
            OnlineOrderID: this.order.OnlineOrderID,
            EcardId: this.cards[this.cardIndex].ecardid || '',
            MaterialMoney: this.order.TotalMoney,
            Memberpwd: password,
            isAfterPay: 1
          }
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.code === '0') {
            // 返回码是 0
             wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
            wx.reLaunch({
              url: '/pages/paySuccess/main?onlineOrderID=' + that.onlineOrderID
            })
          } else {
            console.log('返回码不是 0')
            wx.showToast({
              title: res.data.msg || '支付失败',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
      console.log('password')
      console.log(password)
    },
    checkCard (index) {
      // 切换会员卡
      this.cardIndex = index
    },
    openPasswordPay () {
      // 打开 密码支付
      this.passwordPay = true
    },
    closePasswordPay () {
      // 关闭 密码支付
      this.passwordPay = false
    },
    openMessagePay () {
      // 打开 验证码支付
      this.messagePay = true
    },
    closeMessagePay () {
      // 关闭 验证码支付
      this.messagePay = false
    },
    stopPropagation () {
      // 阻止冒泡
    }
  },
  created () {
    console.log('page----payReady支付')
  },
  mounted () {
    console.log('mounted----payReady支付')
    // 获取支付方式 订单id
    let options = util.getCurrentPageOptions()
    this.payMode = parseInt(options.payMode) 
    this.onlineOrderID = parseInt(options.onlineOrderID)

    this.getOrderDetailById()
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
.tip
  background #fdf7d3
  color $yellow
.tipPic
  width 20px
  height 20px
  margin 5px
  vertical-align top
.order
  color $yellow
  background $brown
  border-bottom 1px solid $yellow
// 微信支付 
.payLine
  height 60px
.wxIcon
  flex 0 0 75px
  background url('../../../static/wechat_c.png') no-repeat
  background-size 50px 50px
  background-position 20px center
.payText
  flex 1 1 auto
  padding-left 10px
.payCheck
  background url('../../../static/check.png') no-repeat
  background-size 30px 30px
  background-position 20px center
  flex 0 0 60px
// 会员卡支付
.item
  padding 10px 0 10px 
.imgBox
  flex 0 0 80px
  height 50px
  background url('http://yjyf.evideo.net.cn/wechat_order_service/static/img/pink.a1e7c1c.png') no-repeat
  background-size 80px 50px
  border-radius 5px
  text-align center
  line-height 50px
  color #ffffff
  font-size 14px10px
.realImg
  width 80px
  height 50px
.content
  flex 1 1 auto
  padding-left 14px
  padding-right 25px
.content div
  white-space nowrap
.choose
  flex 0 0 30px
  height 50px
  background url('../../../static/unCheck.png') no-repeat
  background-size 30px 30px
  background-position center center
.choose.active
  background url('../../../static/check.png') no-repeat
  background-size 30px 30px
  background-position center center
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
// 会员支付 弹窗
.popMask
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 10
  background rgba(7,17,27,.6)
.popBox
  position absolute
  top 50%
  left 50%
  transform translate3d(-50%, -78%, 0)
  width 300px
  border-radius 6px
  overflow hidden
.header
  border-bottom 1px solid #f0f0f0
.footer
  border-top 1px solid #f0f0f0
.cancel
  flex 0 0 50%
  border-right 1px solid #f0f0f0
.comfirm
  flex 0 0 50%
  color $success
.input
  flex 1 1 auto
  border 1px solid #ccc
  padding 0 10px
  line-height 30px
  border-radius 4px
.sendMessage
  flex 0 0 88px
  margin-left 14px
  text-align center
  background $success
  color white
  line-height 30px
  border-radius 4px
</style>