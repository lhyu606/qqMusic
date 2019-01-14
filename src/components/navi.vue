<template>
  <div>
    <div class="nav">
      <a href="../recom/main" class="item" v-bind:class="[tab == 'recom' ? 'selected' : '']" open-type='redirect'>
      	推荐
      	<span class="line"></span>
      </a> 
      <a href="../topList/main" class="item" v-bind:class="[tab == 'topList' ? 'selected' : '']" open-type='redirect'>
      	排行榜<span class="line"></span>
      </a> 
      <a href="../search/main" class="item" v-bind:class="[tab == 'search' ? 'selected' : '']" open-type='redirect'>
      	搜索<span class="line"></span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['tab'],
  data () {
  	return {
  		choose: ''
  	}
  },
  methods: {
  	
  },
  created () {
  	
  }
}
</script>

<style scoped>
.nav {
  height: 80rpx;
  font-size: 0;
  background: #fff;
}
.item{
	display: inline-block;
	width:242rpx;
	height:80rpx;
	line-height: 72rpx;
	font-size: 32rpx;
	text-align: center;
	position: relative;
}
.line{
	display:none;
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 4rpx;
	background: #31c27c;
}
.selected .line{
	display: block;
}
</style>
