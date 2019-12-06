<template>
  <div class="contain">
    <div class="tip lh30 fs15">
      <img src="../../../static/tip.png" class="tipPic">付款可能存在延时，请勿重复支付噢！
    </div>
    <div class="lh50 colYellow plr10 fs16 bgBrown">
      <div class="flexlr">
        <div class="left">商品名称</div>
        <div class="right text-r">会员充值</div>
      </div>
      <div class="flexlr borderT">
        <div class="left">支付金额</div>
        <div class="right text-r">￥1</div>
      </div>
    </div>
    <div class="pt20"></div>
    <div class="botton">
      确认支付
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
  },
  created () {
    console.log('page--------购卡充值begin')
  },
  mounted () {
    console.log('mounted--------购卡充值begin')
    console.log(this.applyCard)
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