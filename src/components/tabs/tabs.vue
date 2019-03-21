<template>
  <div class='tabs'>
  	<div class='item'
  	 v-for="tab in tabs" 
  	 :class='{active: tab.typeId== type}'
  	 @click='checkout(tab.typeId)'
  	 >{{ tab.name }}</div>
  </div>
</template>

<script>
export default {
  name: 'tabs',
  props: {
  	type: {
  		type: Number,
  		default: 1
  	}
  },
  data() {
    return {
    	tabs: [
	    	{
	    		typeId: 1,
	    		name: '前菜'
	    	},
	    	{
	    		typeId: 2,
	    		name: '主菜'
	    	},
	    	{
	    		typeId: 3,
	    		name: '甜品'
	    	},
	    	{
	    		typeId: 4,
	    		name: '饮品'
	    	},
	    	{
	    		typeId: 5,
	    		name: '主厨推荐'
	    	}
    	]
    }
  },
  methods: {
  	checkout(type) {
  		console.log(type)
  	}
  }
}
</script>

<style lang="scss" scoped="">
.tabs {
	display: flex;
	height: 40px;
	line-height: 40px;
	color: white;
	font-size: 18px;
	justify-content: space-between;
	.item {
		position: relative;
		&.active:after {
			content: '';
			height: 2px;
			width: 100%;
			background: #b5a281;
			position: absolute;
			bottom: 0;
			left: 0;
		}
	}
}
</style>
