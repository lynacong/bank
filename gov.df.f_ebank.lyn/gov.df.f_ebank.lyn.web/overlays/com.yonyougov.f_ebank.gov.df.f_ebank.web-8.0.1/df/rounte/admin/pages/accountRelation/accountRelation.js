define(['text!pages/accountRelation/accountRelation.html',
        'jquery','bootstrap','ip','datatables.net-bs', 
        'datatables.net-autofill-bs','datatables.net-buttons-bs',
        'datatables.net-colreorder','datatables.net-rowreorder',
        'datatables.net-select','datatables.net-scroller',
        'datatables.net-keyTable','datatables.net-responsive',
        'initDataTableUtil' ],function(html){
	var init =function(element,param){ 
		document.title=ip.getUrlParameter("menuname");
 		var qsSelect = {};
		var hkSelect = {};
 		var viewModel = {
 			tokenid :ip.getTokenId(),
		};
 		
 		//界面进入的时候初始化支付账户数据
 		viewModel.subsysGrid = function() {
			var balance_account_id = "";
			var account_type = "002";
			$.ajax({
				url : "/df/f_ebank/accountRelation/getAccountData.do?tokenid="
						+ viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "nocache",
					"account_type" : account_type,
					"balance_account_id" : balance_account_id
				},
				success : function(datas) {
					if (datas.errorCode == "0") {
						$('#gridDatatable').DataTable( {
							 	destroy: true,
			 			    	searching: true,
			 			    	paging: true,
			 			    	bSort: false,
			 			    	bInfo: false,
			 			    	autoWidth:false,
			 			        bLengthChange: true,
				 		        iDisplayLength: 10,
				 		       scrollY:$("#leftDiv").innerHeight()-150 + "px",
				 		        lengthMenu: [
				 		                   [ 10, 25,50, 100, 200,2000],
				 		                   [ '10', '25','50', '100', '200','2000']
				 		                 ],
		 		                dom: //f:filtering input
			 		                 '<\'row\'<\'col-xs-3\'><\'col-xs-4\'><\'col-xs-5 search-input\'f>>' +
			 		                 't' +   //t:表格   
			 		                 //一行内: i:Table information summary,p:pagination control,l:length changing input control
			 		                 '<\'row\'<\'col-xs-3\'i><\'col-xs-6\'p><\'col-xs-3 pub-page\'l>>' +
			 		                 '<\'row\'<\'#mytool.col-xs-6\'>r>',
		 		                 language: {
		 		                   'lengthMenu': '每页_MENU_条 ',
		 		                   'infoEmpty': '',
		 		                   'infoFiltered': '(从 _MAX_ 条数据中检索)',
		 		                   'zeroRecords': '没有检索到数据',
		 		                   'search': '查询',
		 		                   'paginate': {
		 		                     'first': '首页',
		 		                     'previous': ' < ',
		 		                     'next': ' >',
		 		                     'last': '尾页'
		 		                   },
					            },
						        data:datas.dataDetail,
						        columns: [
						            { data: 'chr_id' },
						            { data: 'account_name',"width":"210px"},
						            { data: 'account_no',"width":"140px"},
						            { data: 'bank_name',"width":"180px"},
						            { data: 'bank_code' },
						            { data: 'account_type' },
						            { data: 'account_type_name' },
						            { data: 'account_relation_ele' }
						        ],
						        "fnDrawCallback": function() {
						            //添加跳转到指定页
						        	showSpecificPageCom("gridDatatable");
					            },
						        select: {
						            style: 'single', /* os,single,multi, multi+shift,api*/
						        },
						        //隐藏某一行
						        "columnDefs": [
			                       {
			                         "targets": [ 0 ,4,5,6,7],
			                         "visible": false,
			                       }, {
				                        "targets": [1,2,3],
				                     	"render" : function(data, type, full) {
				                			if (data == null||data=='undefined') {
				                				return "";
				                			}
				                			return "<a title='"+data+"' style='color:#000;'>"+data+"</a>";// 也可以不用a标签，用<span>
				                		}
				                   }
						        ]
						    } );
					} else {
						ip.ipInfoJump("加载Grid失败！原因：" + datas.result,
								"error");
					}
				}
			});
		};
		
		//行监听事件  左侧双列表出数据
		$("body").on('click', '#gridDatatable tr', function () {
	       var dataSrc = $('#gridDatatable').DataTable().row($(this)).data();
		   subsysRowCheck(dataSrc);
	  	});
		
		//初始化右侧双列表数据
		subsysRowCheck = function(dataSrc) {
			viewModel.getQSGrid(dataSrc);
			viewModel.getHKGrid(dataSrc);
		};
		
		//绘制dataTables方法
		drawDataTables = function(table_id,datas,showSearch){
			$('#'+table_id).DataTable( {
			 		destroy: true,
			    	searching: showSearch,
			    	paging: false,
			    	bSort: false,
			    	bInfo: false,
			    	autoWidth:false,
			    	bLengthChange: true,
			    	//scrollY: "270px",
		 		    iDisplayLength: 10,
		 		    lengthMenu: [
		 		                   [ 5,10, 25,50, 100, 200,2000],
		 		                   [ '5','10', '25','50', '100', '200','2000']
		 		                 ],
	                dom: //f:filtering input
		                 '<\'row\'<\'col-xs-3\'><\'col-xs-3\'><\'col-xs-6 search-input\'f>>' +
		                 't' +   //t:表格   
		                 //一行内: i:Table information summary,p:pagination control,l:length changing input control
		                 '<\'row\'<\'col-xs-1\'i><\'col-xs-7\'p><\'col-xs-4 pub-page\'l>>' +
		                 '<\'row\'<\'#mytool.col-xs-6\'>r>',
		                 language: {
		                   'lengthMenu': '每页_MENU_条 ',
		                 'infoEmpty': '',
		                 'infoFiltered': '(从 _MAX_ 条数据中检索)',
		                   'zeroRecords': '没有检索到数据',
		                   'search': '查询',
		                   'paginate': {
		                     'first': '首页',
		                     'previous': ' < ',
		                     'next': ' >',
		                     'last': '尾页'
		                   }
			            },
		        data:datas,
		        "rowCallback": function( row, data ) {
		            if (data.status == 1 ) {
		                $(row).addClass('selected');
		            }
		        },
		        columns: [
		            {   // Checkbox select column
				        data: null,
				        defaultContent: '',
				        className: 'select-checkbox',
				        orderable: false,
				        "width":"20px"
				    },
		            { data: 'account_name',"width":"110px"},
		            { data: 'account_no',"width":"110px" },
		            { data: 'deposit_bank_name' ,"width":"110px"},
		            { data: 'chr_id' },
		            { data: 'account_type_name' }
		        ],
		        "fnDrawCallback": function() {
		            //添加跳转到指定页
		        	showSpecificPageCom(table_id);
	            },
		        select: {
		            style: 'multi', /* os,single,multi, multi+shift,api*/
		        },
		        //隐藏某一行
		        "columnDefs": [
                   {
                     "targets": [4,5],
                     "visible": false,
                   }, {
                       "targets": [1,2,3],
                    	"render" : function(data, type, full) {
               			if (data == null||data=='undefined') {
               				return "";
               			}
               			return "<a title='"+data+"' style='color:#000;'>"+data+"</a>";// 也可以不用a标签，用<span>
               		}
                   }
		        ]
		    } );
		};
		
		//绘制dataTables方法
		drawDefaultDataTables = function(table_id,datas,showSearch){
			$('#'+table_id).DataTable( {
			 		destroy: true,
			    	searching: false,
			    	paging: false,
			    	bSort: false,
			    	bInfo: false,
			    	autoWidth:false,
			    	lengthChange: true,
			    	select: {
			           style: 'os', 
			           items: 'row'
			         },
			    	language: {
			    		"sSearch": "搜索:",
			    		'zeroRecords': '没有检索到数据'
			    	},
			        //隐藏某一行
			        "columnDefs": [
	                   {
	                     "targets": [4,5],
	                     "visible": false,
	                   }
			        ]
		    } );
		};
		
		viewModel.getQSGrid = function(fRow) {
			var balance_account_id = fRow.chr_id;
			var relation_account_type = "001";
			$.ajax({
				url : "/df/f_ebank/accountRelation/getAccountRelationData.do?tokenid="
						+ viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "nocache",
					"relation_account_type" : relation_account_type,
					"balance_account_id" : balance_account_id
				},
				success : function(datas) {
					if (datas.errorCode == "0") {
						drawDataTables("qsDatatable",datas.dataDetail,false);
					} else {
						ip.ipInfoJump("加载Grid失败！原因：" + datas.result,
								"error");
					}
				}
			});
		};

		viewModel.getHKGrid = function(fRow) {
			var balance_account_id = fRow.chr_id;
			var relation_account_type = "003";
			$.ajax({
				url : "/df/f_ebank/accountRelation/getAccountRelationData.do?tokenid="
						+ viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "nocache",
					"relation_account_type" : relation_account_type,
					"balance_account_id" : balance_account_id
				},
				success : function(datas) {
					if (datas.errorCode == "0") {
						drawDataTables("hkDatatable",datas.dataDetail,false);
					} else {
						ip.ipInfoJump("加载Grid失败！原因：" + datas.result,"error");
					}
				}
			});
		};
		//绑定界面初始化
		fBandRec = function() {
			var rows = $('#gridDatatable').DataTable().rows('.selected');
		    if (rows.indexes().length ==0){
		    	ip.warnJumpMsg("请选择数据！！！",0,0,true);
		        return;
		    };
			document.getElementById("balance_account_id").value = rows.data()[0].chr_id;
			document.getElementById("balance_account_no").value = rows.data()[0].account_no;
			viewModel.getQSGridM(rows.data()[0].chr_id);
			viewModel.getHKGridM(rows.data()[0].chr_id);
			//点击打开界面初始化数据
			qsSelect = {};
			hkSelect = {};
			$('#wizardModal').modal('show');
		};
		//绑定界面绘制清算户界面
		viewModel.getQSGridM = function(balance_account_id) {
			var account_type = "001";
			$.ajax({
				url : "/df/f_ebank/accountRelation/getAccountData.do?tokenid="
						+ viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "nocache",
					"account_type" : account_type,
					"balance_account_id" : balance_account_id
				},
				success : function(datas) {
					if (datas.errorCode == "0") {
						drawDataTables("qsDatatableM",datas.dataDetail,true);
					} else {
						ip.ipInfoJump("加载Grid失败！原因：" + datas.result,
								"error");
					}
				}
			});
		};
		//绑定界面绘制划款户界面
		viewModel.getHKGridM = function(balance_account_id) {
			var account_type = "003";
			$.ajax({
				url : "/df/f_ebank/accountRelation/getAccountData.do?tokenid="
						+ viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "nocache",
					"account_type" : account_type,
					"balance_account_id" : balance_account_id
				},
				success : function(datas) {
					if (datas.errorCode == "0") {
						drawDataTables("hkDatatableM",datas.dataDetail,true);
					} else {
						ip.ipInfoJump("加载Grid失败！原因：" + datas.result,
								"error");
					}
				}
			});
		};
		
		//绑定保存
		fModalOk = function() {
			subSaveRow();
			$('#wizardModal').modal('hide');
		};
		//构建传入后台的数据
		QSAndHKInfoDataTables = function(id){
			var selectRows = $('#qsDatatableM').DataTable().rows('.selected');
			for (var i = 0; i < selectRows.indexes().length; i++) {
				qsSelect[selectRows.data()[i].chr_id] = selectRows.data()[i].chr_id;
			}
			
			selectRows = $('#hkDatatableM').DataTable().rows('.selected');
			for (var i = 0; i < selectRows.indexes().length; i++) {
				hkSelect[selectRows.data()[i].chr_id] = selectRows.data()[i].chr_id;
			}
		};
		//保存清算账户和划款账户
		subSaveRow = function() {
			QSAndHKInfoDataTables();
			var qsSelectStr = JSON.stringify(qsSelect);
			var hkSelectStr = JSON.stringify(hkSelect);
			var balance_account_id = document.getElementById("balance_account_id").value;
			var balance_account_no = document.getElementById("balance_account_no").value;
			$.ajax({
				url : "/df/f_ebank/accountRelation/updateRecSql.do?tokenid="
						+ viewModel.tokenid,
				data : {
					"ajax" : "nocache",
					"balance_account_id" : balance_account_id,
					"balance_account_no" : balance_account_no,
					"qsSelectStr" : qsSelectStr,
					"hkSelectStr" : hkSelectStr
				},
				type : "POST",
				dataType : "json",
				async: true,
				success : function(datas) {
					if (datas.errorCode == "0") {
						ip.ipInfoJump(datas.result, "success");
						//界面重新画 加载数据
						var dataSrc = $('#gridDatatable').DataTable().rows('.selected').data()[0];
						subsysRowCheck(dataSrc);
					} else {
						ip.ipInfoJump("保存失败！原因：" + datas.result, "error");
					}

				}
			});
		};
		
		drawDeaultView = function(){
			drawDefaultDataTables("qsDatatable");
			drawDefaultDataTables("hkDatatable");
		};
		
		fModalCancel = function() {
			$('#wizardModal').modal('hide');
		};
		
 		pageInit =function(){
 			drawDeaultView();
 			viewModel.subsysGrid();//初始化数据
 		};

 		$(element).html(html);	
 		pageInit();
 		
 	};		
	return {
		init:init
	};
});

