require([ 'jquery','knockout','bootstrap', 'uui','director', 'ip'], function($,ko) {
	
	var viewModel = {};
	var options = ip.getCommonOptions({});
	var planId = "";
	
	viewModel.initData = function () {
		var _url = window.location.href;
		var billId = getUrlParam("billId");
		var tableData ="";
		options["billId"] = billId;
        $.ajax({
            url : "/df/print/getPrintData.do",
            type : "GET",
            dataType : "json",
            async : false,
            data : options,
//            beforeSend: ip.loading(true),
            success : function(data) {
            	tableData = data.printData;
//            	planId = data.planId;
            },
//            error : function(data) {
//                alert("数据加载失败，请刷新后重试！");
//            },
//            complete: ip.loading(false)
        });
		//TODO 获取数据
		
		$("#printDiv").html(tableData);
	};
	//打印内容
	printContent = function (){
//		$.ajax({
//            url : "/df/gp/print/setPrintFlag.do",
//            type : "GET",
//            dataType : "json",
//            async : false,
//            data : options,
//            beforeSend: ip.loading(true),
//            success : function(data) {
//            	if(data.flag == false) {
//            		alert("操作出现问题，请刷新后重试！");
//            	}
//            },
//            error : function(data) {
//                alert("操作出现问题，请刷新后重试！");
//            },
//        });
		 try{
             print.portrait   =  false    ;//横向打印 
         }catch(e){
             //alert("不支持此方法");
         }
		var body = window.document.body.innerHTML;
		var prnHtml = document.getElementById("printDiv").innerHTML;
		window.document.body.innerHTML = prnHtml;
//		window.print();
		if(getExplorer() == "IE"){
		    pagesetup_null();
		   }
		    window.print();
		window.document.body.innerHTML = body;
	};
	 //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
    
    
   
    function pagesetup_null(){                
        var hkey_root,hkey_path,hkey_key;
        hkey_root="HKEY_CURRENT_USER";
        hkey_path="\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
        try{
            var RegWsh = new ActiveXObject("WScript.Shell");
            hkey_key="header";
            RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"");
            hkey_key="footer";
            RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"");
        }catch(e){}
    }

    function getExplorer() {
        var explorer = window.navigator.userAgent ;
        //ie 
        if (explorer.indexOf("MSIE") >= 0) {
            return "IE";
        }
        //firefox 
        else if (explorer.indexOf("Firefox") >= 0) {
            return "Firefox";
        }
        //Chrome
        else if(explorer.indexOf("Chrome") >= 0){
            return "Chrome";
        }
        //Opera
        else if(explorer.indexOf("Opera") >= 0){
            return "Opera";
        }
        //Safari
        else if(explorer.indexOf("Safari") >= 0){
            return "Safari";
        }
    }
	
    
    
	$(function() {
		$(document).attr("title",options["svMenuName"]);//页签显示菜单名称(多个菜单用到一个html)
		app = u.createApp({
			el : 'body',
			model : viewModel
		});
		
		viewModel.initData();
	
	});
});