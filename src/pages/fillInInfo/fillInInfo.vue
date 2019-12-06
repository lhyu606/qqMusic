<template>
<div class="contain">
  <div class="pt20"></div>
  <div class="plr10 bgBrown lh50 colYellow fs14">
    <div class="line flexlr">
      <div class="left1">姓名</div>
      <div class="middle">
        <input type="text" v-model="userInfo.nickName" placeholder="请输入您的姓名">
      </div>
    </div>
    <div class="borderT1"></div>
    <div class="line flexlr">
      <div class="left1">性别</div>
      <div class="middle">
        <span @click="checkGender(1)"><span class="radio" :class="{active: userInfo.gender != 2}"></span>男</span>
        <span @click="checkGender(2)" class="pl10"><span class="radio" :class="{active: userInfo.gender == 2}" ></span>女</span>
      </div>
    </div>
    <div class="borderT1"></div>
    <div class="line flexlr">
      <div class="left1">生日</div>
      <div class="middle">
        <picker mode="date" :value="userInfo.birthday" :start="startDate" :end="endDate" @change="dateChange">
          {{userInfo.birthday}}
        </picker>
      </div>
    </div>
    <div class="borderT1"></div>
    <div class="line flexlr">
      <div class="left1">推荐人</div>
      <div class="middle">
        <input type="text" :value="userInfo.recommend" placeholder="请输入推荐人(可不填)" class="recommend" disabled>
      </div>
      <div class="right1" @click="getRecommend">
        <div class="scan"></div>
      </div>
    </div>
  </div>
  <!--  -->
  <div class="pt20"></div>
  <div class="plr10 bgBrown lh50 colYellow fs14">
    <div class="line flexlr">
      <div class="left1">手机</div>
      <div class="middle">
        <input type="text" v-model="phone" placeholder="请输入手机号" class="tel">
      </div>
    </div>
    <div class="borderT1"></div>
    <div class="line flexlr">
      <div class="left2">图形验证码</div>
      <div class="middle">
        <input type="text" v-model="picWord" class="middle-input" placeholder="请输入验证码" placeholder-class="placeholder">
      </div>
      <div class="right2">
        <img class="picWord" :src="picWordSrc" @click="chagePicWord">
      </div>
    </div>
    <div class="borderT1"></div>
    <div class="line flexlr">
      <div class="left2">手机验证码</div>
      <div class="middle">
        <input type="text" v-model="volidCode" class="middle-input" placeholder="请输入验证码" placeholder-class="placeholder">
      </div>
      <div class="right2">
        <div class="getVolidCode" v-show="cutDown==0 || cutDown==60" @click="sendCode">发送验证码</div>
        <div class="getVolidCode" v-show="cutDown>0 && cutDown<60">{{cutDown}} 秒</div>
      </div>
    </div>
  </div>
  <!-- 申请会员须知 -->
  <div class="agreeContract" v-show="agreeContract===1" @click="toggleAgree">
    <span class="agreeContract-agree" :class="{active: agreed===1}"></span>
    <span>我已阅读并同意</span><span class="agreeContract-link" @click.stop="openContract">申请会员须知</span>
  </div>
    <!-- 须知 内容 -->
  <div class="contractContent" v-show="showContract" @click="closeContract">
      <scroll-view scroll-y="true" class="contractText" :class="{showUp: showUp}">
        <div class="a" v-html="agreeContractContent"></div>
      </scroll-view>
  </div>
  <!-- 申请会员须知 -->
  <div class="fillInInf-button" @click="toPayCard">提交申请</div>
</div>
</template>
<script>
import Vue from 'vue'
import util from '@/utils/index'
export default {
  data () {
    return {
      ip: '',
      userInfo: {},
      phone: '',
      picWordSrc: this.$store.state.ip + '/yjmemberserver/verifyCode/create?random=',
      picWord: '',
      volidCode: '',
      cutDown: 60,

      agreeContract: 1,
      agreeContractContent: '',
      agreed: 0,
      showContract: false,
      showUp: false,    // 升起动画
      startDate: '',
      endDate: ''
    }
  },

  components: {

  },

  computed: {
    wxUserInfo () {
      return this.$store.state.wxUserInfo
    },
    applyCard () {
      return this.$store.state.applyCard
    },
    headShopNo () {
      return this.$store.state.headShopNo
    },
    clouduserid () {
      return this.$store.state.clouduserid
    },
    companyAndRoom () {
      return this.$store.state.companyAndRoom
    },
    tel () {
      return  this.$store.state.tel
    }
  },
  watch: {
    cutDown () {
      if (this.cutDown <= 0) {
        this.chagePicWord()
        this.picWord = ''
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
    sendCode () {
      // 发送 手机验证码
      if (!(/^\d{11}$/.test(this.phone))) {
          wx.showToast({
            title: '请输入正确的手机号码',
            icon: 'none',
            duration: 2000
          })
          return
      }
      if (this.picWord === '') {
        wx.showToast({
          title: '请输入图形验证码',
          icon: 'none',
          duration: 2000
        })
        return
      }

      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/system/send/validation_code',
        data: {
          shopno: this.companyAndRoom.CompanyID,
          mobile: this.phone
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          // todo
          if (res.data.ret != 0) {
            wx.showToast({
              title: '验证码发送成功',
              icon: 'none',
              duration: 2000
            })
            // 倒计时
            that.cutDown = 60
            let interval = setInterval(() => {
              that.cutDown--
              if (that.cutDown == 0) {
                clearInterval(interval)
                interval = null
              }
            }, 1000)
          } else {
            wx.showToast({
              title: '验证码发送失败',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail (res) {
          wx.showToast({
            title: '验证码发送失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    toPayCard () {
      this.toRegister()
      return false
      // 确认 提交 支付
      if (this.userInfo.nickName === '') {
        wx.showToast({
          title: '请输入姓名',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.userInfo.birthday === '') {
        wx.showToast({
          title: '请选择出生年月日',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (!(/^\d{11}$/.test(this.phone))) {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.picWord === '') {
        wx.showToast({
          title: '请输入图形验证码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.volidCode === '') {
        wx.showToast({
          title: '请输入手机验证码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.agreeContract === 1 && this.agreed === 0) {
        wx.showToast({
          title: '请同意申请会员须知',
          icon: 'none',
          duration: 2000
        })
        return
      }
      console.log('确认提交')
      // 校验 图形码
      this.checkPicWord()
    },
    checkPicWord () {
      // 校验 图形码
      let that = this
      let data = {
        code: this.picWord
      }
      util.wXrequest({
        url: this.$store.state.ip + '/wechat_member/index.php/public/check_verify',
        data: util.emulateJSON(data),
        success(res) {
          if (res.data.ret == 0) {
            // 图形验证码 校验成功 注册 会员
            that.toRegister()
          } else {
            wx.showToast({
              title: '图形验证码校验失败',
              icon: 'none',
              duration: 2000
            })
            that.chagePicWord()
            that.picWord = ''
            that.volidCode = ''
          }
        }
      })
    },
    toRegister () {
      // 注册会员
      let data = {
        clouduserid: this.clouduserid,
        membername: this.userInfo.nickName,
        sex: 0,
        birthday: this.userInfo.birthday,
        mobile: this.phone,
        gradeid: this.applyCard.gradeid,
        ordertype: 1,
        shopno: this.companyAndRoom.CompanyID,
        totalmoney: 0,
        cashmoney: 0,
        presentmoney: 0,
        ruleid: 0,
        ip: this.ip,
        headShopNo: this.headShopNo,
        cardNum: this.userInfo.recommend
      }
      // 处理 价格
      if (this.applyCard.choicePrice === -1) {
        data.price = this.applyCard.sellmoney
      } else {
        let price = this.applyCard.rule[this.applyCard.choicePrice].cashchangemoney
        data.price = price
        data.cashmoney = price
        data.presentmoney = this.applyCard.rule[this.applyCard.choicePrice].presentmoney
      }
      // 男女 性别 转换 
      // 微信 0 未知 1 男 2 女
      // 娱加 0 男 1 女 默认 男
      let gender = 0
      if (this.userInfo.gender == 2) {
        gender = 1
      }
      data.sex = gender
      // 注册 开始
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/member/register',
        data: data,
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          //  获取 ip  成功
          if (res.data.ret == 0) {
            // 此处有 订单 概念
          } else {
            // 失败
            console.log(res)
          }
        }
      })
    },
    getRecommend () {
      // 扫码 获取 推荐人 卡号
      let that = this
      wx.scanCode({
        success (res) {
          // 推荐人 二维码 示例
          // http://yjyf.evideo.net.cn/wechat_order_service/index.php/public/getScanInfo?id=1&url=http://yjyf.evideo.net.cn/wechat_member/#addCard?shopNo=38&weChatId=undefined&isonline=0&reference=440055ecd3374477a6821cf90a3e918e
          let result = res.result
          result = decodeURIComponent(result)
          if (result.indexOf('reference') > 0) {
            result = result.split('?')[2]
            result = result.split('&')[3]
            result = result.split('=')[1]
            that.getCardNum(result)
          } else {
            wx.showToast({
              title: '请扫推荐人二维码',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail (res) {
          console.log("唤起扫码失败了....")
        }
      })
    },
    getCardNum (ecardid) {
      // 通过 推荐人 Ecardid 获取推荐人 卡号
      if (Object.prototype.toString.call(ecardid).slice(8, -1) !== 'String') {
        wx.showToast({
          title: '获取推荐人卡号失败',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      if (ecardid == '') {
        wx.showToast({
          title: '获取推荐人卡号失败',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      // 请求 推荐人卡信息
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/member/info',
        data: {
          ecardid: ecardid
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          //  获取 推荐人卡信息  成功
          if (res.data.ret == 0) {
            if (res.data.data && res.data.data.cardnum) {
              that.userInfo.recommend = res.data.data.cardnum
            } else {
              wx.showToast({
                title: '获取推荐人卡号失败',
                icon: 'none',
                duration: 2000
              })
            }
          } else {
            wx.showToast({
              title: '获取推荐人卡号失败',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    },
    checkGender (gender) {
      // 切换性别
      this.userInfo.gender = gender
    },
    dateChange (e) {
      // 生日 变化
      this.userInfo.birthday = e.mp.detail.value
    },
    chagePicWord () {
      // 更新 图形验证码
      this.verifySrc = this.verifySrc.substring(0, this.verifySrc.indexOf('?random=')) + '?random=' + this.getTimestemp()
    },
    initAgreeContract () {
        // 初始化 申请会员须知
        this.agreeContract = this.applyCard.isContract === 1 ? 0 : 1

        this.agreeContractContent = this.applyCard.contract
        if (this.agreeContractContent) {
          this.agreeContractContent  = this.agreeContractContent.replace(/&amp;quot;/g, '\'')
          this.agreeContractContent  = this.agreeContractContent.replace(/&quot;/g, '"')
        }
        if (!this.agreeContractContent) {
            this.agreeContractContent = '<p style="text-align:center;">暂未设置申请会员须知</p>'
        }
    },
    toggleAgree () {
        // 切换同意 申请须知
        this.agreed = this.agreed === 1 ? 0 : 1
    },
    openContract () {
        // 打开查看 申请须知
        this.showUp = true
        this.showContract = true
        this.agreed = 1
    },
    closeContract () {
        // 关闭查看 申请须知
        let timer = setTimeout(() => {
          this.showContract = false
          clearTimeout(timer)
          timer = null
        }, 400)
        
        this.showUp = false
    }
  },
  created () {
    console.log('page--------填写信息begin')
  },
  mounted () {
    console.log('mounted--------填写信息begin')
    this.getIP()
    this.phone = this.tel
    this.userInfo = this.wxUserInfo
    console.log(this.userInfo)
    Vue.set(this.userInfo, 'birthday', '1990-01-01')
    Vue.set(this.userInfo, 'recommend', '')
    this.initAgreeContract()
    // 设置 日期 组件 开始 结束 时间
    let date = new Date()
    this.startDate = date.getFullYear() - 100 + '-01-01'
    this.endDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
.borderT1
  border-top 1px solid rgba(0,0,0,.1)
.left1
  flex 0 0 45px
  margin-right 10px
  text-align-last justify
.middle
  flex 1 1 auto
.right1
  flex 0 0 30px
.scan
  width 30px
  height 50px
  background url('../../../static/qrButton.png') no-repeat center center 
  background-size 30px 30px
.radio
  display inline-block
  width 18px
  height 100%
  margin 0 4px
  vertical-align middle
  background url('../../../static/unCheck.png') no-repeat center center
  background-size 18px 18px
.radio.active
  background url('../../../static/check.png') no-repeat center center
  background-size 18px 18px
input
  height 50px
  line-height 50px
.left2
  flex 0 0 75px
  margin-right 10px
  text-align-last justify
.right2
  flex 0 0 100px
.picWord
  width 100px 
  height 40px
  vertical-align middle
  background #fff
.getVolidCode
  color #fff
  width 100px
  height 40px
  border-radius 4px
  background $yellow
  text-align center
  line-height 40px
  margin-top 5px
.placeholder
  color $yellow
  opacity 0.5
// 会员申请须知
.agreeContract
  font-size 14px
  padding 4px 10px
  text-align right
  color #cea16a
  background #201c19
  span
    vertical-align middle
.agreeContract-agree
  display inline-block
  width 20px
  height 20px
  transition all .3s
  background url('../../../static/unCheck.png') no-repeat center center
  background-size 14px 14px
  &.active
    background url('../../../static/check.png') no-repeat center center
    background-size 14px 14px
.agreeContract-link
  color #ff5c6c
.fillInInf-button
  margin: 30px auto
  width: 85%
  border-radius: 5px
  height: 50px
  background: #cea16a
  color: #fff
  font-size: 16px
  line-height: 50px
  text-align: center
.contractContent
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 10
  background rgba(0,0,0,.5)
  transition all 0.9s linear
.contractText
  position absolute
  left 0
  right 0
  bottom 0
  padding 15px 10px 20px
  font-size 14px
  height auto
  max-height 80%
  overflow hidden
  background #fff
  box-sizing border-box
  transition all 0.4s linear
  transform translate3d(0, 100%, 0)
.contractText.showUp
  transform translate3d(0, 0, 0)
</style>