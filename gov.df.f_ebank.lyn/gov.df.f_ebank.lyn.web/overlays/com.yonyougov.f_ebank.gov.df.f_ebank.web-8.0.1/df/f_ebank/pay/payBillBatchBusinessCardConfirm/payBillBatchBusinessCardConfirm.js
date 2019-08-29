require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui','jquery.file.upload', 'director',
				'tree', 'grid', 'ip', 'dateZH' ],
		function($, ko, echarts) {
			
			var requesting=false;			
			var mainOptions = ip.getCommonOptions({});
			var voucherOptions=ip.getCommonOptions({});
			var addPayeeBankNoOptions = ip.getCommonOptions({});
			var queryURL=EBankConstant.CommonUrl.query;
			mainOptions["operate_width"] =80;
			mainOptions["vt_code"]=ip.getUrlParameter("vt_code");
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
					temp["bill_no"] = payData.bill_no;
					billIdsAndFinanceCode.push(temp);
				} else {//id为空
					billIdsAndFinanceCode = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','finance_code','bill_no' ]
					});
				}
				return	billIdsAndFinanceCode;
			};
			
			
			
			//补录交易流水号
			inputNo=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				var billIdsAndFinanceCode=buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length!=1){
					ip.warnJumpMsg("请选择一条数据",0,0,true);
					requesting=false;
					return;
				}
				mainOptions["bill_no"]=billIdsAndFinanceCode[0].bill_no;
				mainOptions["finance_code"]=billIdsAndFinanceCode[0].finance_code;
				mainOptions["ajax"]="nocache";
				$("#agentBusinessNoAddDialog").modal("show");
			}
			//补录交易流水号
			viewModel.saveAgentBusinessNo=function(){
				var patt1=/^[0-9]*$/;
				var agentBusinessNo=$("#agent_business_no").val();
				if(agentBusinessNo==''||agentBusinessNo==null){
					ip.warnJumpMsg("请先填写交易流水号！！！",0,0,true);
					return;
				}else if(!patt1.test(agentBusinessNo)){
					ip.warnJumpMsg("交易流水号必须是数字！！！",0,0,true);
					return;
				}else{
					viewModel.closeAgentBusinessNo();
					mainOptions["agentBusinessNo"]=agentBusinessNo;
					$.ajax({
						url : EBankConstant.CommonUrl.doInputAgentBusinessNoNext,
						type : "POST",
						 async: false,
						data :mainOptions,
						success : function(data) {
							ip.warnJumpMsg(data.result,0,0,true);
								viewModel.fSelect();
								requesting=false;
						}
					});
				}
			}
			
			//关闭
			viewModel.closeAgentBusinessNo=function(){
				$("#agent_business_no").val("");
				$("#agentBusinessNoAddDialog").modal("hide");
				requesting=false;
			}
			  
			exportTxt=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				
				var billIdsAndFinanceCode=buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length!=1){
					ip.warnJumpMsg("请选择一条数据！！！",0,0,true);
					requesting=false;
					return;
				}
				var id = billIdsAndFinanceCode[0].id;


							 var form = $("<form id='downloadForm'>");
					            form.attr('style', 'display:none');
					            form.attr('target', '');
					            form.attr('method', 'post');
					            var url = '/df/f_ebank/pay/payCommon/leadout.do?tokenid=' + ip.getTokenId();
					            form.attr('action', url);
					            var input = $('<input>');
					            input.attr('type', 'hidden');
					            input.attr('name', 'id');
					            input.attr('value', id);
					            var input1 = $('<input>');
					            input1.attr('type', 'hidden');
					            input1.attr('name', 'financeCode');
					            input1.attr('value',  billIdsAndFinanceCode[0].finance_code);
					            var input2 = $('<input>');
					            input2.attr('type', 'hidden');
					            input2.attr('name', 'set_year');
					            input2.attr('value',  mainOptions["set_year"]);
					            $('body').append(form);
					            form.append(input);
					            form.append(input1);
					            form.append(input2);
					            form.submit();
					            form.remove();
					            $('#downloadForm').remove();
						
     //最终txt文件中的内容
			    
			  /*  switch(getExplorer())        //判断浏览器
			    {
			        case "IE":
			            var blobObject = new Blob([finalStr]);

			            window.navigator.msSaveBlob(blobObject, 'PointList.txt');
			            break;
			        case "Firefox":

			            var blob = new Blob([finalStr]);

			            document.getElementById("downloadNode").download = "PointList.txt";
			            document.getElementById("downloadNode").href = URL.createObjectURL(blob);
			            document.getElementById("downloadNode").click();
			            break;
			        case "Chrome":
			            var blob = new Blob([finalStr]);

			            document.getElementById("downloadNode").download = "PointList.txt";
			            document.getElementById("downloadNode").href = URL.createObjectURL(blob);
			            document.getElementById("downloadNode").click();
			            break;
			        	var blobObject = new Blob([finalStr]);

			            window.navigator.msSaveBlob(blobObject, 'PointList.txt');
			            break;
			    }*/
		            requesting=false;
			}

			//撤销
			cancel=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				
				var billIdsAndFinanceCode=buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length!=1){
					ip.warnJumpMsg("请选择一条数据！！！",0,0,true);
					requesting=false;
					return;
				}
				mainOptions["bill_no"]=billIdsAndFinanceCode[0].bill_no;
				mainOptions["finance_code"]=billIdsAndFinanceCode[0].finance_code;
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : EBankConstant.CommonUrl.doAgentBusinessNoRecall,
					type : "POST",
					 async: false,
					data :mainOptions,
					success : function(data) {
						ip.warnJumpMsg(data.result,0,0,true);
							viewModel.fSelect();
							requesting=false;
					}
				});
			}
			
			//查询
			viewModel.fSelect=function(){
				fsc_show();
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
				
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
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
						+ viewModel.QueryViewId.substring(1, 37)).value;
				if(year==null||year==''){
					ip.warnJumpMsg("年度不能为空，请选择！！！",0,0,true);
					return;
				}
				var billNO = document.getElementById("bill_no"
						+ "-" + viewModel.QueryViewId.substring(1, 37)).value;
				var startTime=document.getElementById("create_date"
						+ "-" + (viewModel.QueryViewId.substring(1, 37)+1)).value;
				var endTime=document.getElementById("create_date"
						+ "-" + (viewModel.QueryViewId.substring(1, 37)+2)).value;
				mainOptions["condition"]='1=1 ';
				if(billNO!=null&&billNO!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and bill_no='"+billNO+"'";
				}
				if(startTime!=null&&startTime!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and create_date>='"+startTime+"'";
				}
				if(endTime!=null&&endTime!=''){
					endTime=dateAddOneDay(endTime);
					mainOptions["condition"]=mainOptions["condition"]+"and create_date<'"+endTime+"'";
				}
				mainOptions["finance_code"] =document.getElementById("finance_code" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				mainOptions["set_year"] =year;
			}
			
			
			//主单上的操作
			modalMianGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				var status = $("#pz_status option:selected").val();
		        	if(status=='001'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
						+ '" onclick="inputNo(this.id)" class="iconmenu icon-input" title="补录流水号"></a></div>';
						/*<a id="'
						+ obj.rowIndex
						+ '" onclick="Input(this.id)" class="iconmenu icon-input" title="收款行号补录"></a></div>';*/
					}else if(status=='002'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
		        	        + '" onclick="cancel(this.id)" class="iconmenu icon-back-prev" title="撤销交易流水号"></a></div>';
					}else{
						obj.element.innerHTML='<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
	        	            + '" onclick="getDetail(this.id)" class="iconmenu icon-previews" title="凭证查看"></a></div>';
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
									mainOptions["queryViewId"] = viewModel.QueryViewId;
									mainOptions["isSetValue"] = "false";
									mainOptions["isDetailQuery"] = "false";  //是否查询明细
									mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_BILL;
									mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									mainOptions["isWorkFlowRelated"] = "true";
									mainOptions["relationBillId"] = "voucher_bill_id";
									mainOptions["status"] = status;
									//viewModel.getQueryView();
									mainOptions["pageInfo"] = "10,0";
									mainOptions["finance_code"] ="000000";
									mainOptions["set_year"] =mainOptions["svSetYear"];
									viewModel.mainViewModel = ip.initGrid(view, 'modalMianGridArea', queryURL+"/doFind.do", mainOptions, 1, true);
									
									//viewModel.mainViewModel = ip.initGrid(view, 'modalMianGridArea', queryURL+"/doFind.do", mainOptions, 1, true);
									
								} else if (view.orders == '2') {
									voucherOptions["tableViewId"] = view.viewid;
									voucherOptions["isSetValue"] = "false";
									voucherOptions["isDetailQuery"] = "true";  //是否查询明细
									voucherOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									voucherOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									voucherOptions["isWorkFlowRelated"] = "false";
									voucherOptions["relationBillId"] = "voucher_bill_id";
									voucherOptions["pageInfo"] = "10,0";
									voucherOptions["set_year"] =voucherOptions["svSetYear"];
									viewModel.voucherGridViewModel = ip.initGrid(view, 'modalSubsysGridArea', queryURL+"/doFind.do", voucherOptions, 0, false);
								}

							}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){
								if (view.orders == '1'){
									viewModel.QueryViewId = view.viewid;
									viewModel.paySearchViewModel = ip
											.initArea(view.viewDetail,
													"search", view.viewid
															.substring(1,
																	37),
													"paySearchArea");
									viewModel.getFinanceCode();
									viewModel.getYear();
								}
								
							}
						}
					}
				});
			};
			
			//操作按钮的显示
			fsc_show = function() {
				var status = $("#pz_status option:selected").val();
				var year=document.getElementById("set_year" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
					var d = new Date();
					if(year==d.getFullYear()){
						if (status==EBankConstant.WfStatus.TODO_001) {
			        		document.getElementById("inputNo").style.display = "";
			        		document.getElementById("export").style.display = "";
			        		document.getElementById("view").style.display = "";
			        		document.getElementById("cancel").style.display = "none";
						} else if(status==EBankConstant.WfStatus.AUDITED_002) {
							document.getElementById("inputNo").style.display = "none";
			        		document.getElementById("export").style.display = "none";
			        		document.getElementById("view").style.display = "";
			        		document.getElementById("cancel").style.display = ""
						} else if(status==EBankConstant.WfStatus.RETURNED_003) {
							document.getElementById("inputNo").style.display = "none";
			        		document.getElementById("export").style.display = "none";
			        		document.getElementById("view").style.display = "";
			        		document.getElementById("cancel").style.display = "none"
						} 
					}else{
						document.getElementById("inputNo").style.display = "none";
		        		document.getElementById("export").style.display = "none";
		        		document.getElementById("view").style.display = "";
		        		document.getElementById("cancel").style.display = "none"
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
					url : EBankConstant.CommonUrl.getFinanceData+"?tokenid="
						+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : mainOptions,
					success : function(datas) {
						if (datas.errorCode == "0") {
							for (var i = 0; i < datas.dataDetail.length; i++) {
								var x = document.getElementById("finance_code"
										+ "-"
										+ viewModel.QueryViewId.substring(
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

			}
			
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
									+ viewModel.QueryViewId.substring(
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
								        // mainOptions["year"] =datas.setYear[i].set_year;
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

			getExplorer=function () {
			    /// <summary>
			    /// 判断浏览器类型
			    /// </summary>
			    /// <returns type="string">获取浏览器类型</returns>
			    var explorer = window.navigator.userAgent;
			    //ie
			    if (explorer.indexOf("MSIE") >= 0) {
			        return "IE";
			    }
			    if (!!window.ActiveXObject || "ActiveXObject" in window)
			    {
			        return "IE";
			    }
			    //firefox
			    else if (explorer.indexOf("Firefox") >= 0) {
			        return "Firefox";
			    }
			    //Chrome
			    else if(explorer.indexOf("Chrome") >= 0){
			        return "Chrome";
			    }
			    //Opera
			    else if(explorer.indexOf("Opera") >= 0){
			        return "Opera";
			    }
			    //Safari
			    else if(explorer.indexOf("Safari") >= 0){
			        return "Safari";
			    }
			}
			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				})
				viewModel.initData();
			})

		});
