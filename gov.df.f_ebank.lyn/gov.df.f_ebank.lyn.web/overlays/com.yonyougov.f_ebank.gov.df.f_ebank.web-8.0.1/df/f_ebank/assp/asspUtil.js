

doAsspVoucherPreview = function(datas, evt,vt_code) {
	//var billids = buildBillIds(id);
	var e = evt || window.event;	
	var bill_nos="";
	var rg_code = "";
	var set_year="";
	var oldRgcode="";
	var length =datas.length;
	for(var i=0;i<datas.length;i++){
		var data=datas[i];
		var rgcode = data.finance_code;
		var set_year=data.set_year;
		rg_code=rgcode;
		if(i==0){
			oldRgcode=rg_code;
		}else{
			if(oldRgcode!=rg_code){
				alert("不同区划数据不能进行批量凭证预览");
				return;
			}
		}
		if(i!=length-1)
		  bill_nos=bill_nos+data.bill_no+";";
		else
		  bill_nos=bill_nos+data.bill_no;
	}

	bill_nos = encodeURI(bill_nos);
	bill_nos = encodeURI(bill_nos);
	var oWin= window.open ("/df/f_ebank/assp/asspVoucher.html?tokenid="+ip.getTokenId()+"&billnos="+bill_nos+"&searchtype=0"+"&menuid="+ip.getMenuId()+"&vt_code="+vt_code+"&rg_code="+rgcode+"&set_year="+set_year, "电子凭证预览", "height=620, width=1000, top=150, left=200, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no");
	var scanFun=function(){
        if(oWin.document){
            oWin.document.title="电子凭证预览";
            window.clearInterval(scanInterval);
        }
    };
    var scanInterval=window.setInterval(scanFun,200);
};

doAsspVoucherSee = function(datas, evt,vt_code) {
	var e = evt || window.event;	
	var bill_nos="";
	var rg_code = "";
	var set_year="";
	var oldRgcode="";
	var length =datas.length;
	for(var i=0;i<datas.length;i++){
		var data=datas[i];
		var rgcode = data.finance_code;
		var set_year=data.set_year;		
		rg_code=rgcode;
		
		if(i==0){
			oldRgcode=rg_code;
		}else{
			if(oldRgcode!=rg_code){
				alert("不同区划数据不能进行批量凭证查看");
				return;
			}
		}
		if(i!=length-1)
		  bill_nos=bill_nos+data.bill_no+";";
		else
		  bill_nos=bill_nos+data.bill_no;
	}
	bill_nos = encodeURI(bill_nos);
	bill_nos = encodeURI(bill_nos);
	var oWin= window.open ("/df/f_ebank/assp/asspVoucher.html?tokenid="+ip.getTokenId()+"&billnos="+bill_nos+"&searchtype=1"+"&menuid="+ip.getMenuId()+"&vt_code="+vt_code+"&rg_code="+rgcode+"&set_year="+set_year, "电子凭证查看", "height=620, width=1000, top=150, left=200, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no");
	var scanFun=function(){
        if(oWin.document){
            oWin.document.title="电子凭证查看";
            window.clearInterval(scanInterval);
        }
    };
    var scanInterval=window.setInterval(scanFun,200);
};



/**获取单据编号名称**/
function getVoucherNoFiled( isDetail,  vtCode){
	if(strIsNull(isDetail)){//没有配置
		isDetail =EpayConstants.EPAY_DETAIL_MSG;//明细签章默认为1
	}
	if((vtCode == "8201"||vtCode == "8101")&&EpayConstants.EPAY_DETAIL_MSG ==isDetail ){
		return "voucher_no";
	}else{
		return "bill_no";
	}
}

/**
 * 获取格式化的签章xml信息
 * @param location签章位置
 * @param stamp 章信息
 * @return
 */
function getFormatStampXml(location, stamp) {
 	return "<?xml version=\"1.0\" encoding=\"GBK\"?><MOF><Stamp No=\""
			+ location + "\">" + stamp + "</Stamp></MOF>"; 
}

/**
 * 组装需要盖章或发送的XML格式
 * @param vtCode
 * @param subBillIds
 *            凭证或者明细的ids
 */
function generalXMLDataBySetManager(options) {
	var result ;
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
}
/**
 * 获取印章信息
 * @param options
 * @returns
 */
function getStampInfoByMenuId (options){
	var result;
	$.ajax({
		url : commonURL + "/getStampInfoByMenuId.do",
		type : "GET",
		dataType : "json",
		async : false,
		data : options,
		success : function(data) {
			result = data;
		}
	});
	return result;
}
//测试
function EpayAddSignAction(billIds, options) {
	options["subBillIds"] = JSON.stringify(billIds);
	EPayDoWorkFlowAction(options);
}



/**
 * 执行签章
 */
function AsspAddStampForClientAction (billIds, options){
	var errorInfo = "";
	//var stampInfo  = '<?xml version="1.0" encoding="GBK"?><MOF><Stamp No="dw_gz">ff4e209b1780478fa73c8c8c2c6dba17</Stamp></MOF>';
	 var stampInfoRet = getStampInfoByMenuId(options);
	 if(stampInfoRet.flag==true){  // 请求成功
		  stampInfo = stampInfoRet.stampInfo ;
		  if(strIsNull(stampInfo)){
				errorInfo = "根据当前操作和用户没有查询到可以使用的印章信息";
				return errorInfo;
		  }
		alert("stampInfo:  " + stampInfoRet.stampInfo);
	    }else{ // 请求失败
	    	errorInfo = stampInfoRet.result;
	    	return errorInfo;
	    }
	if(strIsNull(options.vtCode)){
		errorInfo = "vtCode没有配置";
		return errorInfo;
	}
	alert("vtCode:"+options.vtCode);
	//发送时候校验
	if(strIsNotNull(options.isSend)&&options.isSend == 1){
			if( strIsNull(options.cpCode)){
				options["cpCode"]="900";
			}
	}
 
	//一次性获取所有跟签名相关的配置参数
	if(batchSignSize == 0&&batchStampSize ==0 &&epayWebSerUrl=="" && epayStampUrl==""&&rgCode ==""){
	alert("options.svRgCode:"+options.svRgCode);
		var paramResult = getEpaySignConfParam(options.svRgCode);
	    if(paramResult.flag == "true"){  //请求成功  注意这个返回的是字符串"true"
	    	batchSignSize = paramResult[EpayConstants.ASSP_SIGN_BATCH_SIZE_PARAM];
	    	batchStampSize = paramResult[EpayConstants.ASSP_STAMP_BATCH_SIZE_PARAM];
	    	epayWebSerUrl = paramResult[EpayConstants.EPAY_URL_WEBSERVICE_PARAM];
	    	epayStampUrl = paramResult[EpayConstants.EPAY_URL_ESTAMP_PARAM];
	    	rgCode = paramResult.rg_code;
	    }else{ //请求失败
	    	errorInfo = paramResult.result;
	    	return errorInfo;
	    }
	}
	// 初始化ocx控件
	try {
		var ActiveX = document.getElementById("CTJEstampOcx");
		if (ActiveX) {
			var ret1 = ActiveX
					.SetEvoucherServiceUrl(epayWebSerUrl);
			// 校验设置URL成功否
			if (ret1 != 0) {
				errorInfo = "设置电子凭证库地址失败!";
				return errorInfo;
			}
 			alert("设置电子凭证库地址成功");
			var ret2 = ActiveX.SetEstampServiceUrl(epayStampUrl);
			// 校验设置URL成功否
			if (ret2 != 0) {
				errorInfo = "设置印章服务地址失败!";
				return errorInfo;
			}
 			alert("设置印章服务地址成功");
			var certId = ActiveX.DlgSelectCertId();
			
			// 校验cerID
			if (strIsNull(certId)) {
				errorInfo = "UKEY检测异常，请检查是否安装";
				return errorInfo;
			}
 			alert("目前函数返回cerId = " + certId);
			options["certID"] = certId;
/*			var retInit = ActiveX.Initialize(certId, rgCode, options.svSetYear,
					options.vtCode, "0", 0, 0, 0);
 		alert("OCX控件初始化参数成功，返回值：" + retInit);*/
		} else {
			errorInfo = "get ActiveX failure！";
			return errorInfo;
		}
	} catch (e) {
		errorInfo =e;
		return errorInfo;
	}
	
	// 分批次处理
	var totalCount = billIds.length;
	var times = (totalCount - 1) / batchStampSize + 1;
	// 分批处理
	var subBillIds = new Array();
	for ( var i = 0; i < times; i++) {
		for ( var j = i * batchStampSize, n = (i + 1) * batchStampSize; j < n&& j < totalCount; j++) {
			subBillIds.push(billIds[j]);
		}
		// 获得BASE64凭证原文
		options["subBillIds"] = JSON.stringify(subBillIds);
		var xmlResult = generalXMLDataBySetManager(options);
	    if(xmlResult.flag==true){  //请求成功
	    	var voucherXml = xmlResult.voucherXml ;
	    	alert("voucherXml:"+voucherXml);
	    }else{ //请求失败
	    	errorInfo = xmlResult.result;
	    	return errorInfo;
	    }
         var signedVoucher = ActiveX.GetVoucherStamp(certId, rgCode, options.svSetYear,options.vtCode,stampInfo, voucherXml);
         alert("stampedVoucher:"+signedVoucher);
		  if (strIsNull(signedVoucher)) {
		     errorInfo = "获得签章报文失败！" + ActiveX.GetLastErr();
		     return errorInfo;
		 }
 
		// 走工作流并保存签名信息
		  options['signedVoucher'] = JSON.stringify(signedVoucher);
		 var dataResult = stampAndDoWorkFlow(options);
			if(dataResult.flag!=true){  //签章失败
				//ip.warnJumpMsg(dataResult.result,0,0,true);
				  errorInfo = dataResult.result;
				return errorInfo;
			} else {  //签章成功
			          //发送
					if(strIsNotNull(options.isSend)&&options.isSend == 1){
						options["operationName"] = EpayMenu.BillName.PAY_VOUCHER+EpayMenu.BillAction.SEND;
						options["advice"] = options["operationName"]+"成功";
						options["actionType"] = PayConstant.WfActionType.NEXT;
						var sendRet ;
						$.ajax({
							url : baseURL + EpayMethod.DO_SEND,
							type : "GET",
							dataType : "json",
							async : false,
							data : options,
							success : function(data) {
								sendRet = data;
							}
						});
						if(sendRet.flag != true){  //发送失败
							  errorInfo = "签章成功,"+sendRet.result;
							return errorInfo;
						} else {
							if(sendRet.result != ""){
								ip.ipInfoJump("签章成功,"+ sendRet.result,"success");
							}
							return "";
						}; 
		                 
		              }else{  //不发送
		            	  if(dataResult.result!="")
		            	  ip.ipInfoJump(dataResult.result,"success");
		            	  return "";
		              }
			}
	}
}




/**
 * 撤销签名
 * 
 * @param options
 */
function EpayCancelSignAction(options) {
	var errorInfo = "";
	//校验
	if(!strIsNotNull(options.vtCode)){
		errorInfo = "vtCode没有配置";
		return errorInfo;
	}
	//获取证书ID
	try {
		var ActiveX = document.getElementById("CTJEstampOcx");
		if (ActiveX) {
			var certId = ActiveX.DlgSelectCertId();
			// 校验cerID
			if (strIsNull(certId)) {
				errorInfo = "UKEY检测异常，请检查是否安装";
				return errorInfo;
			}
 			alert("目前函数返回cerId = " + certId);
			options["certID"] = certId;
 
		} else {
			errorInfo = "get ActiveX failure！";
			return errorInfo;
		}
	} catch (e) {
		errorInfo =e;
		return errorInfo;
	}
	
	var cancelRet ;
	$.ajax({
		url : baseURL + EpayMethod.DO_CANCEL_SIGN,
		type : "GET",
		dataType : "json",
		async : false,
		data : options,
		success : function(data) {
			cancelRet = data;
		}
	});
	
	if(cancelRet.flag!=true){
		  errorInfo = cancelRet.result;
		return errorInfo;
	} else {
		if(cancelRet.result != ""){
			ip.ipInfoJump(cancelRet.result,"success");
		}
		return "";
	}	 
};


/**
 * 撤销签章
 * 
 * @param options
 */
function EpayCancelStampAction(options) {
	var errorInfo = "";
	//校验
	if(strIsNull(options.vtCode)){
		errorInfo = "vtCode没有配置";
		return errorInfo;
	}
	//获取证书ID
	try {
		var ActiveX = document.getElementById("CTJEstampOcx");
		if (ActiveX) {
			var certId = ActiveX.DlgSelectCertId();
			// 校验cerID
			if (strIsNull(certId)) {
				errorInfo = "UKEY检测异常，请检查是否安装";
				return errorInfo;
			}
 			alert("目前函数返回cerId = " + certId);
			options["certID"] = certId;
 
		} else {
			errorInfo = "get ActiveX failure！";
			return errorInfo;
		}
	} catch (e) {
		errorInfo =e;
		return errorInfo;
	}
	var cancelRet ;
	$.ajax({
		url : baseURL + EpayMethod.DO_CANCEL_STAMP,
		type : "GET",
		dataType : "json",
		async : false,
		data : options,
		success : function(data) {
			cancelRet = data;
		}
	});
	
	if(cancelRet.flag != true){
		  errorInfo = cancelRet.result;
		return errorInfo;
	} else {
		if(cancelRet.result != ""){
			ip.ipInfoJump(cancelRet.result,"success");
		}
		return "";
	}	 
};

/**
 * 发送
 * @param options
 * @returns {String}
 */
function EPaySendVoucherAction(options){
	var errorInfo = "";
	//校验
	if(strIsNull(options.vtCode)){
		errorInfo = "vtCode没有配置";
		return errorInfo;
	}
	if(strIsNull(options.cpCode)){
		options["cpCode"]="900";
	}
	
	//TODO  需要校验 License
	//TODO 需要获取cerId
	
	var sendRet ;
	return EPayDoWorkFlowAction(options);
/*	$.ajax({
		url : baseURL + EpayMethod.DO_SEND,
		type : "GET",
		dataType : "json",
		async : false,
		data : options,
		success : function(data) {
			sendRet = data;
		}
	});
	
	if(sendRet.flag != true){
		  errorInfo = sendRet.result;
		return errorInfo;
	} else {
		if(sendRet.result != ""){
			ip.ipInfoJump(sendRet.result,"success");
		}
		return "";
	}; */
}

/**
 * 只走工作流
 * @param options
 * @returns {String}
 */
function EPayDoWorkFlowAction(options){
	var errorInfo;
	$.ajax({
		url : commonURL + "/doWorkFlow.do",
		type : "GET",
		dataType : "json",
		async : false,
		data :  options,
		success : function(data) {
			if(data.flag == true){ //请求成功
				ip.ipInfoJump(data.result, true);
				errorInfo =  "";
			}else{//请求失败
				errorInfo =  data.result;
			}
		}
	});
	return errorInfo;
}

/**
 * 签名并走工作流
 * @param options
 * @returns
 */
function signAndDoWorkFlow(options){
	var dataResult ;
	$.ajax({
		url : baseURL + EpayMethod.DO_ADD_SIGN,
		type : "GET",
		dataType : "json",
		async : false,
		data : options,
		success : function(data) { 
			dataResult = data ;
		}
	});
	return dataResult;
}

/**
 * 签章并走工作流
 * @param options
 * @returns
 */
function stampAndDoWorkFlow(options){
	var dataResult ;
	$.ajax({
		url : baseURL + EpayMethod.DO_ADD_STAMP,
		type : "GET",
		dataType : "json",
		async : false,
		data : options,
		success : function(data) { 
			dataResult = data ;
		}
	});
	return dataResult;
}

/**
 *  退回
 * @param options
 * @returns {String}
 */
function EpayBackAction(options){
	return EPayDoWorkFlowAction(options);
}


//判断字符串是否为不为空 为空返回false 不为空返回true
function strIsNotNull(str) {
	if (str != null && str != undefined && (str + " ").trim().length > 0) {
		return true;
	} else {
		return false;
	}
};

//判断字符串是否为空 为空返回true 不为空返回false
function strIsNull(str) {
	if (str == null || str == undefined || (str + " ").trim().length <= 0) {
		return true;
	} else {
		return false;
	}
};



/**
 * 测试用 如何定义个类 属性和方法
 * 
 * @param color
 * @param door
 * @returns {Car}
 */
function Car(color, door) {
	this.color = color;
	this.doors = door;
	this.arr = new Array("aa", "bb");
}
Car.prototype.showColor = function() {
	alert(this.color);
};
 