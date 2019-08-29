require(['jquery', 'knockout','bootstrap', 'uui','tree','grid','director','ip'], function ($, ko) {
	window.ko = ko;
	var tokenid = ip.getTokenId();
    var viewModel = {
    		
    };
	viewModel.initPageInfo = function(){
		$.ajax({
			url: "/df/globalConfig/initBasePageInfo.do?tokenid="+tokenid,
		    type: "GET",
		    data: {
		    	"tokenid":tokenid,
		    	"ajax": "noCache",
		    	"belong_page": "paymain"
		    },
		    success: function(data){
		    	if(data.flag == 1){
		    		for(var i =0; i < data.rows.length; i++){
		    			if(data.rows[i].plt_key == "payrefundallowNorlRefundForPayCard"){
		    				if(data.rows[i].value == 1){
		    					$("input[name='payrefundallowNorlRefundForPayCard']").eq(0).attr("checked", true);
		    				}else{
		    					$("input[name='payrefundallowNorlRefundForPayCard']").eq(1).attr("checked", true);
		    				}
		    			}else if(data.rows[i].plt_key == "doUnitType"){
		    				if(data.rows[i].value == 1){
		    					$("input[name='doUnitType']").eq(0).attr("checked", true);
		    				}else{
		    					$("input[name='doUnitType']").eq(1).attr("checked", true);
		    				}
		    			}else{
		    				$("#"+data.rows[i].plt_key).val(data.rows[i].value);
		    			}
		    		}
		    	}else{
		    		ip.ipInfoJump("服务器繁忙，请稍等");
		    	}
		    }
		});
    	
    }
	//信息的保存
	viewModel.savePageInfo = function(){
		var commonSetting = {};
		var inputs = $("input[type='text']");
		for(var i = 0; i <inputs.length; i++){
			commonSetting[inputs.eq(i).attr("id")]=inputs.eq(i).val();
		}
		var radios = $("input[type='radio']:checked");
		for(var i = 0; i < radios.length; i++){
			commonSetting[radios.eq(i).attr("name")]= radios.eq(i).val();
		}
		$.ajax({
			url: "/df/globalConfig/updateCommonFilter.do?tokenid="+tokenid,
		    type: "POST",
		    data: {
		    	"tokenid":tokenid,
		    	"ajax": "noCache",
		    	"filterInfo": JSON.stringify(commonSetting)
		    },
		    success: function(data){
		    	if(data.flag == 1){
		    		ip.ipInfoJump("保存成功");
		    	}else{
		    		ip.ipInfoJump("服务器繁忙，请稍等");
		    	}
		    }
		});
    }
	
	$(function(){
		app = u.createApp({
            el: 'body',
            model: viewModel
        });
		
		viewModel.initPageInfo();
	})
});
