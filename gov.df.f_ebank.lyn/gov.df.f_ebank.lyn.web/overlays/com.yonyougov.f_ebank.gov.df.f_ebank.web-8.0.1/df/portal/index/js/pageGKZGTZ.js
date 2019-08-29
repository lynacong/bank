/**
 * 国库主管厅长
 */
$(function () {

    // 支出进度情况
    // 查询
    $("#payProgressStatementCheck, #payProgressStatementCheckSelectCancel").on("click", function () {
        $("#payProgressStatementCheckSelect").toggle("normal");
    });
    $("#payProgressStatementCheckSelectSubmit").on("click", function () {
        // TODO 获取全部参数，ajax，重置表格
        alert("payProgressStatementCheckSelectSub....");

        $("#payProgressStatementCheckSelect").toggle("normal");
    });
    // 刷新
    $("#payProgressStatementRefresh").on("click", function () {
        dfpPayProgress.show();
    });
    // 最大化
    $("#payProgressStatementMaxium").on("click", function () {
        dfp_util.maxDiv("payProgressStatement");
    });
    dfpPayProgress.bf();
    dfpPayProgress.show();
    $("#payprogressXSJDValue").html(dfp.progressInYear() + '%');


    // 支出大盘分析
    // 查询
    $("#paymentMarketAnalysisCheck, #paymentMarketAnalysisCheckSelectCancel").on("click", function () {
        $("#paymentMarketAnalysisCheckSelect").toggle("normal");
    });
    $("#paymentMarketAnalysisCheckSelectSubmit").on("click", function () {
        // TODO 获取全部参数，ajax，重置表格
        alert("paymentMarketAnalysisCheckSelectSub...");

    });
    // 刷新
    $("#paymentMarketAnalysisRefresh").on("click", function () {

    });
    // 最大化
    $("#paymentMarketAnalysisMaxium").on("click", function () {
        dfp_util.maxDiv("paymentMarketAnalysis");
    });

    // 支出排名
    // 选择
    $("#paymentRankingSelect").on("change", function () {

    });

    // 支出情况
    // 时间
    $("#paymentStatementStartTime").fdatepicker({
        format: 'yyyy-mm-dd'
    }).val(dfp.datetimeSpe("pp"));
    $("#paymentStatementEndTime").fdatepicker({
        format: 'yyyy-mm-dd'
    }).val(dfp.datetimeSpe("pp"));
    $("#paymentStatementStartTime, #paymentStatementEndTime").on("change", function () {
        $("#paymentStatement").click();
    });
    // 刷新
    $("#paymentStatement").on("click", function () {
        alert("aaa");
    });

});

