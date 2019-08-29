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
								"belong_page" : "planManagement"
								},
							success : function(data) {
								if(data.flag=="1"){
									//请求成功 界面赋值 
									for(var i=0;i<data.rows.length;i++){
										var plt_key = data.rows[i].plt_key;
										
										//radio 框选择的值
										if(plt_key == "uparaplanAUTO_CHECK")
										{
											$("input[name="+plt_key+"][value='"+data.rows[i].value+"']").attr('checked','true');
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
			
			
			
			//与用户参数-支付管理同一个保存接口
			viewModel.savePlanManagementData = function(){
				var commonSetting={};
				
				
				var uparaplanAUTO_CHECK = $("input[name='uparaplanAUTO_CHECK']:checked").val();
				commonSetting['uparaplanAUTO_CHECK']=uparaplanAUTO_CHECK;
				
				var texts = $("input");
				for(var i = 0; i < texts.length; i++){
					commonSetting[texts.eq(i).attr("id")] = texts.eq(i).val();
				}
				
				
				
				
				$.ajax({
							url : "/df/globalConfig/savePayManagementData.do?tokenid="+ tokenid,
							type : 'POST',
							dataType : "json",
							data: {
								"ajax":1,
								"commonSetting" :JSON.stringify(commonSetting),
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
			});
			
		
			
});



 
 



