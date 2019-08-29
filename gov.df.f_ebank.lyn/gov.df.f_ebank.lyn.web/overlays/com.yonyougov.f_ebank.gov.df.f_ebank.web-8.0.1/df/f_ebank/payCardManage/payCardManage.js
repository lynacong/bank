require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH',],
		function($, ko, echarts) {
			var requesting=false;
			var optionsMain = ip.getCommonOptions({});
			var optionsSub = ip.getCommonOptions({});
			
			var baseURL = EBankConstant.Ctx + "billStampSend";
			var vtCode=ip.getUrlParameter("vt_code");
			optionsMain["operate_width"] =50;

			var viewModel = {
				tokenid : ip.getTokenId()
			};
			
			//查询按钮
			viewModel.query = function(){
				viewModel.getQueryView();
				viewModel.refreshMainGrid();
				/*ip.setGrid(viewModel.mainGridViewModel,"/df/f_ebank/payCardManage/getPayCardInfo.do?tokenid="
					+ viewModel.tokenid, optionsMain);*/
			};
			
			//获取查询区参数
			viewModel.getQueryView = function(){
				//卡号
				var cardNo = document.getElementById("cardno"
						+ "-" + viewModel.queryViewId.substring(1, 37)).value;
				//卡类型
				var cardType = document.getElementById("cardtype"
						+ "-" + viewModel.queryViewId.substring(1, 37)).value;
				//卡状态
				var cardStatus = document.getElementById("cardstatus"
						+ "-" + viewModel.queryViewId.substring(1, 37)).value;
				//财政机构
				var financeCode = document.getElementById("finance_code"
						+ "-" + viewModel.queryViewId.substring(1, 37)).value;
				//预算单位
				var agency = document.getElementById("AGENCY"
						+ "-" + viewModel.queryViewId.substring(1, 37)).value;
				//是否发送
				var sffs=document.getElementById("sffs"
						+ "-" + viewModel.queryViewId.substring(1, 37)).value;
				optionsMain["condition"]='';
				if(cardNo!=null&&cardNo!=''){
					optionsMain["condition"]=optionsMain["condition"]+" and cardno='"+cardNo+"'";
				}
				if(cardType!=null&&cardType!=''){
					optionsMain["condition"]=optionsMain["condition"]+" and cardtype='"+cardType+"'";
				}
				if(cardStatus!=null&&cardStatus!=''){
					optionsMain["condition"]=optionsMain["condition"]+" and cardstatus='"+cardStatus+"'";
				}
				if(financeCode!=null&&financeCode!=''&&financeCode!="000000"){
					optionsMain["condition"]=optionsMain["condition"]+" and finance_code='"+financeCode+"'";
				}
				if(agency!=null&&agency!=''){
					agencyName = agency.split(" ")[1];
					optionsMain["condition"]=optionsMain["condition"]+" and agencyname='"+agencyName+"'";
				}
				if(sffs!=null&&sffs!=''){
					optionsMain["condition"]=optionsMain["condition"]+" and sffs='"+sffs+"'";
				}
			};
			
			//手工录入
			viewModel.inputInfo = function() {
				if(requesting){
					return;
				}
				requesting=true;
				$("#titleTextCardInput").text("手工录入");
				$('#cardbank-'+viewModel.cardInputSetViewId.substring(1,37)).val('');
				$('#cardholder-'+viewModel.cardInputSetViewId.substring(1,37)).val('');
				$('#cardholderrank-'+viewModel.cardInputSetViewId.substring(1,37)).val('');
				$('#cardholderno-'+viewModel.cardInputSetViewId.substring(1,37)).val('');
				$('#agencycode-'+viewModel.cardInputSetViewId.substring(1,37)).val('');
				$('#cardno-'+viewModel.cardInputSetViewId.substring(1,37)).val('');
				$('#creditnum-'+viewModel.cardInputSetViewId.substring(1,37)).val('');
				$('#mobilenum-'+viewModel.cardInputSetViewId.substring(1,37)).val('');
				$('#cardmadedate-'+viewModel.cardInputSetViewId.substring(1,37)).val('');
				$('#cardbegindate-'+viewModel.cardInputSetViewId.substring(1,37)).val('');
				$('#cardenddate-'+viewModel.cardInputSetViewId.substring(1,37)).val('');
				$('#cardtype-'+viewModel.cardInputSetViewId.substring(1,37)).val('');
				$('#cardstatus-'+viewModel.cardInputSetViewId.substring(1,37)).val('');
				$('#set_year-'+viewModel.cardInputSetViewId.substring(1,37)).val('');
				$('#finance_code-'+viewModel.cardInputSetViewId.substring(1,37)).val('');
				requesting=false;
				$("#cardInputSetModel").modal("show");
			};
			
			//手工录入确定
			viewModel.cardInputEnsure = function(){
				var cardBank = $('#'+viewModel.cardInputSetViewModel[0].id).val();
				if(cardBank == null || cardBank.trim() == ""){
					ip.warnJumpMsg("发卡行不能为空！",0,0,true);
					return false;
				}
				var cardHolder = $('#'+viewModel.cardInputSetViewModel[1].id).val();
				if(cardHolder == null || cardHolder.trim() == ""){
					ip.warnJumpMsg("持卡人姓名不能为空！",0,0,true);
					return false;
				}
				var cardHolderRank = $('#'+viewModel.cardInputSetViewModel[2].id).val();
				var cardHolderNo = $('#'+viewModel.cardInputSetViewModel[3].id).val();
				if(cardHolderNo == null || cardHolderNo.trim() == ""){
					ip.warnJumpMsg("身份证号不能为空！",0,0,true);
					return false;
				}
				var agency = $('#'+viewModel.cardInputSetViewModel[4].id).val();
				if(agency == null || agency.trim() == ""){
					ip.warnJumpMsg("预算单位不能为空！",0,0,true);
					return false;
				}
				var cardNo = $('#'+viewModel.cardInputSetViewModel[5].id).val();
				if(cardNo == null || cardNo.trim() == ""){
					ip.warnJumpMsg("卡号不能为空！",0,0,true);
					return false;
				}
				var creditNum = $('#'+viewModel.cardInputSetViewModel[6].id).val();
				var mobileNum = $('#'+viewModel.cardInputSetViewModel[7].id).val();
				var cardMadeDate = $('#'+viewModel.cardInputSetViewModel[8].id).val();
				if(cardMadeDate == null || cardMadeDate.trim() == ""){
					ip.warnJumpMsg("制卡日期不能为空！",0,0,true);
					return false;
				}
				var cardBeginDate = $('#'+viewModel.cardInputSetViewModel[9].id).val();
				if(cardBeginDate == null || cardBeginDate.trim() == ""){
					ip.warnJumpMsg("开卡日期不能为空！",0,0,true);
					return false;
				}
				var cardEndDate = $('#'+viewModel.cardInputSetViewModel[10].id).val();
				if(cardEndDate == null || cardEndDate.trim() == ""){
					ip.warnJumpMsg("停用日期不能为空！",0,0,true);
					return false;
				}
				var cardType = $('#'+viewModel.cardInputSetViewModel[11].id).val();
				var cardStatus = $('#'+viewModel.cardInputSetViewModel[12].id).val();
				var setYear = $('#'+viewModel.cardInputSetViewModel[13].id).val();
				if(setYear == null || setYear.trim() == ""){
					ip.warnJumpMsg("请选择年度！",0,0,true);
					return false;
				}
				var financeCode = $('#'+viewModel.cardInputSetViewModel[14].id).val();
				if(financeCode == null || financeCode.trim() == ""){
					ip.warnJumpMsg("请选择财政机构！",0,0,true);
					return false;
				}
				if(viewModel.isIdentifyId(cardHolderNo) == false){
					ip.warnJumpMsg("身份证号码不合法！",0,0,true);
					return false;
				}
				if(viewModel.isPhoneNum(mobileNum) == false){
					ip.warnJumpMsg("手机号码不合法！",0,0,true);
					return false;
				}
				if(cardMadeDate>cardBeginDate){
					ip.warnJumpMsg("制卡日期应早于开卡日期！",0,0,true);
					return false;
				}
				if(cardBeginDate>cardEndDate){
					ip.warnJumpMsg("开卡日期应早于停用日期！",0,0,true);
					return false;
				}
				
				//对信息进行保存
				//viewModel.saveInfo(infos);
				var infos = {};
				infos.cardBank = cardBank;
				infos.cardHolder = cardHolder;
				infos.cardHolderRank = cardHolderRank;
				infos.cardHolderNo = cardHolderNo;
				infos.agency = agency;
				infos.cardNo = cardNo;
				infos.creditNum = creditNum;
				infos.mobileNum = mobileNum;
				infos.cardMadeDate = cardMadeDate;
				infos.cardBeginDate = cardBeginDate;
				infos.cardEndDate = cardEndDate;
				infos.cardType = cardType;
				infos.cardStatus = cardStatus;
				infos.setYear = setYear;
				infos.financeCode = financeCode;
				viewModel.saveInfo(infos);
			};
			
			//身份证合法性校验
			viewModel.isIdentifyId = function (identifyId) {   
				// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
				var regIdentify = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
				return regIdentify.test(identifyId);
			};
			
			//手机号合法性校验
			viewModel.isPhoneNum = function (mobileNum) {
				var regPhone = /^1[3|4|5|7|8][0-9]{9}$/;
				return regPhone.test(mobileNum);
			};
			
			//录入保存
			viewModel.saveInfo = function(infos){
				infosJson = JSON.stringify(infos);
				$.ajax({
					url: "/df/f_ebank/payCardManage/savePayCard.do?tokenid=" + viewModel.tokenid,
					type: 'GET',
					dataType: 'json',
					data: {
						"infos" : infosJson,
							},
					success: function (data) {
						
						if(data.errorCode=="0"){
							$("#cardInputSetModel").modal('hide');
							ip.ipInfoJump("保存成功！","success");
							viewModel.refreshMainGrid();
						}else{
							ip.warnJumpMsg("保存失败！"+data.result,0,0,true);
							return;
						}
						
					} 
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
			
			//发送卡信息到财政按钮
			viewModel.sendCardInfoToCZBtn = function() {
				if(requesting){
					return;
				}
				requesting=true;
				//判断是否选中数据
				var ids = viewModel.mainViewModel.gridData.getSelectedIndexs();
				if(ids==null||ids.length==0){
					requesting=false;
					ip.warnJumpMsg("请先选择数据!",null,true,true);
					return false;
				}
				
				var cards = [];
				for ( var i = 0; i < ids.length; i++) {
					var selectedData = $('#'+viewModel.mainViewId.substring(1,37)+'').parent()[0]['u-meta'].grid.getRowByIndex(ids[i]).value;
					var card = {};
					card.cardId = selectedData.cardno;
					card.setYear = selectedData.set_year;
					card.financeCode = selectedData.finance_code;
					cards.push(card);
				}
				
				//检测年度及区划是否一致
				for ( var i = 0; i < (cards.length-1) ; i++) {
					if(cards[i].setYear!=cards[i+1].setYear){
						requesting=false;
						ip.warnJumpMsg("所选数据年度不一致，请重新选择", 0, 0, true);
						return false;
					}
				}
				var optionsInfo = ip.getCommonOptions({});
				optionsInfo["setYear"] = cards[0].setYear;
				optionsInfo["vtCode"] = "2221";
				var info = viewModel.buildCardIdsAndFinanceCode();
				optionsInfo["cardIdsAndFinanceCode"] = JSON.stringify(info);
				
				$.ajax({
					url : "/df/f_ebank/payCardManage/sendCardInfoToCZ.do?tokenid="
					+ viewModel.tokenid,
					type : "POST",
					data : optionsInfo,
					success : function(data){
						requesting=false;
						if(data.is_success=="0"){
							viewModel.query();
							ip.warnJumpMsg(data.error_msg, 0, 0, true);
						}else{
							viewModel.query();
							ip.warnJumpMsg("发送成功", 0, 0, true);
						}
					}
				});
				
			};
			
			//构建传入后头的cardIds
			viewModel.buildCardIdsAndFinanceCode = function(){
				var cardIdsAndFinanceCode = new Array();
				var ids = viewModel.mainViewModel.gridData.getSelectedIndexs();
				for ( var i = 0; i < ids.length; i++) {
					var selectedData = $('#'+viewModel.mainViewId.substring(1,37)+'').parent()[0]['u-meta'].grid.getRowByIndex(ids[i]).value;
					var temp = {};
					temp.cardId = selectedData.cardid;
					//card.setYear = selectedData.set_year;
					temp.financeCode = selectedData.finance_code;
					cardIdsAndFinanceCode.push(temp);
				}
				return cardIdsAndFinanceCode;
			};
			
			//变更单位
			viewModel.changeAgency = function() {
				if(requesting){
					return;
				}
				requesting=true;
				//判断是否选中数据
				var ids = viewModel.mainViewModel.gridData.getSelectedIndexs();
				if(ids==null||ids.length==0||ids.length>1){
					requesting=false;
					ip.warnJumpMsg("请先选择一条数据!",null,true,true);
					return false;
				}
				var data = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(ids[0]).value;
				$('#'+viewModel.agencySetViewModel[0].id).val(data.cardholder).attr("disabled",true);
				$('#'+viewModel.agencySetViewModel[1].id).val(data.cardholderno).attr("disabled",true);
				$('#'+viewModel.agencySetViewModel[2].id).val(data.cardtype).attr("disabled",true);
				$('#'+viewModel.agencySetViewModel[3].id).val(data.cardno).attr("disabled",true);
				$('#'+viewModel.agencySetViewModel[4].id).val(data.agencycode+" "+data.agencyname).attr("disabled",true);
				//$('#'+viewModel.agencySetViewModel[0].id).val(data.cardholder);
				payCardId = data.id;
				$("#titleTextAgency").text("变更预算单位");
				requesting=false;
				$("#agencySetModel").modal("show");
			};
			
			//变更单位确定
			viewModel.changeAgencyEnsure = function() {
				var updateType = "agency";
				if($('#'+viewModel.agencySetViewModel[5].id).val()==null||$('#'+viewModel.agencySetViewModel[5].id).val().trim()==""){
					ip.warnJumpMsg("新预算单位不能为空", 0, 0, true);
					return false;
				}
				if($('#'+viewModel.agencySetViewModel[5].id).val() == $('#'+viewModel.agencySetViewModel[4].id).val()){
					ip.warnJumpMsg("新单位与旧单位不能相同！请重新选择！", 0, 0, true);
					return false;
				}
				var ids = viewModel.mainViewModel.gridData.getSelectedIndexs();
				var data = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(ids[0]).value;
				var agency = $('#'+viewModel.agencySetViewModel[5].id).val();
				agency = agency.split(" ");
				var newAgencyCode = agency[0];
				var newAgencyName = agency[1];
				if(newAgencyName==null||newAgencyName==''){
					ip.warnJumpMsg("请选择预算单位，不能手动！！！", 0, 0, true);
					return;
				}
				data.newAgencyCode = newAgencyCode;
				data.newAgencyName = newAgencyName;
				data.vtCode = "2222";
				data.cardChangeType = "2";
				data.updateType = "agency";
				dataJson = JSON.stringify(data);
				/*var current_url = location.search;
				var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,current_url.indexOf("tokenid") + 48);*/
				optionsSub["payCardId"]=payCardId;
				optionsSub["data"]=dataJson;
				optionsSub["ajax"]="noCache";
				$.ajax({
					url: "/df/f_ebank/payCardManage/updatePayCard.do?tokenid=" + viewModel.tokenid,
					type: 'POST',
					dataType: 'json',
					data: optionsSub,
					success: function (data) {
						$("#agencySetModel").modal('hide');
						if(data.is_success == "1"){
							viewModel.refreshMainGrid();
							ip.ipInfoJump("修改成功","success");
						}else{
							ip.warnJumpMsg(data.error_msg, 0, 0, true);
						}
					} 
				});
			};
			
			//变更卡号
			viewModel.changeCardNo = function() {
				if(requesting){
					return;
				}
				requesting=true;
				//判断是否选中数据
				var ids = viewModel.mainViewModel.gridData.getSelectedIndexs();
				if(ids==null||ids.length==0||ids.length>1){
					requesting=false;
					ip.warnJumpMsg("请先选择一条数据!",null,true,true);
					return false;
				}
				var data = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(ids[0]).value;
				$('#'+viewModel.cardNoSetViewModel[0].id).val(data.cardholder).attr("disabled",true);
				$('#'+viewModel.cardNoSetViewModel[1].id).val(data.cardholderno).attr("disabled",true);
				$('#'+viewModel.cardNoSetViewModel[2].id).val(data.cardtype).attr("disabled",true);
				$('#'+viewModel.cardNoSetViewModel[3].id).val(data.cardno).attr("disabled",true);
				payCardId = data.id;
				cardId = data.cardid;
				//financeCode = data.finance_code;
				$("#titleTextCardNo").text("变更卡号");
				requesting=false;
				$("#cardNoSetModel").modal("show");
			};
			
			//变更卡号确定
			viewModel.changeCardNoEnsure = function() {
				var updateType = "cardNo";
				if($('#'+viewModel.cardNoSetViewModel[4].id).val()==null||$('#'+viewModel.cardNoSetViewModel[4].id).val().trim()==""){
					ip.warnJumpMsg("新卡号不能为空", 0, 0, true);
					return false;
				}
				if($('#'+viewModel.cardNoSetViewModel[4].id).val() == $('#'+viewModel.cardNoSetViewModel[3].id).val()){
					ip.warnJumpMsg("新卡号与旧卡号不能相同！请重新填写！", 0, 0, true);
					return false;
				}
				var ids = viewModel.mainViewModel.gridData.getSelectedIndexs();
				var data = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(ids[0]).value;
				var newCardNo = $('#'+viewModel.cardNoSetViewModel[4].id).val();
				data.newCardNo = newCardNo;
				data.vtCode = "2222";
				data.cardChangeType = "1";
				data.updateType = "cardNo";
				dataJson = JSON.stringify(data);
				optionsSub["payCardId"]=payCardId;
				optionsSub["cardId"]=cardId;
				optionsSub["ajax"]="noCache";
				optionsSub["cardChangeType"]="1";
				optionsSub["data"]=dataJson;
				optionsSub["vtCode"]="2222";
				optionsSub["updateType"]=payCardId;
				optionsSub["newCardNo"]=newCardNo;
				/*var current_url = location.search;
				var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,current_url.indexOf("tokenid") + 48);*/
				$.ajax({
					url: "/df/f_ebank/payCardManage/updatePayCard.do?tokenid=" + viewModel.tokenid,
					type: 'POST',
					dataType: 'json',
					data: optionsSub,
					success: function (data) {
						$("#cardNoSetModel").modal('hide');
						if(data.is_success == "1"){
							viewModel.refreshMainGrid();
							ip.ipInfoJump("修改成功","success");
						}else{
							ip.warnJumpMsg(data.error_msg, 0, 0, true);
						}
					} 
				});
			};
			
			/*//启用按钮
			viewModel.startBtn = function() {
				viewModel.statusBtn(1);
			};*/
			
			//启用按钮
			viewModel.startBtn = function() {
				if(requesting){
					return;
				}
				requesting=true;
				var updateType = "status";
				//判断是否选中数据
				var ids = viewModel.mainViewModel.gridData.getSelectedIndexs();
				if(ids==null||ids.length==0){
					requesting=false;
					ip.warnJumpMsg("请先选择数据!",null,true,true);
					return false;
				}
				
				var cards = [];
				for ( var i = 0; i < ids.length; i++) {
					var selectedData = $('#'+viewModel.mainViewId.substring(1,37)+'').parent()[0]['u-meta'].grid.getRowByIndex(ids[i]).value;
					if(selectedData.cardstatus=='1'||selectedData.cardstatus=='3'){
						requesting=false;
						ip.warnJumpMsg("存在已启用或已注销的数据，请重新选择数据！！！",null,true,true);
						return;
					}
					selectedData.newStatus = "1";
					//var card = {};
					/*card.cardId = selectedData.cardno;
					//card.setYear = selectedData.set_year;
					card.cardStatus = selectedData.cardstatus;*/
					selectedData.cardChangeType = "3";
					selectedData.vtCode = "2222";
					selectedData.updateType = "status";
					cards.push(selectedData);
				}
				
				//检测年度及区划是否一致
				for ( var i = 0; i < (cards.length-1) ; i++) {
					if(cards[i].setYear!=cards[i+1].setYear || cards[i].financeCode!=cards[i+1].financeCode ){
						requesting=false;
						ip.warnJumpMsg("所选数据年度或财政机构不一致，请重新选择！", 0, 0, true);
						return false;
					}
				}
				cardsJson = JSON.stringify(cards);
				optionsSub["ajax"]="noCache";
				optionsSub["data"]=cardsJson;
				optionsSub["updateType"]=updateType;
				/*var current_url = location.search;
				var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,current_url.indexOf("tokenid") + 48);*/
				//var data = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(ids[0]).value;
				$.ajax({
					url: "/df/f_ebank/payCardManage/updatePayCard.do?tokenid=" + viewModel.tokenid,
					type: 'POST',
					dataType: 'json',
					data: optionsSub,
					success: function (data) {
						requesting=false;
						viewModel.refreshMainGrid();
						if(data.is_success == "1"){
							viewModel.refreshMainGrid();
							ip.ipInfoJump("操作成功","success");
						}else{
							ip.warnJumpMsg(data.error_msg, 0, 0, true);
						}
					}
				});
			};
			
			//停用用按钮
			viewModel.stopBtn = function() {
				if(requesting){
					return;
				}
				requesting=true;
				var updateType = "status";
				//判断是否选中数据
				var ids = viewModel.mainViewModel.gridData.getSelectedIndexs();
				if(ids==null||ids.length==0){
					requesting=false;
					ip.warnJumpMsg("请先选择数据!",null,true,true);
					return false;
				}
				
				var cards = [];
				for ( var i = 0; i < ids.length; i++) {
					var selectedData = $('#'+viewModel.mainViewId.substring(1,37)+'').parent()[0]['u-meta'].grid.getRowByIndex(ids[i]).value;
					if(selectedData.cardstatus=='2'||selectedData.cardstatus=='3'){
						requesting=false;
						ip.warnJumpMsg("存在已停用或已注销的数据，请重新选择数据！！！",null,true,true);
						return;
					}
					selectedData.newStatus = "2";
					selectedData.cardChangeType = "3";
					selectedData.vtCode = "2222";
					selectedData.updateType = "status";
					cards.push(selectedData);
				}
				
				//检测年度及区划是否一致
				for ( var i = 0; i < (cards.length-1) ; i++) {
					if(cards[i].setYear!=cards[i+1].setYear || cards[i].financeCode!=cards[i+1].financeCode ){
						requesting=false;
						ip.warnJumpMsg("所选数据年度或财政机构不一致，请重新选择", 0, 0, true);
						return false;
					}
				}
				cardsJson = JSON.stringify(cards);
				optionsSub["ajax"]="noCache";
				optionsSub["data"]=cardsJson;
				optionsSub["updateType"]=updateType;
				/*var current_url = location.search;
				var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,current_url.indexOf("tokenid") + 48);*/
				//var data = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(ids[0]).value;
				$.ajax({
					url: "/df/f_ebank/payCardManage/updatePayCard.do?tokenid=" + viewModel.tokenid,
					type: 'POST',
					dataType: 'json',
					data: optionsSub,
					success: function (data) {
						requesting=false;
						viewModel.refreshMainGrid();
						if(data.is_success == "1"){
							viewModel.refreshMainGrid();
							ip.ipInfoJump("操作成功","success");
						}else{
							ip.warnJumpMsg(data.error_msg, 0, 0, true);
						}
					}
				});
				
			};
			
			//注销按钮
			viewModel.cancelBtn = function() {
				if(requesting){
					return;
				}
				requesting=true;
				var updateType = "status";
				//判断是否选中数据
				var ids = viewModel.mainViewModel.gridData.getSelectedIndexs();
				if(ids==null||ids.length==0){
					requesting=false;
					ip.warnJumpMsg("请先选择数据!",null,true,true);
					return false;
				}
				
				var cards = [];
				for ( var i = 0; i < ids.length; i++) {
					var selectedData = $('#'+viewModel.mainViewId.substring(1,37)+'').parent()[0]['u-meta'].grid.getRowByIndex(ids[i]).value;
					if(selectedData.cardstatus=='3'||selectedData.cardstatus=='1'){
						requesting=false;
						ip.warnJumpMsg("存在已注销或已启用的数据，请重新选择数据！！！",null,true,true);
						return false;
					}
					selectedData.newStatus = "3";
					selectedData.cardChangeType = "3";
					selectedData.vtCode = "2222";
					selectedData.updateType = "status";
					cards.push(selectedData);
				}
				
				//检测年度及区划是否一致
				for ( var i = 0; i < (cards.length-1) ; i++) {
					if(cards[i].setYear!=cards[i+1].setYear || cards[i].financeCode!=cards[i+1].financeCode ){
						requesting=false;
						ip.warnJumpMsg("所选数据年度或财政机构不一致，请重新选择！", 0, 0, true);
						return false;
					}
				}
				cardsJson = JSON.stringify(cards);
				optionsSub["ajax"]="noCache";
				optionsSub["data"]=cardsJson;
				optionsSub["updateType"]=updateType;
				/*var current_url = location.search;
				var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,current_url.indexOf("tokenid") + 48);*/
				//var data = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(ids[0]).value;
				$.ajax({
					url: "/df/f_ebank/payCardManage/updatePayCard.do?tokenid=" + viewModel.tokenid,
					type: 'POST',
					dataType: 'json',
					data: optionsSub,
					success: function (data) {
						requesting=false;
						viewModel.refreshMainGrid();
						if(data.is_success == "1"){
							viewModel.refreshMainGrid();
							ip.ipInfoJump("操作成功","success");
						}else{
							ip.warnJumpMsg(data.error_msg, 0, 0, true);
						}
					}
				});
			};
			
			//公务卡删除按钮
			viewModel.deleteCardBtn = function() {
				if(requesting){
					return;
				}
				requesting=true;
				//判断是否选中数据
				var ids = viewModel.mainViewModel.gridData.getSelectedIndexs();
				if(ids==null||ids.length==0){
					requesting=false;
					ip.warnJumpMsg("请先选择数据!",null,true,true);
					return false;
				}
				var cards = [];
				for ( var i = 0; i < ids.length; i++) {
					var selectedData = $('#'+viewModel.mainViewId.substring(1,37)+'').parent()[0]['u-meta'].grid.getRowByIndex(ids[i]).value;
					//删除前，检查选中数据的状态。处于“注销”状态的记录才被允许删除。
					var cardNo = selectedData.cardno;
					//卡号
					if(cardNo != null && cardNo.trim() != ""){
						//卡状态
						var cardStatus = selectedData.cardstatus;
						if(cardStatus != null && cardStatus.trim() != "" ){
							if(cardStatus == "1"){
								requesting=false;
								ip.warnJumpMsg('卡号：'+cardNo+' 为"启用"状态，不允许删除！', 0, 0, true);
								return ;
							}else if(cardStatus == "2"){
								requesting=false;
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
				if(confirm("确认删除数据？")){
					//删除公务卡
					viewModel.deleteCard(cards);
				}else{
					requesting=false;
					return false;
				}
			};
			
			//删除公务卡
			viewModel.deleteCard = function(cards) {
				var cardsJson = JSON.stringify(cards);
				$.ajax({
					url: "/df/f_ebank/payCardManage/deletePayCard.do?tokenid=" + viewModel.tokenid,
					type: 'GET',
					dataType: 'json',
					data: {
						"cards" : cardsJson,
							},
					success: function (data) {
						requesting=false;
						if(data.errorCode=="0"){
							ip.ipInfoJump("删除成功！","success");
							viewModel.refreshMainGrid();
						}else{
							ip.ipInfoJump("删除失败！","error");
						};
					},
				});
			};
			
			//录入区年度的初始化
			viewModel.initSetYear = function() {
				$.ajax({
					url : EBankConstant.CommonUrl.getEnabledYearData+"?tokenid="
						+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : {
						"ajax" : "nocache"
					},
					success : function(datas) {
						if (datas.errorCode == "0") {
							for ( var i = 0; i < datas.setYear.length; i++) {
								var x = document.getElementById("set_year"
										+"-"
										+ viewModel.cardInputSetViewId.substring(
												1, 37));
								var option = document.createElement("option");
								option.value = datas.setYear[i].set_year;
								option.text = datas.setYear[i].year_name;

								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
							}
						} else {
							ip.ipInfoJump("加载参数失败！原因：" + datas.result,
									"error");
						}
					}
				});
			};
			
			//录入区财政机构初始化
			viewModel.initFinanceCode = function() {
				$.ajax({
					url : "/df/f_ebank/config/getFinanceOrgData.do?tokenid=" + viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : {
						"ajax" : "nocache"
					},
					async : false,
					success : function(datas) {
						if (datas.errorCode == "0") {
							for (var i = 0; i < datas.dataDetail.length; i++) {
								var x = document.getElementById("finance_code"
										+ "-"
										+ viewModel.cardInputSetViewId.substring(
												1, 37));
								var option = document.createElement("option");
								option.value = datas.dataDetail[i].chr_code;
								option.text = datas.dataDetail[i].chr_name;
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
							}
						} else {
							ip.ipInfoJump("加载财政机构参数失败！原因：" + datas.result, "error");
						}
					}
				});
			};
			
			
			//查询区财政机构初始化
			viewModel.getFinanceCode = function() {
				$.ajax({
					url : "/df/f_ebank/config/getFinanceOrgData.do?tokenid=" + viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : {
						"ajax" : "nocache"
					},
					async : false,
					success : function(datas) {
						if (datas.errorCode == "0") {
							for (var i = 0; i < datas.dataDetail.length; i++) {
								var x = document.getElementById("finance_code"
										+ "-"
										+ viewModel.queryViewId.substring(
												1, 37));
								var option = document.createElement("option");
								option.value = datas.dataDetail[i].chr_code;
								option.text = datas.dataDetail[i].chr_name;
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
							}
						} else {
							ip.ipInfoJump("加载财政机构参数失败！原因：" + datas.result, "error");
						}
					}
				});
			};
		
			//刷新主视图
			viewModel.refreshMainGrid = function(){
				ip.setGrid(viewModel.mainViewModel, "/df/f_ebank/payCardManage/getPayCardInfo.do?tokenid="
						+ viewModel.tokenid, optionsMain);
			};
			
			//显示视图信息
			viewModel.initData = function() {
				$.ajax({
					url : "/df/init/initMsg.do?tokenid="
					+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					async : true,
					data : optionsMain,
					success : function(datas) {
						viewModel.viewList = datas.viewlist;// 视图信息
						viewModel.resList = datas.reslist;// 资源信息
						for ( var n = 0; n < viewModel.viewList.length; n++) {
							var view = viewModel.viewList[n];
							if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST ) {// 列表视图
								if (view.orders == "1") {//主单
									viewModel.mainViewId = view.viewid;
									viewModel.mainViewModel = ip.initGrid(view, 'modalInfoArea', "/df/f_ebank/payCardManage/getPayCardInfo.do?tokenid="
					+ viewModel.tokenid, optionsMain, 1, false, true);
								} 
							}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){//查询视图
								viewModel.queryViewId = view.viewid;
								viewModel.planSearchViewModel = ip.initArea(view.viewDetail,"search", view.viewid.substring(1,37),"modelQueryArea");
								viewModel.getFinanceCode();
							}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_INPUT) {//录入视图
								if(view.orders == "1"){//变更单位
									viewModel.changeAgencyViewId = view.viewid;
									viewModel.agencySetViewModel = ip.initArea(view.viewDetail,"edit", view.viewid.substring(1,37),"agencySetArea");
								}else if(view.orders == "2"){//变更卡号
									viewModel.changeCardNoViewId = view.viewid;
									viewModel.cardNoSetViewModel = ip.initArea(view.viewDetail,"edit", view.viewid.substring(1,37),"cardNoSetArea");
								}else if (view.orders == "3"){//手工录入
									viewModel.cardInputSetViewId = view.viewid;
									viewModel.cardInputSetViewModel = ip.initArea(view.viewDetail, "edit", view.viewid.substring(1,37), "cardInputSetArea");
									viewModel.initSetYear();
									viewModel.initFinanceCode();
								};
							}
						};
					},
				});
			};
			
			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel,
				});
				viewModel.initData();
			});
		});
