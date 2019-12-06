<template>
  <div class="privilegeDetail">
        <div class="privilegeDetail-padding"></div>
        <div class="privilegeDetail-item">
            <div class="privilegeDetail-item-up">
                <div class="privilegeDetail-item-up-icon1"></div>
                <div class="privilegeDetail-item-up-text"> 会员权益</div>
            </div>
            <div class="privilegeDetail-item-down">
                <div v-html="memberrights"></div>
            </div>
        </div>
        <div class="privilegeDetail-padding"></div>
        <div class="privilegeDetail-item">
            <div class="privilegeDetail-item-up">
                <div class="privilegeDetail-item-up-icon2"></div>
                <div class="privilegeDetail-item-up-text"> 商家电话</div>
            </div>
            <div class="privilegeDetail-item-down">
                <div>{{applyCard.serviceNumber}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import util from '@/utils/index'
export default {
  data () {
    return {
      memberrights: ''
    }
  },

  components: {
  },

  computed: {
    applyCard () {
      return this.$store.state.applyCard
    }
  },
  watch: {

  },
  methods: {
  },
  created () {
    console.log('page--------权益详情begin')
  },
  mounted () {
    console.log('mounted--------权益详情begin')
    // 处理 富文本
    let rights = this.applyCard.memberrights
    rights = rights.replace(/&amp;quot;/g, '\'')
    rights = rights.replace(/&quot;/g, '"')
    this.memberrights = rights
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
    .privilegeDetail
        position absolute
        left 0
        top 0
        width 100%
        height 100%
        background #201c19
        .privilegeDetail-padding
            width 100%
            height 20px
            background #201c19
        .privilegeDetail-item
            width 100%
            background #423c31
            padding 10px
            .privilegeDetail-item-up
                border-bottom 1px solid #cea16a
                padding-bottom 10px
                .privilegeDetail-item-up-icon1
                    display inline-block
                    vertical-align top
                    height 30px
                    width 30px
                    background-image: url("../../../static/huiyuan.png")
                    background-size: 30px 30px
                    background-repeat: no-repeat
                .privilegeDetail-item-up-icon2
                    display inline-block
                    vertical-align top
                    height 30px
                    width 30px
                    background-image: url("../../../static/dianhua.png")
                    background-size: 30px 30px
                    background-repeat: no-repeat
                .privilegeDetail-item-up-text
                    display inline-block
                    vertical-align top
                    font-size 18px
                    margin-top 2px
                    color #cea16a
                    margin-left 8px
            .privilegeDetail-item-down
                color #cea16a
                padding-top 10px
                font-size 14px
</style>