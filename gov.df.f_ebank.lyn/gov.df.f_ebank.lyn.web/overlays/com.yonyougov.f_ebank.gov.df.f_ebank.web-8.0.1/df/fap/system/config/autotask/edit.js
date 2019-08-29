/* Created by 陈南萍 on 2017/4/17. */
define(
    [ 'jquery', 'knockout', '/df/fap/system/config/ncrd.js',
        'text!fap/system/config/autotask/edit._html',
         'bootstrap','dateZH',
        'uui', 'tree', 'grid', 'ip' ],
    function($, ko, ncrd, template) {
        window.ko = ko;
        var onCloseCallback;
        var tokenid = ip.getTokenId();
        var INIT_MODULE_URL='/df/sysAutoTask/initModule.do';//初始化模块
        var SAVE_OR_UPDATE_URL='/df/sysAutoTask/save.do';//新增/修改
        var UPDATE_SHOW_URL='/df/sysAutoTask/findOneById.do';//修改初始化
        var viewModel = {
            taskIdVal: ko.observable(),//任务id
            taskCodeVal: ko.observable(),//任务编码
            taskNameVal: ko.observable(),//任务名称
            taskBeanVal: ko.observable(),//任务名称
            taskTypeVal: ko.observable(),//选择的任务类型
            taskParamVal: ko.observable(),//任务参数
            sysIdVal: ko.observable(),//选择的所属模块
            startDateVal: ko.observable(),//起始时间
            endDateVal: ko.observable(),//终止时间
            runTimesVal: ko.observable(),//运行次数
            taskIntervalVal: ko.observable(),//间隔秒数
            cronTypeVal: ko.observable(),//选中的单选按钮
            monthOfYearVal: ko.observable(),//每年 月份
            dayOfYearVal: ko.observable(),//每年 某月第几日
            hourOfYearVal: ko.observable(),//每年 某月某日的第几个小时
            minuteOfYearVal: ko.observable(),//每年 某月某日某小时的第几分钟
            dayOfMonthVal: ko.observable(),//每月 某月第几日
            hourOfMonthVal: ko.observable(),//每月 某日的第几个小时
            minuteOfMonthVal: ko.observable(),//每月 某日某小时的第几分钟
            dayOfWeekVal: ko.observable(),//每周 星期几
            hourOfWeekVal: ko.observable(),//每周 星期几的第几个小时
            minuteOfWeekVal: ko.observable(),//每周 星期几的某小时的第几分钟
            hourOfDayVal: ko.observable(),//每日 某日的第几个小时
            minuteOfDayVal: ko.observable(),//每日 某日某小时的第几分钟
            taskStatusVal: ko.observable(),//任务状态
            createDateVal: ko.observable(),//创建时间
            //任务类型
            taskTypeOptions: ko.observableArray([
                {
                    name: '间隔性任务',
                    value: '1'
                }, {
                    name: '定期性任务',
                    value: '2'
                }
            ]),
            taskAppOptios: ko.observableArray(),//模块
            editDataTable: new u.DataTable({
                meta:{
                    'autoTaskId' :{},
                    "autoTaskCode" :{},
                    "autoTaskName" : {},
                    "autoTaskBean" : {},
                    "autoTaskType" :  {},
                    "autoTaskParam" : {},
                    "sysId" : {},
                    "startDate" : {},
                    "endDate" :	{},
                    "runTimes" : {},
                    "taskInterval" : {},
                    "scheduleCronType" : {},
                    "monthOfYear" : {},
                    "dayOfWeek" : {},
                    "dayOfMonth" :{},
                    "hourOfDay" : {},
                    "minuteOfHour" : {},
                    "taskStatus" : {}
                }
            })
        };
        var treeData=[];
        var taskCodeBefore;//修改时初始化的的规则编号  要与修改后的作对比
        // var weekSelArr=new Array(new Option("一",'1'),
        //                        new Option("二","2"),
        //                        new Option("三","3"),
        //                        new Option("四",'4'),
        //                        new Option("五","5"),
        //                        new Option("六","6"),
        //                        new Option("七",'7')
        // );
        /**
         * 解决IE下new Date 带参数返回NAN的bug
         * @param sDate
         */
        function NewDate(sDate) {
            var dates = sDate.split(' '),ymd = dates[0].split('-'),
                time = dates[1].split(':');
            var date = new Date();
            date.setUTCFullYear(ymd[0], ymd[1] - 1, ymd[2]);
            date.setUTCHours(Number(time[0]), Number(time[1]), 0, 0);
            return date;
        }
        
        viewModel.typeChange = function(){
            var type=$("#autoTask_type").val();
            typeDisableFun(type);
        }
        //间隔性任务、定期任务下的后代节点是否可编辑
        var typeDisableFun = function(type){
            if(type == '1'){//选中间隔性任务 indirectDiv
            	$(".periodDiv-radio").attr("checked",false);
            	$(".periodDiv-select").val('0');
            	$("#month_of_year").val('1');
            	$("#day_of_week").val('1');
            	viewModel.cronTypeVal('');
                $("#indirectDiv").find("*").removeAttr('disabled');
                $("#periodDiv").find("*").attr('disabled',true);
            }
            if(type == '2'){//定期任务 periodDiv
            	$(".indirectDiv-input").val('');
                $("#periodDiv").find("*").removeAttr('disabled');//获取定期任务Div下的所有后代节点
                $("#indirectDiv").find("*").attr('disabled',true);
                //var checkVal=$('input:radio[name="radioOptions"]:checked').val();
                var checkVal=viewModel.cronTypeVal();
                //if(checkVal==null){//默认选中每日
                if(isNull(checkVal)){//默认选中每日
                     //$("#dayRadio").attr("checked",true);//添加data-bind="checked:cronTypeVal"之后失效了
                    //$('input:radio[name="radioOptions"]').attr("checked",'3');
                     viewModel.cronTypeVal('3');
                    radioDisableFun(viewModel.cronTypeVal());
                }else{
                    radioDisableFun(checkVal);
                }
            }
        }
        // //定期任务 radio 点击事件
        //定期任务 radio选中后对应元素disabled
        var radioDisableFun = function (radioVal) {
            //var radioVal=$('input:radio[name="radioOptions"]:checked').val();
            if(radioVal == '0'){//选中每年
                $(".yearRadioGroup").removeAttr('disabled');
                $(".monthRadioGroup").attr('disabled',true);
                $(".weekRadioGroup").attr('disabled',true);
                $(".dayRadioGroup").attr('disabled',true);
            }
            if(radioVal == '1'){//选中每月
                $(".monthRadioGroup").removeAttr('disabled');
                $(".yearRadioGroup").attr('disabled',true);
                $(".weekRadioGroup").attr('disabled',true);
                $(".dayRadioGroup").attr('disabled',true);
            }
            if(radioVal == '2'){//选中每周
                $(".weekRadioGroup").removeAttr('disabled');
                $(".yearRadioGroup").attr('disabled',true);
                $(".monthRadioGroup").attr('disabled',true);
                $(".dayRadioGroup").attr('disabled',true);
            }
            if(radioVal == '3'){//选中每日
                $(".dayRadioGroup").removeAttr('disabled');
                $(".yearRadioGroup").attr('disabled',true);
                $(".monthRadioGroup").attr('disabled',true);
                $(".weekRadioGroup").attr('disabled',true);
            }
        }
        /*
        * 选择月份触发change事件 根据月份显示每月天数
        * 1、3、5、7、8、10、12月31天 2月29天  4、6、9、11月30天
        * */
        //viewModel.monthChange = function () {
        $("#month_of_year").change ( function () {
            var dayLength;
            var mon=$("#month_of_year").val();
            if(mon == 4 || mon == 6 || mon == 9 || mon == 11 ){
                dayLength=30;
            }else if(mon == 2){
                dayLength=29;
            }else{
                dayLength=31;
            }
            $("#day_of_year").html("");
            for(var i=0;i<dayLength+1;i++){
                if(i<10){
                    $("#day_of_year").append("<option value=" + i + ">" + '0'+i + "</option>");
                }else{
                    $("#day_of_year").append("<option value=" + i + ">" +i + "</option>");
                }
            }
        });


        //初始化所有时间下拉列表
        var initTimeSelect = function(){
            initMonthSelect();
            initDaySelect();
            initHourSelect();
            initMinuteSelect();
            initWeekSelect();
        }
        //给每年的月份下拉 month_of_year 框赋值
        var initMonthSelect = function(){
            for(var i=1;i<13;i++){
                if(i<10){
                    $("#month_of_year").append("<option value=" + i + ">" + '0'+i + "</option>");
                }else{
                    $("#month_of_year").append("<option value=" + i + ">" +i + "</option>");
                }
            }
        }
        //给下拉 day_of_month 框赋值 默认31天
        var initDaySelect = function(){
            for(var i=0;i<32;i++){
                if(i<10){
                    $(".day_of_month").append("<option value=" + i + ">" + '0'+i + "</option>");
                }else{
                    $(".day_of_month").append("<option value=" + i + ">" +i + "</option>");
                }
            }
        }
        //给下拉 hour_of_day 框赋值 默认31天
        var initHourSelect = function(){
            for(var i=0;i<24;i++){
                if(i<10){
                    $(".hour_of_day").append("<option value=" + i + ">" + '0'+i + "</option>");
                }else{
                    $(".hour_of_day").append("<option value=" + i + ">" +i + "</option>");
                }
            }
        }
        //给下拉 hour_of_day 框赋值 默认31天
        var initMinuteSelect = function(){
            for(var i=0;i<60;i++){
                if(i<10){
                    $(".minute_of_hour").append("<option value=" + i + ">" + '0'+i + "</option>");
                }else{
                    $(".minute_of_hour").append("<option value=" + i + ">" +i + "</option>");
                }
            }
        }
        //给下拉 day_of_week 框赋值 默认31天
        var initWeekSelect = function(){
            // for(var i=0;i<weekSelArr.length;i++){
            //     $("#day_of_week").options[i]=weekSelArr[i];
            // }
            $("#day_of_week").html(
                "<option value='1'>" + "一"+ "</option><option value='2'>" + "二"+ "</option>" +
                "<option value='3'>" + "三"+ "</option><option value='4'>" + "四"+ "</option>" +
                "<option value='5'>" + "五"+ "</option><option value='6'>" + "六"+ "</option>" +
                "<option value='7'>" + "七"+ "</option>" );
        }

        //时间控件
        // $('#datetimepicker').datetimepicker({
        //     format: 'yyyy-MM-dd',
        //     language: 'zh-CN',
        //     minView: 'month',
        //     todayBtn: true,
        //     bootcssVer: 3,
        //     inputMask: true,
        //     autoclose: 1,
        // });

        var clearVal = function (){
            viewModel.taskIdVal('');
            viewModel.taskCodeVal('');
            viewModel.taskNameVal('');
            viewModel.taskBeanVal('');
            viewModel.taskTypeVal('');
            viewModel.taskParamVal('');
            viewModel.sysIdVal('');
            viewModel.startDateVal('');
            viewModel.endDateVal('');
            viewModel.runTimesVal('');
            viewModel.taskIntervalVal('');
            viewModel.cronTypeVal('');
            viewModel.monthOfYearVal('');
            viewModel.dayOfYearVal('');
            viewModel.hourOfYearVal('');
            viewModel.minuteOfYearVal('');
            viewModel.dayOfMonthVal('');
            viewModel.hourOfMonthVal('');
            viewModel.minuteOfMonthVal('');
            viewModel.dayOfWeekVal('');
            viewModel.hourOfWeekVal('');
            viewModel.minuteOfWeekVal('');
            viewModel.hourOfDayVal('');
            viewModel.minuteOfDayVal('');
            viewModel.editDataTable.clear();
        }
        //初始化模块
        var initModule = function() {
            $.ajax({
                type : 'GET',
                url : INIT_MODULE_URL + '?tokenid=' + tokenid,
                dataType : 'json',
                data: { "ajax": "noCache" },
                async: false,
                cache: false,
                success : function(result) {
                    var data = result.data;
                    if (data != null) {
                        for ( var i = 0; i < data.length; i++) {
                            $("#sys_app").append(
                                "<option value=" + data[i].sys_id + ">"
                                + data[i].sys_name + "</option>");

                            // viewModel.taskTypes.push({
                            //     name: data[i].sys_name,
                            //     value: data[i].sys_id
                            // });
                        }
                    }
                },
                error : ncrd.commonAjaxError,
            });
        }
        //------------------------校验区开始-----------------------
        /*
         *运行次数 不能为空 不能小于0或字符
         * 间隔秒数 不能为空 不能小于0或字符
         * 任务编码不能为空  任务编码不规范，请按照3位一节输入任务编码！
          * 三位一节 只能是字母、数字、中横杠_、下横杠-
          * 已存在相同的任务编码
         */
        //0转换成00
        var fix=function(num,length){
            var str=""+num;
            var len=str.length;
            var s="";
            for(var i=length;i-->len;){
                s+="0";
            }
            return s+str;
        }
        // 判断常量是否为整数
        var isInteger= function (obj) {
            return (!isNaN(obj)) && obj % 1 === 0;
        }
        // 判断是否为空串 未定义 null
        var isNull= function (obj) {
            return obj == '' || obj == null || obj == undefined;
        }
        //校验 开始时间、结束时间不能为空 结束时间不能小于开始时间
        var checkDate = function(startDate,endDate){
            var flag=true;
            if(isNull(startDate)){
                // alert("开始时间不能为空！");
                ip.ipInfoJump("开始时间不能为空！","error");
                flag=false;
            }else{
                if(isNull(endDate)){
                    // alert("结束时间不能为空！");
                    ip.ipInfoJump("结束时间不能为空！","error");
                    flag=false;
                }else{
                    if(startDate > endDate){
                        // alert("开始时间不能大于结束时间！");
                        ip.ipInfoJump("开始时间不能大于结束时间！","error");
                        flag=false;
                    }
                }
            }
            return flag;
        }
        var taskCodeStr='0123456789-_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        //校验任务编码不能为空 唯一 三位一节 只能是字母、数字、中横杠_、下横杠-
        var checkTaskCode=function (taskCode,treeData) {
            var flag=true;
            if(isNull(taskCode)){
                // alert("任务编码不能为空！");
                ip.ipInfoJump("任务编码不能为空！","error");
                flag=false;
            }else if(taskCode.length % 3 !== 0){
                // alert("任务编码不规范，请按照三位一节输入任务编码！");
                ip.ipInfoJump("任务编码不规范，请按照三位一节输入任务编码！","error");
                flag = false;
            }else {
                for(var i=0;i<taskCode.length;i++){
                    var str=taskCode.charAt(i);
                    if(taskCodeStr.indexOf(str)==-1){//该字符不在taskCodeStr中 属于非法字符
                        // alert("规则编码只允许字母、数字、中横杠_以及下横杠-！");
                        ip.ipInfoJump("规则编码只允许字母、数字、中横杠_以及下横杠-！","error");
                        flag=false;
                        break;
                    }
                }
            }
            if(treeData){
                for ( var j = 0; j < treeData.length; j++) {
                    if (taskCode == treeData[j]) {
                        // alert("该编码已经存在！");
                        ip.ipInfoJump("该编码已经存在！","error");
                        flag=false;
                        break;
                    }
                }
            }
            return flag;
        }
      //校验编码的唯一性
		var checkCode= function(taskCodeBefore, taskCode, treeData) {		
			var flag=true;
            if(isNull(taskCode)){
                // alert("任务编码不能为空！");
                ip.ipInfoJump("任务编码不能为空！","error");
                flag=false;
            }else if(taskCode.length % 3 !== 0){
                // alert("任务编码不规范，请按照三位一节输入任务编码！");
                ip.ipInfoJump("任务编码不规范，请按照三位一节输入任务编码！","error");
                flag = false;
            }else {
                for(var i=0;i<taskCode.length;i++){
                    var str=taskCode.charAt(i);
                    if(taskCodeStr.indexOf(str)==-1){//该字符不在taskCodeStr中 属于非法字符
                        // alert("规则编码只允许字母、数字、中横杠_以及下横杠-！");
                        ip.ipInfoJump("规则编码只允许字母、数字、中横杠_以及下横杠-！","error");
                        flag=false;
                        break;
                    }
                }
            }
			for ( var i = 0; i < treeData.length; i++) {
				if (taskCode == treeData[i] && taskCode != taskCodeBefore) {
					flag = false;
					// alert("该编码已经存在！");
					ip.ipInfoJump("该编码已经存在！","error");
					break;
				}
			}
			return flag;
		}
        //校验任务名称和实现类 不能为空
        var checkNameAndBean=function (taskName,taskBean) {
            var flag=true;
            if(isNull(taskName)){
                // alert("任务名称不能为空！");
                ip.ipInfoJump("任务名称不能为空！","error");
                flag=false;
            }else if(isNull(taskBean)){
                // alert("实现类不能为空！");
                ip.ipInfoJump("实现类不能为空！","error");
                flag=false;
            }
            return flag;
        }
        //运行次数和间隔秒数 不能为空 不能小于0或字符
        var checkRunTimesAndInterVal=function(runTimes,taskInterval){
            if(isNull(runTimes)){
                // alert("运行次数不能为空！");
                ip.ipInfoJump("运行次数不能为空！","error");
                return false;
            }else if((!isInteger(runTimes))|| runTimes<0){
                // alert("运行次数不能小于0或字符!");
                ip.ipInfoJump("运行次数不能小于0或字符！","error");
                return false;
            }else if(isNull(taskInterval)){
                // alert("间隔秒数不能为空！");
                ip.ipInfoJump("间隔秒数不能为空！","error");
                return false;
            }else if(!isInteger(taskInterval)|| taskInterval<0) {
                // alert("间隔秒数不能小于0或字符！");
                ip.ipInfoJump("间隔秒数不能小于0或字符！","error");
                return false;
            }
            return true;
        }
        //------------------------校验区结束-----------------------

        // todo 根据taskId查询数据，显示在页面上
        function show(autotaskId, autotaskData, onEditAddAppClose) {       	
            onCloseCallback = onEditAddAppClose || {};
            treeData=autotaskData.treeData;
            if(autotaskId==''){ //新增
            //if(isNull(autotaskId)){ //新增
                $("#editTitle").text("增加自动任务");
                viewModel.taskIdVal("");
                viewModel.sysIdVal(autotaskData.sys_id);
            }else{//修改
                $("#editTitle").text("修改自动任务");
                viewModel.taskIdVal(autotaskId);
                //$("#task_id").val(autotaskId);
                $.ajax({
                    type: 'GET',
                    url: UPDATE_SHOW_URL+ '?tokenid=' + tokenid,
                    data: { 'autotask_id': autotaskId,'type':'123' , 'ajax': 'noCache'},
                    async: true,
                    cache:false,
                    success: function (data) {
                        if (data.errorCode == 0) {
                            //todo 将数据显示在页面
                            viewModel.createDateVal(data.data[0].create_date);
                            viewModel.taskCodeVal(data.data[0].autotask_code);
                            taskCodeBefore=data.data[0].autotask_code;
                            viewModel.taskNameVal(data.data[0].autotask_name);
                            viewModel.taskBeanVal(data.data[0].autotask_bean);
                            viewModel.taskTypeVal(data.data[0].autotask_type);
                            viewModel.taskParamVal(data.data[0].autotask_param);
                            viewModel.sysIdVal(data.data[0].sys_id);
                            typeDisableFun(data.data[0].autotask_type);//显示disabled
                            //viewModel.cronTypeVal(schedule_crontype);
                            if(data.data[0].autotask_type=='1'){//间隔性任务
                                var startDate=new Date(NewDate(data.data[0].start_date));
                                startDate=new Date(startDate.toString());
                                startDate=startDate.getFullYear()+"-"+fix(startDate.getMonth()+1,2)+"-"+fix(startDate.getDate(),2);
                                var endDate=new Date(NewDate(data.data[0].end_date));
                                endDate=new Date(endDate);
                                endDate=endDate.getFullYear()+"-"+fix(endDate.getMonth()+1,2)+"-"+fix(endDate.getDate(),2);
                                viewModel.startDateVal(startDate);
                                viewModel.endDateVal(endDate);
                                //$("#start_date").val(startDate);
                                //$("#end_date").val(endDate);
                                viewModel.runTimesVal(data.data[0].run_times);
                                viewModel.taskIntervalVal(data.data[0].taskinterval);
                            }else{
                                viewModel.cronTypeVal(data.data[0].schedule_crontype);
                                radioDisableFun(data.data[0].schedule_crontype);
                                //radioDisableFun(viewModel.cronTypeVal());
                                if(data.data[0].schedule_crontype == '0'){//每年
                                    viewModel.monthOfYearVal(data.data[0].month_of_year);
                                    viewModel.dayOfYearVal(data.data[0].day_of_month);
                                    viewModel.hourOfYearVal(data.data[0].hour_of_day);
                                    viewModel.minuteOfYearVal(data.data[0].minute_of_day);
                                    // monthOfYear=$("#month_of_year").val();
                                    // dayOfMonth=$("#day_of_year").val();
                                    // hourOfDay=$("#hour_of_year").val();
                                    // minuteOfHour=$("#minute_of_year").val();
                                }
                                if(data.data[0].schedule_crontype == '1'){//每月
                                    viewModel.dayOfMonthVal(data.data[0].day_of_month);
                                    viewModel.hourOfMonthVal(data.data[0].hour_of_day);
                                    viewModel.minuteOfMonthVal(data.data[0].minute_of_day);
                                    // dayOfMonth=$("#day_of_month").val();
                                    // hourOfDay=$("#hour_of_month").val();
                                    // minuteOfHour=$("#minute_of_month").val();
                                }
                                if(data.data[0].schedule_crontype == '2'){//每周
                                    viewModel.hourOfWeekVal(data.data[0].hour_of_day);
                                    viewModel.minuteOfWeekVal(data.data[0].minute_of_day);
                                    viewModel.dayOfWeekVal(data.data[0].day_of_week);
                                    // hourOfDay=$("#hour_of_week").val();
                                    // minuteOfHour=$("#minute_of_week").val();
                                    // dayOfWeek=$("#day_of_week").val();
                                }
                                if(data.data[0].schedule_crontype == '3'){//每日
                                    viewModel.hourOfDayVal(data.data[0].hour_of_day);
                                    viewModel.minuteOfDayVal(data.data[0].minute_of_day);
                                    // hourOfDay=$("#hour_of_day").val();
                                    // minuteOfHour=$("#minute_of_day").val();
                                }
                            }
                        }
                    },
                    error: ncrd.commonAjaxError
                });
            }
        }
        // 保存按钮单击事件
        viewModel.btnSaveClick = function() {
            if (onCloseCallback.save) {
                //var autoTaskId=viewModel.taskIdVal();
                var autoTaskId=$("#task_id").val();
                //if(autoTaskId==null){//新增
                if(isNull(autoTaskId)){//新增
                    autoTaskId="";
                }
                var autoTaskCode=viewModel.taskCodeVal();
                var autoTaskName=viewModel.taskNameVal();
                var autoTaskBean= viewModel.taskBeanVal();
                var autoTaskType=viewModel.taskTypeVal();
                var autoTaskParam=viewModel.taskParamVal();
                //var sysId=viewModel.sysIdVal();
                var sysId=$("#sys_app").val();
                var startDate="";
                var endDate="";
                var runTimes="";
                var taskInterval="";
                var scheduleCronType="";
                var monthOfYear="";
                var dayOfWeek="";
                var dayOfMonth="";
                var hourOfDay="";
                var minuteOfHour="";
                var create_date="";
                var createDate=$("#create_date").val();
                //var createDate=viewModel.createDateVal();
                if(!isNull(createDate)){
                    create_date=createDate;
                }
                if(viewModel.taskTypeVal()== '1'){//间隔性任务
                    // startDate=viewModel.startDateVal();
                    // endDate=viewModel.endDateVal();
                    // runTimes=viewModel.runTimesVal();
                    // taskInterval=viewModel.taskIntervalVal();
                    startDate=$("#start_date").val();
                    endDate=$("#end_date").val();
                    runTimes=$("#run_time").val();
                    taskInterval=$("#interval_time").val();
                }else {//定期任务
                    scheduleCronType=viewModel.cronTypeVal();
                    if(scheduleCronType == '0'){//每年
                        //monthOfYear=viewModel.monthOfYearVal();
                        // dayOfMonth=viewModel.dayOfYearVal();
                        // hourOfDay=viewModel.hourOfYearVal();
                        // minuteOfHour=viewModel.minuteOfYearVal();
                        monthOfYear=$("#month_of_year").val();
                        dayOfMonth=$("#day_of_year").val();
                        hourOfDay=$("#hour_of_year").val();
                        minuteOfHour=$("#minute_of_year").val();
                    }
                    if(scheduleCronType == '1'){//每月
                        // dayOfMonth=viewModel.dayOfMonthVal();
                        // hourOfDay=viewModel.hourOfMonthVal();
                        // minuteOfHour=viewModel.minuteOfMonthVal();
                        dayOfMonth=$("#day_of_month").val();
                        hourOfDay=$("#hour_of_month").val();
                        minuteOfHour=$("#minute_of_month").val();
                    }
                    if(scheduleCronType == '2'){//每周
                        // hourOfDay=viewModel.hourOfWeekVal();
                        // minuteOfHour=viewModel.minuteOfWeekVal();
                        // dayOfWeek=viewModel.dayOfWeekVal();
                        hourOfDay=$("#hour_of_week").val();
                        minuteOfHour=$("#minute_of_week").val();
                        dayOfWeek=$("#day_of_week").val();
                    }
                    if(scheduleCronType == '3'){//每日
                        // hourOfDay=viewModel.hourOfDayVal();
                        // minuteOfHour=viewModel.minuteOfDayVal();
                        hourOfDay=$("#hour_of_day").val();
                        minuteOfHour=$("#minute_of_day").val();
                    }
                }
                var data={
                    "autotask_id" : autoTaskId,
                    "autotask_code" : autoTaskCode,
                    "autotask_name" : autoTaskName,
                    "autotask_bean" : autoTaskBean,
                    "autotask_type" : autoTaskType,
                    "autotask_param" : autoTaskParam,
                    "sys_id" : sysId,
                    "start_date" : startDate+" 00:00:00",
                    "end_date" : endDate+" 00:00:00",
                    "run_times" : runTimes,
                    "taskinterval" : taskInterval,
                    "schedule_crontype" : scheduleCronType,
                    "month_of_year" : monthOfYear,
                    "day_of_week" : dayOfWeek,
                    "day_of_month" : dayOfMonth,
                    "hour_of_day" : hourOfDay,
                    "minute_of_day" : minuteOfHour,
                    // "task_status" : "",
                    "create_date" : create_date
                }
                var flag=true;
                if(autoTaskId==''){//新增
                	flag=checkTaskCode(autoTaskCode,treeData);
                }else{
                	flag=checkCode(taskCodeBefore, autoTaskCode, treeData);
                }
                if(flag && autoTaskType=='1'){
                    flag=checkDate(startDate,endDate) && checkRunTimesAndInterVal(runTimes,taskInterval);
                }
                if( flag &&  checkNameAndBean(autoTaskName,autoTaskBean)){//校验
                    $.ajax({
                        type : 'POST',
                        url : SAVE_OR_UPDATE_URL + '?tokenid=' + tokenid + '&ajax='+'noCache',
                        data : JSON.stringify(data),
                        //data: data,
                        contentType : 'application/json',
                        dataType : 'json',
                        cache: false,
                        success : function(map) {
                            if (map.errorCode == "0") {
                                // alert("保存成功");
                                ip.ipInfoJump("保存成功！","success");
                                onCloseCallback.save(data);
                            } else {
                                // alert("保存失败");
                                ip.ipInfoJump("保存失败！","info");
                            }
                        }
                    });
                }
            }
        }
        // 关闭按钮单击事件
        viewModel.btnCloseClick = function() {
            if (onCloseCallback.cancel) {
                onCloseCallback.cancel();
            }
        };
        function init(container) {
            u.createApp({
                el : container,
                model : viewModel
            });
            clearVal();
            initModule();//初始化模块
            typeDisableFun('1');//初始化
            initTimeSelect();
            //定期任务 radio 点击事件
            $('input:radio').click(function(){
                var radioVal=$('input:radio[name="radioOptions"]:checked').val();
                viewModel.cronTypeVal(radioVal);
                radioDisableFun(radioVal);
                //alert(viewModel.cronTypeVal());
            });
            $('#TimingManagerEdit').modal({backdrop: 'static'});
        }
       // init();

        return {
               'model' : viewModel,
               'template' : template,
               'init' : init,
               'show' : show
           };
    });

