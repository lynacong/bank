require([ 'jquery', 'knockout', 'bootstrap', 'uui', 'tree', 'grid', 'director','ip' ],
		function($, ko) {
			window.ko = ko;
			var model="";
			var tokenid = ip.getTokenId();
			var viewModel = {
				    gridDataTableClassList: new u.DataTable({
				        meta: {
				            'plt_key': {
				                'value':""
				            },
				            'descript':{
				                'value':""
				            },
				            'value':{
				                'value':""
				            }
				        }
				    })
					};
			
			//初始化界面信息- 开始
			viewModel.initPageInfo=function(){
				
				
				$.ajax({
							url : "/df/globalConfig/initBasePageInfo.do?tokenid="+ tokenid,
							type : 'GET',
							dataType : "json",
							data: {
								"ajax":1,
								"belong_page" : "conventionalInterface"
								},
							success : function(data) {
								if(data.flag=="1"){
									//请求成功 界面赋值 
									for(var i=0;i<data.rows.length;i++){
										var plt_key = data.rows[i].plt_key;
										
										//radio 框选择的值
										if(plt_key == "intfexportisOrDivideByMoney" || plt_key == "intfbudgetfeedbackautoPayBudget" || plt_key == "intfbudgetfeedbackpayBudgetIsUse" || plt_key == "intfbudgetfeedbackpayBudgetMonthConf" || plt_key =="intfbudgetfeedbackpayBudgetType" || plt_key =="intfbudgetfeedbackrelate_field")
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
			
			
			
			//初始化grid- 开始
			viewModel.initGridInfo=function(){
				
				
				$.ajax({
							url : "/df/globalConfig/initBasePageInfo.do?tokenid="+ tokenid,
							type : 'GET',
							dataType : "json",
							data: {
								"ajax":1,
								"belong_page" : "conventionalInterface_grid"
								},
							success : function(data) {
								if(data.flag=="1"){
									viewModel.gridDataTableClassList.setSimpleData(data.rows);
								}
								else if(data.flag=="0"){
									ip.ipInfoJump("初始化失败");
								}
						}
				});
			};
			//初始化grid-- 结束
			
			
			//添加事件-开始
			var i=10000;
			viewModel.gridAdd = function() {
				var descript=$("#descript").val();
				var value=$("#value").val();
				if(descript==""|| value==""){
					ip.ipInfoJump("类说明或者处理类不能为空！");
					return ;
					}
				var addClass=[
				         {
				        	 "plt_key":i,
				        	 "descript":descript,
				        	 "value":value
				         }
				        ];
				viewModel.gridDataTableClassList.addSimpleData(addClass, 1);
				i++;
			};
			//添加事件-结束
			
			//删除事件-开始
			viewModel.gridDel = function() {
				
				if(confirm("真的要删除吗?")){
					var gridObj = $("#intfbudgetfeedbackverifiers_grid").parent()[0]['u-meta'].grid;
					var selectedRowIndex= gridObj.getFocusRowIndex();
					gridObj.deleteRows([selectedRowIndex]);
					//viewModel.gridDataTableClassList.removeRow(selectedRowIndex);
				}
			};
			//删除事件-结束
			
			viewModel.clickGridColumn=function(){
//				alert("aa");
//				var gridObj = $("#intfbudgetfeedbackverifiers_grid").parent()[0]['u-meta'].grid;
//				var selectedRow= gridObj.getSelectRows()[0];
//				$("#descript").val(selectedRow.descript);
//				$("#value").val(selectedRow.value);
			};
			
			
			//保存界面数据信息  开始
			viewModel.saveConventionalInterfaceData=function(){
				var commonSetting={};
				
				var texts = $(".commonSetting input[type='text']");
				for(var i = 0; i < texts.length; i++){
					commonSetting[texts.eq(i).attr("id")] = texts.eq(i).val();
				}
				
				var radios = $(".commonSetting input[type='radio']:checked");
				for(var i = 0; i < radios.length; i++){
					commonSetting[radios.eq(i).attr("name")] = radios.eq(i).val();
				}
				
				var gridRows = $("#intfbudgetfeedbackverifiers_grid").parent()[0]['u-meta'].grid.getAllRows();
				
				
				$.ajax({
							url : "/df/globalConfig/saveConventionalInterface.do?tokenid="+ tokenid,
							type : 'POST',
							dataType : "json",
							data: {
								"ajax":1,
								"commonSetting" : JSON.stringify(commonSetting),
								"aloneSetting" : JSON.stringify(gridRows),
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
			//保存界面数据信息 结束
			
			
				ko.cleanNode($('body')[0]);
				var app = u.createApp({
					el : "body",
					model : viewModel
				});
				
				$(function(){
					viewModel.initPageInfo();
					viewModel.initGridInfo();
				});
});





//指标科目编码                                        intf.import.budgetBlanceAccount
//指标额度COA编码                                 intf.import.budgetBlanceCoa          
//支付明细COA编码                                 intf.import.payDetailCoa
//人行接口导出是否按零额度拆分           intf.export.isOrDivideByMoney
//是否执行自动核销                                  intf.budget.feedback.autoPayBudget
//是否指标核销正在执行                           intf.budget.feedback.payBudgetIsUse
//华青接口是否按月份扣减额度规则         intf.budget.feedback.payBudgetMonthConf
//指标核销类型                                           intf.budget.feedback.payBudgetType
//核销关联条件                                          intf.budget.feedback.relate_field
//指标修正要素范围                                  intf.budget.modify.modifyELE
//指标修正定值规则                                  intf.budget.modify.modifyELERuleCode
//清算银行类别				    intf.exp.sysIds.clearBank
//代理银行类别                                          intf.exp.sysIds.proxyBank
//财政类别                                                  intf.exp.sysIds.financeMinistry
//银行报文金额显示格式    			intf.dxp.moneyShowPattern 









