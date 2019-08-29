require([ 'jquery', 'knockout', 'bootstrap', 'uui', 'tree', 'grid', 'director','ip' ],
		function($, ko) {
			window.ko = ko;
			var tokenid = ip.getTokenId();
			var viewModel={
					dataArr: ko.observableArray(),
					chosenCountries : ko.observableArray()
			};
			
			//初始化界面信息- 开始
			viewModel.initPageInfo=function(){
				
				
				$.ajax({
							url : "/df/globalConfig/initBasePageInfo.do?tokenid="+ tokenid,
							type : 'GET',
							dataType : "json",
							data: {
								"ajax":1,
								"belong_page" : "govProcurementInterface"
								},
							success : function(data) {
								if(data.flag=="1"){
									//请求成功 界面赋值 
									for(var i=0;i<data.rows.length;i++){
										var plt_key = data.rows[i].plt_key;
										
										//初始化默认选中的下拉列表选项 
										if(plt_key == "intfzczcBatchCode" || plt_key == "intfzczcNoBudgetBatchCode" )
										{
											$("#"+plt_key+" option[value='"+data.rows[i].value+"']").prop("selected", true);
										}
										else
										{
											$("#"+plt_key+"").val(data.rows[i].value);
										}
										
									}
								}
								else if(data.flag=="0"){
									ip.ipInfoJump("初始化失败");
								}
						}
				});
			};
			//初始化界面信息 - 结束
			
			
			viewModel.initDropDownList = function(){
			 	
			 	
			 	$.ajax({
	 				url : "/df/globalConfig/initDropDownList.do?tokenid="+ tokenid,
	 				type : 'GET',
	 				dataType : "json",
	 				data: {
	 					"ajax":1,
	 					},
	 				success : function(data) {
	 					if(data.flag=="1"){
	 						 viewModel.dataArr(data.rows);
	 					}
	 					else if(data.flag=="0"){
	 						ip.ipInfoJump("初始化下拉列表失败");
	 					}
			 		}
			 	});
			};
			
			
			viewModel.saveGovProcurementInterfaceData = function(){
				var commonSetting={};
				var aloneSetting={};

				//工作流节点支付申请虚拟功能
				var intfzcvoucherVirtualNode = $("#intfzcvoucherVirtualNode").val();
				commonSetting['intfzcvoucherVirtualNode']=intfzcvoucherVirtualNode;
				
				//工作流节点支付凭证虚拟功能
				var intfzcbillVirtualNode = $("#intfzcbillVirtualNode").val();
				commonSetting['intfzcbillVirtualNode']=intfzcbillVirtualNode;
				
				
				//有指标生成支付批量录入规则
				var intfzczcBatchCode=$('#intfzczcBatchCode option:selected').text();
				aloneSetting['intfzczcBatchCode']=intfzczcBatchCode;
				
				//无指标生成支付批量录入规则
				var intfzczcBatchCode=$('#intfzczcNoBudgetBatchCode option:selected').text();
				aloneSetting['intfzczcNoBudgetBatchCode']=intfzczcBatchCode;
				
				
				
				$.ajax({
							url : "/df/globalConfig/saveGovProcurementInterfaceData.do?tokenid="+ tokenid,
							type : 'POST',
							dataType : "json",
							data: {
								"ajax":1,
								"commonSetting" :JSON.stringify(commonSetting),
								"aloneSetting" :JSON.stringify(aloneSetting)
								},
							success : function(data) {
								if(data.flag=="1"){
									ip.ipInfoJump("保存成功！");
								}
								else if(data.flag=="0"){
									ip.ipInfoJump("保存失败！");
								}
							}
				});
			};
			
			$(function(){
				ko.applyBindings(viewModel);
				viewModel.initDropDownList();
				viewModel.initPageInfo();
			});
			
		
			
});

// intfzczcBatchCode
// intfzczcNoBudgetBatchCode
// intfzcvoucherVirtualNode
// intfzcbillVirtualNode

 
 



