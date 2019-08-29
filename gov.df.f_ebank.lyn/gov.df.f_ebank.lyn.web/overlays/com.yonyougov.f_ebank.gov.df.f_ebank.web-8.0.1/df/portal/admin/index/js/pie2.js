//var dom = document.getElementById("containeraa");
//		var myChart = echarts.init(dom);
//		var app = {};
//		option = null;
//		option = {
//		     title : {
//        text: '2019年（按来源）',
//        
//	        x:'center'
//	    },
//		    tooltip : {
//		        trigger: 'item',
//		        formatter: "{a} <br/>{b} : {c} ({d}%)"
//		    },
//		     legend: {
//		        orient: 'horizontal',
//		           x : 'center',
//                  
//		        bottom: 45,
//		        data: ['财政经费拨款4000万','纳入预算的非税收入600万','财政基金预算拨款1000万','上年结转400万']
//		    },
//		    
//		    series : [
//		        {
//		            name: '访问来源',
//		            type: 'pie',
//		            radius : '40%',
//		            center: ['50%', '40%'],
//		            data:[
//		                  {value:4000,name:'财政经费拨款4000万'},
//                          {value:600,name:'纳入预算的非税收入600万'},
//                          {value:1000,name:'财政基金预算拨款1000万'},
//                          {value:400,name:'上年结转400万'}
//		            ],
//		            itemStyle: {
//		                emphasis: {
//		                    shadowBlur: 10,
//		                    shadowOffsetX: 0,
//		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
//		                }
//		            }
//		        }
//		    ],
//		    color: ['#F2BD2A','#62B8E2','#379FD1','#F5CE4C']
//		};
//	
//		if (option && typeof option === "object") {
//		    myChart.setOption(option, true);
//		}
		
		

 getPie2Data();
//预算资金构成分析扇形图2
 function getPie2Data() {
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
 	var data = {"czjf":4000,"lrys":600,"czjj":1000,"snjz":400};
	var optionData = {
			"text":"2019年（按来源）",
			"legend": ['财政经费拨款'+data.czjf+'万','纳入预算的非税收入'+data.lrys+'万','财政基金预算拨款'+data.czjj+'万','上年结转'+data.snjz+'万'],
			"series":{"data":[
			                  {value:data.czjf,name:'财政经费拨款'+data.czjf+'万'},
	                          {value:data.lrys,name:'纳入预算的非税收入'+data.lrys+'万'},
	                          {value:data.czjj,name:'财政基金预算拨款'+data.czjj+'万'},
	                          {value:data.snjz,name:'上年结转'+data.snjz+'万'}
			            ]},
			"color": ['#EFB85F','#67DCDA','#4A90E2','#E67F55']
	};
	var option1 = pie2GetOption(data,optionData);
	var myChart1 = echarts.init(document.getElementById('containeraa'));
	myChart1.setOption(option1);
//		 		}
//		 	});
 }
 
 function pie2GetOption(data,optionData) {
//		for(var i = 0;i < data.length;i++) {
			
//		}
		
	var option = {
		title : {
	    	 text: optionData.text,
	    	 x:'center',
	    	 top: 10,
	    	 textStyle:{
	    		 fontSize: 15,
	    		 fontWeight: "normal"
	    	 }
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient: 'horizontal',
	        x:'center',
	        bottom: 45,
	        data: optionData.legend
	    },
	    series : [
	        {
	            name: '访问来源',
	            type: 'pie',
	            radius : '40%',
	            center: ['50%', '40%'],
	            data:optionData.series.data,
	            itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ],
	    color:optionData.color 	
		
	};
	
	return option;
}
