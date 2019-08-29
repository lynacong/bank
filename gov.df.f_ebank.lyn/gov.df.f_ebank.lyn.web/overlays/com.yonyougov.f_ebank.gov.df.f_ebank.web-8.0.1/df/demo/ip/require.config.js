require.config({
	baseUrl: "../../../",
	waitSeconds: 0,
	paths: {
		text: "trd/requirejs/text",
		css: "trd/requirejs/css",
		jquery: "trd/jquery/jquery-1.12.3.min",
		jqUi: "trd/jquery-ui/jquery-ui.min",
		bootstrap: 'trd/bootstrap/js/bootstrap',
		knockout: "trd/knockout/knockout-3.2.0.debug",
		uui: "trd/uui/js/u",
		director:"trd/director/director",
		polyFill: "trd/uui/js/u-polyfill",
		tree: "trd/uui/js/u-tree",
		grid: "trd/uui/js/u-grid",
		ip: "trd/ip/js/ip",
		date: "trd/datetimepicker/js/bootstrap-datetimepicker.min",
		dateZH: "trd/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN",
		jspdf: "trd/jspdf/jspdf.debug",
		HStable:"trd/handsontable/handsontable"
	},
	shim: {
		'ip':{
			deps: ["jqUi"]
		},
		'uui':{
			deps: ["jquery","bootstrap","polyFill", "css!trd/uui/css/font-awesome.min.css"]
		},
		'bootstrap': {
			deps: ["jquery"]
		},
		'tree': {
			deps: ["uui"]
		},
		'grid': {
			deps: ["uui"]
		},
		'data': {
			deps: ["bootstrap"]
		},
		'dateZH': {
			deps: ["bootstrap","date","css!trd/datetimepicker/css/bootstrap-datetimepicker.min.css"]
		},
	}
});
