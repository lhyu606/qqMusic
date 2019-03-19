<template>
  <div id="home">
    <div class='mask'>
      <div class="pdinner">
        <div class="nav" @click='showSide'>
          <div class='line'></div>
          <div class='line'></div>
          <div class='line'></div>
        </div>
        <div class='content'>
          <h1 class='hi'>嗨，</h1>
          <div v-if='state == 0' class="text">
            <p>欢迎预约有间餐厅</p>
          </div>
          <div v-else class="text">
            <p>感谢</p>
            <p>预约有间餐厅</p>
            <p>您预约了</p>
            <!-- <p class='time'><span class='time'>{{  }} 月 {{  }} 日的{{  }}</span></p>-->
            <p><span class='time'>2月17日的午餐</span></p>
            <p>主厨静候您的光临</p>
          </div>
        </div>
      </div>
      
      <div class="btns" :class="{ btnTop: !state }">
        <btn :text='btnText1' :type='1' :url='url1'/>  
        <btn v-if='state <= 1' :text='btnText2' :type='2' :url='url2' class="mt24"/>  
      </div>
    </div>
    <side :sideShow='sideShow' v-on:hideSide='showSide'/>
  </div>
</template>

<script>
import side from '@/components/side/side.vue'
import btn from '@/components/btn/btn.vue'

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
      sideShow: false,
      btnText1: '',
      btnText2: '',
      url1: '/home',
      url2: '/home',
    }
  },
  computed: {
  },
  created() {
    this.stateChange();
  },
  methods: {
    showSide() {
      this.sideShow = !this.sideShow;
    },
    stateChange() {
      if (this.state === 0) {
        this.btnText1 = '预约';
        this.btnText2 = '菜单';
        this.url1 = '/plan';
        this.url2 = '/menu';
      } else if (this.state === 1) {
        this.btnText1 = '餐厅位置';
        this.btnText2 = '联系主厨';
        this.url1 = '/home';
        this.url2 = '/home';
      } else if (this.state === 2) {
        this.btnText1 = '结账';
        this.url1 = '/home';
      }
    }
  },
  components:{
    side,
    btn
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
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 1));
    .pdinner {
      padding: 56px 0 0 24px;
    }
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
    letter-spacing: 4px;
    .hi {
      line-height: 46px;
      font-size: 30px;
      color: white;
    }
    .text {
      line-height: 56px;
      font-size: 24px;
      color: white;
      p {
        margin: 0;
        .time {
          padding: 0 10px 2px;
          vertical-align: middle;
          background: $btn-orange;
        }
      }
    }
  }
  .btns {
    margin-top: 80px;
    &.btnTop {
      margin-top: 306px;
    }
  }
}
</style>
