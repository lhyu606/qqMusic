<template>
  <div class="contain">
    <scroll-view scroll-y="true" class="contentBox">
      <div class="header">
        <!-- <img :src="currentGood.Picture[0].PictureUrl" v-if="currentGood.Picture.length > 0">
        <img src="../../../static/foodDefaultS.png" v-if="currentGood.Picture.length == 0"> -->
        <img src="../../../static/foodDefaultS.png">
      </div>
      <!-- 内容 -->
      <div class="content">
        <!-- 可选方案 -->
        <scroll-view scroll-x="true" class="ptb8 plr10 cases">
          <div class="caseBox">
            <div class="caseButton"
               v-for="(item, index) in packages" 
               :key="index"
               :class="{active: packageIndex===index}"
               @click="checkPackage(index)">
              {{item.WinePresentSetName}}
            </div>
          </div>
        </scroll-view>
        <!-- 可选内容 -->
        <div class="groupTip" v-show="package.group">
          可选内容
        </div>
        <div class="groupBox">
          <div class="groupItem fs14"
            v-for="(group, index) in package.group"
            :key="index">
            <div class="groupTitle flexlr plr10" @click="checkShowChoose(group)">
              <div class="groupName">{{group.ChooseGroupName}}</div>
              <div class="groupCaret" :class="{active: group.show}"></div>
            </div>
            <!-- 任选几样 -->
            <div class="lh30 bgWhite colYellow plr10" v-show="group.show">以下商品请任选{{group.ChooseGroupNumber}}样</div>
            <!-- 选 子商品 -->
            <div class="bgWhite lh45 colb2 plr10" v-show="group.show">
              <div class="flexlr"
                v-for="(detail, idx) in package.detail"
                :key="idx"
                v-if="detail.WinePresentSetChooseGroupID == group.PresentSetChooseGroupID">
                <div class="chooseAll" :class="{active: detail.Selected}" @click="checkSelected(detail)"></div>
                <div class="fs14 subGoodName" @click="checkSelected(detail)">{{detail.MaterialName}}</div>
                <div class="subCart flexlr">
                  <!-- 数量加减 -->
                  <div class="decrease" @click="decrease(detail)"></div>
                  <div class="goodNo">{{detail.OrderNum}}</div>
                  <div class="add" @click="add(detail)"></div>
                </div>
              </div>
            </div>
            <!-- 已选的  -->
            <div class="detailItem flexlr plr10 borderB lh40 colYellow fs14 bgWhite"
              v-for="(detail, idx) in package.detail"
              :key="idx"
              v-if="detail.WinePresentSetChooseGroupID == group.PresentSetChooseGroupID && detail.OrderNum>0 && !group.show">
              <div class="left">{{detail.MaterialName}}</div>
              <div class="right">× {{detail.OrderNum}}</div>
            </div>
          </div>
        </div>
        <!-- 可选内容 -->
        <!-- 不可选 -->
        <div class="detailTip">
          套餐内容（不可选）
        </div>
        <div class="detailBox">
          <div class="detailItem flexlr plr10 borderB lh40 colYellow fs14 bgBrown"
            v-for="(detail, index) in package.detail"
            :key="index"
            v-if="detail.WinePresentSetChooseGroupID == '-1'">
            <div class="left">{{detail.MaterialName}}</div>
            <div class="right">× {{detail.DetailNumber}}</div>
          </div>
        </div>
        <!-- 不可选 -->
        <!-- 加购物车 -->
        <div class="addCart fs14" :class="{active: canAddCart}" @click="addCart">
          选好了，加入购物车
        </div>
        <!-- 加购物车 -->
        <!-- <div class="totle pt20 colYellow fs16 text-r plr10">
          总计：￥654
        </div> -->
      </div>
    </scroll-view>
    <!-- <div class="footer flexlr text-c fs14 borderT colb2">
      <div class="flextb payItem">
        <div class="payIcon wxIcon"></div>
        <div class="payText">微信支付</div>
      </div>
      <div class="flextb payItem">
        <div class="payIcon memberIcon"></div>
        <div class="payText">会员卡支付</div>
      </div>
    </div> -->
  </div>
</template>
<script>
import Vue from 'vue'
import util from '@/utils/index'
export default {
  data () {
    return {
      packages: [{}],
      packageIndex: 0
    }
  },

  components: {

  },
  computed: {
    package () {
      return this.packages[this.packageIndex] || {}
    },
    currentGood () {
      return this.$store.state.currentGood
    },
    currentGoodOrderNum () {
      return this.$store.state.currentGood.OrderNumber
    },
    onlineTempOrderID () {
      return this.$store.state.onlineTempOrderID
    },
    canAddCart () {
      // 检查是否 能够加入购物车
      // 没有可选子商品，允许
      let result = true
      if (this.packages[this.packageIndex] && this.packages[this.packageIndex].group) {
        for (let i=0; i<this.packages[this.packageIndex].group.length; i++) {
          let group = this.packages[this.packageIndex].group[i]
          let totalNum = 0
          for (let j=0; j<this.packages[this.packageIndex].detail.length; j++) {
            let detail = this.packages[this.packageIndex].detail[j]
            if (group.PresentSetChooseGroupID === detail.WinePresentSetChooseGroupID) {
              totalNum += parseInt(detail.OrderNum)
              if (detail.OrderNum == group.ChooseGroupNumber) {
                // 子商品数量达到最大，前面 ✔
                detail.Selected = true
              } else {
                detail.Selected = false
              }
            }
          }
          if (parseInt(group.ChooseGroupNumber) != totalNum) {
            // 只要 有一类数量 不满足， 就不允许
            result = false
          } else if (parseInt(group.ChooseGroupNumber) == totalNum) {
            group.show = false
          }
        }
      }
      return result
    }
  },
  watch: {
    onlineTempOrderID () {
      // 加购物车成功, 继续 添加子商品
      // if (this.$store.state.packageAddCart && this.onlineTempOrderID != 0) {
      //   this.$store.commit('setPackageAddCart', false)
      //   console.log('加购物车成功')
      //   // 设置延时，为了 保证 currentGood 已完成更新
      //   let timer = setTimeout(() => {
      //     clearTimeout(timer)
      //     timer = null
      //     this.subAddCart()
      //   }, 100)
      // }
    },
    currentGoodOrderNum () {
      // 加购物车成功, 继续 添加子商品
      if (this.$store.state.packageAddCart && this.onlineTempOrderID != 0) {
        this.$store.commit('setPackageAddCart', false)
        console.log('加购物车成功')
        // 设置延时，为了 保证 currentGood 已完成更新
        let timer = setTimeout(() => {
          clearTimeout(timer)
          timer = null
          this.subAddCart()
        }, 100)
      }
    }
  },
  methods: {
    getPackage () {
      // 查询 套餐详情
      let that = this
      let data = {
        wi: 1103,
        clouduserid: this.$store.state.clouduserid,
        requestInfo: {
          MaterialID: this.currentGood.MaterialID,
          KmID: this.$store.state.ecard.ecardid || ''
        }
      }
      util.wXrequest({
        url: this.$store.state.ip + '/wechat_order_service/goods/getPackages', 
        data: util.emulateJSON(data),
        success(res) {
          if (res.data.code === 0){
            // 存储所有商品类别
            that.initPackage(res.data.result)
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
    initPackage (packages) {
      // 可选内容 group 加上 控制展开 show
      for (let i=0; i<packages.length; i++) {
        if (packages[i].group) {
          for (let j=0; j<packages[i].group.length; j++) {
            Vue.set( packages[i].group[j], 'show', true)
          }
          for (let k=0; k<packages[i].detail.length; k++) {
            Vue.set( packages[i].detail[k], 'OrderNum', 0)
            Vue.set( packages[i].detail[k], 'Selected', false)
          }
        }
      }
      this.packages = packages
    },
    checkPackage (index) {
      // 切换套餐
      this.packageIndex = index
    },
    checkShowChoose (group) {
      // 是否 选子商品
      group.show = !group.show
    },
    checkSelected (subDetail) {
      // 快速选择 子商品
      for (let i=0; i<this.packages[this.packageIndex].detail.length; i++) {
        let detail = this.packages[this.packageIndex].detail[i]
        // if (subDetail.DetailMaterialID == detail.DetailMaterialID) {
          for (let j=0; j<this.packages[this.packageIndex].group.length; j++) {
            let group = this.packages[this.packageIndex].group[j]
            if (group.PresentSetChooseGroupID === subDetail.WinePresentSetChooseGroupID && subDetail.WinePresentSetChooseGroupID === detail.WinePresentSetChooseGroupID) {
              if (subDetail.DetailMaterialID == detail.DetailMaterialID) {
                // 直接 该商品选 最大数量
                detail.OrderNum = group.ChooseGroupNumber
                detail.Selected = true
              } else {
                detail.OrderNum = 0
                detail.Selected = false
              }
            }
          }
        // }
      }
    },
    decrease (detail) {
      // 子商品  减 1
      if (detail.OrderNum > 0) {
        detail.OrderNum--
      }
    },
    add (subDetail) {
      // 子商品 加  1
      for (let i=0; i<this.packages[this.packageIndex].group.length; i++) {
        let group = this.packages[this.packageIndex].group[i]
        let totalNum = 0
        if (group.PresentSetChooseGroupID === subDetail.WinePresentSetChooseGroupID) {
          for (let j=0; j<this.packages[this.packageIndex].detail.length; j++) {
            let detail = this.packages[this.packageIndex].detail[j]
            if (group.PresentSetChooseGroupID === detail.WinePresentSetChooseGroupID) {
              // 统计 改组 总数量
              totalNum += detail.OrderNum
            }
          }
          if (parseInt(group.ChooseGroupNumber) > totalNum) {
            // 只要 该类数量 不满足， 就允许
            subDetail.OrderNum++
          }
          if (parseInt(group.ChooseGroupNumber) == totalNum) {
            wx.showToast({
              title: '该组最多只允许选择 ' + group.ChooseGroupNumber + ' 件',
              icon: 'none',
              duration: 1000
            })
          }
        }
      }
    },
    getLastGoods () {
      // 汇总 所选商品
      let lastGoods = {}
      let materialList =[]
      let material = {}

        for (let i=0; i<this.packages[this.packageIndex].detail.length; i++) {
          material = {}
          let detail = this.packages[this.packageIndex].detail[i]
          if (detail.WinePresentSetChooseGroupID == '-1') {
            // 没有 可选商品
            material.PresentSetChooseGroupID = detail.WinePresentSetChooseGroupID
            material.WinePresentSetDetailID = detail.WinePresentSetDetailID
            material.MaterialID = detail.DetailMaterialID
            material.OrderNumber = detail.DetailNumber
            material.MaterialName = detail.MaterialName
            material.MaterialUnit = detail.MaterialUnit
            material.MaterialRequestName = detail.MaterialRequestName || ''
            materialList.push(material)
          } else {
            // 有 可选商品
            if (parseInt(detail.OrderNum) > 0) {
              material.PresentSetChooseGroupID = detail.WinePresentSetChooseGroupID
              material.WinePresentSetDetailID = detail.WinePresentSetDetailID
              material.MaterialID = detail.DetailMaterialID
              material.OrderNumber = detail.OrderNum
              material.MaterialName = detail.MaterialName
              material.MaterialUnit = detail.MaterialUnit
              material.MaterialRequestName = detail.MaterialRequestName || ''
              materialList.push(material)
            }
          }
        }
      lastGoods.WinePresentSetID = this.packages[this.packageIndex].WinePresentSetID
      // 所选 商品（该套餐）添加到购物车 的 id
      lastGoods.OnlineTempOrderID = this.onlineTempOrderID
      // 所选 商品（该套餐）数量 / 该 方案 OrderNumber
      lastGoods.Radio = parseInt(this.currentGood.OrderNumber / this.packages[this.packageIndex].OrderNumber)
      lastGoods.MaterialList = materialList
      return lastGoods
    },
    subAddCart () {
      // 子商品添加到购物车
      let lastGoods = this.getLastGoods()
      // 查询 套餐详情
      let that = this
      let data = {
        clouduserid: this.$store.state.clouduserid,
        requestInfo: lastGoods
      }
      util.wXrequest({
        url: this.$store.state.ip + '/onlinemarket_service/cart/subAddCart', 
        data: data,
        header: {
          'Content-Type':'application/json; charset=utf-8'
        },
        success(res) {
          if (res.data.code === '0'){
            // 子商品添加 成功
            wx.showToast({
              title: '添加购物车成功',
              icon: 'none',
              duration: 2000
            })
            // 更新购物车
            util.getCatalog()
            // 返回 商品列表
            wx.reLaunch({
              url: '/pages/good/main'
            })
          } else {
            // 子商品添加失败  执行删除 套餐
            util.delMymaterial()
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
    addCart () {
      this.$store.commit('setOnlineTempOrderID', 0)
      // 商品添加到 购物车，成功后 再添加 子商品
      util.addCart()
    }
  },
  created () {
    console.log('page--------单品商品详情')
  },
  mounted () {
    console.log('mounted--------单品商品详情')
    this.getPackage()
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"
div
  box-sizing border-box
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
  bottom 0px
  // bottom 70px
.header
  width 100%
  height 375px
.header img
  width 375px
  height 375px
// 可选方案
.cases
  width 375px
  overflow hidden
  box-sizing border-box
.caseBox
  white-space nowrap
.caseButton
  display inline-block
  border-radius: 18px
  padding-left: 15px
  padding-right: 15px
  font-size: 15px
  height: 30px
  line-height: 30px
  text-align: center
  color $yellow
.caseButton.active
  background: $yellow
  color: #fff
// 可选内容
.groupTip
  width: 100%
  height: 31px
  background: #e9c088
  line-height: 31px
  padding-left: 10px
  font-size: 12px
  color: #423c31
.groupItem
  position: relative
  width 375px
.groupTitle
  height: 30px
  line-height: 30px
  background: #423c31
  color: #cea16a
.groupCaret
  width 30px
  height 30px
  background url('../../../static/pullUp.png') no-repeat
  background-size 30px 30px
  background-position center center
.groupCaret.active
  background url('../../../static/pullDown.png') no-repeat
  background-size 30px 30px
  background-position center center
.chooseAll
  flex 0 0 25px
  width: 25px
  height: 50px
  background url('../../../static/unCheck.png')
  background-position left center
  background-size: 25px 25px
  background-repeat: no-repeat
.chooseAll.active
  background url('../../../static/check.png')
  background-position left center
  background-size: 25px 25px
  background-repeat: no-repeat
.subGoodName
  flex 1 1 auto
  padding-left 15px
.subCart
  flex 0 0 100px
// 不可选
.detailTip
  width: 100%
  height: 31px
  background: #e9c088
  line-height: 31px
  padding-left: 10px
  font-size: 12px
  color: #423c31

// 加入购物车
.addCart
  width: 80%
  height: 50px
  margin 25px auto
  background: #80858a
  color: #fff
  text-align: center
  line-height: 50px
  border-radius: 5px
.addCart.active
  background $yellow
  color #ffffff
// 购物车按钮
.shopcart
  // position absolute
  // right 6px
  // bottom 6px
  padding 3px 4px
.cartButton
  display flex
  justify-content space-between
.subCart
  padding 10px 0
  line-height 25px
.decrease
  // flex 1 1 24px
  width 30px
  height 25px
  background url('../../../static/remove.png') no-repeat
  background-size 24px 24px
.add
  // flex 1 1 24px
  width 24px
  height 24px
  background url('../../../static/add.png') no-repeat
  background-size 24px 24px
.goodNo
  line-height 24px
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