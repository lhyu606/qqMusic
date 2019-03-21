<template>
  <div class='car'>
  	<ul class="list">
		<li v-for='food in foods'>
			<div class="name">{{ food.name }}</div>
	  		<div class="price">&yen;{{ food.price * food.num }}</div>
	  		<div class="control">
	  			<control :foodId='1' :num='food.num'  v-on:menu='menu'/>
	  		</div>
		</li>
  	</ul>
    <div class="number"></div>
    <div class="btn"></div>
  </div>
</template>

<script>
import control from '@/components/shopcar/control.vue'

export default {
  name: 'car',
  props: {
  	foods: {
  		type: Array,
  		default: []
  	}
  },
  created(){
  	console.log('this.foods')
  	console.log(this.foods)
  	console.log('this.foods')
  },
  data() {
    return {}
  },
  methods: {
  	menu(type, foodid) {
      this.$emit('menu', type, foodid)
    },
  },
  components: {
  	control
  }
}
</script>

<style lang="scss" scoped="">
.car {
	width: 100%;
	height: 64px;
	background: $car-bg;
}
</style>
