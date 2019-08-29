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
		    	"belong_page": "planmain"
		    },
		    success: function(data){
		    	if(data.flag == 1){
		    		for(var i =0; i < data.rows.length; i++){
		    			if(data.rows[i].plt_key == "planinputsaveAndCheckBtn"){
		    				if(data.rows[i].value == "1"){
		    					$("input[name='planinputsaveAndCheckBtn']").eq(0).attr("checked", true);
		    				}else{
		    					$("input[name='planinputsaveAndCheckBtn']").eq(1).attr("checked", true);
		    				}
		    			}else if(data.rows[i].plt_key == "planisInpmRefer"){
		    				if(data.rows[i].value == "true"){
		    					$("input[name='planisInpmRefer']").eq(0).attr("checked", true);
		    				}else{
		    					$("input[name='planisInpmRefer']").eq(1).attr("checked", true);
		    				}
		    			}
		    		}
		    	}else{
		    		ip.ipInfoJump("服务器繁忙，请稍等");
		    	}
		    }
		});
    	
    }
	
	viewModel.savePageInfo = function(){
		var commonSetting = {};
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
	//获取过滤条件  根据id
	
	$(function(){
		app = u.createApp({
            el: 'body',
            model: viewModel
        });
		
		viewModel.initPageInfo();
	})
});
