<template>

	<div id="main" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import * as echarts from 'echarts' // 导入Echart库中所有的图形报表组件

    onMounted(()=>{
var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
var option;

option = {
    title: {
				text: '订单成交统计',
			},
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
};

option && myChart.setOption(option);
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