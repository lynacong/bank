require(['jquery', 'knockout', 'bootstrap', 'uui','tree','grid','director','dateZH','ip'], function ($, ko) {
	window.ko = ko;
	var tokenid = ip.getTokenId();
	var sysId = null;
	var pagetype = "1";
	var option1 = "<option value='0'>全部</option>";
	var option2 = "<option value='0'>全部</option>";
	var option3 = "<option value='0'>全部</option>";
	var menuViewModel = {
			data : ko.observable({}),

			comItems2: [{
				"value": "1",
				"name": "星期一"
			}, {
				"value": "2",
				"name": "星期二"
			}, {
				"value": "3",
				"name": "星期三"
			}, {
				"value": "4",
				"name": "星期四"
			}, {
				"value": "5",
				"name": "星期五"
			}, {
				"value": "6",
				"name": "星期六"
			}, {
				"value": "7",
				"name": "星期日"
			}],    
			comItems1: [{
				"value": "01",
				"name": "1月"
			}, {
				"value": "02",
				"name": "2月"
			}, {
				"value": "03",
				"name": "3月"
			}, {
				"value": "04",
				"name": "4月"
			}, {
				"value": "05",
				"name": "5月"
			}, {
				"value": "06",
				"name": "6月"
			}, {
				"value": "07",
				"name": "7月"
			}, {
				"value": "08",
				"name": "8月"
			}, {
				"value": "09",
				"name": "9月"
			}, {
				"value": "10",
				"name": "10月"
			}, {
				"value": "11",
				"name": "11月"
			}, {
				"value": "12",
				"name": "12月"
			}],  
			comItems3: [ {
				"value": "1",
				"name": "休息日"
			}, {
				"value": "0",
				"name": "工作日"
			}
			],  
			treeViewTable: new u.DataTable({
				meta: {
					'ui_id': {
						'value':""
					},
					'parentid': {
						'value':""
					},
					'uiname':{
						'value':""
					}
				}
			}),
			gridDataTable: new u.DataTable({
				meta: {
					'set_year':{},
					'date_month':{},
					'date_day':{},
					'week':{},
					'date_type':{}
				}
			})
	};
	menuViewModel.getInitData = function () {
		menuViewModel.gridDataTable.removeAllRows();
		$.ajax({
			url: "/df/Workday/getAlldate.do?tokenid=" + tokenid,
			type: 'GET',
			async: false,
			dataType: 'json',
			data: {"ajax":"noCache"},
			success: function (data) {
				menuViewModel.gridDataTable.removeAllRows();
				menuViewModel.gridDataTable.setSimpleData(data.alldate);
				menuViewModel.gridDataTable.setRowUnSelect(0);
				var dataselect = data.allyear;
				var ophtml = "<option value='1'>全部</option>";
				for(var k = 0 ; k < dataselect.length ; k++){
					ophtml = ophtml + "<option value='"+dataselect[k].set_year+"'>"+dataselect[k].set_year+"</option>";
				}
				$("#year").append(ophtml);
			} 
		});
		for(var z = 1; z < 32 ; z++){
			option1 = option1 + "<option value='"+Array((2-(''+z).length+1)).join(0)+z+"'>"+z+"号"+"</option>";
		}
		for(var z = 1; z < 31 ; z++){
			option2 = option2 + "<option value='"+Array((2-(''+z).length+1)).join(0)+z+"'>"+z+"号"+"</option>";
		}
		for(var z = 1; z < 30 ; z++){
			option3 = option3 + "<option value='"+Array((2-(''+z).length+1)).join(0)+z+"'>"+z+"号"+"</option>";
		}
		$("#date").append(option1);
	}
	menuViewModel.editSubmit = function(){
		var row = menuViewModel.gridDataTable.getSelectedRows();
		if(row.length == 0 ){
			ip.ipInfoJump("请选择要修改的数据！","info");
			return;
		}
		var year  = row[0].data.set_year.value;
		var month = row[0].data.date_month.value;
		var date = row[0].data.date_day.value;
		var type = row[0].data.date_type.value;  
		$.ajax({
			url: "/df/Workday/updateDatetype.do?tokenid=" + tokenid,
			type: 'post',
			dataType: 'json',
			data: {"year":year,"type":type,"month":month,"date":date,"ajax":"noCache"},
			success: function (data) {
				change1();
			}
		});
	}
	change1 = function(){
		var year = $("#year").val();
		var type = $("#type").val();
		var month = $("#month").val();
		var date = $("#date").val();
		var week = $("#week").val();
		$.ajax({
			url: "/df/Workday/getdatebycondition.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"year":year,"type":type,"month":month,"date":date,"week":week,"ajax":"noCache"},
			success: function (data) {
				menuViewModel.gridDataTable.removeAllRows();
				menuViewModel.gridDataTable.setSimpleData(data.alldate);
				menuViewModel.gridDataTable.setRowUnSelect(0);
			}
		});
	}


	$(function () {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el: 'body',
			model: menuViewModel
		});
		menuViewModel.getInitData();
		$("#year").change(function(){
			change1();
		});

		$("#type").change(function(){
			change1();
		});
		$("#month").change(function(){
			change1();
			var month = $("#month").val();
			$("#date").empty();
			if(month == "01" ||month == "03" ||month == "05" ||month == "07" ||month == "08" ||month == "10" ||month == "12" )
				$("#date").append(option1);
			else if(month == "04" ||month == "06" ||month == "09" ||month == "11" )
				$("#date").append(option2);
			else if(month == "02" )
				$("#date").append(option3);
			$("#date").val("0");
		});
		$("#date").change(function(){
			change1();
		});
		$("#week").change(function(){
			change1();
		});
	});
});
