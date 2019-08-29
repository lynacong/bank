require(
		[ 'jquery','knockout', 'bootstrap', 'uui', 'director', 'grid', 'ip' ],
		function($,ko) {
			window.ko = ko;
			  //新增或者修改 类型
	 		var editType;
			var viewModel = {
				tokenid : ip.getTokenId(),
				gridDataTable : new u.DataTable({
					meta : {
						'chr_code' : {},
						'chr_name' : {},
						'finance_org' : {},
						'tre_no' : {},
						'tre_org_no' : {},
						'is_clear' : {},
						'is_dxp' : {},
						'enabled' : {}
					}
				}),
			};

			// 刷新
			viewModel.refresh = function() {
				viewModel.init();
				ip.ipInfoJump("刷新成功！","success");
			};
			
			viewModel.init = function(){
				$.ajax({url : "/df/f_ebank/financeOrgManage/getAllFinanceOrgs.do?tokenid="+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data :{
						"ajax" : "nocache",
					},
					success : function(datas) {
						for(var i=0;i<datas.length;i++){
							if(datas[i].enabled=="0"){
								datas[i].enabled="停用";
							}else{
								datas[i].enabled="启用";
							}
							if(datas[i].is_clear=="0"){
								datas[i].is_clear="不清算";
							}else{
								datas[i].is_clear="清算";
							}
							/*if(datas[i].is_dxp=="0"){
								datas[i].is_dxp="无";
							}else if(datas[i].is_dxp=="1"){
								datas[i].is_dxp="用友";
							}else{
								datas[i].is_dxp="龙图";
							}*/
						}
						viewModel.gridDataTable.setSimpleData(datas,{"unSelect": true});
					}
				});
			};

			// 新增机构
			viewModel.addOrg = function() {
				editType = "add";
				$("#orgCode").removeAttr("readonly");
				$("#orgSetModel input").val("");
				$("#titleText").text("新增财政机构信息");
				document.getElementById("finance_code").style.display = "";
				$("#financeCode").val("");
				//viewModel.initAllFinances();
				$("#orgSetModel").modal("show");
			};

			// 修改机构
			viewModel.modifyOrg = function() {
				editType = "modify";
				$("#orgSetModel input").val("");
				$("#titleText").text("修改财政机构信息");
				var rows = viewModel.gridDataTable.getSelectedRows();
				if(rows==undefined||rows.length!=1){
					ip.ipInfoJump("请选择一条数据！","error");
					return;
				}
				$("#orgCode").attr("readonly","readonly");
				$("#orgCode").val(rows[0].data.chr_code.value);
				$("#orgName").val(rows[0].data.chr_name.value);
				$("#financeOrg").val(rows[0].data.finance_org.value);
				document.getElementById("finance_code").style.display = "none";
				$("#treNo").val(rows[0].data.tre_no.value);
				$("#treOrgNo").val(rows[0].data.tre_org_no.value);orgEnabled;
				if(rows[0].data.enabled.value=="启用"){
					$("#orgEnabled").val("1");
				}else{
					$("#orgEnabled").val("0");
				}
				if(rows[0].data.is_clear.value=="清算"){
					$("#isClear").val("1");
				}else{
					$("#isClear").val("0");
				}
				/*if(rows[0].data.is_dxp.value=="用友"){
					$("#isDxp").val("1");
				}else if(rows[0].data.is_dxp.value=="龙图"){
					$("#isDxp").val("2");
				}else{
					$("#isDxp").val("0");
				}*/
				$("#orgSetModel").modal("show");
			};

			// 启用机构
			viewModel.enable = function() {
				var rows = viewModel.gridDataTable.getSelectedRows();
				if(rows==undefined||rows.length!=1){
					ip.ipInfoJump("请选择一条数据！","error");
					return;
				}
				$.ajax({url : "/df/f_ebank/financeOrgManage/modifyFinanceOrgStatus.do?tokenid="+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						orgCode: rows[0].data.chr_code.value,
						enabled: "1",
							
					},
					success : function(data) {
						if(data.result=="success"){
	        				if(data.num == 11){
								ip.ipInfoJump("当前已处于启用状态！", "info");
							}else{
								ip.ipInfoJump("启用成功！","success");
							}
	        				viewModel.init();
	        			}
	        			else if(data.result=="fail"){
	        				ip.warnJumpMsg(data.reason,"sad1","cacel",true);
	        				$("#sad1").click(function(){
	        					$("#config-modal").remove();
	        				});
	        			}
					}
				});
			};
			
			// 停用机构
			viewModel.disable = function() {
				var rows = viewModel.gridDataTable.getSelectedRows();
				if(rows==undefined||rows.length!=1){
					ip.ipInfoJump("请选择一条数据！","error");
					return;
				}
				$.ajax({url : "/df/f_ebank/financeOrgManage/modifyFinanceOrgStatus.do?tokenid="+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						orgCode: rows[0].data.chr_code.value,
						enabled: "0",
							
					},
					success : function(data) {
						if(data.result=="success"){
	        				if(data.num== 0){
								ip.ipInfoJump("当前已处于停用状态！", "info");
							}else{
								ip.ipInfoJump("停用成功！","success");
							}
	        				viewModel.init();
	        			}
	        			else if(data.result=="fail"){
	        				ip.warnJumpMsg(data.reason,"sad1","cacel",true);
	        				$("#sad1").click(function(){
	        					$("#config-modal").remove();
	        				});
	        			}
					}
				});
			};

			// 删除财政机构
			viewModel.delOrg = function() {
				var rows = viewModel.gridDataTable.getSelectedRows();
				if(rows==undefined||rows.length!=1){
					ip.ipInfoJump("请选择一条数据！","error");
					return;
				}
				if(rows[0].data.enabled.value=="启用"){
					ip.ipInfoJump("请勿删除已启用的数据！","error");
					return;
				}
	 			ip.warnJumpMsg("确定要删除吗？","sad","cacel",false);
	 			$("#sad").click(function(){
	 				$("#config-modal").remove();
	 				$.ajax({url : "/df/f_ebank/financeOrgManage/deleteFinanceOrg.do?tokenid="+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
						data : {
							"ajax" : "nocache",
							orgCode: rows[0].data.chr_code.value
						},
						success : function(data) {
							if(data.result=="success"){
	        					ip.ipInfoJump("删除成功！","success");
	        					viewModel.init();
	        				}
	        				else if(data.result=="fail"){
	        					ip.warnJumpMsg(data.reason,"sad1","cacel",true);
	        					$("#sad1").click(function(){
	        						$("#config-modal").remove();
	        					});
	        				}
						}
					});
	 			});
	 			$(".cacel").click(function(){
					$("#config-modal").remove();
				});

			};

			// 弹出框上的确定-(新增或者修改保存)
			viewModel.save = function() {
				var orgName = $("#orgName").val();
				var orgCode = $("#orgCode").val();
				var enabled = $("#orgEnabled").val();
				var financeOrg = $("#financeOrg").val();
				var financeCode = $("#financeCode").val();
				var isClear = $("#isClear").val();
				//var isDxp = $("#isDxp").val();
				var treOrgNo = $("#treOrgNo").val();
				var treNo = $("#treNo").val();
				//输入校验
				var patt1=/^[0-9]*$/;
	 			if(orgName ==""){
	 				ip.ipInfoJump("财政机构名称不能为空！","error");
	 				return false; 
	 			}
	 			if(orgName.length>50){
	 				ip.ipInfoJump("财政机构名称长度过长！","error")
	 				return false;
	 			}
	 			if(orgCode ==""){
	 				ip.ipInfoJump("财政机构编码不能为空！","error");
	 				return false; 
	 			}
	  			if(!patt1.test(orgCode)){
	  				ip.ipInfoJump("财政机构编码必须是数字！","error");
	  				return false;
	  			}
	 			if(orgCode.length>6){
	 				ip.ipInfoJump("财政机构编码不能超过6位！","error");
	 				return false;
	 			}
	 			if(financeOrg ==""){
	 				ip.ipInfoJump("机构码不能为空！","error");
	 				return false; 
	 			}
	 			if(financeOrg.length>6){
	 				ip.ipInfoJump("机构码长度不能超过6位！","error");
	 				return false;
	 			}
	 			if(treNo ==""){
	 				ip.ipInfoJump("国库主体代码不能为空！","error");
	 				return false; 
	 			}
	 			if(treNo.length>50){
	 				ip.ipInfoJump("国库主体代码长度过长！","error");
	 				return false;
	 			}
	 			if(treOrgNo ==""){
	 				ip.ipInfoJump("国库机构代码不能为空！","error");
	 				return false; 
	 			}
	 			if(treOrgNo.length>50){
	 				ip.ipInfoJump("国库机构代码长度过长！","error");
	 				return false;
	 			}
				if(editType == "add"){
					if(financeCode.length==""){
		 				ip.ipInfoJump("配置模板不能为空！","error");
		 				return false;
		 			}
					$.ajax({url : "/df/f_ebank/financeOrgManage/saveFinanceOrg.do?tokenid="+ viewModel.tokenid,
						type : "POST",
						dataType : "json",
						data : {
							"ajax" : "nocache",
							orgCode: orgCode,
							orgName: orgName,
							enabled: enabled,
							financeOrg: financeOrg,
							treNo:treNo,
							treOrgNo:treOrgNo,
							isClear:isClear,
							//isDxp:isDxp,
							financeCode: financeCode
								
						},
						success : function(data) {
							if(data.result=="success"){
		        				ip.ipInfoJump("保存成功！","success");
		        				viewModel.init();
		        				$("#orgSetModel").modal("hide");
		        				
		        				var x = document.getElementById("financeCode");
								var option = document.createElement("option");
								option.text = orgName;
								option.value = orgCode;
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
		        			}
		        			else if(data.result=="fail"){
		        				ip.warnJumpMsg(data.reason,"sad1","cacel",true);
		        				$("#sad1").click(function(){
		        					$("#config-modal").remove();
		        				});
		        			}
						}
					});
				}else if(editType == "modify"){
					$.ajax({url : "/df/f_ebank/financeOrgManage/modifyFinanceOrg.do?tokenid="+ viewModel.tokenid,
						type : "POST",
						dataType : "json",
						data : {
							"ajax" : "nocache",
							orgCode: orgCode,
							orgName: orgName,
							enabled: enabled,
							financeOrg: financeOrg,
							treNo:treNo,
							isClear:isClear,
							//isDxp:isDxp,
							treOrgNo:treOrgNo
								
						},
						success : function(data) {
							if(data.result=="success"){
		        				ip.ipInfoJump("修改成功！","success");
		        				$("#orgCode").removeAttr("readonly");
		        				viewModel.init();
		        				$("#orgSetModel").modal("hide");
		        			}
		        			else if(data.result=="fail"){
		        				ip.warnJumpMsg(data.reason,"sad1","cacel",true);
		        				$("#sad1").click(function(){
		        					$("#config-modal").remove();
		        				});
		        			}
						}
					});
				}
			};
			
			//初始化财政机构
			viewModel.initAllFinances = function() {
				$.ajax({
					url : EBankConstant.CommonUrl.getAllFinanceData+"?tokenid=" + viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : {
						"ajax" : "nocache"
					},
					async : false,
					success : function(data) {
						if (data.result == "成功！") {
							var x = document.getElementById("financeCode");
							var option = document.createElement("option");
							option.text = "";
							option.value = "";
							try {
								// 对于更早的版本IE8
								x.add(option, x.options[null]);
							} catch (e) {
								x.add(option, null);
							}
							for ( var i = 0; i < data.dataDetail.length; i++) {
								var x = document.getElementById("financeCode");
								var option = document.createElement("option");
								if(data.dataDetail[i].chr_code=='000000'){
									option.text = "通用模板";
								}else{
									option.text = data.dataDetail[i].chr_name;
								}
								option.value = data.dataDetail[i].chr_code;
		
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
								//var rg_code = document.getElementById("finance_code").value;
							}
						} else {
							ip.ipInfoJump("获取财政信息失败！原因：" + data.reason, "error");
						}
					}
				});
			};

			$(function() {
				app = u.createApp({
					el : 'body',
					model : viewModel
				});	
				viewModel.init();
				viewModel.initAllFinances();
			});
		});
