define(['text!pages/financeOrgManage/financeOrgManage.html',
        'jquery','bootstrap','ip','datatables.net-bs', 
        'datatables.net-autofill-bs', 'datatables.net-buttons-bs',
        'datatables.net-colreorder','datatables.net-rowreorder',
        'datatables.net-select','datatables.net-scroller',
        'datatables.net-keyTable','datatables.net-responsive'],function(html){
		var init =function(element,param){ 
			document.title=ip.getUrlParameter("menuname");
			  //新增或者修改 类型
	 		var editType;
	 		var requesting = false;
			var viewModel = {
				tokenid : ip.getTokenId(),
			};
			viewModel.initData = function(){
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
						}
						 $('#orgGrid').DataTable( {
								destroy: true,
				 			    searching: false,
				 		        paging: false,
				 		        bSort: false,
				 		        bInfo: false,
						        language: {
						            'zeroRecords': '没有检索到数据'
						            },
					            select : {
									style : 'single',
								},
						        data:datas,
						        columns: [
						            { data: 'chr_name' },
						            { data: 'chr_code' },
						            { data: 'finance_org' },
						            { data: 'tre_no' },
						            { data: 'tre_org_no' },
						            { data: 'is_clear' },
						            { data: 'enabled' }
						        ]
						    } );
						 $("#orgGrid_wrapper").css("marginTop","-12px");
					}
				});
			};
			// 刷新
			refresh = function() {
				viewModel.initData();
				ip.ipInfoJump("刷新成功！","success");
			};

			// 新增机构
			addOrg = function() {
				editType = "add";
				$("#orgCode").removeAttr("readonly");
				$("#orgSetModel input").val("");
				$("#titleText").text("新增财政机构信息");
				$("#finance_code").css("display","block");
				$("#financeCode").val("");
				viewModel.initAllFinances();
				$("#orgSetModel").modal("show");
			};

			// 修改机构
			modifyOrg = function() {
				editType = "modify";
				viewModel.initAllFinances();
				$("#orgSetModel input").val("");
				$("#titleText").text("修改财政机构信息");
				var rows = $('#orgGrid').DataTable().rows('.selected');
				if(rows == undefined||rows.indexes().length != 1){
					ip.warnJumpMsg("请选择一条数据！",0,0,true);
					return;
				}
				$("#orgCode").attr("readonly","readonly");
				$("#orgCode").val(rows.data()[0].chr_code);
				$("#orgName").val(rows.data()[0].chr_name);
				$("#financeOrg").val(rows.data()[0].finance_org);
				$("#finance_code").css("display","block");
				$("#treNo").val(rows.data()[0].tre_no);
				$("#treOrgNo").val(rows.data()[0].tre_org_no);
				if(rows.data()[0].enabled=="启用"){
					$("#orgEnabled").val("1");
				}else{
					$("#orgEnabled").val("0");
				}
				if(rows.data()[0].is_clear=="清算"){
					$("#isClear").val("1");
				}else{
					$("#isClear").val("0");
				}
				$("#orgSetModel").modal("show");
			};

			// 启用机构
			enable = function() {
				var rows = $('#orgGrid').DataTable().rows('.selected');
				if(rows == undefined||rows.indexes().length != 1){
					ip.warnJumpMsg("请选择一条数据！",0,0,true);
					return;
				}
				ip.warnJumpMsg("确定要启用"+rows.data()[0].chr_name+"吗？","sad","cacel",false);
	 			$("#sad").click(function(){
	 				$("#config-modal").remove();
	 				$.ajax({url : "/df/f_ebank/financeOrgManage/modifyFinanceOrgStatus.do?tokenid="+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						orgCode: rows.data()[0].chr_code,
						enabled: "1",
					},
					success : function(data) {
						if(data.result == "success"){
	        				if(data.num == 11){
	        					ip.warnJumpMsg("当前已处于启用状态！",0,0,true);
							}else{
								ip.ipInfoJump("启用成功！","success");
							}
	        				viewModel.initData();
	        			}
	        			else if(data.result == "fail"){
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
			
			// 停用机构
			disable = function() {
				var rows = $('#orgGrid').DataTable().rows('.selected');
				if(rows == undefined || rows.indexes().length != 1){
					ip.warnJumpMsg("请选择一条数据！",0,0,true);
					return;
				}
				ip.warnJumpMsg("确定要停用"+rows.data()[0].chr_name+"吗？","sad","cacel",false);
	 			$("#sad").click(function(){
	 				$("#config-modal").remove();
	 				$.ajax({url : "/df/f_ebank/financeOrgManage/modifyFinanceOrgStatus.do?tokenid="+ viewModel.tokenid,
						type : "POST",
						dataType : "json",
						data : {
							"ajax" : "nocache",
							orgCode: rows.data()[0].chr_code,
							enabled: "0",
								
						},
						success : function(data) {
							if(data.result=="success"){
		        				if(data.num== 0){
		        					ip.warnJumpMsg("当前已处于停用状态！",0,0,true);
								}else{
									ip.ipInfoJump("停用成功！","success");
								}
		        				viewModel.initData();
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

			// 删除财政机构
			delOrg = function() {
				var rows = $('#orgGrid').DataTable().rows('.selected');
				if(rows==undefined||rows.indexes().length!=1){
					ip.warnJumpMsg("请选择一条数据！",0,0,true);
					return;
				}
				if(rows.data()[0].enabled=="启用"){
					ip.warnJumpMsg("请勿删除已启用的数据！",0,0,true);
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
							orgCode: rows.data()[0].chr_code
						},
						success : function(data) {
							if(data.result=="success"){
	        					ip.ipInfoJump("删除成功！","success");
	        					viewModel.initData();
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
			save = function() {
				if(requesting){
					return;
				}
				requesting = true;
				var orgName = $("#orgName").val();
				var orgCode = $("#orgCode").val();
				var enabled = $("#orgEnabled").val();
				var financeOrg = $("#financeOrg").val();
				var financeCode = $("#financeCode").val();
				var isClear = $("#isClear").val();
				var treOrgNo = $("#treOrgNo").val();
				var treNo = $("#treNo").val();
				//输入校验
				var patt1=/^[0-9]*$/;
	 			if(orgName == ""){
	 				ip.warnJumpMsg("财政机构名称不能为空！",0,0,true);
	 				return false; 
	 			}
	 			if(orgName.length > 50){
	 				ip.warnJumpMsg("财政机构名称长度过长！",0,0,true);
	 				return false;
	 			}
	 			if(orgCode == ""){
	 				ip.warnJumpMsg("财政机构编码不能为空！",0,0,true);
	 				return false; 
	 			}
	  			if(!patt1.test(orgCode)){
	  				ip.warnJumpMsg("财政机构编码必须是数字！",0,0,true);
	  				return false;
	  			}
	 			if(orgCode.length > 6){
	 				ip.warnJumpMsg("财政机构编码不能超过6位！",0,0,true);
	 				return false;
	 			}
	 			if(financeOrg == ""){
	 				ip.warnJumpMsg("机构码不能为空！",0,0,true);
	 				return false; 
	 			}
	 			if(financeOrg.length > 6){
	 				ip.warnJumpMsg("机构码长度不能超过6位！",0,0,true);
	 				return false;
	 			}
	 			if(treNo == ""){
	 				ip.warnJumpMsg("国库主体代码不能为空！",0,0,true);
	 				return false; 
	 			}
	 			if(treNo.length > 50){
	 				ip.warnJumpMsg("国库主体代码长度过长！",0,0,true);
	 				return false;
	 			}
	 			if(treOrgNo == ""){
	 				ip.warnJumpMsg("国库机构代码不能为空！",0,0,true);
	 				return false; 
	 			}
	 			if(treOrgNo.length > 50){
	 				ip.warnJumpMsg("国库机构代码长度过长！",0,0,true);
	 				return false;
	 			}
				ip.processInfo("正在处理中，请稍候......", true);
				if(editType == "add"){
					if(financeCode.length == ""){
						ip.warnJumpMsg("配置模板不能为空！",0,0,true);
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
							/*isDxp:isDxp,*/
							financeCode: financeCode
								
						},
						success : function(data) {
							ip.processInfo("正在处理中，请稍候......", false);
							if(data.result=="success"){
		        				ip.ipInfoJump("保存成功！","success");
								requesting = false;
		        				viewModel.initData();
		        				$("#orgSetModel").modal("hide");
		        				var html = document.getElementById("financeCode").innerHTML;
								html+="<option value="+orgCode+">"+orgName+"</option>";
								$("#financeCode").html(html);
		        			}else if(data.result=="fail"){
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
							treOrgNo:treOrgNo
						},
						success : function(data) {
							ip.processInfo("正在处理中，请稍候......", false);
							if(data.result=="success"){
		        				ip.ipInfoJump("修改成功！","success");
								requesting = false;
		        				$("#orgCode").removeAttr("readonly");
		        				viewModel.initData();
		        				$("#orgSetModel").modal("hide");
		        			}else if(data.result=="fail"){
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
							var html = "";
							for ( var i = 0; i < data.dataDetail.length; i++) {
								if(data.dataDetail[i].chr_code=='000000'){
									html+="<option value="+data.dataDetail[i].chr_code+">"+"通用模板"+"</option>";
								}else{
									html+="<option value="+data.dataDetail[i].chr_code+">"+data.dataDetail[i].chr_name+"</option>";
								}

							}
							$("#financeCode").html(html);
						} else {
							ip.warnJumpMsg("获取财政信息失败！原因："+ data.reason,0,0,true);
						}
					}
				});
			};

	 		$(element).html(html);	
	 		viewModel.initData();
	 	};		
 		return {
 			init:init
 		};
	});