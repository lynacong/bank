require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH' ],
		function($, ko, echarts) {
			var payeeMessagetemp={};
			var requesting=false;
			var advice;
			var isEditInitPayeeMessage=0;
			var needPaydata;
			var mainOptions = ip.getCommonOptions({});
			var voucherOptions=ip.getCommonOptions({});
			var queryURL=EBankConstant.CommonUrl.query;
			var baseURL = EBankConstant.Ctx + "pay/payCommon";
			var moneyFormat = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
			mainOptions["operate_width"] =100;
			var stiff_user_code='';
			var viewModel = {
				tokenid : ip.getTokenId(),
				 gridDataTable: new u.DataTable({
				    	meta: {
				    		'bill_no': {},
				    		'pay_money': {},
				    		'finance_code':{},
				    	}
				    }),
			    gridNodes: new u.DataTable({
			    	meta: {
			    		'suggest': {},
			    	}
			    }),
			};
			
			//构建传到后台的billIds
			buildBillIdsAndFinanceCode = function(id){
				var billIdsAndFinanceCode =new Array();
				if (id != null && id != undefined && (id + " ").trim().length > 0) {//id不为空
					billIdsAndFinanceCode = [];
					var payData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var temp = {};
					temp["id"] = payData.id;
					temp["finance_code"] = payData.finance_code;
					temp["payee_account_bank"] = payData.payee_account_bank;
					temp["payee_account_no"] = payData.payee_account_no;
					temp["payee_account_name"] = payData.payee_account_name;
					temp["pf_name"] = payData.pf_name;
					temp["pay_money"] = payData.pay_money;
					billIdsAndFinanceCode.push(temp);
				} else {//id为空
					billIdsAndFinanceCode = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','finance_code','payee_account_bank','payee_account_no','pf_name','payee_account_name','pay_money' ]
					});
				}
				return	billIdsAndFinanceCode;
			};
			//垫款
			advance=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				if(mainOptions["svUserType"]==EBankConstant.UserType.MANAGER){
					ip.warnJumpMsg("柜员不合法！",0,0,true);
					requesting=false;
					return;
				}
				var billIdsAndFinanceCode=buildBillIdsAndFinanceCode(id);
				needPaydata=billIdsAndFinanceCode;
				if(billIdsAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据",0,0,true);
					requesting=false;
					return;
				} 
				payeeMessagetemp = {};
				mainOptions["payeeMessage"]=JSON.stringify(payeeMessagetemp);
				mainOptions["btype"]=ip.getUrlParameter("btype");
				mainOptions["dc"]="1";
				mainOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				
					$.ajax({
						url : baseURL+"/doAdvance.do?tokenid="
							+ viewModel.tokenid,
						type : "POST",
						data :mainOptions,
						success : function(data) {
								viewModel.fSelect();
								ip.warnJumpMsg(data.result,0,0,true);
								requesting=false;
						}
					});
			};
			//垫款状态确认
			confirmAdvance=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				if(mainOptions["svUserType"]==EBankConstant.UserType.MANAGER){
					ip.warnJumpMsg("柜员不合法！",0,0,true);
					requesting=false;
					return;
				}
				var billIdsAndFinanceCode=buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false;
					return;
				}
				
				mainOptions["btype"]=ip.getUrlParameter("btype");
				mainOptions["dc"]="1";
				mainOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : baseURL+"/doConfirmsAdvance.do?tokenid="
					+ viewModel.tokenid,
					type : "POST",
					data :mainOptions,
					success : function(data) {
							viewModel.fSelect();
							ip.warnJumpMsg(data.result,0,0,true);
							requesting=false;
					}
				});
			}
			
			//撤销垫款
			cancelAdvance=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				if(mainOptions["svUserType"]==EBankConstant.UserType.MANAGER){
					ip.warnJumpMsg("柜员不合法！",0,0,true);
					requesting=false;
					return;
				}
				var billIdsAndFinanceCode=buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length!=1){
					ip.warnJumpMsg("请选择一条数据！！！",0,0,true);
					requesting=false;
					return;
				} 
				mainOptions["btype"]=ip.getUrlParameter("btype");
				mainOptions["dc"]="-1";
				mainOptions["vt_code"]=ip.getUrlParameter("vt_code");
				mainOptions["isRet"]="0";
				mainOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : baseURL+"/doCancelAdvance.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					data :mainOptions,
					success : function(data) {
							viewModel.fSelect();
							ip.warnJumpMsg(data.result,0,0,true);
							requesting=false;
					}
				});
			}
			
			//撤销垫款状态确认
			confirmCancelAdvance=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				if(mainOptions["svUserType"]==EBankConstant.UserType.MANAGER){
					ip.warnJumpMsg("柜员不合法！",0,0,true);
					requesting=false;
					return;
				}
				var billIdsAndFinanceCode=buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false;
					return;
				} 
				
				mainOptions["btype"]=ip.getUrlParameter("btype");
				mainOptions["dc"]="-1";
				mainOptions["vt_code"]=ip.getUrlParameter("vt_code");
				mainOptions["isRet"]="0";
				mainOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : baseURL+"/doConfirmCancelAdvance.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					data :mainOptions,
					success : function(data) {
							viewModel.fSelect();
							ip.warnJumpMsg(data.result,0,0,true);
							requesting=false;
					}
				});
			}
			
			
			
			//设置cookie 
			setCookie=function(cname, cvalue, exdays) {  
			    var d = new Date();  
			    d.setTime(d.getTime() + (exdays*24*60*60*1000));  
			    var expires = "expires="+d.toUTCString();  
			    document.cookie = cname + "=" + cvalue + "; " + expires;  
			} 
			//获取cookie  
			getCookie=function(cname) {  
			    var name = cname + "=";  
			    var ca = document.cookie.split(';');  
			    for(var i=0; i<ca.length; i++) {  
			        var c = ca[i];  
			        while (c.charAt(0)==' ') c = c.substring(1);  
			        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);  
			    }  
			    return "";  
			}  
			
			//清除填写意见的文本域
			viewModel.clear=function(){
				$("#advice").val("");
			}
			
			getNotes=function(){
				var id=viewModel.gridNodes.getFocusIndex();
				var rowData = $("#gridNotes ")[0]['u-meta'].grid.getRowByIndex(id).value;
				$("#advice").val(rowData.suggest);
			}
			
			viewModel.notes=function(){
				$("#preNotes").modal("show");
				var data=getCookie("czNotes");
				if(data!=null||data!=''){
					var noteData=[];
					var	prenotes=data.split(",");
					for (var i=0;i<prenotes.length;i++){
						if(prenotes[i]!=null&&prenotes[i]!=""){
							 var temp={
		 							"suggest":prenotes[i],
		 						 };
							 noteData.push(temp);
						}
					}
					viewModel.gridNodes.setSimpleData(noteData);
				}
			}
			//删除所有审核意见
			viewModel.delAll=function(){
				nodes = viewModel.gridNodes.getAllDatas();
				if(nodes.length==0){
					ip.warnJumpMsg("没有可删除的数据！",0,0,true);
					return;
				}	
				 ip.warnJumpMsg("确定要删除所有审核意见吗？","del", "cCla");
				 $("#del").on("click", function() {
						setCookie("czNotes", "", -1);
						 $("#preNotes").modal("hide");
						 $("#config-modal").remove();
					});
					
					$(".cCla").on("click", function() {
						$("#config-modal").remove();
					});
			}
			//删除选中的审核意见
			viewModel.delCheck=function(){
				nodes = viewModel.gridNodes.getSimpleData({  //批量选中
					type : 'select',
					fields : [ 'suggest' ]
				});
				if(nodes.length==0){
					ip.warnJumpMsg("请选择数据进行删除！",0,0,true);
					return;
				}				
				var cookieData='';
				var data=getCookie("czNotes");
				var	prenotes=data.split(",");
				for (var i=0;i<prenotes.length;i++){
					for (var j=0;j<nodes.length;j++){
						if(prenotes[i]==nodes[j].suggest){
							prenotes[i]='';
						}
					}
					if(prenotes[i]!=''){
						cookieData=cookieData+","+prenotes[i];
					}
				}
				 ip.warnJumpMsg("确定要删除选中的审核意见吗？","del", "cCla");
				 $("#del").on("click", function() {
					 setCookie("czNotes",cookieData);
						 $("#preNotes").modal("hide");
						 $("#config-modal").remove();
					});
					
					$(".cCla").on("click", function() {
						$("#config-modal").remove();
					});
			}
			//保存审核意见并退回财政
			viewModel.saveAdvice=function(){
				advice=$("#advice").val();
				if(advice==''||advice==null){
					ip.warnJumpMsg("请填写审核意见",0,0,true);
					requesting=false;
					return;
				}else{
					if(document.getElementById('check').checked){
						var data=getCookie("czNotes");
						if(data!=null && data!=""){
							var temp=data.split(",");
							for(var i=0;i<temp.length;i++){
								if(temp[i]==advice){
									break;
								}else if(i==temp.length-1){
									setCookie("czNotes",data+","+advice);
								}
							}
						}
						else
							document.cookie="czNotes="+advice;
					}
					$("#backAdvice").modal("hide");
					mainOptions["advice"]=advice;
					$.ajax({
						url : baseURL+"/doBackCZ.do?tokenid="
							+ viewModel.tokenid,
						type : "POST",
						data :mainOptions,
						success : function(data) {
							if(data.is_success=='0'){
								ip.warnJumpMsg(data.error_msg,0,0,true);
							}else{
								viewModel.fSelect();
								ip.warnJumpMsg('支付凭证退回财政成功',0,0,true);
							}
							requesting=false;
					}
				});
				}
			}
			viewModel.close=function(){
				$("#backAdvice").modal("hide");
				requesting=false;
			}
			
			//退回财政
			ref=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				var billNosAndFinanceCode =new Array();
				if (id != null && id != undefined && (id + " ").trim().length > 0) {//id不为空
					billNosAndFinanceCode = [];
					var planData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var temp = {};
					temp["bill_no"] = planData.bill_no;
					temp["finance_code"] = planData.finance_code;
					temp["pay_money"] = planData.pay_money;
					billNosAndFinanceCode.push(temp);
				} else {//id为空
					billNosAndFinanceCode = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'bill_no','finance_code' ,'pay_money']
					});
				}
				var allMoney=0.00;
				 if(billNosAndFinanceCode.length==0){
					 ip.warnJumpMsg("请选择数据",0,0,true);
					 requesting=false;
						return;
				 }else{
					 for (var i=0;i<billNosAndFinanceCode.length;i++){
						 allMoney=allMoney+parseFloat(billNosAndFinanceCode[i].pay_money);
					 }
				 }
				 
				 mainOptions["vt_code"]=ip.getUrlParameter("vt_code");
				 mainOptions["billNosAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
				 mainOptions["ajax"]="nocache";
				 
				 //退回财政意见  viewModel.sumArry(billNosAndFinanceCode)
				 $("#advice").val("");
		 		 $("#backAdvice").modal("show");
		 		 viewModel.gridDataTable.setSimpleData(billNosAndFinanceCode);
		 		 $("#money").html(allMoney);
			}
			
			//查询
			viewModel.fSelect=function(){
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
				fsc_show();
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
			}
			
			//凭证查看
			doVoucherSee=function(id, evt){
				if(requesting){
					return;
				}
				requesting=true;
				var e = evt || window.event;
				var billIds =new Array();
				if (strIsNotNull(id)) {//id不为空
					billIds = [];
					var planData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var tempId = {};
					tempId["id"] = planData.id;
					tempId["finance_code"]= planData.finance_code;
					tempId["set_year"]= planData.set_year;
					tempId["bill_no"]= planData.bill_no;
					billIds.push(tempId);
				} else {//id为空
					billIds = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','finance_code','set_year','bill_no' ]
					});
				}
				if(billIds.length<1){
					ip.warnJumpMsg("请选择数据进行凭证查看",0,0,true);
					requesting=false;
					return;
				}
				doAsspVoucherSee(billIds,evt,ip.getUrlParameter("vt_code"));
				window.event ? e.cancelBubble = true : e.stopPropagation();
				requesting=false;
			}
			
			//点击主单查询明细
			getDetail=function(){
				var id=viewModel.mainViewModel.gridData.getFocusIndex();
				var rowData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
				voucherOptions["id"] =rowData.id;
				voucherOptions["finance_code"] =mainOptions["finance_code"];
				voucherOptions["set_year"] =mainOptions["set_year"];
				ip.setGrid(viewModel.voucherGridViewModel, queryURL+"/doFind.do", voucherOptions);
			}
			
			viewModel.getQueryView = function() {
				var year=document.getElementById("set_year" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				if(year==null||year==''){
					ip.warnJumpMsg("年度不能为空，请选择！！！",0,0,true);
					return;
				}
				//mainOptions["condition"]=ip.getAreaData(viewModel.planSearchViewModel);
				var billNO = document.getElementById("bill_no"
						+ "-" + viewModel.planQueryViewId.substring(1, 37)).value;
				var startTime=document.getElementById("create_date"
						+ "-" + (viewModel.planQueryViewId.substring(1, 37)+1)).value;
				var endTime=document.getElementById("create_date"
						+ "-" + (viewModel.planQueryViewId.substring(1, 37)+2)).value;
				var pay_money = document.getElementById("pay_money"
						+ "-" + viewModel.planQueryViewId.substring(1, 37)).value;
				mainOptions["condition"]='1=1 ';
				if(billNO!=null&&billNO!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and bill_no='"+billNO+"' ";
				}
				if(startTime!=null&&startTime!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and create_date>='"+startTime+"' ";
				}
				if(endTime!=null&&endTime!=''){
					endTime=dateAddOneDay(endTime);
					mainOptions["condition"]=mainOptions["condition"]+"and create_date<'"+endTime+"' ";
				}
				if(pay_money!=null&&pay_money!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and pay_money='"+pay_money+"' ";
				}
				mainOptions["finance_code"] =document.getElementById("finance_code" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				mainOptions["set_year"] =year;
			}
			
			
			//主单上的操作
			modalMianGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				var status = $("#pz_status option:selected").val();
				var year=document.getElementById("set_year" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				var d = new Date();
				if(year==d.getFullYear()){
					if(status=='001'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
						+ '" onclick="advance(this.id)" class="iconmenu icon-clearing-bank-amendment" title="垫款"></a><a id="'
						+ obj.rowIndex
						+ '" onclick="confirmAdvance(this.id)" class="iconmenu icon-confirms" title="垫款状态确认"></a><a id="'
						+ obj.rowIndex
						+ '" onclick="ref(this.id)" class="iconmenu icon-recover" title="退回财政"></a><a id="'
						+ obj.rowIndex
	        	        + '" onclick="doVoucherSee(this.id)" class="iconmenu icon-previews" title="凭证查看"></a></div>';
					}else if(status=='002'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
							+ '" onclick="cancelAdvance(this.id)" class="iconmenu icon-refund-redial" title="撤销垫款"></a><a id="'
							+ obj.rowIndex
							+ '" onclick="confirmCancelAdvance(this.id)" class="iconmenu icon-confirms" title="撤销垫款状态确认"></a><a id="'
							+ obj.rowIndex
		        	        + '" onclick="doVoucherSee(this.id)" class="iconmenu icon-previews" title="凭证查看"></a></div>';
					}else if(status=='004'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
							+ '" onclick="ref(this.id)" class="iconmenu icon-recover" title="退回财政"></a><a id="'
							+ obj.rowIndex
		        	        + '" onclick="doVoucherSee(this.id)" class="iconmenu icon-previews" title="凭证查看"></a></div>';
					}else{
						obj.element.innerHTML='<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
	        	            + '" onclick="doVoucherSee(this.id)" class="iconmenu icon-previews" title="凭证查看"></a></div>';
					}
				}else{
					obj.element.innerHTML='<div class="fun-operate pay-ope" ><a id="'
						+ obj.rowIndex
        	            + '" onclick="doVoucherSee(this.id)" class="iconmenu icon-previews" title="凭证查看"></a></div>';
				}
			};
			
			

			//配置列表
			viewModel.initData = function() {
				$.ajax({
					url : "/df/init/initMsg.do",
					type : "GET",
					dataType : "json",
					async : true,
					data : mainOptions,
					success : function(datas) {
						viewModel.viewList = datas.viewlist;// 视图信息
						viewModel.resList = datas.reslist;// 资源信息
						viewModel.coaId = datas.coaId;// coaid
						viewModel.coaDetails = datas.coaDetail;// coa明细
						viewModel.relations = datas.relationlist;// 关联关系
						
						var status=$("#pz_status option:selected").val();
						for ( var n = 0; n < viewModel.viewList.length; n++) {
							var view = viewModel.viewList[n];
							if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {//列表视图
								if (view.orders == '1') {
									viewModel.mainViewId=view.viewid;
									mainOptions["tableViewId"] = view.viewid;
									mainOptions["queryViewId"] = viewModel.planQueryViewId;
									mainOptions["isSetValue"] = "false";
									viewModel.mainViewModel = ip.initGrid(view, 'modalMianGridArea', queryURL+"/doFind.do", mainOptions, 0, true);
									mainOptions["isDetailQuery"] = "false";  //是否查询明细
									mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_BILL;
									mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									mainOptions["isWorkFlowRelated"] = "true";
									mainOptions["relationBillId"] = "voucher_bill_id";
									mainOptions["status"] = status;
									mainOptions["set_year"] = mainOptions["svSetYear"];
									mainOptions["finance_code"] = "000000";
									mainOptions["pageInfo"] = "10,0";
									ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
									//viewModel.mainViewModel = ip.initGrid(view, 'modalMianGridArea', queryURL+"/doFind.do", mainOptions, 1, true);
									
								} else if (view.orders == '2') {
									voucherOptions["tableViewId"] = view.viewid;
									voucherOptions["isSetValue"] = "false";
									voucherOptions["isDetailQuery"] = "true";  //是否查询明细
									voucherOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									voucherOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									voucherOptions["isWorkFlowRelated"] = "false";
									voucherOptions["relationBillId"] = "voucher_bill_id";
									voucherOptions["set_year"] = voucherOptions["svSetYear"];
									voucherOptions["pageInfo"] = "10,0";
									viewModel.voucherGridViewModel = ip.initGrid(view, 'modalSubsysGridArea', queryURL+"/doFind.do", voucherOptions, 0, false);
								}

							}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){
								viewModel.planQueryViewId = view.viewid;
								viewModel.planSearchViewModel = ip
										.initArea(view.viewDetail,
												"search", view.viewid
														.substring(1,
																37),
												"planSearchArea");
								viewModel.getFinanceCode();
								viewModel.getYear();
							}
						}
					}
				});
			};
			
			//操作按钮的显示
			fsc_show = function() {
				var status = $("#pz_status option:selected").val();
				var year=document.getElementById("set_year" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
					var d = new Date();
					if(year==d.getFullYear()){
						if (status=="001") {
			        		document.getElementById("dk").style.display = "";
			        		document.getElementById("confirmAdvance").style.display = "";
			        		document.getElementById("cxdk").style.display = "none";
			        		document.getElementById("confirmCancelAdvance").style.display = "none";
			        		document.getElementById("ref").style.display = "";
						} else if(status=="002") {
							document.getElementById("dk").style.display = "none";
							document.getElementById("confirmAdvance").style.display = "none";
			        		document.getElementById("cxdk").style.display = "";
			        		document.getElementById("confirmCancelAdvance").style.display = "";
			        		document.getElementById("ref").style.display = "none";
						} else if(status=="003") {
							document.getElementById("dk").style.display = "none";
			        		document.getElementById("confirmAdvance").style.display = "none";
			        		document.getElementById("cxdk").style.display = "none";
			        		document.getElementById("confirmCancelAdvance").style.display = "none";
			        		document.getElementById("ref").style.display = "none";
						} else if(status=="004") {
							document.getElementById("dk").style.display = "none";
			        		document.getElementById("confirmAdvance").style.display = "none";
			        		document.getElementById("cxdk").style.display = "none";
			        		document.getElementById("confirmCancelAdvance").style.display = "none";
			        		document.getElementById("ref").style.display = "";
						}
					}else{
						document.getElementById("dk").style.display = "none";
		        		document.getElementById("confirmAdvance").style.display = "none";
		        		document.getElementById("cxdk").style.display = "none";
		        		document.getElementById("confirmCancelAdvance").style.display = "none";
		        		document.getElementById("ref").style.display = "none";
					}
		       
			}
			
			//凭证状态改变事件
			fGetGrid = function() {
				fsc_show();
				
				mainOptions["status"] = $("#pz_status option:selected").val();
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
				
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
			}
			
			//查询区的财政机构
			viewModel.getFinanceCode = function() {
				$.ajax({
					url : "/df/f_ebank/config/getFinanceOrgData.do?tokenid="
						+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : mainOptions,
					success : function(datas) {
						if (datas.errorCode == "0") {
							for (var i = 0; i < datas.dataDetail.length; i++) {
								var x = document.getElementById("finance_code"
										+ "-"
										+ viewModel.planQueryViewId.substring(
												1, 37));
								var option = document.createElement("option");
								option.value = datas.dataDetail[i].chr_code;
								option.text = datas.dataDetail[i].chr_name;
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
							}
						} else {
							ip.ipInfoJump("加载财政机构参数失败！原因：" + datas.result, "error");
						}
					}
				})

			};
			
			//查询区的年度
			viewModel.getYear = function() {
				$.ajax({
					url : EBankConstant.CommonUrl.getEnabledYearData+"?tokenid="
						+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : {
						"ajax" : "nocache"
					},
					async : false,
					success : function(datas) {
						if (datas.errorCode == "0") {
							var d = new Date();
							var x = document.getElementById("set_year"
									+ "-"
									+ viewModel.planQueryViewId.substring(
											1, 37));
							x.options[0].disabled="false";
							x.disabled="false";
							for (var i = 0; i < datas.setYear.length; i++) {
								
								var option = document.createElement("option");
								option.value = datas.setYear[i].set_year;
								option.text = datas.setYear[i].year_name;
								if(datas.setYear[i].set_year==d.getFullYear()){
									  option.defaultSelected = true;
								         option.selected = true;
								}
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
							}
						} else {
							ip.ipInfoJump("加载年度参数失败！原因：" + datas.result, "error");
						}
					}
				})

			};
			
			//初始化收款人信息补录界面
			initEditPayeeMessageDailog = function() {
				isEditInitPayeeMessage=1;
				for ( var n = 0; n < viewModel.viewList.length; n++) {
					var view = viewModel.viewList[n];
					 if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_INPUT){
						
						if (view.orders == '3') {
							viewModel.editPayeeMessageViewId = view.viewid;
							viewModel.editPayeeMessageViewModel = ip
									.initArea(view.viewDetail,
											"edit", view.viewid
													.substring(1,
															37),
											"payeeMessageEdit");
						} 
						
					}
				}
		       
			}
			//初始化收款人信息补录界面
			function  initEditPayeeMessageForType(type)  {
				if(type==0){//托收
					$("#" + "payee_account_no" + "-"
							+ viewModel.editPayeeMessageViewId.substring(1, 37)).val(needPaydata[0].payee_account_no);
					
					$("#" + "payee_account_no" + "-"
							+ viewModel.editPayeeMessageViewId.substring(1, 37)).disabled = true;
							
				    $("#" + "payee_account_name" + "-"
							+ viewModel.editPayeeMessageViewId.substring(1, 37)).val(needPaydata[0].payee_account_name);
				    $("#" + "payee_account_name" + "-"
							+ viewModel.editPayeeMessageViewId.substring(1, 37)).disabled = true;
							
				    $("#" + "payee_account_bank" + "-"
							+ viewModel.editPayeeMessageViewId.substring(1, 37)).val(needPaydata[0].payee_account_bank);
				    $("#" + "payee_account_bank" + "-"
							+ viewModel.editPayeeMessageViewId.substring(1, 37)).disabled = true;
				    $("#" + "pay_money" + "-"
							+ viewModel.editPayeeMessageViewId.substring(1, 37)).val(needPaydata[0].pay_money);
				}else{
					$("#" + "payee_account_no" + "-"
							+ viewModel.editPayeeMessageViewId.substring(1, 37)).disabled = false;
							

				    $("#" + "payee_account_name" + "-"
							+ viewModel.editPayeeMessageViewId.substring(1, 37)).disabled = false;

				   $("#" + "payee_account_bank" + "-"
							+ viewModel.editPayeeMessageViewId.substring(1, 37)).disabled = false;
					$("#" + "payee_account_no" + "-"
							+ viewModel.editPayeeMessageViewId.substring(1, 37)).val(needPaydata[0].payee_account_no);
	
				    $("#" + "payee_account_name" + "-"
							+ viewModel.editPayeeMessageViewId.substring(1, 37)).val(needPaydata[0].payee_account_name);
							
				    $("#" + "payee_account_bank" + "-"
							+ viewModel.editPayeeMessageViewId.substring(1, 37)).val(needPaydata[0].payee_account_bank);
				   $("#" + "pay_money" + "-"
							+ viewModel.editPayeeMessageViewId.substring(1, 37)).val(needPaydata[0].pay_money);
				}
		       
			}
			
			
			//保存新增数据
			saveEditPayeeMessage=function(){
				
				
				var payeeAccountNo=document.getElementById("payee_account_no" + "-"
						+ viewModel.editPayeeMessageViewId.substring(1, 37)).value;

						
				var payeeAccountName=document.getElementById("payee_account_name" + "-"
						+ viewModel.editPayeeMessageViewId.substring(1, 37)).value;

						
				var payeeAccountBank=document.getElementById("payee_account_bank" + "-"
						+ viewModel.editPayeeMessageViewId.substring(1, 37)).value;
			    var newPayMoney= document.getElementById("pay_money" + "-"
						+ viewModel.editPayeeMessageViewId.substring(1, 37)).value;
			    var oriPayMoney=needPaydata[0].pay_money;
				
			    if(!moneyFormat.test(newPayMoney)){
			    	ip.warnJumpMsg("输入金额格式不正确！！！",0,0,true);
			    	payeeMessagetemp["next"]="0";
					return payeeMessagetemp;
			    }
               
				if(payeeAccountNo==null||payeeAccountNo==''){
					ip.warnJumpMsg("请输入收款人账号！！！",0,0,true);
					payeeMessagetemp["next"]="0";
					return payeeMessagetemp;
				}
				if(payeeAccountName==null||payeeAccountName==''){
					ip.warnJumpMsg("请输入收款人名称！！！",0,0,true);
					payeeMessagetemp["next"]="0";
					return payeeMessagetemp;
				}
				if(payeeAccountBank==null||payeeAccountBank==''){
					ip.warnJumpMsg("请输入收款行名称！！！",0,0,true);
					payeeMessagetemp["next"]="0";
					return payeeMessagetemp;
				}
				if(newPayMoney==null||newPayMoney==''){
					ip.warnJumpMsg("请输入支付金额！！！",0,0,true);
					payeeMessagetemp["next"]="0";
					return payeeMessagetemp;
				}
				if(pfType=0){//
					
					var newPayMoney1 = parseFloat(newPayMoney);
					var oriPayMoney1 = parseFloat(oriPayMoney);

					if(newPayMoney1>oriPayMoney1){
						ip.warnJumpMsg("托收数据输入金额不得大于原始金额！！！",0,0,true);
						payeeMessagetemp["next"]="0";
						return payeeMessagetemp;
					}
				}
				payeeMessagetemp["next"]="1";
				payeeMessagetemp["payeeAccountNo"]=payeeAccountNo;
				payeeMessagetemp["payeeAccountName"]=payeeAccountName;
				payeeMessagetemp["payeeAccountBank"]=payeeAccountBank;
				payeeMessagetemp["newPayMoney"]=newPayMoney;
				payeeMessagetemp["pfType"]=pfType;
				
				payMoney=payeeMessagetemp.newPayMoney;
				var payMoneyFloat = parseFloat(payMoney);
				mainOptions["payeeMessage"]=JSON.stringify(payeeMessagetemp);
				//if(payMoneyFloat>50000){
					//$("#userCodeInput").modal("show");
				//}else{
						$.ajax({
							url : baseURL+"/doAdvance.do?tokenid="
								+ viewModel.tokenid,
							type : "POST",
							data :mainOptions,
							success : function(data) {
									viewModel.fSelect();
									ip.warnJumpMsg(data.result,0,0,true);
									requesting=false;
							}
						});
				//}
				//return payeeMessagetemp;
				closeEditPayeeMessage();			
			}
			
			
			//关闭
			closeEditPayeeMessage=function(){
				$("#payee_account_no-"
						+ viewModel.editPayeeMessageViewId.substring(1, 37)).val("");
				$("#payee_account_name-"
						+ viewModel.editPayeeMessageViewId.substring(1, 37)).val("");
				$("#pay_money-"
						+ viewModel.editPayeeMessageViewId.substring(1, 37)).val("");
				$("#payee_account_bank-"
						+ viewModel.editPayeeMessageViewId.substring(1, 37)).val("");

				$("#payeeMessageAddDialog").modal("hide");
				payeeMessagetemp["next"]="0";
				return payeeMessagetemp;
			}
			
			
			//--------------------------------------------------------------//
			// 获取指纹特征
			//--------------------------------------------------------------//
			
			
			//保存
			/*viewModel.doSaveuserCodeInput=function(){
				stiff_user_code=document.getElementById("stiff_user_code").value;
				
				if(stiff_user_code==null||stiff_user_code==""){
					ip.warnJumpMsg("柜员号不能为空",0,0,true);
					return;
				}else{
					var figerMessage = GetFeature();
					if(figerMessage==''){
						//ip.warnJumpMsg("指纹控件获取失败！！！",0,0,true);
						$("#stiff_user_code").val("");
						$("#userCodeInput").modal("hide");
						requesting=false;
						return;
					}
					$.ajax({
						url : "/df/f_ebank/pay/payCommon/doFingerPay.do?tokenid="
							+ viewModel.tokenid,
						type : "GET",
						dataType : "json",
						data : {
							"ajax" : "nocache",
							"staff_num":stiff_user_code,
							"psTZ":figerMessage
						},
						async : false,
						success : function(data) {
							if(data.flag=='0'){
								ip.warnJumpMsg("指纹验证失败,"+data.result,0,0,true);
								viewModel.fSelect();
								requesting=false;
								return;
							}else{
								$.ajax({
									url : baseURL+"/doAdvance.do?tokenid="
										+ viewModel.tokenid,
									type : "POST",
									 async: false,
									data :mainOptions,
									success : function(data) {
											viewModel.fSelect();
											ip.warnJumpMsg(data.result,0,0,true);
											requesting=false;
									}
								});
							}					
						}
					});
				}
				$("#stiff_user_code").val("");
				$("#userCodeInput").modal("hide");
			}*/
			
			//关闭
		/*	viewModel.closeuserCodeInput=function(){
				$("#stiff_user_code").val("");
				$("#userCodeInput").modal("hide");
			}*/

			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				})
				viewModel.initData();
			})

		});
