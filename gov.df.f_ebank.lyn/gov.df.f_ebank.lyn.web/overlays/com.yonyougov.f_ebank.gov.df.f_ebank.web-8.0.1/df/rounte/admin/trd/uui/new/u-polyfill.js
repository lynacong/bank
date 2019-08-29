/** 
 * neoui-kero v3.2.4
 * neoui kero
 * author : [object Object]
 * homepage : https://github.com/iuap-design/neoui-kero#readme
 * bugs : https://github.com/iuap-design/neoui-kero/issues
 **/ 
if(!window.hasJsExtensions){

    window.hasJsExtensions = true;
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s*(\b.*\b|)\s*$/, "$1");
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (obj) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == obj)
                    return i;
            }
            return -1;
        };
    }

    if (!Array.prototype.remove) {
    	Array.prototype.remove = function(index) {
    		if (index < 0 || index > this.length) {
    			alert("index out of bound");
    			return;
    		}
    		this.splice(index, 1);
    	};
    }
    // 遍历数组,执行函数
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fn) {
            for (var i = 0, len = this.length; i < len; i++) {
                fn(this[i], i, this);
            }
        };
    }
    try{
        if(!NodeList.prototype.forEach)
            NodeList.prototype.forEach = Array.prototype.forEach;
    }catch(e){
        
    }
    

        
    function isDomElement(obj) {
        if (window['HTMLElement']) {
            return obj instanceof HTMLElement;
        } else {
            return obj && obj.tagName && obj.nodeType === 1;
        }
    }
    /*IE8的querySelectorAll返回的对象不是Array也不是NodeList，不能调用forEach，因此重写此方法*/
    /* 此处没有IE8标识，因此使用HTMLElement来进行判断*/
    if(!window['HTMLElement']){
        var _querySelectorAll = Element.prototype.querySelectorAll;
        Element.prototype.querySelectorAll = function(selector) {
            var result = _querySelectorAll.call(this,selector);
            if(!isDomElement(this)){
                return result;
            }
            var resArr = [];
            for(var i = 0;i < result.length;i++){
                resArr.push(result[i]);
            }
            return resArr;
        }

        var _docquerySelectorAll = document.querySelectorAll;
        document.querySelectorAll = function(selector) {
            try{
                var result = _docquerySelectorAll.call(this,selector);
                var resArr = [];
                if(result.length > 0){
                    for(var i = 0;i < result.length;i++){
                        resArr.push(result[i]);
                    }
                    return resArr;
                }else{
                    return result;
                }
                
            }catch(e){

            }
            
        }
    }


}

