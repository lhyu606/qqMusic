import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home/home.vue'
import plan from '@/components/plan/plan.vue'
import menu from '@/components/menu/menu.vue'
import concat from '@/components/concat/concat.vue'
import location from '@/components/location/location.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/plan',
      name: 'plan',
      component: plan
    },
    {
      path: '/menu',
      name: 'menu',
      component: menu
    },
    {
      path: '/concat',
      name: 'concat',
      component: concat
    },
    {
      path: '/location',
      name: 'location',
      component: location
    }
  ]
})
