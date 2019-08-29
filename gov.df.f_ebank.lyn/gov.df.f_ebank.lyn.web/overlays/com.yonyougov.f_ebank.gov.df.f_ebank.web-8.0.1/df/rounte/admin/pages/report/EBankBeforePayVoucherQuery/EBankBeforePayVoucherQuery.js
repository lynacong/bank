define(['text!pages/report/EBankBeforePayVoucherQuery/EBankBeforePayVoucherQuery.html',
     	'jquery','knockout', 'reportUtil','jquery.media','uui','tree',
    	'bootstrap','ip','ebankConstants','ebankCommonUtil', 'dateZH','datatables.net-bs', 
        'datatables.net-autofill-bs', "calendar",
        'datatables.net-buttons-bs', 'datatables.net-colreorder',
        'datatables.net-rowreorder', 'datatables.net-select',
        'datatables.net-scroller',
        'datatables.net-keyTable', 
        'datatables.net-responsive','initDataTableUtil' ],
		function(html) {
	var init =function(element,param){ 	
		document.title=ip.getUrlParameter("menuname"); 
			
			var requesting=false;
			
			var mainOptions = ip.getCommonOptions({});
			var voucherOptions=ip.getCommonOptions({});
			var queryURL=EBankConstant.CommonUrl.query;
			//var vtCode=ip.getUrlParameter("vt_code");
			mainOptions["operate_width"] =50;
			mainOptions["condition"]="vt_code in ('5201','8202') ";
			var viewModel = {
				tokenid : ip.getTokenId(),
			};
			
			
			//根据主单查询明细
			$("body").on('click', '#modalMianGridArea tr', function () {
			       var dataSrc = $('#modalMianGridArea').DataTable().row($(this)).data();
				   var id = dataSrc.id;
				   voucherOptions["id"]=id;
				   voucherOptions["loadDataFlag"]=true;
				   voucherOptions["finance_code"] = $("#finance_code-"+viewModel.planQueryViewId.substring(1, 37)).val();
					voucherOptions["set_year"] = mainOptions["set_year"];
				   viewModel.voucherGridViewModel.ajax.reload(null, true);
			  	});
			
			
			//构建传入后台的billNos
			buildBillIdsAndFinanceCode = function(){
				var billnosAndRgCodereturn = new Array();
				var selectRows;
					 selectRows = $('#modalMianGridArea').DataTable().rows('.selected');				
				/*if (selectRows.indexes().length ==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
				    return;
				};*/
				for (var i = 0; i < selectRows.indexes().length; i++) {
					var temp = {};
					temp["bill_no"] = selectRows.data()[i].bill_no;
					temp["finance_code"] = selectRows.data()[i].finance_code;
					billnosAndRgCodereturn.push(temp);
				}
				return billnosAndRgCodereturn;
			};
			
			//查询
			fSelect=function(){
				var queryFlag = viewModel.getQueryView();
				if(queryFlag){
					viewModel.mainViewModel.ajax.reload(null, true);
					clearDetail();
				}
			};
			
			
			viewModel.getQueryView = function() {
				var pkCode=document.getElementById("pk_code"
						+ "-" + viewModel.planQueryViewId.substring(1, 37)).value;
				var billStatus=document.getElementById("bill_status"
						+ "-" + viewModel.planQueryViewId.substring(1, 37)).value;
				mainOptions["condition"]=" is_dxp!='1' ";
				var searchCondition = ip.getAreaData(viewModel.planSearchViewModel);
				var queryFlag = searchCondition.conditionFlag;
				if(queryFlag){
					if(pkCode==-1){
						mainOptions["condition"]="vt_code in ('5201','8202') ";
					}else if(pkCode==11){
						mainOptions["condition"]="vt_code ='5201' ";
					}else{
						mainOptions["condition"]="vt_code ='8202' ";
					}
					mainOptions["condition"] = mainOptions["condition"] + searchCondition.condition;
					mainOptions["finance_code"] = document.getElementById("finance_code" + "-"
							+ viewModel.planQueryViewId.substring(1, 37)).value;
					mainOptions["set_year"] = document.getElementById("set_year" + "-"
							+ viewModel.planQueryViewId.substring(1, 37)).value;
					if(billStatus==0){
						mainOptions["condition"]=mainOptions["condition"]+"and bill_status in ('0','1')";
					}else if(billStatus==6){
						mainOptions["condition"]=mainOptions["condition"]+"and bill_status in ('6','7')";
					}else if(billStatus!=null&&billStatus!=''&&billStatus!=-1){
						mainOptions["condition"]=mainOptions["condition"]+"and bill_status='"+billStatus+"'";
					}
				}
				return queryFlag;
			};
			
			
			//主单上的操作
			var modalMianGridArea = function(obj) {
				obj.element.style["text-align"]="center";
						obj.element.innerHTML='<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
	        	            + '" onclick="doVoucherSee(this.id)" class="iconmenu icon-previews" title="凭证查看"></a></div>';
			};		

			//配置列表
			viewModel.initData = function() {
				$.ajax({
					url : "/df/init/initMsg.do",
					type : "GET",
					dataType : "json",
					async : true,
					data : mainOptions,
					success : function(datas) {
						viewModel.viewList = datas.viewlist;// 视图信息
						viewModel.resList = datas.reslist;// 资源信息
						viewModel.coaId = datas.coaId;// coaid
						viewModel.coaDetails = datas.coaDetail;// coa明细
						viewModel.relations = datas.relationlist;// 关联关系
						
						//var status=$("#pz_status option:selected").val();
						for ( var n = 0; n < viewModel.viewList.length; n++) {
							var view = viewModel.viewList[n];
							if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {//列表视图
								if (view.orders == '1') {
									viewModel.mainViewId=view.viewid;
									mainOptions["tableViewId"] = view.viewid;
									mainOptions["queryViewId"] = viewModel.planQueryViewId;
									mainOptions["isSetValue"] = "false";
									//viewModel.mainViewModel = ip.initGrid(view, 'modalMianGridArea', queryURL+"/doFind.do", mainOptions, 0, false);
									mainOptions["isDetailQuery"] = "false";  //是否查询明细
									mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_BILL;
									mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									mainOptions["isWorkFlowRelated"] = "false";
									mainOptions["relationBillId"] = "voucher_bill_id";
									//mainOptions["status"] = status;
									//viewModel.getQueryView();
									mainOptions["pageInfo"] = "10,0";
									mainOptions["finance_code"] = "000000";
									mainOptions["set_year"] = mainOptions["svSetYear"];
									mainOptions["isDataTables"]=true; 
									mainOptions["loadDataFlag"]=true;
									mainOptions["scrollY"]= $("#content").innerHeight()*0.28 + "px";
									mainOptions["selectflag"]=false;
									viewModel.mainViewModel = initDataTables("modalMianGridArea",queryURL+"/doFind.do",mainOptions,view.viewDetail);
									
								} else if (view.orders == '2') {
									voucherOptions["tableViewId"] = view.viewid;
									voucherOptions["isSetValue"] = "false";
									voucherOptions["isDetailQuery"] = "true";  //是否查询明细
									voucherOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									voucherOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									voucherOptions["isWorkFlowRelated"] = "false";
									voucherOptions["relationBillId"] = "voucher_bill_id";
									voucherOptions["pageInfo"] = "10,0";
									voucherOptions["set_year"] = voucherOptions["svSetYear"];
									voucherOptions["isDataTables"]=true; 
									voucherOptions["loadDataFlag"]=false;
									voucherOptions["selectflag"]=false;
									voucherOptions["scrollY"]= $("#content").innerHeight()*0.28 + "px";
									viewModel.voucherGridViewModel = initDataTables("modalSubsysGridArea",queryURL+"/doFind.do",voucherOptions,view.viewDetail);
								}

							}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){
								viewModel.planQueryViewId = view.viewid;
								viewModel.planSearchViewModel = ip
										.initArea(view.viewDetail,
												"search", view.viewid
														.substring(1,
																37),
												"planSearchArea");
								/*viewModel.getFinanceCode();
								viewModel.getYear();*/
								getFinancreCode("-"+ viewModel.planQueryViewId.substring(1, 37),mainOptions,viewModel.tokenid);
								getYear("-"+ viewModel.planQueryViewId.substring(1, 37),viewModel.tokenid);
							}
						}
						var menuBtnWidth = $(".mainLabel").innerWidth();
						$(".button-fixed").css("width",menuBtnWidth);
					}
				});
			};
			

			printBillfunction=function(evt){

				var e = evt || window.event;
				//var dataList = $('#modalMianGridArea').DataTable().rows().data();
				//var dataList=viewModel.mainViewModel.gridData.getAllRows();
				//var dataList = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getAllRows();
				
				var length =$('#modalMianGridArea').DataTable().rows().data().length;
				
				var dataList = new Array();
				for (var i = 0; i < length; i++) {

					dataList.push($('#modalMianGridArea').DataTable().row(i).data());
				}
				previewFile(dataList,ip.getUrlParameter("reportmould"),"0",ip.getTokenId());
				//previewFileNew(dataList,ip.getUrlParameter("reportmould"),"0",ip.getTokenId());

			};
			
			exportExcl=function(evt){

				var e = evt || window.event;
				//var dataList = $('#modalMianGridArea').DataTable().rows().data();
				//var dataList=viewModel.mainViewModel.gridData.getAllRows();
				//var dataList = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getAllRows();
				
				var length =$('#modalMianGridArea').DataTable().rows().data().length;
				
				var dataList = new Array();
				for (var i = 0; i < length; i++) {

					dataList.push($('#modalMianGridArea').DataTable().row(i).data());
				}
				exportTxt(dataList,ip.getUrlParameter("reportmould"),"0",ip.getTokenId());
				//previewFileNew(dataList,ip.getUrlParameter("reportmould"),"0",ip.getTokenId());

			};
			   clearDetail= function() {
				   voucherOptions["loadDataFlag"]=false;
				     viewModel.voucherGridViewModel.clear();
				     viewModel.voucherGridViewModel.draw();
				}
			//初始化财政和年度
			viewModel.initParam = function(){
				viewModel.initData();
			};
			
			//画html
			$(element).html(html);	
			
			pageInit =function(){
				viewModel.initParam();	
			};
			
			pageInit();
		};
		return {
			'template':html,
		    init:init
		};
	});
