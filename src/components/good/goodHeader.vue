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
          <div class="lowCharge">最低消费金额: ￥{{companyAndRoom.LowWineCharge}}</div>
        </div>
      </div>
      <div class="buttons">
      	<div class="orderlist" v-if="roomSetting.IsOpenOrderSheet === '0'" @click="toOrderList">
      		<span class="buttons-text">账单</span>
      	</div>
      	<div class="ordercheck" v-if="roomSetting.IsOpenAfterPay === '0'" @click="toAfterPayList">
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
      roomSetting: {},
      lowwinecharge: 0
    }
  },

  components: {
    combo
  },
  computed: {
    clouduserid () {
      return this.$store.state.clouduserid
    }
  },
  watch: {
  },
  methods: {
    getCompanyAndRoom () {
      // 查询 分店信息 和 绑定卡台
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/public/getCompanyAndRoom', 
        data: {
          clouduserid: this.clouduserid,
          requestInfo: {}
        },
        header: {
          'content-type': 'application/json; charset=UTF-8'
        },
        success(res) {
          if (res.data.code === '0'){
            that.companyAndRoom = res.data.result
            // 数字 0 显示为空，字符串 ‘0’ 正常
            that.companyAndRoom.LowWineCharge += ''
            that.$store.commit('setCompanyAndRoom', that.companyAndRoom)
            // 查询 权限
            that.querySysFunction(that.companyAndRoom.CompanyID)
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
            console.log(that.roomSetting.IsOpenOrderSheet == 1)
            console.log(that.roomSetting.IsOpenAfterPay == 1)
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
    querySysFunction (companyid) {
      // 查询 是否 开通在线商城权限
      // 是否 拥有 在线商城权限，0 未查询，1 已查询 有权限，2 已查询 无权限
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/wechat_order_service/public/isOpenMarket?companyid=' + companyid,
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (res.data.code === 0) {
            console.log('有权限')
            that.$store.commit('setHasMarketFunction', 1)
            that.getRoomSetting(that.companyAndRoom.CompanyID, that.companyAndRoom.RoomID)
          } else {
            that.$store.commit('setHasMarketFunction', 2)
            console.log('没权限')
            that.toError()
          }
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
    },
    toError () {
      // 去未结商品结账
      wx.reLaunch({
        url: '/pages/error/main'
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
    // 退出小程序后 没有 关闭，重新进入，就要刷新房态 变化
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
  background url('https://yjevideocloud.oss-cn-shenzhen.aliyuncs.com/xcx/top_bg.png') 0 -3px
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
