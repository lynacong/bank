var EBankConstant = {};

EBankConstant.Ctx = "/df/f_ebank/";

// 通用调用地址
EBankConstant.CommonUrl = {
		EBankConfParam_url:"/df/f_ebank/paramconf",
		refund:"/df/f_ebank/pay/payRefund",
	    query:"/df/f_ebank/common/query",
	    stampAndSend:"/df/f_ebank/billStampSend",
	    getFinanceData:"/df/f_ebank/config/getFinanceOrgData.do",
	    getAllFinanceData:"/df/f_ebank/config/getAllFinanceOrgData.do",
	    getEnabledYearData:"/df/f_ebank/config/getYearData.do",
	    doCreateBill:"/df/f_ebank/common/billhandle/doCreateBill.do",
	    doCreateBillByBillNos:"/df/f_ebank/common/billhandle/doCreateBillByBillNos.do",
	    doCancelCreateBill:"/df/f_ebank/common/billhandle/doCancelCreateBill.do",
	    doCommonPay:"/df/f_ebank/pay/payCommon/doCommonPay.do",
	    doCommonBack:"/df/f_ebank/pay/payCommon/doProcessBack.do",
	    doCommonDelete:"/df/f_ebank/pay/payCommon/doDelete.do",
	    doCommonNext:"/df/f_ebank/pay/payCommon/doCommonNext.do",
	    doAgentBusinessNoRecall:"/df/f_ebank/pay/payCommon/doAgentBusinessNoRecall.do",
	    doInputAgentBusinessNoNext:"/df/f_ebank/pay/payCommon/doInputAgentBusinessNoNext.do",
	    doCreateAgentBill:"/df/f_ebank/agent/doCreateAgentBill.do",
	    doSynPayBill:"/df/f_ebank/agent/doSynPayBill.do",
	    doRegisterAgentBill:"/df/f_ebank/agent/doRegisterAgentBill.do",
	    doCancelRegisterAgentBill:"/df/f_ebank/agent/doCancelRegisterAgentBill.do",
	    doConfirmAgentBill:"/df/f_ebank/agent/doConfirmAgentBill.do",
	    doCancelConfirmAgentBill:"/df/f_ebank/agent/doCancelConfirmAgentBill.do"
};

EBankConstant.ViewId = {

};


/** 电子支付常量* */
EBankConstant.AsspConstants = {
	// 批量签名数量
	ASSP_SIGN_BATCH_SIZE_PARAM : "epay.assp.batch.sign",
	//批量签章数量
	ASSP_STAMP_BATCH_SIZE_PARAM:"epay.assp.batch.stamp",
	// 电子支付签章服务地址
	ASSP_URL_ESTAMP_PARAM : "epay.url.estamp",
	// 电子支付财政端服务地址
	ASSP_URL_WEBSERVICE_PARAM : "ebank.url.webservice",
	//是否明细签名签章
	EPAY_DETAIL_MSG : "1",
};

EBankConstant.ViewType = {
	VIEWTYPE_INPUT : "001",// 录入视图
	VIEWTYPE_LIST : "002",// 列表视图
	VIEWTYPE_QUERY : "003"// 查询视图
};
// 工作流操作类型ActionType
EBankConstant.WfActionType = {
	NEXT : "NEXT",
	RECALL : "RECALL",
	BACK : "BACK",
	INPUT : "INPUT",
	EDIT : "EDIT",
	HANG : "HANG",
	DELETE : "DELETE",
	DISCARD : "DISCARD"
};

// 按钮ID
EBankConstant.BtnId = {
	BTN_ADD : "btn-add",// 新增
	BTN_DETAIL : "btn-detail",// 详细、明细
	BTN_BAT_EDIT : "btn-bat-edit",// 批量修改
	BTN_BAT_INPUT : "btn_bat_input",// 批量录入
	BTN_EDIT : "btn-edit",// 修改
	BTN_BAT_DELETE : "btn-bat-delete",// 批量删除
	BTN_DELETE : "btn-delete",// 删除
	BTN_BAT_SEND : "btn-bat-send",// 批量送审(批量发送)
	BTN_SAVE_SEND : "btn_save_send",// 保存并送审
	BTN_SEND : "btn-send",// 送审(发送)
	BTN_RESEND : "btn-resend",// 再发送
	BTN_BAT_RESEND : "btn-bat-resend",// 批量再发送
	BTN_BAT_AUDIT : "btn-bat-audit",// 批量审核
	BTN_AUDIT : "btn-audit",// 审核
	BTN_RECALL : "btn-recall",// 撤销(收回)
	BTN_BAT_RECALL : "btn-bat-recall",// 批量撤销(收回)
	BTN_REC_BACK : "btn-bat-back",// 批量退回
	BTN_BACK : "btn-back",// 退回
	BTN_BAT_UN_BACK : "btn-bat-un-back",// 批量撤销退回
	BTN_UN_BACK : "btn-un-back",// 撤销退回
	BTN_BAT_DISCARD : "btn-bat-discard",// 批量作废
	BTN_DISCARD : "btn-discard",// 作废
	BTN_EDIT : "btn-bat-edit",// 编辑
	BTN_BAT_PRINT : "btn-bat-print",// 批量打印
	BTN_PRINT : "btn-print",// 打印
	BTN_BAT_UN_PRINT : "btn-bat-un-print",// 批量撤销打印
	BTN_UN_PRINT : "btn-un-print",// 撤销打印
	BTN_BAT_CREATE : "btn-bat-create",// 批量生成
	BTN_CREATE : "btn-create",// 生成
	BTN_BAT_UN_CREATE : "btn-bat-un-create",// 批量撤销生成
	BTN_UN_CREATE : "btn-un-create",// 撤销生成
	BTN_BAT_CHECK : "btn-bat-check",// 批量下达
	BTN_CHECK : "btn-check",// 下达
	BTN_BAT_UN_CHECK : "btn-bat-un-check",// 批量撤销下达
	BTN_UN_CHECK : "btn-un-check",// 撤销下达
	BTN_BAT_CONFIRM : "btn-bat-confirm",// 批量登记(确认)
	BTN_CONFIRM : "btn-confirm",// 登记(确认)
	BTN_BAT_UN_CONFIRM : "btn-bat-un-confirm",// 批量撤销登记(确认)
	BTN_UN_CONFIRM : "btn-un-confirm",// 撤销登记(确认)
	BTN_BAT_SIGN : "btn-bat-sign",// 批量签名
	BTN_SIGN : "btn-sign",// 签名
	BTN_BAT_UN_SIGN : "btn-bat-un-sign",// 批量撤销签名
	BTN_UN_SIGN : "btn-un-sign",// 撤销签名
	BTN_BAT_STAMP : "btn-bat-stamp",// 批量签章
	BTN_STAMP : "btn-stamp",// 签章
	BTN_BAT_UN_STAMP : "btn-bat-un-stamp",// 批量撤销签章
	BTN_UN_STAMP : "btn-un-stamp",// 撤销签章
	BTN_PREVIEW : "btn-preview", // 预览
	BTN_COMMON_PRINT : "btn-common-print" //通用打印
};

// 工作流状态
EBankConstant.WfStatus = {
	ALL_000 : "008",// 全部
	TODO_001 : "001",// 待审核
	TODO_BACK_001004 : "001|004",// 待审核+退回
	AUDITED_002 : "002",// 已审核
	RETURNED_003 : "003",// 已退回
	UNAUDIT_004 : "004",// 被退回
	MODIFIED_005 : "005",// 已修改
	DONE_008 : "008",// 已办理
	HANGED_101 : "101",// 已挂起
	DELETED_102 : "102",// 已删除
	INVALID_103 : "103"// 已作废
};
// 计划相关表
EBankConstant.PlanTables = {
	PLAN_VOUCHER : "EBANK_PLAN_VOUCHER",// 计划明细表
	PLAN_AGENTEN_BILL : "EBANK_PLAN_AGENTEN_BILL",// 计划额度到账通知单
	PLAN_AGENT_BILL : "EBANK_PLAN_AGENT_BILL",// 授权支付额度单
	PLAN_CLEAR_BILL : "EBANK_PLAN_CLEAR_BILL"// 授权支付清算额度单
};
// 支付相关表
EBankConstant.PayTables = {
	EBANK_PAY_VOUCHER : "EBANK_PAY_VOUCHER",// 支付凭证明细表
	EBANK_PAY_VOUCHER_BILL : "EBANK_PAY_VOUCHER_BILL",// 支付凭证单
	EBANK_PAY_CLEAR_BILL : "EBANK_PAY_CLEAR_BILL",// 汇总清算单
	EBANK_AGENT_BILL : "EBANK_AGENT_BILL",// 划款清算单
	EBANK_PAY_ACC_BILL : "EBANK_PAY_ACC_BILL",// 入账通知书单
	EBANK_ACC_BILL : "EBANK_ACC_BILL",// 入账通知书单
	EBANK_PAY_DAY_BILL : "EBANK_PAY_DAY_BILL",// 授权支出日报单
	EBANK_DAY_BILL : "EBANK_DAY_BILL",// 授权支出日报单
	EBANK_PAY_BILL : "EBANK_PAY_BILL",
	EBANK_PAY_DETAIL : "EBANK_PAY_DETAIL",
	EBANK_PAY_BATCH_BILL : "EBANK_PAY_BATCH_BILL",
	EBANK_PAY_BATCH_DETAIL : "EBANK_PAY_BATCH_DETAIL",
	EBANK_AGENT_BILL : "EBANK_AGENT_BILL",
	EBANK_DAY_BILL:"EBANK_DAY_BILL",
	EBANK_CLEARMONEY_RECOUNT:"EBANK_CLEARMONEY_RECOUNT",
	EBANK_COLL_BILL:"EBANK_COLL_BILL"
};

// 支付类型
EBankConstant.PayType = {
	PA_CODE_NORMAL : "001",// 正常支付
	PA_CODE_REFUND : "002"// 退款支付
};

//操作类型
EBankConstant.OperationType = {
		REPAYMENT : "0",// 手动还款
		REFUND : "1"// 手动退款
};

//用户类型
EBankConstant.UserType = {
		MANAGER : "001",// 管理员
		
};
