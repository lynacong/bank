//判断是否为系统管理员
var isUserManager = false;
var userId;
$(function(){
	setUser();
	checkIsUserManager();
	params = {};
	$.ajax({
		url : "/df/portal/getLicenseType.do",
		type : "GET",
		dataType : "json",
		data : params,
	    complete: function( xhr,data ){
			//系统授权类型
			var type = xhr.getResponseHeader('x_check_license_type');
			
			//如果授权类型获取不到说明未注册，直接return
			if(type==null||type =='-1'){
				return;
			}
			//授权截止时间 long
			var endTime = parseInt(xhr.getResponseHeader('x_check_expiretime'));
			//授权截止时间 yyyy-mm-dd
			var endDate = xhr.getResponseHeader('x_check_expiredate');
			//授权检查状态
			var checkStatus = xhr.getResponseHeader('x_check_licenseck_status');
			//比较
			var dateTime = xhr.getResponseHeader("x_check_nowtime");
			var difDay = judgeTimeDiffer(dateTime,endTime);
			
			var statusMes='';
			if(checkStatus<0){
				statusMes='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;授权超限';
			}
			
			//是否过期
			var isValidate = checkIsValidate(dateTime,endTime);
			
			if(!isUserManager){
				if(type==0){
					$('#license').html('演示版');
				}
			}else{
				//演示版
				if(type==0){
					if(difDay==0&&!isValidate){
						$('#license').html('演示版 授权已过期'+statusMes);
					}else if(difDay<0 ){
						$('#license').html('演示版 授权已过期'+statusMes);
					}else if(difDay>-1 && difDay<30){
						$('#license').html('演示版 授权还有'+(difDay+1)+'天过期，有效期截止到: '+endDate+statusMes);
					}else{
						$('#license').html('演示版'+statusMes);
					}
					
				}else if(type==1){
				//正式版
					if(difDay>-1 && difDay<30 && isValidate){
						$('#license').html('授权还有:'+(difDay+1)+'天过期,有效期截止到: '+endDate+statusMes);
					}else if((difDay ==0 && (difDay >((-6*30)-1)))&& !isValidate){
						var validateDateTime = endTime+179*24*60*60*1000;
						validateDateTime = new Date(validateDateTime);
						var validateDate = validateDateTime.getFullYear()+'-'+(validateDateTime.getMonth()+1)+'-'+validateDateTime.getDate();
						$('#license').html('授权已过期,在 '+validateDate+' 后将无法登录系统，请尽快更新授权有效期'+statusMes);
					}else if((difDay <0 && (difDay >((-6*30)-1)))&& !isValidate){
						var validateDateTime = endTime+179*24*60*60*1000;
						validateDateTime = new Date(validateDateTime);
						var validateDate = validateDateTime.getFullYear()+'-'+(validateDateTime.getMonth()+1)+'-'+validateDateTime.getDate();
						$('#license').html('授权已过期,在 '+validateDate+' 后将无法登录系统，请尽快更新授权有效期'+statusMes);
					}else {
						$('#license').html(statusMes);
					}
				}
			}

		}
	})
})

function judgeTimeDiffer(startTime,endTime) {
    return parseInt(( endTime -startTime) / 1000 / 60 / 60 / 24 );
}

function checkIsUserManager(){

	params = {};
	params['ruleID'] = 'portal-df-user.getUserInfoByUserId';
	params['userId'] = userId;
	params['start'] = '0';
	params['limit'] = '1';

	$.ajax({
		url : "/portal/GetPageJsonData.do?tokenid=" + getTokenId(),
		type : "GET",
		dataType : "json",
		async:false, 
		data : params,
		success : function(data) {
			var result = data[0];
			var userType = result.belong_type;
			if(userType == '001'){
				isUserManager = true;
			}

		}
	});
	
}


function setUser(){
			var caroleguid = sessionStorage.select_role_guid==undefined?"":sessionStorage.select_role_guid,
			agencyCode = sessionStorage.select_agency_code==undefined?"":sessionStorage.select_agency_code;
			$.ajax({
			url : "/df/portal/initIndex.do",
			type : "GET",
			async: false,
			data : {"tokenid":getTokenId(), "caroleguid":Base64.encode(caroleguid), "agencyCode":Base64.encode(agencyCode)},
			dataType : "json",
			success : function(data){
				userId = data.publicParam.svUserId;
			}
		})}


function checkIsValidate(dateTime,endTime){
	if(endTime>dateTime||endTime==dateTime){
		return true;
	}else{return false}
}

