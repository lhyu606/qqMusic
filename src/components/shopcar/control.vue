<template>
  <div class='control'>
    <transition name='slide1'>
    <span class='reverse btn' @click.stop='reverse' v-show='show'>-</span>
    </transition>
    <transition name='slide2'>
    <span class='num'  v-show='show' >{{ num }}</span>
    </transition>
    <span class='add btn' @click.stop='add'> +</span>
  </div>
</template>

<script>
export default {
  name: 'control',
  props: {
  	foodId: {
  		type: Number,
  		default: 0
  	},
    num: {
      type: Number,
      default: 0
    },
    isinScroll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    	
    }
  },
  computed: {
    count() {
      return this.num;
    },
    show() {
      if (this.num > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
  	add(event) {
      if(!event._constructed && this.isinScroll){
          return;
        }
  		if (this.num >= 100) {
  			return;
  		}
  		//this.num++;
      this.$emit('menu', '+', this.foodId);
  	},
  	reverse(event) {
      if(!event._constructed && this.isinScroll){
          return;
        }
  		if (this.num <= 0) {
  			return;
  		}
	  	//this.num--;
      this.$emit('menu', '-', this.foodId);
    }
  },
}
</script>

<style lang="scss" scoped="">
.control {
	position: relative;
	width: 90px;
	height: 24px;
	text-align: center;
	color: $orange;
	white-space: nowrap;
	.btn {
		display: inline-block;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: 1px solid $orange;
		vertical-align: middle;
    font-size: 28px;
    box-sizing: border-box;
	}
	.add {
    position: absolute;
    top: 0;
    right: 0;
    padding-left: 2px;
		background: $orange;
    line-height: 20px;
    font-size: 24px;
		color: $card-bg;
	}
  .reverse {
    position: absolute;
    top: 0;
    right: 0;
    line-height: 18px;
    color: $orange;
    transform: translate3d(-64px,0,0);
    &.slide1-enter-active, &.slide1-leave-active{
      transition: all 0.3s
    }
    &.slide1-enter, &.slide1-leave-to{
      transform: translate3d(0,0,0) rotate(180deg);
      opacity: 0;
    }
  }
	.num {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
		display: inline-block;
		font-size: 20px;
    line-height: 24px;
    transform: translate3d(-24px,0,0);
    &.slide-enter-active, &.slide-leave-active{
      transition: all 0.3s
    }
    &.slide-enter, &.slide-leave-to{
      transform: translate3d(0,0,0) rotate(180deg);
      opacity: 0;
    }
	}
}
</style>
