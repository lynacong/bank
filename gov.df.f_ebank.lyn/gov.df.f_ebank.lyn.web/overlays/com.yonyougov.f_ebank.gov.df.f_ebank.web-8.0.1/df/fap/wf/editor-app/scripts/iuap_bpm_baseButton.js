
mini.iuapbpm = mini.iuapbpm || {};

mini.iuapbpm.BaseButton = function () {
    mini.iuapbpm.BaseButton.superclass.constructor.apply(this, arguments);
    this.onClick(this._onClick, this);
};

mini.extend(mini.iuapbpm.BaseButton, mini.Button, {
    uiCls: "mini-iuapbasebutton",
    operPackage: "",
    formIds: "",
    beforeSubmitName: "",
    url: "",
    successName: "",
    success: function (data, textStatus, obj) {
        if (typeof (data) == 'string') {
            data = eval('(' + data + ')');
        }
        if (this.successName) {
            eval(this.successName + "(data)");
        } else {
        	if(data.status==1){
        		iuap_bpm_global_tipbox('','提示',data.message,["ok"],'info');
        	}else{
        		iuap_bpm_global_tipbox('','错误',data.message,["ok"],'error');
        	}
        }
    },
    errorName: "",
    error: function (jqXHR, textStatus, errorThrown) {
        if (this.errorName) {
            eval(this.errorName + "(jqXHR)");
        } 
//        else {
//        	iuap_bpm_global_tipbox('','错误','服务器内部异常！',["ok"],'error');
//        }
    },
    setOperPackage: function (a) {
        if (this.operPackage != a) {
            this.operPackage = a;
            this.doUpdate();
        }
    },
    getOperPackage: function () {
        return this.operPackage;
    },
    setFormIds: function (a) {
        if (this.formIds != a) {
            this.formIds = a;
            this.doUpdate();
        }
    },
    getFormIds: function () {
        return this.formIds;
    },
    getBeforeSubmitName: function () {
        return this.beforeSubmitName;
    },
    setBeforeSubmitName: function (a) {
        if (this.beforeSubmitName != a) {
            this.beforeSubmitName = a;
            this.doUpdate();
        }
    },
    setUrl: function (a) {
        if (this.url != a) {
            this.url = a;
            this.doUpdate();
        }
    },
    getUrl: function () {
        return this.url;
    },
    setSuccessName: function (a) {
        this.successName = a;
        this.doUpdate();
    },
    getSuccessName: function () {
        return this.successName;
    },
    setSuccess: function (a) {
        this.success = a;
        this.doUpdate();
    },
    getSuccess: function () {
        return this.success;
    },
    setErrorName: function (a) {
        this.errorName = a;
        this.doUpdate();
    },
    getErrorName: function () {
        return this.errorName;
    },
    setError: function (a) {
        this.error = a;
        this.doUpdate();
    },
    getError: function () {
        return this.error;
    },

    _beforeSubmit: function (obj) {
        if (!obj) {
            obj = {};
        }
        if (this.beforeSubmitName) {
            obj.beforeSubmitResult = eval(this.beforeSubmitName + "()");
        }
        return obj;
    },
    _prepareData: function (obj) {
        if (!obj) {
            obj = {};
        }
        if (this.operPackage) {
            obj.operPackage = this.operPackage;
        }
        if (this.formIds) {
            var formIds = this.formIds.split(",");
            var len = formIds.length;
            for (var i = 0; i < len; i++) {
                var form = new mini.Form("#" + formIds[i]);
                if (form) {
                    obj[formIds[i]] = form.getData();
                }
            }
        }
        return obj;
    },
    _onClick: function (e) {
        var obj = {};

        obj = this._beforeSubmit(obj);

        if (typeof (obj.beforeSubmitResult) == 'boolean' && !obj.beforeSubmitResult) {
            return;
        }

        obj = this._prepareData(obj);
        if (typeof (obj) == 'boolean') {
            if (!obj) {
                return;
            } else {
                obj = {};
            }
        }

        var json = mini.encode(obj);

        this._ajax(this.url, json, this.success, this.error);
    },
    _ajax: function (url, json, success, error) {
        $.ajax({
            url: url,
            type: "post",
            data: json,
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: success,
            error: error,
            successName: this.successName,
            errorName: this.errorName
        });
    },
//    on: function (type, fn, scope) {
//        mini.iuapbpm.BaseButton.superclass.on.call(this, type, fn, scope);
//
//        type = type.toLowerCase();
//        //onclick事件只保留最后一个
//        if ("click" == type) {
//            var event = this._events[type];
//            if (event instanceof Array && event.length > 1) {
//                this._events[type] = [event[event.length - 1]];
//            }
//        }
//
//        return this;
//    },
    getAttrs: function (el) {
        var attrs = mini.iuapbpm.BaseButton.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs, ["operPackage", "formIds", "beforeSubmitName", "url", "successName", "errorName"]);
        return attrs;
    },

    _getValue: function (value, compId, formId) {
        var v = value;

        if (formId && compId) {
            var form = new mini.Form("#" + formId);
            if (form) {
                var data = form.getData();
                v = data[compId];
            }
        }

        if (!v) {
            if (compId) {
                var nuiObj = mini.get(compId);
                if (nuiObj) {
                    v = nuiObj.getValue();
                } else {
                    nuiObj = $("#" + compId);
                    if (nuiObj) {
                        v = nuiObj.val();
                    }
                }
            }
        }

        return v;
    }
});

mini.regClass(mini.iuapbpm.BaseButton, "iuapbasebutton");

