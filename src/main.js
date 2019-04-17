// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'lib-flexible/flexible.js'
import router from './router'
import baiduMap from 'vue-baidu-map'

require('./mock.js')

Vue.use(baiduMap, {
  ak: 'RdG7yusbikqdcHMfPe1yR3YkS0xMh35y'
});
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
