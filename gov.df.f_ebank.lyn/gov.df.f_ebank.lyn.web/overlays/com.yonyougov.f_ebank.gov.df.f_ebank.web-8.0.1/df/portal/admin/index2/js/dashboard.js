var Dashboard = Dashboard || {};

function getTokenId(){
	return dfp.tokenid.getTokenId();
}

$(function(){
	Dashboard.init.index();
});

Dashboard = {
	init:{
		index:function(){
			// 常用操作
			Dashboard.often.init();
    		// 支出进度情况
			Dashboard.payprogress.init();
    		// 预算指标
			Dashboard.budget.init();
    		// 财政百度
			Dashboard.fiscal.init();
    		// 资金监控
			Dashboard.fundmonitor.init();
    		// 待办事项
			//Dashboard.dealing.init();
    		// 公告信息
			//Dashboard.article.init();
		}
	},
	often:{	// 常用操作
		init:function(){
			var _url_ban = [
				"/df/sd/pay/centerpay/input/paAccreditBillInput.html?billtype=366&busbilltype=322&model=model5&menuid=C047898C4CD1EED11FD618D4E3028DEF&menuname=%u73B0%u91D1%u4E1A%u52A1%u5F55%u5165&tokenid="+getTokenId(),
				"/df/sd/pay/centerpay/input/paInputEn.html?billtype=366&busbilltype=311&model=model5&menuid=C427F8BB4F684A1F147BF58255C4DD8A&menuname=%u5355%u4F4D%u6388%u6743%u652F%u4ED8%u7533%u8BF7%u5F55%u5165&tokenid="+getTokenId(),
				"/df/sd/pay/centerpay/input/paAccreditBillInputDK.html?billtype=366&busbilltype=322&model=model5&menuid=D4D2E5CF288710FE3582E3B6C2831ACF&menuname=%u4EE3%u6263%u4EE3%u7F34%u4E1A%u52A1%u5F55%u5165&tokenid="+getTokenId(),
				"/df/sd/pay/centerpay/input/paAccreditBillInputGT.html?billtype=366&busbilltype=322&model=model5&menuid=724D55EF8BB15697FBE6484F8D1F3B9E&menuname=%u67DC%u53F0%u7F34%u7EB3%u7A0E%u8D39%u4E1A%u52A1%u5F55%u5165&tokenid="+getTokenId(),
				"/df/sd/pay/centerpay/input/payBatchImport.html?billtype=367&busbilltype=322&menuid=86134C532B4456C55521D219C9A9A62D&menuname=%u6388%u6743%u652F%u4ED8%u6279%u91CF%u5BFC%u5165&tokenid="+getTokenId(),
				"/df/pay/paycard/payCardConfirm.html?menuid=1FC7114B943D60AC07BBDBD07DA88A2C&menuname=%u786E%u8BA4%u516C%u52A1%u5361%u62A5%u9500&tokenid="+getTokenId(),
				""	// 未开发
			];
			var _url_deng = [
				"/df/pay/plan/bills/plAgentenRegister.html?menuid=14C5F873520F87F22EEB06FCEB4950BD&menuname=%u5355%u4F4D%u989D%u5EA6%u5230%u8D26%u901A%u77E5%u4E66%u767B%u8BB0%0A&tokenid="+getTokenId(),
				"/df/pay/centerpay/bills/paAccountBillRegister.html?billtype=365&menuid=BDA61A8CE141D2464ABC67B71885F730&menuname=%u6388%u6743%u652F%u4ED8%u9000%u6B3E%u901A%u77E5%u4E66%u767B%u8BB0&tokenid="+getTokenId(),
				"/df/pay/centerpay/bills/paAccountBillRegister.html?menuid=02BF79AF73F700B10A9D4B7DE442681C&menuname=%u6388%u6743%u652F%u4ED8%u5165%u8D26%u901A%u77E5%u4E66%u767B%u8BB0&tokenid="+getTokenId(),
				
				// TODO URL 错误
				"null&menuid=451C4DA34F040F0CF0626223D0ABCF3E&menuname=%u6388%u6743%u652F%u4ED8%u9000%u6B3E%u5165%u8D26%u901A%u77E5%u4E66%u767B%u8BB0&tokenid="+getTokenId(),
				"/df/pay/centerpay/bills/paAccountBillRegister.html?menuid=2C7C442EF357E721C948CF59521DB3CE&menuname=%u8D22%u653F%u76F4%u63A5%u652F%u4ED8%u5165%u8D26%u901A%u77E5%u4E66%u767B%u8BB0&tokenid="+getTokenId(),
				"/df/pay/centerpay/bills/paAccountBillRegister.html?billtype=365&menuid=4726D8EB91D92438B8FAC33F0B9E3247&menuname=%u8D22%u653F%u76F4%u63A5%u652F%u4ED8%u9000%u6B3E%u5165%u8D26%u901A%u77E5%u4E66%u767B%u8BB0&tokenid="+getTokenId()
			];
			var _url_cha = [	// 未开发
				""+getTokenId(),
				""+getTokenId(),
				""+getTokenId(),
				""+getTokenId(),
				""+getTokenId(),
				""+getTokenId(),
				""+getTokenId(),
				""+getTokenId()
			];
			var _url_wen = [	
				""+getTokenId(),	// 邹锦涛 提供
				""+getTokenId(),	// 邹锦涛 提供
				""+getTokenId(),	// 张明辉 提供
				""+getTokenId(),	// 张明辉 提供
				""+getTokenId(),	// 张明辉 提供
				""+getTokenId(),	// 张明辉 提供
				""+getTokenId(),	// 张明辉 提供
				""+getTokenId(),	// 丁永亮 提供
				""+getTokenId()	// 张明辉 提供
			];
			
			$("._portal_hid_ban_li .hidContent ul li").find("a").each(function(index, obj){
				$(obj).prop("href", _url_ban[index]);
			});
			$("._portal_hid_deng_li .hidContent ul li").find("a").each(function(index, obj){
				$(obj).prop("href", _url_deng[index]);
			});
			$("._portal_hid_cha_li .hidContent ul li").find("a").each(function(index, obj){
				$(obj).prop("href", _url_cha[index]);
			});
			$("._portal_hid_wen_li .hidContent ul li").find("a").each(function(index, obj){
				$(obj).prop("href", _url_wen[index]);
			});
			
		}
	},
	payprogress:{	// 支付进度
		init:function(){
			
		}
	},
	budget:{	// 预算指标
		init:function(){
			
		}
	},
	fiscal:{	// 财政百度
		init:function(){
			
		}
	},
	fundmonitor:{	// 资金监控
		init:function(){
			
		}
	},
	dealing:{
		mainData:function(){
			var params = {
				tokenid : getTokenId(),
				userid : $("#svUserId", parent.document).val(),
				roleid : $("#svRoleId", parent.document).val(),
				region : $("#svRgCode", parent.document).val(),
				year : $("#svSetYear", parent.document).val()
			}
			
			dfp.Ajax.doReq(
				null,
				params,
				AjaxURL.dealing.getDealingThing,
				dfp.Ajax.doType("get"),
				function(data){
					var dealingThing = data.dealingThing;
					var html = "";
					var count = 0;
					for(var i in dealingThing){
						html += '<li><span class="icon"></span>';
						html += '<a class="_portal_recent_dealing_add_a" href="'+dealingThing[i].menu_url+'&menuid='+dealingThing[i].menu_id+'&menuname='+escape(dealingThing[i].menu_name)+'&tokenid='+getTokenId()+'" target="_blank" title="'+dealingThing[i].menu_name+' '+dealingThing[i].task_content+'">'+ dealingThing[i].menu_name +' <span class="c-red">'+ dealingThing[i].task_content +'</span></a></li>';
						count += 1;
						if(count>5)
							break;
					}
					$("#list-r2").html(html);
					// 待办操作记录
					$("._portal_recent_dealing_add_a").on("click", function() {
						dfp.recent.addRecord(this, "dealing");
					});
				}
			);
		}
	},
	article:{
		mainData:function(){
			// more article
			$("._portal_article_more_a").prop("href", "../../common/articleSearch.jsp?pgPletId=16&userId=sa&tokenid="+getTokenId());
			
			var params = {
				ruleID:'getArticleData',
				pgPletId:'16',
				userId:'sa',
				start:'0',
				limit:'6'
			};
			
		    $.ajax({
		    	url: "/portal/GetPageJsonData.do?tokenid=" + getTokenId(),
		        type: 'GET',
		        data :params,
		        dataType : 'json',
		        success: function(result){
		        	//var ss = result.dataList;
		        	var html = "";
		        	var path ="../../common/articleDetail.jsp?";
		        	//文章详细页面赋值
		        	for(var i=0;i<result.length;i++){
		        		html+= '<li><span class="icon"></span>';
		        		html+= '<a class="_portal_recent_article_add_a" href="'+path+'tokenid='+getTokenId()+'&articleId='+result[i].article_id+'&title='+result[i].article_title+'"'+' target="_blank" title="'+result[i].article_title+'">'+result[i].article_title+'</a></li>';
		        	}
		        	$("#m-content").find("ul").html(html);
		        	
		        	// 文章操作记录
		        	$("._portal_recent_article_add_a").on("click", function(){
		        		dfp.recent.addRecord(this, "article");
		        	});
		        },
		        failure: function(){
		        	alert('访问服务器失败!');
		        }
		    });
		}
	}
	
};
