require([ 'jquery', 'knockout', 'echarts', 'bootstrap',  'director', 'tree','ip', 'grid','dateZH' ], function($, ko, echarts) {
	//var options = ip.getCommonOptions({});
	var viewModel = {
		data : ko.observable({})
	};
	 // fasp_t_pubmenu表中url参数
	
	var billnos = decodeURI(ip.getUrlParameter("billnos"));
	//查询类型 0 凭证预览 1 凭证查看
	var searchtype = ip.getUrlParameter("searchtype");
	//父菜单
	var parent_menuid =  ip.getUrlParameter("menuid");
	
	var vt_code =  ip.getUrlParameter("vt_code");
	
	var set_year =  ip.getUrlParameter("set_year");
	
	var rg_code =ip.getUrlParameter("rg_code");
	
	var currentNo="";

	
	
	var assp_voucher_url="";
	
	var assp_stamp_url="";
	

	//预览
	
	function getCertId()
	{
		try
		{    
			var ActiveX=document.getElementById("CTJEstampOcx");
			if (ActiveX) 
			{
				var certId = ActiveX.GetCertId();
				alert("目前函数返回ocx路径, 路径= " + certId);
			}
			else
			{
				alert("get ActiveX failure\n");
			}

		}
	  catch(e){}
	}
	function setUrl(assp_voucher_url,assp_stamp_url)
	{
		try
		{    
			var ActiveX = document.getElementById("CTJEstampOcx");
			if (ActiveX) 
			{
				//var ret = ActiveX.SetEvoucherServiceUrl("http://10.10.65.63:9183/realware/services/AsspFinanceService");
				
				var ret = ActiveX.SetEvoucherServiceUrl(assp_voucher_url);
				//alert("返回值 = " + ret);
				//var ret = ActiveX.SetEstampServiceUrl("http://192.168.31.114:8080/realware/services/AsspEStampService");
				if(ret!=0){
					var reg=ActiveX.GetLastErr();
					alert(ret+reg);
				}else{
				//ret = ActiveX.SetEstampServiceUrl("http://10.10.65.63:9183/realware/services/AsspPBankService");
					ret = ActiveX.SetEstampServiceUrl(assp_stamp_url);
				//alert("返回值 = " + ret);
				}
			}
			else
			{
				alert("get ActiveX failure\n");
			}

		}
	  catch(e){}
	}
	function init() {
	    try {
	        var ActiveX = document.getElementById("CTJEstampOcx");
	        if (ActiveX) {
	            var ret = ActiveX.Initialize("111", rg_code, set_year, vt_code,"0",2,1,0);
	            //alert("返回值 = " + ret);
	            if(ret==0){
	           	 //addVoucher();
				}else{
					var reg=ActiveX.GetLastErr();
					alert(reg);
				}
	            //alert("返回值 = " + ret);
	        }
	        else {
	            alert("get ActiveX failure\n");
	        }

	    }
	    catch (e) { }
	}
	viewModel.addVoucherfromServer=function() {
	    try {	  
	    	 var paramMap1 = getEBankConfParam(rg_code,EBankConstant.AsspConstants.ASSP_URL_WEBSERVICE_PARAM);
	    	 var paramMap2 =  getEBankConfParam(rg_code,EBankConstant.AsspConstants.ASSP_URL_ESTAMP_PARAM);  
	    	 assp_voucher_url=paramMap1["value"];
	    	 assp_stamp_url=paramMap2["value"];
	    	 /*alert("凭证库地址"+assp_voucher_url);
	    	 alert("印章地地址"+assp_stamp_url);*/
    		setUrl(assp_voucher_url,assp_stamp_url);
    		init();    			    		
	    	var errorInfo = "";
	    	currentNo="";
		    var ActiveX = document.getElementById("CTJEstampOcx");
		    if (ActiveX) {
		    	var index = billnos.indexOf(";");
		        if(index!=-1){
		        		var vouNo = billnos.split(";");
		        		currentNo=vouNo[0];
		        		for (var i = 0; i < vouNo.length; i++) {
		        			ret = ActiveX.AddVoucherfromServer(vouNo[i]);
		        		}
		        	}else{
		        		ret = ActiveX.AddVoucherfromServer(billnos);
		        		currentNo=billnos;
		        	}
		        	//alert("返回值 = " + ret);  	
		        if(ret!=0){
		        	errorInfo = errorInfo+ActiveX.GetLastErr();
		        	alert("返回值 = " + errorInfo);
		        }		        
		        var ret = ActiveX.SetCurrentVoucher(currentNo);
		        //alert("返回值 = " + ret);
		        ActiveX.ZoomToFit();
		        }
		        else {
		            alert("get ActiveX failure\n");
		        }
 	
	    }
	    catch (e) {alert('错误' + e.message + '发生在' +   e.lineNumber + '行');  }
	};

	viewModel.addVoucher=function() {
	    try {   	    	
	    	var paramMap1 = getEBankConfParam(rg_code,EBankConstant.AsspConstants.ASSP_URL_WEBSERVICE_PARAM);
	    	 var paramMap2 =  getEBankConfParam(rg_code,EBankConstant.AsspConstants.ASSP_URL_ESTAMP_PARAM);  
	    	 assp_voucher_url=paramMap1["value"];
	    	 assp_stamp_url=paramMap2["value"];
    		setUrl(assp_voucher_url,assp_stamp_url);
    		init();    			    		
	    	var errorInfo = "";
	    	var currentNo="";
	    	var options = {};
		    var ActiveX = document.getElementById("CTJEstampOcx");
		    if (ActiveX) {
		    	var index = billnos.indexOf(";");
		    	options["vtCode"]= vt_code;
    			options["rgCode"]= rg_code;
    			options["setYear"]= set_year;
		        if(index!=-1){
		        		var vouNo = billnos.split(";");
		        		currentNo=vouNo[0];
		        		
		        		for (var i = 0; i < vouNo.length; i++) {
		        			var billIds =new Array();
		        			billIds.push(vouNo[i]);
		        			options["subBillIds"]=billIds;
		        			var xmlResult = generalXMLDataBySetManager(options);
		        		    if(xmlResult.flag==true){  //请求成功
		        		    	var voucherXml = xmlResult.voucherXml ;
		        		    }else{ //请求失败
		        		    	errorInfo = xmlResult.result;
		        		    	return errorInfo;
		        		    }
		        			ret = ActiveX.AddVoucher(vouNo[i],xml);
		        		}
		        	}else{
		        		var billIds =new Array();
		        		temp = {}
		        		temp["bill_no"]= billnos;
	        			billIds.push(temp);
	        			options["subBillIds"]=JSON.stringify(billIds);
		        		var xml = generalXMLDataBySetManager(options);
		        		 xml=xml.voucherXml;
		        		ret = ActiveX.AddVoucher(billnos,xml);
		        		currentNo=billnos;
		        	}
		        	//alert("返回值 = " + ret);  	
/*		       if(ret!=0){
		        	errorInfo = errorInfo+ActiveX.GetLastErr();
		        	alert("返回值 = " + errorInfo);
		        }	 */       
		        var ret = ActiveX.SetCurrentVoucher(currentNo);
		        //alert("返回值 = " + ret);
		        ActiveX.ZoomToFit();
		        }
		        else {
		            alert("get ActiveX failure\n");
		        }
	       
		       // var no = "9991000110";
	    }
	    catch (e) {alert('错误' + e.message + '发生在' +   e.lineNumber + '行');  }
	};

     viewModel.setCurrentVoucher=function() {
	    try {
	    	setUrl();
	    	init();
	    	var errorInfo = "";
	        var ActiveX = document.getElementById("CTJEstampOcx");
	        if (ActiveX) {
	        	ret = ActiveX.AddVoucherfromServer(currentNo);
	        	alert("返回值 = " + ret);  	
	        if(ret!=0){
	        	errorInfo = errorInfo+ActiveX.GetLastErr();
	        	alert("返回值 = " + errorInfo);
	        }
	        var ret = ActiveX.SetCurrentVoucher(currentNo);
	        alert("返回值 = " + ret);
	        ActiveX.ZoomToFit();
	        }
	        else {
	            alert("get ActiveX failure\n");
	        }

	    }
	    catch (e) { }
	};
	function Refresh() {
	    try {
	        var ActiveX = document.getElementById("CTJEstampOcx");
	        if (ActiveX) {
	            var ret = ActiveX.Refresh(currentNo);
	            alert("返回值 = " + ret);
	        }
	        else {
	            alert("get ActiveX failure\n");
	        }

	    }
	    catch (e) { }
	}


	pageup=function () {
	    try { 
	        var ActiveX = document.getElementById("CTJEstampOcx");
	        if (ActiveX) {
	            var ret = ActiveX.PageUp();
	            if(ret==0){
					
				}else{
					var reg=ActiveX.GetLastErr();
					alert(reg);
					return;
				}
	        }
	        else {
	            alert("get ActiveX failure\n");
	        }

	    }
	    catch (e) { }
	};

	pageDown=function () {
	    try {
  
	        var ActiveX = document.getElementById("CTJEstampOcx");
	        if (ActiveX) {
	            var ret = ActiveX.PageDown();
	            if(ret==0){
					
				}else{
					var reg=ActiveX.GetLastErr();
					alert(reg);
					return;
				}
	        }
	        else {
	            alert("get ActiveX failure\n");
	        }

	    }
	    catch (e) { }
	};
	printAllVoucher=function ()
	{
			try{
				setUrl(assp_voucher_url,assp_stamp_url);
	    		init();  
					var ActiveX = document.getElementById("CTJEstampOcx");
					if (ActiveX) {
	            var ret = ActiveX.PrintAllVoucher("111",rg_code,set_year,vt_code,0,currentNo); 
	            if(ret==0){
					
				}else{
					var reg=ActiveX.GetLastErr();
					alert(reg);
					return;
				}
	        }
	        else {
	            alert("get ActiveX failure\n");
		    
	        }

	    }
	    catch (e) { }
	};

	function SignStamp()
	{
	    try {
		    	var stampNo = "<?xml version=\"1.0\" encoding=\"GBK\"?><Root><Stamp No=\"cz_jb\">61440ec56b4344fa8eb098c015560408</Stamp></Root>";
			    var voucher = "<?xml version=\"1.0\" encoding=\"GBK\"?><Root><VoucherCount>1</VoucherCount><VoucherBody No=\"jjj111\"><Voucher>PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iR0JLIj8+DQo8Vm91Y2hlcj4NCgk8SWQ+NzU3PC9JZD4NCgk8QWRtRGl2Q29kZT41MDAwMDA8L0FkbURpdkNvZGU+DQoJPFN0WWVhcj4yMDEyPC9TdFllYXI+DQoJPFZvdWNoZXJUeXBlQ29kZT4xMTAxPC9Wb3VjaGVyVHlwZUNvZGU+DQoJPFZvdWNoZXJObz4yMDEyMTEwMTAwNDwvVm91Y2hlck5vPg0KCTxDcmVhdGVEYXRlPjIwMTItMDktMTkgMTY6Mzc6MDc8L0NyZWF0ZURhdGU+DQoJPEJndFR5cGVDb2RlPjAwMTwvQmd0VHlwZUNvZGU+DQoJPEJndFR5cGVOYW1lPrWxxOrWuLHqPC9CZ3RUeXBlTmFtZT4NCgk8RnVuZFR5cGVDb2RlPjE8L0Z1bmRUeXBlQ29kZT4NCgk8RnVuZFR5cGVOYW1lPtSky+PE2jwvRnVuZFR5cGVOYW1lPg0KCTxQYXlCYW5rQ29kZT4wMDE8L1BheUJhbmtDb2RlPg0KCTxQYXlCYW5rTmFtZT69qNDQ1tjH7Nan0NA8L1BheUJhbmtOYW1lPg0KCTxQYXlUeXBlQ29kZT4xMjwvUGF5VHlwZUNvZGU+DQoJPFBheVR5cGVOYW1lPrLG1f7K2sio1qe4tjwvUGF5VHlwZU5hbWU+DQoJPFNldE1vbnRoPjk8L1NldE1vbnRoPg0KCTxQbGFuQW10PjMwMDQuMDA8L1BsYW5BbXQ+DQoJPFJlbWFyaz48L1JlbWFyaz4NCgk8RGV0YWlsTGlzdD4NCgkJPERldGFpbD4NCgkJCTxJZD43NTY8L0lkPg0KCQkJPEFkbURpdkNvZGU+NTAwMDAwPC9BZG1EaXZDb2RlPg0KCQkJPFN0WWVhcj4yMDEyPC9TdFllYXI+DQoJCQk8Vm91Y2hlck5vPjIwMTI5MTAxPC9Wb3VjaGVyTm8+DQoJCQk8QWdlbnRCaWxsSWQ+NzU3PC9BZ2VudEJpbGxJZD4NCgkJCTxQcm9DYXRDb2RlPjQ8L1Byb0NhdENvZGU+DQoJCQk8UHJvQ2F0TmFtZT65q9PD1qez9jwvUHJvQ2F0TmFtZT4NCgkJCTxCZ3RUeXBlQ29kZT4wMDEwMDE8L0JndFR5cGVDb2RlPg0KCQkJPEJndFR5cGVOYW1lPrWxxOrUpMvjPC9CZ3RUeXBlTmFtZT4NCgkJCTxFeHBGdW5jQ29kZT4yMDEwMTA0PC9FeHBGdW5jQ29kZT4NCgkJCTxFeHBGdW5jTmFtZT7Iy7Tzu+HS6TwvRXhwRnVuY05hbWU+DQoJCQk8QWdlbmN5Q29kZT45OTk8L0FnZW5jeUNvZGU+DQoJCQk8QWdlbmN5TmFtZT7W2MfsytDIy7Tzu/q52DwvQWdlbmN5TmFtZT4NCgkJCTxGdW5kVHlwZUNvZGU+MTE8L0Z1bmRUeXBlQ29kZT4NCgkJCTxGdW5kVHlwZU5hbWU+0ruw49Sky+M8L0Z1bmRUeXBlTmFtZT4NCgkJCTxQbGFuQW10PjMwMDAuMDA8L1BsYW5BbXQ+DQoJCQk8UGxhbkFkakNvZGU+MDAxPC9QbGFuQWRqQ29kZT4NCgkJCTxQbGFuQWRqTmFtZT6199T2vMa7rjwvUGxhbkFkak5hbWU+DQoJCQk8UmVtYXJrPjwvUmVtYXJrPg0KCQkJPFNldE1vbnRoPjk8L1NldE1vbnRoPg0KCQk8L0RldGFpbD4NCgk8L0RldGFpbExpc3Q+DQo8L1ZvdWNoZXI+</Voucher></VoucherBody></Root>";
	        var ActiveX = document.getElementById("CTJEstampOcx");
	        if (ActiveX) 
	        {
	        		var ret = ActiveX.GetVoucherStamp("1","340000",2013,"1101",stampNo,voucher); 
	            alert("返回值 = " + ret);
	            if(ret == "")
	        		{
	        			var ret1 = ActiveX.GetLastErr();
	        			alert("error = " + ret1);
	        		}
	        		document.getElementById("id").value=ret;
	        }
	        else {
	            alert("get ActiveX failure\n");
		    
	        }
	    }
	    catch (e) { }
	}


	$(function() {
		ko.cleanNode($('body')[0]);
		/*app = u.createApp({
			el : 'body',
			model : viewModel
		});*/
		
		if(searchtype==0)
			 viewModel.addVoucher();
		else if(searchtype==1){
			 viewModel.addVoucherfromServer();
		}

	});
});



