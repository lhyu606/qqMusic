<template>
  <div class="menu" >
    <!-- 头部 -->
    <div class="head">
      <side :sideShow='sideShow' v-on:hideSide='showSide'/>
      <div class="nav-contain">
        <navi  v-on:showSide='showSide'/>
      </div>
      <div class='title'>菜单</div>
      <tabs :type='type' v-on:checkout='checkout'/>
    </div>
    <!-- 菜品列表 -->
    <div class="body" ref="menuContain">
      <div>
        <split />
        <foodcard v-for='(food, i) in foods' 
          :food='food' 
          :last='i==foods.length-1' 
          :key='food.id' 
          v-show='food.type == type'
          v-on:menu='menu'
          v-on:initScroll='__initScroll'
          v-on:foodMsg='foodMsg(food.id, food.num)'/>
      </div>
    </div>
    <!-- 菜品详情 -->
    <transition name='fade'>
    <div class='detail-box' v-show='showDetail' @click='hideFoodMsg'>
      <div class='condetail' @click.stop="">
        <div class='img-box'><img src='./../../common/img/cai.jpg'/></div>
        <div class='content'>
          <h4 class='name'>【 {{ detailFood.name }} 】</h4>
          <span class='text'>{{ detailFood.detail }}</span>
          <div class='control'>
            <control :isinScroll='isinScroll' :foodId='detailFood.id' :num='detailFood.num' v-on:menu='menu'/>
          </div>
        </div>
      </div>
    </div>
    </transition>
    <!-- 购物车 -->
    <div class="foot">
      <car :foods='SelectFoods' v-on:menu='menu'/>
    </div>
    
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
      type: 1,
      detailFood: {
        id: 1,
        name: '',
        detail: '',
        num: 0
      },
      showDetail: false,
      isinScroll: false
    }
  },
  created() {
  	api.getFoods('/api/getFoods', {})
  		.then(res => {
        this.foods = res.list;
  		});
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
      this.$nextTick(() => {
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
            if (type == '+') {
              food.num++;
            } else if (type == '-') {
              food.num--;
            }
          } else {
            this.$set(food, 'num', 1);
          }

          this.foodMsg(foodid, food.num);
        }
      });
    },
    checkout(type) {
      this.type = type;
    },
    foodMsg(foodid, num){
      this.showDetail = true;
      this.foods.map(food => {
        if (food.id == foodid) {
          this.detailFood.id = food.id;
          this.detailFood.name = food.name;
          this.detailFood.detail = food.detail;
          this.detailFood.num = food.num;
          return;
        }
      });
    },
    hideFoodMsg (event) {
      this.showDetail = false;
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
  .detail-box {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    background: rgba(7, 17, 27, 0.7);
    &.fade-enter-active, &.fade-leave-active{
      transition: all 0.3s;
      opacity: 1;
    }
    &.fade-enter, &.fade-leave-to{
      opacity: 0;
    }
    .condetail {
      @include menu-bg;
      width: 326px;
      height: 386px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 4px;
      overflow: hidden;
      color: white;
      .img-box {
        img {
          width: 326px;
        }
      }
      .content {
        padding: 15px 20px;
        line-height: 30px;
        .name {
          margin: 0;
          font-size: 18px;
          text-indent: -0.5em;
        }
        .text {
          font-size: 16px;
        }
        .control {
          margin-top: 10px;
          display: flex;
          flex-direction: row-reverse;
        }
      }
    }
  }
}
</style>
