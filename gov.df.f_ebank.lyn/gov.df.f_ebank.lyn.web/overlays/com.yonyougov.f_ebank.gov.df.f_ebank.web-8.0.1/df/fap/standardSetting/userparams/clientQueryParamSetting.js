require([ 'jquery', 'knockout', 'bootstrap', 'uui', 'tree', 'grid', 'director','ip' ],
		function($, ko) {
			window.ko = ko;
			var plt_key="";
			var tokenid = ip.getTokenId();
			var viewModel = {
				    gridDataTableClassList: new u.DataTable({
				        meta: {
				            'plt_key': {
				                'value':""
				            },
				            'querytable':{
				                'value':""
				            },
				            'field':{
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
							url : "/df/globalConfig/initClientQuerySetting.do?tokenid="+ tokenid,
							type : 'GET',
							dataType : "json",
							data: {
								"ajax":1
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
			//初始化界面信息 - 结束
			
			
			
			viewModel.saveClientQuerySettingData = function(){
				if(plt_key == "")
					{
						ip.ipInfoJump("清闲选中一条表格数据进行编辑！");
						return;
					}
				var aloneSetting={};
				
				
				
				var enable = $("input[name='isEnabledData']:checked").val();
				aloneSetting['enable']=enable;
				
				aloneSetting['plt_key']=plt_key;
				
				var descript=$('#descript').val();
				aloneSetting['descript']=descript;
				
				var value=$('#value').val();
				aloneSetting['value']=value;
			
				
				
			
				$.ajax({
							url : "/df/globalConfig/saveClientQuerySettingData.do?tokenid="+ tokenid,
							type : 'POST',
							dataType : "json",
							data: {
								"ajax":1,
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
			
			
			
		    /*
		      * 双击表格行事件
			 */ 
			viewModel.onRowSelectedFunction = function() {
				
				var gridObj = $("#gridObjField").parent()[0]['u-meta'].grid;
				var selectedRow= gridObj.getSelectRows()[0];
				plt_key=selectedRow.plt_key;
				$("#querytable").val(selectedRow.querytable);
				$("#field").val(selectedRow.field);
				$("#descript").val(selectedRow.descript);
				$("#value").val(selectedRow.value);
				$("input[name='isEnabledData'][value='"+selectedRow.enable+"']").attr('checked','true');
				
				};
			
				$(function(){
					ko.cleanNode($('body')[0]);
					var app = u.createApp({
						el : "body",
						model : viewModel
					});
					//ko.applyBindings(viewModel);
					viewModel.initPageInfo();
				});
				
				
});


//保存事件 - 开始
function saveData(){
	
	//公务卡模式参数    || 默认银联的区划码
   var ocModel = model;
	//公务卡银联IP地址  || 默认银联的机构类型
   var ocuIPAdress = $("#ocuIPAdress").val();
   //公务卡银联端口
   var ocuPort = $("#ocuPort").val();
   //公务卡还款明细下载服务端口号
   var ocpdsPort = $("#ocpdsPort").val();
   //是否启用公务卡服务平台
   var isUsedDXP=$('#isUsedDXP').prop("checked")?1:0;
   //公务卡服务平台(DXP)IP地址
   var dxpIP = $("#dxpIP").val();
   //公务卡服务平台(DXP)端口
   var dxpPort = $("#dxpPort").val();
   //登录DXP用户名 
   var dxpLoginName = $("#dxpLoginName").val();
   //登录DXP密码
   var dxpLoginPass = $("#dxpLoginPass").val();
   //单次下载返回最大条数
   var maximumNum = $("#maximumNum").val();
   //下载方式配置
   var downloadConfig = $("#downloadConfig").val();
   //财政区划码  || 发送方区划码
   var fincial_region_code = $("#fincial_region_code").val();
   //财政机构码  || 发送方机构类型码
   var fincial_organ_code = $("#fincial_organ_code").val();
   //是否启用身份证号有效性验证
   var isCheckedIDNum=$('#isCheckedIDNum').prop("checked")?1:0;
}
//保存事件 - 结束