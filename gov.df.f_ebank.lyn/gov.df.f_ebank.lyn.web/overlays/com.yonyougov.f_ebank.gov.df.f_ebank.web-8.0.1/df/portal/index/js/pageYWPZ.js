/**
 * 业务配置
 * <p>需要 dfp.js</p>
 */

$(function() {

	$menuDiv = $("div#menuDiv");

	var caroleguid = sessionStorage.select_role_guid==undefined?"":sessionStorage.select_role_guid;
	$.ajax({
		url : "/df/portal/getMenuByRole.do",
		type : "GET",
		data : {"tokenid":getTokenId(), "caroleguid":Base64.encode(caroleguid)},
		dataType : "json",
		success : function(data){
			var menuThreeLevel = menuLevel3(data.mapMenu);
			if(!dfp_util.isObjEmpty(menuThreeLevel)) {
				var menuFirstLevelList = menuThreeLevel.menuFirstLevelList;
				var menuSecondLevelList = menuThreeLevel.menuSecondLevelList;
				var menuThirdLevelList = menuThreeLevel.menuThirdLevelList;

				var menuListHtml = '<div class="ywpz-content">';
				// 一级菜单
				for (var i = 0; i < menuFirstLevelList.length; i++) {
					menuListHtml += '<div class="title-one">'
										+'<div class="title-circle"></div>'
										+'<p class="title-text">' + dfp_re.space.removeAll(dfp_re.num.removeAll(menuFirstLevelList[i].name)) + '</p>'
									+'</div>'
									
					menuListHtml += '<div class="ywpz-container">'
					// 二级菜单
					for (var j in menuSecondLevelList) {
						if (menuSecondLevelList[j].parentid == null || menuSecondLevelList[j].parentid == ""
							|| menuSecondLevelList[j].parentid != menuFirstLevelList[i].guid) {
							continue;
						}
						menuListHtml += '<div class="title-two">'
											+'<span class="title-two-text">' + dfp_re.space.removeAll(dfp_re.num.removeAll(menuSecondLevelList[j].name)) + '</span>'
											+'<span class="title-line"></span>'
										+'</div>'
						menuListHtml +=	'<div class="three-content">'			
						// 三级菜单
						for (var k in menuThirdLevelList) {
							if (menuThirdLevelList[k].parentid == null || menuThirdLevelList[k].parentid == ""
								|| menuThirdLevelList[k].parentid != menuSecondLevelList[j].guid) {
								continue;
							}
							var _name = dfp_re.space.removeAll(dfp_re.num.removeAll(menuThirdLevelList[k].name));
							var _url = fullUrlWithTokenid(menuThirdLevelList[k].url) + '&menuid=' + menuThirdLevelList[k].guid + '&menuname=' + escape(_name);
							//menuListHtml += '<a class="btn btn-primary" href="javascript:window.parent.addTabToParent(&quot;' + _name + '&quot;, &quot;' + _url + '&quot;);" target="_blank">' + _name + '</a>';
							menuListHtml += '<a class="title-three" href="' + _url + '" target="_blank">' + _name + '</a>';
						}
						menuListHtml +=	'</div>'
						
					}
					menuListHtml += '</div>'
				}
				// 配置
                //var _pzUrl = fullUrlWithTokenid("/df/portal/portalManager/home.html");
                var _pzUrl = fullUrlWithTokenid("/df/portal/setting3/setting.html");
                var _pzName = "门户配置";
                menuListHtml += '<div class="title-one">'+
									'<div class="title-circle"></div>'+
									'<p class="title-text">' + _pzName + '</p>'+
								'</div>'+
								'<div class="ywpz-container">'+
									'<div class="title-two">'+
										'<span class="title-two-text">'+_pzName+'</span>'+
										'<span class="title-line"></span>'+
									'</div>'+
									'<div class="three-content">'+
										'<a class="title-three" href="' + _pzUrl + '" target="_blank">' + _pzName + '</a>'+
									'</div>'+
								'</div>'
//				var _pzUrl2 = fullUrlWithTokenid("/df/portal/setting2/html/settingIndex.html"),
//					_pzName2 = "门户配置2";
//				menuListHtml += '<a class="btn btn-default" href="' + _pzUrl2 + '" target="_blank">' + _pzName2 + '</a>';
				menuListHtml += '</div>'
				$menuDiv.html(menuListHtml);
			}
		}
	});

});

function menuLevel3(menuList){
	menuThreeLevel = {
		menuFirstLevelList : new Array(),
		menuSecondLevelList : new Array(),
		menuThirdLevelList : new Array(),
		menuFourthLevelList : new Array(),
		menuFivthLevelList : new Array()
	};
	var n1 = 0;
	var n2 = 0;
	var n3 = 0;
	var n4 = 0;
	var n5 = 0;
	var baseNo = 0;
	for (var i = 0; i < menuList.length; i++){
		if(menuList[i].levelno==baseNo){
			menuThreeLevel.menuFirstLevelList[n1] = menuList[i];
			n1++;
		}else if(menuList[i].levelno==baseNo+1){
			menuThreeLevel.menuSecondLevelList[n2] = menuList[i];
			n2++;
		}else if(menuList[i].levelno==baseNo+2){
			menuThreeLevel.menuThirdLevelList[n3] = menuList[i];
			n3++;
		}else if(menuList[i].levelno==baseNo+3){
			menuThreeLevel.menuFourthLevelList[n4] = menuList[i];
			n4++;
		}else if(menuList[i].levelno==baseNo+4){
			menuThreeLevel.menuFivthLevelList[n5] = menuList[i];
			n5++;
		}
	}
	if(menuThreeLevel.menuFirstLevelList!=null && menuThreeLevel.menuFirstLevelList.length>0){
		// 0/1/2
	}else if(menuThreeLevel.menuSecondLevelList!=null && menuThreeLevel.menuSecondLevelList.length>0){
		menuThreeLevel.menuFirstLevelList = menuThreeLevel.menuSecondLevelList;
		menuThreeLevel.menuSecondLevelList = menuThreeLevel.menuThirdLevelList;
		menuThreeLevel.menuThirdLevelList = menuThreeLevel.menuFourthLevelList;
	}else if(menuThreeLevel.menuThirdLevelList!=null && menuThreeLevel.menuThirdLevelList.length>0){
		menuThreeLevel.menuFirstLevelList = menuThreeLevel.menuThirdLevelList;
		menuThreeLevel.menuSecondLevelList = menuThreeLevel.menuFourthLevelList;
		menuThreeLevel.menuThirdLevelList = menuThreeLevel.menuFivthLevelList;
	}
	return menuThreeLevel;
}
