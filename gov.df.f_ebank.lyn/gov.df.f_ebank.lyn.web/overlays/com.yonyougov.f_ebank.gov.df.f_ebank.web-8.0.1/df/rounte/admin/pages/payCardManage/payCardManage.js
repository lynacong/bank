define(['text!pages/payCardManage/payCardManage.html','operate','commonUtil',      
    'jquery','uui','tree','es5sham','html5','calendar',
	'bootstrap','ip','ebankConstants','datatables.net-bs', 
    'datatables.net-select','initDataTableUtil'],function(html,operate,commonUtil){
		var init =function(element,param){
			var requesting = false;
			var vtCode = ip.getUrlParameter("vt_code");
			var viewModel = {
				tokenid : ip.getTokenId()
			};
			var mainOptions = ip.getCommonOptions({});
			var changeOption = ip.getCommonOptions({});

			// 查询函数重写，财政机构放在condition字段中传回后台
			queryHandler = function() {
				var queryViewId = viewModel.queryViewId.substring(1, 37);
				mainOptions["condition"] = '1=1 ';
				var searchCondition = ip.getAreaData(viewModel.searchViewModel);
				// 查询条件是否合法 true：合法，false：不合法
				var conditionFlag = searchCondition.conditionFlag;
				if (conditionFlag) {
					mainOptions["condition"] += searchCondition.condition;
					var financeCode = $("#finance_code-" + queryViewId).val();
					if(financeCode && financeCode != "000000"){
						mainOptions["condition"] += "and finance_code='" + financeCode + "'";
					}
					$("#mainGridArea").DataTable().ajax.reload(null, true);
				}
			};
			//手工录入
			inputInfo = function() {
				$("#titleTextCardInput").text("手工录入");
				operate.clearData("cardInputSetModel");
				$("#cardInputSetModel").modal("show");
			};
			
			//手工录入确定
			cardInputEnsure = function(){
				var flag= operate.doValidateNull();
				if(!flag) {//如果数据未填写完整
					ip.warnJumpMsg("请将红色带*数据填写完整",0,0,true);
					return ;
				}
				var cardInputSetViewIdLength = viewModel.cardInputSetViewId.length;
				var suffix = viewModel.cardInputSetViewId.substring(1,cardInputSetViewIdLength-1);
			    //校验身份证号，电话号
				if(operate.doValidateCommon("cardholderno-"+ suffix,"ID") == false){
					return false;
				};
				if(operate.doValidateCommon("mobilenum-"+ suffix,"PHONE") == false){
					return false;
				};
				var creditnumVal = $("input[name='creditnum']").val();
				if(creditnumVal != undefined && creditnumVal != '' && !ip.validateMoney(creditnumVal)){
					ip.warnJumpMsg("金额格式有误，小数点后只保留两位！",0,0,true);
					return false;
				};
				
				var cardmadedate = $("input[name='cardmadedate']").val();
				var cardbegindate = $("input[name='cardbegindate']").val();
				var cardenddate = $("input[name='cardenddate']").val();
				if(!ip.compareSearchTime(cardmadedate,cardbegindate)){
					ip.warnJumpMsg("制卡日期应早于开卡日期！",0,0,true);
					return false;
				}
				if(!ip.compareSearchTime(cardbegindate,cardenddate)){
					ip.warnJumpMsg("开卡日期应早于停用日期！",0,0,true);
					return false;
				}
				//组装向后台传的数据
				var infos = operate.getDataFromDiv("cardInputSetArea");
				//预算单位在后台处理了，所以前台只需要把输入框中的值原封不动的传过去
				infos.agency = $("#agencycode-"+suffix).val();
				infos['set_year'] = mainOptions["svSetYear"];
				viewModel.saveInfo(infos);
			};
			//录入保存
			viewModel.saveInfo = function(infos){
				infosJson = JSON.stringify(infos);
				ip.processInfo("正在处理中，请稍候......", true);
				$.ajax({
					url: "/df/f_ebank/payCardManage/savePayCard.do?tokenid=" + viewModel.tokenid,
					type: 'GET',
					dataType: 'json',
					data: {
						"infos" : infosJson,
							},
					success: function (data) {
						ip.processInfo("正在处理中，请稍候......", false);
						if(data.errorCode=="0"){
							$("#cardInputSetModel").modal('hide');
							ip.warnJumpMsg("保存成功", 0, 0, true);
							queryHandler();
						}else{
							ip.warnJumpMsg("保存失败！"+data.result,0,0,true);
							return;
						}
						
					} 
				});
			};
			
			//构建传入后头的cardIds
			viewModel.buildCardIdsAndFinanceCode = function(){
				var cardIdsAndFinanceCode = new Array();
				var selectRows = $('#mainGridArea').DataTable().rows('.selected');
				for (var i = 0; i < selectRows.indexes().length; i++) {
					var curIndexData = selectRows.data()[i];
					var temp = {};
					temp.cardId = curIndexData.cardid;
					temp.set_year = curIndexData.set_year;
					temp.finance_code = curIndexData.finance_code;
					temp.cardstatus = curIndexData.cardstatus;
					cardIdsAndFinanceCode.push(temp);
				}
				return cardIdsAndFinanceCode;
			};
			//发送卡信息到财政按钮
			sendCardInfoToCZ = function() {
				//判断是否选中数据
				var buildCardIdsAndFinanceCode = viewModel.buildCardIdsAndFinanceCode();
				if(buildCardIdsAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！",0,0,true);
					return;
				} 
				var postData = ip.getCommonOptions({});
				var info = viewModel.buildCardIdsAndFinanceCode();
				postData["cardIdsAndFinanceCode"] = JSON.stringify(info);
				postData["setYear"] = buildCardIdsAndFinanceCode[0].set_year;
				postData["vtCode"] = "2221";
				ip.processInfo("正在处理中，请稍候......", true);
				$.ajax({
					url : "/df/f_ebank/payCardManage/sendCardInfoToCZ.do?tokenid="
					+ viewModel.tokenid,
					type : "POST",
					data : postData,
					success : function(data){
						ip.processInfo("正在处理中，请稍候......", false);
						if(data.is_success=="0"){
							ip.warnJumpMsg(data.error_msg, 0, 0, true);
						}else{
							queryHandler();
							ip.warnJumpMsg("发送成功！", 0, 0, true);
						}
					}
				});
				
			};
			//根据财政机构显示辅助录入树
			showAssitTreeByFinance = function(id,name,title){
				var finance_code = $("#mainGridArea").DataTable().rows(".selected").data()[0].finance_code;
				var condition = "";
				condition ="and finance_code = '"+ finance_code +"'";
				ip.showAssitTree(id,name,0,{},0,title,"",condition);
			};
			//变更卡号或单位
			changeModalShow = function(btnParam) {
				var id = btnParam.updateType;
				//判断是否选中数据
				var buildCardIdsAndFinanceCode = viewModel.buildCardIdsAndFinanceCode();
				if(buildCardIdsAndFinanceCode.length != 1){
					ip.warnJumpMsg("请先选择一条数据!",0,0,true);
					return;
				} 
				var selectRowData = $("#mainGridArea").DataTable().rows(".selected").data()[0];
				//赋值
				operate.initEditData("cardNoSetArea",selectRowData);
				if(id =="bgkh"){
					$("#changeModalTitle").text("变更卡号");
					$("#originAgencyDiv").css("display","none");
					$("#newAgencyDiv").css("display","none");
					$("#newCardNoDiv").css("display","block");
					$("#newcardno").val("");
					$("#cardNoSetArea input[name!='newcardno'],#cardNoSetArea select").attr("disabled",true);
					$("#cardNoSetArea input[name='newcardno']").attr("disabled",false);
				}else if(id == "bgdw"){
					$("#AGENCY-inputOrigin").val(selectRowData.agencycode + " " + selectRowData.agencyname);
					$("#changeModalTitle").text("变更单位");
					$("#originAgencyDiv").css("display","block");
					$("#newAgencyDiv").css("display","block");
					$("#newCardNoDiv").css("display","none");
					$("#AGENCY-inputNew").val("");					
					$("#cardNoSetArea input[name!='agencynew'],#cardNoSetArea select").attr("disabled",true);
					$("#cardNoSetArea input[name='agencynew']").attr("disabled",false);
				}
				payCardId = selectRowData.id;
				cardId = selectRowData.cardid;
				$("#changeModal").modal("show");
			};
			//变更弹框【确定】事件
			changeEnsure = function() {
				var changeModalTitle = $("#changeModalTitle").text();
				var updateType = "";
				var cardChangeType = "";
				
				var data = $("#mainGridArea").DataTable().rows(".selected").data()[0];
				if(changeModalTitle == "变更卡号"){
					var newcardno = $("#newcardno").val();
					if(newcardno == null || newcardno.trim() == ""){
						ip.warnJumpMsg("新卡号不能为空", 0, 0, true);
						return false;
					}
					if(newcardno == $("#cardno").val()){
						ip.warnJumpMsg("新卡号与旧卡号不能相同！请重新填写！", 0, 0, true);
						return false;
					}
					updateType = "cardNo";
					cardChangeType = "1";
					data.newcardno = newcardno;
					changeOption["newCardNo"]=newcardno;
				}else if(changeModalTitle == "变更单位"){
					var newagency = $("#AGENCY-inputNew").val();
					if(newagency == null || newagency.trim() == ""){
						ip.warnJumpMsg("新预算单位不能为空", 0, 0, true);
						return false;
					}
					if(newagency == $("#AGENCY-inputOrigin").val()){
						ip.warnJumpMsg("新单位与旧单位不能相同！请重新填写！", 0, 0, true);
						return false;
					}
					newagency = newagency.split(" ");
					data.newAgencyCode = newagency[0];
					data.newAgencyName = newagency[1];
					updateType = "agency";
					cardChangeType = "2";
				}
				data.vtCode = "2222";
				data.cardChangeType = cardChangeType;
				data.updateType = updateType;
				dataJson = JSON.stringify(data);
				changeOption["data"] = dataJson;
				changeOption["payCardId"] = payCardId;
				changeOption["updateType"] = updateType;
				changeOption["ajax"]="noCache";
				ip.processInfo("正在处理中，请稍候......", true);
				$.ajax({
					url: "/df/f_ebank/payCardManage/updatePayCard.do?tokenid=" + viewModel.tokenid,
					type: 'POST',
					dataType: 'json',
					data: changeOption,
					success: function (data) {
						ip.processInfo("正在处理中，请稍候......", false);
						$("#changeModal").modal('hide');
						if(data.is_success == "1"){
							queryHandler();
							ip.warnJumpMsg("修改成功！", 0, 0, true);							
						}else{
							ip.warnJumpMsg(data.error_msg, 0, 0, true);
						}
					} 
				});
			};
			//启用按钮
			startStopCancelFunc = function(btnParam) {
				var id = btnParam.actionType;
				var updateType = "status";
				//判断是否选中数据
				var buildCardIdsAndFinanceCode = viewModel.buildCardIdsAndFinanceCode();
				if(buildCardIdsAndFinanceCode.length != 1){
					ip.warnJumpMsg("请先选择一条数据!",0,0,true);
					return;
				}
				var currentStatus ="";
				var conflictStatus = "";
				var warnMsg = "";
				if(id == "start"){
					currentStatus = "1";
					conflictStatus = "3";
					warnMsg = "存在已启用或已注销的数据，请重新选择数据！";
				}else if(id == "stop"){
					currentStatus = "2";
					conflictStatus = "3";
					warnMsg = "存在已停用或已注销的数据，请重新选择数据！";
				}else if(id == "cancel"){
					currentStatus = "3";
					conflictStatus = "1";
					warnMsg = "存在已注销或已启用的数据，请重新选择数据！";
				}
				var cards = [];
				for ( var i = 0; i < buildCardIdsAndFinanceCode.length; i++) {
					if(buildCardIdsAndFinanceCode[i].cardstatus == currentStatus||buildCardIdsAndFinanceCode[i].cardstatus == conflictStatus){
						ip.warnJumpMsg(warnMsg,null,true,true);
						return;
					}
					buildCardIdsAndFinanceCode[i].newStatus = currentStatus;
					buildCardIdsAndFinanceCode[i].cardChangeType = "3";
					buildCardIdsAndFinanceCode[i].vtCode = "2222";
					cards.push(buildCardIdsAndFinanceCode[i]);
				}
				
				//检测区划是否一致   先放着勿删除
				/*for ( var i = 0; i < (cards.length-1) ; i++) {
					if(cards[i].financeCode!=cards[i+1].financeCode ){
						requesting=false;
						ip.warnJumpMsg("所选财政机构不一致，请重新选择！", 0, 0, true);
						return false;
					}
				}*/
				cardsJson = JSON.stringify(cards);
				changeOption["ajax"]="noCache";
				changeOption["data"]=cardsJson;
				changeOption["updateType"]=updateType;
				ip.processInfo("正在处理中，请稍候......", true);
				$.ajax({
					url: "/df/f_ebank/payCardManage/updatePayCard.do?tokenid=" + viewModel.tokenid,
					type: 'POST',
					dataType: 'json',
					data: changeOption,
					success: function (data) {
						if(data.is_success == "1"){
							ip.processInfo("正在处理中，请稍候......", false);
							ip.warnJumpMsg("操作成功！", 0, 0, true);							
							queryHandler();
						}else{
							ip.warnJumpMsg(data.error_msg, 0, 0, true);
						}
					}
				});
			};
			//公务卡删除按钮
			deleteCardBtn = function() {
				//判断是否选中数据
				var buildCardIdsAndFinanceCode = viewModel.buildCardIdsAndFinanceCode();
				if(buildCardIdsAndFinanceCode.length != 1){
					ip.warnJumpMsg("请先选择一条数据!",0,0,true);
					return;
				}
				var cards = [];
				for ( var i = 0; i < buildCardIdsAndFinanceCode.length; i++) {
					//删除前，检查选中数据的状态。处于“注销”状态的记录才被允许删除。
					var selectedData = $("#mainGridArea").DataTable().rows(".selected").data()[i];
					var cardNo = selectedData.cardno;
					//卡号
					if(cardNo != null && cardNo.trim() != ""){
						//卡状态
						var cardStatus = selectedData.cardstatus;
						if(cardStatus != null && cardStatus.trim() != "" ){
							if(cardStatus == "1"){
								ip.warnJumpMsg('卡号：'+cardNo+' 为"启用"状态，不允许删除！', 0, 0, true);
								return ;
							}else if(cardStatus == "2"){
								ip.warnJumpMsg('卡号：'+cardNo+' 为"停用"状态，不允许删除！', 0, 0, true);
								return ;
							}
						}else {
							requesting=false;
							ip.warnJumpMsg("卡状态为空，不允许继续操作！", 0, 0, true);
							return ;
						}
					}else {
						requesting=false;
						ip.warnJumpMsg("卡号为空，不允许继续操作！", 0, 0, true);
						return ;
					}
					var card = {} ;
					card.cardId = selectedData.cardid;
					card.setYear = selectedData.set_year;
					card.financeCode = selectedData.finance_code;
					cards.push(card);
				}
				//检测年度及区划是否一致
				for ( var i = 0; i < (cards.length-1) ; i++) {
					if(cards[i].setYear!=cards[i+1].setYear || cards[i].financeCode!=cards[i+1].financeCode){
						requesting=false;
						ip.warnJumpMsg("所选数据年度或财政机构不一致，请重新选择！", 0, 0, true);
						return false;
					}
				}
				//删除提示信息
				ip.warnJumpMsg("确定要删除吗？","del", "cCla");
				    
			    $("#del").on("click", function() {
			    	$("#config-modal").remove();
			    	viewModel.deleteCard(cards);
				});
				$(".cCla").on("click", function() {
					$("#config-modal").remove();
				});
			};
			//删除公务卡
			viewModel.deleteCard = function(cards) {
				var cardsJson = JSON.stringify(cards);
				ip.processInfo("正在处理中，请稍候......", true);
				$.ajax({
					url: "/df/f_ebank/payCardManage/deletePayCard.do?tokenid=" + viewModel.tokenid,
					type: 'GET',
					dataType: 'json',
					data: {
						"cards" : cardsJson,
							},
					success: function (data) {
						ip.processInfo("正在处理中，请稍候......", false);
						if(data.errorCode=="0"){
							ip.warnJumpMsg("删除成功！",0,0,true);
							queryHandler();
						}else{
							ip.warnJumpMsg("删除失败！",0,0,true);
						};
					},
				});
			};
			//导入Excel
			viewModel.importExcel = function() {
				alert("excel");
			};
			//和卡务中心同步
			viewModel.synwtihcenter = function() {
				alert("syn");
			};
			viewModel.initData = function(){
				var pageData = commonUtil.initPageData("buttonArea", "searchArea", "", "mainGridArea", "detailContainer",
						mainOptions,null,false,"/df/f_ebank/payCardManage/getPayCardInfo.do");
				viewModel["searchViewModel"] = pageData.searchViewModel;//commonutil中初始化的查询视图信息
				viewModel["viewList"] = pageData.viewList;
				for ( var n = 0; n < viewModel.viewList.length; n++) {
					var view = viewModel.viewList[n];
					if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_INPUT) {//录入视图
						if (view.orders == "3"){//手工录入
							viewModel.cardInputSetViewId = view.viewid;
							viewModel.cardInputSetViewModel = ip.initArea(view.viewDetail, "edit", view.viewid.substring(1,37), "cardInputSetArea");
						};
					}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){// 查询视图
						if(view.orders == '1'){
							viewModel.queryViewId = view.viewid;// 查询视图id存入viewModel中
						}
					}
				};
				//视图初始化结束将录入视图必填项进行渲染
				var requireLabel=["cardbank","cardholder","cardholderno","agencycode","cardno",
	                "cardmadedate","cardbegindate","cardenddate","set_year","finance_code"];
				for(var i=0;i<requireLabel.length;i++){
					//给必填项label添加一个标识class
					$("#cardInputSetArea .form-control[name='"+ requireLabel[i] +"']").parent().prev("label").addClass("require");
					$("#cardInputSetArea .form-control[name='"+ requireLabel[i] +"']").parent().prev("label")
					.prepend("<span class='color-red'>*</span>");
				}
				commonUtil.initFinanceCode(viewModel.cardInputSetViewId.substring(1, 37),mainOptions);
			};
			$(element).html(html);
			viewModel.initData();
		};
		return {
	         init:init
	    };
	});
