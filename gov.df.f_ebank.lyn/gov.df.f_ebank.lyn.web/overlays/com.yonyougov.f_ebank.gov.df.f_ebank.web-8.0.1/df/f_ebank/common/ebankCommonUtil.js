/**
 * 获取基本参数参数
 * @param key
 * @return
 */
function getEBankConfParam(rgCode,key) {
	var result;
	$.ajax({
		url : EBankConstant.CommonUrl.EBankConfParam_url + "/getParamConfByKey.do",
		type : "POST",
		dataType : "json",
		async : false,
		data : {
			"tokenid" : ip.getTokenId(),
			"rg_code" : rgCode,
			"key" : key,
			"ajax" : "noCache"
		},
		success : function(data) {
			result = data;
		}
	});
	return result;
}
 


  function  htmlEncodeByRegExp (str){  
          var s = "";
         if(str.length == 0) return "";
       s = str.replace(/&/g,"&amp;");
      s = s.replace(/</g,"&lt;");
        s = s.replace(/>/g,"&gt;");
        s = s.replace(/ /g,"&nbsp;");
         s = s.replace(/\'/g,"&#39;");
         s = s.replace(/\"/g,"&quot;");
          return s;  
   }
   /*2.用正则表达式实现html解码*/
   function htmlDecodeByRegExp(str){  
        var s = "";
        if(str.length == 0) return "";
         s = str.replace(/&amp;/g,"&");
         s = s.replace(/&lt;/g,"<");
        s = s.replace(/&gt;/g,">");
        s = s.replace(/&nbsp;/g," ");
         s = s.replace(/&#39;/g,"\'"); 
       s = s.replace(/&quot;/g,"\"");
         s = s.replace(/&#60;/g,"\<");
         s = s.replace(/&#60;/g,"\<");
         s = s.replace(/&#34;/g,"\"");
       return s;  
   }
   
   
   //日期加一天
   function dateAddOneDay(time){
	   time=time.replace(/-/g,"/");
		var date=new Date(new Date(time).valueOf()+24*60*60*1000);
		return changeDateToString(date);
   }
   //将字符串转换成日期
   function changeDateToString(date){
		var Year=0;
		var Month=0;
		var Day=0;
		var CurrentDate="";
		Year=date.getFullYear();
		Month=date.getMonth()+1;
		Day=date.getDate();
		CurrentDate=Year;
		if(Month>=10){
			CurrentDate=CurrentDate+"-"+Month+"-";
		}else{
			CurrentDate=CurrentDate+"-"+"0"+Month+"-";
		}
		if(Day>=10){
			CurrentDate=CurrentDate+Day;
		}else{
			CurrentDate=CurrentDate+"0"+Day;
		}
		return CurrentDate;
	}