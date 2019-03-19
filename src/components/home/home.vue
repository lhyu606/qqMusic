<template>
  <div id="home">
    <div class='mask'>
      <div class="nav" @click='showSide'>
        <div class='line'></div>
        <div class='line'></div>
        <div class='line'></div>
      </div>
      <div class='content'>
        <h1 class='hi'>嗨，</h1>
        <div v-if='state == 0'>
          <p>欢迎预约有间餐厅</p>
        </div>
        <div v-else>
          <p>感谢</p>
          <p>预约有间餐厅</p>
          <p>您预约了</p>
          <!-- <p class='time'>{{  }}月{{  }}日的{{  }}</p>-->
          <p class='time'>2 月 17 日的午餐</p>
          <p>主厨静候您的光临</p>
        </div>
      </div>
    </div>
    <side :sideShow='sideShow' v-on:hideSide='showSide'/>
  </div>
</template>

<script>
import side from '@/components/side/side.vue'

// state 为客户状态
// 0 初次登录，未约时间，未点菜
// 1 已约时间，未点菜
// 2 已约时间，已点菜
// 3 完成用餐
export default {
  name: 'home',
  data() {
    return {
      state: 0,
      sideShow: false
    }
  },
  methods: {
    showSide() {
      this.sideShow = !this.sideShow;
    }
  },
  components:{
    side
  }
}
</script>

<style lang="scss" scoped="">
#home {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index:0;
  background: url('../../common/img/home-bg.jpg') no-repeat;
  background-size: cover;
  .mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 56px 0 0 24px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 1));
  }
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
  .content {
    margin: 60px 0 0 36px;
    .hi {
      line-height: 76px;
      font-size: 30px;
      color: white;
    }
  }
}
</style>
