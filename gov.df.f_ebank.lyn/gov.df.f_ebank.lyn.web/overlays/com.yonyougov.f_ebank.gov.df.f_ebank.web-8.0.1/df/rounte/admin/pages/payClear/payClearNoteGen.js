define(['text!pages/payClear/payClearNoteGen.html','commonUtil',
    'jquery', 'es5sham','html5','calendar','uui','tree',
	'bootstrap','ip','ebankConstants','datatables.net-bs', 
    'datatables.net-select',
    'initDataTableUtil'],function(html,commonUtil){
	var init =function(element,param){
		//页面标题
		document.title=ip.getUrlParameter("menuname");
		var viewModel = {
				tokenid : ip.getTokenId(),
			};
			
		var requesting=false;
		//查询主单参数
		var mainOptions = ip.getCommonOptions({});
		//查询明细参数
		var voucherOptions = ip.getCommonOptions({});
		
		//初始化页面
		viewModel.initData = function() {
			var pageData= commonUtil.initPageData("buttonArea","searchArea","statusArea","mainGridArea","detailContainer",
					      mainOptions,voucherOptions,false,EBankConstant.Ctx+"pay/payClear/loadPayClearNoteData.do",
						  EBankConstant.Ctx+"pay/payClear/loadPayClearNoteDetailData.do");		
		};
		$(element).html(html);	
		viewModel.initData();
	};			
	return {
		'template':html,
 	
        init:init
    };
});