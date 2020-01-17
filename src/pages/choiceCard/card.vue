<template>
  <div class="box">
  <div class="contain">
    <!-- 头部 -->
    <div class="notUse">
      <!-- <div class="addCard"> -->
      <!-- <div class="addCard" @click="addCard">
        <div class="addCardText"> </div>
        <div class="addCardText fs16">新增+</div>
        <div class="clear"></div>
      </div> -->
      <div class="top" @click="choiceCard(-1)">
        <div class="text fs14">不使用会员卡</div>
        <div class="icon" :class="{active: !ecard.ecardid}"></div>
      </div>
      <div class="tip fs14" v-if="cards.length > 0">请选择您要使用的会员卡</div>
      <div class="tip" v-if="cards.length === 0">您尚无会员卡可用</div>
    </div>
    <!-- 卡列表 -->
    <scroll-view scroll-y="true" class="cardList">
      <div class="cardContent" v-if="cards.length > 0">
        <div class="pt30"></div>
        <div class="cardItem" v-for="(item, index) in cards" :key="item.ecardid">
          <div class="card" :class="{pink: index%2 == 0, orange: index%2 == 1}">
            <div class="company">
              <img src="../../../static/icon_position.png" class="companyImg">{{item.companyname}}
            </div>
            <div class="memberMsg">
              <div class="grade">{{item.gradename}}</div>
              <div class="cardNum">{{item.cardnum}}</div>
            </div>
            <div class="cardTime">
              <div class="recharge" @click="recharge(index)" v-if="item.hasRechargeDiscountFuntion && item.usestorage == 0">
                充值
              </div>
              <img src="../../../static/icon_time.png" class="timeImg">{{item.uselimitdate}}
            </div>
          </div>
          <div class="icon" :class="{active: item.ecardid == ecard.ecardid}" @click="choiceCard(index)"></div>
        </div>
      </div>
      <div class="addCardButton" @click="addCard">新增会员卡</div>
    </scroll-view>
  </div>
  </div>
</template>
<script>
import util from '@/utils/index'
export default {
  data () {
    return {
      cards: [],
      currentCardIndex: -1
    }
  },

  computed: {
    ecard () {
      return this.$store.state.ecard
    },
    clouduserid () {
      return this.$store.state.clouduserid
    },
    companyAndRoom () {
      return this.$store.state.companyAndRoom
    },
    cartLength () {
      // 购物车 商品数量
      let length = 0
      for (let i=0; i<this.$store.state.cartList.length; i++) {
        length++
      }
      return length
    }
  },

  methods: {
    getCards () {
      // 查询 会员卡
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/member/list/clouduserid', 
        data: {
          clouduserid: this.clouduserid,
          shopno: this.companyAndRoom.CompanyID
        },
        header: {
          'content-type': 'application/json;charset=UTF-8' // 默认值
        },
        success(res) {
          if (res.data.ret === 0){
            that.cards = res.data.list || []
            let i = 0
            that.cards = that.cards.filter(item => {
              return item.uselinemarket === 0
            })
            that.$store.commit('setCards', that.cards)
            that.setCurrentCardIndex()
          } else {
            console.log('返回码不是 0')
            // 去扫描绑定卡台 
          }
        },
        fail (res) {
          console.log(res)
        }
      })
    },
    choiceCard (index) {
      // 选定 会员卡
      // 如果 所选卡 有变
      if (index != this.currentCardIndex) {
        if (index === -1) {
          this.$store.commit('setEcard', {})
        } else if(this.cards[index]) {
          this.$store.commit('setEcard', this.cards[index])
        }
        // 如果购物车 有东西 更新购物车价格
        if (this.cartLength > 0) {
          util.updateCartPrice()
        }
      }
      // 直接返回
      console.log('fanh')
      let timer = setTimeout(() => {
        clearTimeout(timer)
        timer = null
        wx.reLaunch({
          url: '/pages/good/main'
        })
      }, 400)
    },
    setCurrentCardIndex () {
      // 设置当前 会员卡下标
      for (let i=0; i<this.cards.length; i++) {
        if (this.cards[i].ecardid == this.ecard.ecardid) {
          this.currentCardIndex = i
          break
        }
      }
    },
    recharge (index) {
      // 取该卡
      this.$store.commit('setEcard', this.cards[index])
        // 更新购物车价格
        util.updateCartPrice()
      // 充值
      wx.navigateTo({
        url: '/pages/recharge/main'
      })
    },
    addCard () {
      // 新增会员卡
      wx.navigateTo({
        url: '/pages/addCard/main'
      })
    }
  },
  created () {
    console.log('page-----choice_card_page选卡')
  },
  mounted () {
    this.getCards()
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
.box
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  background #201c19
  color #cea16a
.contain
  height 100%
  display flex
  justify-content space-between
  flex-direction column
  box-sizing border-box
.notUse
  padding 0 20px
  flex 0 0 70px
  box-sizing border-box
.addCard
  padding 5px
  font-size 14px
.addCardText
  float right
  opacity 1
.clear
  clear both
.top
  display flex
  justify-content space-between
  height: 40px
  line-height: 40px
  background: #423c31
  font-size: 20px
  color: #cea16a
  padding-left: 10px
.icon
  flex 1 1 auto
  margin 0 10px
  width: 30px
  height: 40px
  background url('../../../static/unCheck.png')
  background-position right center
  background-size: 30px 30px
  background-repeat: no-repeat
.icon.active
  background url('../../../static/check.png')
  background-position right center
  background-size: 30px 30px
  background-repeat: no-repeat
.tip
  height: 30px
  line-height: 30px
  font-size 14px
// 卡列表
.cardList
  flex 1 1 auto
  overflow auto
  color #ffffff
.cardContent
  padding 0 20px
  box-sizing border-box
.pt30
  padding-top 30px
  background #423c31
.cardItem
  display flex
  padding-left 25px
  justify-content space-between
  background #423c31
.cardItem .icon
  height 120px
.card
  display flex
  flex-direction column
  justify-content space-around
  width 260px
  height 120px
  padding 0 10px
  margin-bottom 30px
  box-sizing border-box
.card.pink
  background url('https://yjevideocloud.oss-cn-shenzhen.aliyuncs.com/xcx/pink.png') no-repeat
  background-size 260px 120px
.card.orange
  background url('https://yjevideocloud.oss-cn-shenzhen.aliyuncs.com/xcx/orange.png') no-repeat
  background-size 260px 120px
.company
  text-align right
  font-size 14px
  margin-top 10px
.companyImg
  vertical-align middle
  width 16px
  height 16px
  transform translate(0, -2px)
  margin-right 5px
.memberMsg
  font-size 16px
  line-height 30px
.cardNum
  text-align center
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
.cardTime
  margin-top 4px
  font-size 14px
  line-height 30px
.timeImg
  vertical-align middle
  width 16px
  height 16px
  transform translate(0, -2px)
  margin-right 5px
.recharge
  float right
  padding 0 15px
.addCardButton
  height 50px
  line-height 50px
  color #ffffff
  background $yellow
  margin 30px 20px
  text-align center
  font-size 16px
  border-radius 5px
</style>

<!-- http://yjyf.evideo.net.cn/wechat_order_service/static/img/pink.a1e7c1c.png -->
<!-- http://yjyf.evideo.net.cn/wechat_order_service/static/img/orange.1563f05.png -->