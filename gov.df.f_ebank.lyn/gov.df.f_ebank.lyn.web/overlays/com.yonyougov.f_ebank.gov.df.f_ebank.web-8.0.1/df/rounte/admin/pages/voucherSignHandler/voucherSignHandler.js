define(['text!pages/voucherSignHandler/voucherSignHandler.html','commonUtil',
	'jquery','bootstrap','ip','calendar','dateZH',
	'datatables.net-bs','datatables.net-autofill-bs', 
    'datatables.net-buttons-bs', 'datatables.net-colreorder',
    'datatables.net-rowreorder', 'datatables.net-select',
    'datatables.net-scroller','datatables.net-keyTable', 
    'datatables.net-responsive','initDataTableUtil' ],function(html,commonUtil){
	var init =function(element,param){ 
		document.title=ip.getUrlParameter("menuname"); 
		var options = ip.getCommonOptions({});
		options.gridParam = ip.getTableSetting();
		var subsysUrl = "/df/f_ebank/voucherSignHandler/getSubsysData.do";
		var viewModel = {
			tokenid : ip.getTokenId()
		};
		//初始化页面
		viewModel.initData = function() {
			$.ajax({
				url : "/df/init/initMsg.do",
				type : "GET",
				dataType : "json",
				async : true,
				data : options,
				success : function(datas) {
					viewModel.viewList = datas.viewlist;// 视图信息
					for (var n = 0; n < viewModel.viewList.length; n++) {
						var view = viewModel.viewList[n];
						if (view.viewtype == '002') {// 列表视图
							if (view.orders == "2") {
								viewModel.subsysViewId = view.viewid;
								options["scrollY"] = $("#content").innerHeight()*0.28 + "px";
								options["finance_code"] = "";
								options["loadDataFlag"] = true;
								options["sumFlag"] = false;
								options["isDataTables"] = true;
								options["voucher_status"] = document.getElementById("voucher_status" + "-"+ viewModel.planQueryViewId.substring(1, 37)).value;
								viewModel.subsysGridViewModel = initDataTables("modalSubsysGridArea",subsysUrl,options,view.viewDetail);
							}
						} else if (view.viewtype == '003') {// 查询视图
							viewModel.planQueryViewId = view.viewid;
							viewModel.planSearchViewModel = ip
									.initArea(view.viewDetail,
											"search", view.viewid
													.substring(1,
															37),
											"planSearchArea");
							viewModel.getVt_code();
							viewModel.getRgCode();
							viewModel.getYear();
						}
					}
				}
			});
		};
		
		$("body").on('click', '#modalSubsysGridArea tr', function () {
		       var dataSrc = $('#modalSubsysGridArea').DataTable().row($(this)).data();
			   var id = dataSrc.id;
				if (id != null) {
					$("#imessage").val(commonUtil.htmlDecodeByRegExp(commonUtil.htmlEncodeByRegExp(dataSrc.message)));
				}
		})
		//签收方法
		fBuild = function() {
			var voucher_id = "";
			var selectRows = $('#modalSubsysGridArea').DataTable().rows('.selected');
		    if (selectRows.indexes().length ==0){
		    	ip.warnJumpMsg("请选择需要签收的数据！",0,0,true);
		        return;
		    };
			for (var i = 0; i < selectRows.indexes().length; i++) {
				voucher_id = voucher_id + selectRows.data()[i].id + ','
			}
				
			voucher_id = voucher_id.replace(/\,\s*$/ig, "");
			var svUserCode = options.svUserCode;
			$.ajax({
				url : "/df/f_ebank/voucherSignHandler/reSignVoucher.do?tokenid="
						+ viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "nocache",
					"voucher_id" : voucher_id,
					"status":options["voucher_status"],
					"svUserCode" : svUserCode
				},
				success : function(datas) {
					if (datas.errorCode == "0") {
						fSelect();
						ip.warnJumpMsg(datas.result,0,0,true);
					} else {
						ip.warnJumpMsg("签收失败！原因：" + datas.result,0,0,true);
						fSelect();
					}
				}
			})
		}
		//签收失败方法
		fBuildFail = function() {
			var voucher_id = "";
			var selectRows = $('#modalSubsysGridArea').DataTable().rows('.selected');
		    if (selectRows.indexes().length ==0){
		    	ip.warnJumpMsg("请选择需要操作的数据！",0,0,true);
		        return;
		    };
			for (var i = 0; i < selectRows.indexes().length; i++) { 
				if(selectRows.data()[i].fail_reason==""||selectRows.data()[i].fail_reason==undefined){
					ip.warnJumpMsg("请补录签收失败原因！！！",0,0,true);
					return;
				}
				voucher_id = voucher_id + selectRows.data()[i].id + ',';
			}
			voucher_id = voucher_id.replace(/\,\s*$/ig, "");
			var svUserCode = options.svUserCode;
			$.ajax({
				url : "/df/f_ebank/voucherSignHandler/updateVoucherStatus.do?tokenid="
						+ viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "nocache",
					"voucher_id" : voucher_id,
					"status":"2",
					"year":options["year"],
					"svUserCode" : svUserCode
				},
				success : function(datas) {
					if (datas.errorCode == "0") {
						fSelect();
						ip.ipInfoJump("执行成功！", "success");
					} else {
						fSelect();
						ip.warnJumpMsg("执行失败！原因：" + datas.result,0,0,true);
					}
				}
			})
		};
		//补录签收信息	
		openUpdateErrorMsgDlg = function(){
			var selectRows = $('#modalSubsysGridArea').DataTable().rows('.selected');
		    if (selectRows.indexes().length !=1){
		    	ip.warnJumpMsg("请选择一条需要操作的数据！",0,0,true);
		        return;
		    };
			$("#titleText").text("错误原因补录");
			$("#errorMsgModel").modal("show");
		};
		//查询
		fSelect = function() {
			viewModel.showButton();
			viewModel.getSubsysData();
		};
		//错误原因补录	
		updateErrorMsg = function(){
			var selectRows = $('#modalSubsysGridArea').DataTable().rows('.selected');
			var errMsg = $("#errorMsg").val();
			errMsg=errMsg.trim();
			if(errMsg==""){
				ip.warnJumpMsg("错误原因不能为空！！！",0,0,true);
				return;
			}
			var voucher_id = selectRows.data()[0].id;
			voucher_id = voucher_id.replace(/\,\s*$/ig, "");
			$.ajax({
				url : "/df/f_ebank/voucherSignHandler/updateErrorMsg.do?tokenid="
						+ viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "nocache",
					"voucher_id" : voucher_id,
					"errorMsg":errMsg,
					"year":options["year"],
				},
				success : function(datas) {
					if (datas.errorCode == "0") {
						fSelect();
						ip.ipInfoJump("执行成功！", "success");
						$("#errorMsgModel").modal("hide");
					} else {
						ip.warnJumpMsg("执行失败！原因：" + datas.result,0,0,true);
					}
				}
			})
		};
		//按钮显隐
		viewModel.showButton = function() {
			var ele = document.getElementById("voucher_status" + "-"
					+ viewModel.planQueryViewId.substring(1, 37));
			for (var i = 0; i < ele.length; i++) {
				if (ele[i].selected == true) {
					if (ele[i].value == "0") {
						$("#qianshou").html("签收");
						document.getElementById("qianshou").disabled = false;
						document.getElementById("qssb").disabled = false;
						document.getElementById("updateErrMsg").disabled = false;

					} else if (ele[i].value == "2") {
						$("#qianshou").html("重新签收");
						document.getElementById("qianshou").disabled = false;
						document.getElementById("qssb").disabled = false;
						document.getElementById("updateErrMsg").disabled = false;

					} else {
						document.getElementById("qianshou").disabled = true;
						document.getElementById("qssb").disabled = true;
						document.getElementById("updateErrMsg").disabled = true;
					}
				}
			}
		};

		viewModel.getSelect = function() {
			var voucher_no= document.getElementById("voucher_no"
					+ "-" + viewModel.planQueryViewId.substring(1, 37)).value;
			options["voucher_no"] = voucher_no.trim();
			options["vt_code"] = document.getElementById("vt_code" + "-"
					+ viewModel.planQueryViewId.substring(1, 37)).value;
			options["voucher_status"] = document
					.getElementById("voucher_status" + "-"
							+ viewModel.planQueryViewId.substring(1, 37)).value;

			options["b_date"] = document.getElementById("b_date"
					+ "-" + (viewModel.planQueryViewId.substring(1, 37)+1)).value;

			options["e_date"] = document.getElementById("b_date" + "-"
					+ viewModel.planQueryViewId.substring(1, 37)+2).value;
			options["finance_code"] =document.getElementById("rg_code" + "-"
					+ viewModel.planQueryViewId.substring(1, 37)).value;
			options["year"] =document.getElementById("year" + "-"
					+ viewModel.planQueryViewId.substring(1, 37)).value;
		};

		viewModel.getSubsysData = function() {
			viewModel.getSelect();
			if(options["year"]==''||options["year"]=='null'){
				ip.warnJumpMsg("请选择年度！",0,0,true);
				return;
			}
			viewModel.subsysGridViewModel.ajax.reload(null, true);
			document.getElementById("imessage").value = "";
		};

		viewModel.getVt_code = function() {
			$("#voucher_status" + "-"
					+ viewModel.planQueryViewId.substring(1, 37)).on(
					"change", function() {
						viewModel.showButton();
						viewModel.getSubsysData();
					})
			viewModel.showButton();
			$.ajax({
				url : "/df/f_ebank/voucherSignHandler/getVt_code.do?tokenid="
						+ viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "nocache"
				},
				success : function(datas) {
					if (datas.errorCode == "0") {
						var html = document.getElementById("vt_code-"+viewModel.planQueryViewId.substring(
								1, 37)).innerHTML;
						
						for ( var i = 0; i < datas.dataDetail.length; i++) {
							html+="<option value="+datas.dataDetail[i].chr_code+">"+datas.dataDetail[i].chr_name1+"</option>";
						}
						$("#vt_code-"+viewModel.planQueryViewId.substring(
								1, 37)).html(html);
					} else {
						ip.warnJumpMsg("加载参数失败！原因：" + datas.result,0,0,true);
					}
				}
			})
		}
			
		viewModel.getRgCode = function() {
			$.ajax({
				url : "/df/f_ebank/config/getFinanceOrgData.do?tokenid="
					+ viewModel.tokenid,
				type : "GET",
				dataType : "json",
				data : {
					"ajax" : "nocache"
				},
				success : function(datas) {
					if (datas.errorCode == "0") {
						var html = document.getElementById("rg_code-"+viewModel.planQueryViewId.substring(
								1, 37)).innerHTML;
						
						for ( var i = 0; i < datas.dataDetail.length; i++) {
							html+="<option value="+datas.dataDetail[i].chr_code+">"+datas.dataDetail[i].chr_name+"</option>";
						}
						$("#rg_code-"+viewModel.planQueryViewId.substring(
								1, 37)).html(html);
					} else {
						ip.warnJumpMsg("加载财政机构参数失败！原因：" + datas.result,0,0,true);
					}
				}
			})
		};
		
		viewModel.getYear = function() {
			$.ajax({
				url : "/df/f_ebank/config/getYearData.do?tokenid="
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
						var html = "";
						for ( var i = 0; i < datas.setYear.length; i++) {
							if(datas.setYear[i].set_year==d.getFullYear()){
								 options["year"] =datas.setYear[i].set_year;
							     html+="<option selected='selected' value="+datas.setYear[i].set_year+">"+datas.setYear[i].year_name+"</option>";
							}else{
								html+="<option value="+datas.setYear[i].set_year+">"+datas.setYear[i].year_name+"</option>";
							}
						}
						$("#year-"+viewModel.planQueryViewId.substring(
								1, 37)).html(html);
					} else {
						ip.warnJumpMsg("加载年度参数失败！原因："+ datas.result,0,0,true);
					}
				}
			})

		}

		pageInit =function(){
			viewModel.initData();	
		}

		$(element).html(html);	
		pageInit();
	}
	return {
		init:init
	}
});
