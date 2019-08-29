var dfp = dfp || {};
var dfp_util = dfp_util || {};
var dfp_re = dfp_re || {};

dfp = {
    /**
     * 页面类型
     */
    page: {
        JB: "JB",
        SH: "SH",
        ZGBM: "ZGBM",
        YWCS: "YWCS",
        JZZF: "JZZF",
        GKJB: "GKJB",
        GKLD: "GKLD",
        GKLeader: "GKLeader",
        YWPZ: "YWPZ",
        GKZFSH: "GKZFSH",
        GKZFXD: "GKZFXD",
        GKZGTZ: "GKZGTZ",
        GKKJFZ: "GKKJFZ",
        YSC: "YSC",
        YSCZB: "YSCZB" // 预算处-指标页
    },
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
    completeUrlWithTokenid: function (url, param) {
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
    commonData: function (options, type) {
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
     * @deprecated
     * 判断单个变量是否为空
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

    maxDiv: function (id, title) {
        if (id && id.indexOf(".") == 0)
            ;
        else {
            if (id && id.indexOf("#") < 0)
                id = "#" + id;
        }
        var index = layer.open({
            type: 1,
            title: title,
            //skin: 'layui-layer-rim', //加上边框
            //area: ['800px', '600px'], //宽高
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
    maxDiv2: function (url, title) {
        var index = layer.open({
            type: 2,
            title: title,
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
            str = str || '';
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
    return dfp.completeUrlWithTokenid(url, param);
}


/**
 * 获取全部参数并拼接入字符串
 * @params sep 间隔符
 */
dfp.obj2Str = function (sep) {
    sep = sep || '&';
    var common_data = JSON.parse(sessionStorage.getItem("commonData"));
    var s = '';
    $.each(common_data, function (i, val) {
        s += sep + i + '=' + val;
    });
    s += "&tokenid=" + getTokenId();
    return s;
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

dfp.isArrayContain = function (arr, key) {
    for (var i in arr) {
        if (!arr.hasOwnProperty(i)) continue;
        if (arr[i] === key)
            return true;
    }
    return false;
}

// TODO 全局键盘事件
dfp.onkeydown = function (e) {
    var ev = (typeof event != 'undefined') ? window.event : e;
    if (ev.keyCode == 13) { // 回车
        console.log("13 is down --- ");
    }
};

/**
 * TODO 未启用
 * 字符串相似度检测（兼容url），数值越高相似度越高
 */
dfp.strSimilarityDegree = function (s1, s2) {
    // 分别获取url及全部参数对象
    var getUrlAndParams = function (k) {
        var _k = [],
            o = {};
        if (k.indexOf("?") < 0) {
            o = {_url: k};
            return o;
        }
        _k = k.split("?");
        if (_k[1].indexOf("&") > -1) {
            _k[1] = _k[1].split("&")
        }
        for (var i in _k[1]) {
            if (!_k[1].hasOwnProperty(i)) continue;
            var n = _k[1][i].split("=");
            o[n[0]] = n[1];
        }
        return o;
    };
    var _s1 = getUrlAndParams(s1);
    var _s2 = getUrlAndParams(s2);
    // 对比相同key的val，统计单个key.val的相似度
    // 两字符串相似程度，并返回相差字符个数
    var strSimilarity2Number = function (s, t) {
        var n = s.length,
            m = t.length,
            d = []; // 建立数组，比字符长度大一个空间，new int[n+1][m+1]
        var i, j, cost;
        if (n === 0) return m;
        if (m === 0) return n;
        // 赋初值
        // 行
        for (i = 0; i <= n; i++) {
            d[i] = [];
            d[i][0] = i;
        }
        // 列
        for (j = 0; j <= m; j++) {
            d[0][j] = j;
        }
        // 对比记录
        for (i = 1; i <= n; i++) {
            for (j = 1; j <= m; j++) {
                if (s.charAt(i - 1) === t.charAt(j - 1)) {
                    cost = 0;
                } else {
                    cost = 1;
                }
                d[i][j] = Minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
            }
        }
        return d[n][m];
    };
    var Minimum = function (a, b, c) {
        return a < b ? (a < c ? a : c) : (b < c ? b : c);
    };
    // 综合单个url相似度
    var l = 0, d = 0;
    // 对称k.val
    for (var k in _s1) {
        if (!_s1.hasOwnProperty(k)) continue;
        // 保留不对称k
        if (this.isNull(_s1[k]) || this.isNull(_s2[k])) {
            continue;
        }
        l += _s1[k].length > _s2[k].length ? (_s1[k].length || 0) : (_s2[k].length || 0);
        d += strSimilarity2Number(_s1[k], _s2[k]);
        delete _s1[k];
        delete _s2[k];
    }
    // TODO 非对称k.val，暂定非对称k的值长度为1
    for (var _k1 in _s1) {
        if (!_s1.hasOwnProperty(_k1)) continue;
        d += 1;
    }
    for (var _k2 in _s2) {
        if (!_s2.hasOwnProperty(_k2)) continue;
        d += 1;
    }
    // 计算
    return (l - d / l).toFixed(4);
};

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

/**
 * 获取完整url，带tokenid参数和动态可连通IP
 * @param u
 * @param t
 * @returns {string}
 */
dfp.fullUrl = function (u, t) {
    return u + (u.indexOf("?") < u.length ? "&" : "?") + "tokenid=" + dfp.tokenid();
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
 * 字符串格式化
 * @params s 字符串，eg: a{id}c{name}e{age}g
 * @params o 替换的参数对象，{id:1,name:2,age:3}
 */
dfp.strFormat2 = function (s, o) {
    if (arguments.length === 0) return '';
    var keys = Object.keys(o);
    for (var i = 0; i < keys.length; i++) {
        var re = new RegExp('\\{' + keys[i] + '\\}', 'gm');
        s = s.replace(re, o[keys[i]]);
    }
    return s;
};

// ESEN 亿信单点登录
dfp.esen = {};
//dfp.esen.IP = "http://192.168.10.11:8089";
//dfp.esen.back = "/dss-web/ssoLogin/getEsen";
dfp.esen.IP = "http://192.168.10.11:9090";
dfp.esen.back = "/ESEN/showreport.do";
dfp.esen.params = "&calcnow=true&showmenu=FALSE&showparams=FALSE";
dfp.esen.selfURL = {
    "DWJB_TOP": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$M6UURYCO5SAZU2X6NV21PUUEZL68EJQK.rpttpl", // 单位查询
    "YWCS_TOP": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$4030JCNSA1055SU05DS7QYMSUM0UUR3U.rpttpl", // 业务处室查询
    "YWCS_LEFT": "", // 总体进度
    "YWCS_LEFT_TOP": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$VFNWSMMR1U7N59JFJSI6NIIT9LF0FEK6.rpttpl", // 支出规律分析
    "YWCS_LEFT_DOWN_1": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$JILSI6VB5ODLBD2IKU4UR4BNWNIY4TPM.rpttpl", // 支出执行进度（按单位）
    "YWCS_LEFT_DOWN_2": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$L5OX3RKLR2CWZ6N5WATL9R22JI59RPAS.rpttpl", // 支出执行进度（按预算项目）
    "ZGBM_TOP": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$UK4UY80KPFSICDIKUYDUSUSJ8BK11XZF.rpttpl", // 主管部门查询
    "ZGBM_LEFT": "", // 总体进度
    "ZGBM_LEFT_TOP": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$6U44I4BQ0WYFYUMUBMJJPC4W8KUZD5IU.rpttpl", // 支出规律分析
    "ZGBM_LEFT_DOWN_1": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$LVUQRKN4U7M2VLTVYUPSTKILSSVVNBFY.rpttpl", // 支出执行进度（按单位）
    "ZGBM_LEFT_DOWN_2": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$5TLEYT1X261UUCUTLTKS7L452CTXZNSU.rpttpl", // 支出执行进度（按预算项目）
    "YSC_TOP": "", // 预算处查询
    "YSC_LEFT": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$4JU0UFIUK1XPLUUJBDSYUL9XN7JUB3WN.rpttpl",
    "YSCZB_TOP": "", // 预算处指标查询
    "YSCZB_LEFT": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$KTXMUC3SUJYD4BLTECEUYLY5KFTYKNSU.rpttpl",
    "JZZF_TOP": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$U8NUZI0ZPF4ITDI8MYDEYUKZIB817KK9.rpttpl", // 集中支付查询
    "GKCX_TOP": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$U4NTTKCUBPTTUNO4L8IXZTUEP24AUOMK.rpttpl", // 国库查询
    "GKZFSH_DOWN": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$UUCYQNLYE5MUKZRULWZN2AJMLXUKX1UB.rpttpl", // 下
    "GKZFSH_RIGHT": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$JR3S4N8R3OT0K42REU4FDM3W0ERYEBAS.rpttpl", // 右
    "GKZFXD_DOWN_1_1": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$9FNFZV1WNNYL2CDF8UCYUIPW7MFTAU3D.rpttpl", // 本日已清算
    "GKZFXD_DOWN_1_2": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$Y1LLNYQJ2E4TBUN1C1UYFUUZLR174WFS.rpttpl", // 本日已支付未清算
    "GKZFXD_DOWN_1_3": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$ILUC94E6UQLB3T1LQNTYLWZKPWL6JMAU.rpttpl", // 往日已支付未清算
    "GKZFXD_DOWN_1_4": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$CMKVMT2TUUUINBAMCNBSO3RSL1M4S8TC.rpttpl", // 本日已发送银行/银行未支付
    "GKZFXD_DOWN_1_5": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$ZTOU11PLMKDL8Y8T2OY2KLQK5YTNN2AK.rpttpl", // 往日银行滞支
    "GKZFXD_DOWN_2": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$IPOC9UECUQUBRT1PLNT00OCMUWP65FMI.rpttpl", // 库款走势
    "GKZFXD_DOWN_3": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$MT4D2OS7LCPUMUVT9XU9BLLESCTO5IUK.rpttpl", // 支出分析
    "GKZFXD_DOWN_4": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$CPLVPBP7WU1RI7APCNBKIO4D0YP46OL4.rpttpl", // 支出预测
    "GKZFXD_DOWN_5": "resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$D3XISY91CLULJ8W3JRURWZJJTM33UINY.rpttpl" // 异常凭证
};
dfp.esen.url = function (key) {
    this.IP = dfp.ping.IP() || this.IP;
    return this.IP + this.back + "?" + this.selfURL[key] + this.params;
};

/**
 * （原-有后台）多IP-Ping
 * 改：获取当前浏览器地址栏IP
 */
dfp.ping = function () {
    //if (dfp.isNull(dfp.ping.IP())) {
        //var pingLayer = layer.msg('  系统初始化，正在检测可用IP，耗时较长，请稍后……', {
        //    icon: 16
        //    , shade: [0.3,'#ccc']
        //    , zindex: 9999
        //    , time: 999999
        //});
        // $.ajax({
        //     url: '/df/portal/ip/pingAndSwitch.do',
        //     type: 'GET',
        //     data: {tokenid: dfp.tokenid()},
        //     dataType: 'json',
        //     async: false,
        //     success: function(data) {
        //         var urls = data.urls;
        //         if (dfp.isNull(urls) || urls.length == 0) {
        //             alert('缺失有效链接，请刷新或更换网段后重试');
        //         } else {
        //             for (var i in urls) {
        //                 if (!urls.hasOwnProperty(i)) continue;
        //                 sessionStorage.setItem('portal_ip_ping_' + i, urls[i]);
        //             }
        //         }
        //         layer.close(pingLayer);
        //     },
        //     error: function() {
        //         alert('缺失有效链接，请刷新或更换网段后重试');
        //         layer.close(pingLayer);
        //     }
        // });

        // 获取当前浏览器地址栏IP及端口
        sessionStorage.setItem('portal_ip_ping_0', dfp.urlIpPort());
        //layer.close(pingLayer);
        
        // 绑定IP与tokenid
//        $.ajax({
//        	url: "/df/esen/sso/bindTokenidWithIP.do",
//        	type: "GET",
//        	data: {tokenid: getTokenId(), IP: sessionStorage.getItem("portal_ip_ping_0") || ""},
//        	dataType: "json",
//        	success: function(data) {}
//        });
        
    //}
};
dfp.ping.IP = function () {
    return sessionStorage.getItem("portal_ip_ping_0") || "";
};

/**
 * 亿信专用：拦截指定url，并加入指定IP
 */
dfp.ping.addServerIP = function (url) {
    if (url.indexOf(dfp.esen.back) > -1)
        return dfp.ping.IP() + url;
    return url;
};

/**
 * 获取浏览器IP和端口
 * 注：不适用端口号后无内容的url
 * @params port str 端口号
 */
dfp.urlIpPort = function (port) {
    port = port || "9001";
    var lc = window.document.location;
    var u = lc.href,
        p = lc.pathname;
    var _u = u.substring(0, u.indexOf(p));
    return _u.substring(0, _u.length - 4) + port;
};

dfp.isNull = function (s) {
    return (s === null || s === "null" || s === "" || s === undefined);
};

/**
 * TODO 未启用
 * html字符匹配
 */
dfp.htmlCodeToSymbol = function (s) {
    return this.isNull(s) ? "" :
        (function () {
            return s.replace(/&amp;|&#38;/g, "&")
                .replace(/&lt;|&#60;/g, "<")
                .replace(/&gt;|&#62;/g, ">")
                .replace(/&nbsp;|&#160;/g, " ")
                .replace(/&quot;|&#34;/g, "\"")
                .replace(/&#39;/g, "\'")
                .replace(/&iexcl;/g, "?");
        })();
};

/**
 * 模拟<a>
 */
dfp.ele = {
    a: {
        click: function (o) {
            o['href'] = o['href'] || 'javascript:void(0);';
            o['target'] = o['target'] || '_blank';
            var h = "<a href='{href}' target='{target}'/>";
            h = dfp.strFormat2(h, o);
            var $a = $(h);
            $("body").append($a);
            $a[0].click();
            $a.remove();
        }
    }
};

/**
 * 判断js数组是否包含某个值
 * @params arr 数组
 * @params v 待判定值
 */
dfp.isArrayContains = function (arr, v) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === v) {
            return true;
        }
    }
    return false;
};
/**
 * 判断js数组是否包含某个值
 * @params arr 数组
 * @params arr2 待判定数组
 */
dfp.isArrayContainsWithArr = function(arr, arr2) {
	var i = arr.length;
    while (i--) {
    	var j = arr2.length;
    	while (j--) {
    		if (arr[i] === arr2[j]) {
                return true;
            }
    	}
    }
    return false;
};
