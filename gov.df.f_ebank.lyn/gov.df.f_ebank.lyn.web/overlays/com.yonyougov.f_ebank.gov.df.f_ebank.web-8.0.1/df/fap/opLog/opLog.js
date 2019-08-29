require([ 'jquery', 'knockout', 'bootstrap', 'uui', 'tree', 'grid', 'director',
		'ip', 'dateZH', 'md5' ], function($, ko) {
	window.ko = ko;
	var tokenid = ip.getTokenId();
	var menuViewModel = {
		data : ko.observable({}),
		gridDataTable : new u.DataTable({
			meta : {
				'logid' : {},
				'syscode' : {},
				'modulecode' : {},
				'menucode' : {},
				//'funcid' : {},
				'region' : {},
				'agencycode' : {},
				'agencyname' : {},
				'usercode' : {},
				'username' : {},
				'userrole' : {},
				'transdate' : {},
				'ipaddress' : {},
				'url' : {},
				'status' : {},
				'macaddress' : {},
				'recordtime' : {},
				'message' : {},
			}
		}),
		comItems : [ {
			"value" : "0",
			"name" : "失败"
		}, {
			"value" : "1",
			"name" : "成功"
		} ]
	};

	$('.form_date').datetimepicker({
		language : 'zh-CN',
		weekStart : 1,
		todayBtn : 1,
		autoclose : 1,
		todayHighlight : 1,
		startView : 2,
		minView : 2,
		forceParse : 0
	});

	// 新增按钮事件
	menuViewModel.btnSelectSubmit = function() {
		var inData = {};
		if (document.getElementById("divdetailcase").style.display != "none") {
			var inData = {
				"ajax" : "noCache",
				"bDate" : $("#bdate").val(),
				"eDate" : $("#edate").val(),
				"message" : $("#message").val(),
				"syscode" : $("#syscode").val(),
				"modulecode" : $("#modulecode").val(),
				"menucode" : $("#menucode").val(),
				//"funcid" : $("#funcid").val(),
				"region" : $("#region").val(),
				"agencycode" : $("#agencycode").val(),
				"agencyname" : $("#agencyname").val(),
				"usercode" : $("#usercode").val(),
				"username" : $("#username").val(),
				"userrole" : $("#userrole").val(),
				"transdate" : $("#transdate").val(),
				"ipaddress" : $("#ipaddress").val(),
				"url" : $("#url").val(),
				"status" : $("#status").val(),
				"macaddress" : $("#macaddress").val()
			}
		} else {
			var inData = {
				"ajax" : "noCache",
				"bDate" : $("#bdate").val(),
				"eDate" : $("#edate").val(),
				"message" : $("#message").val(),
				"syscode" : "",
				"modulecode" : "",
				"menucode" : "",
				//"funcid" : "",
				"region" : "",
				"agencycode" : "",
				"agencyname" : "",
				"usercode" : "",
				"username" : "",
				"userrole" : "",
				"transdate" : "",
				"ipaddress" : "",
				"url" : "",
				"status" : "",
				"macaddress" : ""
			}
		}

		$.ajax({
			url : "/df/operationlog/getlog.do?tokenid=" + tokenid,
			type : 'GET',
			dataType : 'json',
			data : inData,
			success : function(data) {
				menuViewModel.gridDataTable.removeAllRows();
				menuViewModel.gridDataTable.setSimpleData(data.dataDetail);
				menuViewModel.gridDataTable.setRowUnSelect(0);
			}
		});

	}

	 $("#labdetailcase").click(function() {   
	        $("#divdetailcase").slideToggle();  
	    });  

	$(function() {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el : 'body',
			model : menuViewModel
		});
		$('.form_date').datetimepicker({
			language : 'zh-CN',
			weekStart : 1,
			todayBtn : 1,
			autoclose : 1,
			todayHighlight : 1,
			startView : 2,
			minView : 2,
			forceParse : 0
		});
		$("#bdate").val(new Date().Format("yyyy-MM-dd"));
		$("#edate").val(new Date().Format("yyyy-MM-dd"));

	});
});
