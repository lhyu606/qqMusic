<template>
  <div>
    <div class="goodList" :class="{top: toTop}" >
      <!-- 会员卡条 -->
            <div class="memberCard" id="memberCard" v-show="!ecard.cardnum" @click="toChoiceCard">
              请选择会员卡
              <div class="caret"></div>
            </div>
            <div class="memberCard active" v-show="ecard.cardnum" @click="toChoiceCard">
              您选择了{{ecard.gradename}}<br/>
              卡号:{{ecard.cardnum}}
              <div class="caret"></div>
            </div>
      <div class="scrollContain">
        <!-- 左侧商品类别 -->
        <scroll-view scroll-y="true" class="leftScroll">
          <div class="content">
            <div class="leftItem" @click="toSearchGood">
              <div class="middle">
                <img src="../../../static/searchGray.png" class="searcIcon">搜索            
              </div>
            </div>
            <div class="leftItem" 
              v-for="(item, index) in goodsType" 
              :class="{active: menu == index}"
              @click="checkMenu(index)"
              wx:key="MaterialSortID"
              >
              <div class="middle">
                <span class="fireIcon" v-if="index == 0"></span>
                {{item.MaterialSortName}}
              </div>
            </div>
          </div>
        </scroll-view>
        <!-- 右侧商品列表 -->
        <scroll-view 
          scroll-y="true" 
          class="rightScroll" 
          lower-threshold="300"
          @scrolltoupper="scrolltotop"
          @scrolltolower="loadMore"
          @scroll="scroll">
          
          <div class="content">
            <!-- 会员卡条占位 -->
            <div class="memberCardInstead"></div>
            <!-- 商品列表 -->
            <goodListSub :goods="goods" v-on:addCart='addCart'></goodListSub>
          </div>
        </scroll-view>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import util from '@/utils/index'
import goodListSub from '@/components/good/goodListSub.vue'

export default {
  data () {
    return {
      maxLength: 0,
      memberCard: {
        cardNo: 1231546798797645,
        grade: '黄金会员'
      },
      isTop: false,
      page: 1,
      pagesize: 20,
      isLoadingGoods: false, // 是否在 加载数据
      isLoadingTypes: false,
      dataOver: false,    // 数据加载完了
      changeList: false,   // 切换类型，切换价格类型
      prevGoodRequest: ''  // 前一次 请求参数
    }
  },
  computed: {
    toTop () {
      return this.isTop
    },
    menu () {
      return this.$store.state.menu
    },
    ecard () {
      return this.$store.state.ecard
    },
    goodsType () {
      return this.$store.state.goodsType
    },
    goods () {
      return this.$store.state.goods
    },
    priceTypeId () {
      return this.$store.state.ecard.pricetypeid || 0
    },
    cartList () {
      return this.$store.state.cartList
    },
    companyAndRoom () {
      return this.$store.state.companyAndRoom
    }
  },
  watch: {
    menu () {
      console.log('+++++++++++ menu')
      // 切换商品类别，请求对应商品
      this.initSortGoodsRequestInfo()
      this.getGoodsBySort()
    },
    priceTypeId () {
      console.log('+++++++++++ priceTypeId')
      // 切换商品类别，请求对应商品
      this.initSortGoodsRequestInfo()
      this.getGoodsBySort()
    },
    cartList () {
      // 购物车变化，刷新商品
      // console.log('购物啊手动阀打发')
    },
    companyAndRoom () {
      // 获取到分店后再 请求卡列表
      console.log('信息 遍历来计算两点间凯夫拉见识到了仿佛看见')
      console.log(this.companyAndRoom)
      this.getCards()
    }
  },
  components: {
    goodListSub
  },
  methods: {
    getGoodsType () {
      if (this.isLoadingTypes) {
        return
      }
      this.isLoadingTypes = true
      // 查询 商品分类
      let that = this
      let data = {
        wi: 1101,
        clouduserid: this.$store.state.clouduserid,
        requestInfo: {}
      }
      util.wXrequest({
        url: this.$store.state.ip + '/wechat_order_service/goods/getGoodsType', 
        data: util.emulateJSON(data),
        success(res) {
          if (res.data.code === 0){
            // 存储所有商品类别
            that.$store.commit('setGoodsType', res.data.result)
            that.initSortGoodsRequestInfo()
            // 首次加载请求商品
            that.getGoodsBySort(that.goodsType[that.menu].MaterialSortID)
          } else {
            console.log('返回码不是 0')
            // 去扫描绑定卡台
          }
          that.isLoadingTypes = false
        },
        fail (res) {
          that.isLoadingTypes = false
          console.log(res)
        }
      })
    },
    initSortGoodsRequestInfo () {
      // 初始化 请求商品列表 参数
      this.page = 1
      this.dataOver = false
      this.isLoadingGoods = false
      this.changeList = true
    },
    getGoodsBySort () {
      // 数据以全部加载，后续无需再加载
      if (this.dataOver || this.menu == -1 || this.goodsType.length == 0 || this.isLoadingGoods) {
        return false
      }
      this.isLoadingGoods = true
      // 校验 menu 防止前一次数据还未加载完成，又进行下一次加载，导致错误发生
      let currentMenu = this.menu
      let materialSortID = this.goodsType[this.menu].MaterialSortID
      // 查询 分类商品
      let that = this
      let requestInfo = {
        page: this.page,
        pagesize: this.pagesize,
        sortid: materialSortID,
        priceTypeId: this.$store.state.ecard.pricetypeid || 0
      }
      let data = {
        wi: 1102,
        clouduserid: this.$store.state.clouduserid,
        requestInfo: requestInfo
      }
      // 判断 请求参数 是否相同，相同时，不再请求
      if (this.prevGoodRequest) {
        if (this.prevGoodRequest == util.emulateJSON(data)) {
          return
        }
      }
      this.prevGoodRequest = util.emulateJSON(data)
      util.wXrequest({
        url: this.$store.state.ip + '/wechat_order_service/goods/getGoodsBySort',
        data: util.emulateJSON(data),
        success(res) {
          if (currentMenu !== that. menu) {
            // 校验 menu 防止前一次数据还未加载完成，又进行下一次加载，导致错误发生
            return false
          }
          if (res.data.code === 0){
            // 切换类型，切换价格类型
            if (that.changeList || that.page == 1) {
              // console.log('清空前一次')
              that.changeList = false
              that.goods = []
              that.$store.commit('setGoods', [])
            }
            that.page++
            // 如果数量 小于 每页数量，数据以全部加载，后续无需再加载
            if (!res.data.result || res.data.result.length == 0) {
              that.dataOver = true
            }
            // 如果 数量 小于 全屏 所需 最小 数量 则 不全屏
            if (res.data.result.length < that.maxLength) {
              that.isTop = false
            }
            // 存储所有商品类别
            let goods = that.initGoods(res.data.result)
            let totalGoods = that.goods.concat(goods)//goods
            that.$store.commit('setGoods', totalGoods)
            that.isLoadingGoods = false
          } else {
            that.isLoadingGoods = false
            that.dataOver = true
            console.log('返回码不是 0')
            // 去扫描绑定卡台
          }
        },
        fail (res) {
          that.isLoadingGoods = false
          console.log(res)
        }
      })
    },
    // 根据购物车，初始化商品
    initGoods (dataResult) {
      let goods = dataResult
      // 没有商品 返回 []
      if (goods.length === 0) {
        return []
      }
      for (let i=0; i<goods.length; i++) {
        let good = goods[i]
        if (!good.sort_request) {
          good.sort_request = []
        }
        if (!good.Picture) {
          good.Picture = []
        }
        if (this.cartList[good.MaterialSortID] && this.cartList[good.MaterialSortID][good.MaterialID]) {
          // 购物车里有 该商品
          goods[i].OrderNumber = this.cartList[good.MaterialSortID][good.MaterialID].OrderNumber
          // 设置口味
          for (let j=0; j<good.sort_request.length; j++) {
            let subSortRequest = {}
              goods[i].sort_request[j].active = false
          }
        } else {
          // 购物车里没有 该商品
          goods[i].OrderNumber = 0
          // 设置口味
          for (let j=0; j<good.sort_request.length; j++) {
            goods[i].sort_request[j].active = false
          }
        }
      }
      return goods
    },
    loadMore () {
      // 接 php 没有分页
      // return false
      this.getGoodsBySort()
    },
    // 商品列表滚动到顶部
    scrolltotop () {
      // this.isTop = true
    },
    scroll(e) {
      let target = e.target
      let scrollTop = target.scrollTop
      if (scrollTop > 10) {
        // 如果 商品列表长度 大于 容器最大数量，才使用
        if (this.goods.length <= this.maxLength) {
          return false
        }
        this.isTop = true
      } else {
        this.isTop = false
      }
      // console.log(e)
    },
    checkMenu (index) {
      // 切换商品类别
      this.$store.commit('setMenu', index)
    },
    setMaxLength () {
      this.$nextTick(() => {
        // 商品列表长度 大于 容器最大数量，才使用顶部收缩
        let query = wx.createSelectorQuery()
        query.select('#header').boundingClientRect()
        query.select('#memberCard').boundingClientRect()
        let headerHeight = 0
        let memberCardHeight = 0
        query.exec((res) => {
          headerHeight = res[0].height
          memberCardHeight = res[1].height
          this.maxLength = parseInt((this.$store.state.systemInfo.windowHeight - (headerHeight + memberCardHeight)) / 91) + 5
        })
      })
    },
    toChoiceCard () {
      // 去选会员卡
      wx.navigateTo({
        url: '/pages/choiceCard/main'
      })
    },
    toSearchGood () {
      this.$store.commit('setGoodPageRefresh', false)
      // 搜索商品（模糊搜索）
      wx.navigateTo({
        url: '/pages/searchGood/main'
      })
    },
    addCart (e) {
      // 事件传递，购物车小球
      this.$emit('addCart', e)
    },
    getCards () {
      // 查询 会员卡
      if (this.$store.state.clouduserid == '' || !this.companyAndRoom.CompanyID) {
        // 如果没有 clouduserid 或者 没有 分店号 返回
        return false
      }
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/member/list/clouduserid', 
        data: {
          clouduserid: this.$store.state.clouduserid,
          shopno: this.companyAndRoom.CompanyID
        },
        header: {
          'content-type': 'application/json;charset=UTF-8' // 默认值
        },
        success(res) {
          if (res.data.ret === 0){
            that.cards = res.data.list
            let i = 0
            that.cards = that.cards.filter(item => {
              return item.uselinemarket === 0
            })
            that.$store.commit('setCards', res.data.list)
            if (that.$store.state.setPrimaryCard || that.cards.length == 0) {
              // 已设置 过主卡，不再操作
              that.$store.commit('setSetPrimaryCard', true)
              that.getGoodsType()
              that.setMaxLength()
            } else {
              // 没有 设置过 主卡， 去 自动 选卡
              that.getAndSetPrimaryCard()
            }
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
    getAndSetPrimaryCard () {
      // 查询 主卡，有 主卡，则 选 主卡，没有 主卡， 选 第一张 卡
      let that = this
      util.wXrequest({
        url: this.$store.state.ip + '/yjmemberserver/Member/Integration/getAndSetPrimaryCard', 
        data: {
          clouduserid: this.$store.state.clouduserid,
          shopno: this.companyAndRoom.CompanyID,
          headShopNo: this.$store.state.headShopNo,
          type: 1
        },
        header: {
          'content-type': 'application/json;charset=UTF-8' // 默认值
        },
        success(res) {
          if (res.data.ret === 0){
            that.$store.commit('setSetPrimaryCard', true)
            // 默认 取 第一张 卡 或者 {}
            let primaryCard = that.cards[0] || {}
            that.cards.forEach((item, index) => {
              if (item.ecardid === res.data.data.ecardid) {
                // 有主卡 设置主卡
                primaryCard = item
              }
            })
            that.$store.commit('setEcard', primaryCard)
            that.getGoodsType()
            that.setMaxLength()
          } else {
            console.log('返回码不是 0')
            // 设置 主卡失败
          }
        }
      })
    }
  },
  created () {
    console.log('created-------goodList')
  },
  mounted () {
    console.log('mounted--------goodList')
    // 此处先处理 会员卡
    if (this.$store.state.clouduserid) {
      this.getCards()
    }
    // this.getGoodsType()
    // this.setMaxLength()
  },
  onHide () {
    this.prevGoodRequest = ''
  },
  onUnload () {
    this.prevGoodRequest = ''
  }
}
  
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
.goodList
  width 100%
  background #201c19
  position absolute
  top 98px
  left 0
  bottom 50px
  transition all 0.5s
.goodList.top
  top 0px
.leftScroll
  position absolute
  top 0
  left 0px
  bottom 0
  overflow scroll
  width 100px
  color #333333
.rightScroll
  position absolute
  top 0
  right 0px
  bottom 0
  width 270px
  overflow scroll
  background: #201c19
.content
  text-align center
  // height 1500px
.leftItem
  display flex
  justify-content center
  align-item center
  text-align center
  flex-direction: column
  color #a8998e
  background #171413
  min-height 53px
  padding 0 6px
  font-size 15px
  border-bottom 1px solid #2c2723
  border-right 1px solid #2c2723
.leftItem.active
  background: #201c19
  border-right 0
  border-left 5px solid #cea16a
.searcIcon
  width 25px
  height 25px
  vertical-align middle
.fireIcon
  display inline-block
  width 19px
  height 23px
  background url('../../../static/fireIcon.png') no-repeat
  background-size 19px 23px
// 会员卡条
.memberCard
  position absolute
  top 0
  right 0
  width 270px
  height 40px
  overflow hidden
  line-height 40px
  font-size 15px
  text-align left
  color #ffd8ac
  padding-left 45px
  background-color #423c31
  background-image url('../../../static/card_icon.png')
  background-position 5px center
  background-repeat: no-repeat
  background-size 30px 30px
  z-index 100
.memberCard.active
  line-height 20px
.memberCardInstead
  height 40px
.caret
  position absolute
  top 0
  right 0
  bottom 0
  width 30px
  background url('../../../static/pullUp.png') no-repeat center center
  background-size 30px 30px
// 商品列表
.goodItem
  position relative
  padding 10px 0
  border-bottom 1px solid #2c2723
  display flex
  justify-content space-between
.goodImg
  width 70px
  height 70px
.goodImg img
  width 70px
  height 70px
.goodDes
  flex 1 1 196px
  padding 0 4px
  display flex
  justify-content space-between
  align-item center
  flex-direction column
  font-size 15px
  box-sizing border-box
.goodLine
  width 196px
  text-align left
  color #ede2d9
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
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
.red
  color #ff5455
// 购物车按钮
.shopcart
  position absolute
  right 6px
  bottom 6px
.cartButton
  display flex
  justify-content space-between
.decrease
  flex 1 1 24px
  width 30px
  height 30px
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
</style>
