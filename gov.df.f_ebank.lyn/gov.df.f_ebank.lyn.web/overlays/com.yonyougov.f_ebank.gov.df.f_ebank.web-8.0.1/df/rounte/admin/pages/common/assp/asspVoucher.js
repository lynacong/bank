$(function() {
	var viewModel = {}; 
	var billnos = decodeURI(ip.getUrlParameter("billnos"));
	//查询类型 0 凭证预览 1 凭证查看
	var searchtype = ip.getUrlParameter("searchtype");
	//父菜单
	var parent_menuid = ip.getUrlParameter("menuid");
	var vt_code = ip.getUrlParameter("vt_code");
	var set_year = ip.getUrlParameter("set_year");
	var rg_code = ip.getUrlParameter("rg_code");
	// 电子凭证库服务地址
	var assp_voucher_url = "";
	// 电子印章服务地址
	var assp_stamp_url = "";
	var currentNo = "";
	var pageIndex = 0;

	//通过财政机构和名称获取配置的数据
	viewModel.getEBankConfParam = function(rgCode, key) {
		var result;
		$.ajax({
			url : EBankConstant.CommonUrl.EBankConfParam_url
					+ "/getParamConfByKey.do",
			type : "POST",
			dataType : "json",
			async : false,
			data : {
				"tokenid" : ip.getTokenId(),
				"rg_code" : rgCode,
				"key" : key,
				"ajax" : "noCache"
			},
			success : function(data) {
				result = data;
			}
		});
		return result;
	};
	//组装需要盖章或发送的XML格式
	viewModel.generalXMLDataBySetManager = function(options) {
		var result;
		$.ajax({
			url : "/df/assp/generalXMLDataBySetManager.do",
			type : "GET",
			dataType : "json",
			async : false,
			data : options,
			success : function(data) {
				result = data;
			}
		});
		return result;
	};
	//插件设置凭证库地址和签章地址
	viewModel.setUrl = function(assp_voucher_url, assp_stamp_url) {
		try {
			var ActiveX = document.getElementById("CTJEstampOcx");
			if (ActiveX) {
				var ret = ActiveX.SetEvoucherServiceUrl(assp_voucher_url);
				if (ret != 0) {
					var reg = ActiveX.GetLastErr();
					alert(ret + reg);
				} else {
					ret = ActiveX.SetEstampServiceUrl(assp_stamp_url);
				}
			} else {
				alert("get ActiveX failure\n");
			}
		} catch (e) {
			alert('错误' + e.message);
		}
	};
	//初始化方法
	viewModel.init = function() {
		try {
			var ActiveX = document.getElementById("CTJEstampOcx");
			if (ActiveX) {
				var ret = ActiveX.Initialize("111", rg_code, set_year, vt_code,
						"0", 2, 1, 0);
				if (ret != 0) {
					var reg = ActiveX.GetLastErr();
					alert(reg);
				}
			} else {
				alert("get ActiveX failure\n");
			}
		} catch (e) {
			alert('错误' + e.message);
		}
	}
	//凭证预览
	function addVoucher(){
		try {
			var voucherData = viewModel.getEBankConfParam(rg_code,EBankConstant.AsspConstants.ASSP_URL_WEBSERVICE_PARAM);
			var stampData = viewModel.getEBankConfParam(rg_code,EBankConstant.AsspConstants.ASSP_URL_ESTAMP_PARAM);
			assp_voucher_url = voucherData["value"];
			assp_stamp_url = stampData["value"];
			viewModel.setUrl(assp_voucher_url, assp_stamp_url);
			viewModel.init();
			var errorInfo = "";
			var currentNo = "";
			var options = {};
			var ActiveX = document.getElementById("CTJEstampOcx");
			if (ActiveX) {
				var index = billnos.indexOf(",");
				options["vtCode"] = vt_code;
				options["rgCode"] = rg_code;
				options["setYear"] = set_year;
				if (index != -1) {
					var vouNo = billnos.split(",");
					currentNo = vouNo[0];
					for (var i = 0; i < vouNo.length; i++) {
						var billIds = new Array();
						temp = {};
						temp["bill_no"] = vouNo[i];
						billIds.push(temp);
						options["subBillIds"] = JSON.stringify(billIds);
						var xmlResult = viewModel.generalXMLDataBySetManager(options);
						if (xmlResult.flag == true) { //请求成功
							var xml = xmlResult.voucherXml;
						} else { //请求失败
							errorInfo = xmlResult.result;
							return errorInfo;
						}
						ret = ActiveX.AddVoucher(vouNo[i], xml);
					}
				} else {
					var billIds = new Array();
					temp = {};
					temp["bill_no"] = billnos;
					billIds.push(temp);
					options["subBillIds"] = JSON.stringify(billIds);
					var xml = viewModel.generalXMLDataBySetManager(options);
					xml = xml.voucherXml;
					ret = ActiveX.AddVoucher(billnos, xml);
					currentNo = billnos;
				}
				var ret = ActiveX.SetCurrentVoucher(currentNo);
				ActiveX.ZoomToFit();
			} else {
				alert("get ActiveX failure\n");
			}
		} catch (e) {
			alert('错误' + e.message + '发生在' + e.lineNumber + '行');
		}
	};
	//凭证查看
	function addVoucherfromServer(){
		try {
			var voucherData = viewModel.getEBankConfParam(rg_code,
					EBankConstant.AsspConstants.ASSP_URL_WEBSERVICE_PARAM);
			var stampData = viewModel.getEBankConfParam(rg_code,
					EBankConstant.AsspConstants.ASSP_URL_ESTAMP_PARAM);
			assp_voucher_url = voucherData["value"];
			assp_stamp_url = stampData["value"];
			viewModel.setUrl(assp_voucher_url, assp_stamp_url);
			viewModel.init();
			var errorInfo = "";
			currentNo = "";
			var ActiveX = document.getElementById("CTJEstampOcx");
			if (ActiveX) {
				var index = billnos.indexOf(",");
				if (index != -1) {
					var vouNo = billnos.split(",");
					currentNo = vouNo[0];
					for (var i = 0; i < vouNo.length; i++) {
						ret = ActiveX.AddVoucherfromServer(vouNo[i]);
					}
				} else {
					ret = ActiveX.AddVoucherfromServer(billnos);
					currentNo = billnos;
				}
				if (ret != 0) {
					errorInfo = errorInfo + ActiveX.GetLastErr();
					alert("返回值 = " + errorInfo);
				}
				var ret = ActiveX.SetCurrentVoucher(currentNo);
				ActiveX.ZoomToFit();
			} else {
				alert("get ActiveX failure\n");
			}
		} catch (e) {
			alert('错误' + e.message + '发生在' + e.lineNumber + '行');
		}
	};
	//上一联
	$("#pageUp").click(function() {
		var ActiveX = document.getElementById("CTJEstampOcx");
		if (ActiveX) {
			var ret = ActiveX.PageUp();
			if (ret != 0) {
				var reg = ActiveX.GetLastErr();
				alert(reg);
				return;
			}
		} else {
			alert("get ActiveX failure\n");
		}
	});
	//下一联
	$("#pageDown").click(function(){
		var ActiveX = document.getElementById("CTJEstampOcx");
		if (ActiveX) {
			var ret = ActiveX.PageDown();
			if (ret != 0) {
				var reg = ActiveX.GetLastErr();
				alert(reg);
				return;
			}
		} else {
			alert("get ActiveX failure\n");
		}
	});
	//上一页
	$("#prevVoucherBtn").click(function(){
		try {
			var ActiveX = document.getElementById("CTJEstampOcx");
			if (ActiveX) {
				viewModel.init();
				ActiveX.displayVoucherByIndex(pageIndex);
				var retPre = ActiveX.GotoPrevVoucher();
				if (retPre != 0) {
					errorInfo = ActiveX.GetLastErr();
					alert(errorInfo);
					return;
				}
				pageIndex--;
			} else {
				alert("get ActiveX failure\n");
			}
		} catch (e) {
			alert(e.message);
		}
	});
	//下一页
	$("#nextVoucherBtn").click(function(){
		try {
			var ActiveX = document.getElementById("CTJEstampOcx");
			if (ActiveX) {
				viewModel.init();
				ActiveX.displayVoucherByIndex(pageIndex);
				var retNext = ActiveX.GotoNextVoucher();
				if (retNext != 0) {
					errorInfo = ActiveX.GetLastErr();
					alert(errorInfo);
					return;
				}
				pageIndex++;
			} else {
				alert("get ActiveX failure\n");
			}
		} catch (e) {
			alert(e.message);
		}
	});
	//打印当前页
	$("#printBtn").click(function(){
		try {
			var ActiveX = document.getElementById("CTJEstampOcx");
			if (ActiveX) {
				var retPrint = ActiveX.PrintCurrentVoucher(1);
				if (retPrint != 0) {
					errorInfo = ActiveX.GetLastErr();
					alert(errorInfo);
					return;
				}
			} else {
				alert("get ActiveX failure\n");
			}
		} catch (e) {
			alert(e.message);
		}
	});
	//打印全部
	$("#PrintAllBtn").click(function(){
		try {
			var ActiveX = document.getElementById("CTJEstampOcx");
			if (ActiveX) {
				var n = ActiveX.GetCurrentPageNo();
				var ret = ActiveX.PrintAllVoucher("111", rg_code, set_year,
						vt_code, n, billnos);
				if (ret != 0) {
					var reg = ActiveX.GetLastErr();
					alert(reg);
					return;
				} 
			} else {
				alert("get ActiveX failure\n");
			}
		}catch (e) {
			alert(e.message);
		}
	});
	// 延迟执行，等待ocx控件加载完成
	setTimeout(function(){
		if (searchtype == 0){
			addVoucher();
		}else if (searchtype == 1) {
			addVoucherfromServer();
		}
	},1000);
});