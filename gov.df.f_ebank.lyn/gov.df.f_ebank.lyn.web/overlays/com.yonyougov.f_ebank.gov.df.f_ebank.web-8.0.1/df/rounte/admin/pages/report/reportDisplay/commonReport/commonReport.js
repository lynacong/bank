//公共打印前台
define(['text!pages/report/reportDisplay/commonReport/commonReport.html','operate',
        'css!pages/report/reportDisplay/commonReport/commonReport',
        'jquery','es5sham','html5','calendar', 'bootstrap','ip','ebankConstants','datatables.net-bs', 'ebankCommonUtil',
        'datatables.net-select','initDataTableUtil' ],function(html,operate){
		var init =function(element,param){
			var requesting=false;
			var optionsMain = ip.getCommonOptions({});
			var optionsSub = ip.getCommonOptions({});
			optionsMain["isDataTables"]=true;
			optionsSub["isDataTables"]=true;
			var vtCode = ip.getUrlParameter("vt_code");
			var report_seq = ip.getUrlParameter("report_seq");
			var viewModel = {
				tokenid : ip.getTokenId()
			};
			//显示视图信息
			viewModel.initData = function() {
				$.ajax({
					url : "/df/init/initMsg.do?tokenid="
					+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					async : true,
					data : optionsMain,
					success : function(datas) {
						viewModel.viewList = datas.viewlist;// 视图信息
						viewModel.resList = datas.reslist;// 资源信息
						for ( var n = 0; n < viewModel.viewList.length; n++) {
							var view = viewModel.viewList[n];
							if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){//查询视图
								viewModel.queryViewId = view.viewid;
								viewModel.planSearchViewModel = ip.initArea(view.viewDetail,"search", view.viewid.substring(1,37),"modelQueryArea");
								getFinancreCode("-"+ viewModel.queryViewId.substring(1, 37),optionsMain,viewModel.tokenid);
								getYear("-"+ viewModel.queryViewId.substring(1, 37),viewModel.tokenid);
							}
						};
						var menuBtnWidth = $(".mainLabel").innerWidth();
						$(".button-fixed").css("width",menuBtnWidth);
					},
				});
			};

			//查询
			fSelect = function(){
				var queryFlag = viewModel.getQueryView();
				if(!report_seq){
					ip.warnJumpMsg("请在菜单管理中添加菜单顺序report_seq参数！",0,0,true);
					return;
				}
				optionsMain["pageNo"]="0";
				$.ajax({
					url : "/df/f_ebank/reportDisplay/reportQuery.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					data :optionsMain,
					success : function(data) {
						if (data.errorCode==-1) {
							ip.warnJumpMsg("未查询到数据！",0,0,true);
						}else {
							//modify by zhangycg  2019.4.18
							var ocx = document.getElementById('ocxDSc');
							ocx.showVoucherFEbank(data.mould,data.xml);
							requesting=false;
						}
					}
				});
				
			};
			//获取查询区参数
			viewModel.getQueryView = function(){
				//此处预算单位是根据agencyname查询，但是ip.js中统一封装为通过agency的code查询 建议改后台
				var condition = new Array();
				optionsMain["condition"]='';
				var queryWhere = viewModel.planSearchViewModel
				var temp = {};
				for (var i = 0; i < queryWhere.length; i++) {
					var key = queryWhere[i].id.substring(0, queryWhere[i].id.indexOf("-"));
					var keyName = $("#"+queryWhere[i].id).parent().prev("label").html();
					if (queryWhere[i].type == 'doubletime') {
						keyName = $("#"+queryWhere[i].id + 1).parent().prev("label").html();
						var begin_date = $("#" + queryWhere[i].id + 1).val();
						var end_date = $("#" + queryWhere[i].id + 2).val();
						if (begin_date != "" && end_date != "") {
							if(!ip.compareSearchTime(begin_date,end_date)){
								ip.warnJumpMsg(keyName+" 起始时间不能大于结束时间！",0,0,true);
								return false;
							}else {
									temp[key+'_start'] = begin_date;
									temp[key+'_end'] = end_date;
							}
						}else {
							ip.warnJumpMsg(keyName+" 请输入查询条件！",0,0,true);
							return false;
						}
						
					}else if (queryWhere[i].type == 'multreeassist') {
						var value = $("#" + queryWhere[i].id).val();
						if (value != "") {
							var valueArr = value.split(",");
							var pams = "(";
							for (var q = 0; q < valueArr.length; q++) {
                                pams = pams + "'" + valueArr[q].split(" ")[0] + "',";
							}
                            pams = pams.substring(0, pams.length - 1) + ")";
							temp[key] = pams;
						}
					}else {
						var value = $("#" + queryWhere[i].id).val().trim();
						if (value != "") {
							temp[key] = value;
						}else {
							
							ip.warnJumpMsg(keyName+" 请输入查询条件！",0,0,true);
							return false;
						}
					}
					
				}
				temp["report_seq"] = report_seq;
				condition.push(temp);
				optionsMain["condition"] = JSON.stringify(condition);
			    return true;
			};
			//导入Excel
			expExcel = function() {
				var ocx=document.getElementById('ocxDSc');
				ocx.exportExcel();
			};
			expPDF = function() {
				var ocx=document.getElementById('ocxDSc');
				ocx.exportPDF();
			};
			doPrint=function(){
				var ocx=document.getElementById('ocxDSc');
				ocx.printReportFEbank('','');
			};
			$(element).html(html);	
			pageInit =function(){
				viewModel.initData();
			};
			
			pageInit();
		};
		return {
	         init:init
	    };
	});
