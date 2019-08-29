define(['text!pages/planQuery/planQuery.html', 'commonUtil', 'jquery',
	    'es5sham', 'html5', 'calendar',
		'uui', 'tree', 'bootstrap', 'ip', 'ebankConstants', 'datatables.net-bs',
		'datatables.net-select', 'initDataTableUtil' ], function(html,
		commonUtil) {
	var init = function(element, param) {
		// 页面标题
		document.title = ip.getUrlParameter("menuname");
		var viewModel = {
			tokenid : ip.getTokenId(),
		};

		// 查询主单参数
		var mainOptions = ip.getCommonOptions({});
		mainOptions["ele"] = "";
		mainOptions["account_kind"] = "5105";
		// 查询明细参数
		var voucherOptions = ip.getCommonOptions({});
		voucherOptions["account_kind"] = "5105";

		// 初始化页面
		viewModel.initData = function() {
			var pageData = commonUtil.initPageData("buttonArea", "searchArea",
					"", "mainGridArea", "detailContainer", mainOptions,
					voucherOptions, false,
					"/df/f_ebank/planQuery/doQueryBalanceLimit.do",
					"/df/f_ebank/planQuery/doQueryPlanVoucher.do",false);
			viewModel["viewList"] = pageData.viewList;
			for (var n = 0; n < viewModel.viewList.length; n++) {
				var view = viewModel.viewList[n];
				if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY) {
					if (view.orders == '1') {
						viewModel.planQueryViewId = view.viewid;
						// 缀在查询区名称后面的数字
						viewModel.queryViewIdNum = viewModel.planQueryViewId
								.substring(1, 37);
					}
				}
			}
		};

		// 查询
		queryHandler = function() {
			viewModel.getQueryView();
			$("#mainGridArea").DataTable().ajax.reload(null, true);
		}

		viewModel.getQueryView = function() {
			var en = $("#EN-" + viewModel.queryViewIdNum).val();
			var bs = $("#BS-" + viewModel.queryViewIdNum).val();
			var mk = $("#MK-" + viewModel.queryViewIdNum).val();
			ele = [];
			var temp = {};
			if (en != null && en != '') {
				temp["EN"] = en.split(" ")[0];
			} else {
				temp["EN"] = en;
			}
			if (bs != null && bs != '') {
				temp["BS"] = bs.split(" ")[0];
			} else {
				temp["BS"] = bs;
			}
			if (mk != null && mk != '') {
				temp["MK"] = mk.split(" ")[0];
			} else {
				temp["MK"] = mk;
			}
			ele.push(temp);
			mainOptions["ele"] = JSON.stringify(ele);
			mainOptions["account_kind"] = $("#account_kind-" + viewModel.queryViewIdNum).val();
			voucherOptions["account_kind"] = mainOptions["account_kind"];
			mainOptions["finance_code"] = $("#finance_code-" + viewModel.queryViewIdNum).val();
		};

		$(element).html(html);
		viewModel.initData();
	}
	return {
		init : init
	}
});
