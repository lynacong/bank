define(['text!pages/report/EBankReportPayAgentBillPrint/EBankReportPayAgentBillPrint.html',
    'jquery','knockout', "calendar",
	'bootstrap','ip','ebankConstants','ebankCommonUtil', 'dateZH','assp','datatables.net-bs', 
    'datatables.net-autofill-bs', 
    'datatables.net-buttons-bs', 'datatables.net-colreorder',
    'datatables.net-rowreorder', 'datatables.net-select',
    'datatables.net-scroller',
    'datatables.net-keyTable', 
    'datatables.net-responsive','initDataTableUtil' ],function(html){
	var init =function(element,param){ 
		//页面标题
		document.title=ip.getUrlParameter("menuname"); 
		//根据主单查明细
		$("body").on('click', '#dwItemDataGrid1 tr', function () {
		       var dataSrc = $('#dwItemDataGrid1').DataTable().row($(this)).data();
			   var id = dataSrc.id;
		        optionsSub["id"]=id;
		        optionsSub["loadDataFlag"]=true;
				detailTable.ajax.reload(null, true);
		  	});
		  	
		var requesting=false;
		var optionsMain = ip.getCommonOptions({});
		var optionsSub = ip.getCommonOptions({});
		optionsMain["isDataTables"]=true;
		optionsSub["isDataTables"]=true;
		
		var baseURL = EBankConstant.Ctx + "billStampSend";
		var vtCode=ip.getUrlParameter("vt_code");
		var viewModel = {
				tokenid : ip.getTokenId()
			};
		
		//构建传入后台的billNos
		buildBillNosAndFinanceCode = function(id){
			var billNosAndFinanceCode = new Array();
			var selectRows = $('#dwItemDataGrid1').DataTable().rows('.selected');
			for (var i = 0; i < selectRows.indexes().length; i++) {
				var temp = {};
				temp["bill_no"] = selectRows.data()[i].bill_no;
				temp["finance_code"] = selectRows.data()[i].finance_code;
				temp["clear_account_bank"] = selectRows.data()[i].clear_account_bank;
				billNosAndFinanceCode.push(temp);
			}
			return billNosAndFinanceCode;
		};
		

		

		
		//查询按钮
		fSelect = function(){		
			viewModel.getQueryView();
			clearDetail();
			SjAccTable.ajax.reload(null, true);		
		};
		//清空明细列表
		 clearDetail= function() {
		    optionsSub["loadDataFlag"]=false;
			detailTable.clear();
			detailTable.draw();
		}
		
		//获取查询区参数
		viewModel.getQueryView = function(){
			var year=document.getElementById("set_year" + "-"
					+ viewModel.queryViewId.substring(1, 37)).value;
			if(year==null||year==''){
				ip.warnJumpMsg("年度不能为空，请选择！！！",0,0,true);
				return false;
			}
			var billNO = document.getElementById("bill_no"
					+ "-" + viewModel.queryViewId.substring(1, 37)).value;
			var startTime=document.getElementById("create_date"
					+ "-" + (viewModel.queryViewId.substring(1, 37)+1)).value;
			var endTime=document.getElementById("create_date"
					+ "-" + (viewModel.queryViewId.substring(1, 37)+2)).value;
			var pay_money = document.getElementById("pay_money"
					+ "-" + viewModel.queryViewId.substring(1, 37)).value;
			optionsMain["condition"]='1=1 ';
			if(billNO!=null&&billNO!=''){
				optionsMain["condition"]=optionsMain["condition"]+"and bill_no='"+billNO+"'";
			}
			if(startTime!=null&&startTime!=''){
				optionsMain["condition"]=optionsMain["condition"]+"and create_date>='"+startTime+"'";
			}
			if(endTime!=null&&endTime!=''){
				endTime=dateAddOneDay(endTime);
				optionsMain["condition"]=optionsMain["condition"]+"and create_date<'"+endTime+"'";
			}
			if(pay_money!=null&&pay_money!=''){
				optionsMain["condition"]=optionsMain["condition"]+"and pay_money='"+pay_money+"' ";
			}
			optionsMain["finance_code"] =document.getElementById("finance_code" + "-"
					+ viewModel.queryViewId.substring(1, 37)).value;
			optionsMain["set_year"] =document.getElementById("set_year" + "-"
					+ viewModel.queryViewId.substring(1, 37)).value;
		};
		

		
		
		// 凭证查看
		doVoucherSee = function(id, evt) {
			var e = evt || window.event;
			//$('#planCheckModalDetail').modal('show');
			var billIds = buildBillIds(id);
			if(billIds.length<1){
				ip.warnJumpMsg("请选择数据进行凭证查看",0,0,true);
				return;
			}
			doAsspVoucherSee(billIds,evt,vtCode);
			window.event ? e.cancelBubble = true : e.stopPropagation();
		};
					
		//预览
		doVoucherPreview = function(id, evt) {
			var e = evt || window.event;
			//$('#planCheckModalDetail').modal('show');
			var billIds = buildBillIds(id);
			if(billIds.length<1){
				ip.warnJumpMsg("请选择数据进行凭证预览",0,0,true);
				return;
			}
			doAsspVoucherPreview(billIds,evt,vtCode);
			window.event ? e.cancelBubble = true : e.stopPropagation();
		};
		
		//构建传到后台的ids
		buildBillIds = function(id){
			var billIds =new Array();
			var selectRows = $('#dwItemDataGrid1').DataTable().rows('.selected');
			for (var i = 0; i < selectRows.indexes().length; i++) {
				var temp = {};
				temp["bill_no"] = selectRows.data()[i].bill_no;
				temp["finance_code"] = selectRows.data()[i].finance_code;
				temp["id"] = selectRows.data()[i].id;
				temp["set_year"] = selectRows.data()[i].set_year;
				set_year.push(temp);
			}	
			return	billIds;
		};
		
		

		printBillfunction=function(evt){

			var e = evt || window.event;
			//var dataList = $('#modalMianGridArea').DataTable().rows().data();
			//var dataList=viewModel.mainViewModel.gridData.getAllRows();
			//var dataList = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getAllRows();
			
			//构建传入后台的billNos
				var billNosAndFinanceCode = new Array();
				var selectRows = $('#dwItemDataGrid1').DataTable().rows('.selected');
				if( selectRows.indexes().length==0||selectRows.indexes().length>1){
					ip.warnJumpMsg("请选择一条数据",0,0,true);
					return;
				}
				for (var i = 0; i < selectRows.indexes().length; i++) {
					var temp = {};
					temp["bill_no"] = selectRows.data()[i].bill_no;
					temp["finance_code"] = selectRows.data()[i].finance_code;
					temp["clear_account_bank"] = selectRows.data()[i].clear_account_bank;
					billNosAndFinanceCode.push(temp);
				}
			previewFile(billNosAndFinanceCode,ip.getUrlParameter("reportmould"),"0",ip.getTokenId());
			//previewFileNew(dataList,ip.getUrlParameter("reportmould"),"0",ip.getTokenId());

		};
		
		//初始化视图信息
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
					//viewModel.coaId = datas.coaId;// coaid
					//viewModel.coaDetails = datas.coaDetail;// coa明细
					//viewModel.relations = datas.relationlist;// 关联关系
					for ( var n = 0; n < viewModel.viewList.length; n++) {
						var view = viewModel.viewList[n];
						var status = document.getElementById("fs_status").value;
						//001：录入视图、002：列表视图、003：查询视图、004：详细显示视图、005：Toolbar视图、101：路由视图
						if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST ) {// 列表视图
							if (view.orders == "1") {//主单
								viewModel.mainViewId = view.viewid;
								optionsMain["tableViewId"] = view.viewid;
								optionsMain["queryViewId"] = viewModel.queryViewId;
								optionsMain["isSetValue"] = "false";
								//viewModel.mainGridViewModel = ip.initGrid(view, 'modalMianGridArea', EBankConstant.CommonUrl.query+"/doFind.do", optionsMain, 0, true);
								optionsMain["isDetailQuery"] = "false";
								optionsMain["pageInfo"] = "10,0,";
								optionsMain["queryTable"] = EBankConstant.PayTables.EBANK_AGENT_BILL;
								optionsMain["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
								optionsMain["isWorkFlowRelated"] = "false";
								optionsMain["relationBillId"] = "agent_bill_id";
								if(status == "1"){
									optionsMain["status"] = EBankConstant.WfStatus.TODO_001;
								}else{
									optionsMain["status"] = EBankConstant.WfStatus.AUDITED_002;
								}
								optionsMain["set_year"] = optionsMain["svSetYear"];
								optionsMain["finance_code"] = "000000";
							//	optionsMain["scrollY"]="180px";
								optionsMain["loadDataFlag"]=true;
								SjAccTable = initDataTables("dwItemDataGrid1","/df/f_ebank/common/query/doFind.do",optionsMain,view.viewDetail);
							} else if (view.orders == "2") {//明细单
								viewModel.subsysViewId = view.viewid;
								optionsSub["tableViewId"] = view.viewid;
								optionsSub["isSetValue"] = "false";
								optionsSub["isDetailQuery"] = "true";
								optionsSub["pageInfo"] = "10,0,";
								optionsSub["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
								optionsSub["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
								optionsSub["isWorkFlowRelated"] = "false";
								optionsSub["relationBillId"] = "agent_bill_id";
								optionsSub["set_year"] = optionsSub["svSetYear"];
								//optionsSub["scrollY"]="100px";
								optionsSub["loadDataFlag"]=false;
								if(status == "1"){
									optionsSub["status"] = EBankConstant.WfStatus.TODO_001;
								}else{
									optionsSub["status"] = EBankConstant.WfStatus.AUDITED_002;
								}
								detailTable = initDataTables("dwItemDetailGrid1","/df/f_ebank/common/query/doFind.do",optionsSub,view.viewDetail);
							};
						}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){//查询视图
							viewModel.queryViewId = view.viewid;
							viewModel.planSearchViewModel = ip.initArea(view.viewDetail,"search", view.viewid.substring(1,37),"modalQueryGridArea");
							getFinancreCode("-"+ viewModel.queryViewId.substring(1, 37),optionsMain,viewModel.tokenid);
							initYear("-"+ viewModel.queryViewId.substring(1, 37),optionsMain["svSetYear"]);
						}else{}
					}
					var menuBtnWidth = $(".mainLabel").innerWidth();
					$(".button-fixed").css("width",menuBtnWidth);
				}
			});
		};
		
		pageInit =function(){
			viewModel.initData();	
		}

		$(element).html(html);	
		pageInit();
	};
	
	
	return {
		'template':html,
 	
        init:init
    };
});
