<template>
  <div class='car'>
    <transition name='slide'>
    <div class='contain' ref='listWrap' v-show='listShow'>
      <ul class="list">
        <li v-for='food in foods' :key='food.id'>
          <div class="name">{{ food.name }}</div>
          <div class='msg'>
            <div class="price"><span class='text'>&yen;&nbsp;</span>{{ food.price * food.num }}</div>
            <div class="control">
              <control :foodId='food.id' :num='food.num'  v-on:menu='menu'/>
            </div>
          </div>
        </li>
      </ul>
    </div>
    </transition>
    <div class='foot'>
      <div class="number" @click='showList'>
        <div class='shop'>
          <img src='/static/img/icon-2.jpg' />
          <span class='totleNum' v-show='numShow'>{{ totleNum }}</span>
        </div>
        <span class='yen'>&yen;</span>{{ totle }}
      </div>
      <div class="btn"><btn :text='btnText' :type='btnType' :url='btnUrl'/></div>
    </div>
    
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import control from '@/components/shopcar/control.vue'
import btn from '@/components/btn/btn.vue'

export default {
  name: 'car',
  props: {
  	foods: {
  		type: Array,
  		default: []
  	}
  },
  created(){
    this.$nextTick(() => {
      this.__initScroll();
    });
  },
  computed: {
    totle() {
      let totle = 0;
      this.foods.map(food => {
        totle += food.num * food.price;
      });
      return totle;
    },
    totleNum() {
      let num = 0;
      this.foods.map(food => {
        num += food.num;
      });
      if (num <= 0) {
        this.listShow = false;
        this.numShow = false;
      } else {
        this.numShow = true;
      }
      return num;
    }
  },
  updated() {
  },
  data() {
    return {
      pos: {},
      menuScroll: {},
      btnText: '下单',
      btnType: 1,
      btnUrl: '/',
      listShow: false,
      numShow: false
    }
  },
  methods: {
    __initScroll() {
      this.menuScroll = new BScroll(this.$refs.listWrap,{
        probeType: 3,
        click: true
      });
      this.menuScroll.on('scroll', (pos) => {
        this.pos = pos;
        console.log(pos)
      });
    },
  	menu(type, foodid) {
      this.$emit('menu', type, foodid)
    },
    showList() {
      if (this.totleNum > 0){
        this.listShow = !this.listShow;
      }
    }
  },
  components: {
  	control,
    btn
  }
}
</script>

<style lang="scss" scoped="">
.car {
	width: 100%;
	height: 64px;
	background: $car-bg;
  align-items: center;
  justify-content: space-between;
  .contain {
    margin: 0;
    padding: 0;
    border-top: 2px solid $orange;
    background: #272530;
    max-height: 240px;
    overflow: hidden;
    transform: translate3d(0,-100%,0);
    &.slide-enter-active, &.slide-leave-active{
      transition: all 0.3s
    }
    &.slide-enter, &.slide-leave-to{
      transform: translate3d(0,0,0);
    }
    .list {
      margin: 0;
      padding: 0;
      li {
        display: flex;
        padding: 0 24px;
        height: 60px;
        align-items: center;
        .name {
          color: white;
          width: 50%;
          font-size: 18px;
          flex: 1 1 auto;
        }
        .msg {
          width: 50%;
          flex: 1 1 auto;
          padding-right: 14px;
          display: flex;
          justify-content: space-between;
          .price {
            font-size: 20px;
            color: $orange;
            .text {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
  .foot {
    display: flex;
    font-size: 24px;
    color: $orange;
    background: $car-bg;
    .number {
      height: 64px;
      line-height: 64px;
      box-sizing: border-box;
      flex: 1 1 269px;
      padding-left: 38px;
      .shop{
        position: relative;
        display: inline-block;
        .totleNum {
          position: absolute;
          top: 2px;
          left: 18px;
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          color: white;
          font-size: 10px;
          background: #f73a38;
          border: 2px solid $car-bg;
          border-radius: 50%;
        }
        img {
          width: 32px;
          position: relative;
          top: 4px;
        }
      }
      .yen {
        font-size: 16px;
        margin:0 6px;
      }
    }
    .btn {
      width: 145px;
      height: 64px;
      background: $orange;
      flex: 1 1 145px;
    }
  }
  
}
</style>
