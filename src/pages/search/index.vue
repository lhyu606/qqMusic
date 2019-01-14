<template>
  <div>
    <div>
      <logo></logo>
      <navi :tab="tab"  v-on:changeTab='changeTab'></navi>
    </div>
    <div class="search-box" :class='{inputing: isInputing}'>
      <input type="" name="" class="search-ipt" placeholder="搜索歌曲、歌单、专辑" v-on:focus='inputing' v-model='keyword' @confirm="searchSong">
      <img src="/static/search-icon.png" class='search-icon'>
      <div class="delWord" @click='delWord' v-if='isDelWord'>
        <div class="leftDel"></div>
        <div class="rightDel"></div>
      </div>
      <div @click='cancel' class="cancel" v-if="showCancel">取消</div>
      <!-- 搜索记录 -->
      <div class="search-history" v-if='showHistory'>
        <ul>
          <li class="history" v-for="(item, key) in sHistory" :key='key'>
            <img src="/static/clock_ic.png" class="clock-ic">
            <span class="text" @click='getSong(item)'>{{ item }}</span>
            <span class="del" @click='delHistory(key)'><img src="/static/delete.png" class="del-img"></span>
          </li>
        </ul>
        <div class="clr-history">清除搜索记录</div>
      </div>
      <!-- 查询结果 -->
      <div class="search-result" v-if='showResult'>
        <ul>
          <li class="song" v-for='(song, idx) in songs' :key='idx'>
            <img src="/static/music_fu.png" class="music-fu">
            <div class="author">{{ song.au }}</div>
            <div class="desc">{{ song.songname }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="hot-search">
      <div class="title">热门搜索</div>
      <div class="hot-word">
        <div v-for="(word, index) in hotKeys" class="word" :key='index' v-if='word' @click='getSong(word.k)'>
          {{ word.k }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import logo from '@/components/logo'
import navi from '@/components/navi'
import { getRandomSubArr } from '@/utils/index'

export default {
  props: [],
  data () {
    return {
      isInputing: false,
      showCancel: false,
      keyword: '',
      isDelWord: false,
      hotKeys: [],
      tab: 'search',
      showHistory: false,
      sHistory: ['once time'],
      showResult: false,
      songs: [{
        au: '昔染',
        songname: '你会遇见更好的人'
      },{
        au: '胡夏/郁可唯',
        songname: '知否知否'
      },{
        au: '林俊杰',
        songname: '不为谁而作的歌'
      }],
    }
  },
  components: {
    logo, navi
  },
  methods: {
    inputing () {
      this.isInputing = true;
      this.showCancel = true;
      this.showHistory = true;
      if (this.keyword.length > 0) {
        this.isDelWord = true;
      } else {
        this.isDelWord = false;
      }
    },
    cancel () {
      this.isInputing = false;
      this.showCancel = false;
      this.showHistory = false;
      this.showResult = false;
      this.isDelWord = false;
    },
    searchSong (event) {
      var value = event.target.value;
      if (value == '') {
        return;
      }
      this.sHistory.unshift(value);
      if (this.sHistory.length > 8) {
        this.sHistory.pop();
      }
      this.showResult = true;
    },
    saveHistory () {
      var searchHistory = JSON.stringify(this.sHistory);
        wx.setStorage({
          key: 'searchHistory',
          data: searchHistory,
          success: (result) => {
            console.log('saved')
          }
        });
    },
    delHistory (index) {
      this.sHistory.splice(index, 1);
    },
    delWord () {
      this.keyword = '';
      this.isDelWord = false;
      this.showHistory = true;
      this.showResult = false;
    },
    getSong (keyword) {
      // console.log('do ajax to get songs....');
      this.keyword = keyword;
      this.showHistory = false;
      this.showResult = true;
    }
  },
  created () {
    wx.request({
      url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=1439140153&uin=390748606&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1547201693152',
      dataType: 'json',
      success: (res) => {
        var result = res.data.data.hotkey;
        this.hotKeys = getRandomSubArr(result, 8);
      }
    });
    // 从本地存储读取 搜索记录
    var that = this;
    wx.getStorage({
      key: 'searchHistory',
      success: (res) => {
        that.sHistory = JSON.parse(res.data);
      },
      fail(e){
        // 如果没有记录，就新建
        that.saveHistory ();
      }
    })
  },
  onUnload() {
    this.saveHistory ();
  }
}
</script>

<style scoped>
.search-box{
  position: relative;
  padding: 20rpx;
  background: #f4f4f4;
  height: 72rpx;
}
.search-box.inputing{
  padding-right: 112rpx;
}
.search-ipt{
  box-sizing: border-box;
  padding: 14rpx 24rpx 18rpx 64rpx;
  apperance: none;
  outline: none;
  width: 100%;
  height: 72rpx;
  line-height: 104rpx;
  color: rgba(0,0,0,.3);
  font-size: 28rpx;
  background: #fff;
  vertical-align: middle;
  border-radius: 8rpx;
}
.search-icon{
  position: absolute;
  top: 36rpx;
  left: 36rpx;
  width: 36rpx;
  height: 36rpx;
}
.delWord{
  position: absolute;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: #b1b1b1;
  top: 40rpx;
  right: 136rpx;
  z-index: 1000;
}
.leftDel{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20rpx;
  height: 4rpx;
  transform: translate(-50%, -50%) rotate(45deg);
  background: #ffffff;
}
.rightDel{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20rpx;
  height: 4rpx;
  transform: translate(-50%, -50%) rotate(-45deg);
  background: #ffffff;
}
.cancel{
  position: absolute;
  top: 20rpx;
  right: 10rpx;
  width: 56rpx;
  height: 72rpx;
  line-height: 72rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #555;
}
.hot-search{
  padding: 30rpx;
}
.title{
  color: rgba(0,0,0,.6);
  margin-bottom: 16rpx;
  font-size: 28rpx;
}
.hot-word{
  line-height: 60rpx;
  color: #000;
}
.word{
  display: inline-block;
  padding: 0 20rpx;
  margin: 0 28rpx 20rpx 0;
  font-size: 28rpx;
  border: 1px solid rgba(0,0,0,.6);
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  color: #000;
  border-radius: 30rpx;
}
.word:first-child{
  color: #fc4524;
  border: 1px solid #fc4524;
}
.search-history,.search-result{
  position: absolute;
  top: 112rpx;
  lef: 0rpx;
  right: 0rpx;
  width: 100%;
  min-height: 560rpx;
  background: #ffffff;
}
.clr-history{
  height: 88rpx;
  color: #47c88a;
  font-size: 24rpx;
  line-height: 88rpx;
  text-align: center;
}
.history{
  position: relative;
  padding: 0 30rpx;
  border-top: 1px solid #ededed;
  line-height: 88rpx;
}
.clock-ic{
  width: 40rpx;
  height: 40rpx;
  margin-right: 40rpx;
  vertical-align: middle;
}
.text{
  display: inline-block;
  vertical-align: middle;
  font-size: 28rpx;
  width: 560rpx;
  height: 88rpx;
}
.del{
  position: absolute;
  right: 40rpx;
  top: 22rpx;
  width: 40rpx;
  height: 40rpx;
  line-height: 40rpx;
}
.del-img{
  width: 40rpx;
  height: 40rpx;
  vertical-align: middle;
}
.song{
  position: relative;
  height: 110rpx;
  padding-left: 112rpx;
  border-top: 1px solid #ededed;
}
.music-fu{
  position: absolute;
  top: 36rpx;
  left: 36rpx;
  width: 44rpx;
  height: 40rpx;
}
.author{
  margin: 20rpx 0rpx 4rpx 0rpx;
  height: 36rpx;
  line-height: 36rpx;
  font-size: 32rpx;
}
.desc{
  color: #808080;
  height: 36rpx;
  font-size: 24rpx;
}
</style>
