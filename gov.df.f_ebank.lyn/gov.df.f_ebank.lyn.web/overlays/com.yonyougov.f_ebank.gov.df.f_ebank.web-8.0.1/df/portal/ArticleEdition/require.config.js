require.config({
	baseUrl: "/df/",
	waitSeconds: 0,
	paths: {
		text: "trd/requirejs/text",
		css: "trd/requirejs/css",
		jquery: "trd/jquery/jquery-1.12.3.min",
		ztreeEdit: "trd/jquery/jquery.ztree.exedit",
		ztreeCore: "trd/jquery/jquery.ztree.core",
		ztreeCheck: "trd/jquery/jquery.ztree.excheck",
		bootstrap: 'portal/ArticleEdition/js/bootstrap.min',
		knockout: "trd/knockout/knockout-3.2.0.debug",
		uui: "trd/uui/js/u",
		director:"trd/director/director",
		polyFill: "trd/uui/js/u-polyfill",
		tree: "trd/uui/js/u-tree",
		grid: "trd/uui/js/u-grid",
		md5: "trd/md5/js/md5",
		select2: "trd/select2/select2",
		ip:"trd/ip/js/ip",
//		date: "portal/ArticleEdition/js/bootstrap-datetimepicker",
		ckeditor: "portal/ArticleEdition/ckeditor/ckeditor",
		Base64:"portal/admin/index/js/Base64",
		date: "trd/datetimepicker/js/bootstrap-datetimepicker",
		dateZH: "portal/ArticleEdition/js/locales/bootstrap-datetimepicker.zh-CN",
		fileInput: "portal/ArticleEdition/js/fileinput",
		theme: "portal/ArticleEdition/themes/explorer/theme",
	},
	shim: {
		'uui':{
			deps: ["jquery","bootstrap","polyFill", "css!trd/uui/css/font-awesome.min.css"]
		},
		'bootstrap': {
			deps: ["jquery"]
		},
		'ztreeEdit':{
			deps: ["jquery"]	
		},
		'ztreeCore':{
			deps: ["jquery"]	
		},
		'theme':{
			deps: ["jquery","fileInput"]	
		},
		'ztreeCheck':{
			deps: ["jquery"]	
		},
		'tree': {
			deps: ["uui"]
		},
		'grid': {
			deps: ["uui"]
		},
		'select2': {
			deps: ["css!trd/select2/select2.css"]
		},
		'date': {
			deps: ["dateZH","css!portal/ArticleEdition/bootstrap/css/bootstrap.min.css","css!portal/ArticleEdition/css/bootstrap-datetimepicker.min.css"]
		},
		'fileInput': {
			deps: ["jquery"]
		},
	}
});
