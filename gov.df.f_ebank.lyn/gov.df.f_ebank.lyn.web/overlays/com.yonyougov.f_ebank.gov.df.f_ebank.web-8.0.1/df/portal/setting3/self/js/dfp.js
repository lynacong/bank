;(function ($, window, document, undefined) {

    // noinspection JSAnnotator
    $.extend({

        dfp: {
            tokenid: function (t) {
                return this.browserStorage(dfp.o.tokenid, t);
            },
            tokenId: function (t) {
                return dfp.o.tokenid + "=" + this.tokenid(t);
            },
            fullUrl: function (u, t) {
                return u + (u.indexOf("?") < u.length ? "&" : "?") + this.tokenId(t);
            },
            /**
             * 获取全部ajax参数
             * @param options
             * @param [type] 类型，json 默认/ obj 类
             */
            commonData: function (options, type) {
                options = this.isNull(options) ? {} : options;
                options["ajax"] = "noCache";
                options["tokenid"] = this.tokenid();
                options["_t"] = this.randomData();
                var common_data = JSON.parse(this.browserStorage(this.fn.o.commandData));
                for (var i in common_data) {
                    if (!common_data.hasOwnProperty(i)) {
                        continue;
                    }
                    options[i] = common_data[i];
                }
                return !type || type.toLowerCase() === "json" ? JSON.stringify(options) : options;
            },
            /**
             * 获取浏览器存储
             * @params [type] 存储类型，s sessionStorage(默认)/ l localStorage
             */
            browserStorage: function (key, type) {
                if (!type || type === "s")
                    return sessionStorage.getItem(key);
                if (type === "l")
                    return localStorage.getItem(key);
                return "";
            },
            isNull: function (val) {
                return (val === null || val === "" || val === undefined);
            },
            /**
             * TODO 获取随机数
             * @param [type]
             * @returns {*}
             */
            randomData: function (type) {
                if (!type)
                    return Date.parse(new Date());
                return "";
            },
            /**
             * ajax
             */
            ajax: function (op) {
                $.ajax({
                    url: op['url'],
                    type: (op['type'] || 'GET').toUpperCase(),
                    data: op['data'] || {},
                    dataType: (op['dataType'] || 'json').toLowerCase(),
                    async: op['async'] !== undefined ? op['async'] : (!0),
                    beforeSend: op['beforeSend'] || function () {
                    },
                    success: op['success'] || function () {
                    },
                    error: op['error'] || function () {
                    }
                });
            },
            /**
             * 字符串格式化
             * @params s 字符串，eg: a{0}c{1}e{2}g
             * @params [..] 替换的参数，数量>=0
             //String.prototype.format = function() {
             //	if (arguments.length == 0) return this;
             //	for (var s = this, i = 1; i < arguments.length; i++)
             //		s = s.replace(new ReRegExp("\\{" + i + "\\}", "g"), arguments[i]);
             //	return s;
             //};
             */
            strFormat: function () {
                if (arguments.length == 0) return '';
                var s = arguments[0];
                for (var i = 1; i < arguments.length; i++) {
                    var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
                    s = s.replace(re, arguments[i]);
                }
                return s;
            },
            /**
             * 组装select-option
             * @params arr [{val:'', name:''},{},..]
             */
            selectOptionsHtml: function (arr) {
                var h = '<option value="{0}">{1}</option>',
                    b = '';
                for (var i in arr) {
                    if (!arr.hasOwnProperty(i)) continue;
                    b += this.strFormat(h, arr[i].val, arr[i].name);
                }
                return b;
            },
            /**
             * str去掉特殊字符
             */
            removeStrSpecial: function (s) {
                //return s.replace(/[\'\"\\\/\b\f\n\r\t]/g, '').replace(/[\@\#\$\%\^\&\*\{\}\:\"\L\<\>\?]/, '');
                //return s.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");
                return s;
            },
            /**
             * str是否为"null"," "...
             */
            isStrNull: function (s) {
                //s = $.trim(this.removeStrSpecial(s));
                //return this.isStrContain(s, "null") > -1 && s.length < 5 ? !0 : !1;
                return s === null || s === "null" || s === undefined ? true : false;
            },
            /**
             * 字符串包含特定字符
             */
            isStrContain: function (s1, s2) {
                return s2.indexOf(s1) > -1 ? true : false;
            }

        }

    });

    /**
     * 定义
     * @type {{o: {tokenid: string, commonData: string}}}
     */
    var dfp = {
        o: {
            tokenid: "tokenid",
            commonData: "commonData"
        }
    };

    dfp.fn = $.prototype;

})(jQuery, window, document);

