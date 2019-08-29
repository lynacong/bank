require([ 'jquery', 'knockout', 'bootstrap', 'uui', 'tree', 'director','md5', 'ip'],function($, ko) {
	window.ko = ko;
	var tokenid = ip.getTokenId();
	var ViewModel = {
			data : ko.observable({})
	}

	ViewModel.getInitData = function () {
		$.ajax({
			url: "/df/userinfoConfig/userinfo.do?tokenid="+tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"ajax":"noCache"},
			success: function (data) {
				var info = data.userinfo;
				if(info.length > 0){
					var user_name = info[0].user_name;
					var address = info[0].address;
					var telephone = info[0].telephone;
					var user_code = info[0].user_code;
					if(user_name === null){
						user_name = "";
					}
					if(address === null){
						address = "";
					}
					if(telephone === null){
						telephone = "";
					}
					$("#username").val(user_name);
					$("#address").val(address);
					$("#telephone").val(telephone);
					$("#user_code").val(user_code);
				}
			}
		});
	}
	ViewModel.userSave = function(){

		var address =$("#address").val();
		var telephone = $("#telephone").val();
		$.ajax({
			url: "/df/userinfoConfig/upuserinfo.do?tokenid="+tokenid,
			type: 'POST',
			dataType: 'json',
			data: {"address":address,"telephone":telephone,"ajax":"noCache"},
			success: function (data) {
				ip.ipInfoJump("保存成功","success");
			}
		});
	}
	$(function () {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el: 'body',
			model: ViewModel
		});
		ViewModel.getInitData();

	});

});