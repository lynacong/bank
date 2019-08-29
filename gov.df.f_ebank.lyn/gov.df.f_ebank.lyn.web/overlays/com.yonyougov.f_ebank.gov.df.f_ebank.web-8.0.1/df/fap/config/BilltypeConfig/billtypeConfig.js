require(
		[ 'jquery', 'knockout', 'bootstrap', 'uui', 'tree', 'director',
				'md5', 'ip'],
		function($, ko) {
			window.ko = ko;
			var billTypeConfigViewModel = {
					
			}
			// 初始化界面信息 
			billTypeConfigViewModel.getInitPage = function(){
				var tokenid = ip.getTokenId();
				 $.ajax({
						url : "/df/globalConfig/loadBilltypeConfig.do?tokenid=" + tokenid,
						type : 'GET',
						dataType : 'json',
						data:{"ajax":"nocach","tokenid":tokenid,"belong_page":"billtypeConfig"},
						success : function(data) {
							if(data.flag=="1"){
								billTypeConfigViewModel.initCombox(data.billtype);
								billTypeConfigViewModel.initData(data);
							}
							
						}
				 });
				
			}
			// 初始化下拉框 
			billTypeConfigViewModel.initCombox =function(obj){
				jsonStr = '<option selected="selected" value=""> </option>';
				$.each(obj, function(i, value) {
						jsonStr += '<option value="' + this.billtype_code + '" >'
								+ this.billtype_code + " " + this.billtype_name + '</option>';
					});
				
				$("#commonbilltypeaccreditRefundBill").empty(); 
				$("#commonbilltypeaccreditRefundBill").append(jsonStr);
				$("#commonbilltypedirectRefundBill").empty(); 
				$("#commonbilltypedirectRefundBill").append(jsonStr);
				$("#commonbilltypecarePayBill").empty(); 
				$("#commonbilltypecarePayBill").append(jsonStr);
			}
			
			billTypeConfigViewModel.initData =function(data){
				for(var i=0;i<data.rows.length;i++){
					var plt_key = data.rows[i].plt_key;
					if($("#"+plt_key).length >0){
						var domObject = $("#"+plt_key)[0]; 
						if(domObject.tagName.toLowerCase( )=="select"){
							$("#"+plt_key).find("option[value='"+data.rows[i].value+"']").attr("selected",true);
						}
						else{								
							$("#"+plt_key).val(data.rows[i].value)							
						}
					}
					if(plt_key=="commonmenuShowBudgetReport"){
						$("#container input[type=radio][name=commonmenuShowBudgetReport][value='"+data.rows[i].value+"']").attr("checked",'checked')
					}
				}
			}
			
			// 保存数据 
			billTypeConfigViewModel.saveData =function(){
				var tokenid = ip.getTokenId();
				 var result = {};
				 $("#container select").each(function(){
			            var name = $(this).attr("id");
			            // var value = $(this).val();
			            var value = $(this).find("option:selected").text();
			            result[name] =  value;   
			        });
				 // 选中redio 取值 
				 var redioValue = $('#container input[type=radio][name="commonmenuShowBudgetReport"]:checked').val();
				 result["commonmenuShowBudgetReport"] =  redioValue; 
				 // text 取值
				 result["commonpayExecutingReport"] =  $("#commonpayExecutingReport").val(); 
				 
				 var viewData ={};
				 viewData = {
					ajax:"noCache",
					configdata:JSON.stringify(result)
				 }
				 $.ajax({
						url : "/df/globalConfig/saveConfig.do?tokenid=" + tokenid,
						type : 'POST',
						dataType : 'json',
						data:viewData,
						success : function(data) {
							if(data.flag == "1"){
								ip.ipInfoJump("保存成功！！！");
							}else{
								ip.ipInfoJump(data.msg);
							}
						}
					});
			}
			
			 
			 $(function () {
					ko.cleanNode($('.container')[0]);
					app = u.createApp({
						el: '.container',
						model: billTypeConfigViewModel
					});
					billTypeConfigViewModel.getInitPage();
			    });
			});