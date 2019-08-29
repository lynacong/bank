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
								"belong_page" : "salaryinterface"
								},
							success : function(data) {
								if(data.flag=="1"){
									//请求成功 界面赋值 
									for(var i=0;i<data.rows.length;i++){
										var plt_key = data.rows[i].plt_key;
										
										//radio 框选择的值
										if(plt_key == "intfsalarysalaryMatchFlag" || plt_key == "intfsalaryisPatchPlan" || plt_key == "intfsalaryisVoucher")
										{
											$("input[name="+plt_key+"][value='"+data.rows[i].value+"']").attr('checked','true');
										} 
										//工资数据的支付方式的初始化
										else if(plt_key == "intfsalarypk" ){
											$("#"+plt_key+"").val(data.rows[i].show_value);
										}
										//初始化默认选中的下拉列表选项
										else if(plt_key == "intfsalarysalaryBatchCode")
										{
											$("#intfsalarysalaryBatchCode option[value='"+data.rows[i].value+"']").prop("selected", true);
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
			
			
			viewModel.saveSalaryInterfaceData = function(){
				var commonSetting={};
				var aloneSetting={};
				//工资是否定值
				var intfsalarysalaryMatchFlag = $("input[name='intfsalarysalaryMatchFlag']:checked").val();
				commonSetting['intfsalarysalaryMatchFlag']=intfsalarysalaryMatchFlag;
				
				//实拨是否补计划
				var intfsalaryisPatchPlan = $("input[name='intfsalaryisPatchPlan']:checked").val();
				commonSetting['intfsalaryisPatchPlan']=intfsalaryisPatchPlan;

				//仅生成支付申请
				var intfsalaryisVoucher = $("input[name='intfsalaryisVoucher']:checked").val();
				commonSetting['intfsalaryisVoucher']=intfsalaryisVoucher;
				
				//批量录入规则
				var intfsalarysalaryBatchCode=$('#intfsalarysalaryBatchCode option:selected').text();
				aloneSetting['intfsalarysalaryBatchCode']=intfsalarysalaryBatchCode;
				
				//工资数据的支付方式
				var intfsalarypk=$('#intfsalarypk').val();
				aloneSetting['intfsalarypk']=intfsalarypk;
				
				
				
				$.ajax({
							url : "/df/globalConfig/saveSalaryInterface.do?tokenid="+ tokenid,
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

//实拨是否补计划  intf.salary.isPatchPlan
//仅生成支付申请   intf.salary.isVoucher
//批量录入规则  intf.salary.salaryBatchCode
//工资是否定值   intf.salary.salaryMatchFlag
//工资数据的支付方式 intf.salary.pk

//salaryinterface
//批量录入规则 sql 


 
 



