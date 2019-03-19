<template>
  <div class=''>
    <transition name='slide'>
      <div id="side" v-show='sideShow' @click='hideSide' >
        <ul>
          <li><router-link to='/plan'>我的预定</router-link></li>
          <li><router-link to='/menu'>我的菜单</router-link></li>
          <li><router-link to='/concat'>联系主厨</router-link></li>
          <li><router-link to='/location'>餐厅位置</router-link></li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'Side',
  props: {
    sideShow: {
      type: Boolean
    }
  },
  data() {
    return {
      
    }
  },
  methods: {
    hideSide () {
      this.$emit('hideSide');
    }
  }
}
</script>

<style lang="scss" scoped="">

#side{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  background: $side-bg;
  width: 280px;
  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.4s ease-in-out;
  }
  &.slide-enter, &.slide-leave-to{
    transform: translate3d(-100%,0,0);
  }
}
ul {
  margin: 80px 0 0 50px;

  li {
    list-style-type: none;
    height: 80px;
    a {
      display: block;
      position: relative;
      color: $font-color;
      font-size: 20px;
      padding-left: 40px;
      line-height: 80px;
      text-decoration: none;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 40px;
      }
    }
    &:nth-child(1) a:before {
      background: url('../../common/img/icon-1.jpg') no-repeat 0px 20px;
      background-size: 30px 30px;
    }
    &:nth-child(2) a:before {
      background: url('../../common/img/icon-2.jpg') no-repeat 0px 20px;
      background-size: 30px 30px;
    }
    &:nth-child(3) a:before {
      background: url('../../common/img/icon-3.jpg') no-repeat 0px 20px;
      background-size: 30px 30px;
    }
    &:nth-child(4) a:before {
      background: url('../../common/img/icon-4.jpg') no-repeat 0px 20px;
      background-size: 30px 30px;
    }
  }
}
</style>
