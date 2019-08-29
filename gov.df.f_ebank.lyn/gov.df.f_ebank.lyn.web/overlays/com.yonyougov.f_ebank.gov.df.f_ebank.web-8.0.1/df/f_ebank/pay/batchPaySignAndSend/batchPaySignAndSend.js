require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH' ],
		function($, ko, echarts) {
			
			var requesting=false;
			
			var mainOptions = ip.getCommonOptions({});
			var voucherOptions=ip.getCommonOptions({});
			var baseURL=EBankConstant.Ctx + "pay/batchPay";
			mainOptions["operate_width"] =80;

			var viewModel = {
				tokenid : ip.getTokenId(),
			};
			
			var vtCode=ip.getUrlParameter("vt_code");
			
			//构建传到后台的billNos
			buildBillNosAndFinanceCode = function(id){
				var billnosAndFinanceCode =new Array();
				if (id != null && id != undefined && (id + " ").trim().length > 0) {//id不为空
					billnosAndafinanceCode = [];
					var planData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var temp = {};
					temp["bill_no"] = planData.bill_no;
					temp["finance_code"] = planData.finance_code;
					billnosAndFinanceCode.push(temp);
				} else {//id为空
					billnosAndFinanceCode = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'bill_no','finance_code' ]
					});
				}
				return	billnosAndFinanceCode;
			};
			
			//签章发送
			signSend = function(id) {
				if(requesting){
					return;
				}
				requesting=true;
				var billnosAndFinanceCode=buildBillNosAndFinanceCode(id);
				if(billnosAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false;
					return;
				}
				mainOptions["setYear"] = mainOptions["set_year"];
				mainOptions["vtCode"]=vtCode;
				mainOptions["billnosAndFinanceCode"]=JSON.stringify(billnosAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : EBankConstant.Ctx+"billStampSend/doSignSend.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					data :mainOptions,
					success : function(data) {
						if(data.is_success=="0"){
							viewModel.fSelect();
							ip.warnJumpMsg(data.error_msg,0,0,true);
						}else{
							viewModel.fSelect();
							ip.warnJumpMsg("签章发送成功",0,0,true); 
						}
						requesting=false;
					}
				});
			}
			//重新发送
			againSend = function(id) {
				if(requesting){
					return;
				}
				requesting=true;
				var billnosAndFinanceCode=buildBillNosAndFinanceCode(id);
				if(billnosAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false;
					return;
				}
				mainOptions["setYear"] = mainOptions["set_year"];
				mainOptions["vtCode"]=vtCode;
				mainOptions["billnosAndFinanceCode"]=JSON.stringify(billnosAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : EBankConstant.Ctx+"billStampSend/doAgainSend.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					data : mainOptions,
					success : function(data) {
						if(data.is_success=="0"){
							viewModel.fSelect();
							ip.warnJumpMsg(data.error_msg,0,0,true);
						}else{
							viewModel.fSelect();
							ip.warnJumpMsg("重新发送成功",0,0,true);
						}
						requesting=false;
					}
				});
			}
			
			//查询
			viewModel.fSelect=function(){
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainViewModel, baseURL+"/loadPayCardBillData.do", mainOptions);
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
				var billIds =buildBillIds(id);
				if(billIds.length<1){
					ip.warnJumpMsg("请选择数据进行凭证查看",0,0,true);
					requesting=false;
					return;
				}
				doAsspVoucherSee(billIds,evt,vtCode);
				window.event ? e.cancelBubble = true : e.stopPropagation();
				requesting=false;
			}
			
			//预览
			doVoucherPreview = function(id, evt) {
				if(requesting){
					return;
				}
				requesting=true;
				var e = evt || window.event;
				var billIds = buildBillIds(id);
				if(billIds.length<1){
					ip.warnJumpMsg("请选择数据进行凭证预览",0,0,true);
					requesting=false;
					return;
				}
				
				doAsspVoucherPreview(billIds,evt,vtCode);
				$("#asspview").attr("disabled", false); 
				window.event ? e.cancelBubble = true : e.stopPropagation();
				requesting=false;
			};
			
			//构建凭证查看的参数
			buildBillIds = function(id){
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
				return	billIds;
			};
			
			//点击主单查询明细
			getDetail=function(){
				var id=viewModel.mainViewModel.gridData.getFocusIndex();
				var rowData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
				voucherOptions["bill_no"] =rowData.bill_no;
				voucherOptions["finance_code"] =rowData.finance_code;
				voucherOptions["set_year"] =mainOptions["set_year"];
				ip.setGrid(viewModel.voucherGridViewModel, baseURL+"/loadPayCardDetailData.do", voucherOptions);
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
				var oriBillNO = document.getElementById("ori_bill_no"
						+ "-" + viewModel.planQueryViewId.substring(1, 37)).value;
				var startTime=document.getElementById("create_date"
						+ "-" + (viewModel.planQueryViewId.substring(1, 37)+1)).value;
				var endTime=document.getElementById("create_date"
						+ "-" + (viewModel.planQueryViewId.substring(1, 37)+2)).value;
				mainOptions["condition"]="";
				if(billNO!=null&&billNO!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and bill_no='"+billNO+"'";
				}
				if(oriBillNO!=null&&oriBillNO!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and ori_bill_no='"+oriBillNO+"'";
				}
				if(startTime!=null&&startTime!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and create_date>='"+startTime+"'";
				}
				if(endTime!=null&&endTime!=''){
					endTime=dateAddOneDay(endTime);
					mainOptions["condition"]=mainOptions["condition"]+"and create_date<'"+endTime+"'";
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
					if(status==EBankConstant.WfStatus.TODO_001){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
						+ '" onclick="signSend(this.id)" class="iconmenu icon-sign-send" title="签章发送"></a></div>';
					}else if(status==EBankConstant.WfStatus.AUDITED_002){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
							+ '" onclick="againSend(this.id)" class="iconmenu icon-send-again" title="重新发送"></a><a id="'
							+ obj.rowIndex
		        	        + '" onclick="doVoucherSee(this.id)" class="iconmenu icon-previews" title="凭证查看"></a></div>';
					}
				}else{/*
					if(status==EBankConstant.WfStatus.TODO_001){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
						+ obj.rowIndex
	        	        + '" onclick="doVoucherPreview(this.id)" class="iconmenu icon-previews" title="凭证预览"></a></div>';
					}else*/ if(status==EBankConstant.WfStatus.AUDITED_002){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
		        	        + '" onclick="doVoucherSee(this.id)" class="iconmenu icon-previews" title="凭证查看"></a></div>';
					}
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
									viewModel.mainViewModel = ip.initGrid(view, 'modalMianGridArea', baseURL+"/loadPayCardBillData.do", mainOptions, 0, true);
									mainOptions["status"] = status;
									mainOptions["set_year"] = mainOptions["svSetYear"];
									mainOptions["finance_code"] = "000000";
									mainOptions["pageInfo"] = "10,0";
									ip.setGrid(viewModel.mainViewModel, baseURL+"/loadPayCardBillData.do", mainOptions);
									
								} else if (view.orders == '2') {
									viewModel.voucherViewId=view.viewid;
									voucherOptions["pageInfo"] = "10,0";
									voucherOptions["set_year"] = voucherOptions["svSetYear"];
									viewModel.voucherGridViewModel = ip.initGrid(view, 'modalSubsysGridArea', baseURL+"/loadPayCardDetailData.do", voucherOptions, 0, false);
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
						if (status==EBankConstant.WfStatus.TODO_001) {
			        		document.getElementById("qzfs").style.display = "";
			        		document.getElementById("cfs").style.display = "none";
			        		//document.getElementById("asspview").style.display = "";
			        		document.getElementById("asspsee").style.display = "none";
						} else if(status==EBankConstant.WfStatus.AUDITED_002) {
							document.getElementById("qzfs").style.display = "none";
			        		document.getElementById("cfs").style.display = "";
			        		//document.getElementById("asspview").style.display = "none";
			        		document.getElementById("asspsee").style.display = "";
						}
					}else{
						document.getElementById("qzfs").style.display = "none";
		        		document.getElementById("cfs").style.display = "none";
		        		if (status==EBankConstant.WfStatus.TODO_001) {
			        		//document.getElementById("asspview").style.display = "";
			        		document.getElementById("asspsee").style.display = "none";
						} else if(status==EBankConstant.WfStatus.AUDITED_002) {
			        		//document.getElementById("asspview").style.display = "none";
			        		document.getElementById("asspsee").style.display = "";
						}
					}
			}
			
			//凭证状态改变事件
			fGetGrid = function() {
				fsc_show();
				
				mainOptions["status"] = $("#pz_status option:selected").val();
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainViewModel, baseURL+"/loadPayCardBillData.do", mainOptions);
				
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

			}


			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				})
				viewModel.initData();
			})

		});
