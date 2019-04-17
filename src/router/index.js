import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import menu from '@/components/menu'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    }, {
      path: '/home',
      redirect: {
      	name: 'home'
      }
    }, {
      path: '/menu',
      name: 'menu',
      component: menu
    }, {
      path: '*',
      redirect: {
      	name: 'home'
      }
    }
  ]
})
