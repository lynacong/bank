/**
 * 亿信与FAP对应
 */
var ESEN_TO_FASP = {};

ESEN_TO_FASP.m = {
    // 调取凭证
    "voucher": {
        "preview": "/df/sd/pay/common/OCX.html",
        "param":"voucher"
    }
};

// 获取指定参数
ESEN_TO_FASP.getParamsFromUrl = function (key) {
    var url = window.location.search;
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = url.match(reg);
    if (r == null) {
        reg = new RegExp("([?])" + key + "=([^&]*)(&|$)");
        r = url.match(reg);
    }
    return unescape(r[2]) || "";
}

window.onload = function () {
    // ?type=voucher&tokenid=xxx&voucher=1213
    var type = ESEN_TO_FASP.getParamsFromUrl("type");
    var module = ESEN_TO_FASP.m[type];


    var tokenid = "tokenid=" + ESEN_TO_FASP.getParamsFromUrl("tokenid");
    location.href = module["preview"] + "" + tokenid;


    var billNo = ESEN_TO_FASP.getParamsFromUrl("billNo");


    // TODO 参数与title、url对应

    // TODO 页面跳转
    //location.href = "/df/" + "a" + getTokenId();
    alert("aaaa");

};
