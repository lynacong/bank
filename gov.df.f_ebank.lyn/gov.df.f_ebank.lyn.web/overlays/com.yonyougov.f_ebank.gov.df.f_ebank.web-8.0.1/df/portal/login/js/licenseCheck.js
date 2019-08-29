var isValidate =true;
$(function(){



})

function judgeTimeDiffer(startTime,endTime) {
    return parseInt(( endTime -startTime) / 1000 / 60 / 60 / 24 );
}

function licenseCheck(){
    var params = {};
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

            //取当前选中的年度与当前日期的年度比较
            var selectNd = $('#setYear').val();
            var sTime = parseInt(xhr.getResponseHeader("x_check_nowtime"));
            var date=new Date(sTime);
            var year=date.getFullYear();
            if(selectNd >= year){
                var dateTime = xhr.getResponseHeader("x_check_nowtime");
            }else{

                var dateStr = selectNd +'-1-1';
                dateStr = dateStr.replace(/-/g, '/');
                var dateTime = new Date(dateStr).getTime();
            }

            var difDay = judgeTimeDiffer(dateTime,endTime);
            //演示版
            if(type==0){
                if(difDay==0&(endTime-dateTime)<0){
                    $('#license').html('演示版 授权已过期');
                    $("#login-btn").attr("disabled", true);
                    $("#login-btn").css("background", "gray");
                    isValidate = false;
                }else if(difDay<0){
                    $('#license').html('演示版 授权已过期');
                    $("#login-btn").attr("disabled", true);
                    $("#login-btn").css("background", "gray");
                    isValidate = false;
                }else{
                    $('#license').html('演示版');
                }

            }else if(type==1){
                //正式版
                if(difDay<((-6*30)+1)||difDay ==(-6*30)+1){
                    $('#license').html('授权已过期' );
                    $("#login-btn").attr("disabled", true);
                    $("#login-btn").css("background", "gray");
                    isValidate = false;
                }
            }
        }
    })

}
