<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ xData, msgTotals, clientTotals, activeClients } = {}) {
      this.chart.setOption({
        xAxis: {
          data: xData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 50,
          right: 50,
          bottom: 20,
          top: 50
          // containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          show: true,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        legend: {
          data: ['消息总条数', '注册设备个数', '活跃设备数'],
          icon: 'rect',
          left: '20'
        },
        series: [{
          name: '消息总条数',
          itemStyle: {
            normal: {
              color: '#FF7317',
              lineStyle: {
                color: '#FF7317',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: msgTotals,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '注册设备个数',
          itemStyle: {
            normal: {
              color: '#F3CC16',
              lineStyle: {
                color: '#F3CC16',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: clientTotals,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '活跃设备数',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#2062EA',
              lineStyle: {
                color: '#2062EA',
                width: 2
              }
              // areaStyle: {
              //   color: '#f3f8ff'
              // }
            }
          },
          data: activeClients,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
