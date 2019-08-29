$(function() {
	getHighchartsData(0);

	//	$("#dwdwzcSelect").change(function() {
	//		var zcType = $('#dwdwzcSelect').val();
	//		getHighchartsData(zcType);
	//	});
	$('#budgetTime').fdatepicker({
		format: 'yyyy-mm-dd'
	})

	$('#budgetTime').val(getNowFormatDate());

});

function getHighchartsData(zcType) {
	var jsonSeries;
	if(zcType == 0) {
		jsonSeries = [{
				name: '可用额度',
				data: [350]
			}, {
				name: '已支付',
				data: [150]
			}

		]
	} else if(zcType == 1) {
		jsonSeries = [{
				name: '可用额度',
				data: [250, 300]
			}, {
				name: '已支付',
				data: [150, 100]
			}

		]
	} else if(zcType == 2) {
		jsonSeries = [{
				name: '可用额度',
				data: [150, 300]
			}, {
				name: '已支付',
				data: [100, 50]
			}

		]
	} else if(zcType == 3) {
		jsonSeries = [{
				name: '可用额度',
				data: [150, 300]
			}, {
				name: '已支付',
				data: [50, 100]
			}

		]
	} else if(zcType == 4) {
		jsonSeries = [{
				name: '可用额度',
				data: [150, 300]
			},

			{
				name: '已支付',
				data: [300, ]
			},

		]
	}

	//单位支出
	$('#dwzc').highcharts({
		chart: {
			type: 'bar'
		},
		credits: {
			enabled: false
		},
		exporting: {
			enabled: false
		},
		title: {
			text: ''
		},
		xAxis: {　　
			
			labels: {
				enabled: false
			},
			tickWidth: 0
		},
		yAxis: {
			min: 0,
			title: {
				text: ''
			},
			labels: { //y轴刻度文字标签  
				formatter: function() {
					return this.value + '%'; //y轴加上%  
				}
			},
　　plotLines: [{   //一条延伸到整个绘图区的线，标志着轴中一个特定值。
                    color: '#FCD4B2',
                    dashStyle: 'Dash', //Dash,Dot,Solid,默认Solid
                    width: 1.5,
                    value: 50,  //y轴显示位置
                    zIndex: 5
                }]
		},
		tooltip: {
			pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} (万元)</b> ({point.percentage:.0f}%)<br/>',
			shared: false
		},
		colors: ['#F8A23C', '#7DC338'],
		legend: {
			reversed: true,
			layout: 'horizontal',
			align: 'center',
			verticalAlign: 'top',
			x: 200,
			y: 0,
			floating: false,
			borderWidth: 0,
			backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
			shadow: false
		},
		plotOptions: {
			series: {
				stacking: 'percent',
				dataLabels: {
					enabled: true,
					color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
					style: {
						textShadow: '0 0 3px green'
					},
					formatter: function() {
						return this.point.percentage + '%';

					}
				},
				events: {
					click: function(event) {
						//				location.href = url;
						//上面是当前页跳转，如果是要跳出新页面，那就用
						//支付状态
						var zfzt = event.point.series.name;
						if(zfzt == '已支付') {
							window.open('https://www.baidu.com');
						} else if(zfzt == '在途支付') {
							window.open('http://www.iqiyi.com/')
						} else if(zfzt == '可用额度') {
							window.open('http://www.yonyou.com/index.html')
						}
						//              window.open(e.point.url);
					}
				}
			}
		},
		series: jsonSeries
	});
};

function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 +
		strDate;

	return currentdate;
}