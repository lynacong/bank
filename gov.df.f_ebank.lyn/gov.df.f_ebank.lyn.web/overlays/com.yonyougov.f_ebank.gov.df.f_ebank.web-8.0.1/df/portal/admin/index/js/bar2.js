//var dom = document.getElementById("container2");
//var myChart = echarts.init(dom);
//var app = {};
//option = null;
//
//
//option = {
//
//    tooltip: {
//        trigger: 'axis',
//        axisPointer: {
//            type: 'shadow'
//        }
//    },
//
//    grid: {
//        left: '3%',
//        right: '4%',
//        bottom: '20%',
//        containLabel: true
//    },
//    yAxis: {
//        type: 'value',
//        boundaryGap: [0, 0.01]
//    },
//    xAxis: {
//        type: 'category',
//        data: ['预算数','基本支出执行数','项目支出执行数','基本支出调整数','项目支出调整数']
//    },
//    series: [
//        {
//            
//            type: 'bar',
//            data: [6000, 800, 4000, 100, 1000]
//        }
//        
//    ],color: ['#78C4E9']
//    
//};
//
//if (option && typeof option === "object") {
//    myChart.setOption(option, true);
//}
getBar2Data();
//本年预算安排情况分析柱状图2
function getBar2Data() {
//		 	$.ajax({
//		 		type : "GET",
////		 		url : "/df/portal/dubbo/getExpenditureSituation.do",
//		 		data : {
////		 			set_year:"2016",
////		 			agency_code:"026004", // 单位
////		 			tokenid:getTokenId()
//		 		},
//		 		dataType : 'json',
//		 		success : function(data) {
		var optionData = {
				"xAxis":['预算数','基本支出执行数','项目支出执行数','基本支出调整数','项目支出调整数'],
				"series":[
					        {
					        	name: "本年预算",
					            type: 'bar',
					            barWidth: '60%',  
					            data: [6000, 800, 4000, 100, 1000]
					        }
					        
					    ],
				"color": ['#5E8FC9']
		};
		var option = bar2GetOption(optionData);
		var myChart = echarts.init(document.getElementById('container2'));
		myChart.setOption(option);
//		 		}
//		 	});
}
function bar2GetOption(optionData) {
	var option = {
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'shadow'
	        }
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '20%',
	        containLabel: true
	    },
	    yAxis: {
	        type: 'value',
//	        boundaryGap: [0, 0.01]
	    },
	    xAxis: {
	        type: 'category',
	        data: optionData.xAxis,
	        axisLabel: {
                interval:0,
	            rotate:40
		    }
	    },
	    series: optionData.series,
	    color: ['#5E8FC9']
	    
	};

	return option;
}