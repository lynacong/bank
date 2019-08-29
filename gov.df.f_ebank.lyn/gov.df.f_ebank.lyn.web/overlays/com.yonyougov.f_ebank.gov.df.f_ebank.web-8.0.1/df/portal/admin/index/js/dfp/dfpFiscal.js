/**
 * 财政百度
 * <p>需要 dfp.js </p>
 */
var dfpFiscal = dfpFiscal || {};

// 示例代码
//#search{width: 100%;padding-left: 6px;height: 41px;margin-bottom: 10px;}
//#search #text{display: inline-block;border-radius: 3px;height: 41px;background: #FFFFFF;border: 1px solid #D9D9D9;position: relative;}
//#search #text>input{background:none;border: none;width: 343px;height: 100%;display: inline-block;color: rgba(153,153,153,0.50);font-family: "微软雅黑";font-size: 14px;line-height: 18px;outline: none;}
//#search #pic{width: 47px;height: 41px;border: 1px solid #D9D9D9;position: absolute;top: -1px;right: -46px;}
//#search #pic>img{width: 14px;height: 14px;margin: 12px 0 0 15px;}
//<div id="search" style="margin-top:10px;">
//	<div id="text" style="margin-left:-6px;">
//		<input type="text" name="" style="margin-left: 10px;font-size: 16px;color: #000;width: 300px;" id="fiscalInput" value="" placeholder="&nbsp;&nbsp;请输入关键词"/>
//		<div id="pic" class="_portal_fiscal_sub _portal_cursor_pointer">
//			<img id="fiscalSubImg" style="transform: scale(1.3, 1.3) !important;transition:all 0.5s !important;" src="img/dashboard/search1.png"/>
//		</div>
//	</div>
//</div>

/**
 * 外网地址
 */
var DFP_FISCAL_URL_PUB = "http://192.168.10.11:8800/jsp/solr/index_czbd.jsp?tokenid="+getTokenId()+"&name=";
/**
 * 内网地址
 */
var DFP_FISCAL_URL_INS = "http://10.28.5.155:8800/jsp/solr/index_param.jsp?name=";

dfpFiscal = {
	
	/**
	 * 默认财政百度图片效果，需配合特定标签结构
	 * <p>不支持IE</p>
	 */
	bf : function(inputId){
		$("#pic").on("mouseover", function(){
			$(this).find("img").prop("src", "img/icon-cha-w.png");
			//$(this).find("img").css("transform", "scale(1.5, 1.5)");
			$(this).css("background-color", "#108ee9");
		}).on("mouseleave", function(){
			$(this).find("img").prop("src", "img/dashboard/search1.png");
			//$(this).find("img").css("transform", "scale(1.3, 1.3)");
			$(this).css("background-color", "#f8f8f8");
		});
		
		inputId = inputId==""||inputId==null||inputId==undefined ? "fiscalInput" : inputId;
		$("#"+inputId).on("focus", function(){
			$(this).prop("placeholder", "");
		}).on("blur",function(){
			if(!$(this).prop("value")){
				$(this).prop("placeholder", "请输入关键词");
			}
		});
		
		// 区分浏览器，设置不同浏览器下右侧距顶部高度（当前支持JB、SH）
		if(dfp_util.browser.isIE()) {
			$("#search").css("margin-top", "20px");
		} else {
			$("#search").css("margin-top", "10px");
		}
	},
	/**
	 * 设置财政百度属性
	 * @param param 参数，格式为 url + param
	 * @param [title] 标题，默认“财政百度”
	 */
	set : function(param, title){
		if(!title){
			title = "财政百度";
		}
		window.parent.addTabToParent(title, DFP_FISCAL_URL_PUB + param); //+ "&agencycode=" + Base64.decode($("#svAgencyCode", parent.document).val()) );
		// 开启循环检测
		window.parent.isDfFiscalSelectedUrl();
	}
	
};
