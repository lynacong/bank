require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH' ],
		function($, ko, echarts) {
			
			var requesting=false;			
			var mainOptions = ip.getCommonOptions({});
            var baseURL = EBankConstant.Ctx + "billStampSend";
            var queryURL=EBankConstant.CommonUrl.query;
            mainOptions["vtCode"]=ip.getUrlParameter("vt_code");
			var viewModel = {
				tokenid : ip.getTokenId(),
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
					temp["set_year"]= payData.set_year;
					billIdsAndFinanceCode.push(temp);
				} else {//id为空
					billIdsAndFinanceCode = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','bill_no','finance_code','set_year']
					});
				}
				return	billIdsAndFinanceCode;
			};
			
			//录入
			input=function(id){
				$("#payCollectionBillInput").modal("show");
			}
			//删除
			deleteBill=function(id){
				if(requesting){
					return;
				}
				requesting=true;  
				var billNosAndFinanceCode=buildBillIdsAndFinanceCode(id);
				if(billNosAndFinanceCode.length!=1){
					ip.warnJumpMsg("请选择一条数据数据！！！",0,0,true);
					requesting=false;  
					return false;
				}
				mainOptions["billnosAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : "/df/f_ebank/pay/collection/doCollectionBillDelete.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					data : mainOptions,
					success : function(data) {
						requesting=false;
						if(data.is_success=="0"){
							ip.warnJumpMsg("删除失败,"+data.error,0,0,true);
						}else{
							ip.warnJumpMsg("删除成功",0,0,true);
							ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
						}
					}
				});
			}
			//查询
			viewModel.fSelect=function(){
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
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
				var pay_money = document.getElementById("pay_money"
						+ "-" + viewModel.QueryViewId.substring(1, 37)).value;
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
				if(pay_money!=null&&pay_money!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and pay_money='"+pay_money+"' ";
				}
				mainOptions["finance_code"] =document.getElementById("finance_code" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				mainOptions["set_year"] =year;
			}
			
			
			//签章发送
			signSend = function(id) {
				if(requesting){
					return;
				}
				requesting=true; 
				var billNosAndFinanceCode =  buildBillIdsAndFinanceCode(id);
				if(billNosAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false;  
					return false;
				}
				mainOptions["setYear"] = mainOptions["set_year"]
				mainOptions["billnosAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : baseURL+"/doSignSend.do?tokenid="
					+ viewModel.tokenid,
					type : "POST",
					data : mainOptions,
					success : function(data){
						requesting=false; 
						if(data.is_success=="0"){
							ip.warnJumpMsg(data.error_msg, 0, 0, true);
						}else{
							ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
							ip.warnJumpMsg("签章发送成功", 0, 0, true);
						}
					}
				});
			};
			
			//重新发送
			reSend = function(id){
				if(requesting){
					return;
				}
				requesting=true;  
				var billNosAndFinanceCode=buildBillIdsAndFinanceCode(id);
				if(billNosAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false;  
					return false;
				}
				mainOptions["setYear"] = mainOptions["set_year"]
				mainOptions["billnosAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : baseURL+"/doAgainSend.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					data : mainOptions,
					success : function(data) {
						requesting=false;
						if(data.is_success=="0"){
							ip.warnJumpMsg(data.error_msg,0,0,true);
						}else{
							ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
							ip.warnJumpMsg("重新发送成功",0,0,true);
						}
					}
				});
			};
			
			
			// 凭证查看
			doVoucherSee = function(id, evt) {
				var e = evt || window.event;
				//$('#planCheckModalDetail').modal('show');
				var billIds = buildBillIdsAndFinanceCode(id);
				if(billIds.length<1){
					ip.warnJumpMsg("请选择数据进行凭证查看",0,0,true);
					return;
				}
				doAsspVoucherSee(billIds,evt,mainOptions["vtCode"]);
				window.event ? e.cancelBubble = true : e.stopPropagation();
			};
			
			//主单上的操作
			modalMainGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				var status = $("#pz_status option:selected").val();
		        	if(status==EBankConstant.WfStatus.TODO_001){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
						+ obj.rowIndex
						+ '" onclick="deleteBill(this.id)" class="iconmenu icon-to-void" title="删除"></a><a id="'
						+  obj.rowIndex
						+ '" onclick="signSend(this.id)" class="iconmenu icon-sign-send" title="签章发送"></a></div>';
					}else if(status==EBankConstant.WfStatus.AUDITED_002){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
		        	        + '" onclick="reSend(this.id)" class="iconmenu icon-send-again" title="重新发送"></a></div>';
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
						viewModel.relations = datas.relationlist;// 关联关系
						for ( var n = 0; n < viewModel.viewList.length; n++) {
							var view = viewModel.viewList[n];
							if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {//列表视图
								if (view.orders == '1') {
									viewModel.mainViewId=view.viewid;
									mainOptions["tableViewId"] = view.viewid;
									mainOptions["queryViewId"] = viewModel.QueryViewId;
									mainOptions["isSetValue"] = "false";
									mainOptions["isDetailQuery"] = "false";  //是否查询明细
									mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_COLL_BILL;
									mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_COLL_BILL;
									mainOptions["isWorkFlowRelated"] = "true";
									mainOptions["relationBillId"] = "id";
									mainOptions["status"] = $("#pz_status option:selected").val();
									//viewModel.getQueryView();
									mainOptions["pageInfo"] = "10,0";
									mainOptions["finance_code"] ="000000";
									mainOptions["set_year"] =mainOptions["svSetYear"];
									viewModel.mainViewModel = ip.initGrid(view, 'modalMainGridArea', queryURL+"/doFind.do", mainOptions, 1, true);
									
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
									/*viewModel.getFinanceCode();
									viewModel.getYear();*/
								}
								
							}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_INPUT){
								viewModel.collInputViewId = view.viewid;
								viewModel.collInputViewModel = ip.initArea(view.viewDetail,"edit", view.viewid.substring(1,37),"modalCollInputArea");
							}
						}
						viewModel.getFinanceCode();
						viewModel.getYear();
					}
				});
			};
			
			//操作按钮的显示
			fsc_show = function() {
				var status = $("#pz_status option:selected").val();
				if (status==EBankConstant.WfStatus.TODO_001) {
	        		document.getElementById("input").style.display = "";
	        		document.getElementById("delete").style.display = "";
	        		document.getElementById("qzfs").style.display = "";
	        		document.getElementById("cxfs").style.display = "none";
	        		document.getElementById("asspview").style.display = "none";
				} else if(status==EBankConstant.WfStatus.AUDITED_002) {
					document.getElementById("input").style.display = "none";
					document.getElementById("delete").style.display = "none";
	        		document.getElementById("qzfs").style.display = "none";
	        		document.getElementById("cxfs").style.display = "";
	        		document.getElementById("asspview").style.display = "";
				} 		        			       
			}
			
			//凭证状态改变事件
			fGetGrid = function() {
				fsc_show();				
				mainOptions["status"] = $("#pz_status option:selected").val();
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
			}
			
			//查询区的财政机构
			viewModel.getFinanceCode = function() {
				$.ajax({
					url : EBankConstant.CommonUrl.getFinanceData+"?tokenid="
						+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : {
						"ajax" : "nocache"
					},
					success : function(datas) {
						if (datas.errorCode == "0") {
							var x = document.getElementById("finance_code"+ "-"+ viewModel.QueryViewId.substring(1, 37));
							var y = document.getElementById("finance_code"+ "-"+ viewModel.collInputViewId.substring(1, 37));
							for (var i = 0; i < datas.dataDetail.length; i++) {
								var optionx = document.createElement("option");
								optionx.value = datas.dataDetail[i].chr_code;
								optionx.text = datas.dataDetail[i].chr_name;
								var optiony = document.createElement("option");
								optiony.value = datas.dataDetail[i].chr_code;
								optiony.text = datas.dataDetail[i].chr_name;
								try {
									// 对于更早的版本IE8
									x.add(optionx, x.options[null]);
									y.add(optiony, y.options[null]);
								} catch (e) {
									x.add(option, null);
									y.add(option, null);
								}
							}
							y.addEventListener("change", getPayAccount, false);
						} else {
							ip.ipInfoJump("加载财政机构参数失败！原因：" + datas.result, "error");
						}
					}
				})

			}
			
			
			//付款人信息
			function  getPayAccount() {
				var payAccount=document.getElementById("pay_account" + "-"
						+ viewModel.collInputViewId.substring(1, 37));
				payAccount.options.length = 0;
				var financeCode=document.getElementById("finance_code" + "-"
						+ viewModel.collInputViewId.substring(1, 37)).value;
				$.ajax({
					url : "/df/f_ebank/financeAcctManage/getAccount.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"accountType" : "002",
						"finance_code":financeCode
					},
					async : false,
					success : function(datas) {
							for (var i = 0; i < datas.result.length; i++) {
								var option = document.createElement("option");
								option.value = datas.result[i].account_no+" "+datas.result[i].account_name+" "+datas.result[i].bank_name;
								option.text = datas.result[i].account_name;
								try {
									// 对于更早的版本IE8
									payAccount.add(option, payAccount.options[null]);
								} catch (e) {
									payAccount.add(option, null);
								}
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
							var x = document.getElementById("set_year"+ "-"+ viewModel.QueryViewId.substring(1, 37));
							x.options[0].disabled="false";
							x.disabled="false";
							var d = new Date();
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
			
			
			//保存
			viewModel.doSaveCollInput=function(){
				var pay_account_no="";
				var pay_account_name="";
				var pay_account_bank="";
				var finance_code = $('#'+viewModel.collInputViewModel[0].id).val();
				var payAccount = $('#'+viewModel.collInputViewModel[1].id).val();
				if(payAccount == null || payAccount.trim() == ""){
					ip.warnJumpMsg("付款人信息不能为空不能为空！",0,0,true);
					return false;
				}else{
					pay_account_no=payAccount.split(" ")[0];
					pay_account_name=payAccount.split(" ")[1];
					pay_account_bank=payAccount.split(" ")[2];
				}
				var payee_account_no = $('#'+viewModel.collInputViewModel[2].id).val();
				if(payee_account_no == null || payee_account_no.trim() == ""){
					ip.warnJumpMsg("收款人账号不能为空！",0,0,true);
					return false;
				}
				var patt1=/^[0-9]*$/;
				if(!patt1.test(payee_account_no)){
					ip.warnJumpMsg("收款人账号必须是数字！！！",0,0,true);
					return;
				}
				var payee_account_name = $('#'+viewModel.collInputViewModel[3].id).val();
				if(payee_account_name == null || payee_account_name.trim() == ""){
					ip.warnJumpMsg("收款人名称不能为空！",0,0,true);
					return false;
				}
				var payee_account_bank = $('#'+viewModel.collInputViewModel[4].id).val();
				if(payee_account_name == null || payee_account_name.trim() == ""){
					ip.warnJumpMsg("收款人银行不能为空！",0,0,true);
					return false;
				}
				var pay_money = $('#'+viewModel.collInputViewModel[5].id).val();
				if(pay_money == null || pay_money.trim() == ""){
					ip.warnJumpMsg("金额不能为空！",0,0,true);
					return false;
				}
				var colltype_code = $('#'+viewModel.collInputViewModel[6].id).val();
				var colltype_name = $('#'+viewModel.collInputViewModel[6].id).text();
				var agency = $('#'+viewModel.collInputViewModel[7].id).val();
				var en_code=agency.split(" ")[0];
				var en_name=agency.split(" ")[1];
				if(en_name == null || en_name.trim() == ""){
					ip.warnJumpMsg("请选择已有的预算单位,不能手工输入！",0,0,true);
					return false;
				}
				var bs = $('#'+viewModel.collInputViewModel[8].id).val();
				var bs_code=bs.split(" ")[0];
				var bs_name=bs.split(" ")[1];
				if(bs_name == null || bs_name.trim() == ""){
					ip.warnJumpMsg("请选择已有的功能分类,不能手工输入！",0,0,true);
					return false;
				}
				var sm = $('#'+viewModel.collInputViewModel[9].id).val();
				var sm_code=sm.split(" ")[0];
				var sm_name=sm.split(" ")[1];
				if(sm_name == null || sm_name.trim() == ""){
					ip.warnJumpMsg("请选择已有的用途,不能手工输入！",0,0,true);
					return false;
				}
				//对信息进行保存
				var info = [];
				var infos = {};
				infos.finance_code = finance_code;
				infos.pay_account_no = pay_account_no;
				infos.pay_account_name = pay_account_name;
				infos.pay_account_bank = pay_account_bank;
				infos.payee_account_no = payee_account_no;
				infos.payee_account_name = payee_account_name;
				infos.payee_account_bank = payee_account_bank;
				infos.pay_money = pay_money;
				infos.colltype_code = colltype_code;
				infos.colltype_name = colltype_name;
				infos.en_code = en_code;
				infos.en_name = en_name;
				infos.bs_code = bs_code;
				infos.bs_name = bs_name;
				infos.pay_summary_code = sm_code;
				infos.pay_summary_name = sm_name;
				infos.vt_code = mainOptions["vtCode"];
				info.push(infos);
				mainOptions["info"]=JSON.stringify(info);
				$.ajax({
					url :"/df/f_ebank/pay/collection/doCollectionBillInput.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data :mainOptions,
					success : function(data) {
						if(data.success=='1'){
							ip.warnJumpMsg("录入成功",0,0,true);
							viewModel.closeCollBillInput();	
						}else{
							ip.warnJumpMsg("录入失败"+data.error,0,0,true);
						}
					}
				});		
			}
			
			//关闭
			viewModel.closeCollBillInput=function(){
				$("#payCollectionBillInput").modal("hide");	
				$('#'+viewModel.collInputViewModel[2].id).val("");
				$('#'+viewModel.collInputViewModel[3].id).val("");
				$('#'+viewModel.collInputViewModel[4].id).val("");
				$('#'+viewModel.collInputViewModel[5].id).val("");
				$('#'+viewModel.collInputViewModel[7].id).val("");
				$('#'+viewModel.collInputViewModel[8].id).val("");
				$('#'+viewModel.collInputViewModel[9].id).val("");
                ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);		
			}		
			
			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				})
				viewModel.initData();
			})

		});
