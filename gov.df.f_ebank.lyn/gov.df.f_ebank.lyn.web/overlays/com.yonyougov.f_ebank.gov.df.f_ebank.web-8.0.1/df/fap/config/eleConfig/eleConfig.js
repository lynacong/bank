require(
		[ 'jquery', 'knockout', 'bootstrap', 'uui', 'tree', 'director',
				'md5', 'ip'],
		function($, ko) {
			window.ko = ko;
			var eleConfigViewModel = {
					
			}
			
			eleConfigViewModel.getInitData = function(){
				var tokenid = ip.getTokenId();
				 $.ajax({
						url : "/df/globalConfig/initBasePageInfo.do?tokenid=" + tokenid,
						type : 'GET',
						dataType : 'json',
						data:{"ajax":"nocach","belong_page":"eleConfig","tokenid":tokenid},
						success : function(data) {
							if(data.flag == "1"){
								for(var i=0;i<data.rows.length;i++){
									var plt_key = data.rows[i].plt_key;
									if($("#"+plt_key).length >0){
										$("#"+plt_key).val(data.rows[i].show_value)
									}
								}
							}
						}
				 });
				
			}
			
			eleConfigViewModel.saveData =function(){
				var tokenid = ip.getTokenId();
				 var result = {};
				 $("#container input[type='text']").each(function(){
			            var name = $(this).attr("id");
			            var value = $(this).val();			            
			            result[name] =  value;   
			        });
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
						model: eleConfigViewModel
					});
					eleConfigViewModel.getInitData();
			    });
			});