<template>
  <div>
    <div class="logo">
      <img src="/static/logo.png" class="img">
      <span class="download">下载APP</span>
    </div>
  </div>
</template>

<script>
export default {
  props: []
}
</script>

<style scoped>
.logo {
  background: #31c27c;
  height: 88rpx;
  position: relative;
}
.img{
  margin: 18rpx 0 0 20rpx;
  width: 180rpx;
  height:50rpx;
}
.download{
  position: absolute;
  top:16rpx;
  right:20rpx;
  font-size:28rpx;
  background:#149c5a;
  height:56rpx;
  padding: 0 24rpx;
  line-height:56rpx;
  border-radius:198rpx;
  color:#fff;
}
</style>
