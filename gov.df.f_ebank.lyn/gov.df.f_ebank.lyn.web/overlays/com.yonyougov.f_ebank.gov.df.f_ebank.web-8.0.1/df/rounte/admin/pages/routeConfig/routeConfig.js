define(['text!pages/routeConfig/routeConfig.html','commonUtil',
        'jquery','bootstrap','ip','datatables.net-bs', 
        'datatables.net-autofill-bs', 'datatables.net-buttons-bs',
        'datatables.net-colreorder','datatables.net-rowreorder',
        'datatables.net-select','datatables.net-scroller',
        'datatables.net-keyTable','datatables.net-responsive'],function(html,commonUtil){
		var init =function(element,param){ 
			document.title=ip.getUrlParameter("menuname");
			  //新增或者修改 类型
	 		var editType;
			var viewModel = {
				tokenid : ip.getTokenId(),
			};
			viewModel.initData = function(){
				var param = ip.getCommonOptions({});
				commonUtil.initFinanceCode("",param);
				$.ajax({url : "/df/f_ebank/routeConfig/getAllRouteInfo.do?tokenid="+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data :{
						"ajax" : "nocache",
					},
					success : function(datas) {
						 $('#routeInfoGrid').DataTable( {
								destroy: true,
				 			    searching: true,
				 		        paging: false,
				 		        bSort: false,
				 		        bInfo: false,
						        language: {
						            'zeroRecords': '没有检索到数据',
									'search': '搜索:',
						            },
					            select : {
									style : 'single',
								},
						        data:datas,
						        columns: [
						        	{ data: 'action_name' },
						            { data: 'ori_url' },
						            { data: 'tar_url' },
						            { data: 'finance_code' },
						            { data: 'remark' }
						            
						        ]
						    } );
					}
				});
			};
			// 刷新
			refresh = function() {
				viewModel.initData();
				ip.ipInfoJump("刷新成功！","success");
			};

			// 新增路由信息
			addRouteInfo = function() {
				editType = "add";
				$("#routeInfoSetModel input").val("");
				$("#titleText").text("新增路由分发信息");
				$("#oriUrl").attr("disabled",false);
				$("#routeInfoSetModel").modal("show");
			};

			// 修改机构
			modifyRouteInfo = function() {
				editType = "modify";
				var rows = $('#routeInfoGrid').DataTable().rows('.selected');
				if(rows == undefined||rows.indexes().length != 1){
					ip.warnJumpMsg("请选择一条数据！",0,0,true);
					return;
				}
				$("#routeInfoSetModel input").val("");
				$("#titleText").text("修改路由分发信息");
				$("#oriUrl").attr("disabled",true);
				$("#actionName").val(rows.data()[0].action_name);
				$("#oriUrl").val(rows.data()[0].ori_url);
				$("#tarUrl").val(rows.data()[0].tar_url);
				$("#finance_code").val(rows.data()[0].finance_code);
				$("#remark").val(rows.data()[0].remark);
				$("#routeInfoSetModel").modal("show");

			};

			
			// 删除财政机构
			delRouteInfo = function() {
				var rows = $('#routeInfoGrid').DataTable().rows('.selected');
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
	 				$.ajax({url : "/df/f_ebank/routeConfig/deleteRouteInfo.do?tokenid="+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
						data : {
							"ajax" : "nocache",
							actionName: rows.data()[0].action_name,
							oriUrl: rows.data()[0].ori_url,
							financeCode: rows.data()[0].finance_code
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
				var actionName= $("#actionName").val();
				var oriUrl = $("#oriUrl").val();
				var tarUrl = $("#tarUrl").val();
				var financeCode = $("#finance_code").val();
				var remark = $("#remark").val();
				//输入校验
				if(actionName == ""){
	 				ip.warnJumpMsg("操作名称不能为空！",0,0,true);
	 				return false; 
	 			}
	 			if(oriUrl == ""){
	 				ip.warnJumpMsg("原始URL不能为空！",0,0,true);
	 				return false; 
	 			}
	 			if(tarUrl == ""){
	 				ip.warnJumpMsg("目标URL不能为空！",0,0,true);
	 				return false; 
	 			}
	 			if(financeCode == ""){
	 				ip.warnJumpMsg("财政机构不能为空！",0,0,true);
	 				return false; 
	 			}
	 			var saveUrl ="";
				if(editType == "add"){
					saveUrl = "/df/f_ebank/routeConfig/saveRouteInfo.do?tokenid="
				}
				else{
					saveUrl = "/df/f_ebank/routeConfig/modifyRouteInfo.do?tokenid="	
				}
				$.ajax({url : saveUrl + viewModel.tokenid,
						type : "POST",
						dataType : "json",
						data : {
							"ajax" : "nocache",
							actionName: actionName,
							oriUrl: oriUrl,
							tarUrl: tarUrl,
							financeCode: financeCode,
							remark: remark
						},
						success : function(data) {
							if(data.result=="success"){
		        				ip.ipInfoJump("保存成功！","success");
		        				viewModel.initData();
		        				$("#routeInfoSetModel").modal("hide");
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
			
	 		$(element).html(html);	
	 		viewModel.initData();
	 	};		
 		return {
 			init:init
 		};
	});