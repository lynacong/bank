/**
 * 文章公告，依赖 article.html
 */
define(
	['jquery', 'text!portal/element/article/article.html'],
	function($, textArticle) {
		var _pre = '_dfp_article_';
		var articleDiv = _pre + 'div', // 外div
			articleBtn = _pre + 'btn', // 按钮组外div
			articleContent = _pre + 'content'; // 内容div
		
		/**
		 * 初始化article模块（TODO 自定义对象，柯里化）
		 * @params id 标签id
		 * @params num 模式编号，默认1
		 * @params type 1 首次加载，2 非首次加载
		 * @params obj 自定义对象，详见 options()
		 */
		function init (id, num, type, obj) {
			num = num || 1;
			type = type || 1;
			var op = {};
			if(type == 1) {
				var $id = $("#" + id);
				$id.html('').append(textArticle);
				op = options(num, obj);
			}
			show(num, op);
		}
		
		/**
		 * 获取数据，选择模板
		 * @params op 对象
		 * @params num html模板序号
		 */
		function show (num, op) {
			num = num || 1;
			op['success'] = function(data) {
				var html = '',
					path = "../../common/articleDetail.jsp?";
				for (var i = 0; i < data.length || 0; i++) {
					var name = (data[i].article_title).replace(/(^\s+)|(\s+$)/g, "");
					var url = path + 'articleId=' + data[i].article_id + '&title=' + name + '&tokenid=' + getTokenId();
					html += dfp.strFormat(htmlModel[num], op.content.style.li, op.content.style.li_a, dfp.params2Str(name, url), name, name);
				}
				$("#" + op.content.id).find("ul").html(html);
				
			};
			
			dfp.ajax(op);
		}
		
		/**
		 * 配置套装
		 * @params num 模板序号
		 * @params o 自定义对象，用于覆盖默认参数
		 * -- url ajaxUrl
		 * -- async ajax异步，默认 true
		 * -- params ajaxParams
		 * -- main 模块主体div
		 * -- header 标题行
		 * -- btn 按钮组
		 * -- content 内容主体div
		 */
		var optionsModel = [
			{}, // 空配置
			{
				url : dfp.fullURL('/portal/GetPageJsonData.do')
				, type : 'GET'
				, async : !0
				, dataType : 'json'
				, data : {
					_t : Date.parse(new Date()),
					ruleID : 'portal-df-menu.getArticleData',
					userId : 'sa',
					start : '0',
					limit : 3, // 默认显示3条
					pgPletId : '' // 数据库pgPletId
				}
				, main : {
					id : articleDiv
				}
				, header : {
					name : '公告信息',
					cls : '',
					style : ''
				}
				, btn : { // 内部按钮具体样式由调用者实现
					id : articleBtn,
					cls : '',
					style : ''
				}
				, content : {
					id : articleContent,
					style : {
						li : 'width: 100%;font-size: 14px;',
						li_a : 'list-style: none;height: 30px;line-height: 30px;color: #151515;font-family: "微软雅黑";font-size: 14px;display: inline-block;width: 95%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'
					}
				}
			}
			
		];
		var options = function(num, o) {
			// 覆盖默认值
			return dfp.replaceObjAttr(optionsModel[num], o);
		};
		
		/**
		 * 页面代码模板
		 */
		var htmlModel = [
			'', // 空
			'<li style="{0}"><span></span><a style="{1}" href="javascript:window.parent.addTabToParent({2});" title="{3}">{4}</a></li>'
		];
		
		return {
			init : init,
			btnId : articleBtn
		};
	}
	
);
