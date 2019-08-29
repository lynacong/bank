/**
 * 财政百度，需要 dfp.js
 */
define(
	['jquery', 'text!portal/element/fiscal/fiscal.html'],
	function($, textFiscal) {
		
		var _pre = '_dfp_fiscal_';
		var fiscalDiv = _pre + 'div', // 外div
			fiscalInput = _pre + 'input', // 输入框
			fiscalSpan = _pre + 'span', // 确认键外框
			fiscalImg = _pre + 'img'; // 确认键背景
		
		/**
		 * 外网地址
		 */
		var DFP_FISCAL_URL_PUB = "http://192.168.10.11:8800/jsp/solr/index_czbd.jsp?tokenid="+getTokenId()+"&name=";
		/**
		 * 内网地址
		 */
		var DFP_FISCAL_URL_INS = "http://10.28.5.155:8800/jsp/solr/index_param.jsp?name=";
		
		/**
		 * 财政百度初始化
		 * @params id 
		 * @params title 标签名，默认"财政百度"
		 */
		function init(id, title) {
			title = title || '财政百度';
			$("#" + id).html(textFiscal);
			
			// input
			$("#" + fiscalInput).on("focus", function(){
				$(this).prop("placeholder", "");
			}).on("blur",function(){
				if(!$(this).prop("value"))
					$(this).prop("placeholder", "请输入关键词");
			});
			// img
//			$("#" + fiscalSpan).on("mouseover", function() {
//				$(this).find("img")
//					.prop("src", "/df/portal/element/fiscal/img/fiscal-search-w.png")
//					.css("background-color", "#108ee9");
//			}).on("mouseleave", function() {
//				$(this).find("img")
//					.prop("src", "/df/portal/element/fiscal/img/fiscal-search.png")
//					.css("background-color", "#f8f8f8");
//			});
			// click
			$("#" + fiscalSpan).on("click", function() {
				var fiscalParam = $("#" + fiscalInput).val();
				if (fiscalParam == "") {
					layer.confirm('请输入要查询的内容/关键词', {
						btn: ['确定']
						, title : '财政百度 提示'
						, shadeClose : true
						, cancel : function() {
							$("#" + fiscalInput).focus();
						}
					}, function(index) {
						$("#" + fiscalInput).focus();
						layer.close(index);
					});
				} else {
					fiscalClick(title, fiscalParam);
				}
			});
			// 全局键盘事件
			document.onkeydown = function(e) {
				var ev = (typeof event!= 'undefined') ? window.event : e;
				if(ev.keyCode == 13) { // 回车
					if($("#" + fiscalInput).val() != "")
						$("#" + fiscalSpan).click();
				}
			}
			
		}
		
		function fiscalClick(title, val) {
			window.parent.addTabToParent(title, DFP_FISCAL_URL_PUB + val); //+ "&agencycode=" + Base64.decode($("#svAgencyCode", parent.document).val()) );
		}
		
		return {
			init : init
		}
		
	}
);
