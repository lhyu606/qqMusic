<template>
  <div class="footer">
    <div class="web-music">查看电脑版网页</div>
    <div><img src="/static/logo_footer.png" class="footer-img"></div>
    <div class="copyright">
    	<div>Copyright © 1998 - <span v-model="cprightYear">2019</span> Tencent. All Rights Reserved.</div>
    	<div>联系电话：0755-86013388 QQ群：55209235</div>
    </div>
  </div>
</template>

<script>
export default {
	data () {
		return {
			cprightYear: ''
		}
	},
	created () {
		var date = new Date();
	  	this.cprightYear = date.getFullYear();
	}
}
</script>

<style scoped>
.footer{
	padding: 30rpx 0;
	text-align: center;
}
.web-music{
	height: 36rpx;
	line-height: 36rpx;
	margin-bottom: 32rpx;
	font-size: 28rpx;
}
.footer-img{
	margin-bottom: 20rpx;
	width: 164rpx;
	height: 48rpx;
}
.copyright{
	font-size: 20rpx;
	height: 72rpx;
	color: rgba(0,0,0,.5);
}
</style>
