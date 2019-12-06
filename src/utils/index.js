import Vue from 'vue'
import store from './../store/index'

// 获取 数据类型
function getDataType (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}
// 补足两位
function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}
// 格式化 时间
export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}
// 从数组元素中 随机获取 任意长度 数组 
export function getRandomSubArr (arr, length) {
  var nArr = [];
  var cpArr = copyArr(arr);
  var len = arr.length;
  for (var i=0; i<length; i++) {
    var idx = randomNum(0, cpArr.length);
    nArr.push(cpArr.slice(idx, idx+1)[0]);
  }
  return nArr;
}
// 随机数（最小 Min 到  最大 max）
function randomNum (min, max) {
  return parseInt(Math.random() * (max - min + 1)) + min;
}
// 浅复制 数组
function copyArr (arr) {
  var nArr = [];
  for (var i=0, length=arr.length; i<length; i++) {
    nArr.push(arr[i]);
  }
  return nArr;
}

// data 对象转 emulateJSON true 字符串，模拟 emulateJSON true
function emulateJSON (obj, first = '') {
  let result = []
  let item = ''
  for (let key in obj) {
    if (Object.prototype.toString.call(obj[key]).slice(8, -1) === 'Object') {
      result.push(emulateJSON(obj[key], key))
    } else {
      if (first == '') {
        item = '' + key + '=' + obj[key]
      } else {
        item = first + '[' + key + ']=' + obj[key]
      }
      result.push(item)
    }
    
  }
  return result.join('&')
}

/* 封装微信 http 请求 */
function wXrequest({
  url, 
  data={}, 
  header={
    'content-type': 'application/x-www-form-urlencoded'
  },
  method='post',
  success=()=>{},
  fail=()=>{
    console.log(res)
  },
  title= '加载中...'
}) {
  // 显示 加载中
  wx.showLoading({
    title: title,
    mask: true
  })
  wx.request({
    url: url, 
    data: data,
    header: header,
    method: method,
    success(res) {
      // 结束加载
      wx.hideLoading()
      success(res)
    },
    fail (res) {
      // 结束加载
      wx.hideLoading()
      fail(res)
    }
  })
}


/*获取当前页url*/
function getCurrentPageUrl(){
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length-1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    return url
}
/*获取当前页 参数*/
function getCurrentPageOptions(){
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length-1]    //获取当前页面的对象
    var url = currentPage.options    //当前页面 参数
    return url
}
/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs(){
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length-1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var options = currentPage.options    //如果要获取url中所带的参数可以查看options
    
    //拼接url的参数
    var urlWithArgs = url + '?'
    for(var key in options){
        var value = options[key]
        urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length-1)
    
    return urlWithArgs
}
 
/* 更新购物车 */ 
function getCatalog () {
  wXrequest({
    url: store.state.ip + '/onlinemarket_service/cart/getCatalog',
    data: {
      clouduserid: store.state.clouduserid
    },
    header: {
      'Content-Type':'application/json; charset=utf-8'
    },
    success (res) {
      if (res.data.code === '0') {
        _sortCartList(res.data.result.list)
        _updateCurrentGoods()
        // store.commit('setCartList', res.data.result.list)
        store.commit('setCartTotalMoney', res.data.result.totalMoney)
      }
    }
  })
}
/* 分类 处理 购物车数据 */ 
function _sortCartList (list) {
  let result = []
  for (let i=0,len=list.length; i<len; i++) {
    let item = list[i]
    // 口味去掉 最后 【,】
    // item.MaterialRequestName = item.MaterialRequestName.slice(0, -1)
    // 计算单个商品 总价
    item.totalPrice = parseFloat(item.OrderNumber * item.SellPrice)
    if (!result[item.MaterialSortID]) {
      // 有该没有该分类分类
      Vue.set(result, item.MaterialSortID, [])
    }
    Vue.set(result[item.MaterialSortID], item.MaterialID, item)
  }
  store.commit('setCartList', result)
  // console.log('更新购物车结果')
  // console.log(store.state.cartList)
  _updateCurrentGoods()
}
/* 购物车更新后 处理当前展示商品 */
function _updateCurrentGoods () {
  let goods = store.state.goods
  let cartList = store.state.cartList
  if (goods.length === 0) {
    // 如果为空，不做处理
    return false
  } else {
    for (let i=0; i<goods.length; i++) {
      let good = goods[i]
      if (!good.sort_request) {
        good.sort_request = []
      }
      if (!good.Picture) {
        good.Picture = []
      }
      if (cartList[good.MaterialSortID] && cartList[good.MaterialSortID][good.MaterialID]) {
        // 购物车里有 该商品
        goods[i].OrderNumber = cartList[good.MaterialSortID][good.MaterialID].OrderNumber
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
    // 处理完，存储回去
    store.commit('setGoods', goods)
    // console.log('购物车更新后 处理当前展示商品')
    // console.log(store.state.goods)
  } 
}
/* 确认口味 */
function comfirmCombo () {
  // 购物车 有该商品，则更新购物车（/cart/updateCart），否则，添加购物车（/cart/addCart）
  let currentGood = store.state.currentGood
  let cartList = store.state.cartList
  if (!cartList[currentGood.MaterialSortID] || !cartList[currentGood.MaterialSortID][currentGood.MaterialID]) {
    // 没有 该商品 更新购物车
    console.log('确认口味，没有该商品')
    addCart()
  } else {
    // 有 该商品 添加购物车
    console.log('确认口味，有该商品')
    // @param type 0: 数量减 1，1: 数量加 1，2: 口味变更
    updateCart(2)
  }
}
/* 更新购物车 【1 到 ∞ 或者 ∞ 到 1 或者 口味变更】*/
/* 
 * @param type 0: 数量减 1，1: 数量加 1，2: 口味变更
 */
function updateCart(type) {
  console.log('更新购物车')
  let currentGood = store.state.currentGood
  let cartGood = store.state.cartList[currentGood.MaterialSortID][currentGood.MaterialID]
  // 组织 口味
  let sort_request = ''
  if (type === 2) {
    for (let i=0,len=currentGood.sort_request.length; i<len; i++) {
      if (currentGood.sort_request[i].active) {
        sort_request += currentGood.sort_request[i].name + ','
      }
    }
  }
  console.log(currentGood, cartGood)
  
  // 请求参数
  let requestInfo = {}
  /*
   * OrderNumber  数量
   * OnlineTempOrderID 原购物车中 标识
   * MaterialRequestName  口味，数组 join(',')
   */
  requestInfo.MaterialRequestName = cartGood.MaterialRequestName
  if (type === 0) {
    requestInfo.OrderNumber = cartGood.OrderNumber - 1
  } else if (type === 1) {
    requestInfo.OrderNumber = cartGood.OrderNumber + 1
  } else {
    requestInfo.OrderNumber = cartGood.OrderNumber
    requestInfo.MaterialRequestName = sort_request
  }
  requestInfo.OnlineTempOrderID = cartGood.OnlineTempOrderID
  // 更新到购物车
  wXrequest({
    url: store.state.ip + '/onlinemarket_service/cart/updateCart',
    data: {
      clouduserid: store.state.clouduserid,
      requestInfo: requestInfo
    },
    header: {
      'Content-Type':'application/json; charset=utf-8'
    },
    success (res) {
      if (res.data.code === '0') {
        // 更新成功，刷新购物车
        getCatalog()
      } else {
        // 更新失败
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        }) 
      }
    }
  })
}
/* 添加购物车 【从 0 到 1，】*/
function addCart() {
  console.log('添加购物车')
  let currentGood = store.state.currentGood
  // 组织 口味
  let sort_request = ''
  console.log(currentGood)
  for (let i=0,len=currentGood.sort_request.length; i<len; i++) {
    if (currentGood.sort_request[i].active) {
      sort_request += currentGood.sort_request[i].name + ','
    }
  }

  // 请求参数
  /*
   * MaterialID             商品ID
   * OrderNumber            商品数量    (添加到购物车 均为 1)
   * MaterialRequestName    商品口味名称（没有填空串）
   * SellPrice              商品价格
   * WinePresentSetID       套餐赠送方案ID
   * OrderType              订单类型 1 场内订单 2 场外订单 (此处均为 1)
   * priceTypeId            商品价格类型Id
   * KmID                   会员卡ID（没有填空串）
   */
  let requestInfo = {
    MaterialID: currentGood.MaterialID,
    OrderNumber: 1,
    MaterialRequestName: sort_request,
    SellPrice: currentGood.SellPrice,
    WinePresentSetID: currentGood.WinePresentSetID || '0',
    OrderType: 1,
    priceTypeId: store.state.ecard.pricetypeid || 0,
    KmID: store.state.ecard.eCardId || ''
  }
  // 更新到购物车
  wXrequest({
    url: store.state.ip + '/onlinemarket_service/cart/addCart',
    data: {
      clouduserid: store.state.clouduserid,
      requestInfo: requestInfo
    },
    header: {
      'Content-Type':'application/json; charset=utf-8'
    },
    success (res) {
      if (res.data.code === '0') {
        // 更新成功，刷新购物车
        getCatalog()
        // 如果是套餐，添加 子商品 到购物车 /cart/subAddCart
        // 记录商品 在 购物车 id
        store.commit('setOnlineTempOrderID', res.data.result.OnlineTempOrderID)
        let currentGood = store.state.currentGood
        currentGood.OrderNumber = 1
        store.commit('setCurrentGood', currentGood)
        // 商品类型 0 普通商品 1 开房配送 2 固定套餐 3 可选套餐
        if (currentGood.MealType != 0) {
          store.commit('setPackageAddCart', true)
        }
      } else {
        // 更新失败
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        }) 
      }
    }
  })
}
/* 添加子商品到购物车 */
function subAddCart () {

}
/* 删除购物车 【从 1 到 0】  cart/delMymaterial*/
function delMymaterial() {
  console.log('删除购物车 【从 1 到 0】')
  let currentGood = store.state.currentGood
  let cartGood = store.state.cartList[currentGood.MaterialSortID][currentGood.MaterialID]
  // 请求参数
  /*
   * MaterialID             商品ID
   * OnlineTempOrderID      在线临时订单ID
   */
  let requestInfo = {
    MaterialID: cartGood.MaterialID,
    OnlineTempOrderID: cartGood.OnlineTempOrderID
  }
  // 删除购物车
  wXrequest({
    url: store.state.ip + '/onlinemarket_service/cart/delMymaterial',
    data: {
      clouduserid: store.state.clouduserid,
      requestInfo: requestInfo
    },
    header: {
      'Content-Type':'application/json; charset=utf-8'
    },
    success (res) {
      if (res.data.code === '0') {
        // 删除购物车成功，刷新购物车
        getCatalog()
      } else {
        // 删除购物车失败
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        }) 
      }
    }
  })
}
/* 清空购物车 cart/clearCart */
function clearCart () {
  // 删除购物车
  wXrequest({
    url: store.state.ip + '/onlinemarket_service/cart/clearCart',
    data: {
      clouduserid: store.state.clouduserid
    },
    header: {
      'Content-Type':'application/json; charset=utf-8'
    },
    success (res) {
      if (res.data.code === '0') {
        // 关闭 购物车列表
        store.commit('setClearCart', true)
        // 删除购物车成功，刷新购物车
        getCatalog()
      } else {
        // 删除购物车失败
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        }) 
      }
    }
  })
}
// 更新购物车 价格 /cart/updateCartPrice
function updateCartPrice () {
  // 删除购物车
  wXrequest({
    url: store.state.ip + '/onlinemarket_service/cart/updateCartPrice',
    data: {
      clouduserid: store.state.clouduserid,
      requestInfo: {
        priceTypeId: store.state.ecard.pricetypeid || 0,
        KmID: store.state.ecard.ecardid || ''
      }
    },
    header: {
      'Content-Type':'application/json; charset=utf-8'
    },
    success (res) {
      if (res.data.code === '0') {
        // 更新购物价格成功， 更新购物车
        getCatalog()
      } else {
        // 删除购物车价格失败
        wx.showToast({
          title: res.data.msg || '更新购物价格失败',
          icon: 'none',
          duration: 1000
        }) 
      }
    }
  })
}

export default {
  formatNumber,
  formatTime,
  getRandomSubArr,
  randomNum,
  copyArr,
  emulateJSON,
  wXrequest,
  getCurrentPageUrl,
  getCurrentPageOptions,
  getCurrentPageUrlWithArgs,

  getCatalog,
  comfirmCombo,
  addCart,
  delMymaterial,
  updateCart,
  clearCart,
  updateCartPrice
}
