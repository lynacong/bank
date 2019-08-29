require(['jquery', 'knockout', 'bootstrap', 'uui','tree','grid','director','ip'], function ($, ko) {
	window.ko = ko;
	var projectViewModel = {
			data : ko.observable({})
	};
	current_url = location.search;
	tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,
			current_url.indexOf("tokenid") + 48);
	$(function () {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el: 'body',
			model: projectViewModel
		});
		
	});
	//区划显示
	$(function () {
		$.ajax({
			url : "/df/changergyear/getRgcode.do?tokenid="
					+ tokenid,
			type : 'POST',
			dataType : "json",
			data: {
				"ajax":"1"
				
			},
			success : function(data) {
				$("#rgcode").val(data.rgcode);
				$("#setyear").val(data.setyear);
				
			}
		});
				
			});
	
});
//保存数据
var changeRgYear = function(){
	$.ajax({
		url : "/df/changergyear/changergyear.do?tokenid="
				+ tokenid,
		type : 'POST',
		dataType : "json",
		data: {
			"ajax":"1"
			
		},
		success : function(data) {
			if(data.flag=="1"){
				ip.ipInfoJump("同步成功！");
			}else if(data.flag=="0"){
				ip.ipInfoJump("同步失败，请稍后再试！");
			}
		}
	});
};



