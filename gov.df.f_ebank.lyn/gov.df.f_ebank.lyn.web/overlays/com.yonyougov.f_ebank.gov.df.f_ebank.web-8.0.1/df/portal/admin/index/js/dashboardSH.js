/**
 * page key
 */
var ptd_jb_obj_chaUrl = "http://10.28.5.155:8080";
var ptd_jb_obj_chaParam = "&id=admin&pw=admin&showmenu=false&fasp_t_agency_id=" + Base64.decode($("#svAgencyId", parent).val());
var ptd_dwsh_obj = {
	oftenUrl : {
		"0":[ // 我要查
			// 财政直接支付申请书查询
			""+getTokenId(),
			// 财政授权支付凭证查询
			""+getTokenId(),
			// 指标明细查询
			ptd_jb_obj_chaUrl + "/bi422-20160603/showreport.do?resid=EBI$12$MMOWUNDUXN03OUXMKF5YM3MI45M8U4TZ$1$C5IL13357KQP6FU5KZFJLRKCLU5CKLXM.rpttpl&tokenid="+getTokenId()+ptd_jb_obj_chaParam,
			// 支付明细查询
			ptd_jb_obj_chaUrl + "/bi422-20160603/showreport.do?resid=EBI$12$KWNVUEM4LRCOXZLWK9SO3MLNNSWYO5DK$1$UMUYSPL6E5TUSZRMKWZMTKSIOXMKCK8U.rpttpl&tokenid="+getTokenId()+ptd_jb_obj_chaParam,
			// 预算执行情况查询
			ptd_jb_obj_chaUrl + "/bi422-20160603/showreport.do?resid=EBI$12$UYXTC5MKUMYXULKY73LN5QXW78YSQYM1$1$TC3B0QM8DMNVUC3CUKC1ZVK86OCJMAIK.rpttpl&tokenid="+getTokenId()+ptd_jb_obj_chaParam,
			// 国库集中支付年终结余资金对账单
			ptd_jb_obj_chaUrl + "/bi422-20160603/showreport.do?resid=EBI$12$MVURSBULV1UKITVV60L1XKMI4LVOI238$1$8UNKFCC5XLXNCNFUQ0NRIJJ9O9UQDOAL.rpttpl&tokenid="+getTokenId()+ptd_jb_obj_chaParam,
			// 预算单位分预算项目查询
			""+getTokenId()
			// 自定义查询
			//""+getTokenId()
		],
		"1":[	// 我要问
			// 操作手册
			""+getTokenId(),	// 邹锦涛 提供
			// 操作规范
			"/doc/paybusiness/article.html?tokenid="+getTokenId(),
			// 公务卡
			""+getTokenId(),	// 张明辉 提供
			// 支付签章
			""+getTokenId(),
			// 凭证查询
			""+getTokenId(),
			// 凭证打印
			""+getTokenId(),
			// 资金监控
			""+getTokenId(),
			// 其他
			""+getTokenId()
		]
	},
	dealing : {
		// 条目筛选
		title : [
			"授权支付凭证审核人签私章",
			"授权支付凭证公章签章",
			"银行退回"
		],
		menuid : [
			//"授权支付凭证审核人签私章",
			"1716C33244EBDD07931D3F6A12CA7C1A",
			//"授权支付凭证公章签章",
			"746503EE32CF8D7EBB46F7C32C9C3F00",
			//"银行退回",
			""
		]
	}
};

/**
 * 常用操作
 */
var ptd_dwsh_often = {
	bf : function(){
		// 常用操作-div层显示
		$(".hid").mouseover(function(){
			//$(this).css({"background":"#D9EDF7"});
			$(this).css({"background":"#108EE9"});
			var imgPath = $(this).find("a").find("img").prop("src");
			if(imgPath.indexOf("ban")>0){
				imgPath = "img/menu/icon-ban-w.png";
			}
			if(imgPath.indexOf("deng")>0){
				imgPath = "img/menu/icon-deng-w.png";
			}
			if(imgPath.indexOf("cha")>0){
				imgPath = "img/menu/icon-cha-w.png";
			}
			if(imgPath.indexOf("wen")>0){
				imgPath = "img/menu/icon-wen-w.png";
			}
			$(this).find("a").find("img").prop("src", imgPath);
			$(this).find("a").find("span").css("color", "#FFFFFF");
			$(this).find("div").css({"display":"block"});
		}).mouseleave(function(){
			$(this).css({"background":"#F8F8F8"});
			var imgPath = $(this).find("a").find("img").prop("src");
			if(imgPath.indexOf("ban")>0){
				imgPath = "img/menu/icon-ban.png";
			}
			if(imgPath.indexOf("deng")>0){
				imgPath = "img/menu/icon-deng.png";
			}
			if(imgPath.indexOf("cha")>0){
				imgPath = "img/menu/icon-cha.png";
			}
			if(imgPath.indexOf("wen")>0){
				imgPath = "img/menu/icon-wen.png";
			}
			$(this).find("a").find("img").prop("src", imgPath);
			$(this).find("a").find("span").css("color", "#000000");
			$(this).find("div").css({"display":"none"});
		});
		$(".hidContent").mouseleave(function(){
			$(".hid").css({"background":"#F8F8F8"});
			$(this).find("div").css({"display":"none"});
		});
		// 常用操作-字体颜色
		$(".hidContent ul li").mouseover(function(){
			$(this).find("a").css("color", "#FFFFFF");
		});
		$(".hidContent ul li").mouseleave(function(){
			$(this).find("a").css("color", "#333");
		});
	},
	url : function(){
		return {};
	},
	set : function(oftenUrl){
		this.bf();
		oftenUrl = dfp_util.isNull(oftenUrl) ? {} : oftenUrl;
		$("div.hidContent").each(function(i){ // 单分类div
			$(this).find("li").each(function(n){ // 单功能li
				$(this).on("click", function(){
					window.parent.addTabToParent($(this).find("a").text(), fullUrlWithTokenid((oftenUrl[i])[n]));
				});
			});
		});
	}
};

/**
 * dealing
 */
var ptd_dwjb_dealing = {
	get : function(){
		var params = {
			tokenid : getTokenId(),
			userid : $("#svUserId", parent.document).val(),
			roleid : $("#svRoleId", parent.document).val(),
			region : $("#svRgCode", parent.document).val(),
			year : $("#svSetYear", parent.document).val()
		};
		var dealingThing = {};
		$.ajax({
			url : "/df/portal/getDealingThing.do",
			type : "GET",
			data : params,
			dataType : "json",
			async: false,
			success : function(data){
				dealingThing = data.dealingThing;
			}
		});
		return dealingThing;
	},
	show : function(){
		var dealingThing = this.get();
		var html = "";
		if(dealingThing){
			var selectName = ptd_dwsh_obj.dealing.title,
				selectMenuid = ptd_dwsh_obj.dealing.menuid;
			var dealingLength = dealingThing.length,
				selectMenuidLength = selectMenuid.length;
			var height = 50;
			// 获取指定待办，匹配menuid
//			for(var n=0; n<selectMenuidLength; n++){
//				var isOk = 0;
//				for(var i=0; i<dealingLength; i++){
//					var menuid = dealingThing[i].menu_id;
//					if(!(menuid==selectMenuid[n])){
//						continue;
//					}
//					var name = (dealingThing[i].menu_name).replace(/[\n]/g, ""),
//						url = fullUrlWithTokenid(dealingThing[i].menu_url)+'&menuid='+menuid+'&menuname='+escape(name),
//						task = dealingThing[i].task_content,
//						title = selectName[n] + " " + task;
//					
//					// 特定页面
//					if(n == 6){
//						name = '我的单据';
//						url = '/df/sd/pay/order/order.html?billtype=366&busbilltype=322&menuid=2E8B00AE30A562200CC558307069B4D9&menuname=%u6211%u7684%u5355%u636E&wfStatus=201&tokenid='+getTokenId();
//					}
//					
//					// <li><span class="icon1"></span><a>...
//					html += '<li><a href="javascript:window.parent.addTabToParent(&quot;'+name+'&quot;, &quot;'+url+'&quot;);" title="'+ title +'">'+ selectName[n] +' <span class="c-red">'+ task +'</span></a></li>';
//					isOk = 1;
//					height += 28;
//					break;
//				}
//				if(isOk == 1){
//					isOk = 0;
//					continue;
//				}
//			}
			
			// 待办全展示，最好抽象成公共方法，不用每个js里都实现。
			for(var i=0; i<dealingLength; i++){
				var menuid = dealingThing[i].menu_id;
				var name = (dealingThing[i].menu_name).replace(/[\n]/g, "");
				var showname = name;
				var url = dealingThing[i].menu_url;
				if(menuid == '1716C33244EBDD07931D3F6A12CA7C1A'){
					//下面应该去对应表和菜单表中动态获取
					//对应表主要字段: 待办传入的菜单ID，链接打开的菜单ID， 页签状态代码 status_code
					menuid = 'C50DDC8D2A440D61713D513FDA429633';
					name = '授权支付申请';
					url = '/df/sd/pay/orderPaAccredit/orderPaAccredit.html?billtype=366&busbilltype=322&model=model5&vtcode=8202';
					url += "&activetabcode=202";
				}
				url = fullUrlWithTokenid(url)+'&menuid='+menuid+'&menuname='+escape(name),
				task = dealingThing[i].task_content,
				title = name + " " + task;
				html += '<li><a href="javascript:window.parent.addTabToParent(&quot;'+name+'&quot;, &quot;'+url+'&quot;);" title="'+ title +'">'+ showname +' <span class="c-red">'+ task +'</span></a></li>';
			}
			
		}
		
		if(!isObjNull(html)){
			$("#m-content1").find("ul").html("").append(html);
		}
		
	},
	refresh : function(){ // 部分更新
		this.show();
	}
};

$(function(){

	//var oftenUrl = ptd_dwsh_obj.oftenUrl;
	dfpMenu.show("SH", "wen", "woyaowen"); // 我的单据
	dfpMenu.show("SH", "cha", "woyaocha"); // 常用报表
	// 主题查询
    $("#zhutifexi").click(function () {
        window.parent.addTabToParent("单位查询", dfp.fullUrl(dfp.esen.url("DWJB_TOP")));
    });
	ptd_dwsh_often.bf();
	
	// 支出进度
	dfpPayProgress.bf();
	dfpPayProgress.show();
	$("#payProgressRefreshGaoji").click(function() {
		dfpPayProgress.show();
	});

	// 预算指标
	ptd_budget.bf();
	ptd_budget.show();
	$("#budgetGridRefresh").click(function() {
		ptd_budget.show(true);
	});
//放大
	
	$("#blowUpBtn").click(function(){
		//console.log(222);
		window.parent.coverPortalFrame();
		
	});
	

	
	// 财政百度
	dfpFiscal.bf("fiscalInput");
	$("div#pic").on("click", function() {
		var fiscalParam = $("#fiscalInput").val();
		if(fiscalParam == "") {
			alert("请输入要查询的内容");
		} else {
			dfpFiscal.set(fiscalParam);
		}
	});

	// 资金监控
	dfpFundmonitor.bf();
	dfpFundmonitor.show();
	$("#refreshFundmonitor").click(function(){ dfpFundmonitor.show();});

	// 待办
	//ptd_dwjb_dealing.show();
	dfpDealing.show("m-content1", dfp.page.SH);
	$("#dealingMore").click(function(){
		dfpDealing.show("m-content1", dfp.page.SH);
	});
	
	// 公告
//	dfpArticle.bf();
	dfpArticle.show(4,'','SH');
	$("#articleRefresh").click(function () {
	   dfpArticle.show(4,'','SH');
	});
	// 右侧滑动设置框
	$("#confirm").on("click", function() {
		rightHiddenSiderShow();
		var type = $('#rightDanweiSetting').val();
		// 支出进度
		$("#payProgressDanweiChange").val(type);
		$("#payProgressDanweiChange").change();
		// 预算指标
		$("#budgetDanweiChange").val(type);
		$("#budgetDanweiChange").change();
		// TODO 我的单据
		//dfpFundmonitor.show(null, dfpFundmonitor.showDataList, type);
		dfpFundmonitor.show(null, null, type);
	});
	$("#cancel").on("click", function() {
		rightHiddenSiderShow();
	});
	// 右侧金额显示单位切换
	$("#rightDanweiSetting").change(function() {

	});

	//最大化
	$("#budgetGridMax").click(function() {
		dfp_util.maxDiv("leftDownBudgetGrid", "预算指标");
		$(".layui-layer-close2").css('right', '-15px');
        $("#budgetGridMax").hide();
        $(".layui-layer-close").on("click", function () {
            $("#budgetGridMax").show();
        });
	});
	$("#payProgressMaxGaoji").click(function() {
        var index = layer.open({
            type: 1,
            title: '支出进度',
            //skin: 'layui-layer-rim', //加上边框
            area: ['800px', '600px'], //宽高
            content: $(".cen-2"),
            offset: 'rb',
            closeBtn: 2,
            //maxmin: true,
            yes: function (index) {
                layer.close(index);
                setTimeout('$("#payProgressRefreshGaoji").click()', 500);
            },
            cancel: function (index) {
                layer.close(index);
                setTimeout('$("#payProgressRefreshGaoji").click()', 500);
            }
        });
        layer.full(index);
		$(".layui-layer-close2").css('right', '-15px');
		//$("#payProgressRefreshGaoji").click();
		setTimeout('$("#payProgressRefreshGaoji").click()', 500);

        $("#payProgressMaxGaoji").hide();
        $(".layui-layer-close").on("click", function () {
            $("#payProgressMaxGaoji").show();
        });

	});
});

//右侧bar滑出
var $rightHiddenSider = $("#rightHiddenSider"),
	$cls_control_sidebar_open = "control-sidebar-open";
function rightHiddenSiderShow() {
	if ($rightHiddenSider.hasClass($cls_control_sidebar_open)) {
		$rightHiddenSider.removeClass($cls_control_sidebar_open);
		// 添加鼠标滑动事件
		$("#rightSetting").on("mouseover", function(){
			$(this).find("i").css("color", "#fff");
			$(this).find("span").css("color", "#fff");
			$(this).css("background-color", "#108ee9");
		}).on("mouseleave", function(){
			$(this).find("i").css("color", "#313131");
            $(this).find("span").css("color", "#313131");
            $(this).css("background-color", "#CCE7F5");
		});
	} else {
		$rightHiddenSider.addClass($cls_control_sidebar_open);
		// 取消鼠标滑动事件
		$("#rightSetting").unbind("mouseover").unbind("mouseleave");
		$("#rightSetting").css("background-color", "#108ee9").find("i").css("color", "#fff");
	    $("#rightSetting").find("span").css("color", "#fff");
	}
}
