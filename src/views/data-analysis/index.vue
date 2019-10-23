<template>
  <div class="data-analysis-container">
    <el-card shadow="never">
      <el-row class="statistics-wrapper">
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <div class="statistics-item">
            <p>注册设备个数</p>
<!--            <p>{{ totalMqClient }}</p>-->
            <p><countTo :startVal="0" :endVal='totalData.totalMqClient' :duration="3000"></countTo></p>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <div class="statistics-item">
            <p>活跃设备数</p>
<!--            <p>{{ activeMqClient }}</p>-->
            <p><countTo :startVal="0" :endVal='totalData.activeMqClient' :duration="3000"></countTo></p>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <div class="statistics-item">
            <p>消息总条数</p>
<!--            <p>{{ totalMessage }}</p>-->
            <p><countTo :startVal="0" :endVal='totalData.totalMessage' :duration="3000"></countTo></p>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card shadow="never" style="margin-top: 20px;">
      <div slot="header" class="clearfix page-container-header">
        <span>实时情况</span>
      </div>
      <el-row class="realtime-situation-container">
<!--        <div class="container-header">实时情况</div>-->
        <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
          <line-chart :chart-data="dailyData" />
        </el-row>
      </el-row>
    </el-card>
    <el-card shadow="never" style="margin-top: 20px;">
      <div slot="header" class="clearfix page-container-header">
        <span>月度走势</span>
      </div>
      <el-row class="monthly-trend-container">
<!--        <div class="container-header">月度走势</div>-->
        <line-chart :chart-data="monthData" />
      </el-row>
    </el-card>
  </div>
</template>

<script>
import countTo from 'vue-count-to'
import LineChart from './components/LineChart'
import { getTotal, getDaily, getMonth } from '@/api/analyse.js'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DataAnalysis',
  components: {
    countTo,
    LineChart
  },
  props: {},
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      totalData: {
        totalMessage: 0,
        totalMqClient: 0,
        activeMqClient: 0
      },
      dailyData: {
        xData: [],
        msgTotals: [],
        activeClients: [],
        clientTotals: []
      },
      monthData: {
        xData: [],
        msgTotals: [],
        activeClients: [],
        clientTotals: []
      }

    }
  },
  created() {
    this._getTotal()
    this._getDaily()
    this._getMonth()
  },
  mounted() {},
  methods: {
    _getTotal() {
      getTotal().then(res => {
        this.totalData.totalMessage = res.result.totalMessage
        this.totalData.totalMqClient = res.result.totalMqClient
        this.totalData.activeMqClient = res.result.activeMqClient
      })
    },
    _getDaily() {
      getDaily().then(res => {
        this.dailyData.xData = res.result.xData
        this.dailyData.msgTotals = res.result.msgTotals
        this.dailyData.activeClients = res.result.activeClients
        this.dailyData.clientTotals = res.result.clientTotals
      })
    },
    _getMonth() {
      getMonth().then(res => {
        this.monthData.xData = res.result.xData
        this.monthData.msgTotals = res.result.msgTotals
        this.monthData.activeClients = res.result.activeClients
        this.monthData.clientTotals = res.result.clientTotals
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.data-analysis-container {
  padding: 20px;
  .page-container-header {
    font-size: 16px;
    font-weight: 600;
    color: #545454;
  }
  /*.container-header {*/
  /*  width: 100%;*/
  /*  line-height: 40px;*/
  /*  padding: 0 20px;*/
  /*  border-top: 1px solid #dddddd;*/
  /*  border-bottom: 1px solid #dddddd;*/
  /*}*/
  .statistics-wrapper {
    width: 100%;
    .statistics-item {
      width: 300px;
      height: 95px;
      margin: 20px auto;
      text-align: center;
      background: url("../../assets/images/padbg.png") no-repeat;
      p:first-child {
        font-size: 14px;
        position: relative;
        top: 20px;
      }
      p:last-child {
        font-size: 18px;
        position: relative;
        top: 40px;
      }
    }
  }
}
</style>
