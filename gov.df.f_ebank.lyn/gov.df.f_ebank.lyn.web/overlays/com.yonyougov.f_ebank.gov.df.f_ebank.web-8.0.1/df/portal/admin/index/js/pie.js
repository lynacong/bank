getPie1Data();

// 预算资金构成分析扇形图1
function getPie1Data() {
	//根据单位信息获取基本支出和项目支出数据

	$.ajax({
	    url: '/df/fb/fbpanel/getPayOutDataByAgency.do',
	    type: 'post',
	    data:ip.getCommonOptions({"dataType": 0,"taskId": 1,"agencyCode": sessionStorage.getItem("select_agency_code")}),
	    dataType: 'json',
	    success: function (data) {
			var option = pieGetOption(data);
			var myChart = echarts.init(document.getElementById('container'));
			myChart.setOption(option);
 		}
 	});
 }
function pieGetOption(data) {
	var baseData,prjData;
	if(data.baseData[0] && data.baseData[0].total_price) {
		baseData = data.baseData[0].total_price;
	}else {
		baseData = 0;
	}
	if(data.prjData[0] && data.prjData[0].total_price) {
		prjData = data.prjData[0].total_price;
	}else {
		prjData = 0;
	}
	var option = {
	     title : {
	    	 text: '2019年（按支出）',
	    	 x:'center',
	    	 top: 10,
	    	 textStyle:{
	    		 fontSize: 15,
	    		 fontWeight: "normal"
	    	 }
	     },
	    tooltip : {
	        trigger: 'item',
//			        formatter: "{a} <br/>{b} : {c} ({d}%)"
	        formatter: "{b} ({d}%)"
	    },
	     legend: {
	        orient: 'vertical',
	        right: 'right',
	        bottom: 45,
	        data: ['项目'+prjData,'基本'+baseData]
	    },
	    
	    series : [
	        {
	            name: '访问来源',
	            type: 'pie',
	            radius : '40%',
	            center: ['50%', '40%'],
	            data:[
	                  {value:prjData, name:'项目'+prjData},
	                  {value:baseData, name:'基本'+baseData}
	            ],
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ],
	     color: ['#EFB85F','#4A90E2']
	};
	return option;
}
		 
		 