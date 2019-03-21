<template>
  <div class='control'>
    <span class='reverse btn' @click='reverse'>-</span>
    <span class='num' >{{ num }}</span>
    <span class='add btn' @click='add'>+</span>
  </div>
</template>

<script>
export default {
  name: 'control',
  props: {
  	foodId: {
  		type: Number,
  		default: 0
  	}
  },
  data() {
    return {
    	num: 0
    }
  },
  methods: {
  	add() {
  		if (this.num >= 100) {
  			return;
  		}
  		this.num++;
      this.$emit('menu', '+', this.foodId);
  	},
  	reverse(id) {
  		if (this.num <= 0) {
  			return;
  		}
	  	this.num--;
      this.$emit('menu', '-', this.foodId);
  	}
  }
}
</script>

<style lang="scss" scoped="">
.control {
	display: flex;
	justify-content: space-between;
	width: 90px;
	height: 24px;
	text-align: center;
	color: $orange;
	font-size: 28px;
	white-space: no-wrape;
	.btn {
		display: inline-block;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		border: 1px solid $orange;
		vertical-align: middle;
	}
	.add {
		background: $orange;
    line-height: 18px;
		color: $card-bg;
	}
  .reverse {
    line-height: 16px;
  }
	.num {
		display: inline-block;
		font-size: 20px;
    line-height: 24px;
	}
}
</style>
