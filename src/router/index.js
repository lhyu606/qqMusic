import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home/home.vue'
import plan from '@/components/plan/plan.vue'
import list from '@/components/list/list.vue'
import concat from '@/components/concat/concat.vue'
import location from '@/components/location/location.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/list',
      name: 'list',
      component: list
    },
    {
      path: '/plan',
      name: 'plan',
      component: plan
    },
    {
      path: '/',
      name: 'location',
      component: location
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
