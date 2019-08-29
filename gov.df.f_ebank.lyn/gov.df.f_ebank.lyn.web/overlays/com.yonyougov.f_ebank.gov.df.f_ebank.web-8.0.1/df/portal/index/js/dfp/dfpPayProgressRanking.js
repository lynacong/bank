/**
 * 支出进度排名
 * <p>需要 dfp.js</p>
 */
var dfpPayProgressRanking = dfpPayProgressRanking || {};

// 代码示例
//<div class="cen2">
//	<div class="head-r" id="head-r1">
//		<span class="ac" id="zcjdSortFrontSelect">支出进度前五</span>
//		<span class="" id="zcjdSortLastSelect">支出进度后五</span>
//	</div>
//	<!--支出进度前五-->
//	<div class="biao tab1" id="zcjdSortFront">
//		<table border="0" cellspacing="0" cellpadding="0">
//			<tr ><td width="60px"align="center">序号</td><td width="146px"align="center">业务处室</td><td width="130px"align="center">进度情况</td></tr>
//			<!-- <tr><td>1</td><td><div>机关教科处</div></td><td align="right"class="c">65.67%</td></tr> -->
//		</table>
//	</div>
//	<!--支出进度后五-->
//	<div class="biao tab1 hidden" id="zcjdSortLast">
//		<table border="0" cellspacing="0" cellpadding="0">
//			<tr ><td width="60px"align="center">序号</td><td width="146px"align="center">业务处室</td><td width="130px"align="center">进度情况</td></tr>
//			<!-- <tr><td>1</td><td><div>机关教科处</div></td><td align="right"class="c">65.67%</td></tr> -->
//		</table>
//	</div>
//</div>

dfpPayProgressRanking = {
	url : function(type) {
		if(type == "GKJB_F")
			return "/df/portal/dubbo/getMofdepScheduleRankFirst.do";
		if(type == "GKJB_L")
			return "/df/portal/dubbo/getMofdepScheduleRankLast.do";
		if(type == "YWCS_F")
			return "/df/portal/dubbo/getDeptScheduleRankFirst.do";
		if(type == "YWCS_L")
			return "/df/portal/dubbo/getDeptScheduleRankLast.do";
		if(type == "ZGBM_F")
			return "/df/portal/dubbo/getAgencyScheduleRankFirst.do";
		if(type == "ZGBM_L")
			return "/df/portal/dubbo/getAgencyScheduleRankLast.do";
		return "";
	},
	/**
	 * 展示支出进度排名
	 * @params type 排名来源
	 * @params element 渲染标签ID
	 * @params params 参数对象
	 */
	showFirst : function(type, elementId, params) {
		var url = this.url(type);
		params["tokenid"] = getTokenId();
		params["svDivision"] = dfp_util.base64.decode($("#svDivision", parent.document).val());
		params["svAgencyCode"] = dfp_util.base64.decode($("#svAgencyCode", parent.document).val());
		params["svSetYear"] = dfp_util.base64.decode($("#svSetYear", parent.document).val());
		$.ajax({
			url : url,
			type : "GET",
			data : params, 
			dataType : "json",
			async: false,
			success : function(data){
				var data = data.data;
				var htmlAll = "",
					html = ['<tr><td>','</td><td><div class="save-long-text"><a style="cursor:default;color:#000;" href="javascript:void(0);" title="', '">',  '</a></div></td><td align="right"class="c">', '</td></tr>'];
				for(var i=0; i<data.length; i++){
					var _data = data[i];
					htmlAll += html[0] + _data.rank + html[1] + _data.agency_name + html[2] + _data.agency_name + html[3] + dfp.num2Percent(_data.rate) + html[4];
				}
				$("div#" + elementId).find("table").append(htmlAll);
			}
		});
	},
	showLast : function(type, elementId, params) {
		var url = this.url(type);
		params["tokenid"] = getTokenId();
		params["svDivision"] = dfp_util.base64.decode($("#svDivision", parent.document).val());
		params["svAgencyCode"] = dfp_util.base64.decode($("#svAgencyCode", parent.document).val());
		params["svSetYear"] = dfp_util.base64.decode($("#svSetYear", parent.document).val());
		$.ajax({
			url : url,
			type : "GET",
			data : params, 
			dataType : "json",
			async: false,
			success : function(data){
				var data = data.data;
				var htmlAll = "",
					html = ['<tr><td>','</td><td><div class="save-long-text"><a style="cursor:default;color:#000;" href="javascript:void(0);" title="', '">',  '</a></div></td><td align="right"class="c">', '</td></tr>'];
				for(var i=0; i<data.length; i++){
					var _data = data[i];
					htmlAll += html[0] + _data.rank + html[1] + _data.agency_name + html[2] + _data.agency_name + html[3] + dfp.num2Percent(_data.rate) + html[4];
				}
				$("div#" + elementId).find("table").append(htmlAll);
			}
		});
		
	}
	
};
