<template>
  <div class="contain">
    <div class="header">
      
    </div>
  </div>
</template>
<script>



export default {
  data () {
    return {

    }
  },

  components: {
    
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
    console.log(this.$store.state.ip)
    console.log(this.$store.state.ip)
  }
  
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../stylus/common.styl"

.header 
  width 750rpx
  backgroud $themeColor
  height 200rpx
</style>