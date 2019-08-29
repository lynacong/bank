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
   
   
   //结束日期加一天
   function dateAddOneDay(time){
	   time=time.replace(/-/g,"/");
		var date=new Date(new Date(time).valueOf()+24*60*60*1000);
		return changeDateToString(date);
   }
   //将日期转换成字符串
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
   
   /**
    * 获取财政机构
    * @param viewid
    * @param params
    * @param tokenid
    */
   function getFinancreCode(viewid,params,tokenid) {
	   $.ajax({
			url : EBankConstant.CommonUrl.getFinanceData+"?tokenid=" + tokenid,
			type : "GET",
			dataType : "json",
			data : params,
			async : false,
			success : function(data) {
				if (data.result == "成功！") {
					var html = document.getElementById("finance_code"+viewid).innerHTML;
			
					for ( var i = 0; i < data.dataDetail.length; i++) {
						
						html+="<option value="+data.dataDetail[i].chr_code+">"+data.dataDetail[i].chr_name+"</option>";

					}
					$("#finance_code"+viewid).html(html);
				} else {
					ip.ipInfoJump("获取财政信息失败！原因：" + data.reason, "error");
				}
			}
		});
   }
   
   
   /**
    * 获取所有财政机构
    * @param viewid
    * @param params
    * @param tokenid
    */
   function getAllFinancreCode(viewid,params,tokenid) {
	   $.ajax({
			url : EBankConstant.CommonUrl.getFinanceData+"?tokenid=" + tokenid,
			type : "GET",
			dataType : "json",
			data : params,
			async : false,
			success : function(data) {
				if (data.result == "成功！") {
					var html = "<option value='000000'>全部</option>";
			
					for ( var i = 0; i < data.dataDetail.length; i++) {
						
						html+="<option value="+data.dataDetail[i].chr_code+">"+data.dataDetail[i].chr_name+"</option>";

					}
					$("#finance_code"+viewid).html(html);
				} else {
					ip.ipInfoJump("获取财政信息失败！原因：" + data.reason, "error");
				}
			}
		});
   }
   
   /**
    * 获取用户的年度
    * @param viewid
    * @param param
    */
   function initYear (viewid,param) {
	   if(param == "" || param == null){
		   ip.warnJumpMsg("查询区获取年度失败！！！",0,0,true);
	   }else{
		   var html = "";
		   html+="<option value="+param+">"+param+"年"+"</option>";
		   $("#set_year"+viewid).html(html);
		   //年度置灰，不可以选择
		   $("#set_year"+viewid).attr("disabled","disabled"); 
	   }
   }
   
   /**
    * 从数据库中获取年度
    * @param viewid
    * @param tokenid
    */
   function getYear (viewid,tokenid) {
	   $.ajax({
			url : EBankConstant.CommonUrl.getEnabledYearData+"?tokenid=" + tokenid,
			type : "GET",
			dataType : "json",
			data : {
				"ajax" : "nocache"
			},
			async : false,
			success : function(datas) {			
				if (datas.errorCode == "0") {
							var html = "";
							for ( var i = 0; i < datas.setYear.length; i++) {							
									html+="<option value="+datas.setYear[i].set_year+">"+datas.setYear[i].year_name+"</option>"
							}
							$("#set_year"+ viewid).html(html);							
						} else {
							ip.ipInfoJump("加载参数失败！原因：" + datas.result,
									"error");
						}
					}
			})
   }
   
 //ie8中去掉字符串前后的空格  ，相当于ie11中的trim()
   function LTrim(str)
	{
	   var i;
	    for(i=0;i<str.length;i++)
	    {
	        if(str.charAt(i)!=" "&&str.charAt(i)!=" ")break;
	    }
	    str=str.substring(i,str.length);
	    return str;
	}
	function RTrim(str)
	{
	    var i;
	    for(i=str.length-1;i>=0;i--)
	    {
	        if(str.charAt(i)!=" "&&str.charAt(i)!=" ")break;
	    }
	    str=str.substring(0,i+1);
	    return str;
	}
	function Trim(str)
	{
	    return LTrim(RTrim(str));
	}
	
	
	function changeMoneyToChinese(money){  
         var cnNums = new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖"); //汉字的数字  
         var cnIntRadice = new Array("","拾","佰","仟"); //基本单位  
         var cnIntUnits = new Array("","万","亿","兆"); //对应整数部分扩展单位  
         var cnDecUnits = new Array("角","分","毫","厘"); //对应小数部分单位  
         //var cnInteger = "整"; //整数金额时后面跟的字符  
         var cnIntLast = "元"; //整型完以后的单位  
         var maxNum = 999999999999999.9999; //最大处理的数字  
           
         var IntegerNum; //金额整数部分  
         var DecimalNum; //金额小数部分  
         var ChineseStr=""; //输出的中文金额字符串  
         var parts; //分离金额后用的数组，预定义  
         if( money == "" ){  
             return "";  
         }  
         money = parseFloat(money);  
         if( money >= maxNum ){   
             return "";  
         }  
         if( money == 0 ){  
             //ChineseStr = cnNums[0]+cnIntLast+cnInteger;  
             ChineseStr = cnNums[0]+cnIntLast;  
             //document.getElementById("show").value=ChineseStr;  
             return ChineseStr;  
         }  
         money = money.toString(); //转换为字符串  
         if( money.indexOf(".") == -1 ){  
             IntegerNum = money;  
             DecimalNum = '';  
         }else{  
             parts = money.split(".");  
             IntegerNum = parts[0];  
             DecimalNum = parts[1].substr(0,4);  
         }  
         if( parseInt(IntegerNum,10) > 0 ){//获取整型部分转换  
             zeroCount = 0;  
             IntLen = IntegerNum.length;  
             for( i=0;i<IntLen;i++ ){  
                 n = IntegerNum.substr(i,1);  
                 p = IntLen - i - 1;  
                 q = p / 4;  
                 m = p % 4;  
                 if( n == "0" ){  
                     zeroCount++;  
                 }else{  
                     if( zeroCount > 0 ){  
                         ChineseStr += cnNums[0];  
                     }  
                     zeroCount = 0; //归零  
                     ChineseStr += cnNums[parseInt(n)]+cnIntRadice[m];  
                 }  
                 if( m==0 && zeroCount<4 ){  
                     ChineseStr += cnIntUnits[q];  
                 }  
             }  
             ChineseStr += cnIntLast;  
             //整型部分处理完毕  
         }  
         if( DecimalNum!= '' ){//小数部分  
             decLen = DecimalNum.length;  
             for( i=0; i<decLen; i++ ){  
                 n = DecimalNum.substr(i,1);  
                 if( n != '0' ){  
                     ChineseStr += cnNums[Number(n)]+cnDecUnits[i];  
                 } else if(i==0){
                	 ChineseStr += cnNums[Number(n)];
                 }  
             }  
         }  
         if( ChineseStr == '' ){  
             //ChineseStr += cnNums[0]+cnIntLast+cnInteger;  
             ChineseStr += cnNums[0]+cnIntLast;  
         }/* else if( DecimalNum == '' ){ 
             ChineseStr += cnInteger; 
             ChineseStr += cnInteger; 
         } */  
         if(ChineseStr.slice(-1)=='元'||ChineseStr.slice(-1)=='角'){
        	 ChineseStr=ChineseStr+'整';
         }
         return ChineseStr;  
     }  