<template>
  <div class="contain">
    <scroll-view scroll-y="true" class="contentBox">
      <div class="header">
        <img :src="currentGood.Picture[0].PictureUrl" v-if="currentGood.Picture.length > 0">
        <img src="../../../static/foodDefaultS.png" v-if="currentGood.Picture.length == 0">
      </div>
      <!-- 内容 -->
      <div class="content">
        <div class="ptb8 plr10">
          <div class="combo" @click.stop="showCombo(item)" v-if="item.sort_request && item.sort_request.length > 0">口味</div>
        </div>
        <div class="good lh35 fs16 colYellow plr10 flexlr">
          <div class="goodName">{{currentGood.MaterialSortName}}</div>
          <!-- 加购物车按钮 -->
          <div class="shopcart" @click.stop="shopcartContain">
            <div class="cartButton">
              <div class="decrease" @click="goodDecrease(item)"></div>
              <div class="goodNo">6</div>
              <div class="add" @click="goodAdd(item)"></div>
            </div>
          </div>
        </div>
        <div class="totle pt20 colYellow fs16 text-r plr10">
          总计：￥654
        </div>
      </div>
    </scroll-view>
    <div class="footer flexlr text-c fs14 borderT colb2">
      <div class="flextb payItem">
        <div class="payIcon wxIcon"></div>
        <div class="payText">微信支付</div>
      </div>
      <div class="flextb payItem">
        <div class="payIcon memberIcon"></div>
        <div class="payText">会员卡支付</div>
      </div>
    </div>
  </div>
</template>
<script>
import util from '@/utils/index'
export default {
  data () {
    return {

    }
  },

  components: {

  },
  computed: {
    currentGood () {
      return this.$store.state.currentGood
    }
  },
  methods: {
    getCompanyList () {
      // 查询 购物车详情
      let that = this
      if (that.searchWord == '') {
        return false
      }
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/company/list/ecardByCompanyName', 
        data: {
          companyname: that.searchWord,
          count: 1000,
          regioncode: "3501",
          start: 0
        },
        header: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        success(res) {
          console.log('res.data')
          console.log(res.data)
          if (res.data.ret === 0){
            // 存储所有商品类别
            that.KTVlist = res.data.data
            that.KTVlist = that.KTVlist.concat(res.data.data)
            that.KTVlist = that.KTVlist.concat(res.data.data)
            console.log('that.KTVlist')
            console.log(that.KTVlist)
          } else {
            that.KTVlist = []
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
    toGoodList () {
      // 去购物  reLaunch
      wx.navigateBack({
        url: '/pages/good/main'
      })
    },
    showCombo (item) {
      if (!item.sort_request || item.sort_request.length === 0) {
        // 没有口味
        wx.showToast({
          title: '该商品没有口味',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      this.$store.commit('setCurrentGood', item)
      this.$store.commit('setShowCombo', true)
    }
  },
  created () {
    console.log('page--------单品商品详情')
  },
  mounted () {
    console.log('mounted--------单品商品详情')
    console.log(this.$store.state.currentGood)
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
.contentBox
  position absolute
  top 0
  left 0
  right 0
  bottom 80px
.header
  width 100%
  height 375px
.header img
  width 375px
  height 375px
.combo
  height 20px
  line-height 20px
  width 50px
  text-align center
  font-weight 400
  color #cea16a
  background #423c31
  font-size 10px
  border-radius 15px
// 购物车按钮
.shopcart
  // position absolute
  // right 6px
  // bottom 6px
  padding 3px 4px
.cartButton
  display flex
  justify-content space-between
.decrease
  flex 1 1 24px
  width 30px
  height 25px
  background url('../../../static/remove.png') no-repeat
  background-size 24px 24px
.add
  flex 1 1 24px
  width 24px
  height 24px
  background url('../../../static/add.png') no-repeat
  background-size 24px 24px
.goodNo
  line-height 24px
  color #cea16a
  padding 0 4px
// 支付
.footer
  position absolute
  left 0
  right 0
  bottom 0
  height 70px
  padding 6px 0 3px 0
  background #423c31
.payItem
  flex 1 1 50%
.payIcon
  display inline-block
  width 40px
  height 40px
  margin 0 auto
  border-radius 50%
.wxIcon
  background url('../../../static/wechat_c.png') no-repeat
  background-size 40px 40px
  background-position center center
.memberIcon
  background url('../../../static/VIP.png') no-repeat
  background-size 40px 40px
  background-position center center
</style>