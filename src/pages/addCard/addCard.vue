<template>
  <div class="contain">
    <div class="flextb wraper">
      <div class="tabs-box">
        <!-- 中间线 -->
        <div class="centerline"></div>
        <div class="bottomline" :class="{left: tabIndex==0, right: tabIndex==1}"></div>
        <div class="tabs flexlr">
          <div class="tab" @click="checkTab(0)">
            绑定实体卡
          </div>
          <div class="tab" @click="checkTab(1)">
            申请会员卡
          </div>
        </div>
      </div>
      <!-- 绑定电子会员卡 -->
      <div class="tab-contain" v-if="tabIndex==0">
        <div class="pt20"></div>
        <div class="mobile-box lh50 plr10">
          <div class="mobile-contain">
            <input class="mobile" type="number" v-model="mobile" placeholder="请输入您的会员卡号或手机号"></input>
          </div>
        </div>
        <div class="comfirm" @click="toSearchCard">确定</div>
      </div>
      <!-- 新建 -->
      <div class="tab-contain" v-if="tabIndex==1">
        <div class="companyName plr10">
          请选择会员卡
          <span v-if="applyCardListNew.length>0"> ( {{applyCardListNew[0].companyname}} )</span>
        </div>
        <scroll-view scroll-y="true" class="cardList">
          <div class="applyCard-list-item-wrapper" 
            v-for="(itemOut,indexOut) in applyCardListNew" 
            v-if="itemOut.isOnlineBuy == 0 || itemOut.rule"
            :key="indexOut">
            <div class="applyCard-list-item">
                <div class="applyCard-list-item-top">
                    <div class="applyCard-list-item-top-check" @click="choiceIndex(indexOut)" :class="{active:indexCard==indexOut}"></div>
                    <div class="applyCard-list-item-top-card">
                        <img :src="itemOut.cardlogourl" v-show="itemOut.cardlogourl!==''">
                        <img src="http://yjyf.evideo.net.cn/wechat_member/static/img/defaultCard.f77d83a.png" v-show="itemOut.cardlogourl===''">
                    </div>
                    <div class="applyCard-list-item-top-name">{{itemOut.gradename}}</div>
                    <div class="applyCard-list-item-top-price" v-if="itemOut.choicePrice==-1">￥{{itemOut.sellmoney}}</div>
                    <div class="applyCard-list-item-top-price" v-if="itemOut.choicePrice!=-1">￥{{itemOut.rule[itemOut.choicePrice].cashchangemoney}}</div>
                </div>
                <div class="applyCard-list-item-mid">
                    <div class="applyCard-list-item-mid-left"></div>
                    <div class="applyCard-list-item-mid-right">
                        <div class="applyCard-list-item-mid-right-wrapper">
                            <div class="recharge-top-down-wrapper-item" v-if="itemOut.isOnlineBuy == 0">
                                <div class="recharge-top-down-wrapper-item-in" @click="choiceItem(-1,itemOut,indexOut)" :class="{choiceout:-1==itemOut.choicePrice}">
                                      <div class="recharge-top-down-wrapper-item-in-icon" v-if="-1==itemOut.choicePrice"></div>
                                      <div class="recharge-top-down-wrapper-item-in-number" :class="{choicein:-1==itemOut.choicePrice}">
                                          <span class="recharge-top-down-wrapper-item-in-number-item">{{itemOut.sellmoney}}元购卡</span>
                                      </div>
                                  </div>
                              </div>
                              <div class="recharge-top-down-wrapper-item" v-for="(item,index) in itemOut.rule" :key="index">
                                  <div class="recharge-top-down-wrapper-item-in" @click="choiceItem(index,itemOut,indexOut)" :class="{choiceout:index==itemOut.choicePrice}">
                                  <div class="recharge-top-down-wrapper-item-in-icon" v-if="index==itemOut.choicePrice"></div>
                                  <div class="recharge-top-down-wrapper-item-in-number" :class="{choicein:index==itemOut.choicePrice}">
                                      <span class="recharge-top-down-wrapper-item-in-number-item">{{item.rulename}}</span>
                                  </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="applyCard-list-item-bottom">
                      <div class="applyCard-list-item-bottom-left">
                      </div>
                      <div class="applyCard-list-item-bottom-right">
                          <div class="applyCard-list-item-bottom-right-div"></div>
                          <div class="applyCard-list-item-bottom-right-item">
                              <div class="applyCard-list-item-bottom-right-item-icon-word1"></div>
                              <div class="applyCard-list-item-bottom-right-item-word1">{{itemOut.word}}</div>
                          </div>
                          <div class="applyCard-list-item-bottom-right-detail-wrapper">
                              <div class="applyCard-list-item-bottom-right-detail" @click="toPrivilegeDetail(indexOut)">详情></div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="applyCard-list-item-padding"></div>
          </div>
        </scroll-view>
        <div class="nextStep">
          <button class="nextBottom" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">下一步</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import util from '@/utils/index'
export default {
  data () {
    return {
      mobile: '',
      tabIndex: 1,
      indexCard: 0,
      applyCardListNew: []
    }
  },

  components: {

  },

  computed: {
    companyAndRoom () {
      return this.$store.state.companyAndRoom
    },
    tel () {
      return this.$store.state.tel
    }
  },
  watch: {

  },
  methods: {
    getLevelList () {
      // 获取会员等级列表
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/member/level/list',
        data: {
          shopno: this.companyAndRoom.CompanyID
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.ret == 0) {
            // 返回码是 0
            that.applyCardListNew = res.data.data
              that.applyCardListNew.forEach(item => {
                Vue.set(item, 'choicePrice', -1)
                let word = ''
                if (item.pricetypeid === 0) {
                  word = word + '享超市价'
                }
                if (item.pricetypeid === 1) {
                  word = word + '享卡台价'
                }
                if (item.pricetypeid === 3) {
                  word = word + '享会员价'
                }
                if (item.pricetypeid === 4) {
                  word = word + '享贵宾价'
                }
                if (item.pricetypeid === 5) {
                  word = word + '享A类价'
                }
                if (item.pricetypeid === 6) {
                  word = word + '享B类价'
                }
                if (item.usestorage === 0) {
                  if (word !== '') {
                    word = word + '、可储值'
                  }
                  if (word === '') {
                    word = word + '可储值'
                  }
                }
                if (item.useintegral === 0) {
                  if (word !== '') {
                    word = word + '、可积分'
                  }
                  if (word === '') {
                    word = word + '可积分'
                  }
                }
                Vue.set(item, 'word', word)
              })
              // if (that.applyCardListNew[that.indexCard]) {
              //     Vue.set(that.applyCardListNew[that.indexCard], 'choicePrice', that.$store.state.indexCheck)
              // }
              // if (that.applyCardListNew.length == 0) {
              //     that.$store.dispatch('setCurrentAddCardPage', 0)
              // }
              that.$nextTick(() => {
                // 如果第一张卡 没有xx元购卡，需要自动选中第一个选项
                let card = that.applyCardListNew[that.indexCard]
                if (card.isOnlineBuy == 1) {
                    that.choiceItem(0, card, that.indexCard)
                }
              })
              console.log(that.applyCardListNew)
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
    checkTab (index) {
      // 切换 方式
      this.tabIndex = index
      console.log(this.tabIndex)
    },
    choiceItem (index, itemOut, indexOut) {
      // 选 购卡方案
      Vue.set(this.applyCardListNew[indexOut], 'choicePrice', '' + index)
      this.indexCard = indexOut
    },
    choiceIndex (index) {
        // 如果该卡 没有xx元购卡，需要自动选中第一个选项
        let card = this.applyCardListNew[index]
        if (card.isOnlineBuy == 1 && card.choicePrice == -1) {
            this.choiceItem(0, card, index)
        }
      this.indexCard = index
    },
    toFillIn () {
      //  去填信息 建卡
      this.$store.commit('setApplyCard', this.applyCardListNew[this.indexCard])
      console.log(this.applyCardListNew[this.indexCard])
      wx.navigateTo({
        url: '/pages/fillInInfo/main'
      })
    },
    toPrivilegeDetail (index) {
      // 去 查看 会员卡 权限详情
      this.$store.commit('setApplyCard', this.applyCardListNew[index])
      wx.navigateTo({
        url: '/pages/privilegeDetail/main'
      })
    },
    toSearchCard () {
      // 绑定 实体卡
      // if (!(/^\d{11}$/.test(this.mobile))) {
      if (this.mobile == ''){
        wx.showToast({
          title: '请填写正确的手机号或者卡号进行绑卡',
          icon: 'none',
          duration: 2000
        })
      }
      // 获取未绑卡会员列表
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/member/list/unbind',
        data: {
          shopno: this.companyAndRoom.CompanyID,
          mobile: this.mobile
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          //  获取 获取未绑卡会员列表  成功
          if (res.data.ret == 0) {
            if (res.data.list.length === 0) {
              wx.showToast({
                title: '抱歉!在当前门店没有找到可以进行绑卡的会员卡',
                icon: 'none',
                duration: 2000
              })
              return false
            }
            // 存储 未绑定 卡 列表
            that.$store.commit('setUnbindList', res.data.list)
            wx.navigateTo({
              url: '/pages/fillInPicWord/main'
            })
          } else {
            // 获取未绑卡会员列表
            console.log(res)
          }
        }
      })
    },
    bindGetUserInfo (res) {
      // 获取微信用户信息
      console.log(res)
      if (res.mp.detail.errMsg == 'getUserInfo:ok') {
        // 正常 授权
        this.$store.commit('setWxUserInfo', res.mp.detail.userInfo)
        console.log(this.$store.state.wxUserInfo)
      } else {
        // 拒绝 授权
        this.$store.commit('setWxUserInfo', {})
        console.log(this.$store.state.wxUserInfo)
      }
      this.toFillIn()
    }
  },
  created () {
    console.log('page--------添加会员卡begin')
  },
  mounted () {
    console.log('mounted--------添加会员卡begin')
    this.getLevelList()
    this.mobile = this.tel
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
.wraper
  height 100%
  width 100%
  overflow hidden
// tab
.tabs-box
  flex 0 0 44px
  line-height 44px
  position relative
  background $brown
  text-align center
  color $yellow
.centerline
  position absolute
  top 50%
  left 50%
  height 28px
  width 1px
  background rgba(0,0,0,.1)
  transform translate3d(-50%, -50%, 0)
.bottomline
  position absolute
  bottom 0
  left 50%
  width 35%
  height 4px
  border-radius 2px
  background $yellow
  transition all 0.3s cubic-bezier(0.270, 0.685, 0.325, 0.735)
.bottomline.left
  transform translate3d(-125%, 0, 0)
.bottomline.right
  transform translate3d(25%, 0, 0)
.tabs
  position relative
.tab
  flex 0 0 50%
  height 45px
  position relative
// 内容
.tab-contain
  flex 1 1 auto
  position relative
  display flex
  flex-direction column
// tab0
.mobile-box
  background-color #fff
.mobile-contain
  height 50px
  padding-left 25px
  background url('../../../static/phone.png') no-repeat
  background-size 20px 20px
  background-position left center
.mobile
  height 50px
  padding-left 10px
  font-size 14px
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
//  tab 1
.companyName
  flex 0 0 35px
  line-height 35px
  color $yellow
  font-size 14px
.nextStep
  position absolute
  bottom 0
  left 0
  right 0
  height 70px
.nextBottom
  background: $brown
  width: 80%
  height: 45px
  line-height: 45px
  text-align: center
  margin: 14px auto 0
  border-radius: 5px
  color: $yellow
  font-size: 16px
.cardList
  position absolute
  top 35px
  left 0
  right 0
  bottom 70px
  overflow hidden
.applyCard-list-item-wrapper
    .applyCard-list-item
        width 100%
        background #423c31
        color #cea16a
        .applyCard-list-item-top
            width 100%
            padding 10px
            font-size 0
            .applyCard-list-item-top-check
                margin-top 15px
                display inline-block
                vertical-align top
                height 20px
                width 20px
                background-image: url("../../../static/uncheck.png")
                background-size: 20px 20px
                background-repeat: no-repeat
                &.active
                    background-image: url("../../../static/check.png")
            .applyCard-list-item-top-card
                display inline-block
                vertical-align top
                height 50px
                width 70px
                margin-left 10px
                img
                    border-radius 5px
                    width 70px
                    height 50px
            .applyCard-list-item-top-name
                display inline-block
                vertical-align top
                font-size 15px
                margin-left 10px
                margin-top 15px
            .applyCard-list-item-top-price
                margin-top 15px
                margin-right 5px
                display inline-block
                vertical-align top
                float right
                font-size 15px
                color #cea16a
        .applyCard-list-item-mid
            display flex
            width 100%
            .applyCard-list-item-mid-left
                flex 0 0 40px
            .applyCard-list-item-mid-right
                flex 1
                .applyCard-list-item-mid-right-wrapper
                    width 100%
                    display flex
                    flex-flow row wrap
                    justify-content flex-start
                    align-content flex-start
                    .recharge-top-down-wrapper-item
                        flex 0 0 33.3%
                        height 30px
                        position relative
                        margin-bottom 10px
                        .recharge-top-down-wrapper-item-in
                            position absolute
                            height 30px
                            line-height 30px
                            left 0
                            right 5px
                            background #423c31
                            border-radius 3px
                            border 1px solid rgba(0,0,0,.3)
                            &.choiceout
                                border 1px solid #cea16a
                            .recharge-top-down-wrapper-item-in-icon
                                position absolute
                                right 0
                                top 0
                                display inline-block
                                vertical-align top
                                height 15px
                                width 15px
                                background-image: url("../../../static/recharge_check.png")
                                background-size: 15px 15px
                                background-repeat: no-repeat
                            .recharge-top-down-wrapper-item-in-number
                                text-align center
                                font-size 0
                                .recharge-top-down-wrapper-item-in-number-item
                                    font-size 10px
                                &.choicein
                                    color #cea16a
        .applyCard-list-item-bottom
            display flex
            width 100%
            .applyCard-list-item-bottom-left
                flex 0 0 40px
            .applyCard-list-item-bottom-right
                flex 1
                padding 0 0 10px 0
                position relative
                .applyCard-list-item-bottom-right-div
                    position absolute
                    width 80%
                    height 1px
                    border-top 1px dashed rgba(0,0,0,.1)
                    top -6px
                .applyCard-list-item-bottom-right-detail-wrapper
                    position absolute
                    width 50px
                    height 100%
                    top -6px
                    right 10px
                    .applyCard-list-item-bottom-right-detail
                        color #cea16a
                        display inline-block
                        position: absolute
                        font-size 14px
                        top: 50%
                        transform: translateY(-50%)
                .applyCard-list-item-bottom-right-item
                    position relative
                    .applyCard-list-item-bottom-right-item-icon-word1
                        display inline-block
                        vertical-align top
                        height 15px
                        width 15px
                        background-image: url("../../../static/hongbaoxiao.png")
                        background-size: 15px 15px
                        background-repeat: no-repeat
                        margin-top 3px
                    .applyCard-list-item-bottom-right-item-word1
                        position relative
                        color #cea16a
                        display inline-block
                        vertical-align top
                        font-size 14px
                        margin-left 5px
                    .applyCard-list-item-bottom-right-item-icon-word2
                        display inline-block
                        vertical-align top
                        height 15px
                        width 15px
                        background-image: url("../../../static/hongbaoxiao.png")
                        background-size: 15px 15px
                        background-repeat: no-repeat
                        margin-top 3px
                    .applyCard-list-item-bottom-right-item-word2
                        display inline-block
                        vertical-align top
                        position relative
                        color #cea16a
    .applyCard-list-item-padding
        height 20px
        width 100%
        background #201c19
</style>