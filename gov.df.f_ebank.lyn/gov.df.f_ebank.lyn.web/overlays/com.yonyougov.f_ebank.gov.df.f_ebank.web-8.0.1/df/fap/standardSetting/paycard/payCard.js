require([ 'jquery', 'knockout', 'bootstrap', 'uui', 'tree', 'grid', 'director','ip' ],
		function($, ko) {
			window.ko = ko;
			var tokenid = ip.getTokenId();
			showAndHidePanel();
			initPageInfo();
			
			//根据选中值设置文本域 点击事件 开始
			$(function(){
				$("input[name=paycardpaycard_model]").click(function(){
					showAndHidePanel();
			});
			//根据选中值设置文本域 点击事件 结束	
				
			//是否启用公务卡服务平台点击事件 - 开始
			$("#paycardpaycardServiceEnabled").click(function(){
				enableUsed();
			});
			//是否启用公务卡服务平台点击事件- 结束
		 });
});

//是否启用公务卡服务平台 -主方法 开始
function enableUsed()
{
	var flag = $("#paycardpaycardServiceEnabled").is(':checked');	
	if(!flag){
			$("#paycardpaycard_serverip").attr("disabled",true);
			$("#paycardpaycard_serverport").attr("disabled",true);
			$("#dxpLoginName").attr("disabled",true);
			$("#dxpLoginPass").attr("disabled",true);
			$("#paycardpaycardMaxReturnNum").attr("disabled",true);
			$("#paycardpayCardDownType").attr("disabled",true);
	}
	else{
			$("#paycardpaycard_serverip").attr("disabled",false);
			$("#paycardpaycard_serverport").attr("disabled",false);
			$("#dxpLoginName").attr("disabled",false);
			$("#dxpLoginPass").attr("disabled",false);
			$("#paycardpaycardMaxReturnNum").attr("disabled",false);
			$("#paycardpayCardDownType").attr("disabled",false);
		}
}
//是否启用公务卡服务平台 -主方法 结束


var last_paycardpaycard_bankip="";
var last_paycardpaycard_bankport="";
var last_intfdxppaycardPAY_CARD_SRCREGION="";
var last_intfdxppaycardPAY_CARD_SRCORGANIZE="";

//判断隐藏和显示 - 开始
function showAndHidePanel(){
	 switch($("input[name=paycardpaycard_model]:checked").attr("id")){
	  case "hnModel":
	  case "nbModel": 
	  case "localVersion2Model": 
		  $(".webservice-model").hide();
		  $(".top-three-model").show();
		  	//控制可编辑-开始
		 	$("#paycardpaycardServiceEnabled").attr("disabled",false);
	 		$("#paycardpaycard_serverip").attr("disabled",false);
			$("#paycardpaycard_serverport").attr("disabled",false);
			$("#dxpLoginName").attr("disabled",false);
			$("#dxpLoginPass").attr("disabled",false);
			$("#paycardpaycardMaxReturnNum").attr("disabled",false);
			$("#paycardpayCardDownType").attr("disabled",false);
			//控制可编辑-开始
	      break;
	  case "webserviceModel":
	  	   $(".top-three-model").hide();
	 	   $(".webservice-model").show();
	 	   
	 	   //控制不可编辑-开始
	 		$("#paycardpaycardServiceEnabled").attr("disabled",true);
			$("#paycardpaycard_serverip").attr("disabled",true);
			$("#paycardpaycard_serverport").attr("disabled",true);
			$("#dxpLoginName").attr("disabled",true);
			$("#dxpLoginPass").attr("disabled",true);
			$("#paycardpaycardMaxReturnNum").attr("disabled",true);
			$("#paycardpayCardDownType").attr("disabled",true);
			//控制不可编辑-结束
	 	   
	      break;  
	  default:
	      break;
 }
}
//判断隐藏和显示 - 结束

//初始化界面信息- 开始
function initPageInfo(){
	$.ajax({
				url : "/df/globalConfig/initBasePageInfo.do?tokenid="
						+ tokenid,
				type : 'GET',
				dataType : "json",
				data: {
					"ajax":1,
					"belong_page" : "paycard"
					},
				success : function(data) {
					if(data.flag=="1"){
						//请求成功 界面赋值 
						for(var i=0;i<data.rows.length;i++){
							var plt_key = data.rows[i].plt_key;
							
							//用户名@密码  paycardpayCardLoginInfo
							if(plt_key == "paycardpayCardLoginInfo"){
									var dxpInfo=data.rows[i].value;
									var dxpLoginName=dxpInfo.split('@')[0];
									$("#dxpLoginName").val(dxpLoginName);
									var dxpLoginPass=dxpInfo.split('@')[1];
									$("#dxpLoginPass").val(dxpLoginPass);
								}
							//paycardpaycard_model  "公务卡模式参数"
							else if(plt_key == "paycardpaycard_model"){
									$("input[name=paycardpaycard_model][value='"+data.rows[i].value+"']").attr('checked','true');
								
								}
							//是否启用公务卡服务平台
							else if(plt_key == "paycardpaycardServiceEnabled"){
								$("#"+ plt_key +"").attr("checked",data.rows[i].value=="1"? true: false);
								enableUsed();
							}
							else if(plt_key == "paycardPAY_CARD_CHECK_IDENTITY"){
								if(data.rows[i].value == null)
									{
										$("#"+ plt_key +"").attr("checked", false);
									}
								else
									{
										$("#"+ plt_key +"").attr("checked", true)
									}
							}
							else{
								
								if(plt_key == "paycardpaycard_bankip")
									{
										paycardpaycard_bankip=data.rows[i].value;
									}
								else if(plt_key == "paycardpaycard_bankport")
									{
										paycardpaycard_bankport=data.rows[i].value;
									}
								else if(plt_key == "intfdxppaycardPAY_CARD_SRCREGION")
									{
										intfdxppaycardPAY_CARD_SRCREGION=data.rows[i].value;
									}
								else if(plt_key == "intfdxppaycardPAY_CARD_SRCORGANIZE")
									{
										intfdxppaycardPAY_CARD_SRCORGANIZE=data.rows[i].value;
									}
								else if(plt_key == "uparapayPAY_CARD_SOCKET_PORT")
									{
										$("#last_uparapayPAY_CARD_SOCKET_PORT").val(data.rows[i].value);
										$("#topThree_uparapayPAY_CARD_SOCKET_PORT").val(data.rows[i].value);
									}
								else
									{
										$("#"+ plt_key +"").val(data.rows[i].value);
									}
							}
						}
						//初始化记录模式参数值-开始
						var modelValue=$("input[name='paycardpaycard_model']:checked").val();
						if(modelValue =="1" || modelValue =="2" || modelValue =="3"){
							$("#topThree_paycardpaycard_bankip").val(paycardpaycard_bankip);
							$("#topThree_paycardpaycard_bankport").val(paycardpaycard_bankport);
							$("#topThree_intfdxppaycardPAY_CARD_SRCREGION").val(intfdxppaycardPAY_CARD_SRCREGION);
							$("#topThree_intfdxppaycardPAY_CARD_SRCORGANIZE").val(intfdxppaycardPAY_CARD_SRCORGANIZE);
						}
						else if(modelValue =="4"){
							$("#last_paycardpaycard_bankip").val(paycardpaycard_bankip);
							$("#last_paycardpaycard_bankport").val(paycardpaycard_bankport);
							$("#last_intfdxppaycardPAY_CARD_SRCREGION").val(intfdxppaycardPAY_CARD_SRCREGION);
							$("#last_intfdxppaycardPAY_CARD_SRCORGANIZE").val(intfdxppaycardPAY_CARD_SRCORGANIZE);
						}
						//初始化记录模式参数值-结束
						showAndHidePanel();
					}
					else if(data.flag=="0"){
						ip.ipInfoJump("初始化失败");
					}
			}
	});
 };
//初始化界面信息 - 结束


//保存事件 - 开始
function saveData(){
	
	var commonSetting={};
	
	var aloneSetting={};
	
	//公务卡模式参数    || 
	var paycardpaycard_model = $("input[name='paycardpaycard_model']:checked").val();
	commonSetting['paycardpaycard_model']=paycardpaycard_model;
	
	//记录配置的模式 在后端处理更新相对应的四条值
	var model= paycardpaycard_model;
	aloneSetting['model']=model;
	
	 //是否启用公务卡服务平台
	var paycardpaycardServiceEnabled=$('#paycardpaycardServiceEnabled').prop("checked")?"1":"0";
	commonSetting['paycardpaycardServiceEnabled']=paycardpaycardServiceEnabled;
  
	if(model == "1" || model == "2" || model == "3"){
		
			//公务卡银联IP地址  || 默认银联的区划码 
		   var paycardpaycard_bankip = $("#topThree_paycardpaycard_bankip").val();
		   aloneSetting['paycardpaycard_bankip']=paycardpaycard_bankip;
		   
		   //公务卡银联端口 || 默认银联的机构类型
		   var paycardpaycard_bankport = $("#topThree_paycardpaycard_bankport").val();
		   aloneSetting['paycardpaycard_bankport']=paycardpaycard_bankport;
		   
		   //公务卡还款明细下载服务端口号
		   var uparapayPAY_CARD_SOCKET_PORT = $("#topThree_uparapayPAY_CARD_SOCKET_PORT").val();
		   commonSetting['uparapayPAY_CARD_SOCKET_PORT']=uparapayPAY_CARD_SOCKET_PORT;
		   
		   //财政区划码  || 发送方区划码
		   var intfdxppaycardPAY_CARD_SRCREGION = $("#topThree_intfdxppaycardPAY_CARD_SRCREGION").val();
		   aloneSetting['intfdxppaycardPAY_CARD_SRCREGION']=intfdxppaycardPAY_CARD_SRCREGION;
		   
		   //财政机构码  || 发送方机构类型码
		   var intfdxppaycardPAY_CARD_SRCORGANIZE = $("#topThree_intfdxppaycardPAY_CARD_SRCORGANIZE").val();
		   aloneSetting['intfdxppaycardPAY_CARD_SRCORGANIZE']=intfdxppaycardPAY_CARD_SRCORGANIZE;
		   
		   //前三种模式 并且 启用公务卡服务平台下把配置信息写到后台
		   if(paycardpaycardServiceEnabled == "1")
		   {
			   //公务卡服务平台(DXP)IP地址
			   var paycardpaycard_serverip = $("#paycardpaycard_serverip").val();
			   commonSetting['paycardpaycard_serverip']=paycardpaycard_serverip;
			   
			   //公务卡服务平台(DXP)端口
			   var paycardpaycard_serverport = $("#paycardpaycard_serverport").val();
			   commonSetting['paycardpaycard_serverport']=paycardpaycard_serverport;
			   
			   //登录DXP用户名 
			   var dxpLoginName = $("#dxpLoginName").val();
			   //登录DXP密码
			   var dxpLoginPass = $("#dxpLoginPass").val();
			   
			   var paycardpayCardLoginInfo = dxpLoginName+"@"+dxpLoginPass;
			   commonSetting['paycardpayCardLoginInfo']=paycardpayCardLoginInfo;
			   
			   
			   //单次下载返回最大条数
			   var paycardpaycardMaxReturnNum = $("#paycardpaycardMaxReturnNum").val();
			   commonSetting['paycardpaycardMaxReturnNum']=paycardpaycardMaxReturnNum;
			   
			   //下载方式配置
			   var paycardpayCardDownType = $("#paycardpayCardDownType").val();
			   commonSetting['paycardpayCardDownType']=paycardpayCardDownType;
			}

	}
	else
	{
		//公务卡银联IP地址  || 默认银联的区划码 
		   var paycardpaycard_bankip = $("#last_paycardpaycard_bankip").val();
		   aloneSetting['paycardpaycard_bankip']=paycardpaycard_bankip;
		   
		   //公务卡银联端口 || 默认银联的机构类型
		   var paycardpaycard_bankport = $("#last_paycardpaycard_bankport").val();
		   aloneSetting['paycardpaycard_bankport']=paycardpaycard_bankport;
		   
		   //公务卡还款明细下载服务端口号
		   var uparapayPAY_CARD_SOCKET_PORT = $("#last_uparapayPAY_CARD_SOCKET_PORT").val();
		   commonSetting['uparapayPAY_CARD_SOCKET_PORT']=uparapayPAY_CARD_SOCKET_PORT;
		   
		   //财政区划码  || 发送方区划码
		   var intfdxppaycardPAY_CARD_SRCREGION = $("#last_intfdxppaycardPAY_CARD_SRCREGION").val();
		   aloneSetting['intfdxppaycardPAY_CARD_SRCREGION']=intfdxppaycardPAY_CARD_SRCREGION;
		   
		   //财政机构码  || 发送方机构类型码
		   var intfdxppaycardPAY_CARD_SRCORGANIZE = $("#last_intfdxppaycardPAY_CARD_SRCORGANIZE").val();
		   aloneSetting['intfdxppaycardPAY_CARD_SRCORGANIZE']=intfdxppaycardPAY_CARD_SRCORGANIZE;
	}
	

   
  
   

   
   //是否启用身份证号有效性验证
   var paycardPAY_CARD_CHECK_IDENTITY=$('#paycardPAY_CARD_CHECK_IDENTITY').prop("checked")?"1":"0";
   aloneSetting['paycardPAY_CARD_CHECK_IDENTITY']=paycardPAY_CARD_CHECK_IDENTITY;
   
    
	
	$.ajax({
				url : "/df/globalConfig/savePayCardInfo.do?tokenid="
						+ tokenid,
				type : 'POST',
				dataType : "json",
				data: {
					"ajax":1,
					"commonSetting":JSON.stringify(commonSetting),
					"aloneSetting":JSON.stringify(aloneSetting)
					},
				success : function(data) {
						if(data.flag=="1"){
							ip.ipInfoJump("保存成功！");
						}
						else if(data.flag=="1"){
							ip.ipInfoJump("保存失败！");
						}
					}
});
}
//保存事件 - 结束