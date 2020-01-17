<template>
  <div class="selectKTV">
        <div class="selectKTV-top"  @click="searchShop">
            店名搜索
            <div class="selectKTV-top-right-icon"></div>
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
export default {
  data () {
    return {
      KTVlist: [],
      regioncode: '3501'
    }
  },

  components: {

  },

  methods: {
    getLocation () {
      let that = this
      // 获取 地址 再获取 经纬度 再获取 行政编码
      util.wXrequest({
        url: 'https://api.map.baidu.com/location/ip?ak=jT4Dfk6xF7aZMMFwb7iQ6l5BaFryRm9z',
        data: {
          params: {},
          jsonp: 'callback'
        },
        success (response) {
          console.log('response')
          console.log(response)
          let addressRes = response
          response = response.data.content.address_detail.city
          if (response[response.length - 1] === '市') {
            response = response.substr(0, response.length - 1)
          }
          util.wXrequest({
            url: 'https://api.map.baidu.com/geocoding/v3/?address=' + addressRes.data.content.address + '&output=json&ak=jT4Dfk6xF7aZMMFwb7iQ6l5BaFryRm9z&callback=showLocation',
            success (res) {
              let result = res.data + ''
              result = result.replace(/.*\{/, '')
              result = result.replace(/\}.*/, '')
              result = '{' + result + '}'
              result = JSON.parse(result)
              util.wXrequest({
                url: 'https://api.map.baidu.com/reverse_geocoding/v3/?ak=jT4Dfk6xF7aZMMFwb7iQ6l5BaFryRm9z&output=json&coordtype=wgs84ll&location=' + result.lat + ',' + result.lng + '',
                success (res) {
                  let adcodeRes = res.data.result
                  // 供搜索时优先排序 使用
                  that.regioncode = adcodeRes.addressComponent.adcode.substr(0, 4)
                  that.getCompanyList()
                }
              })
            }
          })
        }
      })
    },
    getCompanyList () {
      // 查询 购物车详情
      let that = this;
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/public/getCompanyListOpenMarket', 
        // url: this.$store.state.ip + '/yjmemberserver/company/list/ecard', 
        data: {
          "regioncode": that.regioncode,
          "start": 0,
          "count": 100,
          "headShopNo": ""
        },
        header: {
          'Content-Type':'application/json'
        },
        success(res) {
          console.log('res.data')
          console.log(res.data);
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
        },
        fail (res) {
          console.log('失败了。。。。。。。。。。')
        }
      })
    },
    searchShop () {
      // 搜索商家  reLaunch
      wx.navigateTo({
        url: '/pages/searchShop/main?regioncode=' + this.regioncode
      })
    },
    toLogin (item) {
      // 去购物  reLaunch
      this.$store.commit('setHeadShopNo', item.officeid)
      wx.setStorageSync('headShopNo', item.officeid)
      wx.reLaunch({
        url: '/pages/good/main'
      })
    }
  },
  created () {
    console.log('page--------选择商家')
  },
  mounted () {
    console.log('mounted--------选择商家')
    this.getLocation()
  }
}

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
            .selectKTV-top-right-icon
                position absolute
                right 10px
                top 50%
                width 20px
                height 40px
                transform translate(0, -50%)
                background url('../../../static/search.png') no-repeat
                background-position center center
                background-size 20px 20px
            .selectKTV-top-left
                color #cea16a
                display inline-block
                width 70px
                .selectKTV-top-left-icon
                    margin-top 10px
                    display inline-block
                    vertical-align top
                    height 20px
                    width 20px
                    background-image: url("../../../static/pullDown.png")
                    background-size: 20px 20px
                    background-repeat: no-repeat
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