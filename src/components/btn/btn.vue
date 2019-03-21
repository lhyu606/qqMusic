<template>
  <div class="btn" :class="'btn'+type" @click='goto'>
    {{ text }}
  </div>
</template>

<script>

// type 按钮状态
// 1 主色
// 2 辅助色
export default {
  name: 'botton',
  props: {
  	text: {
      type: String,
      default: '1'
    },
  	type: {
      type: Number,
      default: 3
    },
    url: {
      type: String,
      default: '/home'
    }
  },
  data() {
    return {
      
    }
  },
  created() {
    // console.log(this.text, this.type);
  },
  methods: {
    goto() {
      this.$router.push(this.url)
    }
  }
}
</script>

<style lang="sass">
.btn {
	width: 356px;
	height: 56px;
  line-height: 56px;
  font-family: 'webfont-b';
  font-size: 20px;
  letter-spacing: 2px;
  color: white;
  text-align: center;
  margin: 0 auto;
}
.btn1 {
	border: 1px solid $orange;
	background: $orange;
}
.btn2 {
	border: 1px solid $grey;
	background: transparent;
}
</style>
