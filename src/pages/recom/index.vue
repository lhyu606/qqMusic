<template>
  <div class="recom-box">
    <div>
      <logo></logo>
      <navi :tab="tab"  v-on:changeTab='changeTab'></navi>
    </div>
    <div>
      <swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="1000">
          <block v-for="(item, index) in slider" :index="index" :key="key">
              <swiper-item>
                  <image :src="item.picUrl" class="slide-image" mode="aspectFill"/>
              </swiper-item>
          </block>
      </swiper>
    </div>
    <!-- 电台 -->
    <div class="wraper">
      <div class="title">
        电台
      </div>
      <div class="card-contain">
        <ul>
          <li v-for="(radio, key) in radioList" :key="key" :index='key' class="radio">
            <div class="img-contain">
              <img :src='radio.picUrl' class="img">
              <span class="start"><img src="/static/start.png" class="click-img"></span>
            </div>
            <div class="text">
              <p class="ftitle">{{ radio.Ftitle }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 热门歌单 -->
    <div class="wraper">
      <div class="title">
        热门歌单
      </div>
      <div class="card-contain">
        <ul>
          <li v-for="(song, key) in songList" :key="key" :index='key' class="radio">
            <div class="img-contain">
              <img :src='song.picUrl' class="img">
              <span class="start"><img src="/static/start.png" class="click-img"></span>
            </div>
            <div class="text">
              <p class="desc">{{ song.songListDesc }}</p>
              <p class="author">{{ song.songListAuthor }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 去客户端发现更多好音乐 > -->
    <div class="list-mroe">
      <p>去客户端发现更多好音乐 ></p>
    </div>
    <!-- footer -->
    <foot></foot>
  </div>
</template>
<script>
import logo from '@/components/logo'
import navi from '@/components/navi'
import foot from '@/components/foot'

export default {
  data () {
    return {
      hotMusic: {},
      tab: 'recom',
      MusicJsonCallback: function (data) {
        this.hotMusic = data.topList;
        // console.log(this.hotMusic)
      },
      slider: {},
      radioList: {},
      songList: {},
    }
  },

  components: {
    logo, navi, foot
  },

  methods: {
    
  },
  created () {
    // 热门歌曲
    wx.request({
      url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
      dataType: 'json',
      success: (res) => {
        var data = res.data.data;
        this.slider = data.slider;
        this.radioList = data.radioList;
        this.songList = data.songList;
      }
    });
  }
}
</script>
<style scoped>
.recom-box{
  background: #f4f4f4;
}
.slide-image{width: 100%;height: 100%;}
.wraper{
  margin: 28rpx 20rpx 14rpx;
  font-size: 0;
}
.title{
  font-size: 32rpx;
  color: #000;
  height: 48rpx;
  line-height: 48rpx;
  margin-bottom: 22rpx;
}
.radio{
  background: #ffffff;
  margin: 0 16rpx 20rpx 0;
  width: 347rpx;
  display: inline-block;
}
.radio:nth-child(even){
  margin: 0 0 20rpx 0;
}
.img-contain{
  position: relative;
}
.img{
  width: 347rpx;
  height: 347rpx;
}
.start{
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  width: 48rpx;
  height: 48rpx;
  overflow: hidden;
  background: url('../../images/list_sprite.png') noreapt;
  background-size: 48rpx;
}
.click-img{
  width: 48rpx;
  height: 48rpx;
}
.text{
  padding: 5rpx 7rpx;
  color: #000;
  line-height: 36rpx;
  font-size: 24rpx;
}
.ftitle{
  height:72rpx;
}
.author, .desc{
  font-size: 28rpx;
  height: 42rpx;
  line-height: 42rpx;
  overflow: hidden;
}
.list-mroe{
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  text-align: center;
  color: rgba(0,0,0,.6);
}
</style>