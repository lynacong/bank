//全局命名空间

/**
 * @class Lfw 
 */
var Lfw = {};

(function(){
    
	var enumerables = true,enumerablesTest = {toString: 1},toString = Object.prototype.toString;
		
    for (i in enumerablesTest) {
        enumerables = null;
    }
    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
                       'toLocaleString', 'toString', 'constructor'];
    }
    Lfw.enumerables = enumerables;
	/**
	 * 复制对象属性
	 * 
	 * @param {Object}  目标对象
	 * @param {Object} 源对象
	 */	
    Lfw.apply = function(object, config) {
        if (object && config && typeof config === 'object') {
            var i, j, k;
            for (i in config) {
                object[i] = config[i];
            }
            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }
        return object;
    };
	
    Lfw.apply(Lfw, {
		/**
		* IE浏览器
		*/
		IS_IE:  false,
		/**
		* FirFox浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_FF: false,
		/**
		* OPERA浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_OPERA: false,
		/**
		* CHROME浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_CHROME: false,
		/**
		* SAFARI浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_SAFARI: false,
		/**
		* WEBKIT内核浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_WEBKIT: false,
		/**
		* IE6浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IE6: false,
		/**
		* IE7浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IE7: false,
		/**
		* IE8浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IE8: false,
		/**
		* IE8浏览器,使用兼容模式时也为true
		* @memberOf Lfw
		* @public
		*/
		IS_IE8_CORE: false,
		/**
		* IE9浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IE9: false,
		/**
		* IE9浏览器,使用兼容模式时也为true
		* @memberOf Lfw
		* @public
		*/
		IS_IE9_CORE: false,
		/**
		* IE10浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IE10: false,
		/**
		* IE10以上浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IE10_ABOVE: false,
		/**
		* IE11浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IE11: false,
		/**
		* IOS系统浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IOS: false,
		/**
		* IPHONE浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IPHONE: false,
		/**
		* IPAD浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IPAD: false,
		/**
		* 标准浏览器(firefox, chrome, ie9以上,safari)
		* @memberOf Lfw
		* @public
		*/
		IS_STANDARD: false,
		BROWSER_VERSION: 0    
    });
    
	/**
	 *取浏览器版本信息 
	 */    
	function  getVersion(){
		var userAgent = navigator.userAgent,   
		rMsie = /(msie\s|trident.*rv:)([\w.]+)/,   
		rFirefox = /(firefox)\/([\w.]+)/,   
		rOpera = /(opera).+version\/([\w.]+)/,   
		rChrome = /(chrome)\/([\w.]+)/,   
		rSafari = /version\/([\w.]+).*(safari)/;  
		var browser;  
		var version;  
		var ua = userAgent.toLowerCase();  
		function uaMatch(ua) {  
			var match = rMsie.exec(ua);  
			if (match != null) {  
				return { browser : "IE", version : match[2] || "0" };  
			}  
			var match = rFirefox.exec(ua);  
			if (match != null) {  
				return { browser : match[1] || "", version : match[2] || "0" };  
			}  
			var match = rOpera.exec(ua);  
			if (match != null) {  
				return { browser : match[1] || "", version : match[2] || "0" };  
			}  
			var match = rChrome.exec(ua);  
			if (match != null) {  
				return { browser : match[1] || "", version : match[2] || "0" };  
			}  
			var match = rSafari.exec(ua);  
			if (match != null) {  
				return { browser : match[2] || "", version : match[1] || "0" };  
			}  
			if (match != null) {  
				return { browser : "", version : "0" };  
			}  
		}  
		var browserMatch = uaMatch(userAgent.toLowerCase())||{};  
	//	if (browserMatch.browser) {  
	//		browser = browserMatch.browser;  
	//		version = browserMatch.version;  
	//	} 
		return browserMatch;
	}
	
	var ua = navigator.userAgent.toLowerCase(), s, o = {};
	var version = getVersion();
	if (s=ua.match(/opera.([\d.]+)/)) {
	         Lfw.IS_OPERA = true;
	}else if(version.browser=="IE"&&version.version==11){
		Lfw.IS_IE11 = true;
		 Lfw.IS_IE = true;
	}else if (s=ua.match(/chrome\/([\d.]+)/)) {
	         Lfw.IS_CHROME = true;
	         Lfw.IS_STANDARD = true;
	} else if (s=ua.match(/version\/([\d.]+).*safari/)) {
	         Lfw.IS_SAFARI = true;
	         Lfw.IS_STANDARD = true;
	} else if (s=ua.match(/gecko/)) {
	         //add by licza : support XULRunner  
	         Lfw.IS_FF = true;
	         Lfw.IS_STANDARD = true;
	} else if (s=ua.match(/msie ([\d.]+)/)) {
	         Lfw.IS_IE = true;
	}
	
	/* else if (s=ua.match(/iphone/i)){
	         Lfw.IS_IOS = true;
	         Lfw.IS_IPHONE = true;
	}*/ /*else if (s=ua.match(/ipad/i)){
	         Lfw.IS_IOS = true;
	         Lfw.IS_IPAD = true;
	         Lfw.IS_STANDARD = true;
	}*/ else if (s=ua.match(/firefox\/([\d.]+)/)) {
	         Lfw.IS_FF = true;
	         Lfw.IS_STANDARD = true;
	} /*else if (s=ua.match(/webkit\/([\d.]+)/)) {
	         Lfw.IS_WEBKIT = true;
	} */
	if (ua.match(/webkit\/([\d.]+)/)) {
	         Lfw.IS_WEBKIT = true;
	}
	if (ua.match(/ipad/i)){
	         Lfw.IS_IOS = true;
	         Lfw.IS_IPAD = true;
	         Lfw.IS_STANDARD = true;
	}
	if (ua.match(/iphone/i)){
	         Lfw.IS_IOS = true;
	         Lfw.IS_IPHONE = true;
	}
//	if (s && s[1]) {
//	         Lfw.BROWSER_VERSION = parseFloat( s[1] );
//	} else {
//	         Lfw.BROWSER_VERSION = 0;
//	}
	Lfw.BROWSER_VERSION = version ? (version.version ?  version.version : 0) : 0;
	if (Lfw.IS_IE) {
	         var intVersion = parseInt(Lfw.BROWSER_VERSION);
	         var mode = document.documentMode;
	         if(mode == null){
	                   if (intVersion == 6) {
	                            Lfw.IS_IE6 = true;
	                   } 
	                   else if (intVersion == 7) {
	                            Lfw.IS_IE7 = true;
	                   } 
	                   /*else if (intVersion == 8) {
	                            Lfw.IS_IE8_CORE = true;
	                            Lfw.IS_IE8 = true;
	                   } else if (intVersion == 9) {
	                            Lfw.IS_IE9 = true;
	                            Lfw.IS_IE9_CORE = true;
	                            Lfw.IS_STANDARD = true;
	                   }*/
	         }
	         else{
	                   if(mode == 7){
	                            Lfw.IS_IE7 = true;
	                   }
	                   else if (mode == 8) {
	                            Lfw.IS_IE8 = true;
	                   } 
	                   else if (mode == 9) {
	                            Lfw.IS_IE9 = true;
	                            Lfw.IS_STANDARD = true;
	                   }
	                   else if (mode == 10) {
	                            Lfw.IS_IE10 = true;
	                            Lfw.IS_STANDARD = true;
	                            Lfw.IS_IE10_ABOVE = true;
	                   }
	                   else{
	                            Lfw.IS_STANDARD = true;
	                   }
	                   if (intVersion == 8) {
	                            Lfw.IS_IE8_CORE = true;
	                   } 
	                   else if (intVersion == 9) {
	                            Lfw.IS_IE9_CORE = true;
	                   }
	                   else if(version.version==11){
	                	   Lfw.IS_IE11 = true;
	                   }
	                   else{
	                            
	                   }
	         }
	}
}());
