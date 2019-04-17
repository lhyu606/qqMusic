<template>
  <div>
    <div id="mychart" class='mychart'></div>
    <div id="mychart2" class='mychart'></div>
  </div>
 
</template>

<script>
let option = {
    title: {
        text: '百度热词',//标题
        x: 'center',
        textStyle: {
            fontSize: 23
        }
 
    },
    backgroundColor: '#F7F7F7',
    tooltip: {
        show: true
    },
    series: [{
        name: '百度热词',//数据提示窗标题
        type: 'wordCloud',
        sizeRange: [6, 66],//画布范围，如果设置太大会出现少词（溢出屏幕）
        rotationRange: [-45, 90],//数据翻转范围
        shape: 'circle',
        textPadding: 0,
        autoSize: {
            enable: true,
            minSize: 6
        },
        textStyle: {
            normal: {
                color: function() {
                    return 'rgb(' + [
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160)
                    ].join(',') + ')';
                }
            },
            emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
            }
        },
        data: [
          ]
        //name和value建议用小写，大写有时会出现兼容问题
    }]
};
console.log(option)
require('echarts-wordcloud');

export default {
  name: 'HelloWorld',
  data () {
    return {
      people: [],
      searches: []
    }
  },
  created() {
    let rc = this.axios.get('/api/getReci')
      .then( (res) => {
        for (let i=0; i<10; i++) {
          let obj = {};
          obj.name = res.data.list[i].keyword;
          obj.value = res.data.list[i].searches;


          option.series[0].data.push(obj);
          this.people.push(res.data.list[i].keyword);
          this.searches.push(res.data.list[i].searches);
        }
        this.drawLine();
      } );
  },
  mounted() {
    
    
  },
  methods: {
    drawLine() {
      let mychart = this.$echart.init(document.getElementById('mychart'))
      console.log(this.people)
      console.log(this.searches)
      mychart.setOption({
        title: { text: '热词搜索' },
        tooltip: {},
        yAxis: {
          data: this.people//['北京', '上海', '深圳', '广州', '南京', '天津']
        },
        xAxis: {
          name: '搜索频次'
        },
        series: [{
          name: '热度',
          type: 'bar',
          data: this.searches//[10, 30, 50, 20, 60, 2000]
        }]
      });

      let mychart2 = this.$echart.init(document.getElementById('mychart2'))
      console.log(option)
      mychart2.setOption(option);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mychart{
  width: 100%;
  height: 300px;
}
</style>
