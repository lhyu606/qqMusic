/**
 * Created by Administrator on 2017-04-07.
 */
export default {
	clearOrderHistoryWaitPay ({ commit }) {
		commit('CLEAR_ORDER_HISTORY_WAIT_PAY')
	},
	setECardId ({ commit, state }, item) {
		commit('SET_E_CARD_ID', {item})
	}
}
