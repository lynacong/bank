function getTokenId(){
	var current_url = window.location.href;
	if(current_url.indexOf("?") > -1){
		var tokenid = "";
		var params = new Array();
		params = current_url.split("?");
		if(params[1].indexOf("tokenid=") > -1){
			if(params[1].indexOf("&") > -1){
				var neededParams = params[1].split("&");
				for(var i in neededParams){
					if(neededParams[i].indexOf("tokenid=") > -1){
						tokenid = neededParams[i];
						break;
					}
				}
			}else{
				tokenid = params[1];
			}
		}
//		var tokenidFromLS = dfp.localStorage.getItem(dfp.key.tokenid);
//		if(!dfp.Object.isNull(tokenidFromLS)){
//			var tokenidFromLSs = tokenidFromLS.split(dfp.key.dfSeparator1);
//			if(tokenidFromLSs[2] == tokenid.substring(8))
//				dfp.localStorage.setItem(dfp.key.tokenid, dfp.key.dfValidFlag+tokenid.substring(8));
//		}
		return tokenid.substring(8);
	}
	return "";
}

/**
 * page key
 */
//外网
portal_fiscal_url = "http://192.168.10.11:8800/jsp/solr/index_param.jsp?name=";
//内网
//portal_fiscal_url = "http://10.28.5.155:8800/jsp/solr/index_param.jsp?name=";
var ptd_obj = {
	often : {
		oftenUrl : []
	},
	dealing : {},
	article : {
		// 更多
		ARTICLE_URL_MORE : "../../common/articleSearch.jsp?pgPletId=16&userId=sa",
		// 创建
		ARTICLE_URL_CREATE : "/df/portal/articleManagement/articleMain.html?a=1"
	}
};

/**
 * payprogress
 */
var ptd_payprogress = {
	bf : function(){
		// 支出进度截止时间初始化
		$('#budgetTime').fdatepicker({
			format: 'yyyy-mm-dd'
		});
		$("#budgetTime").val(datetimeSpe("pp"));
		var $timeFoot = $(".datepicker-days").find("tfoot").find("th.today");
		$timeFoot.css("display", "block !important");
		$timeFoot.css("border", "solid 1px #ccc");
		$timeFoot.click(function(){
			$("#budgetTime").val(datetimeSpe("pp"));
			$("div.datepicker.datepicker-dropdown.dropdown-menu").hide();
		});
		$("._portal_zhichu_select_yslb_select").on("change", function(e){
			ptd_payprogress.show();
		});
		$("._portal_zhichu_select_zclx_select").on("change", function(e){
			ptd_payprogress.show();
		});
		$("._portal_zhichu_select_zbly_select").on("change", function(e){
			ptd_payprogress.show();
		});
		$("#budgetTime").on("change", function(e){
			ptd_payprogress.show();
		});
		
	},
	show : function(){
		var fundtypeCode = $("#fundtypeCode").val();
		var expfuncCode = $("#expfuncCode").val();
		var bgtsourceCode = $("#bgtsourceCode").val();
		var selecttime = $("#budgetTime").val();
		var agency = Base64.decode($("#svAgencyCode", parent.document).val());
		$.ajax({
			url: "/df/portal/dubbo/payProgress.do",
			type: "GET",
			dataType: "json",
			data: {"tokenid":getTokenId(),"fundtypeCode":fundtypeCode,"expfuncCode":expfuncCode,"bgtsourceCode":bgtsourceCode,"selecttime":selecttime,"agency":agency},
			success: function(data) {
				
				if((data.data).length == 0){
					$("#tooltipXSJD").css("display", "none");
				}
				
				// 渲染图表
				//$("#dwzc").css("display","block");
				var dataDetail = data.data;
				if(dataDetail.length==0){
					//console.log("-- dubbo service is out");
					$("#_portal_zhichu_text_zbje_span").html("0");
					$("#_portal_zhichu_text_zfje_span").html("0");
					$("#_portal_zhichu_text_zbye_span").html("0");
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
				
				// 渲染支出进度文字提示
				$("#_portal_zhichu_text_zbje_span").html(ip.dealThousands(budgetMoney?budgetMoney:"0"));
				$("#_portal_zhichu_text_zfje_span").html(ip.dealThousands(payMoney?payMoney:"0"));
				$("#_portal_zhichu_text_zbye_span").html(ip.dealThousands(lastBgtMoney?lastBgtMoney:"0"));
				//$("#payprogressXSJD").html(ptd_util.progressInYear() + "%");
				
				if(payMoney==0&&budgetMoney==0){
					$("#dwzc").html('<span style="padding:20px;font-size:20px;color:#1b1005;line-height:120px;">当前条件下无指标及支出数据</span>');
					return;
				}
				ptd_payprogress.hchart(payMoney, lastBgtMoney, fundtypeCode, expfuncCode, selecttime);
				
				// 序时进度
				$("#tooltipXSJD").css("display", "block");
				$payprogressXSJD = $("#payprogressXSJD");
				$payprogressXSJD.css("display", "none");
				$XSJD = $("text.highcharts-plot-line-label");
				$XSJD.on("mouseover", function(e){
					$payprogressXSJD.css("display", "block")
						.css("position", "fixed")
						.css("zIndex", "9999")
						.css("left", e.clientX+'px')
						.css("top", e.clientY+'px');
					$payprogressXSJD.find("ul").find("li").find("span").html(ptd_util.progressInYear() + "%");
				}).on("mouseout", function(){
					$payprogressXSJD.css("display", "none");
				});
				
			},
			error: function(){
				$("#tooltipXSJD").css("display", "none");
			}
		});	
	},
	hchart : function(payMoney, lastBgtMoney, fundtypeCode, expfuncCode, selecttime){
		var jsonSeries = [
			{name: '可用指标', data: [lastBgtMoney]},
			{name: '已支付', data: [payMoney]}
		];
		var xsjd = ptd_util.progressInYear();
		
		$('#dwzc').highcharts({
			chart: {type: 'bar'},
			credits: {enabled: false},
			exporting: {enabled: false},
			title: {text: ''},
			xAxis: {　　
				labels: {enabled: true},
				tickWidth: 0, // 次级刻线宽度
				categories: [''],
	            lineWidth: 0,
				lineColor:'#fff'
			},
			yAxis: {
				min: 0,
				tickWidth: 1,
				alternateGridColor: '#FDFFD5',
				lineWidth: 1,
				lineColor:'#000',
				offset: 1,
				gridLineColor: '#FFF', // 辅助轴线颜色
				title: {text: ''},
				labels: { //y轴刻度文字标签
					style:{
						color:'#000'
					},
					formatter: function() {
						return this.value + '%'; //y轴加上%  
					}
				},
		　　		plotLines: [{   //一条延伸到整个绘图区的线，标志着轴中一个特定值。
		　　			color: '#FFF', //'#108EE9',
                    dashStyle: 'solid', //Dash,Dot,Solid,默认Solid
                    width: 0,
                    value: xsjd,  // TODO 序时进度，y轴显示位置
                    zIndex: 5,
                    label: {
                    	text: '▶',//+xsjd+'%',
                        align: 'left',
                        rotation:90,
                        x: -5,
						y: -4,
                        style: {
                            'color': 'red',
                            'fontWeight': 'bold',
                            'font-size':'20px',
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
				followTouchMove:true,
	            followPointer:true,
				headerFormat: '<small>{point.key}</small><br>',
				pointFormat: '<span >{series.name}</span>: <b>{point.y} (元)</b> ({point.percentage:.0f}%)<br/>',
				shared: false,
				style:{
					
				}
			},
			colors: ['#F8A23C', '#7DC338'],
			legend: {
				reversed: true,
				layout: 'horizontal',
				align: 'right',
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
							textShadow: '0 0 3px green'
						},
						formatter: function() {
							return (this.point.percentage).toFixed(2) + '%';
						}
					},
					events: {
						legendItemClick: function() {	// 禁止图例点击
							return false;
						},
						click: function(event) {
							//支付状态
							var zfzt = event.point.series.name;
							var agency = Base64.decode($("#svAgencyCode", parent.document).val());
							var htmlParam = "&fundtypeCode="+fundtypeCode+"&expfuncCode="+expfuncCode+"&agency="+agency;
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

/**
 * fiscal
 */
var ptd_fiscal = {
	bf : function(){
		// 财政百度图片效果
		$("div#pic").on("mouseover", function(){
			$(this).find("img").prop("src", "img/icon-cha-w.png");
			$(this).find("img").css("transform", "scale(1.5, 1.5)");
			$(this).css("background-color", "#108ee9");
		}).on("mouseleave", function(){
			$(this).find("img").prop("src", "img/dashboard/search1.png");
			$(this).find("img").css("transform", "scale(1.3, 1.3)");
			$(this).css("background-color", "#FFFFFF");
		});
		$("#_portal_fiscal_input").on("focus", function(){
			$(this).prop("placeholder", "");
		}).on("blur",function(){
			if(!$(this).prop("value")){
				$(this).prop("placeholder", "请输入关键词");
			}
		});
	},
	set : function(){
		this.bf();
		$("._portal_fiscal_sub").on("click", function(){
			var param = $("#_portal_fiscal_input").val();
			if(isObjNull(param)){
				alert("请输入查询内容");
				return;
			}
			window.parent.addTabToParent("财政百度", portal_fiscal_url + param + "&agencycode="+Base64.decode($("#svAgencyCode", parent.document).val()) );
		});
	}
};

/**
 * article
 */
var ptd_article = {
	show : function(){
		$("#_portal_article_more").on("click", function(){
			window.parent.addTabToParent("公告信息", fullUrlWithTokenid(ptd_obj.article.ARTICLE_URL_MORE));
		});
		$("#_portal_article_add").on("click", function(){
			window.parent.addTabToParent("公告创建", fullUrlWithTokenid(ptd_obj.article.ARTICLE_URL_CREATE));
		});
		
		var params = {
			ruleID:'getArticleData',
			pgPletId:'16',
			userId:'sa',
			start:'0',
			limit:'6'
		};
	    $.ajax({
	    	url: "/portal/GetPageJsonData.do?tokenid=" + getTokenId(),
	        type: 'GET',
	        data :params,
	        dataType : 'json',
	        success: function(result){
	        	//var ss = result.dataList;
	        	var html = "";
	        	var path ="../../common/articleDetail.jsp?";
	        	for(var i=0;i<3;i++){
	        		var name = (result[i].article_title).replace(/(^\s+)|(\s+$)/g, "");
	        		var url = path+'articleId='+result[i].article_id+'&title='+name+'&tokenid='+getTokenId();
	        		html+= '<li style="width:80%;"><span class="icon1"></span><a href="javascript:window.parent.addTabToParent(&quot;'+name+'&quot;, &quot;'+url+'&quot;);" title="'+name+'">'+name+'</a></li>';
	        	}
	        	$("#m-content").find("ul").html(html);
	        }
	    });
	}
};

var ptd_util = {
	/**
	 * 对象是否为空
	 */
	isNull : function(obj){
		if (obj === null) return true;
		if (obj === undefined) return true;
		if (obj === "undefined") return true;
		if (obj === "") return true;
		if (obj === "[]") return true;
		if (obj === "{}") return true;
		return false;
	},
	/**
	 * 序时进度，参数格式 2017/07/07
	 */
	progressInYear : function(_time){
		var _now = _time;
		if(!_time){
			_now = new Date();
		}
		var firstDay = new Date(_now.getFullYear(), 0, 1);
		var dateDiff = _now - firstDay;
		var msPerDay = 1000 * 60 * 60 * 24;
		// 计算天数
		var passDay =  Math.ceil(dateDiff/msPerDay);
		// 今年天数
		var _yearday = 365;
		var _year = 2000 + parseInt(_now.getYear());
		if (((_year % 4)==0) && ((_year % 100)!=0) || ((_year % 400)==0)) {
			_yearday += 1;
		} 
		// 序时进度
		return ((passDay/_yearday)*100).toFixed(2); // 两位小数
	}
};

/**
 * 判断tokenid前是否已存在参数
 * @params url
 * @return 拼接好tokenid的url
 */ 
function fullUrlWithTokenid(url){
	if(url == null || url == undefined)
		return url;
	url = url.replace(/\s/g, "");
	if(url.indexOf("?") > -1)
		return url + "&tokenid=" + getTokenId();
	if(url.indexOf("?") < 0)
		return url + "?tokenid=" + getTokenId();
}

/**
 * 判断对象是否为空
 */
function isObjNull(obj){
	if(obj != null || obj != "") return false;
	if(obj) return false;
	var length = obj.length;
	if(!length) return true; // undefined
	if(length == 0)	return true;
	var count = 0;
	for(var i = 0; i < length; i++){
		if(obj[i] == null || obj[i] == "" || obj[i] == undefined)
			count += 1;
	}
	return count == length ? true : false;
}

/**
 * 获取当前时间
 * @params pp: 支付进度
 */
function datetimeSpe(type) {
	var SEP_1 = "-";
	var SEP_2 = ":";
	var myDate = new Date();
	var Year = myDate.getFullYear();
	var Month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
	Month = Month>=1&&Month<=9 ? "0"+Month : Month;
	var Today = myDate.getDate(); //获取当前日(1-31)
	Today = Today>=1&&Today<=9 ? "0"+Today : Today;
	var Day = myDate.getDay();
	if ("pp" == type) {
		return Year + SEP_1 + Month + SEP_1 + Today; // 2017-07-22
	}
//var Hour = myData.getHours();
//var Minute = myDate.getMinutes();
//var Second = myDate.getSeconds();
	
}

/**
 * excel工具
 */
//var capital = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//var digit = [1, 26, 676, 17576];
//var capital_zero = "-0ABCDEFGHIJKLMNOPQRSTUVWXYZ";
////导出dataTable数据到Excel文件中
//function export2Excel(dataTable, options, fileName) {
//    if (!(dataTable instanceof u.DataTable)) {
//        ip.ipInfoJump("dataTable参数不正确!", "error");
//        return;
//    }
//    options = options || {};
//    options.type = options.type === "select" ? options.type : "all";
//    options.fieldMap = (options.fieldMap instanceof Array ? options.fieldMap : []);
//    fileName = fileName || "导出文件" + getCurrentDate() + ".xlsx";
//    if (fileName.slice(-5).toLowerCase() != '.xlsx') {
//        fileName = fileName + ".xlsx";
//    }
//
//    var sheet = dtData2Sheet(dataTable, options);
//    saveExcelFile(sheet, fileName);
//}
////以下载文件的方式保存导出的Excel文件
//function saveExcelFile(sheet, fileName) {
//    var wb = {
//        SheetNames: ['Sheet1'],
//        Sheets: {
//            'Sheet1': sheet
//        }
//    };
//    var wopts = {bookType: 'xlsx', bookSST: false, type: 'binary'};
//    var wbout = XLSX.write(wb, wopts);
//    saveAs(new Blob([s2ab(wbout)], {type: ""}), fileName);
//}
////将dataTable中数据转为Sheet数据格式
//function dtData2Sheet(dataTable, options) {
//    var rows = (options.type === "select" ? dataTable.getSelectedRows() : dataTable.getAllRows());
//    var sheet = {};
//    var fields = options.fieldMap;
//    for (var h = 0; h < fields.length; h++) {
//        if (fields[h] && fields[h].fieldName) {
//            sheet[index2ColName(h + 1) + "1"] = {"v": (fields[h].title ? fields[h].title : fields[h].fieldName)};
//        }
//    }
//    for (var r = 0; r < rows.length; r++) {
//        for (var c = 0; c < fields.length; c++) {
//            if (fields[c] && fields[c].fieldName) {
//                var v = rows[r].getValue(fields[c].fieldName);
//                if (v) {
//                    sheet[index2ColName(c + 1) + (r + 2)] = {"v": v};
//                }
//            }
//        }
//    }
//    sheet["!ref"] = "A1:" + index2ColName(Math.max(fields.length, 1)) + (r + 1);
//    return sheet;
//}
////String转换为ArrayBuffer
//function s2ab(s) {
//    var buf = new ArrayBuffer(s.length);
//    var view = new Uint8Array(buf);
//    for (var i = 0; i < s.length; ++i) {
//        view[i] = s.charCodeAt(i) & 0xFF;
//    }
//    return buf;
//}
////index转为列名，如：28 转为 AB
//function index2ColName(index) {
//    var colName = "";
//    var j = 0;
//    for (var i = digit.length - 1; i >= 0; i--) {
//        j = Math.floor(index / digit[i]);
//        if (j > 0) {
//            colName += capital[j - 1];
//            index = index % digit[i];
//        } else {
//            if (colName.length > 0) {
//                colName += "0"
//            }
//        }
//    }
//    colName = colName.split("");
//    for (var x = colName.length - 1; x >= 0; x--) {
//        if (colName[x] == "0") {
//            if (colName.join("").substring(0, x).replace(/0/g, "") != "") { //向高位借位处理0
//                colName[x] = "Z";
//                colName[x - 1] = capital_zero[capital_zero.indexOf(colName[x - 1]) - 1];
//            } else {
//                break;
//            }
//        } else if (colName[x] == "-") {  //向高位借位，还低位的借位
//            colName[x] = "Y";
//            colName[x - 1] = capital_zero[capital_zero.indexOf(colName[x - 1]) - 1];
//        }
//    }
//    return colName.join("").replace(/0/g, "");
//}
//function getCurrentDate() {
//    var d = new Date();
//    return "" + d.getFullYear() +
//        (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1) +
//        (d.getDate() < 10 ? "0" : "") + d.getDate() +
//        (d.getHours() < 10 ? "0" : "") + d.getHours() +
//        (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() +
//        (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();
//}



/**
 * 初始化
 */
function Portal_d(){
	this.obj = ptd_obj;
	this.pp = ptd_payprogress;
	this.fiscal = ptd_fiscal;
	this.at = ptd_article;
	this.util = ptd_util;
}
