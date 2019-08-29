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
		viewModel.transferRgYearRight = function(i,selectdata){
			if(i>=selectdata.length)
			{
				initRightData($("#rgcode").val(),$("#setyear").val());
				return;
			}
			$.ajax({
				url : "/df/datatransfer/sys/transferright.do?tokenid="
						+ tokenid,
				type : 'POST',
				dataType : "json",
				async: true,
				data: {
					"ajax1":"1",
		            "rg_code":$("#rgcode").val(),
		            "set_year":$("#setyear").val(),
		            "right_table":selectdata[i].right_table,
		            "right_sql":selectdata[i].right_sql,
		            "is_same":selectdata[i].is_same
					
				},
				success : function(data) { 
					if(data.flag=="1"){
						ip.ipInfoJump(data);
					}else if(data.flag=="0"){
						ip.ipInfoJump(data);
					}
					viewModel.transferRgYearRight(i+1,selectdata);
				}
			});
		};
		var selectdata;
		viewModel.transferRightRgYear = function(){
			 var gridObj = $("#grid").parent()[0]['u-meta'].grid;  
			 selectdata = gridObj.getSelectRows();
			 if(selectdata.length==0){
				 ip.ipInfoJump("未选中要素");
				 return;
			 }
			 viewModel.transferRgYearRight(0,selectdata);
			
		};
 
		 
		 
		$(function() {
			app = u.createApp({
				el: '.right-continer',
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
					initRightData(data.rgcode,data.setyear);
				}
			});
					
				});
		var rgithdata;
		var initRightData = function(rg_code,set_year){

			$.ajax({
				url : "/df/datatransfer/getTransferRight.do?tokenid="
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
					rithtdata = data;
					viewModel.dataTable.setSimpleData(data,{unSelect:true});
					 
				}
			});	
		};		
});		
		
		


