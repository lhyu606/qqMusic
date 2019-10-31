/**
 * Created by Administrator on 2019-10-30.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
let ip = ''
if (process.env.NODE_ENV == 'development') {
    ip = 'http://yjyf.evideo.net.cn'
}
const state = {
	ip: ip, // 测试ip
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
    plugins: [
        createPersistedState({
            storage: {
                getItem: key => wx.getStorageSync(key),
                setItem: (key, value) => wx.setStorageSync(key, value),
                removeItem: key => {}
            }
        })
    ]
})
