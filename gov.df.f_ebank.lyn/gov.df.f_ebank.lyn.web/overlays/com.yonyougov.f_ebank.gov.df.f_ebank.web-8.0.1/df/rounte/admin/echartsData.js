var agency_code = [];
var budget_can = [];
var budget_can_menu = [];
var pay_used = [];
var pay_used_menu = [];
var plan_can = [];
var plan_can_menu = [];
var project_type_code = [];
var project_type_name = [];
var set_year = [];
var xs_jd = [];
var echartsList;

// 原始四条
function Portal_getEchartsData() {
	//var echartsList = dubboExpenditureSituation();
	$.ajax({
		type : "GET",
		url : "/df/portal/dubbo/getExpenditureSituation.do",
		data : {
			set_year:"2016",
			agency_code:"026004", // 单位
			tokenid:getTokenId()
		},
		dataType : 'json',
		success : function(data) {
			echartsList = data.list;
			var option = echartsGetOption(echartsList);
			var myChart = echarts.init(document.getElementById('cen-1'));
			myChart.setOption(option);
			//var ecConfig = echarts.config;
			myChart.on("click", echartsClick);
		}
	});
}

function echartsGetOption(list) {
	
	for(var i in list) {
		agency_code[i] = list[i].agency_code;
		budget_can[i] = list[i].budget_can;
		budget_can_menu[i] = list[i].budget_can_menu;
		pay_used[i] = list[i].pay_used;
		pay_used_menu[i] = list[i].pay_used_menu;
		plan_can[i] = list[i].plan_can;
		plan_can_menu[i] = list[i].plan_can_menu;
		project_type_code[i] = list[i].project_type_code;
		project_type_name[i] = list[i].project_type_name;
		set_year[i] = list[i].set_year;
		xs_jd[i] = list[i].xs_jd;
	}
	
	var option = {
		tooltip : {
			trigger : 'axis',
			axisPointer : { // 坐标轴指示器，坐标轴触发有效
				type : 'line' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		legend : {
			data : [ '已支付', '可用计划', '可用指标', '序时进度' ]
		},
		grid : {
			left : '3%',
			right : '4%',
			bottom : '3%',
			containLabel : true
		},
		xAxis : [
			{
				type : 'value',
				position : 'top'
			},
			{
				type : 'category',
				boundaryGap : false,
				data : [ '六月' ]
			}
		],
		yAxis : {
			type : 'category',
			data : [ project_type_name[0], project_type_name[1], project_type_name[2], project_type_name[3]]
		},
		series : [ 
			{
				name : '已支付',
				type : 'bar',
				stack : '总量',
				label : {
					normal : {
						show : true,
						position : 'insideRight'
					}
				},
				data : [ pay_used[0], pay_used[1], pay_used[2], pay_used[3]]
			},
			{
				name : '可用计划',
				type : 'bar',
				stack : '总量',
				label : {
					normal : {
						show : true,
						position : 'insideRight'
					}
				},
				data : [ plan_can[0], plan_can[1], plan_can[2], plan_can[3]]
			},
			{
				name : '可用指标',
				type : 'bar',
				stack : '总量',
				label : {
					normal : {
						show : true,
						position : 'insideRight'
					}
				},
				data : [ budget_can[0], budget_can[1], budget_can[2], budget_can[3]]
			}, {
				"name" : "序时进度",
				"type" : "line",
				"stack" : "序时进度",
				"itemStyle" : {
					"normal" : {
						"label" : {
							"show" : true,
							"position" : "top",
							formatter : function(p) {
								return p.value > 0 ? (p.value) : '';
							}
						}
					}
				},
				"data" : [ xs_jd[0], xs_jd[1], xs_jd[2], xs_jd[3]]
			}
		],
		color : [ '#F6BD0E', '#B5C334', '#00FA9A', '#60C0DD' ]
	};
	
	return option;
}

// 点击柱状图跳转相应页面的功能，其中param.name参数为横坐标的值   
function echartsClick(param) {
	if (typeof param.seriesIndex != 'undefined') {
		// 获取点击的目录对应的对象
		var singleObj = null;
		var tokenId = getTokenId();
		for (var i in echartsList) {
			if(echartsList[i].project_type_name == param.name){
				singleObj = echartsList[i];
				break;
			}
		}
		// 根据序号跳转
		switch (param.seriesIndex) {
			case 0:
				window.open(singleObj.pay_used_menu.replace(/\s/g,"")+tokenId, "_blank");
				break;
			case 1:
				window.open(singleObj.plan_can_menu.replace(/\s/g,"")+tokenId, "_blank");
				break;
			case 2:
				window.open(singleObj.budget_can_menu.replace(/\s/g,"")+tokenId, "_blank");
				break;
			default:
				break;
		}
	}
}

/////新计划1，单条，可选///////////////////////////////////////////////////////////

function getEchartsData1() {
	//var echartsList = dubboExpenditureSituation();
	$.ajax({
		type : "GET",
		url : "/df/portal/dubbo/getExpenditureSituation.do",
		data : {
			set_year:"2016",
			agency_code:"026004", // 单位
			tokenid:getTokenId()
		},
		dataType : 'json',
		success : function(data) {
			initDubboData1(data.list)
			var option = echartsGetOption1();
			var myChart = echarts.init(document.getElementById('cen-1'));
			myChart.setOption(option);
			myChart.on("click", echartsClick1);
		}
	});
}

function initDubboData1(list){
	for(var i in list) {
		agency_code[i] = list[i].agency_code;
		budget_can[i] = list[i].budget_can;
		budget_can_menu[i] = list[i].budget_can_menu;
		pay_used[i] = list[i].pay_used;
		pay_used_menu[i] = list[i].pay_used_menu;
		plan_can[i] = list[i].plan_can;
		plan_can_menu[i] = list[i].plan_can_menu;
		project_type_code[i] = list[i].project_type_code;
		project_type_name[i] = list[i].project_type_name;
		set_year[i] = list[i].set_year;
		xs_jd[i] = list[i].xs_jd;
	}
}

function echartsGetOption1() {
	var option = {
			tooltip : {
				trigger : 'axis',
				axisPointer : { // 坐标轴指示器，坐标轴触发有效
					type : 'line' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			legend : {
				data : [ '已支付', '可用计划', '可用指标', '序时进度' ]
			},
			grid : {
				left : '3%',
				right : '4%',
				bottom : '3%',
				containLabel : true
			},
			xAxis : [
				{
					type : 'value',
					position : 'top'
				},
				{
					type : 'category',
					boundaryGap : false,
					data : [ '六月' ]
				}
				],
				yAxis : {
					type : 'category',
					data : [ project_type_name[0], project_type_name[1], project_type_name[2], project_type_name[3]]
				},
				series : [ 
					{
						name : '已支付',
						type : 'bar',
						stack : '总量',
						label : {
							normal : {
								show : true,
								position : 'insideRight'
							}
						},
						data : [ pay_used[0], pay_used[1], pay_used[2], pay_used[3]]
					},
					{
						name : '可用计划',
						type : 'bar',
						stack : '总量',
						label : {
							normal : {
								show : true,
								position : 'insideRight'
							}
						},
						data : [ plan_can[0], plan_can[1], plan_can[2], plan_can[3]]
					},
					{
						name : '可用指标',
						type : 'bar',
						stack : '总量',
						label : {
							normal : {
								show : true,
								position : 'insideRight'
							}
						},
						data : [ budget_can[0], budget_can[1], budget_can[2], budget_can[3]]
					}, {
						"name" : "序时进度",
						"type" : "line",
						"stack" : "序时进度",
						"itemStyle" : {
							"normal" : {
								"label" : {
									"show" : true,
									"position" : "top",
									formatter : function(p) {
										return p.value > 0 ? (p.value) : '';
									}
								}
							}
						},
						"data" : [ xs_jd[0], xs_jd[1], xs_jd[2], xs_jd[3]]
					}
					],
					color : [ '#F6BD0E', '#B5C334', '#00FA9A', '#60C0DD' ]
	};
	
	return option;
}

// 点击柱状图跳转相应页面的功能，其中param.name参数为横坐标的值   
function echartsClick1(param) {
	if (typeof param.seriesIndex != 'undefined') {
		// 获取点击的目录对应的对象
		var singleObj = null;
		var tokenId = getTokenId();
		for (var i in echartsList) {
			if(echartsList[i].project_type_name == param.name){
				singleObj = echartsList[i];
				break;
			}
		}
		// 根据序号跳转
		switch (param.seriesIndex) {
		case 0:
			window.open(singleObj.pay_used_menu.replace(/\s/g,"")+tokenId, "_blank");
			break;
		case 1:
			window.open(singleObj.plan_can_menu.replace(/\s/g,"")+tokenId, "_blank");
			break;
		case 2:
			window.open(singleObj.budget_can_menu.replace(/\s/g,"")+tokenId, "_blank");
			break;
		default:
			break;
		}
	}
}

