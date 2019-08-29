function initDetailDialog(config) {
	var _title = config.title || '明细';
	var _template = '<div class="modal fade" id="detailDialog">' + '<div class="modal-dialog modal-lg myModalDetailNew-dialog">'
			+ '<div class="modal-content">' + '<div class="modal-header">'
			+ '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
			+ '<h4 class="modal-title">'
			+ _title
			+ '</h4>'
			+ '</div>'
			+ '<div class="modal-body modal-body-input flex flex-v">'
			+ '<div class="search">'
			+ '<div  class="row high-search">'
			+ '<div class="high-search-row">'
			+ '<div id="detailSearchArea">'
			+ '<div class="col-sm-4">'
			+ '<button type="button" onclick="doDetailRefresh()" class="btn btn-default ip-font-color glyphicon glyphicon-refresh" style="margin-left: 20px;width: 70px;"></button>'
			+ '</div>'
			+ '</div>'
			+ '</div>'
			+ '</div>'
			+ '</div>'
			+ '<div class="grid-area-vice flex-1">'
			+ '<div id="detailGridArea" class="tabbed-grid tabbed-grid-modal"></div>	' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>';
	var oParent = document.getElementById(config.container);
	oParent.innerHTML = _template;

}

/*
 * modalId : (string) 必填 modal的id beforeCreate : (function) 选填 弹出框生成之前回调函数
 * afterCreate : (function) 选填 弹出框生成之后回调函数 url (string) modal-body引入模板的路径
 * {{***}}是变量 可以在初始化之前使用 datailOption.***赋值
 * 
 */

var global = {};
global.drOption = {
	'modalId' : 'drCommonDialog',
	'url' : '/df/fap/dataright/drDialog.txt'
};



function DialogModal(option) {
	this.modalId = option.modalId;
	this.url = option.url;
	this.beforeCreate = option.beforeCreate || null;
	this.afterCreate = option.afterCreate || null;
	this.createModal(option);
}

DialogModal.prototype = {
	createModal : function(option) {
		var oThis = this;
		var modalBox = $("#" + this.modalId)[0];
		if (modalBox) {
			return false;
		}
		if (this.beforeCreate) {
			this.beforeCreate();
		}
		var aParent = '<div id="' + this.modalId + 'Area">';
		$.ajaxSetup({
			async : false,
		});
		$(aParent).load(this.url, function(response, status, xhr) {
			var aReg = /{{\S+}}/g;
			if (aReg.test(response)) {
				var aArr = response.match(aReg);
				var variable;
				for ( var i = 0; i < aArr.length; i++) {
					variable = aArr[i].replace("{{", "").replace("}}", "");
					response = response.replace(aArr[i], option[variable]);
				}
				$(this).html(response);
			}
			$(this).find(".modal").attr("id", oThis.modalId);
		}).prependTo("body");
	}
};
