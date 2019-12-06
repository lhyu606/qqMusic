

const SET_APP_IN_VIEW = 'setAppInView'
const SET_SYSTEM_INFO = 'setSystemInfo'
const SET_CURRENT_PAGE = 'setCurrentPage'
const SET_CLOUDUSERID = 'setClouduserid'
const SET_TEL = 'setTel'
const SET_COMPANY_AND_ROOM = 'setCompanyAndRoom'
const SET_REFRESH_COMPANY_AND_ROOM = 'setRefreshCompanyAndRoom'
const SET_SCAN_QR_TIMER = 'setScanQrTimer'
const SET_ROOM_SETTING = 'setRoomSetting'
const SET_MENU = 'setMenu'
const SET_PREV_MENU = 'setPrevMenu'
const SET_ECARD = 'setEcard'
const SET_CARDS = 'setCards'
const SET_GOODSTYPE = 'setGoodsType'
const SET_GOODS = 'setGoods'
const SET_ORDER = 'setOrder'
const SET_CURRENT_GOOD = 'setCurrentGood'
const SET_SHOW_COMBO = 'setShowCombo'

const SET_SHOW_LIST_BOX = 'setShowListBox'
const SET_CLEAR_CART = 'setClearCart'
const SET_CART_LIST = 'setCartList'
const SET_CART_TOTAL_MONEY = 'setCartTotalMoney'
const SET_DROP_BALLS = 'setDropBalls'
const SET_DROP_BALL_ID = 'setDropBallId'
const SET_ONLINE_TEMP_ORDER_ID = 'setOnlineTempOrderID'
const SET_PACKAGE_ADD_CART = 'setPackageAddCart'
const SET_GOOD_PAGE_REFRESH = 'setGoodPageRefresh'

const SET_APPLY_CARD = 'setApplyCard'
const SET_WX_USER_INFO = 'setWxUserInfo'
const SET_UNBIND_LISE = 'setUnbindList'

export default {
	[SET_APP_IN_VIEW](state, payload) {
		state.appInView = payload
	},
	[SET_SYSTEM_INFO](state, payload) {
		state.systemInfo = payload
	},
	[SET_CURRENT_PAGE](state, payload) {
		state.currentPage = payload
	},
	[SET_CLOUDUSERID](state, payload) {
		state.clouduserid = payload
	},
	[SET_TEL](state, payload) {
		state.tel = payload
	},
	[SET_COMPANY_AND_ROOM](state, payload) {
		state.companyAndRoom = payload
	},
	[SET_REFRESH_COMPANY_AND_ROOM](state, payload) {
		state.refreshCompanyAndRoom = payload
	},
	[SET_SCAN_QR_TIMER](state, payload) {
		state.scanQrTimer = payload
	},
	[SET_ROOM_SETTING](state, payload) {
		state.roomSetting = payload
	},
	[SET_MENU](state, payload) {
		state.menu = payload
	},
	[SET_PREV_MENU](state, payload) {
		state.prevMenu = payload
	},
	[SET_ECARD](state, payload) {
		state.ecard = payload
	},
	[SET_CARDS](state, payload) {
		state.cards = payload
	},
	[SET_GOODSTYPE](state, payload) {
		state.goodsType = payload
	},
	[SET_GOODS](state, payload) {
		state.goods = payload
	},
	[SET_ORDER](state, payload) {
		state.order = payload
	},
	[SET_CURRENT_GOOD](state, payload) {
		state.currentGood = payload
	},
	[SET_SHOW_COMBO](state, payload) {
		state.showCombo = payload
	},
	[SET_SHOW_LIST_BOX](state, payload) {
		state.showListBox = payload
	},
	[SET_CLEAR_CART](state, payload) {
		state.clearCart = payload
	},
	[SET_CART_LIST](state, payload) {
		state.cartList = payload
	},
	[SET_CART_TOTAL_MONEY](state, payload) {
		state.cartTotalMoney = payload
	},
	[SET_DROP_BALLS](state, payload) {
		state.dropBalls = payload
	},
	[SET_DROP_BALL_ID](state, payload) {
		state.dropBallId = payload
	},
	[SET_ONLINE_TEMP_ORDER_ID](state, payload) {
		state.onlineTempOrderID = payload
	},
	[SET_PACKAGE_ADD_CART](state, payload) {
		state.packageAddCart = payload
	},
	[SET_GOOD_PAGE_REFRESH](state, payload) {
		state.goodPageRefresh = payload
	},
	[SET_APPLY_CARD](state, payload) {
		state.applyCard = payload
	},
	[SET_WX_USER_INFO](state, payload) {
		state.wxUserInfo = payload
	},
	[SET_UNBIND_LISE](state, payload) {
		state.unbindList = payload
	}
}
