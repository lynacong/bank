
/**
 * 报表IP
 * <p>外网：http://192.168.10.11:8080</p>
 * <p>内网：http://10.28.5.155:8080</p>
 */
var dfp_itemurl_reportFormIP = "http://10.28.5.155:8080";
/**
 * 财政百度url，需添加 fiscalInput 内容（即查询条件）
 * <p>外网：http://192.168.10.11:8800/jsp/solr/index_param.jsp?name=</p>
 * <p>内网：http://10.28.5.155:8800/jsp/solr/index_param.jsp?name=</p>
 */
var dfp_itemurl_fiscalurl = "http://192.168.10.11:8800/jsp/solr/index_param.jsp?agencycode=" + Base64.decode($("#svAgencyCode", parent.document).val()) + "&name=";
/**
 * 报表参数
 */
var dfp_itemurl_reportFormParam = "&id=admin&pw=admin&showmenu=false&fasp_t_agency_id=" + Base64.decode($("#svAgencyId", parent.document).val());

/**
 * 支出进度
 */
var dfp_itemurl_payprogress = {
	"0" : "已支付",
	"0_" : "/df/pay/portalpay/statusquery/payrelated/payInfo.html?billtype=366&busbilltype=311&menuid=132C25064BD2BAE4627573EEA7BB9CA8&menuname=%u652F%u51FA%u8FDB%u5EA6%u652F%u4ED8%u4FE1%u606F",
	"1" : "可用指标",
	"1_" : "/df/pay/portalpay/input/payQuota.html?billtype=366&busbilltype=311&model=model5&menuid=B249D0506FCAAADDE98A515AB777DD31&menuname=%u652F%u51FA%u8FDB%u5EA6%u6307%u6807%u4FE1%u606F"
};

/**
 * 预算单位经办人
 */
dfp_itemurl_dwjb = {
	/**
	 * 常用操作
	 */
	often : {
		/**
		 * 我要支付
		 */
		ban : {
			"0" : "现金业务",
			"0_" : "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=AN",
			"1" : "普通转账",
			"1_" : "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=PT",
			"2" : "代扣代缴",
			"2_" : "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=DK",
			"3" : "柜台缴税",
			"3_" : "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=GT",
			"4" : "批量支付",
			"4_" : "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=PLZF",
			"5" : "公务卡",
			"5_" : "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=GWK",
			"6" : "政府采购",
			"6_" : "/df/sd/pay/centerpay/input/paAccreditBillInputZFCG.html?billtype=366&busbilltype=322&menuid=C9028BFD7E0826FD3FBC3EFC213D83A1&menuname=%u653F%u5E9C%u91C7%u8D2D"
		},
		/**
		 * 我要确认
		 */
		deng : {
			"0" : "额度到账通知书",
			"0_" : "/df/pay/plan/bills/plAgentenRegister.html?menuid=14C5F873520F87F22EEB06FCEB4950BD&menuname=%u5355%u4F4D%u989D%u5EA6%u5230%u8D26%u901A%u77E5%u4E66%u767B%u8BB0%0A",
			"1" : "授权支付退款通知书",
			"1_" : "/df/pay/centerpay/bills/paAccountBillRegister.html?billtype=365&menuid=F572C1F1142AD82C3663F1B3768A6E32&menuname=%u6388%u6743%u652F%u4ED8%u51ED%u8BC1%u9000%u6B3E%u56DE%u5355%u767B%u8BB0",
			"2" : "授权支付入账通知书",
			"2_" : "/df/pay/centerpay/bills/paAccountBillRegister.html?menuid=02BF79AF73F700B10A9D4B7DE442681C&menuname=%u6388%u6743%u652F%u4ED8%u5165%u8D26%u901A%u77E5%u4E66%u767B%u8BB0",
			"3" : "授权支付退款入账通知书",
			"3_" : "/df/pay/centerpay/bills/paFundReturnBill.html?menuid=451C4DA34F040F0CF0626223D0ABCF3E&menuname=%u6388%u6743%u652F%u4ED8%u9000%u6B3E%u5165%u8D26%u901A%u77E5%u4E66%u767B%u8BB0",
			"4" : "直接支付入账通知书",
			"4_" : "/df/pay/centerpay/bills/paAccountBillRegister.html?menuid=2C7C442EF357E721C948CF59521DB3CE&menuname=%u8D22%u653F%u76F4%u63A5%u652F%u4ED8%u5165%u8D26%u901A%u77E5%u4E66%u767B%u8BB0",
			"5" : "直接支付退款入账通知书",
			"5_" : "/df/pay/centerpay/bills/paAccountBillRegister.html?billtype=365&menuid=4726D8EB91D92438B8FAC33F0B9E3247&menuname=%u8D22%u653F%u76F4%u63A5%u652F%u4ED8%u9000%u6B3E%u5165%u8D26%u901A%u77E5%u4E66%u767B%u8BB0"
		},
		/**
		 * 我要查询
		 */
		cha : {
			"0" : "财政直接支付申请书查询",
			"0_" : "",
			"1" : "财政授权支付凭证查询",
			"1_" : "",
			"2" : "指标明细查询",
			"2_" : dfp_itemurl_reportFormIP + "/bi422-20160603/showreport.do?resid=EBI$12$MMOWUNDUXN03OUXMKF5YM3MI45M8U4TZ$1$C5IL13357KQP6FU5KZFJLRKCLU5CKLXM.rpttpl" + dfp_itemurl_reportFormParam,
			"3" : "支付明细查询",
			"3_" : dfp_itemurl_reportFormIP + "/bi422-20160603/showreport.do?resid=EBI$12$KWNVUEM4LRCOXZLWK9SO3MLNNSWYO5DK$1$UMUYSPL6E5TUSZRMKWZMTKSIOXMKCK8U.rpttpl" + dfp_itemurl_reportFormParam,
			"4" : "预算执行情况查询",
			"4_" : dfp_itemurl_reportFormIP + "/bi422-20160603/showreport.do?resid=EBI$12$UYXTC5MKUMYXULKY73LN5QXW78YSQYM1$1$TC3B0QM8DMNVUC3CUKC1ZVK86OCJMAIK.rpttpl" + dfp_itemurl_reportFormParam,
			"5" : "国库集中支付年终结余资金对账单",
			"5_" : dfp_itemurl_reportFormIP + "/bi422-20160603/showreport.do?resid=EBI$12$MVURSBULV1UKITVV60L1XKMI4LVOI238$1$8UNKFCC5XLXNCNFUQ0NRIJJ9O9UQDOAL.rpttpl" + dfp_itemurl_reportFormParam,
			"6" : "预算单位分预算项目查询",
			"6_" : "",
			"7" : "自定义查询",
			"7_" : ""
		},
		/**
		 * 我要咨询
		 */
		wen : {
			"0" : "操作手册",
			"0_" : "",
			"1" : "操作规范",
			"1_" : "/doc/paybusiness/article.html",
			"2" : "公务卡",
			"2_" : "",
			"3" : "支付签章",
			"3_" : "",
			"4" : "凭证查询",
			"4_" : "",
			"5" : "凭证打印",
			"5_" : "",
			"6" : "资金监控",
			"6_" : "",
			"7" : "其他",
			"7_" : ""
		}
	},
	/**
	 * 预算指标
	 */
	budget : {
		/**
		 * 行点击事件链接
		 */
		tr : "",
		/**
		 * 右键按钮链接
		 */
		right : {
			"0" : "现金业务",
			"0_" : "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=AN",
			"1" : "普通转账",
			"1_" : "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=PT",
			"2" : "代扣代缴",
			"2_" : "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=DK",
			"3" : "柜台缴税",
			"3_" : "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=GT",
			"4" : "批量支付",
			"4_" : "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=PLZF",
			"5" : "公务卡",
			"5_" : "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=GWK",
			"6" : "政府采购",
			"6_" : "/df/sd/pay/centerpay/input/paAccreditBillInputZFCG.html?billtype=366&busbilltype=322&menuid=C9028BFD7E0826FD3FBC3EFC213D83A1&menuname=%u653F%u5E9C%u91C7%u8D2D",
			"7" : "预算执行情况",
			"7_" : "/df/sd/pay/commonModal/traceBalanceList/balanceForPortal.html",
			"8" : "导出Excel",
			"8_" : ""
		}
	},
	/**
	 * 待办
	 */
	dealing : {
		"0" : "单位额度到账通知书登记",
		"0_" : "14C5F873520F87F22EEB06FCEB4950BD",
		"1" : "授权支付退款通知书",
		"1_" : "7B4D1BA03A0AB37310660E90B98193D5",
		"2" : "财政授权支付入账通知书登记",
		"2_" : "02BF79AF73F700B10A9D4B7DE442681C",
		"3" : "财政授权支付退款入账通知书登记",
		"3_" : "F572C1F1142AD82C3663F1B3768A6E32",
		"4" : "财政直接支付入账通知书登记",
		"4_" : "2C7C442EF357E721C948CF59521DB3CE",
		"5" : "财政直接支付退款入账通知书",
		"5_" : "4726D8EB91D92438B8FAC33F0B9E3247",
		"6" : "授权支付凭证经办人签私章",
		"6_" : "9588FA171826EE5F56C82AEF1C474E01",
		// 以下待定
		"7" : "集中支付监控初审（主管部门）",
		"7_" : "3151BF234B351DD7ACB34181E24F7ACB",
		"8" : "集中支付监控反馈",
		"8_" : "84BDA9DC0F327C1435434CD228DAD0D0",
		"9" : "集中支付监控反馈确认",
		"9_" : "0C2612D2B9ED17FFEC8481C608866DD5",
		"10" : "集中支付监控反馈确认（主管部门）",
		"10_" : "3FA917E1DAFBB04F4C114705AE6E745D"
	}
};

/**
 * 单位审核
 */
dfp_itemurl_dwsh = {
	often : {
		/**
		 * 我要查询
		 */
		cha : {
			"0" : "财政直接支付申请书查询",
			"0_" : "",
			"1" : "财政授权支付凭证查询",
			"1_" : "",
			"2" : "指标明细查询",
			"2_" : dfp_itemurl_reportFormIP + "/bi422-20160603/showreport.do?resid=EBI$12$MMOWUNDUXN03OUXMKF5YM3MI45M8U4TZ$1$C5IL13357KQP6FU5KZFJLRKCLU5CKLXM.rpttpl" + dfp_itemurl_reportFormParam,
			"3" : "支付明细查询",
			"3_" : dfp_itemurl_reportFormIP + "/bi422-20160603/showreport.do?resid=EBI$12$KWNVUEM4LRCOXZLWK9SO3MLNNSWYO5DK$1$UMUYSPL6E5TUSZRMKWZMTKSIOXMKCK8U.rpttpl" + dfp_itemurl_reportFormParam,
			"4" : "预算执行情况查询",
			"4_" : dfp_itemurl_reportFormIP + "/bi422-20160603/showreport.do?resid=EBI$12$UYXTC5MKUMYXULKY73LN5QXW78YSQYM1$1$TC3B0QM8DMNVUC3CUKC1ZVK86OCJMAIK.rpttpl" + dfp_itemurl_reportFormParam,
			"5" : "国库集中支付年终结余资金对账单",
			"5_" : dfp_itemurl_reportFormIP + "/bi422-20160603/showreport.do?resid=EBI$12$MVURSBULV1UKITVV60L1XKMI4LVOI238$1$8UNKFCC5XLXNCNFUQ0NRIJJ9O9UQDOAL.rpttpl" + dfp_itemurl_reportFormParam,
			"6" : "预算单位分预算项目查询",
			"6_" : "",
			"7" : "自定义查询",
			"7_" : ""
		},
		/**
		 * 我要咨询
		 */
		wen : {
			"0" : "操作手册",
			"0_" : "",
			"1" : "操作规范",
			"1_" : "/doc/paybusiness/article.html",
			"2" : "公务卡",
			"2_" : "",
			"3" : "支付签章",
			"3_" : "",
			"4" : "凭证查询",
			"4_" : "",
			"5" : "凭证打印",
			"5_" : "",
			"6" : "资金监控",
			"6_" : "",
			"7" : "其他",
			"7_" : ""
		}
	},
	/**
	 * 预算指标
	 */
	budget : {
		/**
		 * 行点击事件链接
		 */
		tr : "",
		/**
		 * 右键按钮链接(参考单位经办)
		 */
		right : {
			"7" : "预算执行情况",
			"7_" : "/df/sd/pay/commonModal/traceBalanceList/balanceForPortal.html",
			"8" : "导出Excel",
			"8_" : ""
		}
	},
	/**
	 * 待办(title : menuid)
	 */
	dealing : {
		"0" : "授权支付凭证负责人签私章",
		"0_" : "1716C33244EBDD07931D3F6A12CA7C1A",
		"1" : "授权支付凭证负责人签公章",
		"1_" : "746503EE32CF8D7EBB46F7C32C9C3F00",
		"2" : "银行退回",
		"2_" : ""
	}
};

/**
 * 业务处室
 */
dfp_itemurl_ywcs = {
	/**
	 * 我要支付
	 */
	ban : {
		"0" : "年初控制数录入",
		"0_" : "/df/useablebudget/control/controlInput.html?billtype=141105&inputtype=21&workflowtype=1&is_ncs=1&menuid=AD42A528973650DDC01EFB7D6FBDCC24&menuname=%u5E74%u521D%u63A7%u5236%u6570%u5F55%u5165",
		"1" : "专项指标录入",
		"1_" : "/df/useablebudget/specialbudget/specialBudgetInput.html?billtype=141101&budgettype=141001&inputtype=0&menuid=EC0D16D7A4FDFDC7782222E3DC9BB651&menuname=%u4E13%u9879%u6307%u6807%u5F55%u5165",
		"2" : "人工监控",
		"2_" : "/df/fi_fip/search/businessConsole.html?objectcode=020003&menuid=DA98A8CB99977F13E82CD76826633F7F&menuname=%u4E1A%u52A1%u76D1%u63A7%u53F0"
	},
	/**
	 * 我要审
	 */
	shen : {
		"0" : "年初控制数审核",
		"0_" : "/df/useablebudget/check/check.html?billtype=141105&workflowtype=1&menuid=085C4927F579DAACE68740E7E65C3F9E&menuname=%u5E74%u521D%u63A7%u5236%u6570%u5BA1%u6838",
		"1" : "指标审核",
		"1_" : "/df/useablebudget/specialbudget/specialBudgetCheck.html?menuid=586803E78F78FCCE7EC70D7F535D30E3&menuname=%u4E13%u9879%u6307%u6807%u5BA1%u6838",
		"3" : "集中支付监控初审",
		"3_" : "1E86CB11E8EB0767E6DF91C39A8B1942",
		"4" : "集中支付监控初审（业务处室）",
		"4_" : "20EF3E11A8355C10262BEE810CE18F5D",
		"5" : "集中支付监控反馈确认（业务处室）",
		"5_" : "53A0DE3F6A79DDAC5171E6295AAD9686",
		"6" : "集中支付监控复审",
		"6_" : "A83FA34EE94EE4D3387B0DFDBE70E92A"
	},
	/**
	 * 我要查询
	 */
	cha : {
		"0" : "财政直接支付申请书查询",
		"0_" : "",
		"1" : "国库集中支付年终结余资金对账单查询",
		"1_" : "",
		"2" : "财政授权支付凭证查询",
		"2_" : "",
		"3" : "指标明细查询",
		"3_" : "",
		"4" : "支付名称查询",
		"4_" : ""
	},
	/**
	 * 我要咨询
	 */
	wen : {
		//"" : "",
		//"_" : ""
	}
};

/**
 * 集中支付
 */
dfp_itemurl_jzzf = {
	/**
	 * 常用操作
	 */
	often : {
		/**
		 * 我要支付
		 */
		ban : {
			"0" : "直接支付申请录入",
			"0_" : "/df/pay/centerpay/input/paInput.html?billtype=361&busbilltype=311&menuid=7FE5FD60CD24D467355C163B80024C03&menuname=%u76F4%u63A5%u652F%u4ED8%u7533%u8BF7%u5F55%u5165",
			"1" : "直接支付凭证生成",
			"1_" : "/df/pay/centerpay/bills/paVoucherBill.html?billtype=362&busbilltype=321&dotype=1&pk=dirPay&menuid=C58B7DF3FBB808AF37D87711323AFE31&menuname=%u76F4%u63A5%u652F%u4ED8%u51ED%u8BC1%u751F%u6210",
			"2" : "直接支付凭证发送",
			"2_" : "/df/pay/epay/centerpay/payVouBillSend.html?vtcode=5201&cpcode=900&menuid=9F011B67B10E108A096401B04A43F6DD&menuname=%u76F4%u63A5%u652F%u4ED8%u51ED%u8BC1%u53D1%u9001",
			"3" : "直接支付汇总清算单",
			"3_" : "/df/pay/epay/centerpay/payClearBillAddSign.html?vtcode=5108&position=cz_qm&menuid=7A29BD7445456785E15A564AD90710DF&menuname=%u76F4%u63A5%u652F%u4ED8%u6C47%u603B%u6E05%u7B97%u5355%u7B7E%u540D",
			"4" : "划款单生成汇总清算单",
			"4_" : "/df/pay/centerpay/bills/paAgentBillToClearBill.html?busbilltype=331&menuid=0F68C05BC54AE42CD8CF901EAFF270A6&menuname=%u5212%u6B3E%u5355%u751F%u6210%u6C47%u603B%u6E05%u7B97%u5355",
			"5" : "授权清算额度通知单生成",
			"5_" : "/df/pay/plan/bills/planClearBillCreate.html?busbilltype=232&menuid=FD3504B5256ED90C590878FDAAA782D7&menuname=%u6388%u6743%u6E05%u7B97%u989D%u5EA6%u901A%u77E5%u5355%u751F%u6210",
			"6" : "工资预导入",
			"6_" : "/df/sd/pay/plan/salaryImport.html?&uiparam=0>3&code=002&defaultCode=000&is_imp=0&is_voucher=1&is_plan=0&billtype=268&busbilltype=327&pk=realPay&tokenid=00000000000000000000000000007886ecd57jQN&menuid=B9FFFD6A7C9EAD4357E8DF8C3288312E&menuname=%u5DE5%u8D44%u9884%u5BFC%u5165",
			"7" : "授权清算额度通知单生成",
			"7_" : "/df/pay/plan/bills/planClearBillCreate.html?busbilltype=232&menuid=FD3504B5256ED90C590878FDAAA782D7&menuname=%u6388%u6743%u6E05%u7B97%u989D%u5EA6%u901A%u77E5%u5355%u751F%u6210",
//			"8" : "生成涉密单位直接支付凭证",
//			"8_" : "",
//			"9" : "涉密单位直接支付凭证发送",
//			"9_" : "",
//			"10" : "生成直接支付汇总清算额度通知单（含负数）",
//			"10_" : "",
//			"11" : "生成直接支付汇总清算额度通知单（打印）",
//			"11_" : "",
//			"12" : "直接支付申请初审",
//			"12_" : "",
			"13" : "直接支付凭证签名",
			"13_" : "/df/pay/epay/centerpay/payVouBillAddSign.html?vtcode=5201&position=cz_qm&menuid=58D644D32CA22F88AAB47A5DF2E0237E&menuname=%u76F4%u63A5%u652F%u4ED8%u51ED%u8BC1%u7B7E%u540D",
			"14" : "直接支付凭证审核签章",
			"14_" : "/df/pay/epay/centerpay/payVouBillAddStamp.html?vtcode=5201&menuid=96ABF6024C5ABE3A216D6A7CA9B189F5&menuname=%u76F4%u63A5%u652F%u4ED8%u51ED%u8BC1%u5BA1%u6838%u7B7E%u7AE0",
			"15" : "直接支付凭证终审签章",
			"15_" : "/df/pay/epay/centerpay/payVouBillAddStamp.html?vtcode=5201&menuid=0F7EC29DE8A719E8630D048716E7367D&menuname=%u76F4%u63A5%u652F%u4ED8%u51ED%u8BC1%u7EC8%u5BA1%u7B7E%u7AE0",
			// TODO cc 重复
			// /df/pay/epay/centerpay/payAddSign.html?vtcode=8201&position=cz_zfzx_jb&menuid=8157CC17AB94FBA23EE60D270CC91A53&menuname=%u5355%u4F4D%u76F4%u63A5%u652F%u4ED8%u7533%u8BF7%u7B7E%u540D
			// /df/pay/epay/centerpay/payAddSign.html?vtcode=8201&position=cz_zfzx_jb&menuid=84FF5240C333AFA2C172D48920A1A3C6&menuname=%u5355%u4F4D%u76F4%u63A5%u652F%u4ED8%u7533%u8BF7%u7B7E%u540D
			"16" : "单位直接支付申请签名",
			"16_" : "",
			"17" : "单位直接支付申请签章",
			"17_" : "/df/pay/epay/centerpay/payAddStamp.html?vtcode=8201&menuid=4361AB9F41C3CC589CA0E8681CC80D09&menuname=%u5355%u4F4D%u76F4%u63A5%u652F%u4ED8%u7533%u8BF7%u7B7E%u7AE0",
//			"18" : "涉密单位直接支付申请复审、签名",
//			"18_" : "",
//			"19" : "涉密单位直接支付凭证经办签章",
//			"19_" : "",
//			"20" : "涉密单位直接支付凭证负责人签章",
//			"20_" : "",
//			"21" : "涉密单位直接支付凭证支付专用章签章",
//			"21_" : "",
			"22" : "调度款录入",
			"22_" : "/df/sd/pay/realpay/input/dispatchFundsInput.html?billtype=378&realbilltype=325&busbilltype=330&acctype=71&menuid=E4A2B14E3216251F0C8C0E7D592736CB&menuname=%u8C03%u5EA6%u6B3E%u5F55%u5165"
		},
		/**
		 * 我要登
		 */
		deng : {
			"0" : "授权支付划款单登记",
			"0_" : "/df/pay/centerpay/bills/paFundReturnBill.html?billtype=364&busbilltype=344&menuid=3928197B5119442D6CE309287A8A6B6A&menuname=%u6388%u6743%u652F%u4ED8%u5212%u6B3E%u5355%u767B%u8BB0",
			"1" : "授权支付退划款回单登记",
			"1_" : "/df/pay/centerpay/bills/paFundReturnBill.html?billtype=364&busbilltype=344&menuid=89F44CA9D75E14A6461D4E0B25E670F1&menuname=%u6388%u6743%u652F%u4ED8%u9000%u5212%u6B3E%u56DE%u5355%u767B%u8BB0",
			"2" : "直接支付凭证回单登记",
			"2_" : "/df/pay/centerpay/bills/paPayBillReturn.html?billtype=362&busbilltype=321&menuid=094DEB3EF60E97749285F9F67E6E5C1C&menuname=%u76F4%u63A5%u652F%u4ED8%u51ED%u8BC1%u56DE%u5355%u767B%u8BB0",
			"3" : "直接支付划款回单登记",
			"3_" : "/df/pay/centerpay/bills/paFundReturnBill.html?billtype=363&busbilltype=342&menuid=AD6A764436B2FE99BB95F2B73CB24A66&menuname=%u76F4%u63A5%u652F%u4ED8%u5212%u6B3E%u56DE%u5355%u767B%u8BB0",
			// TODO cc
			"4" : "财政直接支付入帐通知书登记",
			"4_" : "",
			"5" : "直接支付退款通知书登记",
			"5_" : "/df/pay/centerpay/bills/paPayBillReturn.html?billtype=365&menuid=3341B6E8B89BACC5A620B436EA09B045&menuname=%u76F4%u63A5%u652F%u4ED8%u9000%u6B3E%u901A%u77E5%u4E66%u767B%u8BB0",
//			"6" : "直接支付划款单登记",
//			"6_" : "",
			"7" : "直接支付退款入账通知书登记",
			"7_" : "/df/pay/centerpay/bills/paAccountBillRegister.html?billtype=365&menuid=032F5F521D942EA1A21CDDEF5266F1FF&menuname=%u76F4%u63A5%u652F%u4ED8%u9000%u6B3E%u5165%u8D26%u901A%u77E5%u4E66%u767B%u8BB0",
//			"8" : "财政直接支付凭证回单登记",
//			"8_" : "",
//			"9" : "直接支付划款清算单回单登记（支付中心）",
//			"9_" : "",
//			"10" : "直接支付入账通知书中心登记",
//			"10_" : "",
//			"11" : "直接支付退款通知书登记",
//			"11_" : "",
//			"12" : "直接支付退款划款清算单回单登记（支付中心）",
//			"12_" : "",
//			"13" : "直接支付退款入账通知书登记（支付中心）",
//			"13_" : ""
		},
		/**
		 * 我要查询
		 */
		cha : {
			//"" : "",
			//"_" : "",
		},
		/**
		 * 我要咨询
		 */
		wen : {
			//"" : "",
			//"_" : "",
		}
	},
	/**
	 * 待办
	 */
	dealing : {
		//"" : "",
		//"_" : "",
	}
};

/**
 * 国库处领导
 */
dfp_itemurl_gkLeader = {
		
};

/**
 * 国库处普通用户
 */
dfp_itemurl_gkpt = {
	often : {
		/**
		 * 我要办
		 */
		ban : {
//			"0" : "直接支付汇总额度清算单发送",
//			"0_" : "",
//			"1" : "代单位用款申请录入",
//			"1_" : "",
//			"2" : "直接支付汇总清算额度通知单发送",
//			"2_" : "",
			"3" : "华青指标接收",
			"3_" : "/df/useablebudget/useable/useableReceive.html?billtype=141105&workflowtype=1&menuid=19E242C3FC774FB3529279139BF9CD03&menuname=%u534E%u9752%u6307%u6807%u63A5%u6536",
			"4" : "拨款凭证生成",
			"4_" : "/df/pay/centerpay/bills/paVoucherBill.html?billtype=372&busbilltype=325&menuid=740F37EF2A53B5F0993C400CDC414A36&menuname=%u62E8%u6B3E%u51ED%u8BC1%u751F%u6210",
			"5" : "拨款单发送",
			"5_" : "/df/pay/epay/centerpay/payVouBillSend.html?vtcode=5207&menuid=A28EA8D26031FBF3D546C5F5B3816064&menuname=%u62E8%u6B3E%u5355%u53D1%u9001",
			"6" : "转移性专项支付批量代编",
			"6_" : "/df/sd/pay/centerpay/input/paBatchInputSD.html?billtype=361&batchBillCode=001&batchArgs=011|012|013&menuid=AB1A0FAF7E19F4470031CE156F3CCDEE&menuname=%u8F6C%u79FB%u6027%u4E13%u9879%u652F%u4ED8%u6279%u91CF%u4EE3%u7F16",
			"7" : "直接支付汇总清算单签名",
			"7_" : "/df/pay/epay/centerpay/payClearBillAddSign.html?vtcode=5108&position=cz_qm&tokenid=00000000000000000000000000007886ecd57jQN&menuid=7A29BD7445456785E15A564AD90710DF&menuname=%u76F4%u63A5%u652F%u4ED8%u6C47%u603B%u6E05%u7B97%u5355%u7B7E%u540D",
			"8" : "直接支付汇总清算单机构签章",
			"8_" : "/df/pay/epay/centerpay/payClearBillAddStamp.html?vtcode=5108&tokenid=00000000000000000000000000007886ecd57jQN&menuid=768D2AEE13B743AAEA652F39AE11F9DF&menuname=%u76F4%u63A5%u652F%u4ED8%u6C47%u603B%u6E05%u7B97%u5355%u673A%u6784%u7B7E%u7AE0",
//			"9" : "单位用款申请审核",
//			"9_" : "",
//			"10" : "直接支付汇总清额度通知单负责人签章",
//			"10_" : "",
//			"11" : "直接支付汇总清算额度通知单机构签章",
//			"11_" : "",
//			"12" : "直接支付汇总清算额度通知单负责人签章",
//			"12_" : "",
//			"13" : "直接支付汇总清算额度通知单机构签章",
//			"13_" : "",
			"14" : "授权清算额度单审核签章",
			"14_" : "/df/pay/epay/plan/plClearBillAddStamp.html?vtcode=5106&menuid=772F68ED3AAC443EF5F544F7D4862769&menuname=%u6388%u6743%u6E05%u7B97%u989D%u5EA6%u5355%u5BA1%u6838%u7B7E%u7AE0",
			"15" : "授权清算额度单机构签章",
			"15_" : "/df/pay/epay/plan/plClearBillAddStamp.html?vtcode=5106&menuid=0C60BBF9204EB57E6A319DE0E4107542&menuname=%u6388%u6743%u6E05%u7B97%u989D%u5EA6%u5355%u673A%u6784%u7B7E%u7AE0",
			"16" : "授权清算额度单回单签收",
			"16_" : "/df/pay/epay/plan/plClearBillReturnReceive.html?vtcode=5106&menuid=51EE4A3FE52DA12B9A2B717E8901CF81&menuname=%u6388%u6743%u6E05%u7B97%u989D%u5EA6%u5355%u56DE%u5355%u7B7E%u6536",
			"17" : "拨款单审核签章",
			"17_" : "/df/pay/epay/centerpay/payVouBillAddStamp.html?vtcode=5207&menuid=AFDAFDAAD9C50A27AD05164D72AF7E21&menuname=%u62E8%u6B3E%u5355%u5BA1%u6838%u7B7E%u7AE0",
			"18" : "拨款单终审签章",
			"18_" : "/df/pay/epay/centerpay/payVouBillAddStamp.html?vtcode=5207&menuid=8292E8B0D000AF8A782B0AF1B46BB86C&menuname=%u62E8%u6B3E%u5355%u7EC8%u5BA1%u7B7E%u7AE0",
			"19" : "转移性专项支付申请审核",
			"19_" : "/df/sd/pay/centerpay/audit/paAudit.html?menuid=82AC6BF8672EA9B26A155CAC5F411025&menuname=%u8F6C%u79FB%u6027%u4E13%u9879%u652F%u4ED8%u7533%u8BF7%u5BA1%u6838"
		},
		/**
		 * 我要登
		 */
		deng : {
			"0" : "授权支付划款单登记",
			"0_" : "/df/pay/centerpay/bills/paFundReturnBill.html?billtype=364&busbilltype=344&menuid=3928197B5119442D6CE309287A8A6B6A&menuname=%u6388%u6743%u652F%u4ED8%u5212%u6B3E%u5355%u767B%u8BB0",
			"1" : "授权支付退划款回单登记",
			"1_" : "/df/pay/centerpay/bills/paFundReturnBill.html?billtype=364&busbilltype=344&menuid=89F44CA9D75E14A6461D4E0B25E670F1&menuname=%u6388%u6743%u652F%u4ED8%u9000%u5212%u6B3E%u56DE%u5355%u767B%u8BB0",
//			"2" : "直接支付划款单登记",
//			"2_" : "",
//			"3" : "直接支付划款单登记",
//			"3_" : "",
//			"4" : "直接支付汇总清算单签名",
//			"4_" : "",
//			"5" : "直接支付汇总清算单机构签章",
//			"5_" : "",
			"6" : "直接支付划款回单登记",
			"6_" : "/df/pay/centerpay/bills/paFundReturnBill.html?billtype=363&busbilltype=342&menuid=AD6A764436B2FE99BB95F2B73CB24A66&menuname=%u76F4%u63A5%u652F%u4ED8%u5212%u6B3E%u56DE%u5355%u767B%u8BB0",
//			"7" : "直接支付退款划款清算单回单登记（国库处）",
//			"7_" : "",
			"8" : "拨款单回单登记",
			"8_" : "/df/pay/centerpay/bills/paPayBillReturn.html?menuid=C1613A006FD4AE687ADE757F1189D8C4&menuname=%u62E8%u6B3E%u5355%u56DE%u5355%u767B%u8BB0"
//			"9" : "直接支付汇总清算单回单查看",
//			"9_" : "",
//			"10" : "直接支付汇总清算额度通知单回单查看",
//			"10_" : ""
		},
		/**
		 * 我要查询
		 */
		cha : {
			"0" : "直接支付汇总清算单回单查看",
			"0_" : "/df/pay/epay/centerpay/payClearBillReturnReceive.html?vtcode=5108&menuid=7D4E742E0EB465C46CB3C753A6A38810&menuname=%u76F4%u63A5%u652F%u4ED8%u6C47%u603B%u6E05%u7B97%u5355%u56DE%u5355%u67E5%u770B"
		},
		/**
		 * 我要咨询
		 */
		wen : {
			//"" : "",
			//"_" : "",
		}
	},
	/**
	 * 待办
	 */
	dealing : {
		//"" : "",
		//"_" : "",
	}
};

/**
 * 主管部门
 */
dfp_itemurl_zgbm = {
	/**
	 * 我要查询
	 */
	cha : {
		"0" : "财政直接支付申请书查询",
		"0_" : "",
		"1" : "国库集中支付年终结余",
		"1_" : "",
		"2" : "",
		"2_" : "",
		"3" : "",
		"3_" : "",
		"4" : "",
		"4_" : "",
		"5" : "",
		"5_" : ""
	},
	/**
	 * 我要咨询
	 */
	cha : {
		"" : "",
		"" : "",
		"" : "",
		"" : "",
		"" : "",
		"" : "",
		"" : "",
		"" : ""
	}
};

/**
 * 获取菜单及链接
 */
function dfpItemUrl() {
	
	// 获取用户名、角色等 - 区分用户权限及要显示的菜单及链接
	
	
}

dfpItemUrl_util = {
	/**
	 * 区分用户类型，返回相应权限
	 */
	type : function(type) {
		
	},
	/**
	 * 查询统一权限库，返回权限标识
	 */
	lable : function() {
		
	},
	/**
	 * 获取菜单及链接
	 */
	getMenuUrl : function() {
		
	}
	
};
