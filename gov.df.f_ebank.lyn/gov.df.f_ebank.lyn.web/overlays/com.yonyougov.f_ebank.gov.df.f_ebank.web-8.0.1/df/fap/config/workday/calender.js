require(['jquery', 'knockout','calendar','bootstrap', 'uui','tree','grid','director','dateZH','ip'], function ($, ko,calendar) {
	window.ko = ko;
	var tokenid = ip.getTokenId();
	var myCalendar = null;
	var viewModel = {

	};
	changeValue = function(data){
         var info = data.value;
         $("#tips-info").remove();
         $.ajax({
 			url: "/df/Workday/updateDatetype2.do?tokenid=" + tokenid,
 			type: 'post',
 			async: false,
 			dataType: 'json',
 			data: {"info":info,"ajax":"noCache"},
 			success: function (data) {
 				myCalendar.update($(".sc-select-month").val(),$(".sc-select-year").val());
 			} 
 		});
	}
	viewModel.getRestDays = function() {
		var sc_items = $(".sc-days").find(".current-date");
		var datas = [sc_items[0],sc_items[18],sc_items[41]];
		var data = "";
		for (var i = 0; i < 3; i++ ) {
			var attr = datas[i].attributes
			data = attr[7].value+"@"+attr[6].value+"#"+data
		}
		return data;
	}
	$(function () {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el: 'body',
			model: viewModel
		});
		var calenderOpt = {
				language: 'CH', //语言
				showLunarCalendar: true, //阴历
				showHoliday: true, //休假
				showFestival: true, //节日
				showLunarFestival: true, //农历节日
				showSolarTerm: true, //节气
				showMark: true, //标记
				mark: {
				},
				theme: {
					changeAble: false,
					weeks: {
						backgroundColor: '#FBEC9C',
						fontColor: '#4A4A4A',
						fontSize: '20px',
					},
					days: {
						backgroundColor: '#ffffff',
						fontColor: 'blue',
						fontSize: '24px'
					},
					todaycolor: 'orange',
					activeSelectColor: 'orange',
				}
		}
		myCalendar = new SimpleCalendar('#calender-container',calenderOpt);
		$(".sc-days").find(".sc-item").on({
			mouseenter:function(){
				$(this).css("position","relative");
				var currentdata = $(this).find(".current-date");
				var attr = currentdata[0].attributes;
				var index = $(this).index()+1;
				var z = index%7;
				var k = (index + 1)%7;
				var add_html = "";
				if(z == 0 || k == 0){
					add_html = '<div class="tips-info special-tip-info" id="tips-info">'+
					'<i class="arrowright"></i>';
				}else{
					add_html = '<div class="tips-info" id="tips-info">'+
					'<i class="arrow"></i>';
				}
				var month = attr[6].value;
				if(attr[6].value < 10){
					month = "0"+attr[6].value;
				}
				var day = attr[5].value;
				if(attr[5].value < 10){
					day = "0"+attr[5].value;
				}
				var tip_html = add_html+
				'<p class="this-date">'+attr[7].value+'-'+month+'-'+day+'</p>'+
				'<p class="this-lunardata"><span class="this-lunardata-month">'+attr[3].value+'</span><span class="this-lunardata-day">'+attr[2].value+'</span></p>'+
				'<p class="this-week">'+attr[18].value+'</p>'+
				'<button id="changetype" class="change-value-btn" onclick="changeValue(this)" value ="'+attr[19].value+'@'+attr[7].value+'-'+month+'-'+day+'">修改工作日</btton>'+
				'</div>';
				$(this).append(tip_html);
			},
			mouseleave:function(){
				$("#tips-info").remove();
			}
			
		});
		
		$(".sc-days").find(".sc-item").dblclick(function(){
			var currentdata = $(this).find(".current-date");
			var attr = currentdata[0].attributes;
			var month = attr[6].value;
			if(attr[6].value < 10){
				month = "0"+attr[6].value;
			}
			var day = attr[5].value;
			if(attr[5].value < 10){
				day = "0"+attr[5].value;
			}
			var data = {};
			data["value"] = attr[17].value+'@'+attr[7].value+'-'+month+'-'+day
			changeValue(data);
		});

	});
});
