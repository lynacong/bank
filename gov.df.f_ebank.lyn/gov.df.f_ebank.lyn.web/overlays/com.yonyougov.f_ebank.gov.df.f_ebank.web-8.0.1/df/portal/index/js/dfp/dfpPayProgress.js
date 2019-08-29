/**
 * 支出进度
 * <p>需要 dfp.js</p>
 */
var dfpPayProgress = dfpPayProgress || {};
// 代码示例
//<link rel="stylesheet" href="css/zTreeStyle/zTreeStyle.css" type="text/css">
//<script type="text/javascript" src="js/jquery.ztree.core-3.1.js"></script>
//<div class="cen-2" style="height:168px;">
//	<div class="head-l">
//		<span>支出进度情况</span>
//		<!--预算类别-->
//		<div class="selectDiv">
//			<span class="budgetSpan">预算类别:</span>
//			<select id="fundtypeCode" class="budgetSelect _portal_zhichu_select_yslb_select _portal_cursor_pointer">
//				<option value="" selected="selected">全部</option>
//				<option value="01">一般公共预算</option>
//				<option value="02">政府性基金</option>
//				<option value="03">国有资本经营</option>
//				<!-- <option value="04">社会保险基金</option> -->
//			</select>
//		</div>
//		<!-- 项目分类(原 支出类型) -->
//		<div class="selectDiv">
//			<span class="zcspan">项目分类:</span>
//			<input id="expfuncCode" type="text" style="padding-left:5px;" class="dwdwzcSelect _portal_cursor_pointer" value="全部">
//			<input id="_expfuncCode" type="hidden" value="">
//			<ul id="expfuncCodeTree" class="ztree" style="background:#FFF; display: none;width: 133px;overflow: auto;position: absolute;z-index: 6;left: 405px;top: 130px;border: solid 1px #d9d9d9;height: 114px;"></ul>
//			<!-- 
//			<select id="expfuncCode" class="dwdwzcSelect _portal_zhichu_select_zclx_select _portal_cursor_pointer">
//				<option value="" selected="selected">全部</option>
//				<option value="101">基本支出</option>
//				<option value="102">项目支出</option>
//				<option value="10201">ㄴ普通项目支出</option>
//				<option value="10202">ㄴ政府采购支出</option>
//			</select>
//			 -->
//		</div>
//		<!-- 指标来源 -->
//		<div class="selectDiv">
//			<span class="zcspan">指标来源:</span>
//			<input id="bgtsourceCode" type="text" style="padding-left:5px;" class="dwdwzcSelect _portal_cursor_pointer" value="全部">
//			<input id="_bgtsourceCode" type="hidden" value="">
//			<ul id="bgtsourceCodeTree" class="ztree" style="background:#FFF; display: none;width: 140px;overflow: auto;position: absolute;z-index: 6;left: 559px;top: 130px;border: solid 1px #d9d9d9;height: 395px;"></ul>
//			<!-- 
//			<select id="bgtsourceCode" class="dwdwzcSelect _portal_zhichu_select_zbly_select _portal_cursor_pointer">
//				<option value="" selected="selected">全部</option>
//				<option value="1">年初预算</option>
//				<option value="101">ㄴ结算补助</option>
//				<option value="2">往年结余</option>
//				<option value="208">ㄴ2008年结余</option>
//			</select> -->
//		</div>
//		<!--时间-->
//		<div class="selectDiv" style="margin-top:-3px;">
//			<span class="timespan">截止时间:</span>
//			<input id="budgetTime" style="height:26px;line-height:26px;margin-top:8px;padding-top:0px;padding-left: 5px;" type="text" class="_portal_cursor_pointer form-control budgetTime" readonly="readonly">
//			<span><i class="icon-calendar"></i></span>
//		</div>
//		<!-- <div class="danwei">单位：元</div> -->
//	</div>
//	<div style="position: relative; margin-top:-20px;">
//		<div class="zhibiao" style="position:absolute;z-index: 5;margin:13px 0 0 20px;">
//			<span class="zbje">指标金额：<span class="zbjenum" id="_portal_zhichu_text_zbje_span">0</span>元</span>
//			<span class="zfje">支付金额：<span class="zfjenum" id="_portal_zhichu_text_zfje_span">0</span>元</span>
//			<span class="zbye" style="margin-right: 20px;">指标余额：<span class="zbyenum" id="_portal_zhichu_text_zbye_span">0</span>元</span>
//		</div>
//		<span id="tooltipXSJD" style="display:none; position: absolute;float: right;right: 200px;top: 14px;font-size: 13px;z-index: 5; margin-right:3%;"><span style="color:blue;">▼</span><span> 序时进度</span></span>
//		<div id="dwzc" style="width:95%;height:130px;margin: 0 auto;margin-top:20px;padding:0 2% 0 2%;"></div>
//	</div>
//</div>

// 暂存数据
// 指标金额
var _budgetMoney = 0;
// 指标余额
var _lastBgtMoney = 0;
// 支付金额
var _payMoney = 0;

dfpPayProgress = {
	tree : function() {
		// 绑定中间滚动事件
		var scrollFunc = function (e) {  
	        e = e || window.event;  
	        if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件        
	        	$("#budgetWrapper").css("display", "none");
	        	$("#expfuncCodeTree").css("display", "none");
	        	$("#bgtsourceCodeTree").css("display", "none");
	        } else if (e.detail) {  //Firefox滑轮事件  
	        	$("#budgetWrapper").css("display", "none");
	        	$("#expfuncCodeTree").css("display", "none");
	        	$("#bgtsourceCodeTree").css("display", "none");
	        }
	    }  
	    //给页面绑定滑轮滚动事件  
	    if (document.addEventListener) {//firefox  
	        document.addEventListener('DOMMouseScroll', scrollFunc, false);  
	    }  
	    //滚动滑轮触发scrollFunc方法  //ie 谷歌  
	    window.onmousewheel = document.onmousewheel = scrollFunc; 
	    document.onclick = function(e){
			$("#budgetWrapper").css("display", "none");
			
			// TODO 预算指标-高级查询，单击事件冒泡导致隐藏
			//$(".demandContent").css("display", "none");
			var eventTargetAllPage = e.srcElement ? e.srcElement : e.target;
			var eventTargetAllPageId = eventTargetAllPage.id;
			var selectedTabelId = ["expfuncCode", "expfuncCodeTree", "bgtsourceCode", "bgtsourceCodeTree"];
			
			// 判断单击点位置
			//var $a = $("#eventTargetAllPage").parents("ul#expfuncCodeTree");
			
//			if(dfp_util.isValueInArray(selectedTabelId, eventTargetAllPageId)){
//				return false;
//			}else{
//				if($("#expfuncCodeTree").css("display")=="block") {
//					$("#expfuncCodeTree").css("display", "none");
//				}
//				if($("#bgtsourceCodeTree").css("display")=="block") {
//					$("#bgtsourceCodeTree").css("display", "none");
//				}
//			}
		};
	},
	bf : function(){
		this.tree();
		// 支出进度截止时间初始化
//		$('#budgetTime').fdatepicker({
//			format: 'yyyy-mm-dd'
//		});
//		$("#budgetTime").val(dfp.datetimeSpe("pp"));
//		var $timeFoot = $(".datepicker-days").find("tfoot").find("th.today");
//		$timeFoot.css("display", "block !important");
//		$timeFoot.css("border", "solid 1px #ccc");
//		$timeFoot.click(function(){
//			$("#budgetTime").val(dfp.datetimeSpe("pp"));
//			$("div.datepicker.datepicker-dropdown.dropdown-menu").hide();
//		});
		
		// 单位切换
		$("#payProgressDanweiChange").on("change", function(e){
			dfpPayProgress.hchart(_payMoney, _lastBgtMoney, null, null, null, _budgetMoney);
		});

		// 高级查询
		$("#payProgressShowGaoji").click(function() {
			$("#payProgressGaoji").css("display", "block");
		});
		// 高级查询-单查询事件
		$("#payProgressGaoji").find("ul").find("li").each(function(i) {
			// 单查询-x，情况内容
			$(this).find("span:eq(0)").click(function() {
				$(this).parent("li").find("input").each(function(){
					$(this).val("");
				});
			});
			// 单查询-...，展示弹窗
			$(this).find("span:eq(1)").click(function() {
				var zNodes = [],
					zSetting = {
						view: {dblClickExpand: false, showLine: true, selectedMulti: false, showIcon: false},
						data: {
							simpleData: { enable:true, idKey: "id", pIdKey: "pId", rootPId: ""}
						},
						callback : {} // 由之后的个标签事件独立添加
					};
				if(i == 0) { // 预算类别 fundtypeCode
					zNodes = [
						{id: "", name: "全部", pId: "0"},
						{id: "01", name: "一般公共预算", pId: "0"},
						{id: "02", name: "政府性基金", pId: "0"},
						{id: "03", name: "国有资本经营", pId: "0"}
					];
					zSetting.callback = {
						onClick : function(event, treeId, treeNode) {
							$("#content_wrap2").css({"display":"none"});
							$("#payProgressYSLBGaojiInput_NAME").val(treeNode.name);
							$("#payProgressYSLBGaojiInput_ID").val(treeNode.id);
						}
					};
				} else if(i == 1) { // 项目分类 expfuncCode
					zNodes = [
						{id: "", name: "全部", pId: "0"},
						{id: "101", name: "基本支出", pId: "0"},
						{id: "102", name: "项目支出", pId: "0"},
						{id: "10201", name: "普通项目支出", pId: "102"}
					];
					zSetting.callback = {
						onClick : function(event, treeId, treeNode) {
							$("#content_wrap2").css({"display":"none"});
							$("#payProgressXMFLGaojiInput_NAME").val(treeNode.name);
							$("#payProgressXMFLGaojiInput_ID").val(treeNode.id);
						}
					};
				} else if(i == 2) { // 指标来源 bgtsourceCode
					zNodes = [
						{id: "", name: "全部", pId: "0"},
						{id: "1", name: "年初预算", pId: "0"},
						{id: "101", name: "结算补助", pId: "1"},
//						{id: "102", name: "中央专款", pId: "1"},
//						{id: "103", name: "当年预算", pId: "1"},
//						{id: "104", name: "列收列支", pId: "1"},
//						{id: "105", name: "预备费", pId: "1"},
//						{id: "106", name: "其他来源", pId: "1"},
//						{id: "107", name: "基金预算", pId: "1"},
						{id: "2", name: "往年结余", pId: "0"},
						{id: "208", name: "2008结余", pId: "2"},
						{id: "209", name: "2009结余", pId: "2"},
						{id: "210", name: "2010结余", pId: "2"},
						{id: "211", name: "2011结余", pId: "2"},
						{id: "212", name: "2012结余", pId: "2"},
						{id: "213", name: "2013结余", pId: "2"},
						{id: "214", name: "2014结余", pId: "2"},
						{id: "215", name: "2015结余", pId: "2"},
						{id: "216", name: "2016结余", pId: "2"}
					];
					zSetting.callback = {
						onClick : function(event, treeId, treeNode) {
							$("#content_wrap2").css({"display":"none"});
							$("#payProgressZBLYGaojiInput_NAME").val(treeNode.name);
							$("#payProgressZBLYGaojiInput_ID").val(treeNode.id);
						}
					};
				} else if(i == 3) { // 预算单位 agencyCode
					// TODO 获取预算单位信息
					var all_options1 = {
							"element": "AGENCY",
							"tokenid": getTokenId(),
							"ele_value": ""
						};
					$.ajax({
						url: "/df/dic/dictree.do",
						type : "GET",
						data: dfp.commonData(all_options1),
						dataType : "json",
						async : false,
						success : function(data) {
							var eleDetail = data.eleDetail;
							zNodes.push({id: "", name: "全部", pId: ""});
							for(var i in eleDetail){
								if(!eleDetail.hasOwnProperty(i)){
									continue;
								}
								zNodes.push({
									id : eleDetail[i].chr_id,
									pId : eleDetail[i].parent_id,
									name : dfp_re.space.removeAll(dfp_re.num.removeAll(eleDetail[i].codename)),
									code : eleDetail[i].chr_code
								});
							}
						}
					});
					zSetting.callback = {
						onClick : function(event, treeId, treeNode) {
							$("#content_wrap2").css({"display":"none"});
							$("#payProgressYSDWGaojiInput_NAME").val(treeNode.name);
							$("#payProgressYSDWGaojiInput_ID").val(treeNode.id);
						}
					};
				}
				
				$.fn.zTree.init($("#payProgressZTree"), zSetting, zNodes);
				$("#content_wrap2").css("display", "block");
			});
		});
		// 高级查询-单查询关闭
		$("#payProgressZTreeClose, #_payProgressZTreeClose").click(function() {
			$("#content_wrap2").css("display", "none");
		});
		// 高级查询-总查询关闭
		$("#payProgressGaojiClose").click(function() {
			$("#payProgressGaoji").css("display", "none");
		});
		// 高级查询-总查询确定
		$("#payProgressGaojiSubmit").click(function() {
			$("#payProgressGaoji").css("display", "none");
			// TODO 准备参数，show()
			dfpPayProgress.show();
		});
		
	},
	show : function(){
//		var fundtypeCode = $("#fundtypeCode").val();
//		var expfuncCode = $("#_expfuncCode").val();
//		var bgtsourceCode = $("#_bgtsourceCode").val();
//		var pAgencyCode = $("#_pAgencyCode").val();
//		var selecttime = $("#budgetTime").val() || "";
		var fundtypeCode = $("#payProgressYSLBGaojiInput_ID").val() || "";
		var expfuncCode = $("#payProgressXMFLGaojiInput_ID").val() || "";
		var bgtsourceCode = $("#payProgressZBLYGaojiInput_ID").val() || "";
		var pAgencyCode = $("#payProgressYSDWGaojiInput_ID").val() || "";
		var selecttime = "";
		$.ajax({
			//url: "/df/portal/dubbo/payProgress.do",
			//先由业务系统提供取数，便于对数
			url: "/df/pay/search/mainpage/payProgress.do",
			type: "GET",
			dataType: "json",
			data: dfp.commonData({
				"tokenid":getTokenId(),
				"fundtypeCode":fundtypeCode,
				"expfuncCode":expfuncCode,
				"bgtsourceCode":bgtsourceCode,
				"selecttime":selecttime,
				"agencyCode":pAgencyCode,
				"billtype":"366",
				"busbilltype":"311",
				"pageInfo":"99999,0",
				"condition": " and paytype_code like '12%' "
			}),
			success: function(data) {
				$("#tooltipXSJD").css("display", "block");
				if(null==data.data || (data.data).length == 0){
					$("#tooltipXSJD").css("display", "none");
				}
				
				// 渲染图表
				//$("#dwzc").css("display","block");
				var dataDetail = data.data;
				if(dataDetail == null || dataDetail[0] == null){
					//console.log("-- dubbo service is out");
					$("#_portal_zhichu_text_zbje_span").html("0");
					$("#_portal_zhichu_text_zfje_span").html("0");
					$("#_portal_zhichu_text_zbye_span").html("0");
					$("#tooltipXSJD").css("display", "none");
					$("#dwzc").html('<span style="padding:20px;font-size:20px;color:#1b1005;line-height:120px;">当前条件下无指标及支出数据</span>');
					return ;
				}
				
				//var mofdepCode = dataDetail[0].mofdepCode;	// 处室
				//var deptCode = dataDetail[0].deptCode;	// 部门
				//var agencyCode = dataDetail[0].agencyCode;	// 单位
				//var queryDate = dataDetail[0].queryDate;	// 时间 yyyy-MM-dd
				//var fundtypeCode = dataDetail[0].fundtypeCode;	// 预算类别
				//var expfuncCode = dataDetail[0].expfuncCode;	// 支出类型
				var budgetMoney = dataDetail[0].budgetMoney;	// 指标金额
				var payMoney = dataDetail[0].payMoney;	// 支付金额
				var lastBgtMoney = dataDetail[0].lastBgtMoney;	// 指标余额
				
				if(payMoney==0&&budgetMoney==0){
					// 渲染支出进度文字提示
					$("#_portal_zhichu_text_zbje_span").html("0");
					$("#_portal_zhichu_text_zfje_span").html("0");
					$("#_portal_zhichu_text_zbye_span").html("0"); //dfp.num2ThousandBreak(lastBgtMoney?lastBgtMoney:"0")
					$("#tooltipXSJD").css("display", "none");
					$("#dwzc").html('<span style="padding:20px;font-size:20px;color:#1b1005;line-height:120px;">当前条件下无指标及支出数据</span>');
					return;
				}
				
				_budgetMoney = budgetMoney;
				_lastBgtMoney = lastBgtMoney;
				_payMoney = payMoney;
				dfpPayProgress.hchart(payMoney, lastBgtMoney, fundtypeCode, expfuncCode, selecttime, budgetMoney);
				
				// TODO 支出进度排名
				// 支出进度本部门排名
				$("#payProgressRanking_bm").html("1");
				// 全部升级预算单位排名
				$("#payProgressRanking_ysdw").html("2");
				
				// 序时进度
				$("#tooltipXSJD").css("display", "block");
				$payprogressXSJD = $("#payprogressXSJD");
				$payprogressXSJD.css("display", "none");
				$XSJD = $("text.highcharts-plot-line-label");
				$XSJD.on("mouseover", function(e){
					$payprogressXSJD.css("display", "block")
						.css("position", "fixed")
						.css("zIndex", "4")
						.css("left", e.clientX+'px')
						.css("top", e.clientY+'px');
					$payprogressXSJD.find("ul").find("li").find("span").html(dfp.progressInYear() + "%");
				}).on("mouseout", function(){
					$payprogressXSJD.css("display", "none");
				});
				
			},
			error: function(){
				$("#tooltipXSJD").css("display", "none");
			}
		});	
	},
	hchart : function(payMoney, lastBgtMoney, fundtypeCode, expfuncCode, selecttime, budgetMoney){
		var jsonSeries = [
			{name: '可用指标', data: [lastBgtMoney]},
			{name: '已支付', data: [payMoney]}
		];
		// 单位切换，默认 1 万元，0 元，2 亿元
		var payProgressDanweiChange = $("#payProgressDanweiChange").val();
		if(payProgressDanweiChange == 1) {
			budgetMoney = (budgetMoney / 1e4).toFixed(2);
			lastBgtMoney = (lastBgtMoney / 1e4).toFixed(2);
			payMoney = (payMoney / 1e4).toFixed(2);
			_showDanwei = "万";
		} else if(payProgressDanweiChange == 2) {
			budgetMoney = (budgetMoney / 1e8).toFixed(2);
			lastBgtMoney = (lastBgtMoney / 1e8).toFixed(2);
			payMoney = (payMoney / 1e8).toFixed(2);
			_showDanwei = "亿";
		} else {
			_showDanwei = "";
		}
		
		// 渲染支出进度文字提示
        $("#_portal_zhichu_text_zbje_span").html('<span onclick="dfpPayProgressSpanClick(&quot;zbje&quot;);" style="color:#F56A00;font-weight:bold;">' + dfp.num2ThousandBreak(budgetMoney)+ '</span>' + _showDanwei);
        $("#payProgressStatementAllBudget").html('<span onclick="dfpPayProgressSpanClick(&quot;zbje&quot;);" style="color:#F56A00;font-weight:bold;">' + dfp.num2ThousandBreak(budgetMoney)+ '</span>' + _showDanwei);
        $("#_portal_zhichu_text_zfje_span").html('<span onclick="dfpPayProgressSpanClick(&quot;zfje&quot;);" style="color:#F56A00;font-weight:bold;cursor: pointer;">' +dfp.num2ThousandBreak(payMoney)+ '</span>' + _showDanwei);
        $("#payProgressStatementAllBudgetCost").html('<span onclick="dfpPayProgressSpanClick(&quot;zfje&quot;);" style="color:#F56A00;font-weight:bold;cursor: pointer;">' +dfp.num2ThousandBreak(payMoney)+ '</span>' + _showDanwei);
        $("#_portal_zhichu_text_zbye_span").html('<span onclick="dfpPayProgressSpanClick(&quot;zbye&quot;);" style="color:#F56A00;font-weight:bold;cursor: pointer;">' +dfp.num2ThousandBreak(lastBgtMoney)+ '</span>' + _showDanwei);

		// TODO 金额数目过小，导致bar比例计算失误，此处不处理bar浮框显示，避免显示数据错误
		_showDanwei = "";
		
		var xsjd = dfp.progressInYear();
		var chart = Highcharts.chart('dwzc', {
			chart: {
				type: 'bar'
				//Sheight : 100
			},
			credits: {enabled: false},
			exporting: {enabled: false},
			title: {text: ''},
			xAxis: {　　
				labels: {enabled: false},
				tickWidth: 0//, // 次级刻线宽度
				//categories: [''],
	            //lineWidth: 0,
				//lineColor:'#fff'
			},
			yAxis: {
				opposite: true, // 坐标轴对面显示
				min: 0, // 起始值
				tickWidth: 2,
				tickPosition: 'outside',
				tickLength:15,
				tickmarkPlacement: 'on', // 刻度线位置，“on”表示刻度线将在分类上方显示
				//alternateGridColor: '#FDFFD5', // 相邻刻度线之间会用对应的颜色来绘制颜色分辨带
				lineWidth: 5,
				lineColor:'#fff',
				offset: -15,
				//offset: -55,
				gridLineColor: '#FFF', // 辅助轴线颜色
				title: {text: ''},
				labels: { //y轴刻度文字标签
					style:{
						color:'#000',
						"font-size" : '14px'
					},
					formatter: function() {
						return this.value// + '%'; //y轴加上%  
					}
				},
		　　		plotLines: [{   //一条延伸到整个绘图区的线，标志着轴中一个特定值。
		　　			color: 'red', //'#108EE9',
                    dashStyle: 'Dash', //Dash,Dot,Solid,默认Solid
                    width: 1.5,
                    value: xsjd,  // TODO 序时进度，y轴显示位置
                    zIndex: 5,
                    label: {
                    	text: '▼',//+xsjd+'%',//xsjd+'%',
                        align: 'left',
                        rotation:0,
                        x: -6,
						y: 6,
                        style: {
                            'color': 'red',
                            'fontWeight': 'bold',
                            'font-size':'15px',
							'cursor':'default'
                        }
                    },
                    events: {
            			mouseover: function(e) {
            			},
            			mouseout: function() {
            			}
            		}
                }]
			},
			tooltip: { // style="color:{series.color}"
				//followTouchMove:false,
	            //followPointer:false,
				//headerFormat: '<small>{point.key}</small><br>',
				headerFormat: '',
				pointFormat: '<span >{series.name}</span>: <b>{point.y} ('+ _showDanwei +'元)</b> ({point.percentage:.2f}%)<br/>',
				shared: false
			},
			//colors: ['#F8A23C', '#7DC338'],
			colors: ['#BFBFBF', '#D2EAFB'],
			legend: {
                "enabled": false, // 隐藏图例
				reversed: true,
				layout: 'horizontal',
				align: 'right',
				itemMarginBottom: -15, // 底部margin-bottom
				verticalAlign: 'top',
				//x: 200,
				//y: 0,
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
							textShadow: '0 0 6px green'
						},
						formatter: function() {
							var percent = this.point.percentage || 0;
							return percent.toFixed(2) + '%';
						}
					},
					events: {
						legendItemClick: function() {	// 禁止图例点击
							return false;
						},
						click: function(event) {
							//支付状态
							var zfzt = event.point.series.name;
							var fundtypeCode = $("#payProgressYSLBGaojiInput_ID").val() || "";
							var expfuncCode = $("#payProgressXMFLGaojiInput_ID").val() || "";
							var bgtsourceCode = $("#payProgressZBLYGaojiInput_ID").val() || "";
							var pAgencyCode = $("#payProgressYSDWGaojiInput_ID").val() || "";
							//var agency = Base64.decode($("#svAgencyCode", parent.document).val());
							var htmlParam = "&fundtypeCode="+fundtypeCode+"&expfuncCode="+expfuncCode+"&bgtsourceCode="+bgtsourceCode+"&agencyCode="+pAgencyCode;
							if(zfzt == '已支付') {
								window.parent.addTabToParent('已支付', '/df/pay/portalpay/statusquery/payrelated/payInfo.html?billtype=366&busbilltype=311&menuid=132C25064BD2BAE4627573EEA7BB9CA8&menuname=%u652F%u51FA%u8FDB%u5EA6%u652F%u4ED8%u4FE1%u606F&tokenid='+getTokenId()+htmlParam);
							} else if(zfzt == '可用指标') {
								window.parent.addTabToParent('可用指标', '/df/pay/portalpay/input/payQuota.html?billtype=366&busbilltype=311&model=model5&menuid=B249D0506FCAAADDE98A515AB777DD31&menuname=%u652F%u51FA%u8FDB%u5EA6%u6307%u6807%u4FE1%u606F&tokenid='+getTokenId()+htmlParam);
							}	
						}
					}
				}
			},
			series: jsonSeries
		});
	}
	
};

function dfpPayProgressSpanClick(name) {
    var fundtypeCode = $("#payProgressYSLBGaojiInput_ID").val() || "";
    var expfuncCode = $("#payProgressXMFLGaojiInput_ID").val() || "";
    var bgtsourceCode = $("#payProgressZBLYGaojiInput_ID").val() || "";
    var pAgencyCode = $("#payProgressYSDWGaojiInput_ID").val() || "";
    var htmlParam = "&fundtypeCode="+fundtypeCode+"&expfuncCode="+expfuncCode+"&bgtsourceCode="+bgtsourceCode+"&agencyCode="+pAgencyCode;
    if(name == 'zfje') {
        window.parent.addTabToParent('已支付', '/df/pay/portalpay/statusquery/payrelated/payInfo.html?billtype=366&busbilltype=311&menuid=132C25064BD2BAE4627573EEA7BB9CA8&menuname=%u652F%u51FA%u8FDB%u5EA6%u652F%u4ED8%u4FE1%u606F&tokenid='+getTokenId()+htmlParam);
    } else if(name == 'zbye') {
        window.parent.addTabToParent('可用指标', '/df/pay/portalpay/input/payQuota.html?billtype=366&busbilltype=311&model=model5&menuid=B249D0506FCAAADDE98A515AB777DD31&menuname=%u652F%u51FA%u8FDB%u5EA6%u6307%u6807%u4FE1%u606F&tokenid='+getTokenId()+htmlParam);
    }
}
