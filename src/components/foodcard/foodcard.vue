<template>
  <div class='card-contain' @click='foodMsg'>
  	<div class='card'>
  		<div class='img'>
  			<!-- <img :src='food.img' /> -->
  			<img src='./../../common/img/cai.jpg'/>
  		</div>
  		<div class='detail'>
  			<div class='name'>{{ food.name }}</div>
  			<div class='bottom'>
  				<div class='price'><span class='yen'>&yen;</span>{{ food.price }}</div>
  				<div class='control'>
  					<control :isinScroll='isinScroll' :foodId='food.id' :num='food.num' v-on:menu='menu'/>
  				</div>
  			</div>
  		</div>
  	</div>
    <split />
  </div>
</template>

<script>
import split from '@/components/split/split.vue'
import control from '@/components/shopcar/control.vue'

export default {
  name: 'foodcard',
  props: {
  	food: {
  		type: Object,
  		default: {}
  	},
  	last: {
  		type: Boolean,
  		default: false
  	}
  },
  data() {
    return {
			isinScroll: true
		}
  },
  mounted() {
  	if (this.last) {
  		this.$nextTick(() => {
  			this.$emit('initScroll');
  		});
  	}
  },
  methods: {
  	menu(type, foodid) {
  		this.$emit('menu', type, foodid);
  	},
    foodMsg(){
      this.$emit('foodMsg', this.food.id, this.food.num);
    }
  },
  components: {
  	split,
  	control
  }
}
</script>

<style lang="scss" scoped="">
.card-contain {
	
}
.card {
	display: flex;
	height: 96px;
	background: $card-bg;
	border-radius: 4px;
	overflow: hidden;
	.img {
		width: 144px;
		height: 96px;
		img {
			width: 144px;
			height: 96px;
		}
	}
	.detail {
		padding: 12px 14px 14px;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.name {
			font-size: 16px;
			color: white;
		}
		.bottom {
			display: flex;
			justify-content: space-between;
			.price {
				color: $orange;
				font-size: 24px;
				.yen {
					font-size: 16px;
					margin-right: 2px;
				}
			}
		}
	}
}
</style>
