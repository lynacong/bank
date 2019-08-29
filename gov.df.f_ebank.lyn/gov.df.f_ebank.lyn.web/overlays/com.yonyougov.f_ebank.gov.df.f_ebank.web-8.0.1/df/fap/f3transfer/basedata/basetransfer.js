require(['jquery', 'knockout', 'bootstrap', 'uui', 'grid', 'ip'],
	function($, ko) {
		var viewModel = {
			inputGrid:[],
			data: ko.observable({}),
			dataTable: new u.DataTable({
				meta: {
					"ele_code": "",
					"old_code": "",
					"pt_code": "",
					"ele_name": "",
					"is_transfer": "",
					"msg": ""
				}
			})
		};
		current_url = location.search;
		tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,
				current_url.indexOf("tokenid") + 48);
		
			/*
			 * 获取选中行
			 */
		
		viewModel.getSelectRows = function() {
				 var gridObj = $("#grid").parent()[0]['u-meta'].grid;  
				 var select = gridObj.getSelectRows();
				// warnJumpMsg("请在控制台查看打印的选中的对象", "", "");

			var select = app.getComp('grid');
			};
		viewModel.transferRgYearEle = function(i,selectdata){
			if(i>=selectdata.length)
			{
				initBaseData($("#rgcode").val(),$("#setyear").val());
				return;
			}
			$.ajax({
				url : "/df/datatransfer/sys/transfer.do?tokenid="
						+ tokenid,
				type : 'POST',
				dataType : "json",
				async: true,
				data: {
					"ajax1":"1",
		            "rg_code":$("#rgcode").val(),
		            "set_year":$("#setyear").val(),
		            "ele_code":selectdata[i].ele_code,
		            "pt_code":selectdata[i].pt_code,
		            "old_code":selectdata[i].old_code
					
				},
				success : function(data) {
					if(data.flag=="1"){
						ip.ipInfoJump(data);
					}else if(data.flag=="0"){
						ip.ipInfoJump(data);
					}
					viewModel.transferRgYearEle(i+1,selectdata);
				}
			});
		};
		var selectdata;
		viewModel.transferBaseRgYear = function(){
			 var gridObj = $("#grid").parent()[0]['u-meta'].grid;  
			 selectdata = gridObj.getSelectRows();
			 if(selectdata.length==0){
				 ip.ipInfoJump("未选中要素");
				 return;
			 }
			 viewModel.transferRgYearEle(0,selectdata);
			
		};
 
		 
		 
		$(function() {
			app = u.createApp({
				el: '.base-continer',
				model: viewModel
			});
			 
		});

		//区划显示
		$(function () { 
			$.ajax({
				url : "/df/datatransfer/getRgcode.do?tokenid="
						+ tokenid, 
				type : 'POST',
				dataType : "json",
				data: {
					"ajax":"1"
					
				},
				success : function(data) {
					$("#rgcode").val(data.rgcode);
					$("#setyear").val(data.setyear);
					initBaseData(data.rgcode,data.setyear);
				}
			});
					
				});
		var basedata;
		var initBaseData = function(rg_code,set_year){

			$.ajax({
				url : "/df/datatransfer/getTransferEle.do?tokenid="
						+ tokenid,
				type : 'POST',
				dataType : "json",
				async: true,
				data: {
					"ajax1":"1",
		            "rg_code":rg_code,
		            "set_year":set_year,
		 			
				},
				success : function(data) {
					basedata = data;
					viewModel.dataTable.setSimpleData(data,{unSelect:true});
					 
				}
			});	
		};		
});		
		
		


