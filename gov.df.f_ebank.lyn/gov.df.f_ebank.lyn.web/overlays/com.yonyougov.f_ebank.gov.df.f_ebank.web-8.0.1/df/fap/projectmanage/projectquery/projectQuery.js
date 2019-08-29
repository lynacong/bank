require(['jquery', 'knockout', 'bootstrap', 'uui','grid','director','ip'], function ($, ko) {
	window.ko = ko;
	var queryViewModel = {
		data : ko.observable({}),
		totalGridDataTable: new u.DataTable({
			meta: {
				'time1':{},
				'time2':{},
				'uiid':{},
				'uiname':{},
				'uicode':{},
				'currency':{},
				'time':{}
				
			}
		})
	};
	$(function () {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el: 'body',
			model: queryViewModel
		});
		data = {
				"totalPages":5,
				"totalElements":22,
				"viewlist" : [
							{
						    	"uiid": "01",
						    	"uiname": "Parent1"
						  	},
							{
								"uiid": "02",
						        "uiname": "Parent2"
						  	},
							{
								"uiid": "201",
						        "uiname": "Child21"
						  	},
							{
								"uiid": "101",
						        "uiname": "Child11"
						  	},
							{
								"uiid": "102",
						        "uiname": "mChild12"
						  	}
						]
			}
		queryViewModel.totalGridDataTable.pageIndex("0");
		queryViewModel.totalGridDataTable.pageSize("5");
		queryViewModel.totalGridDataTable.totalPages(data.totalPages);
		queryViewModel.totalGridDataTable.totalRow(data.totalElements);
		queryViewModel.totalGridDataTable.setSimpleData(data.viewlist);
		queryViewModel.totalGridDataTable.setRowUnSelect(0);
		
	});
	
	//增加与编辑start
	$('#addBudgetItem').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget);
	    var recipient = button.data('whatever');
	    if(recipient=="0"){
	    	alert("开始新增");
	    }
	})
	//增加与编辑end

	//年度切换change事件处理start
	$('#year-data').change(function(){
		alert($(this).val());
	});
	
});
