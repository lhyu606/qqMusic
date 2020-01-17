/**
 * Created by Administrator on 2019-10-30.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
// import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
let ip = ''
// 配置 打包 不同 环境 ['development', 'testing', 'production']
// npm run dev ==> 'yf'
// npm run build ==> 'sy'
// npm run build:test ==> 'test'
if (process.env.BUILD_ENV == 'development') {
  // 研发
  ip = 'https://yjyf.evideo.net.cn'
} else if (process.env.BUILD_ENV == 'testing') {
  // 测试
  ip = 'https://yjtest.evideo.net.cn'
} else if (process.env.BUILD_ENV == 'production') {
  // 生产
  ip = 'https://sy.evideo.net.cn'
}

const state = {
  appInView: false,            // 小程序 出现在 视窗

  systemInfo: {},             // 设备信息
  ip: ip,                     // 测试ip
  prevScene: '',              // 保存 前一次 绑定 卡台信息
	prevCodeType: '',              // 保存 前一次 绑定 卡台信息

  currentPage: '',            // 当前页面  
  hasMarketFunction: 0,      // 查询是否 拥有 在线商城权限，0 未查询，1 已查询 有权限，2 已查询 无权限
  headShopNo: '',             // 总店 id
  headShopNoChange: false,    // 总店 id 变化
  companyAndRoom: {},         // 分店和卡台

  scanQrTimer: null,          // 扫码动画 id
  roomSetting: {
    IsOpenOrderSheet: 1,
    IsOpenAfterPay: 1
  },                         // 是否后结，结账
  cloudMainAccount: '17750669325',  // 主账户 
  clouduserid: '',           // 业务 id
  tel: '',                   // 用户手机号（主账号）
  openid: '',                // openid

  goodsType: [],             // 所有商品类别
  menu: 1,                   // 当前商品类别下标
  prevMenu: -1,               // 先前 商品类别下标 （供搜索商品页使用）
  goods: [],                 // 当前类别所有商品
  ecard: {},                 // 当前会员卡
  cards: [],                 // 所有会员卡
  setPrimaryCard: false,     // 设置 主卡
  order: {},                 // 当前订单
  currentGood: {},           // 当前选中商品
  showCombo: false,          // 是否打开口味窗口
  mustOrder: [],             // 必点商品
  showMustOrder: false,      // 是否打开 必点商品

  showListBox: false,        // 购物车列表展示
  clearCart: false,          // 购物车列表是否 清空
  cartList: [],              // 购物车列表
  cartTotalMoney: 0,         // 购物车 总价
  dropBalls: [],             // 购物车小球
  dropBallId: 0,             // 小球 id
  onlineTempOrderID: 0,      // 最新 操作的 商品在购物车 id
  packageAddCart: false,     // 是否需要 套餐子商品添加 
  goodPageRefresh: true,     // 是否刷新 商品列表页 

  applyCard: {},             // 申请会员卡
  wxUserInfo: {},            // 微信 用户 信息
  unbindList: []             // 未 绑定卡 列表
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
    // plugins: [
    //     createPersistedState({
    //         storage: {
    //             getItem: key => wx.getStorageSync(key),
    //             setItem: (key, value) => wx.setStorageSync(key, value),
    //             removeItem: key => {}
    //         }
    //     })
    // ]
})
