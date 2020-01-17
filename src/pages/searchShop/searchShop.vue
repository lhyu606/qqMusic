<template>
  <div class="selectKTV">
        <div class="selectKTV-top">
            <input class="shopName" auto-focus='true' v-model='searchWord' placeholder="输入店名" @input="doSearch"/>
        </div>
        <scroll-view 
          scroll-y="true" 
          class="selectKTV-list" 
          lower-threshold="50"
          @scrolltolower="getCompanyList">
            <div>
                <div class="selectKTV-list-item" 
                  v-for="(item, index) in KTVlist" 
                  @click="toLogin(item)" 
                  :style="{background: item.color}"
                  :key="index">
                    <div class="selectKTV-list-item-pic">
                        <img :src="item.logourl" v-show="item.logourl!==''">
                        <img src="../../../static/ktv.png" v-show="item.logourl===''">
                    </div>
                    <div class="selectKTV-list-item-wrapper">
                        <div class="selectKTV-list-item-up">{{item.companyname}}</div>
                        <div class="selectKTV-list-item-down">{{item.companyaddress}}</div>
                    </div>
                </div>
            </div>
        </scroll-view>
    </div>
</template>
<script>
import util from '@/utils/index'
// const bmap = require('../../libs/bmap-wx.min.js')
// console.log('bmap')
// console.log(bmap)
export default {
  data () {
    return {
      KTVlist: [],
      regioncode: '3501',
      canSearch: true,
      timer: null,
      searchWord: ''
    }
  },

  components: {

  },

  methods: {
    doSearch () {console.log(this.searchWord)
      if (this.canSearch) {
        this.canSearch = false
        this.timer = setTimeout(() => {
          this.canSearch = true
          clearTimeout(this.timer)
          this.timer = null
          this.getCompanyList()
        }, 300)
      }
    },
    getCompanyList () {
      // 查询 购物车详情
      let that = this
      if (that.searchWord == '') {
        return false
      }
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/public/getCompanyListOpenMarketByCompanyName', 
        // url: this.$store.state.ip + '/yjmemberserver/company/list/ecardByCompanyName', 
        data: {
          companyname: that.searchWord,
          count: 1000,
          regioncode: that.regioncode,
          start: 0
        },
        header: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        success(res) {
          console.log('res.data')
          console.log(res.data)
          if (res.data.code === '0'){
            // 存储所有商品类别
            that.KTVlist = res.data.result
            // that.KTVlist = that.KTVlist.concat(res.data.data)
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
    toLogin (item) {
      // 去购物  reLaunch
      this.$store.commit('setHeadShopNo', item.officeid)
      wx.setStorageSync('headShopNo', item.officeid)
      wx.navigateTo({
        url: '/pages/good/main'
      })
    }
  },
  created () {
    console.log('page--------选择商家')
  },
  mounted () {
    console.log('mounted--------选择商家')
    let options = util.getCurrentPageOptions()
    this.regioncode = parseInt(options.regioncode) 
  }
}
// http://yjtest.evideo.net.cn/wechat_order_service/Public/images/area.png
// http://yjtest.evideo.net.cn/wechat_order_service/Public/images/page_bind_btn.png
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
    .selectKTV
        position absolute
        left 0
        top 0
        width 100%
        height 100%
        background #201c19
        .selectKTV-top
            position absolute
            top 0
            left 0
            width 100%
            height 40px
            background #423c31
            line-height 40px
            padding 0 10px
            border-bottom 1px solid #201c19
            font-size 14px
            color rgba(255, 255, 255, 0.7)
            .shopName
              background-color: #fff
              background-image: none
              border-radius: 4px
              border: 1px solid #d9bfc3
              box-sizing: border-box
              color: #3d1f24
              font-size: inherit
              height: 36px
              line-height: 1
              outline: 0
              padding: 3px 10px
              transition: border-color .2s cubic-bezier(.645,.045,.355,1)
        .selectKTV-list
            position absolute
            top 42px
            left 0
            width 100%
            bottom 0
            overflow scroll
            .selectKTV-list-item
                width 100%
                height 70px
                font-size 0
                background #423c31
                position relative
                color #cea16a
                .selectKTV-list-item-pic
                    display inline-block
                    vertical-align top
                    width 70px
                    height 70px
                    padding 10px
                    border-bottom 1px solid #201c19
                    img
                        width 50px
                        height 50px
                .selectKTV-list-item-wrapper
                    position absolute
                    display inline-block
                    vertical-align top
                    left 70px
                    right 0
                    height 70px
                    border-bottom 1px solid #201c19
                    .selectKTV-list-item-up
                        font-size 15px
                        margin-top 10px
                    .selectKTV-list-item-down
                        font-size 13px
                        color #cea16a
                        margin-top 5px
</style>