$(function() {
		var oWinSearchArr = window.location.search.substring(1).split("&");
		var searchJson = {};
		//查询字符串转换为json数据
		for(var i=0;i<oWinSearchArr.length;i++){
			var keyValueArr = oWinSearchArr[i].split("=");
			searchJson[keyValueArr[0]] = keyValueArr[1];
		}
		var viewModel = {
				tokenid : ip.getTokenId()
			};
		 //业务数据
		var dataMoudule;
		var dataXml;
		//当前联数
		var index = 1;
		var total_index;
		var reportId;
		setTimeout(function(){
			var ocx=document.getElementById('ocxDSc');
			var conditionArray =new Array();
			var conditions={};
			conditions["id"] = searchJson.dataId;
			conditions["finance_code"] = searchJson.finance_code;
			conditions["report_seq"] = searchJson.report_seq;
			conditionArray.push(conditions);
			var voucherOptions=ip.getCommonOptions({});
			voucherOptions["condition"]=JSON.stringify(conditionArray);
			voucherOptions["pageNo"]="0";
			voucherOptions["ajax"] = "nocache";
			$.ajax({
				url : "/df/f_ebank/reportDisplay/reportQuery.do?tokenid="
					+ viewModel.tokenid,
				type : "POST",
				data :voucherOptions,
				success : function(data) {
					    var dataFlag = data.flag;
					    if(dataFlag == false){
					    	alert("请为该菜单维护相应的报表信息！");
					    	oWin = window.close(); 
					    	return;
					    	}
						var ocx = document.getElementById('ocxDSc');
						dataMoudule = data.mould;
						dataXml = data.xml;
						ocx.showVoucherFEbank(data.mould,data.xml);
						requesting=false;
						reportId = data.report_id;
						voucherOptions["reportId"]=reportId;
						$.ajax({
							url : "/df/f_ebank/reportConfig/queryMouldCountByReportId.do?tokenid="
								+ viewModel.tokenid,
							type : "POST",
							data :voucherOptions,
							success : function(data) {
								    total_index = data.count;
									$("#total").html(total_index);
									}
								});
				}
			});
			$("#present_index").html("1");
		},500)
	
	//上一联
	gotoPrevReport = function(){
		var voucherOptions=ip.getCommonOptions({});
		voucherOptions["ajax"] = "nocache";
			if(index == 1){
				alert("当前已是第一联，没有上一联！");
				return;
			}
			index = index-1;
			$("#present_index").html(index);
			var ocx=document.getElementById('ocxDSc');
			var conditions={};
			var conditionArray =new Array();
			conditions["id"] = searchJson.dataId;
			conditions["finance_code"] = searchJson.finance_code;
			conditions["report_seq"] = searchJson.report_seq;
			conditionArray.push(conditions);
			var voucherOptions=ip.getCommonOptions({});
			voucherOptions["condition"]=JSON.stringify(conditionArray);
			voucherOptions["pageNo"]=index-1;
			$.ajax({
				url : "/df/f_ebank/reportDisplay/reportQuery.do?tokenid="
					+ viewModel.tokenid,
				type : "POST",
				data :voucherOptions,
				success : function(data) {
						var ocx = document.getElementById('ocxDSc');
						dataMoudule = data.mould;
						dataXml = data.xml;
						ocx.showVoucherFEbank(data.mould,data.xml);
						requesting=false;
				}
			});
			$("#total").html(total_index);
	};
		
	//下一联
	gotoNextReport = function(){
		//该报表的总联数
		var voucherOptions=ip.getCommonOptions({});
		voucherOptions["ajax"] = "nocache";
		if(index == total_index){
			alert("当前已是最后一联，没有下一联！");
			return;
		}
		index = index+1;
		$("#present_index").html(index);
		var ocx=document.getElementById('ocxDSc');
		var conditions={};
		var conditionArray =new Array();
		conditions["id"] = searchJson.dataId;
		conditions["finance_code"] = searchJson.finance_code;
		conditions["report_seq"] = searchJson.report_seq;
		conditionArray.push(conditions);
		var voucherOptions=ip.getCommonOptions({});
		voucherOptions["condition"]=JSON.stringify(conditionArray);
		voucherOptions["pageNo"]=index-1;
		$.ajax({
			url : "/df/f_ebank/reportDisplay/reportQuery.do?tokenid="
				+ viewModel.tokenid,
			type : "POST",
			data :voucherOptions,
			success : function(data) {
					var ocx = document.getElementById('ocxDSc');
					dataMoudule = data.mould;
					dataXml = data.xml;
					ocx.showVoucherFEbank(data.mould,data.xml);
					requesting=false;
					}
				});
			$("#total").html(total_index);
		};
	
	doVoucherPrint = function(){
		var ocx = document.getElementById('ocxDSc');
		ocx.printReportFEbank('','');
	//	ocx.printVoucherFEbank(dataMoudule,dataXml);
	};
		
	exit = function(){
		window.close();
	};
});
