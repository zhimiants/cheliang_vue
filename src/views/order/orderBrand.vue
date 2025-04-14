<template>
  <div id="main" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts' // 导入Echart库中所有的图形报表组件

onMounted(() => {
  var chartDom = document.getElementById('main')
  var myChart = echarts.init(chartDom)
  var option

  option = {
    title: {
      text: '成交车辆品牌统计',
      subtext: '品牌',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '沃尔沃' },
          { value: 735, name: '奔驰' },
          { value: 580, name: '奥迪' },
          { value: 484, name: '大众' },
          { value: 300, name: '宝马' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }

  option && myChart.setOption(option)
})
</script>

<style scoped>
.search-div {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
