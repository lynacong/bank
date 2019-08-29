$(function() {
	getHighchartsData(0);

	$("#dwdwzcSelect").change(function() {
		var zcType = $('#dwdwzcSelect').val();
		getHighchartsData(zcType);
	});

});

function getHighchartsData(zcType) {
	var jsonSeries;
	if(zcType == 0) {
		jsonSeries = [{
				name: '可用额度',
				data: [650, 700]
			}, {
				name: '在途支付',
				data: [100, ]
			}, {
				name: '已支付',
				data: [350, 300]
			}

		]
	} else if(zcType == 1) {
		jsonSeries = [{
				name: '可用额度',
				data: [250, 300]
			}, {
				name: '在途支付',
				data: [300, ]
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
				name: '在途支付',
				data: [300, ]
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
				name: '在途支付',
				data: [100, ]
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
				data: [100, 50]
			},
			{
				name: '在途支付',
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
			categories: ['2017', '2016']
		},
		yAxis: {
			min: 0,
			title: {
				text: '单位：万元'
			}
		},
		tooltip: {
			pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} (万元)</b> ({point.percentage:.0f}%)<br/>',
			shared: false
		},
		colors: ['#108FE9', '#FFBF00', '#3CBD7C'],
		legend: {
			reversed: true,
			layout: 'horizontal',
			align: 'center',
			verticalAlign: 'top',
			x: 10,
			y: 0,
			floating: false,
			borderWidth: 0,
			backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
			shadow: false
		},
		plotOptions: {
			series: {
				stacking: 'normal',
				dataLabels: {
					enabled: true,
					color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
					style: {
						textShadow: '0 0 3px green'
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
}