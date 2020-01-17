<script>
export default {
  created () {
    // 获取设备信息
    this.getSystemInfoSync()
  },
  mounted () {
  },
  methods: {
    getSystemInfoSync() {
      // 获取微信窗口信息
      let systemInfo = wx.getSystemInfoSync()
      this.$store.commit('setSystemInfo', systemInfo)
    }
  }
}
</script>

<style>
page {
  min-height: 100%;
  background: #201c19;
}
page::before {
  content: '';
  display: table;
}
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0 0;
  box-sizing: border-box;
  overflow: hidden;
}
/* this rule will be remove */
div, p, span {
  /*transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;*/
  box-sizing: border-box;
  font-weight: 400
}
</style>
