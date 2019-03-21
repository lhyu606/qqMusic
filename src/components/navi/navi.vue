<template>
  <div class="nav" @click='showSide'>
    <div class='line'></div>
    <div class='line'></div>
    <div class='line'></div>
  </div>
</template>

<script>
export default {
  name: 'navi',
  data() {
    return {
      
    }
  },
  methods: {
    showSide() {
        this.$emit('showSide');
    }
  }
}
</script>

<style lang="sass">
.nav {
    width: 24px;
    height: 18px;
    display: flex;
    flex-direction: column;
    align-content: space-between;
    .line {
    	height: 2px;
    	background: white;
    	margin-top: 6px;
    	&:nth-child(1) {
    		width: 16px;
        	margin-top: 0;
    	}
    	&:nth-child(2) {
    		width: 24px;
    	}
    	&:nth-child(3) {
        	width: 20px;
    	}
    }
}
</style>
