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
								"belong_page" : "bankSetting"
								},
							success : function(data) {
								if(data.flag=="1"){
									//请求成功 界面赋值 
									for(var i=0;i<data.rows.length;i++){
										var plt_key = data.rows[i].plt_key;
										
										//radio 框选择的值
										if(plt_key == "agentbankcanPayTime")
										{
											$("input[name="+plt_key+"][value='"+data.rows[i].value+"']").attr('checked','true');
										} 
										//支持单号修改的人行编码
										else if(plt_key == "clearbankbillNoModifyBankCode" ){
											$("#"+plt_key+"").val(data.rows[i].show_value);
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
			
			//初始化界面信息- 开始
			viewModel.initBankPageInfo=function(){
				
				
				$.ajax({
							url : "/df/globalConfig/initBasePageInfo.do?tokenid="+ tokenid,
							type : 'GET',
							dataType : "json",
							data: {
								"ajax":1,
								"belong_page" : "payManagement"
								},
							success : function(data) {
								if(data.flag=="1"){
									//请求成功 界面赋值 
									for(var i=0;i<data.rows.length;i++){
										var plt_key = data.rows[i].plt_key;
										
											if(plt_key == "clearbankbillNoModifyBankCode")
											{
												$("#"+plt_key+"").val(data.rows[i].show_value);
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
			
			
			viewModel.saveBankSettingData = function(){
				var commonSetting={};
				var aloneSetting={};
				//工资是否定值
				var agentbankcanPayTime = $("input[name='agentbankcanPayTime']:checked").val();
				commonSetting['agentbankcanPayTime']=agentbankcanPayTime;
				
				
				//支持单号修改的人行编码
				var clearbankbillNoModifyBankCode=$('#clearbankbillNoModifyBankCode').val();
				aloneSetting['clearbankbillNoModifyBankCode']=clearbankbillNoModifyBankCode;
			
				
				
				
				$.ajax({
							url : "/df/globalConfig/saveBankSettingData.do?tokenid="+ tokenid,
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
				viewModel.initPageInfo();
				viewModel.initBankPageInfo();
			});
			
		
			
});



 
 



