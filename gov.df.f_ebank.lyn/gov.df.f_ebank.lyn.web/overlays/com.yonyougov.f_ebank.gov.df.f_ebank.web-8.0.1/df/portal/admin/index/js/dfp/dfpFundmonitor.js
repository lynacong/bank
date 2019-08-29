/**
 * 资金监控
 * <p>需要 dfp.js</p>
 */
var dfpFundmonitor = dfpFundmonitor || {};

// 代码示例
//<div class="cen1" style="height:266px;">
//	<div class="head-r" id="head-r">
//		<span class="ac">本日</span>
//		<span class="">本月</span>
//		<span class="">本年</span>
//		<a href="javascript:void(0);" id="refreshFundmonitor">刷新</a>
//	</div>
//	<!--本日-->
//	<div id="fundmonitor_tab_day"  class="biao tab2">
//		<table border="0" cellspacing="0" cellpadding="0"></table>
//	</div>
//	<!--本月-->
//	<div id="fundmonitor_tab_month" class="biao tab2 hidden">
//		<table  border="0" cellspacing="0" cellpadding="0"></table>
//	</div>
//	<!--本年-->
//	<div id="fundmonitor_tab_year" class="biao tab2 hidden">
//		<table  border="0" cellspacing="0" cellpadding="0"></table>
//	</div>
//</div>

dfpFundmonitor = {
	showMenu : [],
	showDataList : [],
	bf : function(){
		this.showMenu = [];
		var isDfpMenuLv3Ok = setInterval(function() {
			dfp_menu_lv3 = JSON.parse(sessionStorage.getItem("dfp_menu_lv3"));
			if(dfp_menu_lv3 != null && dfp_menu_lv3 != undefined){
				clearTimeout(isDfpMenuLv3Ok);
			}
		}, 100);
		dfp_menu_lv3 = JSON.parse(sessionStorage.getItem("dfp_menu_lv3"));
		//dfp_menu_lv3 = dfp_util.isGetValue();
		// 匹配
		//此处应该能取自配置信息
		var givenMenu = [
		    //"用款计划",
		    {"code":"00111510001","name":"用款计划","menuid":"","type":"261"},		                 
			//"授权支付申请",
			{"code":"00111510003","name":"授权支付","menuid":"","type":"366"},
			//"直接支付申请",
			{"code":"00111510002","name":"直接支付","menuid":"","type":"361"},
			//"授权支付清算额度单"
			{"code":"00111501005","name":"授权汇总清算","menuid":"","type":"232"},
			//"直接支付汇总清算单",
			{"code":"00111501004","name":"直接汇总清算","menuid":"","type":"331"}
		];
		var html = "",
			name = [],
			url = [];
		for(var i=0; i<givenMenu.length; i++) {
			for(var j in dfp_menu_lv3) {
				if(!dfp_menu_lv3.hasOwnProperty(j)){
					continue;
				}
				var onemenu = dfp_menu_lv3[j];
				if(onemenu.code == givenMenu[i].code){
					var row = givenMenu[i];
					row.menuid = onemenu.guid;
					row.menu_name = onemenu.menu_name;
					row.name = onemenu.menu_name;
					row.type = dfp_util.getUrlParameter(onemenu.url, 'billtype');
					row.url = fullUrlWithTokenid(onemenu.url)+'&menuid='+onemenu.guid+'&menuname='+escape(onemenu.name);
					this.showMenu.push(row);
					//name.push(dfp_re.space.removeAll(dfp_re.num.removeAll(onemenu.name)));
					//url.push(fullUrlWithTokenid(onemenu.url)+'&menuid='+onemenu.guid+'&menuname='+escape(onemenu.name));
					//html += '<li class="list-group-item topDanjuMenu" style="cursor:pointer;text-align: center;">'+dfp_re.space.removeAll(dfp_re.num.removeAll(onemenu.name))+'</li>';
				}
			}
		}
		var html = "";
		for(var i=0; i<this.showMenu.length; i++){
			html += "<span ";
			if(i == 0){
				html += "class='ac'"; 
			}
			html +=  " billtype='" + this.showMenu[i].type + "'>"+ this.showMenu[i].name +"</span>";
		}
		$('#head-r').html('');
		$('#head-r').html(html);
		html = null;
		// 资金监控页签切换
		$('#head-r >span').each(
		    function(index){
		        $(this).click(function(){
		            //$('.tab2').addClass('hidden');
		            //$('.tab2:eq('+index+')').removeClass('hidden');
		            $('#head-r > span').removeClass('ac');
		            $('#head-r > span:eq('+index+')').addClass('ac');
		            dfpFundmonitor.show(dfpFundmonitor.showMenu[index]);
		        });
		        
		    }
		);
	},
	show : function(menu, datalist, unit){
		if(!menu){
			if(this.showMenu.length ==0){
				return;
			}else{
				menu = this.showMenu[0];
			}
		}
		$("#fundmonitor_tab_day table").html('');
		$("#fundmonitorImg").css("display", "block");
		var _zhifu = datalist,
			_jiankong = "",
			isBudgetOk = 0,
			isGuokuOk = 0,
			all_options3 = {
				"tokenid":getTokenId(),
				"bsibilltypecode":menu.type,
				"bsinodecode":'',
				"menuid":menu.menuid
			};
		// 支付
		if(!_zhifu){
			$.ajax({
				//url: "/df/pay/search/mainpage/getEnPayHeadPage.do",
				url : "/df/pay/search/mainpage/getMyBillCount.do",
				type: "GET",
				dataType: "json",
				data: dfp.commonData(all_options3),
				success: function(data) {
					_zhifu = data['dataDetail'] || {};
					isBudgetOk = 1;
                    if(typeof(unit)=="undefined"){
                        unit = 1;
                    }
                    var table_head = '<tr style="font-size:15px; font-weight:bold;"><td style="font-weight:bold;"width="100px"align="center">状态</td><td style="font-weight:bold;" width="70px"align="center">笔数</td><td style="font-weight:bold;text-align: right;" width="160px"align="center">金额';
                    var showUnit = '(万元)';
                    if(unit == 0){
                        showUnit = '(元)';
                    }else if(unit == 1){
                        showUnit = '(万元)';
                    }else if(unit == 2){
                        showUnit = '(亿元)';
                    }
                    var html_day = table_head + showUnit + '</td></tr>';

                    var html_month = table_head+'（万元）</td></tr>';
                    var html_year = table_head+'（万元）</td></tr>';
                    // 支付，前五行
                    for(var i =0; i < _zhifu.length; i++){
                        var menu_name = menu.menu_name;
                        var url = menu.url;

                        var _zhifu_one = (_zhifu[i]).val;
                        var tr_name = (_zhifu[i]).name;
                        var count = (_zhifu[i]).count;
                        var money = (_zhifu[i]).money;
                        if(unit == 1){
                            money = (money/1e4).toFixed(2);
                        }else if(unit == 2){
                            money = (money/1e8).toFixed(2);
                        }
                        var children = (_zhifu[i]).children_list;
                        if(children.length > 0){//取第一个待办状态的,并且count大于0的
                            var j = 0;
                            for(; j < children.length; j++){
                                if((children[j].show_right == '1' || children[j].show_right == null ) && children[j].count > 0){
                                    break;
                                }
                            }
                            if(j == children.length){//取第一个待办的
                                j = 0;
                                for(; j < children.length; j++){
                                    if(children[j].show_right == '1' || children[j].show_right == null){
                                        break;
                                    }
                                }
                            }
                            if(j == children.length){
                                j = 0;
                            }
                            url += "&activetabcode=" + (children[j]).bill_node_code;
                        }
                        //for(var n in _zhifu_one){
                        var _tr_html = '<tr onclick="dfpFundmonitor.onclick('+i+',&quot;'+menu_name+'&quot;, &quot;'+url+'&tokenid='+getTokenId()+'&quot;);"><td>'+tr_name;
                        _tr_html += '</td><td class="_font_color_fundmonitor_count">'+dfp.num2ThousandBreakNoDigit(count)+'</td><td align="right" class="_font_color_fundmonitor">';
                        //if(_zhifu_one[n].type=='day')
                        html_day += _tr_html + dfp.num2ThousandBreak(money)+'</td></tr>';

                        if(children.length > 1){
                            for(var j = 0; j < children.length; j++){
                                var url1 = menu.url + "&activetabcode=" + children[j].bill_node_code;
                                var a_html = '<li class="list-group-item"><div onclick="javascript:window.parent.addTabToParent(&quot;'+menu_name+'&quot;, &quot;'+url1+'&tokenid='+getTokenId()+'&quot;);"><span>'+children[j].show_name;
                                a_html += '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span align="right">'+children[j].count+' 笔</span><span align="right" class="_font_color_fundmonitor">';
                                //if(_zhifu_one[n].type=='day')
                                a_html += dfp.num2ThousandBreak(children[j].money)+'</span></div></li>';
                                children[j].text = a_html;
                            }
                        }
                    }

                    this.showDataList = _zhifu;
                    var fundmonitorInterval = setInterval(function() {
                        //$("#fundmonitor_tab_day").css("position", "relative").css("top", "-25px");
                        $("#fundmonitor_tab_day table").html(html_day);
                        $("#fundmonitor_tab_month table").html(html_month);
                        $("#fundmonitor_tab_year table").html(html_year);

                        $("#fundmonitorImg").css("display", "none");

                        // 资金监控鼠标滑动效果
                        $("#fundmonitor_tab_day").find("tr").each(function(i){ dfpFundmonitor.mouseover(i, this);});
                        $("#fundmonitor_tab_month").find("tr").each(function(i){ dfpFundmonitor.mouseover(i, this);});
                        $("#fundmonitor_tab_year").find("tr").each(function(i){ dfpFundmonitor.mouseover(i, this);});
                        clearInterval(fundmonitorInterval);
                    }, 1000);

                },
				error:function(){
					$("#fundmonitorImg").css("display", "none");
				}
			});
		} else {
			$("#fundmonitorImg").css("display", "none");
		}

	},
	mouseover : function(i, obj){
		if(i>0){ // 跳过标题行
			$(obj).on("mouseover", function(){ 
				$(obj).css("background-color", "#108EE9").css("color", "#FFFFFF").css("text-decoration", "underline");
				$(obj).find("td._font_color_fundmonitor").css("color", "#FFFFFF"); 
				$(obj).find("td._font_color_fundmonitor_count").css("color", "#FFFFFF"); 
			}).on("mouseleave", function(){ 
				var bgcolor = i%2==0?"#E9E9E9":"#FFFFFF"; // 奇偶行不同色
				$(obj).css("background-color", bgcolor).css("color", "#000000").css("text-decoration", "none");
				$(obj).find("td._font_color_fundmonitor").css("color", "#F56A00"); 
				$(obj).find("td._font_color_fundmonitor_count").css("color", "#000000"); 
			});
		}
	},

	onclick: function(i, menu_name, url){
		javascript:window.parent.addTabToParent(menu_name, url);
	}
};
