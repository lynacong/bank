define(['text!pages/financeAcctManage/financeAcctManage.html','commonUtil',
        'jquery','bootstrap','ip','uui','tree',
        'datatables.net-bs','datatables.net-autofill-bs', 
        'datatables.net-buttons-bs', 'datatables.net-colreorder',
        'datatables.net-rowreorder', 'datatables.net-select',
        'datatables.net-scroller','datatables.net-keyTable', 
        'datatables.net-responsive','initDataTableUtil' ],function(html,commonUtil){
		var init =function(element,param){ 
			document.title=ip.getUrlParameter("menuname");
            var status="";
            var chr_id="";
			var options = ip.getCommonOptions({});
			var gStatus = 0;// 0查询，1新增，2更新
			var gtab = "002";
			var accountTypeDetail = null;
			var bankType=0;//0办理行 1:开户行
			//定义表格隐藏列设置
			var visibleCol1 = [{  
               "targets": [ 0,1,5,7,9,10 ],
               "visible": false
            }];
			var visibleCol2=[{  
               "targets": [ 0,1,9,10 ],
               "visible": false
            }];
			var visibleCol3=[{  
               "targets": [ 0,1,7,9,10 ],
               "visible": false
            }];
			var visibleCol4=[{  
               "targets": [ 0,1,4,7,9,10 ],
               "visible": false
            }];
			var viewModel = {
				tokenid : ip.getTokenId(),
				dataTable : new u.DataTable({
							meta : {
								'chr_id' : {
									'value' : ""
								},
								'chr_code' : {
									'value' : ""
								},
								'parent_id' : {
									'value' : ""
								},
								'show_name' : {
									'value' : ""
								},
								'chr_name' : {
									'value' : ""
								}
							}
						}),
				treeSetting : {
					callback : {
						onClick : zTreeOnClick,
						beforeClick : zTreeBeforeClick

					}
				},
				processBankData:[],
				openBankData:[]
			};
			
			function zTreeBeforeClick(event, bankTree, treeNode, clickFlag) {}
			function zTreeOnClick(event, bankTree, treeNode, clickFlag) {}

			tabclick001 = function() {
				if (gStatus == 2) {
					ip.warnJumpMsg("请完成编辑后切换！",0,0,true);
					return;
				}

				gtab = "001";
				viewModel.getGrid();
				viewModel.getAccountType();// 每次切换页签加载一次。

			};
			tabclick002 = function() {

				if (gStatus == 2) {
					ip.warnJumpMsg("请完成编辑后切换！",0,0,true);
					return;
				}
				gtab = "002";
				viewModel.getGrid();
				viewModel.getAccountType();// 每次切换页签加载一次。

			};
			tabclick003 = function() {
				if (gStatus == 2) {
					ip.warnJumpMsg("请完成编辑后切换！",0,0,true);
					return;
				}
				gtab = "003";
				viewModel.getGrid();
				viewModel.getAccountType();// 每次切换页签加载一次。

			};
			tabclick004 = function() {
				if (gStatus == 2) {
					ip.warnJumpMsg("请完成编辑后切换！",0,0,true);
					return;
				}

				gtab = "006";
				viewModel.getGrid();
				viewModel.getAccountType();// 每次切换页签加载一次。
			};
			tabclick005 = function() {
				if (gStatus == 2) {
					ip.warnJumpMsg("请完成编辑后切换！",0,0,true);
					return;
				}

				gtab = "005";
				viewModel.getGrid();
				viewModel.getAccountType();// 每次切换页签加载一次。
			};
			

			fRefRec = function() {
				viewModel.getGrid();
				viewModel.getAccountType();
				ip.ipInfoJump("已刷新！！", "success");

			};
			fAddRec = function() {
				status="new";
				$("#titleText").text("新增账户信息");
				$("#account_no").val("");
				$("#account_name").val("");
				$("#bank_code").val("");
				$("#bank_name").val("");
				$("#deposit_bank_code").val("");
				$("#deposit_bank_name").val("");
				$("#account_relation_ele").val("");
				if(gtab=="001"){
					document.getElementById("relation").style.display = "";
				    document.getElementById("deposit_bank").style.display = "";
				    document.getElementById("pb_bank").style.display = "";
				}else if(gtab=="003"){
					document.getElementById("relation").style.display = "";
				    document.getElementById("deposit_bank").style.display = "";
				    document.getElementById("pb_bank").style.display = "none";
				}else if(gtab=="006"){
					 document.getElementById("deposit_bank").style.display = "";
					 document.getElementById("pb_bank").style.display = "";
				}else{
					document.getElementById("relation").style.display = "none";
					document.getElementById("deposit_bank").style.display = "none";
					document.getElementById("pb_bank").style.display = "";
				}
				$('#accSetModel').modal('show');
			};

			fEditRec = function() {
				status="upd";
				$("#titleText").text("修改账户信息");
				var rows = $('#subSystemGrid').DataTable().rows('.selected');
				if(rows.indexes().length!=1){
					ip.warnJumpMsg("请选择一条数据！",0,0,true);
					return;
				}else{
					chr_id= rows.data()[0].chr_id;
					$("#account_no").val(rows.data()[0].account_no);
					$("#account_name").val(rows.data()[0].account_name);
					$("#bank_code").val(rows.data()[0].bank_code);
					$("#bank_name").val(rows.data()[0].bank_name);
					$("#deposit_bank_code").val(rows.data()[0].deposit_bank_code);
					$("#deposit_bank_name").val(rows.data()[0].deposit_bank_name);
					$("#account_type_name").val(rows.data()[0].account_type);
					$("#finance_code").val(rows.data()[0].finance_code);
					$("#account_relation_ele").val(rows.data()[0].account_relation_ele);
					if(gtab=="001"){
						document.getElementById("pb_bank").style.display = "";
						document.getElementById("relation").style.display = "";
					    document.getElementById("deposit_bank").style.display = "";
					}else if(gtab=="003"){
						document.getElementById("relation").style.display = "";
					    document.getElementById("deposit_bank").style.display = "";
					    document.getElementById("pb_bank").style.display = "none";
					}else if(gtab=="006"){
						document.getElementById("pb_bank").style.display = "";
						 document.getElementById("deposit_bank").style.display = "";
					}else{
						document.getElementById("pb_bank").style.display = "";
						document.getElementById("relation").style.display = "none";
						document.getElementById("deposit_bank").style.display = "none";
					}
					$('#accSetModel').modal('show');
				}
			};
			fSaveRec = function() {
				viewModel.subSaveRow();
			};
			fReRec = function() {
				viewModel.getGrid();
				viewModel.getAccountType();
			};
			
			fDelRec = function() {
				var rows = $('#subSystemGrid').DataTable().rows('.selected');
				if(rows.indexes().length<1){
					ip.warnJumpMsg("请先选择数据！",0,0,true);
					return;
				}
				ip.warnJumpMsg("确定删除记录吗？", "sid", "cCla");
				$("#sid").on("click", function() {
					$("#config-modal").remove();
					var chr_ids = [];
					var rows_index = [];
					for (var i = 0; i < rows.indexes().length; i++) {
							chr_ids.push(rows.data()[i].chr_id);
					}
					if (chr_ids.length > 0) {
						$.ajax({
							url : "/df/f_ebank/financeAcctManage/delRecSql.do?tokenid="
									+ viewModel.tokenid,
							data : {
								"ajax" : "nocache",
								"chr_ids" : chr_ids.toString(),
							},
							type : "POST",
							dataType : "json",
							success : function(datas) {
								if (datas.errorCode == "0") {
									ip.ipInfoJump(datas.result, "success");
									viewModel.getGrid();
									viewModel.getAccountType();
								} else {
									ip.warnJumpMsg("删除失败，原因："+ datas.result,0,0,true);
								}
							}
						});
					}
				});
				$(".cCla").on("click", function() {
							$("#config-modal").remove();
						});
			};

			fModalOk = function() {
				var curent_modalRow = viewModel.dataTable.getFocusRow();
				if(bankType=='0'){
					$('#bank_code').val(curent_modalRow.data["chr_code"].value);
					$('#bank_name').val(curent_modalRow.data["chr_name"].value);
				}else{
					$('#deposit_bank_code').val(curent_modalRow.data["chr_code"].value);
					$('#deposit_bank_name').val(curent_modalRow.data["chr_name"].value);
				}
				$('#wizardModal').modal('hide');
			};
			fModalCancel = function() {
				$('#wizardModal').modal('hide');
			};
			
			getBank = function(type) {
				bankType=type;
				var bankTreeObj = $.fn.zTree.getZTreeObj("bankTree");
				var nodes = bankTreeObj.getNodes();
				//办理行
				if(type == "0"){
					viewModel.dataTable.setSimpleData(viewModel.processBankData);
				}else if(type == "1"){//开户行
					viewModel.dataTable.setSimpleData(viewModel.openBankData);
				}
				$('#wizardModal').modal('show');
			};

			fGetGrid = function() {
				viewModel.initGrid();
			};
			fGridOndblclick = function() {
				viewModel.fEditRec();
			};
			viewModel.subSaveRow = function() {
				var account_no=$("#account_no").val();
				var account_name=$("#account_name").val();
				var bank_code=$("#bank_code").val();
				var bank_name=$("#bank_name").val();				
				var deposit_bank_code=$("#deposit_bank_code").val();
				var deposit_bank_name=$("#deposit_bank_name").val();				
				var account_type=$("#account_type_name").val();
				var account_type_name=$("#account_type_name option:selected").text();
				var finance_code=$("#finance_code").val();
				var account_relation_ele=$("#account_relation_ele").val();
				var upd_rows = [];
				var new_rows = [];

					if (account_no==""||account_no==null) {
						ip.warnJumpMsg("所填信息'账号'不能为空！", 0, 0, true);
						return;
					} else if (account_name==""||account_name==null) {
						ip.warnJumpMsg("所填信息'账户名称'不能为空！", 0, 0, true);
						return;
					} else if (account_type==""||account_type==null) {
						ip.warnJumpMsg("所填信息'账户类型'不能为空！", 0, 0, true);
						return;
					}
					if(gtab=='001'||gtab=='003'||gtab=='006'){
						if (deposit_bank_code==""||deposit_bank_code==null) {
							ip.warnJumpMsg("所填信息'开户行'不能为空！", 0, 0, true);
							return;
						}
					}
					if(gtab!='003'){
						if (bank_code==""||bank_code==null) {
							ip.warnJumpMsg("所填信息'办理行'不能为空！", 0, 0, true);
							return;
						}
					}
					if(gtab == "005"){
						if (finance_code==""||finance_code==null) {
							ip.warnJumpMsg("所填信息'财政机构'不能为空！", 0, 0, true);
							return;
						}
						if ( finance_code.length>6) {
							ip.warnJumpMsg("所填信息'财政机构'不能超过6位！", 0, 0, true);
							return;
						}
					}
					if (status=="upd") {
						upd_rows=[{"chr_id":chr_id,
							    "account_no":account_no,
 	 							"account_name":account_name,
 	 							"account_type":account_type,
 	 							"account_type_name":account_type_name,
 	 							"finance_code":finance_code,
 	 							"account_relation_ele":account_relation_ele,
 	 							"bank_code":bank_code,
 	 							"bank_name":bank_name,
 	 							"deposit_bank_code":deposit_bank_code,
 	 							"deposit_bank_name":deposit_bank_name}];
					}
					if (status=="new") {
						new_rows=[{"chr_id":"",
							    "account_no":account_no,
	 							"account_name":account_name,
	 							"account_type":account_type,
	 							"account_type_name":account_type_name,
	 							"finance_code":finance_code,
	 							"account_relation_ele":account_relation_ele,
	 							"bank_code":bank_code,
 	 							"bank_name":bank_name,
 	 							"deposit_bank_code":deposit_bank_code,
 	 							"deposit_bank_name":deposit_bank_name}];
						
					}
					upd_rows = JSON.stringify(upd_rows);
					new_rows = JSON.stringify(new_rows);


				$.ajax({
					url : "/df/f_ebank/financeAcctManage/updateRecSql.do?tokenid="
							+ viewModel.tokenid,
					data : {
						"ajax" : "nocache",
						"upd_rows" : upd_rows,
						"new_rows" : new_rows
					},
					type : "POST",
					dataType : "json",
					success : function(datas) {
						if (datas.errorCode == "0") {
							fRefRec();
							ip.ipInfoJump(datas.result, "success");
							$('#accSetModel').modal('hide');
						} else {
							ip.warnJumpMsg("保存失败，原因：" + datas.result,0,0,true);
						}

					}
				});

			};

			viewModel.getGrid = function() {
				var account_type = gtab;
				$.ajax({
					url : "/df/f_ebank/financeAcctManage/getGridData.do?tokenid="
							+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"account_type" : account_type
					},
					success : function(datas) {
						if (datas.errorCode == "0") {
							var visibleCol;
							if(gtab=="001"){
								visibleCol=visibleCol2;
							}else if(gtab=="003"){
								visibleCol=visibleCol4;
							}else if(gtab=="006"){
								visibleCol=visibleCol3;
							} else{
								visibleCol=visibleCol1;
							}
							 $('#subSystemGrid').DataTable( {
									destroy: true,
					 			    searching: true,
					 		        paging: true,
					 		        bSort: false,
					 		        bInfo: true,
					 		        bLengthChange: true,
					 		        iDisplayLength: 10,
					 		        scrollY:$("#tableAcc").innerHeight()-135 + "px",
					 		       select: {
							            style: 'single',
							        },
					 		        lengthMenu: [
					 		                   [ 10, 25,50, 100, 200,2000],
					 		                   [ '10', '25','50', '100', '200','2000']
					 		                 ],
			 		                  dom: //f:filtering input
			 		                 '<\'row\'<\'col-xs-4\'><\'col-xs-5\'><\'col-xs-3 search-input\'f>>' +
			 		                 't' +   //t:表格   
			 		                 //一行内: i:Table information summary,p:pagination control,l:length changing input control
			 		                 '<\'row\'<\'col-xs-4\'i><\'col-xs-6\'p><\'col-xs-2 pub-page\'l>>' +
			 		                 '<\'row\'<\'#mytool.col-xs-6\'>r>',
			 		                 language: {
			 		                   'lengthMenu': '每页_MENU_条 ',
			 		                  'info': '从 _START_ 到 _END_ /共 _TOTAL_ 条数据',
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
			 		                  select: {
			 		                     rows: {
			 		                       _: '%d行被选中',
			 		                       0: ''
			 		                     }
			 		                   }
			 		                   },
							        columnDefs:visibleCol,
							        data:datas.dataDetail,
							        columns: [
                                        { data: 'chr_id'},
                                        { data: 'account_type'},
							            { data: 'account_name'},
							            { data: 'account_no' },
							            { data: 'bank_name'},
							            { data: 'deposit_bank_name'},
							            { data: 'account_type_name'},
							            { data: 'account_relation_ele' },
							            { data: 'finance_code' },
							            { data: 'deposit_bank_code' },
							            { data: 'bank_code'}
							       ],
							        "fnDrawCallback": function() {
							            //添加跳转到指定页
							        	showSpecificPageCom("subSystemGrid");
						            }
							    } );
						} else {
							ip.warnJumpMsg("加载Grid失败！原因："+ datas.result,0,0,true);
						}
					}
				});
			};

			viewModel.getAccountType = function() {
				var account_type = gtab;
				$.ajax({
					url : "/df/f_ebank/financeAcctManage/getAccountType.do?tokenid="
							+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"account_type" : account_type
					},
					success : function(data) {
						if (data.errorCode == "0") {
							var html = "";
							for ( var i = 0; i < data.dataDetail.length; i++) {
								html+="<option value="+data.dataDetail[i].chr_code+">"+data.dataDetail[i].chr_name+"</option>";
							}
							$("#account_type_name").html(html);
						} else {
							ip.warnJumpMsg("加载AccountType失败！原因：" + datas.result,0,0,true);
						}
					}
				});
			};
			viewModel.getBankTree = function() {
				var account_type = gtab;
				$.ajax({
					url : "/df/f_ebank/financeAcctManage/getBankTree.do?tokenid="
							+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"account_type" : account_type
					},
					success : function(datas) {
						if (datas.errorCode == "0") {
							for(var i=0,bankData=datas.dataDetail;i<bankData.length;i++){
								var singleBankData = bankData[i];
								if(singleBankData.parent_id != null && singleBankData.banktype == "1"){
									viewModel.processBankData.push(singleBankData);
								}else if(singleBankData.parent_id != null && singleBankData.banktype == "2"){
									viewModel.openBankData.push(singleBankData);
								}
							}
						} else {
							ip.warnJumpMsg("加载BankTree失败！原因："+ datas.result,0,0,true);
						}
					}
				});
			};
	
			pageInit =function(){
	 			app = u.createApp({
					el : element,
					model : viewModel
				});
	 			viewModel.getGrid();
				viewModel.getAccountType();// 每次切换页签加载一次。
				viewModel.getBankTree();// 只加载一次
				// 初始化财政机构的下拉框
				var param = ip.getCommonOptions({});
	 			commonUtil.initFinanceCode("",param);
	 		};
	 		$(element).html(html);	
	 		pageInit();
	 		
	 		
	 	};		
	 		return {
	 				'template':html,
	 		 	
	 		        init:init

	 		};
		});