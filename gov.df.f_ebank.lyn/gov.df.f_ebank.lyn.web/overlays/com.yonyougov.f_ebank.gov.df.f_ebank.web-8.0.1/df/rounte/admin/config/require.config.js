require.config({
	baseUrl: ".",
	waitSeconds: 0,
//	urlArgs: "r=" + (new Date()).getTime(),//防止从缓存中读取js模块
	paths: {
		text: "vendor/requirejs/text",
		css: "vendor/requirejs/css",
		jquery: "vendor/jquery/jquery-1.11.2",
		jquery12: "trd/jquery/jquery-1.8.2.min",
		bootstrap: 'vendor/bootstrap/js/bootstrap',
		knockout: "vendor/knockout/knockout-3.2.0.debug",
		uui: "trd/uui/new/u",
		grid: "trd/uui/new/u-grid",
		tree: "trd/uui/new/u-tree",
		director:"vendor/director/director",
		biz: "vendor/uui/js/u.biz",
		pages:"pages",
		scrollbarmin:"vendor/jquery.mCustomScrollbar.concat",

		jqUi: "trd/jquery-ui/jquery-ui.min",
		ztreeEdit: "trd/jquery/jquery.ztree.exedit",
		ztreeCore: "trd/jquery/jquery.ztree.core",
		ztreeCheck: "trd/jquery/jquery.ztree.excheck",

		html5shiv:"vendor/html5shiv.min",
		respond:"vendor/respond.min",
		es5sham:"trd/uui/new/es5-sham.min",
		html5:"trd/uui/new/html5.min",
		
		//电子对账公共js
		ebalanceConstants:"pages/common/ebalanceConstants",
		ebalanceCommonUtil:"pages/common/ebalanceCommonUtil",
        ebalanceAssp:"pages/ebalance/assp/asspUtil",

	    // director:"trd/director/director",
		u_polyfill:"trd/uui/new/u-polyfill",
		polyfill:"trd/uui/new/polyfill",
		md5: "trd/md5/js/md5",
		select2: "trd/select2/select2",
		ip:"trd/ip/js/ip",
		dateZH: "trd/datetimepicker/js/bootstrap-datetimepicker",
		echarts:"trd/echarts/echarts.simple.min",
		ebankConstants:"pages/common/ebankConstants",
		operate:"pages/common/operate",
		commonUtil:"pages/common/commonUtil",
		ebankCommonUtil:"pages/common/ebankCommonUtil",		
		jspdf: "trd/jspdf/jspdf.debug",
		jszip: "trd/jszip/jszip",
		xlsx: "trd/xlsx/xlsx",
	    bolb: "trd/blob/Blob",
		fileSaver: "trd/fileSaver/FileSaver.min",
		dataTableExcel: "trd/dataTableExcel/dataTableExcel",
		HStable:"trd/handsontable/handsontable.full",
		assp:"trd/assp/asspUtil",
		initDataTableUtil:"pages/common/ebankDataTableUtil",
		'jquery.file.upload' : "trd/jquery-fileupload/jquery.fileupload",
		'jquery.ui.widget':"trd/jquery-fileupload/jquery.ui.widget",
		'jquery.iframe.transport':"trd/jquery-fileupload/jquery.iframe-transport",
		'tmpl':"trd/jquery-fileupload/tmpl.min",
		'datatables' : 'trd/DataTables/datatables.min',
		'datatables-select' : 'trd/DataTables/Select/js/dataTables.select.min',
			/*DataTables数据表格*/
    'datatables.net': 'trd/DataTables/DataTables/js/jquery.dataTables',
    'datatables.net-bs': 'trd/DataTables/DataTables/js/dataTables.bootstrap.min',

    /*DataTables扩展和插件: 填充*/
    'datatables.net-autofill': 'trd/DataTables/AutoFill/js/dataTables.autoFill.min',
    'datatables.net-autofill-bs': 'trd/DataTables/AutoFill/js/autoFill.bootstrap.min',

    /*DataTables扩展和插件: 按钮*/
    'datatables.net-buttons': 'trd/DataTables/Buttons/js/dataTables.buttons.min',
    'datatables.net-buttons-bs': 'trd/DataTables/Buttons/js/buttons.bootstrap.min',
    'datatables.net-buttons-colVis': 'trd/DataTables/Buttons/js/buttons.colVis.min',
    'datatables.net-buttons-flash': 'trd/DataTables/Buttons/js/buttons.flash.min',
    'datatables.net-buttons-html5': 'trd/DataTables/Buttons/js/buttons.html5.min',
    'datatables.net-buttons-print': 'trd/DataTables/Buttons/js/buttons.print.min',

    /*DataTables扩展和插件: 行列拖动*/
    'datatables.net-colreorder': 'trd/DataTables/ColReorder/js/dataTables.colReorder.min',
    'datatables.net-rowreorder': 'trd/DataTables/RowReorder/js/dataTables.rowReorder.min',

    /*DataTables扩展和插件: 表内编辑*/
    'datatables.net-editor': 'trd/DataTables/Editor/js/dataTables.editor.min',
    'datatables.net-editor-bs': 'trd/DataTables/Editor/js/editor.bootstrap.min',

    /*DataTables扩展和插件: 固定行列*/
    'datatables.net-fixedColumns': 'trd/DataTables/FixedColumns/js/dataTables.fixedColumns.min',
    'datatables.net-fixedHeader': 'trd/DataTables/FixedHeader/js/dataTables.fixedHeader.min',

    /*DataTables扩展和插件: 热键*/
    'datatables.net-keyTable': 'trd/DataTables/KeyTable/js/dataTables.keyTable.min',

    /*DataTables扩展和插件: 响应式*/
    'datatables.net-responsive': 'trd/DataTables/Responsive/js/dataTables.responsive.min',

    /*DataTables扩展和插件: 滚动*/
    'datatables.net-scroller': 'trd/DataTables/Scroller/js/dataTables.scroller.min',

    /*DataTables扩展和插件: 选择器*/
    'datatables.net-select': 'trd/DataTables/Select/js/dataTables.select.min',

    /*插件,多个需合并*/
    'datatables.plugins-ellipsis': 'trd/DataTables/Plugins/dataRender/ellipsis',
    'reportUtil':'pages/report/reportUtil',
    'jquery.media':'trd/jquery-media/jquery.media',	
    'calendar':'trd/calendar/js/daterangepicker',	
    'moment':'trd/calendar/js/moment.min',	
	},
	shim: {
		'calendar':{deps:["jquery","moment","css!trd/calendar/css/daterangepicker.css","css!trd/calendar/css/normalize.css"]},
		'reportUtil':{deps: ["jquery","jquery.media"]},
		'jquery.media':{deps: ["jquery"]},
		'uui':{
			deps:["jquery","bootstrap","knockout","u_polyfill", "css!trd/uui/css/font-awesome.min.css"]
		},
		'grid':{
			deps:["uui","css!vendor/uui/css/grid.css"]
		},
		'bootstrap': {
			deps: ["jquery"]
		},
		'tree':{
			deps: ["uui","css!vendor/uui/css/tree.css"]
		},

		'ip':{
			deps: ["jqUi"]
		},
		'ztreeEdit':{
			deps: ["jquery"]	
		},
		'ztreeCore':{
			deps: ["jquery"]	
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
		'dateZH': {
			deps: ["bootstrap"]
		},
		// 'dateZH': {
		// 	deps: ["bootstrap","date","css!trd/datetimepicker/css/bootstrap-datetimepicker.min.css"]
		// },
		'jqUi': {
			deps: ["css!trd/jquery-ui/jquery-ui.css"]
		},
		'jquery.file.upload':{
			deps: ["jquery", "jquery.ui.widget", "jquery.iframe.transport", "tmpl","css!trd/jquery-fileupload/jquery.fileupload.css" ]
		},
		'ip': {
			deps: ["jquery","jqUi"]
		},
				  /*DataTables数据表格*/
    'datatables.net-bs': {
      deps: ['css!trd/DataTables/DataTables/css/dataTables.bootstrap.min'],
    },

    /*DataTables扩展和插件: 填充*/
    'datatables.net-autofill-bs': {
      deps: ['css!trd/DataTables/AutoFill/css/autoFill.bootstrap.min'],
    },

    /*DataTables扩展和插件: 按钮*/
    'datatables.net-buttons-bs': {
      /*deps: ['datatables.net-buttons-colVis', 'datatables.net-buttons-flash', 'datatables.net-buttons-html5', 'datatables.net-buttons-print', 'css!trd/DataTables/Buttons/css/buttons.bootstrap.min'],*/
      deps: ['css!trd/DataTables/Buttons/css/buttons.bootstrap.min'],
    },

    /*DataTables扩展和插件: 行列拖动*/
    'datatables.net-colreorder': {
      deps: ['css!trd/DataTables/ColReorder/css/colReorder.bootstrap.min'],
    },
    'datatables.net-rowreorder': {
      deps: ['css!trd/DataTables/RowReorder/css/rowReorder.bootstrap.min'],
    },

    /*DataTables扩展和插件: 表内编辑*/
    'datatables.net-editor-bs': {
      deps: ['css!trd/DataTables/Editor/css/editor.bootstrap.min'],
    },

    /*DataTables扩展和插件: 固定行列*/
    'datatables.net-fixedColumns': {
      deps: ['css!trd/DataTables/FixedColumns/css/fixedColumns.bootstrap.min'],
    },
    'datatables.net-fixedHeader': {
      deps: ['css!trd/DataTables/FixedHeader/css/fixedHeader.bootstrap.min'],
    },

    /*DataTables扩展和插件: 热键*/
    'datatables.net-keyTable': {
      deps: ['css!trd/DataTables/KeyTable/css/keyTable.bootstrap.min'],
    },

    /*DataTables扩展和插件: 响应式*/
    'datatables.net-responsive': {
      deps: ['css!trd/DataTables/Responsive/css/responsive.bootstrap.min'],
    },

    /*DataTables扩展和插件: 滚动*/
    'datatables.net-scroller': {
      deps: ['css!trd/DataTables/Scroller/css/scroller.bootstrap.min'],
    },

    /*DataTables扩展和插件: 选择器*/
    'datatables.net-select': {
      deps: ['css!trd/DataTables/Select/css/select.bootstrap.min'],
    },

    /*插件,多个需合并*/
    'datatables.plugins-ellipsis': {
      deps: ['datatables.net-bs'],
    },
	}
});
