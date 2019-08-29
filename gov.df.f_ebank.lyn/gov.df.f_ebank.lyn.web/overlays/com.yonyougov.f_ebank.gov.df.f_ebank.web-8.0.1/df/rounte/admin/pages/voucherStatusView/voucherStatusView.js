define(['text!pages/voucherStatusView/voucherStatusView.html',
	'jquery','bootstrap','ip','dateZH',
	'datatables.net-bs','datatables.net-autofill-bs', 
    'datatables.net-buttons-bs', 'datatables.net-colreorder',
    'datatables.net-rowreorder', 'datatables.net-select',
    'datatables.net-scroller','datatables.net-keyTable', 
    'datatables.net-responsive','initDataTableUtil' ],function(html){
	var init =function(element,param){ 
		document.title=ip.getUrlParameter("menuname");
		var options = ip.getCommonOptions({});
        var viewModel = {
			tokenid : ip.getTokenId(),
		};
		viewModel.initData = function() {
			$.ajax({
				url : "/df/init/initMsg.do",
				type : "GET",
				dataType : "json",
				async : true,
				data : options,
				success : function(datas) {
					viewModel.viewList = datas.viewlist;// 视图信息
					viewModel.resList = datas.reslist;// 资源信息
					for (var n = 0; n < viewModel.viewList.length; n++) {
						var view = viewModel.viewList[n];
						if (view.viewtype == '003') {// 查询视图
							viewModel.planQueryViewId = view.viewid;
							viewModel.planSearchViewModel = ip
									.initArea(view.viewDetail,
											"search", view.viewid
													.substring(1,
															37),
											"planSearchArea");
							viewModel.getVt_code();
							viewModel.getFinanceCode();
							viewModel.getYear();
						}
					}
				}
			});
		};
		// 初始化界面数据
		initUi = function(data) {
			$('#gridDatatable').DataTable( {
			 destroy: true,
 			    searching: false,
 		        paging: false,
 		        bSort: false,
 		        bInfo: false,
		        language: {
		            'zeroRecords': '没有检索到数据'
		            },
		        data:data,
		        columns: [
		            { data: 'voucher_no' },
		            { data: 'vt_code' },
		            { data: 'status' }
		        ]
		    } );
		};
		fSelect = function() {
			document.getElementById("view").disabled = true;
			var voucher_no=document.getElementById("voucher_no"
					+ "-" + viewModel.planQueryViewId.substring(1, 37)).value;
			if(voucher_no==null||voucher_no==''){
				ip.warnJumpMsg("凭证号不能为空，请填写！！！",0,0,true);
				document.getElementById("view").disabled = false;
				return;
			}
			options["voucher_no"] = voucher_no;
			options["vt_code"] = document.getElementById("vt_code" + "-"
					+ viewModel.planQueryViewId.substring(1, 37)).value;
			options["finance_code"] =document.getElementById("finance_code" + "-"
					+ viewModel.planQueryViewId.substring(1, 37)).value;
			options["set_year"] =document.getElementById("set_year" + "-"
					+ viewModel.planQueryViewId.substring(1, 37)).value;
			$.ajax({
				url : "/df/f_ebank/voucherStatusView/getVoucherStatus.do?tokenid=" + viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : options,
				success : function(data) {
					if (data.flag) {//0未接收1接收成功2接收失败3签收成功4签收失败5被退回6回单未接收 7、回单已接收 8、回单接收失败 9、回单签收成功 10、回单签收失败 11、回单被退回12发送单已收到回单13数据未发送14数据未发送
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
					    	 ip.warnJumpMsg("凭证状态查询失败！！！",0,0,true);
					     	 return;
						}
						 var dataStatus={
	 	 							"voucher_no":options["voucher_no"],
	 	 							"vt_code":options["vt_code"],
	 	 							"status":status
	 	 						 };
						 var data=[];
						 data.push(dataStatus);
						 initUi(data);
					} else {
						ip.warnJumpMsg(data.result,0,0,true);
					}
					document.getElementById("view").disabled = false;
				}
			});
		}
		//获取凭证类型
		viewModel.getVt_code = function() {		
			$.ajax({
				url : "/df/f_ebank/voucherSignHandler/getVt_code.do?tokenid="
						+ viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "nocache"
				},
				success : function(datas) {
					if (datas.errorCode == "0") {
						var html = "";							
						for ( var i = 0; i < datas.dataDetail.length; i++) {
							html+="<option value="+datas.dataDetail[i].chr_code+">"+datas.dataDetail[i].chr_name1+"</option>";
						}
						$("#vt_code-"+viewModel.planQueryViewId.substring(
								1, 37)).html(html);
					} else {
						ip.ipInfoJump("加载参数失败！原因：" + datas.result, "error");
					}
				}
			})

		}
		//获取财政机构
		viewModel.getFinanceCode = function() {
			$.ajax({
				url : "/df/f_ebank/config/getFinanceOrgData.do?tokenid="
					+ viewModel.tokenid,
				type : "GET",
				dataType : "json",
				data : {
					"ajax" : "nocache"
				},
				success : function(datas) {
					if (datas.errorCode == "0") {
						var html = "";							
						for ( var i = 0; i < datas.dataDetail.length; i++) {
							html+="<option value="+datas.dataDetail[i].chr_code+">"+datas.dataDetail[i].chr_name+"</option>";
						}
						$("#finance_code-"+viewModel.planQueryViewId.substring(
								1, 37)).html(html);
					} else {
						ip.ipInfoJump("加载财政机构参数失败！原因：" + datas.result, "error");
					}
				}
			})
		}
		//获取年度
		viewModel.getYear = function() {
			$.ajax({
				url : "/df/f_ebank/config/getYearData.do?tokenid="
					+ viewModel.tokenid,
				type : "GET",
				dataType : "json",
				data : {
					"ajax" : "nocache"
				},
				async : false,
				success : function(datas) {
					if (datas.errorCode == "0") {
						var d = new Date();
						var html = "";							
						for ( var i = 0; i < datas.setYear.length; i++) {
							
							if(datas.setYear[i].set_year==d.getFullYear()){
							     html+="<option selected='selected' value="+datas.setYear[i].set_year+">"+datas.setYear[i].year_name+"</option>";
							}else{
								html+="<option value="+datas.setYear[i].set_year+">"+datas.setYear[i].year_name+"</option>";
							}
						}
						$("#set_year-"+viewModel.planQueryViewId.substring(
								1, 37)).html(html);
					} else {
						ip.warnJumpMsg("加载年度参数失败！原因："+ datas.result,0,0,true);
					}
				}
			})
		}
		pageInit =function(){
			viewModel.initData();
			initUi();
		}

		$(element).html(html);	
		pageInit();
	}
	return {
		init:init
	}
});
