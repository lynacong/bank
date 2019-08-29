/**
 * 共用的操作方法
 */
require(['commonUtil','ip','ebankConstants'], function(commonUtil){
	var requesting = false;//防止重复点击按钮
	viewModel = {};
	//查询
	queryHandler = function(){
		commonUtil.queryHandler();
	};
	// 查看明细
	checkDetail = function(btnParam){
		commonUtil.checkDetail(btnParam);
	};
	// 查询凭证状态
	queryVouStatus = function(){
		commonUtil.queryVouStatus();
	}
	//支付
	payMoney = function(btnParam){
		commonUtil.payMoneyHandler(btnParam);
	};
	//支付功能 收款行行号录入保存
	saveBankNoInput = function(){
		commonUtil.savePayeeBankNo();
	};
	//支付功能 收款行行号录入关闭
	closeBankNoInput = function(){
		commonUtil.closeBankNoInput();
	};
	//支付功能  收款行行号录入 查询
	payeeBankNoSearch = function(){
		commonUtil.initBankNoList();
	};
	//支付功能  收款行行号录入 删除
	payeeBankNoDelete = function(){
		commonUtil.payeeBankNoDelete();
	};
	//支付功能  收款行行号录入 清空
	payeeBankNoClear = function(){
		commonUtil.payeeBankNoClear();
	};
	//支付功能  收款行行号 新增
	payeeBankNoAdd = function(){
		commonUtil.payeeBankNoAdd();
	};
	//支付功能  收款行行号修改
	payeeBankNoUpdate = function(){
		commonUtil.payeeBankNoUpdate();
	};
	//支付功能 新增收款行行号保存
	saveAddPayeeBankNo = function(){
		commonUtil.saveAddPayeeBankNo();
	};
	//支付功能 收款行行号新增关闭
	closeAddPayeeBankNo = function(){
		commonUtil.closeAddPayeeBankNo();
	};
	//补录交易流水号
	inputAgentBusinessNo = function(btnParam){
		commonUtil.inputAgentBusinessNo(btnParam);
	};
	//补录交易流水号保存
	saveAgentBusinessNo = function(){
		commonUtil.saveAgentBusinessNo();
	};
	//补录交易流水号关闭
	closeAgentBusinessNo = function(){
		commonUtil.closeAgentBusinessNo();
	};
	//签章发送
	signSend = function(btnParam){
		commonUtil.signSendHandler(btnParam);
	};
	//再次发送
	reSend = function(btnParam){
		commonUtil.signSendHandler(btnParam);
	};
	//生成
	doCreateBill = function(btnParam){
		commonUtil.doCreateBill(btnParam);
	};
	//撤销生成(通用)
	doCancelCreateBill = function(btnParam){
		commonUtil.doCancelCreateBill(btnParam);
	};
	//撤销生成(划款单)
	doCancelCreateBillForSpecial = function(btnParam){
		commonUtil.doCancelCreateBillForSpecial(btnParam);
	};
	//凭证查看
	doVoucherSee = function(e){
		commonUtil.doVoucherSee(e);
	};
	//凭证预览
	doVoucherPreview = function(e){
		commonUtil.doVoucherPreview(e);
	};
	//通用走流程
	doCommonWorkFlow = function(btnParam){
		commonUtil.doCommonWorkFlow(btnParam);
	};
	//打印
	doPreviewPrint = function(btnParam){
		commonUtil.doPreviewPrint(btnParam);
	};
	//批量打印
	doMultiPrint = function(btnParam){
		commonUtil.doMultiPrint(btnParam);
	};
	//签章
	doStamp = function(btnParam){
		commonUtil.stampHandler(btnParam);
	};
	//撤销签章
	doCancelStamp = function(btnParam){
		commonUtil.cancelStampHandler(btnParam);
	};
	//设置清算日期
	inputClearDate = function(btnParam){
		commonUtil.inputClearDate(btnParam);
	};
	//设置清算日期保存
	saveClearDate = function(){
		commonUtil.saveClearDate();
	};
	//设置清算日期关闭
	closeClearDate = function(){
		commonUtil.closeClearDate();
	};
	//导出电子凭证pdf
	exportPDF = function(){
		commonUtil.exportPDF();
	};
	inputPayeeInfo = function(){
		commonUtil.inputPayeeInfo("");
	};
	updateField=function () {
		commonUtil.updateField();
    }
});