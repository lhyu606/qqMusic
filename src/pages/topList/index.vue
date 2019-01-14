<template>
  <div class="music">
    <div>
      <logo></logo>
      <navi :tab="tab"  v-on:changeTab='changeTab'></navi>
    </div>
    <div class="music-warp">
      <div v-for="(mclass, key) in hotMusic" :key="key" :index='key' class="mcontain" @click=''>
        	<a href="" class="pic fl">
           <img :src="mclass.picUrl" class="img"> 
          </a>
          <div class="list fl">
            <h3 class="topTitle">{{ mclass.topTitle }}</h3>
            <div class="item" v-for="(song, idx) in mclass.songList" :key='idx' :data-index='idx'>
              <span class="ord">{{ idx }}</span>{{ song.songname }} - <span class="ord">{{ song.singername }}</span>
            </div>
          </div>
          <div class="caret"></div>
          <div class="clear"></div>
    	</div>
    </div>
    <a href="/pages/index/main" class="home">去往首页3</a>
  </div>
</template>
<script>
import logo from '@/components/logo'
import navi from '@/components/navi'

export default {
  data () {
    return {
      hotMusic: {},
      tab: 'topList'
    }
  },

  components: {
    logo, navi
  },

  methods: {
    
  },
  created () {
    // 获取 QQ 音乐
          wx.request({
            url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
            dataType: 'json',
            success: (res) => {
              var data = res.data;
              // 此处返回的是 jsonp 格式数据
              data = data.slice(18, -1);
              this.hotMusic = JSON.parse(data).data.topList;
            }
          })
  }
}
</script>
<style scoped>
.fl{float: left;}
.clear{clear: both;}
.music{
  background: #f4f4f4;
}
.music-warp{
  padding: 20rpx;
}
.mcontain{
  margin-bottom: 10px; 
  background: #fff;
  position: relative;
}
.img{width: 200rpx;height: 200rpx;}
.list{margin: 0 20rpx 0 30rpx;width: 460rpx;height: 184rpx;}
.topTitle{margin-bottom: 10rpx;font-size: 32rpx;height: 48rpx;line-height: 48rpx;}
.caret{
  position: absolute;
  right: 20rpx; 
  top:50%;
  border-top: 1rpx solid #b2b2b2;
  border-right: 1rpx solid #b2b2b2;
  width: 12rpx;
  height: 12rpx;
  transform: translateY(-6rpx) rotate(45deg);
}
.item{height:42rpx;line-height:42rpx;color:#000;font-size: 28rpx;white-space : nowrap}
.ord{color: rgba(0, 0, 0, 0.5);margin-right: 16rpx;}
</style>