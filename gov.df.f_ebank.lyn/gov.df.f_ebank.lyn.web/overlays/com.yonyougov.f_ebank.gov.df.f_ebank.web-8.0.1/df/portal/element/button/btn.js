define(
	['jquery'],
	function($) {
		
		/**
		 * 初始化button（事件需要使用者绑定）
		 * @params id 标签id
		 * @params num 模式编号，默认1
		 * @params type 按钮类型，1 普通按钮(默认)/ 2 小按钮
		 * @params obj 自定义对象，详见 sbtnOptionsModel()
		 */
		function init(id, num, type, obj) {
			num = num || 1;
			type = type || 1;
			if(type === 1) {
				$("#" + id).append(btn(num, obj));
			} else if(type === 2) {
				$("#" + id).html(sbtn(num, obj));
			} 
			
		}
		
		/**
		 * 小按钮，标题行显示
		 */
		var sbtnOptionsModel = [
			{},
			{
				id : '',
				title : '按钮',
				btncls : 'btn btn-info btn-sm ',
				btnstyle : '',
				icls : 'fa fa-fw ',
				istyle : ''
			}
		];
		var sbtnHtml = [
			'<button></button>',
			'<button type="button" id="{0}" title="{1}" class="{2}" style="{3}"><i class="{4}" style="padding: 0;{5}"></i></button>'
		];
		function sbtn(num, o) {
			o = dfp.replaceObjAttr(sbtnOptionsModel[num], o);
			return dfp.strFormat(sbtnHtml[num], o.id, o.title, o.btncls, o.btnstyle, o.icls, o.istyle);
		}
		
		/**
		 * 普通按钮
		 */
		var btnOptionsModel = [
			{},
			{}
		];
		var btnHtml = [
			'<button></button>',
			''
		];
		function btn(num, o) {
			return dfp.replaceObjAttr(btnOptionsModel[num], o);
		}
		
		return {
			init : init
		};
		
	}
);
