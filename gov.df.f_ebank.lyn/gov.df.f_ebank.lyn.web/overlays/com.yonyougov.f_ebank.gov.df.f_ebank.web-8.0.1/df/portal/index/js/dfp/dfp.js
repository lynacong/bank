var dfp = dfp || {};
var dfp_util = dfp_util || {};
var dfp_re = dfp_re || {};

dfp = {
    /**
     * 从当前url中解析出tokenid（按位置）
     */
    tokenid: function () {
        return sessionStorage.getItem("tokenid");
    },
    /**
     * 拼接url，自动加载参数
     * @params url
     * @params [param] 参数字符串 // TODO 考虑增加json解析
     */
    completeUrl: function (url, param) {
        if (param == "" || param == null || param == undefined)
            param = "_x=1";
        if (url == "" || url == null || url == undefined)
            return url;
        url = url.replace(/\s/g, ""); // 去除全部空格
        if (url.indexOf("?") > -1)
            return url + "&" + param;
        if (url.indexOf("?") < 0)
            return url + "?" + param;
    },
    /**
     * 拼接url并加入tokenid参数
     * @params url
     * @params [param] 参数可为空
     */
    fullURL_old: function (url, param) {
        return this.completeUrl(url, param) + "&tokenid=" + this.tokenid();
    },
    /**
     * 序时进度，参数格式 2017/07/07
     */
    progressInYear: function (_time) {
        var _now = _time;
        if (!_time) {
            _now = new Date();
        }
        var firstDay = new Date(_now.getFullYear(), 0, 1);
        var dateDiff = _now - firstDay;
        var msPerDay = 1000 * 60 * 60 * 24;
        // 计算天数
        var passDay = Math.ceil(dateDiff / msPerDay);
        // 今年天数
        var _yearday = 365;
        var _year = 2000 + parseInt(_now.getYear());
        if (((_year % 4) == 0) && ((_year % 100) != 0) || ((_year % 400) == 0)) {
            _yearday += 1;
        }
        // 序时进度
        return ((passDay / _yearday) * 100).toFixed(2); // 两位小数
    },
    /**
     * 获取当前时间
     * @params type pp:支出进度-截止时间
     */
    datetimeSpe: function (type) {
        var SEP_1 = "-";
        var SEP_2 = ":";
        var myDate = new Date();
        var Year = myDate.getFullYear();
        var Month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        Month = Month >= 1 && Month <= 9 ? "0" + Month : Month;
        var Today = myDate.getDate(); //获取当前日(1-31)
        Today = Today >= 1 && Today <= 9 ? "0" + Today : Today;
        var Day = myDate.getDay();
        if ("pp" == type) {
            return Year + SEP_1 + Month + SEP_1 + Today; // 2017-07-22
        }
    },
    /**
     * 获取ls中的公共参数
     * @params options
     * @params [type] 返回类型，默认返回对象：json 返回公共参数的json形式，obj 返回封装后对象
     */
    commonData_old: function (options, type) {
        options = dfp_util.isNull(options) ? {} : options;
        options["ajax"] = "noCache";
        options["tokenid"] = getTokenId();
        options["_t"] = Date.parse(new Date());
        var common_data = JSON.parse(sessionStorage.getItem("commonData"));
        if (type == "json") {
            return common_data;
        }
        for (var i in common_data) {
            if (!common_data.hasOwnProperty(i)) {
                continue;
            }
            options[i] = common_data[i];
        }
        if (type == "obj" || type == null) {
            return options;
        }
        return options;
    },
    pAjaxData: {
        tokenid: function () {
            getTokenId();
        },
        caroleguid: function () {
            dfp_util.base64.encode(sessionStorage.select_role_guid == undefined ? "" : sessionStorage.select_role_guid);
        }
    },
    /**
     * 获取指定ls中指定字段值
     */
    thisFromCommonData: function (name) {
        return (this.commonData({}))[name];
    },
    /**
     * 数字千分位处理，保留2位小数
     */
    num2ThousandBreak: function (value) {
        if (value == 0) {
            return parseFloat(value).toFixed(2);
        }
        if (value != "") {
            var num = "";
            value = parseFloat(value).toFixed(2);
            if (value.indexOf(".") == -1) {
                num = value.replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
                    return s + ',';
                });
            } else {
                num = value.replace(/(\d)(?=(\d{3})+\.)/g, function (s) {
                    return s + ',';
                });
            }
        }
        return num;
    },
    /**
     * 数字千分位处理，保留2位小数
     */
    num2ThousandBreakNoDigit: function (value) {
        if (value == 0) {
            return parseFloat(value).toFixed(0);
        }
        if (value != "") {
            var num = "";
            value = parseFloat(value).toFixed(0);
            if (value.indexOf(".") == -1) {
                num = value.replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
                    return s + ',';
                });
            } else {
                num = value.replace(/(\d)(?=(\d{3})+\.)/g, function (s) {
                    return s + ',';
                });
            }
        }
        return num;
    },
    /**
     * 数字转百分比
     */
    num2Percent: function (num) {
        return (num * 100).toFixed(2) + "%";
    },
    /**
     * 去掉字符串中的数字
     */
    removeNumFromStr: function (str) {
        str = dfp_re.num.removeAll(str);
        str = dfp_re.trim(str);
        return str;
    },
    cookie: function () {

    },

    /**
     * 动态加载js文件
     * @params src js路径
     * @params f 回调函数，例：f = function(){;}，或表达式
     */
    loadJS: function (src, f) {
        var script = document.createElement('script'),
            head = document.getElementsByTagName('head')[0];
        script.type = 'text/javascript';
        script.charset = 'UTF-8';
        script.src = src;
        if (script.addEventListener) {
            script.addEventListener('load', f, false);
        } else if (script.attachEvent) {
            script.attachEvent('onreadystatechange', function () {
                var target = window.event.srcElement;
                if (target.readyState == 'loaded')
                    f;
            });
        }
        head.appendChild(script);
    },
    loadScript: function (src, f) {
        $.getScript(src, f);
    }

};

dfp_util = {
    /**
     * 判断单个变量是否为空
     * // TODO 为空判断需要重做
     */
    isNull: function (param) {
        return param == "" ? true : (param == null ? true : (param == undefined ? true : false));
    },
    /**
     * 判断对象是否为空（只能判断对象，如 {}）
     */
    isObjEmpty: function (obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    },
    /**
     * 判断元素是否在数组内
     */
    isValueInArray: function (arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    },
    /**
     * 判断一个变量是否已获取上文中的值(该值存在sessionStorage中)，如果未获取则等待
     * @params variableName 待判断的变量
     * @params waitTime 等待次数，默认10次
     * @params perTime 每次等待间隔（毫秒），默认100毫秒
     */
    isGetValue: function () {
        var isDfpMenuLv3Ok = setInterval(function () {
            dfp_menu_lv3 = JSON.parse(sessionStorage.getItem("dfp_menu_lv3"));
            if (dfp_menu_lv3 != null && dfp_menu_lv3 != undefined) {
                clearTimeout(isDfpMenuLv3Ok);
            }
        }, 100);
        return JSON.parse(sessionStorage.getItem("dfp_menu_lv3"));
    },
    /**
     * 循环js对象，返回键值对对象
     * @params jobj json对象，字符串需预先转换为json对象
     */
    jobj2kv: function (jobj) {
        var options = {};
        for (var i in jobj) {
            if (!jobj.hasOwnProperty(i)) {
                continue;
            }
            options[i] = jobj[i];
        }
        return options;
    },
    /**
     * 从 ls 中获取指定数据
     * @params lsname ls名
     * @params [type] ls类型：json JSON串，str 普通字符串(默认)
     */
    thisFromLS: function (lsname, type) {
        return type == "json" ? JSON.parse(localStorage.getItem(lsname)) : localStorage.getItem(lsname);
    },

    /**
     * 时间操作
     */
    time: {
        /**
         * 获取客户端时间
         * @params type
         */
        client: function (type) {
            var myDate = new Date();
            if (type == "year") return myDate.getYear(); //获取当前年份(2位)
            if (type == "fullyear") return myDate.getFullYear(); //获取完整的年份(4位,1970-????)
            if (type == "month") return myDate.getMonth(); //获取当前月份(0-11,0代表1月)
            if (type == "day") return myDate.getDate(); //获取当前日(1-31)
            if (type == "xqday") return myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
            if (type == "millitime") return myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
            if (type == "hour") return myDate.getHours(); //获取当前小时数(0-23)
            if (type == "minute") return myDate.getMinutes(); //获取当前分钟数(0-59)
            if (type == "second") return myDate.getSeconds(); //获取当前秒数(0-59)
            if (type == "ms") return myDate.getMilliseconds(); //获取当前毫秒数(0-999)
            if (type == "date") return myDate.toLocaleDateString(); //获取当前日期 eg: google 2017/8/10, ie 2017年8月10日
            if (type == "currenttime") return myDate.toLocaleTimeString(); //获取当前时间 eg: 下午3:59:18
            if (type == "datetime") return myDate.toLocaleString(); //获取日期与时间 eg: 2017/8/10 下午3:59:00
        },
        /**
         * 获取服务器时间
         */
        server: function () {
            // 毫秒数，可用 +1000 与 setInterval 实现数字表
            var centerDate = $.ajax({async: false}).getResponseHeader("Date");
            var _timestamp = Date.parse(centerDate);
            _timestamp = _timestamp.toString().match(/^\d$/) ? _timestamp : new Date().getTime();
            curDate = new Date(_timestamp);
            //_hour = curDate.getHours();
            //_minutes = curDate.getMinutes();
            //_seconds = curDate.getSeconds();
            return curDate;
        }
    },

    /**
     * 浏览器类型
     */
    browser: {
        /**
         * 获取浏览器类型
         */
        type: function () {
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                return "IE";
            }
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            //判断是否Opera浏览器
            if (userAgent.indexOf("Opera") > -1) {
                return "Opera"
            }
            //判断是否Firefox浏览器
            if (userAgent.indexOf("Firefox") > -1) {
                return "FF";
            }
            if (userAgent.indexOf("Chrome") > -1) {
                return "Chrome";
            }
            //判断是否Safari浏览器
            if (userAgent.indexOf("Safari") > -1) {
                return "Safari";
            }
            //判断是否IE浏览器
            if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                return "IE";
            }
        },
        /**
         * 是否为 IE
         */
        isIE: function () {
            return this.type() == "IE" ? true : false;
        }
    },
    /**
     * Base64
     */
    base64: {
        encode: function (data) {
            return Base64.encode(data);
        },
        decode: function (data) {
            return Base64.decode(data);
        }
    },
    /**
     * 获取cookie
     */
    cookie: {
        /**
         * 设置cookie
         * @params [time] 数字类型，有效时间(毫秒)，默认 24*60*60*1000 24小时
         * @params [path] 路径：/，表示cookie能在整个网站下使用(默认); path=/temp，表示cookie只能在temp目录下使用
         */
        set: function (name, val, time, path) {
            time = time == null ? 24 * 60 * 60 * 1000 : time;
            var expires = new Date();
            expires.setTime(expires.getTime() + time);
            //GMT(Greenwich Mean Time)是格林尼治平时，现在的标准时间，协调世界时是UTC
            var _expires = (typeof days) == "string" ? "" : ";expires=" + expires.toUTCString();
            path = ";path=" + (path = path == "" ? "/" : path);
            document.cookie = escape(name) + "=" + escape(val) + _expires + path;
        },
        /**
         * 获取cookie中的值
         */
        get: function (name) {
            //读cookie属性，这将返回文档的所有cookie
            var allcookies = document.cookie;
            //查找名为name的cookie的开始位置，用处理字符串的方式查找到key对应value
            name = escape(name) + "=";
            var pos = allcookies.indexOf(name);
            //如果找到了具有该名字的cookie，那么提取并使用它的值
            if (pos != -1) { //如果pos值为-1则说明搜索"version="失败
                var start = pos + name.length; //cookie值开始的位置
                var end = allcookies.indexOf(";", start); //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
                if (end == -1)
                    end = allcookies.length; //如果end值为-1说明cookie列表里只有一个cookie
                var value = allcookies.substring(start, end); //提取cookie的值
                return (value); //对它解码
            } else { //搜索失败，返回空字符串
                return "";
            }
        },
        /**
         * 移除指定cookie
         */
        remove: function (name, path) {
            var expires = new Date(0);
            path = ";path=" + (path = path == null ? "/" : path);
            document.cookie = escape(name) + "=" + ";expires=" + expires.toUTCString() + path;
        }
    },

    getUrlParameter: function (url, key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        var r = url.match(reg);
        if (r == null) {
            reg = new RegExp("([?])" + key + "=([^&]*)(&|$)");
            r = url.match(reg);
        }
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    },

    maxDiv: function (id) {
        if (id && id.indexOf(".") == 0)
            ;
        else {
            if (id && id.indexOf("#") < 0)
                id = "#" + id;
        }
        var index = layer.open({
            type: 1,
            title: '',
            //skin: 'layui-layer-rim', //加上边框
            area: ['820px', '600px'], //宽高
            content: $(id),
            offset: 'rb',
            closeBtn: 2,
            //maxmin: true,
            yes: function (index) {
                layer.close(index);
            },
            cancel: function (index) {
                layer.close(index);
            }
        });
        layer.full(index);
    },
    maxDiv2: function (url) {
        var index = layer.open({
            type: 2,
            title: '',
            content: url,
            offset: 'rb',
            closeBtn: 2,
            //maxmin: true,
            yes: function (index) {
                layer.close(index);
            },
            cancel: function (index) {
                layer.close(index);
            },
            success: function (layero, index) {
            }
        });
        layer.full(index);
    }
};

/**
 * 引入常用js
 */
// base64
var Base64 = new Base64();

function Base64() {
    this.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    this.encodeUrl = Base64_encodeUrl;
    this.encodeParam = Base64_encodeParam;
    this.encodeUrlAll = Base64_encodeUrl_all;
    this.encode = Base64_encode;
    this.decode = Base64_decode;
    this.unicodetoBytes = Base64_unicodetoBytes;
    this.bytesToUnicode = Base64_bytesToUnicode;
    this.escapeSpecial = Base64_escapeSpecial
}

function Base64_encodeParam(vsParam) {
    var pos = vsParam.indexOf("_APPLUS_STATE");
    if (pos > 0) {
        return vsParam
    }
    return "_APPLUS_STATE=" + this.escapeSpecial(this.encode(vsParam))
}

function Base64_encodeUrl(vsUrl) {
    var pos = vsUrl.indexOf("_APPLUS_STATE");
    if (pos > 0) {
        return vsUrl
    }
    pos = vsUrl.indexOf("?");
    if (pos > 0) {
        var tmp = vsUrl.substring(pos + 1);
        return vsUrl + "&_APPLUS_STATE=" + this.escapeSpecial(this.encode(tmp))
    }
    return vsUrl
}

function Base64_encodeUrl_all(vsUrl) {
    var pos = vsUrl.indexOf("_APPLUS_STATE");
    if (pos > 0) {
        return vsUrl
    }
    pos = vsUrl.indexOf("?");
    if (pos > 0) {
        var tmp = vsUrl.substring(pos + 1);
        return vsUrl.substring(0, pos + 1) + "_APPLUS_STATE=" + this.escapeSpecial(this.encode(tmp))
    }
    return vsUrl
}

function Base64_encode(input) {
    if (input == null || input == "" || input == undefined) {
        return ""
    }
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64
        } else {
            if (isNaN(chr3)) {
                enc4 = 64
            }
        }
        output = output + this.keyStr.charAt(enc1) + this.keyStr.charAt(enc2) + this.keyStr.charAt(enc3) + this.keyStr.charAt(enc4)
    }
    return output
}

function Base64_decode(input) {
    if (input == null || input == "" || input == undefined) {
        return ""
    }
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
        enc1 = this.keyStr.indexOf(input.charAt(i++));
        enc2 = this.keyStr.indexOf(input.charAt(i++));
        enc3 = this.keyStr.indexOf(input.charAt(i++));
        enc4 = this.keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2)
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3)
        }
    }
    output = _utf8_decode(output);
    return output
}

_utf8_encode = function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c)
        } else {
            if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128)
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128)
            }
        }
    }
    return utftext
};
_utf8_decode = function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
            string += String.fromCharCode(c);
            i++
        } else {
            if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3
            }
        }
    }
    return string
};

function Base64_unicodetoBytes(s) {
    var result = new Array();
    if (s == null || s == "") {
        return result
    }
    result.push(255);
    result.push(254);
    for (var i = 0; i < s.length; i++) {
        var c = s.charCodeAt(i).toString(16);
        if (c.length == 1) {
            i = "000" + c
        } else {
            if (c.length == 2) {
                c = "00" + c
            } else {
                if (c.length == 3) {
                    c = "0" + c
                }
            }
        }
        var var1 = parseInt(c.substring(2), 16);
        var var2 = parseInt(c.substring(0, 2), 16);
        result.push(var1);
        result.push(var2)
    }
    return result
}

function Base64_bytesToUnicode(bs) {
    var result = "";
    var offset = 0;
    if (bs.length >= 2 && bs[0] == 255 && bs[1] == 254) {
        offset = 2
    }
    for (var i = offset; i < bs.length; i += 2) {
        var code = bs[i] + (bs[i + 1] << 8);
        result += String.fromCharCode(code)
    }
    return result
}

function Base64_escapeSpecial(value) {
    if ("string" != typeof value) {
        return value
    }
    if (value == null) {
        return null
    }
    value = value.replace(/%/g, "%25");
    value = value.replace(/&/g, "%26");
    value = value.replace(/\//g, "%2F");
    value = value.replace(/:/g, "%3A");
    value = value.replace(/;/g, "%3B");
    value = value.replace(/=/g, "%3D");
    value = value.replace(/\?/g, "%3F");
    value = value.replace(/@/g, "%40");
    value = value.replace(/"/g, "%22");
    value = value.replace(/#/g, "%23");
    value = value.replace(/</g, "%3C");
    value = value.replace(/>/g, "%3E");
    value = value.replace(/\+/g, "%2B");
    value = value.replace(/ /g, "+");
    return value
};
// md5
//!function(){"use strict";function t(t){if(t)c[0]=c[16]=c[1]=c[2]=c[3]=c[4]=c[5]=c[6]=c[7]=c[8]=c[9]=c[10]=c[11]=c[12]=c[13]=c[14]=c[15]=0,this.blocks=c,this.buffer8=i;else if(n){var r=new ArrayBuffer(68);this.buffer8=new Uint8Array(r),this.blocks=new Uint32Array(r)}else this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];this.h0=this.h1=this.h2=this.h3=this.start=this.bytes=0,this.finalized=this.hashed=!1,this.first=!0}var r="object"==typeof window?window:{},e=!r.JS_MD5_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;e&&(r=global);var i,h=!r.JS_MD5_NO_COMMON_JS&&"object"==typeof module&&module.exports,s="function"==typeof define&&define.amd,n=!r.JS_MD5_NO_ARRAY_BUFFER&&"undefined"!=typeof ArrayBuffer,f="0123456789abcdef".split(""),o=[128,32768,8388608,-2147483648],a=[0,8,16,24],u=["hex","array","digest","buffer","arrayBuffer"],c=[];if(n){var p=new ArrayBuffer(68);i=new Uint8Array(p),c=new Uint32Array(p)}var d=function(r){return function(e){return new t(!0).update(e)[r]()}},y=function(){var r=d("hex");e&&(r=l(r)),r.create=function(){return new t},r.update=function(t){return r.create().update(t)};for(var i=0;i<u.length;++i){var h=u[i];r[h]=d(h)}return r},l=function(t){var r=require("crypto"),e=require("buffer").Buffer,i=function(i){if("string"==typeof i)return r.createHash("md5").update(i,"utf8").digest("hex");if(i.constructor===ArrayBuffer)i=new Uint8Array(i);else if(void 0===i.length)return t(i);return r.createHash("md5").update(new e(i)).digest("hex")};return i};t.prototype.update=function(t){if(!this.finalized){var e="string"!=typeof t;e&&t.constructor==r.ArrayBuffer&&(t=new Uint8Array(t));for(var i,h,s=0,f=t.length||0,o=this.blocks,u=this.buffer8;f>s;){if(this.hashed&&(this.hashed=!1,o[0]=o[16],o[16]=o[1]=o[2]=o[3]=o[4]=o[5]=o[6]=o[7]=o[8]=o[9]=o[10]=o[11]=o[12]=o[13]=o[14]=o[15]=0),e)if(n)for(h=this.start;f>s&&64>h;++s)u[h++]=t[s];else for(h=this.start;f>s&&64>h;++s)o[h>>2]|=t[s]<<a[3&h++];else if(n)for(h=this.start;f>s&&64>h;++s)i=t.charCodeAt(s),128>i?u[h++]=i:2048>i?(u[h++]=192|i>>6,u[h++]=128|63&i):55296>i||i>=57344?(u[h++]=224|i>>12,u[h++]=128|i>>6&63,u[h++]=128|63&i):(i=65536+((1023&i)<<10|1023&t.charCodeAt(++s)),u[h++]=240|i>>18,u[h++]=128|i>>12&63,u[h++]=128|i>>6&63,u[h++]=128|63&i);else for(h=this.start;f>s&&64>h;++s)i=t.charCodeAt(s),128>i?o[h>>2]|=i<<a[3&h++]:2048>i?(o[h>>2]|=(192|i>>6)<<a[3&h++],o[h>>2]|=(128|63&i)<<a[3&h++]):55296>i||i>=57344?(o[h>>2]|=(224|i>>12)<<a[3&h++],o[h>>2]|=(128|i>>6&63)<<a[3&h++],o[h>>2]|=(128|63&i)<<a[3&h++]):(i=65536+((1023&i)<<10|1023&t.charCodeAt(++s)),o[h>>2]|=(240|i>>18)<<a[3&h++],o[h>>2]|=(128|i>>12&63)<<a[3&h++],o[h>>2]|=(128|i>>6&63)<<a[3&h++],o[h>>2]|=(128|63&i)<<a[3&h++]);this.lastByteIndex=h,this.bytes+=h-this.start,h>=64?(this.start=h-64,this.hash(),this.hashed=!0):this.start=h}return this}},t.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var t=this.blocks,r=this.lastByteIndex;t[r>>2]|=o[3&r],r>=56&&(this.hashed||this.hash(),t[0]=t[16],t[16]=t[1]=t[2]=t[3]=t[4]=t[5]=t[6]=t[7]=t[8]=t[9]=t[10]=t[11]=t[12]=t[13]=t[14]=t[15]=0),t[14]=this.bytes<<3,this.hash()}},t.prototype.hash=function(){var t,r,e,i,h,s,n=this.blocks;this.first?(t=n[0]-680876937,t=(t<<7|t>>>25)-271733879<<0,i=(-1732584194^2004318071&t)+n[1]-117830708,i=(i<<12|i>>>20)+t<<0,e=(-271733879^i&(-271733879^t))+n[2]-1126478375,e=(e<<17|e>>>15)+i<<0,r=(t^e&(i^t))+n[3]-1316259209,r=(r<<22|r>>>10)+e<<0):(t=this.h0,r=this.h1,e=this.h2,i=this.h3,t+=(i^r&(e^i))+n[0]-680876936,t=(t<<7|t>>>25)+r<<0,i+=(e^t&(r^e))+n[1]-389564586,i=(i<<12|i>>>20)+t<<0,e+=(r^i&(t^r))+n[2]+606105819,e=(e<<17|e>>>15)+i<<0,r+=(t^e&(i^t))+n[3]-1044525330,r=(r<<22|r>>>10)+e<<0),t+=(i^r&(e^i))+n[4]-176418897,t=(t<<7|t>>>25)+r<<0,i+=(e^t&(r^e))+n[5]+1200080426,i=(i<<12|i>>>20)+t<<0,e+=(r^i&(t^r))+n[6]-1473231341,e=(e<<17|e>>>15)+i<<0,r+=(t^e&(i^t))+n[7]-45705983,r=(r<<22|r>>>10)+e<<0,t+=(i^r&(e^i))+n[8]+1770035416,t=(t<<7|t>>>25)+r<<0,i+=(e^t&(r^e))+n[9]-1958414417,i=(i<<12|i>>>20)+t<<0,e+=(r^i&(t^r))+n[10]-42063,e=(e<<17|e>>>15)+i<<0,r+=(t^e&(i^t))+n[11]-1990404162,r=(r<<22|r>>>10)+e<<0,t+=(i^r&(e^i))+n[12]+1804603682,t=(t<<7|t>>>25)+r<<0,i+=(e^t&(r^e))+n[13]-40341101,i=(i<<12|i>>>20)+t<<0,e+=(r^i&(t^r))+n[14]-1502002290,e=(e<<17|e>>>15)+i<<0,r+=(t^e&(i^t))+n[15]+1236535329,r=(r<<22|r>>>10)+e<<0,t+=(e^i&(r^e))+n[1]-165796510,t=(t<<5|t>>>27)+r<<0,i+=(r^e&(t^r))+n[6]-1069501632,i=(i<<9|i>>>23)+t<<0,e+=(t^r&(i^t))+n[11]+643717713,e=(e<<14|e>>>18)+i<<0,r+=(i^t&(e^i))+n[0]-373897302,r=(r<<20|r>>>12)+e<<0,t+=(e^i&(r^e))+n[5]-701558691,t=(t<<5|t>>>27)+r<<0,i+=(r^e&(t^r))+n[10]+38016083,i=(i<<9|i>>>23)+t<<0,e+=(t^r&(i^t))+n[15]-660478335,e=(e<<14|e>>>18)+i<<0,r+=(i^t&(e^i))+n[4]-405537848,r=(r<<20|r>>>12)+e<<0,t+=(e^i&(r^e))+n[9]+568446438,t=(t<<5|t>>>27)+r<<0,i+=(r^e&(t^r))+n[14]-1019803690,i=(i<<9|i>>>23)+t<<0,e+=(t^r&(i^t))+n[3]-187363961,e=(e<<14|e>>>18)+i<<0,r+=(i^t&(e^i))+n[8]+1163531501,r=(r<<20|r>>>12)+e<<0,t+=(e^i&(r^e))+n[13]-1444681467,t=(t<<5|t>>>27)+r<<0,i+=(r^e&(t^r))+n[2]-51403784,i=(i<<9|i>>>23)+t<<0,e+=(t^r&(i^t))+n[7]+1735328473,e=(e<<14|e>>>18)+i<<0,r+=(i^t&(e^i))+n[12]-1926607734,r=(r<<20|r>>>12)+e<<0,h=r^e,t+=(h^i)+n[5]-378558,t=(t<<4|t>>>28)+r<<0,i+=(h^t)+n[8]-2022574463,i=(i<<11|i>>>21)+t<<0,s=i^t,e+=(s^r)+n[11]+1839030562,e=(e<<16|e>>>16)+i<<0,r+=(s^e)+n[14]-35309556,r=(r<<23|r>>>9)+e<<0,h=r^e,t+=(h^i)+n[1]-1530992060,t=(t<<4|t>>>28)+r<<0,i+=(h^t)+n[4]+1272893353,i=(i<<11|i>>>21)+t<<0,s=i^t,e+=(s^r)+n[7]-155497632,e=(e<<16|e>>>16)+i<<0,r+=(s^e)+n[10]-1094730640,r=(r<<23|r>>>9)+e<<0,h=r^e,t+=(h^i)+n[13]+681279174,t=(t<<4|t>>>28)+r<<0,i+=(h^t)+n[0]-358537222,i=(i<<11|i>>>21)+t<<0,s=i^t,e+=(s^r)+n[3]-722521979,e=(e<<16|e>>>16)+i<<0,r+=(s^e)+n[6]+76029189,r=(r<<23|r>>>9)+e<<0,h=r^e,t+=(h^i)+n[9]-640364487,t=(t<<4|t>>>28)+r<<0,i+=(h^t)+n[12]-421815835,i=(i<<11|i>>>21)+t<<0,s=i^t,e+=(s^r)+n[15]+530742520,e=(e<<16|e>>>16)+i<<0,r+=(s^e)+n[2]-995338651,r=(r<<23|r>>>9)+e<<0,t+=(e^(r|~i))+n[0]-198630844,t=(t<<6|t>>>26)+r<<0,i+=(r^(t|~e))+n[7]+1126891415,i=(i<<10|i>>>22)+t<<0,e+=(t^(i|~r))+n[14]-1416354905,e=(e<<15|e>>>17)+i<<0,r+=(i^(e|~t))+n[5]-57434055,r=(r<<21|r>>>11)+e<<0,t+=(e^(r|~i))+n[12]+1700485571,t=(t<<6|t>>>26)+r<<0,i+=(r^(t|~e))+n[3]-1894986606,i=(i<<10|i>>>22)+t<<0,e+=(t^(i|~r))+n[10]-1051523,e=(e<<15|e>>>17)+i<<0,r+=(i^(e|~t))+n[1]-2054922799,r=(r<<21|r>>>11)+e<<0,t+=(e^(r|~i))+n[8]+1873313359,t=(t<<6|t>>>26)+r<<0,i+=(r^(t|~e))+n[15]-30611744,i=(i<<10|i>>>22)+t<<0,e+=(t^(i|~r))+n[6]-1560198380,e=(e<<15|e>>>17)+i<<0,r+=(i^(e|~t))+n[13]+1309151649,r=(r<<21|r>>>11)+e<<0,t+=(e^(r|~i))+n[4]-145523070,t=(t<<6|t>>>26)+r<<0,i+=(r^(t|~e))+n[11]-1120210379,i=(i<<10|i>>>22)+t<<0,e+=(t^(i|~r))+n[2]+718787259,e=(e<<15|e>>>17)+i<<0,r+=(i^(e|~t))+n[9]-343485551,r=(r<<21|r>>>11)+e<<0,this.first?(this.h0=t+1732584193<<0,this.h1=r-271733879<<0,this.h2=e-1732584194<<0,this.h3=i+271733878<<0,this.first=!1):(this.h0=this.h0+t<<0,this.h1=this.h1+r<<0,this.h2=this.h2+e<<0,this.h3=this.h3+i<<0)},t.prototype.hex=function(){this.finalize();var t=this.h0,r=this.h1,e=this.h2,i=this.h3;return f[t>>4&15]+f[15&t]+f[t>>12&15]+f[t>>8&15]+f[t>>20&15]+f[t>>16&15]+f[t>>28&15]+f[t>>24&15]+f[r>>4&15]+f[15&r]+f[r>>12&15]+f[r>>8&15]+f[r>>20&15]+f[r>>16&15]+f[r>>28&15]+f[r>>24&15]+f[e>>4&15]+f[15&e]+f[e>>12&15]+f[e>>8&15]+f[e>>20&15]+f[e>>16&15]+f[e>>28&15]+f[e>>24&15]+f[i>>4&15]+f[15&i]+f[i>>12&15]+f[i>>8&15]+f[i>>20&15]+f[i>>16&15]+f[i>>28&15]+f[i>>24&15]},t.prototype.toString=t.prototype.hex,t.prototype.digest=function(){this.finalize();var t=this.h0,r=this.h1,e=this.h2,i=this.h3;return[255&t,t>>8&255,t>>16&255,t>>24&255,255&r,r>>8&255,r>>16&255,r>>24&255,255&e,e>>8&255,e>>16&255,e>>24&255,255&i,i>>8&255,i>>16&255,i>>24&255]},t.prototype.array=t.prototype.digest,t.prototype.arrayBuffer=function(){this.finalize();var t=new ArrayBuffer(16),r=new Uint32Array(t);return r[0]=this.h0,r[1]=this.h1,r[2]=this.h2,r[3]=this.h3,t},t.prototype.buffer=t.prototype.arrayBuffer;var b=y();h?module.exports=b:(r.md5=b,s&&define(function(){return b}))}();

/**
 * 正则表达式
 */
dfp_re = {
    /**
     * 空格、回车、换行等
     */
    whitespace: "[\\x20\\t\\r\\n\\f]",
    rtrim: new RegExp("^" + this.whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + this.whitespace + "+$", "g"),
    bf: function () {
    },
    /**
     * 去掉首尾空格
     */
    trim: function (text) {
        return text == null ? "" : (text + "").replace(this.rtrim, "");
    },
    /**
     * 去除全部特殊字符
     */
    strim: function (text) {
        return text == null ? "" : (text + "").replace(/[\r\n\t\f]/g, "");
    },
    space: {
        /**
         * 去除全部空格
         */
        removeAll: function (str) {
            return str.replace(/\s/g, "");
        }
    },
    num: {
        /**
         * 去除全部数字
         */
        removeAll: function (str) {
            return str.replace(/^[\d]+/g, "");
        }
    }
};


function whichBrowser() {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return "IE";
    }
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    //判断是否Opera浏览器
    if (userAgent.indexOf("Opera") > -1) {
        return "Opera"
    }
    //判断是否Firefox浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    }
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    }
    //判断是否Safari浏览器
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    }
    //判断是否IE浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }
}

/**
 * 获取tokenid
 */
function getTokenId() {
    return dfp.tokenid();
}

/**
 * fullUrlWithTokenid
 */
function fullUrlWithTokenid(url, param) {
    return dfp.fullURL(url, param);
}


/**
 * 页面类型
 */
dfp.page = function (type) {
    var p = {
        JB: "JB",
        SH: "SH",
        ZGBM: "ZGBM",
        YWCS: "YWCS",
        JZZF: "JZZF",
        GKJB: "GKJB",
        GKLeader: "GKLeader",
        YWPZ: "YWPZ"
    };
    return p[type];
};

/**
 * TODO 各页面模块参数，pgPletId，用于门户查询配置后的菜单等
 */
dfp.pgPletId = function (page, type) {
    var id = {
        JB: {
            ban: "101001001001",
            deng: "101001001002",
            cha: "101001001003",
            wen: "101001001004",
            article: "101001002001",
            dealing: "101001003001"
        },
        SH: {
            ban: "101002001001",
            deng: "101002001002",
            cha: "101002001003",
            wen: "101002001004",
            article: "101002002001",
            dealing: "101003003001"
        },
        YWCS: {
            ban: "101007001001",
            deng: "101007001002",
            cha: "101007001003",
            wen: "101007001004",
            article: "101007002001",
            dealing: "101007003001"
        },
        JZZF: {
            ban: "101004001001",
            deng: "101004001002",
            cha: "101004001003",
            wen: "101004001004",
            article: "101004002001",
            dealing: "101004003001"
        },
        GKLeader: {
            ban: "101005001001",
            deng: "101005001002",
            cha: "101005001003",
            wen: "101005001004",
            article: "101005002001",
            dealing: "101005003001"
        },
        GKJB: {
            ban: "101006001001",
            deng: "101006001002",
            cha: "101006001003",
            wen: "101006001004",
            article: "101006002001",
            dealing: "101006003001"
        },
        ZGBM: {
            ban: "101003001001",
            deng: "101003001002",
            cha: "101003001003",
            wen: "101003001004",
            article: "101003002001",
            dealing: "101003003001"
        }
    };
    return id[page][type];
};

/**
 * 固定初始
 */
dfp.bf = function () {
    // 加载jqueryUI后桥接button插件
    if ($.ui) {
        $.widget.bridge('uibutton', $.ui.button);
    }
};

/**
 * 全部的url
 */
dfp.fullURL = function (url, param) {
    if (param == "" || param == null || param == undefined)
        param = "_x=1";
    url = url.replace(/\s/g, ""); // 去除全部空格
    if (url.indexOf("?") > -1)
        url += "&";
    if (url.indexOf("?") < 0)
        url += "?";
    return url + param + '&tokenid=' + this.tokenid();
};

/**
 * ajax
 * @params op 启动参数
 */
dfp.ajax = function (op) {
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
};

/**
 * 字符串格式化
 * @params s 字符串，eg: a{0}c{1}e{2}g
 * @params [..] 替换的参数，数量>=0
 */
//String.prototype.format = function() {
//	if (arguments.length == 0) return this;
//	for (var s = this, i = 1; i < arguments.length; i++)
//		s = s.replace(new ReRegExp("\\{" + i + "\\}", "g"), arguments[i]);
//	return s;
//};
dfp.strFormat = function () {
    if (arguments.length == 0) return '';
    var s = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        s = s.replace(re, arguments[i]);
    }
    return s;
};

/**
 * 字符串中js方法括号中的参数格式化，eg: '<a href="javascript:testFunc(&quot;'+a+'&quot;,&quot;'+b+'&quot;)"></a>'
 */
dfp.params2Str = function () {
    if (arguments.length == 0) return '';
    var s = '';
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (typeof arg === 'number')
            s += arg + ',';
        if (typeof arg === 'string')
            s += '&quot;' + arg + '&quot;,';
    }
    return s.substr(0, s.length - 1);
};

/**
 * 获取ls中的公共参数
 * @params options
 * @params [type] 返回类型，默认返回对象：json 返回公共参数的json形式，obj 返回封装后对象
 */
dfp.commonData = function (options, type) {
    options = dfp_util.isNull(options) ? {} : options;
    options["ajax"] = "noCache";
    options["tokenid"] = getTokenId();
    options["_t"] = Date.parse(new Date());
    var common_data = JSON.parse(sessionStorage.getItem("commonData"));
    type = type || 'obj';
    if (type == "json") {
        return common_data;
    } else if (type == 'obj') {
        for (var i in common_data) {
            if (!common_data.hasOwnProperty(i)) continue;
            options[i] = common_data[i];
        }
        return options;
    }
};

/**
 * 判断一个变量是否已获取上文中的值(该值存在sessionStorage中)，如果未获取则等待
 * @params waitTime 等待次数，默认10次
 */
dfp.getMenuLv3 = function () {
    var dfp_menu_lv3 = '';
    while (true) {
        dfp_menu_lv3 = JSON.parse(sessionStorage.getItem('dfp_menu_lv3'));
        if (dfp_menu_lv3 != '')
            return dfp_menu_lv3;
    }
};

/**
 * 替换对象中的对应属性值（注：当前最大支持三级）
 * @params o1 原始对象
 * @params o2 传入对象
 * TODO 扩展到无限级
 */
dfp.replaceObjAttr = function (o1, o2) {
    if (!o2) o2 = {};
    $.each(o2, function (i, val) {
        if (typeof val === 'object') {
            $.each(val, function (j, val2) {
                if (typeof val2 == 'object') {
                    $.each(val2, function (k, val3) {
                        o1[i][j][k] = val3;
                    });
                } else {
                    o1[i][j] = val2;
                }
            });
        } else {
            o1[i] = val;
        }
    });
    return o1;
};

/**
 * TODO 主页添加标签页
 */
dfp.addTab = {
    f: 'window.parent.addTabToParent',
    tab: function (name, url) {
    }
};

/**
 * dfp
 */
/**
 * 获取url中指定参数
 */
dfp.getParamFromUrl = function (url, name) {
    if (url === '')
        return '';
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = url.substr(1).match(reg);
    return unescape(r[2]) || '';
};

dfp.page = {
    JB: "JB",
    SH: "SH",
    ZGBM: "ZGBM",
    YWCS: "YWCS",
    JZZF: "JZZF",
    GKJB: "GKJB",
    GKLD: "GKLD",
    GKLeader: "GKLeader",
    YWPZ: "YWPZ"
}
