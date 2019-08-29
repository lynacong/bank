getBar1Data();

//本年预算安排情况分析柱状图1
function getBar1Data() {
	$.ajax({
		url : "/df/fb/fbpanel/getMultiBudget.do",
		type : "post",
		data:ip.getCommonOptions({}),
		dataType : 'json',
		success : function(data) {
			var xAxisData = [];
			var legendData = [];
			for(var k in data) {
				xAxisData.push(k);
			}
			for(var j in data[xAxisData[0]]) {
				legendData.push(j);
			}
			var series = [];
			for(var f = 0;f < legendData.length;f++) {
				var seriesData = [];
				for(var h = 0;h < xAxisData.length;h++) {
					seriesData.push(data[xAxisData[h]][legendData[f]]);
				}
				series.push(seriesData);
			}
			var sData = [];
			if(series && series.length > 0) {
				for(var t=0;t < series.length;t++) {
					sData.push({name: legendData[t],type: 'bar',data: series[t]})
				}
			}
			var optionData = {
					"legend": legendData,
					"xAxis":xAxisData,
					"series":sData
			};
			var option = barGetOption(optionData);
			var myChart = echarts.init(document.getElementById('container1'));
			myChart.setOption(option);
 		}
 	});
}
function barGetOption(optionData) {
	var option = {
	
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'shadow'
	        }
	    },
	    legend: {
	        data: optionData.legend
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '20%',
	        containLabel: true
	    },
	    yAxis: {
	        type: 'value',
	        boundaryGap: [0, 0.01]
	    },
	    xAxis: {
	        type: 'category',
	        data: optionData.xAxis
	    },
	    series: optionData.series,
	    color: ['#5E8FC9','#E68C47']
	};

	return option;
}