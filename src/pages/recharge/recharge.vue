<template>
  <div class="contain">
    <div class="pt20"></div>
    <div class="noRecharge text-c colWhite" v-if="rechargeList.length==0">
      <div class="nothingPic">
        <img src="../../../static/nothingPic.png" class="nothingImg">
      </div>
      <div class="nothingText fs14 lh40">暂时无法充值</div>
    </div>
    <div class="header fs16 lh50 plr10 bgBrown colYellow" v-if="rechargeList.length>0">
      请选择充值金额
    </div>
    <div class="box bgBrown" v-if="rechargeList.length>0">
      <div class="item fs12 text-c" 
        v-for="(item, index) in fixedRechargeList" 
        :key="item.ruleid" 
        :class="{checked: choiceIndex==index}"
        @click="checkRule(index)">
        <div class="checkIcon" v-show="choiceIndex==index"></div>
        <div class="money">{{item.cashchangemoney1}}元</div>
        <div class="send">赠送:{{item.presentmoney}}元</div>
      </div>
      <div class="item fs12 text-c free" 
        :class="{checked: choiceIndex==-1}"
        @click="checkRule(-1)">
        <div class="checkIcon" v-show="choiceIndex==-1"></div>
        <div class="flexlr lh40">
          <input type="number" v-model="rechargeNumber" class="rechargeNumber"><span class="unit">元</span>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="recharge-bottom lh20 colYellow plr10" v-show="rechargeList.length>0 && choiceIndex==-1">
      <div class="FreeTitle">充值优惠规则</div>
      <div class="freeItem" v-for="(item,index) in freeRechargeList" v-show="-1==choiceIndex && rechargeList.length!==0" :key="item.ruleid">
        充{{item.cashchangemoney1}}-{{item.cashchangemoney2}}元，赠送{{item.presentratio}}%充值金额
      </div>
    </div>
    <!--  -->
    <div class="comfirm" @click="rechargeReady">确定</div>
  </div>
</template>
<script>
import util from '@/utils/index'
export default {
  data () {
    return {
      ip: '',
      rechargeList: [],
      fixedRechargeList: [],
      freeRechargeList: [],
      rechargeNumber: 0,
      choiceIndex: 0
    }
  },

  components: {

  },

  computed: {
    ecard () {
      return this.$store.state.ecard
    },
    companyAndRoom () {
      return this.$store.state.companyAndRoom
    }
  },
  watch: {
    rechargeNumber () {
      // 数字 位数 不超过 6 位
      if (this.rechargeNumber.length > 6) {
        this.rechargeNumber = this.rechargeNumber.slice(0, 6)
      }
    }
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
    getRechargeRules () {
      // 获取 充值 规则
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/member/recharge/rule',
        data: {
          gradeid: this.ecard.gradeid,
          shopno: this.ecard.companyid
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.ret == 0) {
            // 返回码是 0
            that.rechargeList = res.data.data
            that.fixedRechargeList = []
            that.freeRechargeList = []
            res.data.data.forEach((item, index) => {
              if (item.ruletype == 2) {
                // 确切充值方案
                that.fixedRechargeList.push(item)
              }
              if (item.ruletype == 2) {
              // } else if (item.ruletype == 1) {
                that.freeRechargeList.push(item)
              }
            })
          } else {
            console.log('返回码 不是 0')
            if (res.data.msg != '') {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }
        }
      })
    },
    rechargeReady () {
      // 准备充值
      let ruleid = ''
      let cashmoney = 0
      let presentmoney = 0
      if (this.choiceIndex === -1) {
        // 数值 充值
        if (this.rechargeNumber === '') {
          wx.showToast({
            title: '请输入正确的金额',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if (this.rechargeNumber <= 0) {
          wx.showToast({
            title: '请输入正确的金额',
            icon: 'none',
            duration: 2000
          })
          return
        }
        let min = this.freeRechargeList[0].cashchangemoney1
        this.freeRechargeList.forEach(item => {
          if (min > item.cashchangemoney1) {
            min = item.cashchangemoney1
          }
          if (item.cashchangemoney1 <= this.rechargeNumber && this.rechargeNumber <= item.cashchangemoney2) {
            cashmoney = this.rechargeNumber
          }
          if (this.rechargeNumber > item.cashchangemoney2) {
            cashmoney = this.rechargeNumber
          }
        })
        if (this.rechargeNumber < min) {
          wx.showToast({
            title: '至少输入规则中的最低金额',
            icon: 'none',
            duration: 2000
          })
          return
        }
        ruleid = 0
      }
      if (this.choiceIndex !== -1) {
        ruleid = this.fixedRechargeList[this.choiceIndex].ruleid
        cashmoney = this.fixedRechargeList[this.choiceIndex].cashchangemoney1
        presentmoney = this.fixedRechargeList[this.choiceIndex].presentmoney
      }
      this.comfirmRecharge(ruleid, cashmoney, presentmoney)
    },
    comfirmRecharge (ruleid, cashmoney, presentmoney) {
      // 确认充值 
      let that = this
      // userType 用户类型 0 微信公众好用户 1 小程序用户
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/member/recharge',
        data: {
          ecardid: this.ecard.ecardid,
          ordertype: 2,
          ruleid: ruleid,
          cashmoney: cashmoney,
          presentmoney: presentmoney,
          shopno: this.ecard.companyid,
          ip: this.ip,
          kmnotifyurl: this.$store.state.ip + '/wechat_member/#/cardDetail?ecardid=' + this.ecard.ecardid + '&clouduserid=' + this.$store.state.clouduserid + '&shopNo=' + this.ecard.companyid ,
          merchanturl: util.getCurrentPageUrl(),
          userType: 1
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.ret == 0) {
            // 返回码是 0
            if (res.data && res.data.data && res.data.data.result && res.data.data.result.paypackage) {
              that.callUpWxPay(res.data.data.result.paypackage)
            }
          } else {
            console.log('返回码 不是 0')
            if (res.data.msg != '') {
              wx.showToast({
                title: res.data.msg || '充值失败',
                icon: 'none',
                duration: 2000
              })
            }
          }
        }
      })
      console.log(ruleid, cashmoney, presentmoney)
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
          console.log('充值成功')
          wx.showToast({
            title: '充值成功',
            icon: 'success',
            duration: 2000
          })
          // 去 商品 页
          wx.reLaunch({
            url: '/pages/good/main'
          })
        },
        fail: function(res){
          console.log('充值失败')
          wx.showToast({
            title: '充值失败',
            icon: 'cancel',
            duration: 2000
          })
        }
      }) 
    },
    checkRule (index) {
      // 切换 充值 方式
      console.log(index)
      this.choiceIndex = index
    }
  },
  created () {
    console.log('page--------充值begin')
  },
  mounted () {
    console.log('mounted--------充值begin')
    this.getIP()
    this.getRechargeRules()
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
.contain
  font-size 14px
.nothingImg
  width 190px
  height 190px
.box
  border-top 0.5px solid rgba(0,0,0,0.1)
  padding 0 0 10px 10px
.item
  display inline-block
  width 110px
  background white
  border-radius 5px
  position relative
  height 50px
  padding 5px 0
  margin-right 10px
  line-height 20px
  color rgba(0,0,0,0.4)
  margin-top 10px
  overflow hidden
  transition all 0.2s linear
.item.checked
  color $yellow
.free
  line-height 40px
.checkIcon
  position absolute
  top 0
  right 0
  width 25px
  height 25px
  background url('../../../static/recharge_check.png') no-repeat
  background-size 25px 25px
  background-position center center
.rechargeNumber
  flex 1 1 auto
  height 40px
  line-height 40px
  font-size 16px
.unit
  flex 0 0 15px
  height 40px
  margin-right 15px
  line-height 40px
  font-size 16px
.freeItem
  text-indent 2em
.comfirm
  width: 90%
  height: 45px
  background: #cea16a
  margin: 30px auto 0
  left: 0
  right: 0
  border-radius: 5px
  text-align: center
  line-height: 45px
  color: #fff
  font-size: 16px
</style>