<template>
  <div class="lit-toast-contain" v-show="showTip">
    <!-- <span>会员卡[71191216164151920093]实际可用本金：0.00；实际可赠送：0.00。账户余额不足,不能支付!</span> -->
    <span>{{tip}}</span>
  </div>
</template>
<script>
import util from '@/utils/index'
export default {
  props:{
    content: '',
    duration: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      timer: null,
      showTip: false,
      tip: ''
    }
  },

  computed: {

  },
  watch: {
    content () {
      if (content == '') {
        return false
      }
      this.openPop()
    }
  },
  methods: {
    openPop () {
      this.tip = this.content
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.showTip = true
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.timer = null
        this.showTip = false
      }, this.duration)
    }
  },
  created () {
    console.log('litToast')
  },
  mounted () {
    console.log('mounted--------litToast')
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
.lit-toast-contain
  max-width 90%
  min-height 20px
  position fixed
  top 50%
  left 50%
  transform translate(-50%, -50%)
  padding 3px 4px
  background rgba(0, 0, 0, 0.8)
  color rgba(255, 255, 255, 0.8)
  line-height 20px
  font-size 12px
  text-align justify
</style>