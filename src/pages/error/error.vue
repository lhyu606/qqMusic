<template>
    <div class="error">
        <div class="not-found"></div>
        <!-- <div class="not-found-text">微信公司对产品名称涉及色情文字、广告文字、敏感文字、涉政文字、灌水文字等进行严格审查监管，暂时关闭商城及票券等业务！如需开通，请联系业务人员并需要与视易公司签订不涉及上述违禁文字的承诺书后方可开通。</div> -->
        <div class="not-found-text">抱歉，商家未开通在线商城服务</div>
    </div>
</template>

<script>
	export default {
		data: function () {
            return {
                
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.error
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    background #ffffff
    text-align justify
    padding 40px 14px
    font-size 25px
    .not-found
        font-size 30px
        line-height 1.5
</style>
