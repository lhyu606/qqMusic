<template>
  <div>
    <div class="header" id="header">
      <div class="account">
        <div class="account-img">
          <img :src="companyAndRoom.LogoUrl">
        </div>
        <div class="account-msg">
          <div class="companyName">
            {{companyAndRoom.CompanyName}}
          </div>
          <div class="table">
            卡台: {{companyAndRoom.RoomName}}
            <span class="unbind-button" @click="unbind">
              <img src="../../../static/release.png" class="unbind-icon">
              解绑
            </span>
          </div>
          <div class="lowCharge">最低消费金额: ￥123</div>
        </div>
      </div>
      <div class="buttons">
      	<div class="orderlist" v-show="roomSetting.IsOpenOrderSheet == 1" @click="toOrderList">
      		<span class="buttons-text">账单</span>
      	</div>
      	<div class="ordercheck" v-show="roomSetting.IsOpenAfterPay == 1" @click="toAfterPayList">
      		<span class="buttons-text">结账</span>
      	</div>
      </div>
    </div>
    <combo></combo>
  </div>
</template>

<script>
import util from '@/utils/index'
import combo from '@/components/good/combo.vue'
export default {
  data () {
    return {
      companyAndRoom: {},
      roomSetting: {}
    }
  },

  components: {
    combo
  },
  computed: {
    refreshCompanyAndRoom () {
      return this.$store.state.refreshCompanyAndRoom
    },
    clouduserid () {
      return this.$store.state.clouduserid
    }
  },
  watch: {
    refreshCompanyAndRoom () {
      console.log('需要请求 分店信息')
      if (this.refreshCompanyAndRoom) {
        this.$store.commit('setRefreshCompanyAndRoom', false)
        // 刷新 分店 和 卡台信息
        // this.getCompanyAndRoom()
      }
    }
  },
  methods: {
    getCompanyAndRoom () {
    	// 查询 分店信息 和 绑定卡台
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/wechat_order_service/public/getCompanyAndRoom', 
        data: {
          wi: 1003,
          clouduserid: this.clouduserid,
          requestInfo: ''
        },
        success(res) {
          if (res.data.code === 0){
          	that.companyAndRoom = res.data.result
	          that.$store.commit('setCompanyAndRoom', that.companyAndRoom)
	          that.getRoomSetting(that.companyAndRoom.CompanyID, that.companyAndRoom.RoomID)
            // that.getCards()
          } else {
          	console.log('返回码不是 0')
          	// 去扫描绑定卡台
            wx.reLaunch({
              url: '/pages/scanQR/main'
            })
          }
        },
        fail (res) {
          console.log(res)
        }
      })
    },
    getRoomSetting (shopNo, roomID) {
    	// 获取是否 使用账单 和结账按钮
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/wechat_order_service/index.php/public/roomSetting?shopNo=' + shopNo + '&roomID=' + roomID,
        method: 'get',
        success(res) {
          console.log('是否 使用账单 和结账按钮')
          console.log(res.data)
          if (res.data.code === 0){
          	that.roomSetting = res.data.result
            that.$store.commit('setRoomSetting', res.data.result)
          }
        },
        fail (res) {
          console.log(res)
        }
      })
    },
    unbind () {
      // 解绑当前卡台，打开扫码
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/public/unbind',
        data: {
          clouduserid: this.$store.state.clouduserid,
          requestInfo: {}
        },
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.code === '0'){
            // 解绑成功 去扫码
            wx.reLaunch({
              url: '/pages/scanQR/main'
            })
          } else {
            // 解绑失败
            wx.showToast({
              title: res.data.msg || '解绑失败',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail (res) {
          // 通讯失败，解绑失败
          wx.showToast({
            title: res.data.msg || '解绑失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
      
    },
    toOrderList () {
      // 去订单列表
      wx.navigateTo({
        url: '/pages/orderHistory/main'
      })
    },
    toAfterPayList () {
      // 去未结商品结账
      wx.navigateTo({
        url: '/pages/afterPayList/main'
      })
    }
  },
  created () {
    
  },
  mounted () {
    console.log('mounted-----googHeader')
    if (this.$store.state.clouduserid) {
      this.getCompanyAndRoom()
    }
  },
  onShow () {
    // 退出小程序后  没有 关闭，重新进入，就要刷新房态 变化
    if (this.$store.state.clouduserid) {
      this.getCompanyAndRoom()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"

.header 
  width 375px
  height 99px
  position relative
  background url('http://yjyf.evideo.net.cn/wechat_order_service/static/img/top_bg.f021e9d.png') 0 -3px
  background-size 375px 103px
  padding 10px 14px
  padding-right 90px
  font-size 0
.account 
  width 271px
  height 80px
  display flex
.account-img
  margin-top 8px
  width 60px
  height 72px
  vertical-align top
  img
    width 60px
    height 60px
.account-msg
  display flex
  flex-direction column
  justify-content space-between
  color #fff
  padding-left 10px
  height 100%
  font-size 14px
.unbind-button
  width 62px
  height 26px
  line-height 26px
  text-align center
  display inline-block
  border 1px solid #ffffff
  border-radius 15px
.unbind-icon
  transform translate(0, 2px)
  width 15px
  height 15px
.buttons
	position absolute
	right 5px
	top 30px
	text-align right
.orderlist
	display inline-block
	position relative
	vertical-align top
	width 40px
	height 40px
	margin-left 5px
	background url('../../../static/order_icon1.png')
	background-size 40px 40px
.ordercheck
	display inline-block
	position relative
	vertical-align top
	width 40px
	height 40px
	margin-left 5px
	background url('../../../static/order_icon2.png')
	background-size 40px 40px
.buttons-text
	position absolute
	bottom -16px
	left 0
	width 100%
	height 16px
	font-size 12px
	color #ffd8ac
	text-align center
	
</style>
