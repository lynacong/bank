/**
 * dfp module
 */
;(function ($, window, document, undefined) {

    $.extend({

        dfpModule: {
           menu: function (id, arr) {

           }

        }

    });

    /**
     * 定义
     */
    var menu = {
        baseImgPath: '/df/portal/index/img/menu/',
        // html
        li: '<li id="{0}" class="dfp-module-menu-li"><a href="javascript:void(0);" title="{2}"><img src="{3}">{4}</a></li>',
        _img: {
            ban: ['often-ban.png', 'often-ban-w.png'],
            deng: ['often-deng.png', 'often-deng-w.png'],
            cha: ['often-cha.png', 'often-cha-w.png'],
            wen: ['often-wen.png', 'often-wen-w.png'],
            dan: ['often-dan.png', 'often-dan-w.png']
        },
        img: function (type, num) {
            return this.baseImgPath + this._img[type][num || 0];
        },
        name: {
            ban: '我要支付',
            deng: '我要登记',
            cha: '我要查询',
            wen: '我要咨询',
            dan: '业务单据'
        },
        : ['oftenBan', 'oftenDeng', 'oftenCha', 'oftenWen', 'oftenDocument']

    };


})(jQuery, window, document);


