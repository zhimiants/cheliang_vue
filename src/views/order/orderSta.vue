<template>
	<div class="search-div">
		<el-form label-width="90px" size="small">
			<el-row>
				<el-col :span="22">
					<el-form-item label="订单日期">
						<el-date-picker
							v-model="createTimes"
							type="daterange"
							range-separator="To"
							start-placeholder="开始日期"
							end-placeholder="截止日期"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
				</el-col>
				<el-col :span="1"></el-col>
				<el-col :span="1">
					<el-button type="primary" size="small" @click="fetchData()">
						搜索
					</el-button>
				</el-col>
			</el-row>
		</el-form>
	</div>

	<div ref="orderTotalAmountDiv" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import * as echarts from 'echarts' // 导入Echart库中所有的图形报表组件
	import { GetOrderSta } from '@/api/orderSta.js'

	// 定义chart数据模型，用来选中div组件
	const orderTotalAmountDiv = ref()

	const searchObj = ref({
		createTimeBegin: '',
		createTimeEnd: '',
	})

	const createTimes = ref([])

	// 需要在onMounted钩子函数中对div区域使用echarts进行初始化
	onMounted(() => {
		fetchData()
	})

	const fetchData = async () => {
		if (createTimes.value.length == 2) {
			searchObj.value.createTimeBegin = createTimes.value[0]
			searchObj.value.createTimeEnd = createTimes.value[1]
		}
		const { data } = await GetOrderSta(searchObj.value)
		setChartOption(data.dateList, data.amountList)
	}

	const setChartOption = (dateList, amountList) => {
		const myChart = echarts.init(orderTotalAmountDiv.value)
		// 指定图表的配置项和数据
		const option = {
			title: {
				text: '订单金额统计',
			},
			tooltip: {},
			legend: {
				data: ['订单总金额（元）'],
			},
			xAxis: {
				data: dateList,
			},
			yAxis: {},
			series: [
				{
					name: '订单总金额（元）',
					type: 'bar',
					data: amountList,
				},
			],
		}
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option)
	}
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