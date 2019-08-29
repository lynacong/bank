/**
 * dfp options 门户设置
 */
// ;(function ($, window, document, undefined) {
//     $.extend({
//         djehuhnafchuen23789: {}
//     });
//     var dfp = {
//         o: {
//             tokenid: "tokenid",
//             commonData: "commonData"
//         }
//     };
//     dfp.fn = $.prototype;
// })(jQuery, window, document);

var
    root = this,
    debugState = false,
    debugStyle = 'font-weight: bold; color: #00f;',
    debugStyle_green = 'font-weight: bold; font-style:italic; color: #46C246;',
    debugStyle_red = 'font-weight: bold; color: #ed1c24;',
    debugStyle_warning = 'background-color:yellow',
    debugStyle_success = 'background-color:green; font-weight:bold; color:#fff;',
    debugStyle_error = 'background-color:#ed1c24; font-weight:bold; color:#fff;'

;

var dfpOption = {};
/**
 * menu
 */
dfpOption.menu = {
    name1: ['我要办', '我要登', '我要查', '我要问', '我的单据'],
    id1: [],
    img1: [],
    name2: ['我要支付', '我要登记', '我要查询', '我要咨询', '业务单据'],
    id2: ['oftenBan', 'oftenDeng', 'oftenCha', 'oftenWen', 'oftenDocument'],
    img2: []
};
/**
 * article
 */
dfpOption.article = {
    id: {
        main: 'article'
        , refresh: 'articleRefresh'
        , content: 'articleContent'
    }
};
