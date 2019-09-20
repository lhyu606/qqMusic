import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import menu from '@/components/menu'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'login'
      }
    }, {
      path: '/home',
      name: 'home',
      component: (resolve) => {
        require(['@/components/home'], resolve)
      }
    }, {
      path: '/login',
      name: 'login',
      component: (resolve) => {
        require(['@/components/login'], resolve)
      }
    }, {
      path: '/menu',
      name: 'menu',
      component: (resolve) => {
        require(['@/components/menu'], resolve)
      }
    }, {
      path: '*',
      redirect: {
      	name: 'home'
      }
    }
  ]
})
