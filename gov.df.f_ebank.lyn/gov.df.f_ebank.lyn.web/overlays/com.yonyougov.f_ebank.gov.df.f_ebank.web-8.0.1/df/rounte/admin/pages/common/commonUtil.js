// 页面共用工具代码
define(['jquery', 'knockout', 'text!pages/common/template/detailModal.html',
	    'text!pages/common/template/onlyDetailModal.html',
		'text!pages/common/template/onlyLogModal.html',
		'text!pages/common/template/bankNoInputModal.html',
		'text!pages/common/template/addBankNoModal.html',
		'text!pages/common/template/addTradeNoModal.html',
		'text!pages/common/template/ocxObj.html',
		'ebankConstants','ip'],function($, ko, detailHtml,onlyDetailHtml,onlyLogHtml,
				bankNoInputHtml,addBankNoHtml,addTradeHtml,ocxObj) {
		var viewModel = {
				tokenid : ip.getTokenId(),
				inputPaydata : [],
				needPaydata : [],
				inputPayDataIndex : 0,
				oldBankleitzahl : "",
				prevStatus : "",
				addTradeNoType : "",
				logViewDetail : []
		};
		// 查询日志表格视图信息
		$.ajax({
			url: "/df/view/getViewDetail.do?tokenid=" + viewModel.tokenid,
			type: "GET",
			dataType: "json",
			async: false,
			data: {
				viewid: "{" + EBankConstant.ViewId.LOG_VIEW_ID + "}"
			},
			success: function(data) {
				viewModel.logViewDetail = data.viewDetail;
			}
		});
		var requesting = false;	
		/*
		 * 初始化通用页面：操作按钮，状态，表格，主单双击出明细（适用于切换状态时，不切换表的情况）
		 * btnAreaId	按钮区id 
		 * searchAreaId	查询区id 
		 * statusAreaId	状态下拉框id
		 * mainTableId	主单表格id
		 * detailModalArea	明细模态框
		 * mainOptions	主单查询参数
		 * voucherOptions	明细查询参数
		 * hasYearFlag	查询区是否显示年度 true：显示 false：不显示
		 * mainUrl 主单数据查询接口（有个性化传此参数，否则默认"/df/f_ebank/common/query/doFind.do"）
		 * detailUrl 明细数据查询接口 （有个性化传此参数，否则默认"/df/f_ebank/common/query/doFind.do"）
		 * logFlag 日志标识  默认展示日志 传false不展示
		 */
		var initPageData = function(btnAreaId, searchAreaId, statusAreaId, mainTableId, detailModalArea,
				mainOptions, voucherOptions,hasYearFlag,mainUrl,detailUrl,logFlag) {
			viewModel.detailModalArea = detailModalArea;
			viewModel.mainTableId = mainTableId;
			viewModel.statusAreaId = statusAreaId;
			mainOptions.gridParam = ip.getTableSetting();
			if(logFlag == undefined){
				logFlag = true;
			}
			viewModel.logFlag = logFlag;
			var pageDate;
			// 获取配置信息
			$.ajax({
				url : "/df/init/initMsg.do",
				type : "GET",
				dataType : "json",
				async : false,
				data : mainOptions,
				success : function(data) {
					viewModel.btnlist = data.btnlist;// 按钮信息
					viewModel.viewList = data.viewlist;// 视图信息
					// 初始化操作按钮
					if(!statusAreaId){
						initButtons(data.statuslist,data.btnlist,btnAreaId);
					}else{
						initStatusBar(data.statuslist,data.btnlist,btnAreaId,statusAreaId,queryHandler);
					}
					var status = $("#" + statusAreaId).val();
					for (var n = 0; n < viewModel.viewList.length; n++) {
						var view = viewModel.viewList[n];
						if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {// 列表视图
							if (view.orders == '1') {// 主单列表
								viewModel.mainViewDetail = view.viewDetail;
								mainOptions["tableViewId"] = view.viewid;
								mainOptions["status"] = status;
								viewModel.mainOptions = mainOptions;// 用于通用查询queryHandler
								mainUrl = mainUrl || "/df/f_ebank/common/query/doFind.do";
							} else if (view.orders == '2') {// 明细列表
								voucherOptions["tableViewId"] = view.viewid;
								viewModel.detailViewDetail = view.viewDetail;
								viewModel.voucherOptions = voucherOptions;
							}
						} else if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY) {// 查询视图
							if(view.orders == '1'){
								viewModel.queryViewId = view.viewid;
								viewModel.searchViewModel = ip.initArea(view.viewDetail,"search",
										viewModel.queryViewId.substring(1,37),searchAreaId);
							}
						}
					}
					mainOptions["queryViewId"] = viewModel.queryViewId;
					// 页面固定部分高度:按钮（29px）+标题和状态（36px）+表头表尾（81px）+查询区margin（12px）=158px
					mainOptions["scrollY"] = $(".wrapper").height() - 158 -
							$(".common-border").outerHeight()  + "px";
					viewModel.mainTable = initDataTables(mainTableId,mainUrl,
							mainOptions,viewModel.mainViewDetail);
					// 初始化查询区财政机构
					initFinanceCode(viewModel.queryViewId.substring(1, 37), mainOptions);
					// 查询区有年度的情况，初始化年度
					if(hasYearFlag){
						getEnabledYear(viewModel.queryViewId.substring(1, 37));
					}
					var menuBtnWidth = $(".mainLabel").innerWidth();
					$(".button-fixed").css("width", menuBtnWidth);
					
					// 双击主单弹出明细
					$("body").on('dblclick','#' + mainTableId + ' tr',function() {
						var curRow = $('#' + mainTableId).DataTable().row($(this));
						var rowIndex = curRow.index();
						var dataSrc = curRow.data();
						if (dataSrc == undefined) {
							return;
						}
						if(rowIndex == 0){
							return;
						}
						// voucherOptions不存在，表示不查询明细,只显示日志信息
						if(!voucherOptions){
							if(logFlag){
								$("#" + detailModalArea).html(onlyLogHtml);
								$("#logModal").modal("show");
							}
						}else{
							if(logFlag){
								$("#" + detailModalArea).html(detailHtml);
								$("#detailModal").modal("show");
								voucherOptions["scrollY"] = $(".modal-body").innerHeight()*0.67 + "px";
							}else{
								$("#" + detailModalArea).html(onlyDetailHtml);
								$("#onlyDetailModal").modal("show");
								voucherOptions["scrollY"] = $(".modal-body").innerHeight()*0.76 + "px";
							}
							voucherOptions.gridParam = ip.getTableSetting();
							// 通用查明细使用id
							voucherOptions["id"] = dataSrc.id;
							// 直接授权公务卡还款签章发送、直接授权批量支付签章发送使用bill_no查明细
							voucherOptions["bill_no"] = dataSrc.bill_no;
							// 额度查询使用sum_id查明细
							voucherOptions["sum_id"] = dataSrc.sum_id;
							voucherOptions["selectflag"] = false;
							voucherOptions["finance_code"] = dataSrc.finance_code;
							detailUrl = detailUrl || "/df/f_ebank/common/query/doFind.do";
							initDataTables("detailGridArea",detailUrl, voucherOptions,viewModel.detailViewDetail);
						}
						if(logFlag){
							// 日志列表查询
							initLogList();
							getLogListByDetail(dataSrc);
						}
					});
					// 返回viewList信息，用于其他录入视图的初始化
					pageDate = {
						"viewList" : viewModel.viewList,
						"searchViewModel" : viewModel.searchViewModel
					};
				}
			});
			return pageDate;
		}
		/*
		 * 额度到账通知书生成、直接支付入账通知书生成菜单使用
		 * 未生成状态显示明细列表
		 * 已生成状态显示入账通知书或额度到账通知书表格，双击查看明细
		 */
		var initDetailGridPage = function(btnAreaId, searchAreaId, statusAreaId, mainTableId, detailModalArea,
				mainOptions, voucherOptions,hasYearFlag,mainUrl,detailUrl,logFlag) {
			viewModel.mainTableId = mainTableId;
			viewModel.statusAreaId = statusAreaId;
			viewModel.detailModalArea = detailModalArea;
			viewModel.searchAreaId = searchAreaId;
			mainOptions.gridParam = ip.getTableSetting();
			voucherOptions.gridParam = ip.getTableSetting();
			if(logFlag == undefined){
				logFlag = true;
			};
			var pageDate;
			// 获取配置信息
			$.ajax({
				url : "/df/init/initMsg.do",
				type : "GET",
				dataType : "json",
				async : false,
				data : mainOptions,
				success : function(data) {
					viewModel.btnlist = data.btnlist;// 按钮信息
					viewModel.viewList = data.viewlist;// 视图信息
					// 初始化操作按钮
					initStatusBar(data.statuslist,data.btnlist,btnAreaId,statusAreaId,detailPageListener);
					
					var status = $("#" + statusAreaId).val();
					for (var n = 0; n < viewModel.viewList.length; n++) {
						var view = viewModel.viewList[n];
						if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {// 列表视图
							if (view.orders == '1') {// 主单列表
								viewModel.mainViewDetail = view.viewDetail;
								mainOptions["tableViewId"] = view.viewid;
								mainOptions["status"] = status;
								viewModel.mainOptions = mainOptions;// 用于通用查询queryHandler
							} else if (view.orders == '2') {// 明细列表
								viewModel.detailViewDetail = view.viewDetail;
								voucherOptions["tableViewId"] = view.viewid;
								voucherOptions["status"] = status;
								viewModel.voucherOptions = voucherOptions;// 用于通用查询queryHandler
							}
						} else if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY) {// 查询视图
							if(view.orders == '1'){// 主表显示明细情况下的查询视图
								viewModel.queryDetailViewId = view.viewid;
								viewModel.queryViewDetail = view.viewDetail;
								viewModel.searchDetailViewModel = ip.initArea(view.viewDetail,"search",
										viewModel.queryDetailViewId.substring(1,37),searchAreaId);
							}else if (view.orders == '2') {// 主表显示通知书情况下的查询视图
								viewModel.queryViewId = view.viewid;
								viewModel.queryViewMain = view.viewDetail;
							}
						}
					}
					detailUrl = detailUrl || "/df/f_ebank/common/query/doFind.do";
					voucherOptions["set_month"] = $("#set_month"+viewModel.queryDetailViewId.substring(1, 37)).val();
					// 页面固定部分高度:按钮（29px）+标题和状态（36px）+表头表尾（81px）+查询区margin（12px）=158px
					voucherOptions["scrollY"] = $(".wrapper").height() - 158 -
						$(".common-border").outerHeight()  + "px";
					// 初始化主表是明细表格
					initDataTables(mainTableId,detailUrl,voucherOptions,viewModel.detailViewDetail);
					// 初始化查询区财政机构
					initFinanceCode(viewModel.queryDetailViewId.substring(1, 37), voucherOptions);
					// 初始化状态保存
					viewModel.prevStatus = status;
				
					$("body").on('dblclick','#' + mainTableId+' tr',function() {
						var statusCode = $("#" + statusAreaId).val();
						var curRow = $('#' + mainTableId).DataTable().row($(this));
						var rowIndex = curRow.index();
						var dataSrc = curRow.data();
						if (dataSrc == undefined) {
							return;
						}
						if(rowIndex == 0){
							return;
						}
						if(statusCode == EBankConstant.WfStatus.TODO_001){// 未生成状态显示明细，所以只查看日志
							if(logFlag){
								$("#" + detailModalArea).html(onlyLogHtml);
								$("#logModal").modal("show");
							}
						}else if(statusCode == EBankConstant.WfStatus.AUDITED_002){// 已生成状态查看明细+日志
							if(logFlag){
								$("#" + detailModalArea).html(detailHtml);
								$("#detailModal").modal("show");
							}else{
								$("#" + detailModalArea).html(onlyDetailHtml);
								$("#onlyDetailModal").modal("show");
							}
							viewModel.voucherOptions["id"] = dataSrc.id;
							viewModel.voucherOptions["selectflag"] = false;
							viewModel.voucherOptions["isWorkFlowRelated"] = false;
							viewModel.voucherOptions["finance_code"] = dataSrc.finance_code;
							viewModel.voucherOptions["scrollY"] = $(".modal-body").innerHeight()*0.67 + "px";
							initDataTables("detailGridArea","/df/f_ebank/common/query/doFind.do",
									viewModel.voucherOptions,viewModel.detailViewDetail);
						}
						// 拼装查询日志需要的参数，初始化日志表格
						if(logFlag){
							// 日志列表初始化
							initLogList();
							// 日志列表查询
							if(statusCode == EBankConstant.WfStatus.TODO_001){
								viewModel.logOptions["id"] = dataSrc.id;
								viewModel.logOptions["finance_code"] = dataSrc.finance_code;
								viewModel.logOptions["set_year"] = dataSrc.set_year ;
								viewModel.logOptions["vt_code"] = ip.getUrlParameter("vt_code");
								viewModel.logOptions["status_code"] = $("#" + viewModel.statusAreaId).val();
								viewModel.logOptions["loadDataFlag"] = true;
								viewModel.logViewModel.ajax.reload(null, true);
							}else if(statusCode == EBankConstant.WfStatus.AUDITED_002){
								getLogListByDetail(dataSrc);
							}
						}
					});
					
					var menuBtnWidth = $(".mainLabel").innerWidth();
					$(".button-fixed").css("width", menuBtnWidth);
					// 返回viewList信息，用于其他录入视图的初始化
					pageDate = {
						"viewList" : viewModel.viewList
					};
				}
			});
			return pageDate;
		};
		/* 
		 * 未生成状态下显示明细表、已生成状态下显示主单的情况
		 * 切换状态时触发的函数
		 * 不同状态显示不同的查询区
		 */
		var detailPageListener = function(statusCode){
			// 页面固定部分高度:按钮（29px）+标题和状态（36px）+表头表尾（81px）+查询区margin（12px）=158px
			var tableHeight = $(".wrapper").height() - 158 -
				$(".common-border").outerHeight()  + "px";
			$('#' + viewModel.mainTableId + '_wrapper').remove();
			$(".mainTable").append('<table id="' + viewModel.mainTableId + 
					'" class="table-striped table nowrap table-bordered table-hover table-condensed" style="width:100%"></table>');
			if(statusCode == EBankConstant.WfStatus.TODO_001){
				if(viewModel.prevStatus != statusCode){
					$("#" + viewModel.searchAreaId).html("");
					viewModel.searchDetailViewModel = ip.initArea(viewModel.queryViewDetail ,"search",
							viewModel.queryDetailViewId.substring(1,37),viewModel.searchAreaId);
					initFinanceCode(viewModel.queryDetailViewId.substring(1, 37), viewModel.voucherOptions);
				}
				var queryDetailViewId = viewModel.queryDetailViewId.substring(1, 37);
				var searchCondition = ip.getAreaData(viewModel.searchDetailViewModel);
				// 查询条件是否合法 true：合法，false：不合法
				var conditionFlag = searchCondition.conditionFlag;
				if (conditionFlag) {
					viewModel.voucherOptions["isWorkFlowRelated"] = true;
					viewModel.voucherOptions["condition"] = '1=1 ';
					viewModel.voucherOptions["condition"] += searchCondition.condition;
					viewModel.voucherOptions["status"] = statusCode;
					viewModel.voucherOptions["selectflag"] = true;
					viewModel.voucherOptions["finance_code"] = $("#finance_code-" + queryDetailViewId) .val();
					viewModel.voucherOptions["id"] = null;
					viewModel.voucherOptions["scrollY"] = tableHeight;
					initDataTables(viewModel.mainTableId,"/df/f_ebank/common/query/doFind.do",
							viewModel.voucherOptions,viewModel.detailViewDetail);
				} 
			}else if(statusCode == EBankConstant.WfStatus.AUDITED_002){
				if(viewModel.prevStatus != statusCode){
					$("#" + viewModel.searchAreaId).html("");
					viewModel.searchViewModel = ip.initArea(viewModel.queryViewMain ,"search",
							viewModel.queryViewId.substring(1,37),viewModel.searchAreaId);
					initFinanceCode(viewModel.queryViewId.substring(1, 37), viewModel.mainOptions);
				}
				
				var queryViewId = viewModel.queryViewId.substring(1, 37);
				viewModel.mainOptions["queryViewId"] = queryViewId;
				var searchCondition = ip.getAreaData(viewModel.searchViewModel);
				// 查询条件是否合法 true：合法，false：不合法
				var conditionFlag = searchCondition.conditionFlag;
				if (conditionFlag) {
					viewModel.mainOptions["condition"] = '1=1 ';
					viewModel.mainOptions["condition"] += searchCondition.condition;
					viewModel.mainOptions["status"] = statusCode;
					viewModel.mainOptions["scrollY"] = tableHeight;
					viewModel.mainOptions["finance_code"] = $("#finance_code-" + queryViewId) .val();
					initDataTables(viewModel.mainTableId,"/df/f_ebank/common/query/doFind.do",
							viewModel.mainOptions,viewModel.mainViewDetail);
				}
			}
			viewModel.prevStatus = statusCode;// 暂存上一次的状态
		};
		/*
		 * 初始化双主表的页面，授权日报生成，划款单申请生成菜单
		 * 未生成、被退回状态显示一个主表，双击查看明细
		 * 已生成状态显示另一个主表，双击查看明细 明细是一个明细
		 */
		var initDoubleMainListPage = function(btnAreaId, searchAreaId, statusAreaId, mainTableId, detailModalArea,
				mainOptions, mainDoneOptions, voucherOptions,hasYearFlag,mainUrl,detailUrl,logFlag){
			viewModel.mainTableId = mainTableId;
			viewModel.statusAreaId = statusAreaId;
			viewModel.detailModalArea = detailModalArea;
			mainOptions.gridParam = ip.getTableSetting();
			mainDoneOptions.gridParam = ip.getTableSetting();
			voucherOptions.gridParam = ip.getTableSetting();
			if(logFlag == undefined){
				logFlag = true;
			}
			$.ajax({
				url : "/df/init/initMsg.do",
				type : "GET",
				dataType : "json",
				async : true,
				data : mainOptions,
				success : function(data) {
					viewModel.btnlist = data.btnlist;// 按钮信息
					viewModel.viewList = data.viewlist;// 视图信息
					// 初始化按钮和状态
					initStatusBar(data.statuslist,data.btnlist,btnAreaId,statusAreaId,doubleMainListener);
					var status = $("#" + statusAreaId).val();
					for ( var n = 0; n < viewModel.viewList.length; n++) {
						var view = viewModel.viewList[n];
						if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {// 列表视图
							if (view.orders == '1') {
								viewModel.mainViewId = view.viewid;
								viewModel.mainViewDetail = view.viewDetail;
								mainOptions["tableViewId"] = view.viewid;
								mainOptions["queryViewId"] = viewModel.queryViewId;
								mainOptions["status"] = status;
							} else if (view.orders == '2') {
								viewModel.detailViewId = view.viewid;
								viewModel.detailViewDetail = view.viewDetail;
								voucherOptions["tableViewId"] = view.viewid;
							}else if (view.orders == '3') {
								viewModel.mainDoneViewId=view.viewid;
								viewModel.mainDoneViewDetail = view.viewDetail;
								mainDoneOptions["tableViewId"] = view.viewid;
								mainDoneOptions["queryViewId"] = viewModel.queryViewId;
							}
						}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){
							if (view.orders == '1'){
								viewModel.queryViewId = view.viewid;
								viewModel.searchViewModel = ip.initArea(view.viewDetail,"search",
										viewModel.queryViewId.substring(1,37),searchAreaId);
							}
						}
					}
					// 页面固定部分高度:按钮（29px）+标题和状态（36px）+表头表尾（81px）+查询区margin（12px）=158px
					var tableHeight = $(".wrapper").height() - 158 -
						$(".common-border").outerHeight()  + "px";
                    mainOptions["scrollY"] = tableHeight;
                    mainDoneOptions["scrollY"] = tableHeight;
					viewModel.mainOptions = mainOptions;
					viewModel.mainDoneOptions = mainDoneOptions;
					viewModel.voucherOptions = voucherOptions;// 暂存备用
					viewModel.mainUrl = mainUrl || "/df/f_ebank/common/query/doFind.do";
					initDataTables(mainTableId,viewModel.mainUrl,mainOptions,viewModel.mainViewDetail);
					// 初始化状态保存
					viewModel.prevStatus = status;
					// 初始化查询区财政机构
					initFinanceCode(viewModel.queryViewId.substring(1, 37), voucherOptions);
					// 双击主单弹出明细
					$("body").on('dblclick','#' + mainTableId +' tr',function() {
						if(logFlag){
							$("#" + detailModalArea).html(detailHtml);
							$("#detailModal").modal("show");
						}else{
							$("#" + detailModalArea).html(onlyDetailHtml);
							$("#onlyDetailModal").modal("show");
						}
						
						var curRow = $('#' + mainTableId).DataTable().row($(this));
						var rowIndex = curRow.index();
						var dataSrc = curRow.data();
						if (dataSrc == undefined) {
							return;
						}
						if(rowIndex == 0){
							return;
						}
						viewModel.voucherOptions["id"] = dataSrc.id;
						viewModel.voucherOptions["selectflag"] = false;
						viewModel.voucherOptions["finance_code"] = dataSrc.finance_code;
						viewModel.voucherOptions["set_year"] = dataSrc.set_year;
						viewModel.voucherOptions["scrollY"] = $(".modal-body").innerHeight()*0.67 + "px";
						var statusCode = $("#"+statusAreaId).val();
						if(statusCode == EBankConstant.WfStatus.AUDITED_002){
							viewModel.voucherOptions["relationBillId"] = viewModel.mainDoneOptions["relationBillId"];
						}else{
							viewModel.voucherOptions["relationBillId"] = viewModel.mainOptions["relationBillId"];
						}
					    detailUrl = detailUrl || "/df/f_ebank/common/query/doFind.do";
						initDataTables("detailGridArea",detailUrl,viewModel.voucherOptions,viewModel.detailViewDetail);
						if(logFlag){
							// 日志列表初始化
							initLogList();
							// 日志列表查询
							getLogListByDetail(dataSrc);
						};
					});
					var menuBtnWidth = $(".mainLabel").innerWidth();
					$(".button-fixed").css("width",menuBtnWidth);
				}
			});
		};
		/*
		 * 双主表状态切换函数
		 * 已生成状态下显示日报单
		 * 其他状态下显示支付凭证
		 */
		var doubleMainListener = function(statusCode){
			var queryViewId = viewModel.queryViewId.substring(1, 37);
			var searchCondition = ip.getAreaData(viewModel.searchViewModel);
			//  查询条件是否合法 true：合法，false：不合法
			var conditionFlag = searchCondition.conditionFlag;
			if (conditionFlag) {
				var statusLabel = $("#statusLabel");
				if(statusCode == EBankConstant.WfStatus.AUDITED_002){
					if(statusLabel){// 如果需要改变不同状态下label的内容，在HTML中label加一个id=statusLabel
						$("#statusLabel").html("日报单：");
					};
					viewModel.mainDoneOptions["condition"] = '1=1 ';
					viewModel.mainDoneOptions["condition"] += searchCondition.condition;
					viewModel.mainDoneOptions["status"] = statusCode;
					viewModel.mainDoneOptions["finance_code"] = $("#finance_code-" + queryViewId) .val();
					if(statusCode != viewModel.prevStatus){
						// 移除表格
						$('#' + viewModel.mainTableId + '_wrapper').remove();
						$(".mainTable").append('<table id="' + viewModel.mainTableId 
								+'" class="table-striped table nowrap table-bordered table-hover table-condensed" style="width:100%"></table>');
						initDataTables(viewModel.mainTableId,"/df/f_ebank/common/query/doFind.do",
								viewModel.mainDoneOptions,viewModel.mainDoneViewDetail);
					}else{
						$("#" + viewModel.mainTableId).DataTable().ajax.reload(null,true);
					}
				}else{
					if(statusLabel){
						$("#statusLabel").html("支付凭证：");
					};
					viewModel.mainOptions["condition"] = '1=1 ';
					viewModel.mainOptions["condition"] += searchCondition.condition;
					viewModel.mainOptions["status"] = statusCode;
					viewModel.mainOptions["finance_code"] = $("#finance_code-" + queryViewId) .val();
					if(statusCode != viewModel.prevStatus){
						// 移除表格
						$('#' + viewModel.mainTableId + '_wrapper').remove();
						$(".mainTable").append('<table id="' + viewModel.mainTableId
								+ '" class="table-striped table table nowrap table-bordered table-hover table-condensed" style="width:100%"></table>');
						var mainUrl = viewModel.mainUrl || "/df/f_ebank/common/query/doFind.do";
						initDataTables(viewModel.mainTableId,mainUrl,
								viewModel.mainOptions,viewModel.mainViewDetail);
					}else{
						$("#" + viewModel.mainTableId).DataTable().ajax.reload(null,true);
					}
				}
			}
			viewModel.prevStatus = statusCode;// 暂存上一次的状态
		};
		// 初始化日志表格
		var initLogList = function(){
			viewModel.logOptions = ip.getCommonOptions({});
			viewModel.logOptions.gridParam = ip.getTableSetting();
			viewModel.logOptions.gridParam["paging"] = false;
			viewModel.logOptions.gridParam["info"] = false;
			viewModel.logOptions["selectflag"] = false;
			viewModel.logOptions["loadDataFlag"] = false;
			viewModel.logOptions["sumFlag"] = false;
			viewModel.logOptions["scrollY"] = $(".modal-body").innerHeight()*0.76 + "px";
			viewModel.logViewModel = initDataTables("logGridArea","/df/f_ebank/common/query/doFindLog.do",
					viewModel.logOptions,viewModel.logViewDetail);
		};
		// 根据明细查日志列表
		var getLogListByDetail = function(mainData){
			$("body").off('show.bs.tab', '#detailTabs a[href="#log"]'); 
			$("body").on('show.bs.tab','#detailTabs a[href="#log"]',function(e) {
				e = e || window.event;
				var target = e.target || e.srcElement;
				if(target.hash == "#log"){
					var selectRows = $('#detailGridArea').DataTable().rows('.selected');
					if(selectRows[0].length != 1){
						viewModel.logOptions["loadDataFlag"] = false;
						viewModel.logViewModel.clear().draw();
						e.preventDefault();
						e.returnValue = false;
						ip.warnJumpMsg("请选择一条数据明细查看日志！",0,0,true);
						return;
					}
					var selectDetailData = selectRows.data()[0];
					viewModel.logOptions["id"] = selectDetailData.id;// 默认明细情况，已生成页面通过voucher_bill_no查询日志
					viewModel.logOptions["finance_code"] = mainData.finance_code;
					viewModel.logOptions["set_year"] = mainData.set_year ;
					viewModel.logOptions["vt_code"] = ip.getUrlParameter("vt_code");
					viewModel.logOptions["status_code"] = $("#" + viewModel.statusAreaId).val();
					viewModel.logOptions["loadDataFlag"] = true;
					viewModel.logViewModel.ajax.reload(null, true);
				}
			});
		}
	
		/*
		 * 初始化状态和按钮：状态数据信息 按钮数据信息 按钮区域Id 状态区域Id 切换状态时候的逻辑回调 
		 */
		var initStatusBar = function(statusList, btnlist,btnAreaId, statusAreaId, callBack) {
			if (statusList.length > 0) {
				var html = "";
				for (var i = 0, len = statusList.length; i < len; i++) {
					var status_id = statusList[i].status_id;
					if (i == 0) {
						html += '<option id="' + status_id + '" value="' + statusList[i].status_code + '">'
								+ statusList[i].show_name + '</option>';
						var current_status_btns = btnlist[status_id];
						var btn_html = '';
						if (current_status_btns != undefined && current_status_btns != null) {
							if (current_status_btns.length != 0) {
								viewModel.opertaBtns = [];
								for (var j = 0, lens = current_status_btns.length; j < lens; j++) {
									// 0;按钮区 1:操作区
									if (current_status_btns[j].action_type == 0) {
										btn_html += '<span class="icon-box" '
												+ 'onclick="' + current_status_btns[j].func_name
												+ '(' + current_status_btns[j].button_param + ')" '
												+ 'id="' + current_status_btns[j].action_code + '"><i class="iconbtn '
												+ current_status_btns[j].icon_name + '"></i>'
												+ current_status_btns[j].show_name + '</span>';
									} else {
										viewModel.opertaBtns.push(current_status_btns[j]);
									}
								}
							}
						}
						$("#" + btnAreaId).html(btn_html);
					} else {
						html += '<option id="' + status_id + '"value="' + statusList[i].status_code + '">'
								+ statusList[i].show_name + '</option>';
					}
				}
				$("#" + statusAreaId).html(html);
			}
			// 状态改变绑定函数
			$('#' + statusAreaId).on('change',function(e) {
//				var index = $('#' + statusAreaId + ' option:selected')[0].id;
				//上面一行代码的替代方案，页面加载uui,tree等树控件时、jquery方法失效
				var selectObj = document.getElementById(statusAreaId);
				var selectOptIndex = selectObj.selectedIndex; 
				var index = selectObj.options[selectOptIndex].id;
				
				var current_status = $(this)[0].value;
				$("#" + btnAreaId).html("");
				var current_status_btns = btnlist[index];
				if (current_status_btns.length > 0) {
					var btn_html = '';
					for (var i = 0, len = current_status_btns.length; i < len; i++) {
						// 0;按钮区 1:操作区
						if (current_status_btns[i].action_type == 0) {
							btn_html += '<span class="icon-box" '
									+ 'onclick="' + current_status_btns[i].func_name
									+ '(' + current_status_btns[i].button_param + ')"'
									+ 'id="' + current_status_btns[i].action_code + '"><i class="iconbtn '
									+ current_status_btns[i].icon_name + '"></i>'
									+ current_status_btns[i].show_name
									+ '</span>';
						}
					}
					$("#" + btnAreaId).html(btn_html);
				} else {
					$("#" + btnAreaId) .html(
						'<span class="icon-box vh"><i class="iconbtn icon-enter"></i>占位</span>');
				}
				if (typeof callBack === "function") {
					callBack.call(this, current_status);
				}
			});
		}
		/*
		 * 菜单没有显示的状态，只有按钮的时候
		 * 状态固定配置 为code =  999
		 */
		
		var initButtons = function(statuslist,btnlist,btnAreaId){
			if(statuslist.length > 0){
				if(statuslist[0].status_code != "999"){
					ip.ipInfoJump("状态请配置编码为999的状态！","error");
					return;
				}
			}
			var index = statuslist[0].status_id;
			var current_tab_btns = btnlist[index];
			if ( current_tab_btns.length > 0 ) {
				var btn_html = '';
				for ( var i = 0,len = current_tab_btns.length; i < len; i++ ) {
					// 0;按钮区 1:操作区
					if(current_tab_btns[i].action_type == 0){
						btn_html += '<span class="icon-box" ' + 
						'onclick="' + current_tab_btns[i].func_name + '('+current_tab_btns[i].button_param +')"' +
						'id="' + current_tab_btns[i].action_code + '"><i class="iconbtn ' + current_tab_btns[i].icon_name + '"></i>' + 
						current_tab_btns[i].show_name + '</span>';
					}
				}
				$("#"+btnAreaId).html(btn_html);
			} else {
				$("#"+btnAreaId).html('<span class="icon-box vh"><i class="iconbtn icon-enter"></i>占位</span>');
			}
		}
		// 通用查询函数
		var queryHandler = function() {
			if(viewModel.statusAreaId){
				viewModel.mainOptions.status = $("#"+viewModel.statusAreaId).val();
			}
			var queryViewId = viewModel.queryViewId.substring(1, 37);
			viewModel.mainOptions["condition"] = '1=1 ';
			var searchCondition = ip.getAreaData(viewModel.searchViewModel);
			// 查询条件是否合法 true：合法，false：不合法
			var conditionFlag = searchCondition.conditionFlag;
			if (conditionFlag) {
				viewModel.mainOptions["condition"] += searchCondition.condition;
				viewModel.mainOptions["finance_code"] = $("#finance_code-" + queryViewId) .val();
				var vt_code = ip.getUrlParameter("vt_code");
				if(vt_code == "8207" || vt_code == "5210"){
					viewModel.mainOptions["vt_code"] = ip.getUrlParameter("vt_code");
				}
				var querySetYear = $("#set_year-" + queryViewId);
				// 查询区不显示年度默认当前年度
				if(querySetYear.length == 0){
					viewModel.mainOptions["set_year"] = viewModel.mainOptions["svSetYear"];
				}else{
					viewModel.mainOptions["set_year"] = querySetYear.val();
				}
				viewModel.mainTable.ajax.reload(null, true);
			} 
		};
		// 查看明细函数
		var checkDetail = function(btnParam){
			var selectRows = $('#' + viewModel.mainTableId).DataTable().rows('.selected');
			if(selectRows[0].length != 1){
				ip.warnJumpMsg("请选择一条数据查看明细！",0,0,true);
				return;
			}
			$("#"+viewModel.detailModalArea).html("");
			var detailOption = viewModel.voucherOptions;
			// 未生成状态显示明细的情况下，该参数为true，此处强制改回false
			detailOption["isWorkFlowRelated"] = "false";
			if(viewModel.logFlag){
				$("#detailContainer").html(detailHtml);
				$("#detailModal").modal("show");
				detailOption["scrollY"] = $(".modal-body").innerHeight()*0.67 + "px";
			}else{
				$("#detailContainer").html(onlyDetailHtml);
				$("#onlyDetailModal").modal("show");
				detailOption["scrollY"] = $(".modal-body").innerHeight()*0.76 + "px";
			}
			var vt_code = ip.getUrlParameter("vt_code");
			// 双主表的情况下，不同状态传不同的relationBillId
			if(vt_code == "2301" || vt_code == "2302" || vt_code == "2206"){
				var statusCode = $("#" + viewModel.statusAreaId).val();
				if(statusCode == EBankConstant.WfStatus.AUDITED_002){
					if(viewModel.mainDoneOptions){
						detailOption["relationBillId"] = viewModel.mainDoneOptions["relationBillId"];
					}else{
						detailOption["relationBillId"] = viewModel.mainOptions["relationBillId"];
					}
				}else{
					detailOption["relationBillId"] = viewModel.mainOptions["relationBillId"];
				}
			}
			
			detailOption.gridParam = ip.getTableSetting();
			// 通用查明细使用id
			var selectRowData = selectRows.data()[0];
			detailOption["id"] = selectRowData.id;
			// 直接授权公务卡还款签章发送、直接授权批量支付签章发送使用bill_no查明细
			detailOption["bill_no"] = selectRowData.bill_no;
			// 额度查询使用sum_id查明细
			detailOption["sum_id"] = selectRowData.sum_id;
			detailOption["selectflag"] = false;
			detailOption["finance_code"] = selectRowData.finance_code;
			var detailUrl = btnParam ? btnParam.detailUrl : "/df/f_ebank/common/query/doFind.do";
			initDataTables("detailGridArea",detailUrl, detailOption,viewModel.detailViewDetail);
			// 日志列表查询
			if(viewModel.logFlag){
				initLogList();
				getLogListByDetail(selectRowData);
			}
			
		};
		// 查询凭证状态
		var queryVouStatus = function(){
			var selectRows = $('#' + viewModel.mainTableId).DataTable().rows('.selected');
			if(selectRows[0].length != 1){
				ip.warnJumpMsg("请选择一条数据查看凭证状态！",0,0,true);
				return;
			}
			var postData = ip.getCommonOptions({});
			var selectRowData = selectRows.data()[0];
			postData["voucher_no"] = selectRowData.bill_no;
			postData["vt_code"] = ip.getUrlParameter("vt_code");
			postData["finance_code"] = selectRowData.finance_code;
			postData["set_year"] = selectRowData.set_year;
			$.ajax({
				url : "/df/f_ebank/voucherStatusView/getVoucherStatus.do?tokenid=" + viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : postData,
				success : function(data) {
					if(data.flag) {
						var status="";
						switch(data.result){
							case -1:
							     status="未查询到数据";
							     break;
							case 0:
							     status="未接收";
							     break;
							case 1:
							     status="已接收";
							     break;
							case 2:
							     status="接收失败";
							     break;
							case 3:
							     status="签收成功";
							     break;
							case 4:
							     status="签收失败";
							     break;
							case 5:
							     status="被退回";
							     break;
							case 6:
							     status="回单未接收";
							     break;
							case 7:
							     status="回单已接收";
							     break;
							case 8:
							     status="回单接收失败";
							     break;
							case 9:
							     status="回单签收成功 ";
							     break;
							case 10:
							     status="回单签收失败";
							     break;
							case 11:
							     status="回单被退回";
							     break;
							case 12:
							     status="发送单已收到回单";
							     break;
							case 13:
							     status="数据未发送";
							     break;
							case 14:
							     status="数据未发送";
							     break;
						     
						    default:
						    	 ip.warnJumpMsg("凭证状态查询失败！",0,0,true);
						     	 return;
						}
						ip.warnJumpMsg("凭证状态查询结果：" + status + "！",0,0,true);
					}else {
						ip.warnJumpMsg(data.result,0,0,true);
					}
				}
			});
		};
		/*
		 * queryViewId:查询视图id 
		 * params: 财政机构查询所需参数 tokenid 
		 * 如果不是视图配置的，queryViewId传参为空
		 */
		var initFinanceCode = function(queryViewId, params) {
			$.ajax({
				url : EBankConstant.CommonUrl.getFinanceData,
				type : "GET",
				dataType : "json",
				data : params,
				async : false,
				success : function(data) {
					if(data.errorCode == "-1"){
						ip.warnJumpMsg("初始化财政机构失败！原因：" + data.reason,0,0,true);
					}else{
						var financeHtml = "";
						if(!queryViewId){// 自定义财政机构
							financeHtml = "";
						}else{
							financeHtml = $("#finance_code-" + queryViewId).html();// 获取视图中已配的内容“全部”
						}
						for (var i = 0; i < data.dataDetail.length; i++) {
							financeHtml += "<option value=" + data.dataDetail[i].chr_code + ">"
									+ data.dataDetail[i].chr_name + "</option>";
						}
						if(!queryViewId){
							$("#finance_code").html(financeHtml);
						}else{
							$("#finance_code-" + queryViewId).html(financeHtml);
						}
					}
				}
			});

		};
		/*
		 * 从数据库中获取年度  searchViewId：
		 */
		var getEnabledYear = function(searchViewId, tokenid) {
			$.ajax({
				url : EBankConstant.CommonUrl.getEnabledYearData + "?tokenid=" + tokenid,
				type : "GET",
				dataType : "json",
				data : {
					"ajax" : "nocache"
				},
				async : false,
				success : function(datas) {
					if (datas.errorCode == "0") {
						var html = "";
						for (var i = 0; i < datas.setYear.length; i++) {
							html += "<option value=" + datas.setYear[i].set_year + ">"
									+ datas.setYear[i].year_name + "</option>"
						}
						$("#set_year-" + searchViewId).html(html);
					} else {
						ip.ipInfoJump("加载参数失败！原因：" + datas.result, "error");
					}
				}
			})
		}
		
		/*
		 * tableId 表格id 
		 * payeeFlag 收款人信息
		 * moneyFlag 支付金额信息
		 * pfFlag 
		 * pmFlag 结算方式
		 * pbFlag 代理银行
		 */
		var getOperaParam = function(tableId, payeeFlag, moneyFlag, pfFlag, pmFlag ,pbFlag) {
			var operaParam = new Array();
			var selectRows = $('#' + tableId).DataTable().rows('.selected');

			for (var i = 0; i < selectRows.indexes().length; i++) {
				var curIndexData = selectRows.data()[i];
				var temp = {};
				temp["id"] = curIndexData.id;
				temp["bill_no"] = curIndexData.bill_no;
				temp["voucher_no"] = curIndexData.voucher_no;
				temp["finance_code"] = curIndexData.finance_code;
				temp["set_year"] = curIndexData.set_year;
				
				if (payeeFlag) {
					temp["payee_account_bank"] = curIndexData.payee_account_bank;
					temp["payee_account_no"] = curIndexData.payee_account_no;
					temp["payee_account_name"] = curIndexData.payee_account_name;
				}
				if (moneyFlag) {
					temp["pay_money"] = curIndexData.pay_money;
				}
				if (pfFlag) {
					temp["pf_name"] = curIndexData.pf_name;
				}
				if (pmFlag) {
					temp["pm_name"] = curIndexData.pm_name;
					temp["pm_code"] = curIndexData.pm_code;
				}
				if(pbFlag){
					temp["pb_code"] = curIndexData.pb_code;
					temp["clear_account_bank"] = curIndexData.clear_account_bank;
				}
				operaParam.push(temp);
			}
			return operaParam;
		}
		// 通用支付
		var payMoneyHandler = function(btnParam){
			if(requesting){
				return;
			}
			viewModel.inputPaydata = [];
			viewModel.needPaydata = [];
			viewModel.inputPayDataIndex = 0;
			requesting=true;
			var billIdsAndFinanceCode;
			var payUrl = "";
			if(btnParam.payType == "common"){// 正常支付和实拨支付
				billIdsAndFinanceCode = getOperaParam(viewModel.mainTableId,true,true,false,true);
				payUrl = EBankConstant.CommonUrl.doCommonPay;
			}else if(btnParam.payType == "batch"){// 批量支付
				billIdsAndFinanceCode = getOperaParam(viewModel.mainTableId,true,true,false,false);
				payUrl = EBankConstant.CommonUrl.doBatchPay;
			}
			viewModel.payType = btnParam.payType;
			if(billIdsAndFinanceCode.length == 0){
				ip.warnJumpMsg("请选择数据！",0,0,true);
				requesting=false;
				return;
			}
			var localBankName = _getEBankConfParam(billIdsAndFinanceCode[0].finance_code,"local_bank_name");
			var localBankNamesplit = localBankName.value.split(",");
			viewModel.inputPaydata = [];
			viewModel.needPaydata = [];
			for(var i=0, j = billIdsAndFinanceCode.length;i<j;i++){
					var pmName = billIdsAndFinanceCode[i].pm_name || "";
					if(pmName.indexOf("现金") > -1){
						ip.warnJumpMsg("现金业务请走补录交易流水号！",0,0,true);
						requesting=false;
						return;
					}else{
						var isInnerBank = 0;
						for (var k = 0; k < localBankNamesplit.length; k++) {
							if (billIdsAndFinanceCode[i].payee_account_bank.indexOf(localBankNamesplit[k]) != -1) {
								// 代理银行中只要有同行名称，代表同行转账
								isInnerBank = 1;
								break;
							}
						}
						// 同行数据暂存到needPaydata，跨行数据暂存到inputPaydata
						if(isInnerBank == 1){
							viewModel.needPaydata.push(billIdsAndFinanceCode[i]);
						}else{
							viewModel.inputPaydata.push(billIdsAndFinanceCode[i]);
						}
					}
			}
			//同行数据数量不等于总数量，说明存在跨行数据，补录收款行信息
			if (viewModel.needPaydata.length != billIdsAndFinanceCode.length) {
				viewModel.inputPayeeBankNo(viewModel.inputPaydata[0].payee_account_bank);
			} else {
				var postData = ip.getCommonOptions({});
				postData["btype"] = ip.getUrlParameter("btype");
				postData["isFlow"] = ip.getUrlParameter("isFlow");
				postData["billIdsAndFinanceCode"] = JSON.stringify(billIdsAndFinanceCode);
				postData["ajax"] = "nocache";
				ip.processInfo("正在处理中，请稍候......", true);
				$.ajax({
					url : payUrl,
					type : "POST",
					data : postData,
					success : function(data) {
						ip.processInfo("正在处理中，请稍候......", false);
						ip.warnJumpMsg(data.result, 0, 0, true);
						queryHandler();
						requesting = false;
					}
				});
			}
		};
		// 收款行行号录入模态框:跨行数据需要补录收款行行号
		viewModel.inputPayeeBankNo = function(payee_account_bank){
			$("#bankNoInputContainer").html(bankNoInputHtml);
			$("#bankNoInputModal").modal("show");
			var inputBankNoOptions = ip.getCommonOptions({});
			inputBankNoOptions.gridParam = ip.getTableSetting();
			// 初始化补录行号模态框查询区和列表
			for ( var n = 0; n < viewModel.viewList.length; n++) {
				var view = viewModel.viewList[n];
				if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {// 列表视图
					if (view.orders == '5') {
						inputBankNoOptions["tableViewId"] = view.viewid;
						inputBankNoOptions["isDetailQuery"] = "false";  // 是否查询明细
						inputBankNoOptions["loadDataFlag"] = false;// 初始不加载数据
						inputBankNoOptions["sumFlag"] = false;
						inputBankNoOptions["scrollY"] = $("#bankNoInputModal .modal-body").innerHeight()*0.35 + "px";
						viewModel.payeeBankNoMainModal = initDataTables("payeeBankNoList",
								"/df/f_ebank/pay/InputPayeeBankNo/getPayeeBank.do",inputBankNoOptions,view.viewDetail);
					} 
				}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){
					if (view.orders == '5') {
						viewModel.payeeBankNoQueryViewId = view.viewid;
						viewModel.payeeBankNoViewModel = ip.initArea(view.viewDetail,"edit", view.viewid
												.substring(1,37),"payeeBankNoSearch");
					} 
				}
			}
			// 默认每次打开都是20条每页
			viewModel.payeeBankNoMainModal.page.len(20).draw();
			var payeeBankNoQueryViewId = viewModel.payeeBankNoQueryViewId.substring(1, 37);
			// 初始化查询区的银行类别、省、市、授权银行名称
			viewModel._initBankType();
			viewModel._initProvince();
			viewModel._getCityByProvince(payeeBankNoQueryViewId);
			
			$("#bankleitzahl_no-" + payeeBankNoQueryViewId).val("");
			$("#united_bank_name-" + payeeBankNoQueryViewId).val(payee_account_bank);
			// 省切换事件绑定函数
			$("body").on('change',"#province_code-"+ payeeBankNoQueryViewId,function() {
				viewModel._getCityByProvince(payeeBankNoQueryViewId)
			});
			// 根据当前的查询区 查询收款银行行号列表
			viewModel.inputBankNoOptions = inputBankNoOptions;// 查询列表备用
			initBankNoList();
			
			// 银行名称回车查询
			$("#united_bank_name-" + payeeBankNoQueryViewId).on("keypress",function(event){
				if(event.keyCode == 13){  
					initBankNoList();
		         } 
			});
		};
		// 收款行行号录入模态框保存
		var savePayeeBankNo = function(){
			var inputPayDataIndex = viewModel.inputPayDataIndex;
			var id = viewModel.inputPaydata[inputPayDataIndex].id;
			var financeCode = viewModel.inputPaydata[inputPayDataIndex].finance_code; 
			var payeeBankName = viewModel.inputPaydata[inputPayDataIndex].payee_account_bank;
			var payeeAccountNo = viewModel.inputPaydata[inputPayDataIndex].payee_account_no;
			var payeeBankData = new Array();
			var selectRows = $('#payeeBankNoList').DataTable().rows('.selected');
			if (selectRows.indexes().length == 0 || selectRows.indexes().length > 1){
				ip.warnJumpMsg("请选择一条数据！",0,0,true);
			    return;
			};
			for (var i = 0; i < selectRows.indexes().length; i++) {
				var temp = {};
				temp["united_bank_no"] = selectRows.data()[i].united_bank_no;
				payeeBankData.push(temp);
			}
			var inputBankNoUrl = "";
			var payUrl = "";
			if(viewModel.payType == "common"){
				inputBankNoUrl = "/df/f_ebank/pay/InputPayeeBankNo/inputBillPayeeBankNo.do?tokenid=";
				payUrl = EBankConstant.CommonUrl.doCommonPay;
			}else if(viewModel.payType == "batch"){
				inputBankNoUrl = "/df/f_ebank/pay/InputPayeeBankNo/inputBatchDetailPayeeBankNo.do?tokenid=";
				payUrl = EBankConstant.CommonUrl.doBatchPay;
			}
			var unitedBankNo = payeeBankData[0].united_bank_no;
			var postData = ip.getCommonOptions({});
			postData["btype"] = ip.getUrlParameter("btype");
			postData["isFlow"] = ip.getUrlParameter("isFlow");
			postData["vt_code"] = ip.getUrlParameter("vt_code");
//			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : inputBankNoUrl + viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "nocache",
					"id":id,
					"financeCode":financeCode,
					"payeeBankName":payeeBankName,
					"payeeAccountNo":payeeAccountNo,
					"unitedBankNo":unitedBankNo,
					"setYear":postData["svSetYear"],
				},
				async : true,
				success : function(datas) {
//					ip.processInfo("正在处理中，请稍候......", false);
					requesting=false;
					viewModel.clearModal("payeeBankNoSearch");
					if(inputPayDataIndex != viewModel.inputPaydata.length-1){
						$("#united_bank_name-"
								+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).val(
										viewModel.inputPaydata[viewModel.inputPayDataIndex+1].payee_account_bank);
					}							
					initBankNoList();
					if(datas.flag == "0"){
						ip.warnJumpMsg("补录失败！",0,0,true);
					}else{
						viewModel.needPaydata.push(viewModel.inputPaydata[viewModel.inputPayDataIndex]);
						viewModel.inputPayDataIndex++;
						// 所有跨行数据录入完收款行行号后，批量走支付
						if(viewModel.inputPayDataIndex == viewModel.inputPaydata.length){
							postData["billIdsAndFinanceCode"] = JSON.stringify(viewModel.needPaydata);
							$("#bankNoInputModal").modal("hide");
							ip.processInfo("正在处理中，请稍候......", true);
							$.ajax({
								url : payUrl,
								type : "POST",
								data :postData,
								success : function(data) {
									ip.processInfo("正在处理中，请稍候...", false);
									ip.warnJumpMsg(data.result,0,0,true);
									queryHandler();
								}
							});
						
						}	
					}
				}
			});
		};
		// 收款行行号录入模态框退出事件
		var closeBankNoInput = function(){
			requesting = false;
			viewModel.clearModal("payeeBankNoSearch");
			viewModel.inputBankNoOptions["loadDataFlag"] = false;
			viewModel.payeeBankNoMainModal.ajax.reload(null, true);
			$("#bankNoInputModal").modal("hide");
		};
		// 获取查询区银行行别数据
		viewModel._initBankType = function(){
			$.ajax({
				url : "/df/f_ebank/pay/InputPayeeBankNo/getBank.do?tokenid=" + viewModel.tokenid,
				type : "GET",
				dataType : "json",
				data : {
					"ajax" : "nocache"
				},
				async : false,
				success : function(data) {
					var bankData = data.data;
					viewModel.bankData = bankData;// 新增行号备用
					var html = "";
					for ( var i = 0; i < bankData.length; i++) {
						html += "<option value=" + bankData[i].bankleitzahl_no + ">" 
							+ bankData[i].bankleitzahl_name + "</option>";
					}
					$("#bankleitzahl_no-"+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).html(html);		
				}
			});
		};
		// 获取查询区的“省”下拉框数据
		viewModel._initProvince = function(){
			$.ajax({
				url : "/df/f_ebank/pay/InputPayeeBankNo/getProvince.do?tokenid="
					+ viewModel.tokenid,
				type : "GET",
				dataType : "json",
				data : {
					"ajax" : "nocache"
				},
				async : false,
				success : function(data) {
				    var provinceData = data.data;
				    viewModel.provinceData = provinceData;// 新增行号备用
				    var html = "";
					for ( var i = 0; i < provinceData.length; i++) {
						if(provinceData[i].province_name == "北京"){
							html += "<option selected='true' value=" + provinceData[i].province_code + ">" 
								+ provinceData[i].province_name + "</option>";
						}else{
							html += "<option value=" + provinceData[i].province_code + ">" 
								+ provinceData[i].province_name + "</option>";
						}
					}
					$("#province_code-"+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).html(html);
				}
			});
		};
		// 查询区的行别
		viewModel._getCityByProvince = function(viewId){
			var provinceCode = $("#province_code-" + viewId).val();
			$.ajax({
				url : "/df/f_ebank/pay/InputPayeeBankNo/getCity.do?tokenid="
					+ viewModel.tokenid,
				type : "GET",
				dataType : "json",
				data : {
					"ajax" : "nocache",
					"provinceCode":provinceCode
				},
				async : false,
				success : function(data) {
					var cityData = data.data;
					viewModel.cityData = cityData;// 新增行号备用
					var html = "";
					for ( var i = 0; i < cityData.length; i++) {
						html += "<option value=" + cityData[i].city_code + ">"
							+ cityData[i].city_name + "</option>";
					}
					$("#city_code-"+ viewId).html(html);
				}
			});
		};
		// 查询收款银行行号列表
		var initBankNoList = function() {
			var searchCondition = ip.getAreaData(viewModel.payeeBankNoViewModel);
			if(searchCondition.conditionFlag){
				var condition = "";
				viewModel.inputBankNoOptions["condition"] = searchCondition.condition;
				viewModel.inputBankNoOptions["loadDataFlag"] = true;
				viewModel.payeeBankNoMainModal.ajax.reload(null, true);
			}
		};
		// 新增行号
		var payeeBankNoAdd = function(){
			$("#addBankNoContainer").html(addBankNoHtml);
			$('#bankTitle').text("新增收款行行号");
			$("#addBankNoModal").modal("show");
			viewModel.initPayeeBankNoAddDailog();
		};
		// 修改
		var payeeBankNoUpdate = function(){
			$("#addBankNoContainer").html(addBankNoHtml);
			var selectRows = $('#payeeBankNoList').DataTable().rows('.selected');
			if (selectRows.indexes().length != 1){
				ip.warnJumpMsg("请选择一条数据！",0,0,true);
			    return;
			};
			$('#bankTitle').text("修改收款行行号");
			$("#addBankNoModal").modal("show");
			viewModel.initPayeeBankNoAddDailog();
			var payeeBankNoAddViewId = viewModel.payeeBankNoAddViewId.substring(1, 37);
			$("#bankleitzahl_no-" + payeeBankNoAddViewId).val(selectRows.data()[0].bankleitzahl_no);
			$("#province-" + payeeBankNoAddViewId).val(selectRows.data()[0].province_code);
			// 根据省下拉框赋的值，动态查询市数据
			viewModel._getCityByProvince(payeeBankNoAddViewId);
			$("#city-"+ payeeBankNoAddViewId).val(selectRows.data()[0].city_code);
			$("#united_bank_name-" + payeeBankNoAddViewId).val(selectRows.data()[0].united_bank_name);
			$("#united_bank_no-" + payeeBankNoAddViewId).val(selectRows.data()[0].united_bank_no);
			viewModel.oldBankleitzahl = selectRows.data()[0].united_bank_no;
		};
		// 删除
		var payeeBankNoDelete = function(){
			var selectRows = $('#payeeBankNoList').DataTable().rows('.selected');
			if (selectRows.indexes().length != 1){
				ip.warnJumpMsg("请选择一条数据！",0,0,true);
			    return;
			};
			ip.warnJumpMsg("确定要删除吗？","del", "cCla");
			$("#del").on("click", function() {
				ip.processInfo("正在处理中，请稍候......", true);
				$.ajax({
					url : "/df/f_ebank/pay/InputPayeeBankNo/deletePayeeBank.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"unitedBankNo":selectRows.data()[0].united_bank_no
					},
					success : function(data) {
						ip.processInfo("正在处理中，请稍候......", false);
						if(data.flag=="0"){
							ip.warnJumpMsg("删除失败，"+data.result,0,0,true);
						}else{
							$("#config-modal").remove();
							ip.warnJumpMsg("删除成功！",0,0,true);
							initBankNoList();
							
						}
					}
				});
			});
				
			$(".cCla").on("click", function(){
				$("#config-modal").remove();
			});
		};
		// 清空
		var payeeBankNoClear = function(){
			viewModel.clearModal("payeeBankNoSearch");
			viewModel.inputBankNoOptions["loadDataFlag"] = false;
			viewModel.payeeBankNoMainModal.ajax.reload(null, true);
		}
		// 新增收款行行号模态框
		viewModel.initPayeeBankNoAddDailog = function(){
			for ( var n = 0; n < viewModel.viewList.length; n++) {
				var view = viewModel.viewList[n];
				 if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_INPUT){
					if (view.orders == '5') {
						// 以视图方式创建
						viewModel.payeeBankNoAddViewId = view.viewid;
						viewModel.payeeBankNoInputViewModel = ip.initArea(view.viewDetail,"edit",
								view.viewid.substring(1,37),"payeeBankNoAdd");
					} 
				}
			}
			// 初始化 银行行别、省、市
			var payeeBankNoAddViewId = viewModel.payeeBankNoAddViewId.substring(1, 37);
			var html = "";
			for(var i = 0; i < viewModel.bankData.length; i++) {
				html += "<option value=" + viewModel.bankData[i].bankleitzahl_no + ">"
					+ viewModel.bankData[i].bankleitzahl_name + "</option>";
			}
			$("#bankleitzahl-" + payeeBankNoAddViewId).html(html);
			
			var provinceHtml = "";
			for(var i = 0; i < viewModel.provinceData.length; i++){
				provinceHtml += "<option value=" + viewModel.provinceData[i].province_code + ">" 
					+ viewModel.provinceData[i].province_name + "</option>";
			}
			$("#province_code-"+ payeeBankNoAddViewId).html(provinceHtml);
			
			viewModel._getCityByProvince(payeeBankNoAddViewId);
			// 省市联动
			$("body").on('change',"#province_code-"+ payeeBankNoAddViewId,function() {
				viewModel._getCityByProvince(payeeBankNoAddViewId)
			});
			// 收款行号只允许输入数字
			$("#united_bank_no-"+ payeeBankNoAddViewId).on("keyup",function(){
					this.value=this.value.replace(/[^\d]/g,'');
			});
		};
		// 新增收款行号保存方法
		var saveAddPayeeBankNo = function(){
			var payeeBankNoAddViewId = viewModel.payeeBankNoAddViewId.substring(1, 37);
			var bankCode = $("#bankleitzahl-" + payeeBankNoAddViewId).val();
			var bankName = $("#bankleitzahl-" + payeeBankNoAddViewId).find("option:selected").text();
			var provinceCode = $("#province_code-" + payeeBankNoAddViewId).val();
			var provinceName = $("#province_code-" + payeeBankNoAddViewId).find("option:selected").text();
			var cityCode = $("#city_code-" + payeeBankNoAddViewId).val();
			var cityName = $("#city_code-" + payeeBankNoAddViewId).find("option:selected").text();
			var unitedBankNo = $("#united_bank_no-" + payeeBankNoAddViewId).val();
			var unitedBankName = $("#united_bank_name-" + payeeBankNoAddViewId).val();
			if(!unitedBankNo){
				ip.warnJumpMsg("请输入收款行行号！！！",0,0,true);
				return;
			}
			if(!unitedBankName){
				ip.warnJumpMsg("请输入收款行名称！！！",0,0,true);
				return;
			}
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : "/df/f_ebank/pay/InputPayeeBankNo/savePayeeBank.do?tokenid="
					+ viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "nocache",
					"bankleitzahlNo":bankCode,
					"bankleitzahlName":bankName,
					"provinceCode":provinceCode,
					"provinceName":provinceName,
					"cityCode":cityCode,
					"cityName":cityName,
					"unitedBankNo":unitedBankNo,
					"unitedBankName":unitedBankName,
					"oldUnitedBankNo":viewModel.oldBankleitzahl
				},
				async : false,
				success : function(datas) {
					ip.processInfo("正在处理中，请稍候......", false);
					viewModel.oldBankleitzahl = "";
					if(datas.flag=="0"){
						ip.warnJumpMsg("操作失败！",0,0,true);
					}else{
						ip.warnJumpMsg("操作成功！",0,0,true);
					}
					viewModel.clearModal("payeeBankNoAdd");
					$("#addBankNoModal").modal("hide");
					initBankNoList();
				}
			});
		};
		// 新增收款行行号模态框退出事件
		var closeAddPayeeBankNo = function(){
			viewModel.clearModal("payeeBankNoAdd");
			$("#addBankNoModal").modal("hide");
		};
		// 通用表单清空方法
		viewModel.clearModal = function(parentBoxId){
			$("#" + parentBoxId + " input").val("");
			$("#" + parentBoxId + " select").val("");
		};
		// 补录交易流水号
		var inputAgentBusinessNo = function(btnParam){
			viewModel.addTradeNoType = btnParam.actionType;
			$("#addTradeNoContainer").html(addTradeHtml);
			if(requesting){
				return;
			}
			requesting=true;
			var billIdsAndFinanceCode = getOperaParam(viewModel.mainTableId,true,true,false,true);
			if(btnParam.actionType == "single"){
				if(billIdsAndFinanceCode.length != 1){
					ip.warnJumpMsg("请选择一条数据！",0,0,true);
					requesting=false;
					return;
				}
			}else{
				if(billIdsAndFinanceCode.length == 0){
					ip.warnJumpMsg("请选择数据！",0,0,true);
					requesting=false;
					return;
				}
			}
			$("#addTradeNoModal").modal("show");
		};
		// 保存交易流水号
		var saveAgentBusinessNo = function(){
			// 修改校验条件：只验证不能含有特殊字符
			var patt1=/^[A-Za-z0-9]+$/;
			var agentBusinessNo = $("#agent_business_no").val().trim();
			if(!agentBusinessNo){
				ip.warnJumpMsg("请先填写交易流水号！",0,0,true);
				return;
			}else if(!patt1.test(agentBusinessNo)){
				ip.warnJumpMsg("交易流水号不能含有汉字和特殊字符！",0,0,true);
				return;
			}else if(agentBusinessNo.length >60){
				ip.warnJumpMsg("交易流水号长度不能大于60！",0,0,true);
				return;
			}else{
				var requestUrl = "";
				var vt_code = ip.getUrlParameter("vt_code");
				var postData = ip.getCommonOptions({});
				var billIdsAndFinanceCode = getOperaParam(viewModel.mainTableId,true,true,false,true);
				if(viewModel.addTradeNoType == 'single'){
					postData["bill_no"] = billIdsAndFinanceCode[0].bill_no;
					postData["finance_code"] = billIdsAndFinanceCode[0].finance_code;
					if(vt_code == "5210" || vt_code == "8207"){
						postData["operationType"] = "4";
						postData["confirmBills"]=JSON.stringify(billIdsAndFinanceCode);
						requestUrl = EBankConstant.CommonUrl.doInputAgentBusinessBatchNo;
					}
					else{
						requestUrl = EBankConstant.CommonUrl.doInputAgentBusinessNoNext;
					}
				}else if(viewModel.addTradeNoType == 'batch'){
					postData["billIdsAndFinanceCode"] = billIdsAndFinanceCode;
					requestUrl = EBankConstant.CommonUrl.doBatchAgentBusinessNoNext;
				}
				postData["vt_code"] = vt_code;
				postData["agentBusinessNo"] = agentBusinessNo;
				postData["ajax"]="nocache";
				ip.processInfo("正在处理中，请稍候......", true);
				$.ajax({
					url : requestUrl,
					type : "POST",
					async: false,
					data :postData,
					success : function(data) {
						ip.processInfo("正在处理中，请稍候......", false);
						if(data.flag){
							closeAgentBusinessNo();
							ip.warnJumpMsg(data.result,0,0,true);
						}else{
							ip.warnJumpMsg(data.result,0,0,true);
						}
						queryHandler();
						requesting=false;
					}
				});
			}
		};
		// 取消保存交易流水号
		var closeAgentBusinessNo = function(){
			$("#addTradeNoModal input").val("");
			$("#addTradeNoModal").modal("hide");
			requesting=false;
		};
		// 签章发送和再次发送事件处理方法
		var signSendHandler = function(btnParam){
			if(requesting){
				return;
			}
			requesting = true;
			var billnosAndFinanceCodes = getOperaParam(viewModel.mainTableId,false,false,false,false,true);
			if(billnosAndFinanceCodes.length == 0){
				ip.warnJumpMsg("请选择数据！",0,0,true);
				requesting = false; 
				return false;
			}
			
			var postData = ip.getCommonOptions({});
			var vt_code = ip.getUrlParameter("vt_code");
			// 如果菜单url没有配置vt_code，从查询区获取vt_code(例如凭证查询菜单)
			if(!vt_code){
				postData["vtCode"] = $("#vt_code-" + viewModel.queryViewId.substring(1, 37)).val();
			}else{
				postData["vtCode"] = vt_code;
			}
			postData["des"] = ip.getUrlParameter("des");
			postData["isFlow"] = btnParam.isFlow ? btnParam.isFlow : "1";
			postData["billnosAndFinanceCode"] = JSON.stringify(billnosAndFinanceCodes);
			postData["ajax"] = "nocache";
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : EBankConstant.SignSendUrl[btnParam.signType] + "?tokenid=" + postData.tokenid,
				type : "POST",
				data : postData,
				success : function(data){
					ip.processInfo("正在处理中，请稍候......", false);
					if(data.is_success == "0"){
						ip.warnJumpMsg(data.error_msg, 0, 0, true);
					}else{
						ip.warnJumpMsg("操作成功！", 0, 0, true);
						queryHandler();
					}
					requesting = false; 
				}
			});
		};
		
		/*
		 * 通用走工作流方法（需要set_year，vt_code和业务数据）
		 * 通用审核 actionType = doCommonNext
		 * 通用撤销审核 actionType = doCommonRecall
		 * 通用退回 actionType = doCommonBack
		 * 通用作废 actionType = doCommonDelete
		 */
		var doCommonWorkFlow = function(btnParam){
			if(requesting){
				return;
			}
			requesting = true;
			var billNosAndFinanceCode = getOperaParam(viewModel.mainTableId,false,true,false,false);
			if(billNosAndFinanceCode.length == 0){
				ip.warnJumpMsg("请选择送审数据！",0,0,true);
				requesting=false;
				return;
			}
			var postData = ip.getCommonOptions({});
			postData["vt_code"] = ip.getUrlParameter("vt_code");
			postData["billNosAndFinanceCode"] = JSON.stringify(billNosAndFinanceCode);
			postData["ajax"]="nocache";
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : EBankConstant.CommonUrl[btnParam.actionType],
				type : "POST",
				data :postData,
				success : function(data) {
					ip.processInfo("正在处理中，请稍候......", false);
					if(data.success == '1'){
						ip.warnJumpMsg("操作成功！",0,0,true);	
						queryHandler();
					}else{
						ip.warnJumpMsg("操作失败，" + data.result,0,0,true);	
					}
					requesting=false;
				}
			});
		};
		/*
		 * 通用生成
		 * 划款/退款申请生成 urlConst=doApplyCreate
		 * 入账通知书生成 urlConst=doNoticeCreate
		 * 支付日报生成 urlConst=doDailyCreate 
		 */
		var doCreateBill = function(btnParam){
			requesting = true;
			var billIdsAndFinanceCode;
			var billIdsAndFinanceCode = getOperaParam(viewModel.mainTableId,false,false,false,false);
			if(billIdsAndFinanceCode.length == 0){
				ip.warnJumpMsg("请选择生成数据！",0,0,true);
				requesting = false;
				return;
			}
			var vt_code = ip.getUrlParameter("vt_code");
			var postData = ip.getCommonOptions({});
			postData["oriCode"] = ip.getUrlParameter("ori_code");
			postData["vtCode"] = vt_code;
			postData["setYear"] = postData["svSetYear"];
			postData["billnosAndFinanceCode"] = JSON.stringify(billIdsAndFinanceCode);
			postData["ajax"] = "nocache";
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : EBankConstant.CommonUrl[btnParam.urlConst],
				type : "POST",
				data : postData,
				success : function(data) {
					ip.processInfo("正在处理中，请稍候......", false);
					if(data.flag == '1'){
						ip.warnJumpMsg("生成成功！",0,0,true);
						var statusCode = $("#statusArea").val();
						// 额度到账通知书、直接支付入账通知书生成
						if(vt_code == '2104' || vt_code == '2205'){
							detailPageListener(statusCode);
						}else{
							doubleMainListener(statusCode);
						}
					}else{
						ip.warnJumpMsg("生成失败，" + data.result,0,0,true);	
					}
				    requesting = false;
				}
			});
		};
		// 通用撤销生成
		var doCancelCreateBill = function(){
			requesting = true;
			var billIdsAndFinanceCode = getOperaParam(viewModel.mainTableId,false,false,false,false);
			if(billIdsAndFinanceCode.length == 0){
				ip.warnJumpMsg("请选择数据！",0,0,true);
				requesting = false;
				return;
			}
			var postData = ip.getCommonOptions({});
			var vt_code = ip.getUrlParameter("vt_code");
			postData["oriCode"] = ip.getUrlParameter("ori_code");
			postData["vtCode"] = vt_code;
			postData["setYear"] = postData["svSetYear"];
			postData["billnosAndFinanceCode"] = JSON.stringify(billIdsAndFinanceCode);
			postData["ajax"] = "nocache";
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : EBankConstant.CommonUrl.doCancelCreateBill,
				type : "POST",
				data :postData,
				success : function(data) {
					ip.processInfo("正在处理中，请稍候......", false);
					if(data.flag == '1'){
						var statusCode = $("#statusArea").val();
						if(vt_code == '2104' || vt_code == '2205'){
							detailPageListener(statusCode);
						}else{
							doubleMainListener(statusCode);
						}
						ip.warnJumpMsg("撤销生成成功！",0,0,true);	
					}else{
						ip.warnJumpMsg("撤销生成失败，"+data.result,0,0,true);	
					}
					requesting=false;
				}
			});
		};
		// 凭证查看
		var doVoucherSee = function(e){
			_asspVoucherHandler("see");
		};
		// 凭证预览
		var doVoucherPreview = function(e){
			_asspVoucherHandler("preview");
		};
		// 凭证查看和凭证预览统一方法actionType=preview凭证预览actionType=see凭证查看
		var _asspVoucherHandler = function(actionType){
			var e = e || window.event;
			var selectedData = getOperaParam(viewModel.mainTableId,false,false,false);
			if(selectedData.length == 0){
				ip.warnJumpMsg("请选择数据！",0,0,true);
				requesting = false;
				return;
			}
			// 定义查看凭证需要的参数
			var vt_code = ip.getUrlParameter("vt_code");
			if(!vt_code){
				vt_code = $("#vt_code-" + viewModel.queryViewId.substring(1, 37)).val();
			}
			var bill_nos = "";
			var set_year = "";
			var rg_code = "";
			var oldRgcode = "";
			var asspWinTitle = "";
			var searchtype = "";			
			var selectedDataLength = selectedData.length;
			for(var i=0;i < selectedData.length;i++){
				var rowData = selectedData[i];
				rg_code = rowData.finance_code;
				set_year = rowData.set_year;		
				if(i == 0){// 存储第一个凭证的区划信息
					oldRgcode = rg_code;
				}else{
					if(oldRgcode != rg_code){
						alert("不同区划数据不能进行批量凭证查看");
						return;
					}
				}
				if(i != selectedDataLength-1){
					bill_nos = bill_nos + rowData.bill_no + ",";
				}else{
					bill_nos = bill_nos + rowData.bill_no;
				}
			}
			bill_nos = encodeURI(bill_nos);
			if(actionType == "see"){
				asspWinTitle = "电子凭证查看";
				searchtype = "1";
			}else if(actionType == "preview"){
				asspWinTitle = "电子凭证预览";
				searchtype = "0";
			}
			var oWin= window.open ("/df/rounte/admin/pages/common/assp/asspVoucher.html?tokenid=" + ip.getTokenId()
					+ "&billnos=" + bill_nos + "&searchtype=" + searchtype + "&menuid=" + ip.getMenuId() + "&vt_code=" + vt_code
					+ "&rg_code=" + rg_code + "&set_year=" + set_year, asspWinTitle, 
					"width=1000,height=580,top=50,left=100,toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no");
			var scanFun = function(){
		        if(oWin.document){
		            oWin.document.title = asspWinTitle;
		            window.clearInterval(scanInterval);
		        }
		    };
		    var scanInterval = window.setInterval(scanFun,200);
			window.event ? e.cancelBubble = true : e.stopPropagation();
		};
		// 通过财政机构和名称获取配置的数据(用途：支付查询是否跨行数据)
		var _getEBankConfParam = function(rgCode,key) {
			var result;
			$.ajax({
				url : EBankConstant.CommonUrl.EBankConfParam_url + "/getParamConfByKey.do",
				type : "POST",
				dataType : "json",
				async : false,
				data : {
					"tokenid" : viewModel.tokenid,
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
		
		//打印
		var doPreviewPrint = function(btnParam) {
			var billIdsAndFinanceCode = getOperaParam("mainGridArea",false,false,false,false);
			if(billIdsAndFinanceCode.length != 1){
				ip.warnJumpMsg("请选择一条数据！",0,0,true);
				return;
			}
			var dataId = billIdsAndFinanceCode[0].id;
			var finance_code = billIdsAndFinanceCode[0].finance_code;
			var report_seq = btnParam.report_seq;
			oWin= window.open ("/df/rounte/admin/pages/report/reportPreview/reportPreview.html?tokenid="+
					ip.getTokenId()+"&finance_code="+finance_code+"&dataId="+dataId+"&report_seq="+
					report_seq, "预览打印", "height=580, width=1200, top=30, left=30, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no");
			var scanFun=function(){
			    if(oWin.document){
			        oWin.document.title="预览打印";
			        window.clearInterval(scanInterval);
			    }
			};
			var scanInterval=window.setInterval(scanFun,200);
		};
		
		//批量打印
		var doMultiPrint = function(btnParam) {
			$("#ocxContainer").html(ocxObj);
			var selectedData = getOperaParam("mainGridArea",false,false,false,false);
			if(selectedData.length == 0){
				ip.warnJumpMsg("请选择至少一条数据！",0,0,true);
				return;
			}
			var dataMoudule = "";
			var dataXml = "";
			var postData = ip.getCommonOptions({});
				postData["finance_code"] = selectedData[0].finance_code;
				postData["report_seq"] = btnParam.report_seq;
				postData["pageNo"] = "0";
				postData["selectedData"] = JSON.stringify(selectedData);
				$.ajax({
					url : "/df/f_ebank/reportDisplay/multiReportQuery.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					data :postData,
					success : function(data) {
						var ocx = document.getElementById('ocxDSc');
						dataMoudule = data.mould;
						dataXml = data.xml;
						for (var i=0; i<dataXml.length; i++){
							if(i == 0){
								ocx.printAllVoucherFEBank(dataMoudule,dataXml[i],"true");
							}else{
								ocx.printAllVoucherFEBank(dataMoudule,dataXml[i],"false");
							}
						}
						if(dataXml.length != selectedData.length){
							ip.warnJumpMsg(data.error,0,0,true);
							return;
						}
					}
				});
		};

		// 设置cookie 
		var setCookie = function(cname, cvalue) {  
		    var d = new Date();
		    // 设置cookie过期时间
			var exp = new Date();
			d.setFullYear(2038);
			var expires = "expires="+d.toGMTString();
		    document.cookie = cname + "=" + cvalue + "; " + expires;  
		}; 
		// 获取cookie  
		var getCookie = function(cname) {  
		    var name = cname + "=";  
		    var ca = document.cookie.split(';');  
		    for(var i=0; i<ca.length; i++) {  
		        var c = ca[i];  
		        while (c.charAt(0)==' ') c = c.substring(1);  
		        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);  
		    }  
		    return "";  
		}; 
		
		var htmlEncodeByRegExp = function(str){  
		    var s = "";
		    if(str.length == 0) return "";
		    s = str.replace(/&/g,"&amp;");
		    s = s.replace(/</g,"&lt;");
		    s = s.replace(/>/g,"&gt;");
		    s = s.replace(/ /g,"&nbsp;");
		    s = s.replace(/\'/g,"&#39;");
		    s = s.replace(/\"/g,"&quot;");
		    return s;  
	    }
		// 用正则表达式实现html解码
		var htmlDecodeByRegExp = function(str){  
		    var s = "";
		    if(str.length == 0) return "";
		    s = str.replace(/&amp;/g,"&");
		    s = s.replace(/&lt;/g,"<");
		    s = s.replace(/&gt;/g,">");
		    s = s.replace(/&nbsp;/g," ");
		    s = s.replace(/&#39;/g,"\'"); 
		    s = s.replace(/&quot;/g,"\"");
		    s = s.replace(/&#60;/g,"\<");
		    s = s.replace(/&#60;/g,"\<");
		    s = s.replace(/&#34;/g,"\"");
		    return s;  
	    }
		
		return {
			"initPageData" 			: initPageData,// 初始化页面
			"initDetailGridPage" 	: initDetailGridPage,// 初始化主表是明细表的页面
			"initDoubleMainListPage": initDoubleMainListPage,// 初始化双主表页面
			"queryHandler" 			: queryHandler,// 页面查询按钮事件处理函数
			"detailPageListener" 	: detailPageListener,// 主表为明细的页面状态切换函数
			"doubleMainListener"    : doubleMainListener,// 双主表页面状态切换函数
			"doCommonWorkFlow" 		: doCommonWorkFlow,// 通用走流程
			"payMoneyHandler" 		: payMoneyHandler,// 通用支付
			"signSendHandler" 		: signSendHandler,// 通用签章发送和再次发送事件处理函数
			"doVoucherSee" 			: doVoucherSee,// 凭证查看
			"doVoucherPreview" 		: doVoucherPreview,// 凭证预览
			"doCreateBill" 			: doCreateBill,// 生成
			"doCancelCreateBill" 	: doCancelCreateBill,// 通用撤销生成
			"doPreviewPrint"        : doPreviewPrint,//报表打印
			"doMultiPrint"          : doMultiPrint,//报表批量打印
			"getOperaParam" 		: getOperaParam,// 组装操作按钮事件后台所需参数
			"inputAgentBusinessNo"  : inputAgentBusinessNo,// 展示补录交易流水号弹框
			"saveAgentBusinessNo"   : saveAgentBusinessNo, // 保存交易流水号
			"closeAgentBusinessNo"  : closeAgentBusinessNo,// 关闭补录交易流水号弹窗
			"initFinanceCode" 		: initFinanceCode,// 初始化财政机构
			"savePayeeBankNo" 		: savePayeeBankNo,// 收款行行号录入模态框保存事件
			"closeBankNoInput" 		: closeBankNoInput,// 收款行行号录入模态框关闭事件
			"initBankNoList" 		: initBankNoList,// 收款行行号列表查询
			"payeeBankNoAdd" 		: payeeBankNoAdd,//  收款行行号新增
			"payeeBankNoUpdate" 	: payeeBankNoUpdate,//  收款行行号修改
			"payeeBankNoDelete"		: payeeBankNoDelete,// 收款行行号 删除
			"payeeBankNoClear" 		: payeeBankNoClear,// 清空
			"saveAddPayeeBankNo" 	: saveAddPayeeBankNo,// 新增收款行行号模态框保存事件
			"closeAddPayeeBankNo" 	: closeAddPayeeBankNo,// 新增收款行行号模态框退出事件
			"checkDetail"           : checkDetail,
			"queryVouStatus"        : queryVouStatus,
			"setCookie" 			: setCookie,
			"getCookie" 			: getCookie,
			"htmlEncodeByRegExp"    : htmlEncodeByRegExp,
			"htmlDecodeByRegExp"    : htmlDecodeByRegExp,
		};
	});