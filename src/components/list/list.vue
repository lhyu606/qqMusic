<template>
  <div class="menu" >
    <div class="head">
      <side :sideShow='sideShow' v-on:hideSide='showSide'/>
      <div class="nav-contain">
        <navi  v-on:showSide='showSide'/>
      </div>
      <div class='title'>菜单</div>
      <tabs :type='type' v-on:checkout='checkout'/>
    </div>
    
    <div class="body" ref="menuContain">
      <div>
        <split />
        <foodcard v-for='(food, i) in foods' 
          :food='food' 
          :last='i==foods.length-1' 
          :key='food.id' 
          v-show='food.type == type'
          v-on:menu='menu'
          v-on:initScroll='__initScroll'/>
      </div>
    </div>
    <div class="foot">
      <car :foods='SelectFoods'/>
    </div>
    <control :foodId='1' :num='1'  v-on:menu='menu'/>
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
import BScroll from 'better-scroll'
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
  		});
      console.log('c')
      console.log(this.foods)
  },
  computed: {
    SelectFoods() {
      let selected = [];
      this.foods.map(food => {
        if (food.num >= 1) {
          selected.push(food);
        }
      });
      return selected;
    }
  },
  methods: {
    __initScroll() {
      this.$nextTick(() => {console.log('list')
          this.menuScroll = new BScroll(this.$refs.menuContain,{
            click: true
          });
        });
    },
  	showSide() {
      this.sideShow = !this.sideShow;
    },
    menu(type, foodid) {
      this.foods.map(food => {
        if (food.id == foodid) {
          if (food.num) {
            food.num++;
          } else {
            this.$set(food, 'num', 1);
          }
        }
      });
      console.log(type, foodid)
    },
    checkout(type) {
      this.type = type;
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
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
  .head {
    height: 106px;
  }
  .body {
    position: absolute;
    top: 106px;
    left: 24px;
    right: 24px;
    bottom: 64px;
    overflow: hidden;
  }
  .foot {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
  }
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
