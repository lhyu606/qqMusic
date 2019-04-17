<template>
  <div class="map">
    <!-- 头部 -->
    <div class="head">
      <side :sideShow="sideShow" v-on:hideSide="showSide"/>
      <div class="nav-contain">
        <navi v-on:showSide="showSide"/>
      </div>
      <div class="title">餐厅位置</div>
    </div>
    <baidu-map class="map-contain" :center="center" :zoom="zoom" :scroll-wheel-zoom='scalable'>
      <BmMarker 
      :position="center" 
      :icon="{url: require('./img/icon.png'), size: {width: 39, height: 25}}"
      
      />
    </baidu-map>
  </div>
</template>

<script>
import side from "@/components/side/side.vue";
import navi from "@/components/navi/navi.vue";
import tabs from "@/components/tabs/tabs.vue";
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue';

export default {
  name: "location",
  props: {},
  data() {
    return {
      center: {
        lng: 118.100382,
        lat: 24.57832
      },
      zoom: 15,
      scalable: true, 
      sideShow: false,
      type: 1
    };
  },
  computed: {},
  methods: {
    showSide() {
      this.sideShow = !this.sideShow;
    },
    checkout(type) {
      this.type = type;
    }
  },
  components: {
    side,
    navi,
    tabs,
    BmMarker
  }
};
</script>

<style lang="scss" scoped="">
.map {
  @include menu-bg;
  padding: 0 24px 64px;
  position: relative;
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
  .head {
    width: 100%;
    height: 56px;
  }
  .body {
    position: absolute;
    top: 106px;
    left: 24px;
    right: 24px;
    bottom: 64px;
    overflow: hidden;
  }
  .foot {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
  }
  .nav-contain {
    position: absolute;
    top: 20px;
    left: 24px;;
    width: 24px;
    height: 18px;
  }
  .title {
    height: 56px;
    line-height: 56px;
    text-align: center;
    color: white;
    font-size: 24px;
  }
  .map-contain {
    // width: 100%;
    position: absolute;
    top: 56px;
    left: -24px;
    right: -24px;;
    bottom: 0;
  }
}
</style>
