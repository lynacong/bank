/**
 * 待办，需要 dfp.js
 */
define(
	['jquery', 'text!portal/element/dealing/dealing.html'],
	function($, textDealing) {
		
		var _pre = '_dfp_dealing_';
		var dealingDiv = _pre + 'div', // 外div
			dealingBtn = _pre + 'btn', // 按钮组外div
			dealingContent = _pre + 'content'; // 内容div
		
		/**
		 * 初始化dealing模块
		 * @params id 标签id
		 * @params num 模式编号，默认1
		 * @params type 1 首次加载，2 非首次加载
		 * @params obj 自定义对象，详见 options()
		 */
		function init(id, num, type, obj) {
			num = num || 1;
			type = type || 1;
			var op = {};
			if(type == 1) {
				var $id = $("#" + id);
				$id.html('').append(textDealing);
				op = options(num, obj);
			}
			show(op, num);
		}
		
		/**
		 * 获取数据，选择模板
		 * @params op 对象
		 * @params num html模板序号
		 */
		function show (op, num) {
			num = num || 1;
			op['success'] = function(data) {
				var dealingThing = data.dealingThing;
				var menuLv3 = dfp.getMenuLv3();
				var html = '';
				
				for (var i = 0, len = dealingThing.length || 0; i < len; i++) {
					var menuid = dealingThing[i].menu_id,
						name = (dealingThing[i].menu_name).replace(/[\n]/g, "");
					//var showname = name;
					var url = dealingThing[i].menu_url;
					var targetMenuId = dfp.getUrlParameter(url, 'targetMenuId');
					if(targetMenuId){
						menuid = targetMenuId;
						var activeStatusCode = dfp.getUrlParameter(url, 'activeStatusCode');
						name = dfp.getUrlParameter(url, 'showName');
						for(var j in menuLv3) {
							if(!menuLv3.hasOwnProperty(j)) continue;
							var onemenu = menuLv3[j];
							if(menuid == onemenu.guid) {
								name = onemenu.name;
								url = onemenu.url;
								if(activeStatusCode != null)
									url += '&activetabcode=' + activeStatusCode;
								break;
							}
						}
					}
					var task = dealingThing[i].task_content,
						title = name + " " + task,
						url = dfp.fullURL(url)+'&menuid='+menuid+'&menuname='+escape(name);
					
					html += dfp.strFormat(htmlModel[num], op.content.style.li, op.content.style.li_a, dfp.params2Str(name, url), title, title);
				}

				$("#" + op.content.id).find("ul").html(html);	
			};
			
			dfp.ajax(op);
		}
		
		/**
		 * 属性模板
		 */
		var optionsModel = [
			{},
			{
				url : dfp.fullURL('/df/portal/getDealingThing.do')
				, type : 'GET'
				, async : !1
				, dataType : 'json'
				, data : dfp.commonData({
					userid : $("#svUserId", parent.document).val(),
					roleid : $("#svRoleId", parent.document).val(),
					region : $("#svRgCode", parent.document).val(),
					year : $("#svSetYear", parent.document).val()
				})
				, main : {
					id : dealingDiv
				}
				, header : {
					name : '待办事项',
					cls : '',
					style : ''
				}
				, btn : { // 内部按钮具体样式由调用者实现
					id : dealingBtn,
					cls : '',
					style : ''
				}
				, content : {
					id : dealingContent,
					style : {
						li : 'width: 100%;font-size: 14px;',
						li_a : 'list-style: none;height: 30px;line-height: 30px;color: #151515;font-family: "微软雅黑";font-size: 14px;display: inline-block;width: 95%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'
					}
				}
			}
			
		];
		function options(num, o) {
			return dfp.replaceObjAttr(optionsModel[num], o);
		}
		
		/**
		 * html模板
		 */
		var htmlModel = [
			'',
			'<li style="{0}"><span></span><a style="{1}" href="javascript:window.parent.addTabToParent({2});" title="{3}">{4}</a></li>'
		];
		
		return {
			init : init,
			btnId : dealingBtn
		}
		
	}
);
