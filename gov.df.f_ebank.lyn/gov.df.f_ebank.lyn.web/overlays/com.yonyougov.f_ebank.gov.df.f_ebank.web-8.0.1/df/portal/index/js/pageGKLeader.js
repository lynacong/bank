/**
 * page key
 */
var portal_GKLeader_obj = {
};

/**
 * 快慢车道监控
 */
var portal_GKLeader_kmcd = {
	bf : function(){},
	show : function() {
		$("#iframeKMCDJK").prop("src", "http://192.168.10.11:8089/dss-web/ssoLogin/getEsen?resid=EBI$12$MBYNL3YC3SYPFULBFUYY152UBCBEU98R$1$BY4P498U5UYTUWKY7Y8MLQFRXDYLOOT7.rpttpl&showmenu=FALSE&tokenid=" + getTokenId());
	}
};

/**
 * 收支进度总览
 */
var portal_GKLeader_szjd = {
	bf : function(){},
	show : function() {
		$.ajax({
			url : "/df/portal/dubbo/getAllDssConfigData.do",
			type : "GET",
			data : {"tokenid" : getTokenId()},
			dataType : "json",
			success : function(data) {
				console.log(data);
				//$("#iframeKMCDJK").prop("src", url);
			}
		});
	}
};

/**
 * 库款预测
 */
var portal_GKLeader_kkyc = {
	bf : function(){},
	show : function() {
		$("#iframeKKYC").prop("src", "http://192.168.10.11:8089/dss-web/ssoLogin/getEsen?resid=EBI$12$8UBKRKCQXLNN7NFUT0N9MATLM9UQUUTY$1$KAU1WYDZ8SD0U2IAWMDJUYKAEJALEJ65.rpttpl&showmenu=FALSE&tokenid="+getTokenId()); // &calcnow=true
	}
};

/**
 * 国库动态监控
 */
var portal_GKLeader_dtjk = {
	bf : function(){},
	show : function() {
		$('#yjqs').highcharts({
			chart: {
				type: 'line'
			},
			exporting: {
				enabled: false
			},
			title: {
				text: '预警趋势图'
			},
			xAxis: {
				categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
			},
			yAxis: {
			 	title: {
	            align: 'high',
	            offset: 0,
	            text: '单位：次数',
	            rotation: 0,
	            y: -25
	           }
			 	
			},
			credits: {
				enabled: false
			},
			legend: {
				reversed: false,
				layout: 'horizontal',
				align: 'center',
				verticalAlign: 'top',
				x: 200,
				y: 30,
				floating: false,
				borderWidth: 0,
				backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
				shadow: false
			},
			colors: ['#91CCF1', '#7EB29E', '#FFBF00'],
			plotOptions: {
				line: {
					dataLabels: {
						enabled: true // 开启数据标签
					},
					enableMouseTracking: false // 关闭鼠标跟踪，对应的提示框、点击事件会失效
				}
			},
			series: [{
					name: '用款计划',
					data: [125, 120, 250, 240, 260, 375, 125, '', '', '', '', '']
				}, {
					name: '直接支付',
					data: [25, 20, 50, 40, 60, 75, 25, '', '', '', '', '']
				}, {
					name: '授权支付',
					data: ['', '', '', '', '', '', '', '', '', '', '']
				}

			]
		});
	}
};

$(function(){
	
	// 快慢车道监控
	portal_GKLeader_kmcd.show();
	// 收支进度总览
	portal_GKLeader_szjd.bf();
	portal_GKLeader_szjd.show();
	// 库款预测
	portal_GKLeader_kkyc.show();
	// 国库动态监控
	portal_GKLeader_dtjk.bf();
	portal_GKLeader_dtjk.show();
	$('#headl-1>span').each(
	    function(index){
	        $(this).click(function(){
	            $('.tab3').addClass('hidden');
	            $('.tab3:eq('+index+')').removeClass('hidden');
	            $('#headl-1 > span').removeClass('ac1');
	            $('#headl-1 > span:eq('+index+')').addClass('ac1');
	        });
	    }
	);
	
	// 支出进度
	dfpPayProgress.bf();
	dfpPayProgress.show();
	
	// 资金监控
	dfpFundmonitor.bf();
	dfpFundmonitor.show();
	$("#refreshFundmonitor").click(function(){ dfpFundmonitor.show();});
	
	// 支出进度排名
	$('#head-r1 >span').each(
	    function(index){
	        $(this).click(function(){
	            $('._tab1').addClass('hidden');
	            $('._tab1:eq('+index+')').removeClass('hidden');
	            $('#head-r1 > span').removeClass('ac1');
	            $('#head-r1 > span:eq('+index+')').addClass('ac1');
	        })
	    }
	);
	dfpPayProgressRanking.showFirst("GKJB_F", "zcjdSortFront", {});
	dfpPayProgressRanking.showLast("GKJB_L", "zcjdSortLast", {});
	
	// 公告
//	dfpArticle.bf();
	dfpArticle.show(3,'','GKLeader');
	
	// 右下功能切换
	$('#_head-r >span').each(
	    function(index){
	        $(this).click(function(){
	            $('._tab2').addClass('hidden');
	            $('._tab2:eq('+index+')').removeClass('hidden');
	            $('#_head-r > span').removeClass('ac1');
	            $('#_head-r > span:eq('+index+')').addClass('ac1');
	        })
	    }
	);
	var ldCaozuoUrl = [
		// 查询对象注册
		"/df/fi_fip/search/searchRegistrationConfig.html?isopen=1&menuid=1E225100B0E6DD8511650BBC3A70A021&menuname=%u67E5%u8BE2%u5BF9%u8C61%u6CE8%u518C",
		// 监控规则设置
		"/df/fi_fip/subject/ruleConfig.html?menuid=C60971E0BCD0805D9CE0C8F6A705BA58&menuname=%u89C4%u5219%u914D%u7F6E",
		// 每日支付阈值设置
		"/df/sd/pay/other/fastShowRoad.html?menuid=CFDC8DC0454D59059DA048921F1EAD82&menuname=%u5FEB%u6162%u8F66%u9053%u7BA1%u7406",
		// 大额报备阈值设置
		"/df/sd/pay/other/fastShowRoad.html?menuid=CFDC8DC0454D59059DA048921F1EAD82&menuname=%u5FEB%u6162%u8F66%u9053%u7BA1%u7406",
		// 支付方式限定设置
		"/df/sd/pay/other/payWayRuleSetting.html?menuid=6FC2837A0C063E839719605B9B08BFFA&menuname=%u652F%u4ED8%u65B9%u5F0F%u9650%u5B9A%u89C4%u5219%u8BBE%u7F6E"
	];
	$("#ldCaozuo ul").find("li").each(function(i){
		$(this).click(function(){
			window.parent.addTabToParent($(this).find("a").prop("title"), fullUrlWithTokenid(ldCaozuoUrl[i]));
		});
	});
	
});


