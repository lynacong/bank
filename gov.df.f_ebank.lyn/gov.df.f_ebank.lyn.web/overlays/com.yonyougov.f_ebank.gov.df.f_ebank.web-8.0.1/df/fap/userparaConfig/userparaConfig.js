require(['jquery', 'knockout', 'bootstrap', 'uui','tree','grid','director','ip'],function ($, ko) {
	window.ko = ko;
	var roleid = null;
	var menuViewModel = {
			data: ko.observable({}),
			gridDataTable: new u.DataTable({
				meta: {
					'chr_id':{},
					'chr_code':{},
					'sys_name':{},
					'chr_value':{},
					'chr_name':{},
					'chr_desc':{}
				}
			}),
	}
	menuViewModel.getInitData = function(){
		var obj = $(".checkbox-inline input");
		var tokenid = ip.getTokenId();
		$.ajax({
			url: "/df/userparaConfig/initpara.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			async: false,
			data: {"ajax":"noCache"},
			success: function (data) {
				var lilist  =data.lilist;
				var inhtml = "";
				for(var j = 0 ; j <lilist.length ; j++){
					inhtml  = inhtml + "<li role='presentation'><a href='#homes' aria-controls='profile' role='tab' data-toggle='tab' " +
							"id='"+lilist[j].sys_id+"'>"+lilist[j].sys_name+"</a></li>" 
				}
				$("#myTabs").append(inhtml);
			}
		});
		var li = $("#myTabs li").eq(0);
        li.attr("class","active");
		$("#myTabs li").on("click","a",function(){
			var sys_id = $(this).attr("id");
			var obj = $(".checkbox-inline input");
			var checkItems = "";
			for(var i = 0 ;  i< obj.length ; i++){
				if(obj[i].checked){
					checkItems = obj[i].value + "@"+checkItems;
				} 
			}
			$.ajax({
				url: "/df/userparaConfig/dataQuery.do?tokenid=" + tokenid,
				type: 'GET',
				dataType: 'json',
				data: {"sys_id":sys_id,"checkItems":checkItems,"ajax":"noCache"},
				success: function (data) {
					menuViewModel.gridDataTable.removeAllRows();
					menuViewModel.gridDataTable.setSimpleData(data.dataDetail);
					menuViewModel.gridDataTable.setRowUnSelect(0);
				}
			});	

		})
		getdata();
	}
	getdata = function(){
		var sys_id = $("#myTabs .active a").attr("id");
		var tokenid = ip.getTokenId();
		var obj = $(".checkbox-inline input");
		var checkItems = "";
		for(var i = 0 ;  i< obj.length ; i++){
			if(obj[i].checked){
				checkItems = obj[i].value + "@"+checkItems;
			} 
		}
		$.ajax({
			url: "/df/userparaConfig/dataQuery.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"sys_id":sys_id,"checkItems":checkItems,"ajax":"noCache"},
			success: function (data) {
				menuViewModel.gridDataTable.removeAllRows();
				menuViewModel.gridDataTable.setSimpleData(data.dataDetail);
				menuViewModel.gridDataTable.setRowUnSelect(0);
			}
		});	
	}
	menuViewModel.ensure =  function(){
		var tokenid = ip.getTokenId();
		var chr_id = $("#chr_id").val();
		var chr_code = $("#chr_code").val();
		var chr_name = $("#chr_name").val();
		var chr_value =$("#chr_value").val();
		$.ajax({
			url: "/df/userparaConfig/updatePara.do?tokenid=" + tokenid,
			type: 'post',
			dataType: 'json',
			data: {"chr_id":chr_id,"chr_code":chr_code,"chr_name":chr_name,"chr_value":chr_value,"ajax":"noCache"},
			success: function (data) {
				getdata();
				$("#editcodeModal").modal('hide');
			}
		});	
	}
	menuViewModel.edit = function(){
		var row = menuViewModel.gridDataTable.getFocusRow();
		if(row == null){
			ip.ipInfoJump("请选择要修改的数据","info");
			return;
		}
		ip.warnJumpMsg("当前系统已上线，修改此参数可能导致错误，是否继续？","sid","cCla");
		//处理确定逻辑方法
		$("#sid").on("click",function(){
			//处理确定逻辑方法
			$("#config-modal").remove();
			var chr_id = row.data.chr_id.value;
			var chr_code = row.data.chr_code.value;
			var chr_name = row.data.chr_name.value;
			var chr_value = row.data.chr_value.value;
			var chr_desc = row.data.chr_desc.value;
			$("#chr_id").val(chr_id);
			$("#chr_code").val(chr_code);
			$("#chr_name").val(chr_name);
			$("#chr_value").val(chr_value);
			$("#chr_desc").val(chr_desc);
			$("#editcodeModal").modal({backdrop: 'static', keyboard: false});

		});

		$(".cCla").on("click",function(){
			//处理取消逻辑方法
			$("#config-modal").remove();
		})

	}
	$(function () {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el: 'body',
			model: menuViewModel
		});
		menuViewModel.getInitData();
	});
});
