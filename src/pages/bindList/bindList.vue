<template>
  <div class="contain">
    <div class="lh40 bgBrown plr10 fs14 colYellow header">请选择会员卡进行绑卡</div>
    <scroll-view scroll-y="true" class="cardList plr10">
      <div class="bindList-item" 
        v-for="(item,index) in unbindList" 
        @click="toBindCard(item,index)" 
        :class="{purple:item.bg=='purple',gray:item.bg=='gray'}" 
        :key="index">
          <div class="bindList-item-bg" v-show="item.bg=='pic'" :style="{'background': 'url(' + item.cardlogourl + ')'}"></div>
          <div class="cover">
            <div class="bindList-item-card-name">{{item.gradename}}</div>
            <div class="bindList-item-NO">NO:{{item.cardnum}}</div>
            <div class="bindList-item-line"></div>
            <div class="bindList-item-ad">
              <div class="bindList-item-ad-icon"></div>
              <div class="bindList-item-ad-text">
                {{item.companyname}}
              </div>
            </div>
            <div class="bindList-item-data fs14">有效期至:{{item.uselimitdate}}</div>
            <div class="bindList-item-state" v-show="item.banner!=''">{{item.banner}}</div>
          </div>
          
      </div>
      <div class="bindList-wrapper-padding"></div>
    </scroll-view>
  </div>
</template>
<script>
import Vue from 'vue'
import util from '@/utils/index'
export default {
  data () {
    return {

    }
  },

  components: {
  },

  computed: {
    companyAndRoom (){
      return this.$store.state.companyAndRoom
    },
    clouduserid () {
      return this.$store.state.clouduserid
    },
    unbindList () {
      return this.$store.state.unbindList
    }
  },
  watch: {
  },
  methods: {
    toBindCard (card, index) {
      // 绑定 会员卡
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/member/bind',
        data: {
          shopno: card.companyid,
          cardnum: card.cardnum,
          bindsource: 1,
          memberid: card.memberid,
          mobile: card.mobile,
          clouduserid: this.clouduserid,
          bindshopno: this.companyAndRoom.CompanyID,
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          // todo
          if (res.data.ret == 0) {
            wx.showToast({
              title: '绑定会员卡请求已发送',
              icon: 'none',
              duration: 2000
            })
            // 返回 会员卡列表
            wx.reLaunch({
              url: '/pages/choiceCard/main'
            })
          } else {
            wx.showToast({
              title: '绑定会员卡失败',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    },
    initUnbindList () {
      this.unbindList.forEach(item => {
        if (item.status === 0) {
          Vue.set(item, 'bg', 'purple')
          Vue.set(item, 'banner', '')
        }
        if (item.status !== 0) {
          Vue.set(item, 'bg', 'gray')
          if (item.status === 1) {
            Vue.set(item, 'banner', '停用')
          }
          if (item.status === 2) {
            Vue.set(item, 'banner', '挂失')
          }
          if (item.status === 3) {
            Vue.set(item, 'banner', '删除')
          }
          if (item.status > 3) {
            Vue.set(item, 'banner', '未知')
          }
        }
        if (item.cardlogourl) {
          Vue.set(item, 'bg', 'pic')
        }
      })
    }
  },
  created () {
    console.log('page--------绑定会员begin')
  },
  mounted () {
    console.log('mounted--------绑定会员begin')
    console.log(this.unbindList)
    this.initUnbindList()
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
  position absolute
  top 0
  left 0
  right 0
  height 40px
.cardList
  position absolute
  top 40px
  left 0
  right 0
  bottom 10px
  overflow scroll
  padding-top 14px
  box-sizing border-box
.bindList-item
  width 100%
  height 150px
  border-radius 10px
  margin-bottom 10px
  position relative
  overflow hidden
  background-size cover
  .bindList-item-bg
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    z-index 1
    background-size cover
  .cover
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    padding 20px 0 0 20px
    z-index 100
  &.purple
    background url("https://yjevideocloud.oss-cn-shenzhen.aliyuncs.com/xcx/pink.png")
    background-size cover
  &.gray
    background url("https://yjevideocloud.oss-cn-shenzhen.aliyuncs.com/xcx/gray.png")
    background-size cover
  .bindList-item-card-name
    color #fff
    margin-bottom 5px
    font-size 20px
  .bindList-item-NO
    color #fff
    font-size 13px
  .bindList-item-line
    width 100%
    height 1px
    background rgba(0,0,0,.1)
    position absolute
    bottom 27px
    left 0
  .bindList-item-ad
    position absolute
    bottom 5px
    left 20px
    color #fff
    font-size 0
    .bindList-item-ad-icon
      margin-top 3px
      display inline-block
      vertical-align top
      height 15px
      width 16px
      background-image: url("../../../static/icon_position.png")
      background-size: 15px 16px
      background-repeat: no-repeat
    .bindList-item-ad-text
      font-size 14px
      display inline-block
      vertical-align top
  .bindList-item-data
    position absolute
    bottom 5px
    right 20px
    color #fff
  .bindList-item-background
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: -2
  .bindList-item-state
    position absolute
    right 10px
    top 10px
    width 50px
    height 20px
    background rgba(0,0,0,.2)
    text-align center
    line-height 20px
    color #fff
    border-radius 5px
</style>