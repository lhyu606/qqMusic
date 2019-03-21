<template>
  <div class="menu" >
    <side :sideShow='sideShow' v-on:hideSide='showSide'/>
    <div class="nav-contain">
      <navi  v-on:showSide='showSide'/>
    </div>
    <div class='title'>菜单</div>
    <tabs :type='type'/>
    <split />
    <foodcard v-for='food in foods' :food='food' :key='food.id' v-on:menu='menu'/><split />
    <control :foodId='1'  v-on:menu='menu'/>
  </div>
</template>

<script>
import api from './../../axios/api.js'
import side from '@/components/side/side.vue'
import navi from '@/components/navi/navi.vue'
import tabs from '@/components/tabs/tabs.vue'
import foodcard from '@/components/foodcard/foodcard.vue'
import control from '@/components/shopcar/control.vue'
import car from '@/components/shopcar/car.vue'
import split from '@/components/split/split.vue'

// type tab 类型
// 1 前菜
// 2 主菜
// 3 饮品
// 4 甜品
// 5 主厨推荐
export default {
  name: 'list',
  data() {
    return {
      foods: [],
      sideShow: false,
      type: 5
    }
  },
  created() {
  	api.getFoods('/api/getFoods', {})
  		.then(res => {
        this.foods = res.list;
  			console.log(this.foods)
  		});
  },
  methods: {
  	showSide() {
      this.sideShow = !this.sideShow;
    },
    menu(type, foodid) {
      console.log(type, foodid)
    }
  },
  components: {
  	side,
  	navi,
    tabs,
    control,
    foodcard,
    split,
    car
  }
}
</script>

<style lang="sass">
.menu {
	@include menu-bg;
  padding: 0 24px 64px;
  position: relative;
  .nav-contain {
    position: absolute;
    top: 20px;
    left: 24px;;
    width: 24px;
    height: 18px;
  }
  .title {
    height: 56px;
    line-height: 56px;
    text-align: center;
    color: white;
    font-size: 24px;
  }
}
</style>
