require([ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director', 'tree', 'grid', 'ip', 'dateZH' ], function($, ko, echarts) {

	var options = ip.getCommonOptions({});
	// var tokenid = ip.getTokenId();
	var gStatus = 0;// 0查询，1新增，2更新

	var viewModel = {
		// data: ko.observable({}),
		tokenid : ip.getTokenId(),
		gridDatatable : new u.DataTable({
			meta : {
				'chr_id' : {},
				'chr_code' : {},
				'chr_name' : {},
				'chr_value' : {},
				'finance_code' : {},
				'rg_name' : {}
			}
		})
	};

	viewModel.fsetStatus = function(status) {
		gStatus = status;
		if (gStatus == 0) {
		}
	};

	viewModel.fEditRec = function(status) {
		viewModel.fModalShow();

	};
	
	viewModel.fSaveRec = function(status) {

	};
	
	viewModel.fReRec = function(status) {

	};

	viewModel.fModalShow = function() {

		var rows = viewModel.gridDatatable.getSelectedRows();
		if(rows.length==0){
			ip.warnJumpMsg("请选择具体的参数进行修改！！！", 0, 0, true);
			return;
		}
		document.getElementById("modal_chr_id").value = rows[0].data.chr_id.value;
		// document.getElementById("modal_rg_name").value =
		// rows[0].data.rg_name.value;
		document.getElementById("modal_chr_name").value = rows[0].data.chr_name.value;
		// 转义
		//document.getElementById("modal_chr_value").value = rows[0].data.chr_value.value.replace(/\&\#34\;/ig, "\"");
		if(rows[0].data.chr_value.value!=null){
			document.getElementById("modal_chr_value").value =htmlDecodeByRegExp(rows[0].data.chr_value.value);
		}
		$('#wizardModal').modal('show');
	};
	
	fModalOk = function() {
		var chr_name = document.getElementById("modal_chr_name").value;
		var chr_value = document.getElementById("modal_chr_value").value;
		var finance_code = $("#finance_code").val();
		$.ajax({
			url : "/df/f_ebank/paramconf/paramConfSaveRec.do?tokenid=" + viewModel.tokenid,
			type : "POST",
			dataType : "json",
			data : {
				"ajax" : "noCache",
				"chrName" : chr_name,
				"chrValue" : chr_value,
				"financeCode":finance_code
			},
			success : function(datas) {
				if (datas.errorCode == "0") {
					ip.ipInfoJump("保存成功！", "success");
					viewModel.initGrid();
				} else {
					ip.ipInfoJump("保存参数值失败！原因：" + datas.result, "error");
					viewModel.initGrid();
				}
				$('#wizardModal').modal('hide');
			}
		});
	};
	
	viewModel.fModalCancel = function() {
		$('#wizardModal').modal('hide');
	};

	viewModel.initCombo = function() {

		$.ajax({
			url : "/df/f_ebank/config/getFinanceOrgData.do?tokenid=" + viewModel.tokenid,
			type : "GET",
			sysn : false,
			dataType : "json",
			data : {
				"ajax" : "noCache"
			},
			success : function(datas) {
				if (datas.errorCode == "0") {
					var x = document.getElementById("finance_code");
					for ( var i = x.options.length - 1; i > -1; i--) {
						x.options.remove(i);
					}

					for ( var i = 0; i < datas.dataDetail.length; i++) {

						var option = document.createElement("option");
						option.text = datas.dataDetail[i].chr_name;
						option.value = datas.dataDetail[i].chr_code;

						try {
							// 对于更早的版本IE8
							x.add(option, x.options[null]);
						} catch (e) {
							x.add(option, null);
						}

						//var rg_code = document.getElementById("rg_code").value;
						var finance_code = $("#finance_code").val();
						viewModel.initGrid();

					}
				} else {
					ip.ipInfoJump("加载Combo失败！原因：" + datas.result, "error");
				}
			}
		});
	};

	fGetGrid = function() {
		viewModel.initGrid();
	};
	
	fGridOndblclick = function() {
		viewModel.fEditRec();
	};

	viewModel.initGrid = function() {
		//var rg_code = document.getElementById("rg_code").value;
		var finance_code = $("#finance_code").val();
		var field_disptype = "";

		if (document.getElementsByName("fd_ss")[0].checked == true) {
			field_disptype = field_disptype + "1";
		}
		if (document.getElementsByName("fd_kf")[0].checked == true) {
			field_disptype = field_disptype + "0";
		}
		if (field_disptype.length > 1) {
			field_disptype = "_";
		}

		$.ajax({
			url : "/df/f_ebank/paramconf/paramConfGetGridData.do?tokenid=" + viewModel.tokenid,
			type : "POST",
			dataType : "json",
			data : {
				"ajax" : "nocache",
				"financeCode" : finance_code,
				"fieldDisptype" : field_disptype
			},
			success : function(datas) {
				if (datas.errorCode == "0") {

					// 转义
					for ( var i = 0; i < datas.dataDetail.length; i++) {
						var Str = datas.dataDetail[i]["chr_value"];
						if (Str.indexOf("\"") > 0) {
							Str = Str.replace(/\"/ig, "&#34;");
							datas.dataDetail[i]["chr_value"] = Str;
						}
						//datas.dataDetail[i]["chr_value"] = htmlEncodeByRegExp(Str);
						datas.dataDetail[i]["chr_value"] = Str;
					}

					viewModel.gridDatatable.setSimpleData(datas.dataDetail);
					// viewModel.subsystemDatatable.setRowUnSelect(0);
				} else {
					ip.ipInfoJump("加载Grid失败！原因：" + datas.result, "error");
				}
			}
		});
	};

	$(function() {
		var app = u.createApp({
			el : document.body,
			model : viewModel
		});

		viewModel.initCombo();
		// viewModel.fsetStatus(0);
	});
});
