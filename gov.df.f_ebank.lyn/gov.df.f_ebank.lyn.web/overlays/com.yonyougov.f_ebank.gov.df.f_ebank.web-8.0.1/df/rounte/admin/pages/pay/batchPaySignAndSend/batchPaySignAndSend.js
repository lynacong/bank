define(['text!pages/pay/batchPaySignAndSend/batchPaySignAndSend.html','commonUtil',
    'jquery','es5sham','html5','calendar','bootstrap','ip','ebankConstants',
    'datatables.net-bs','datatables.net-select',
    'initDataTableUtil' ],function(html,commonUtil){
	var init =function(element,param){
		//页面标题
		document.title=ip.getUrlParameter("menuname");
		var viewModel = {
			tokenid : ip.getTokenId()
		};
		var baseURL=EBankConstant.Ctx + "pay/batchPay";
		//查询主单参数
		var mainOptions = ip.getCommonOptions({});
		//查询明细参数
		var voucherOptions = ip.getCommonOptions({});
		//初始化页面
		viewModel.initData = function() {
			var pageData = commonUtil.initPageData("buttonArea","searchArea","statusArea","mainGridArea","detailContainer",
					mainOptions,voucherOptions,false,baseURL+"/loadPayCardBillData.do",baseURL+"/loadPayCardDetailData.do");
			viewModel["viewList"] = pageData.viewList;
		};
		
		$(element).html(html);
		viewModel.initData();	
	};
		
	return {
        init:init
    };
});	