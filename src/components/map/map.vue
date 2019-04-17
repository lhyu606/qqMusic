<template>
  <div class='map'>
      <baidu-map 
       :center='center'
       :zoom='zoom'
        ></baidu-map>
  </div>
</template>

<script>
export default {
  name: 'map',
  props: {

  },
  data() {
    return {
    	center: {
            lng: 118.10133,
            lat: 24.579342
        },
        zoom: 1
    }
  },
  computed: {
    
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped="">

</style>
