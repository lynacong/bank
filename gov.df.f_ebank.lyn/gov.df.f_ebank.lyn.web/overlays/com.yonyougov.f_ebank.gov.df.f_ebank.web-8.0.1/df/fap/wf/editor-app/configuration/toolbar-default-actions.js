/*
 * Activiti Modeler component part of the Activiti project
 * Copyright 2005-2014 Alfresco Software, Ltd. All rights reserved.
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */
'use strict';

var KISBPM = KISBPM || {};
var update_time;
var modelNmae;
KISBPM.TOOLBAR = {
    ACTIONS: {

        saveModel: function (services) {

            var modal = services.$modal({
                backdrop: true,
                keyboard: true,
                template: 'editor-app/popups/save-model.html?version=' + Date.now(),
                scope: services.$scope
            });
            
        	//services.$scope.save(null);
            
            
            
        },

        undo: function (services) {

            // Get the last commands
            var lastCommands = services.$scope.undoStack.pop();

            if (lastCommands) {
                // Add the commands to the redo stack
                services.$scope.redoStack.push(lastCommands);
                 
                // Force refresh of selection, might be that the undo command
                // impacts properties in the selected item
                if (services.$rootScope && services.$rootScope.forceSelectionRefresh) 
                {
                	services.$rootScope.forceSelectionRefresh = true;
                }
                
                // Rollback every command
                for (var i = lastCommands.length - 1; i >= 0; --i) {
                    lastCommands[i].rollback();
                }
                
                // Update and refresh the canvas
                services.$scope.editor.handleEvents({
                    type: ORYX.CONFIG.EVENT_UNDO_ROLLBACK,
                    commands: lastCommands
                });
                
                // Update
                services.$scope.editor.getCanvas().update();
                services.$scope.editor.updateSelection();
                var s = services.$scope.editor.selection;
                services.$scope.editor.setSelection();
                services.$scope.editor.setSelection(s);
            }
            
            var toggleUndo = false;
            if (services.$scope.undoStack.length > 0)
            {
            	toggleUndo = true;
            	 //刷新按钮
                var toolbarBtnUndo = document.getElementById("toolbar-btn-undo");
       		 	if (services.$scope.undoStack.length == 0 && !toolbarBtnUndo.disabled){
       		 		toolbarBtnUndo.disabled=true ; 
                }
            }
            
            var toggleRedo = false;
            if (services.$scope.redoStack.length > 0)
            {
            	toggleRedo = true;
            }

            if (toggleUndo || toggleRedo) {
                for (var i = 0; i < services.$scope.items.length; i++) {
                    var item = services.$scope.items[i];
                    if (item.action === 'KISBPM.TOOLBAR.ACTIONS.undo') {
                        services.$scope.safeApply(function () {
                            item.enabled = toggleUndo;
                        });
                    }
                    else if (item.action === 'KISBPM.TOOLBAR.ACTIONS.redo') {
                        services.$scope.safeApply(function () {
                            item.enabled = toggleRedo;
                        });
                    }
                }
            }
        },

        redo: function (services) {

            // Get the last commands from the redo stack
            var lastCommands = services.$scope.redoStack.pop();

            if (lastCommands) {
                // Add this commands to the undo stack
                services.$scope.undoStack.push(lastCommands);
                
                // Force refresh of selection, might be that the redo command
                // impacts properties in the selected item
                if (services.$rootScope && services.$rootScope.forceSelectionRefresh) 
                {
                	services.$rootScope.forceSelectionRefresh = true;
                }

                var beforeLen = services.$scope.undoStack.length;
                var redoStack = services.$scope.redoStack;
                // Execute those commands
                lastCommands.each(function (command) {
                    command.execute();
                });

                var afterLen = services.$scope.undoStack.length;
                var len = afterLen - beforeLen;
                for(var i = 0; i < len; i++){
                	services.$scope.undoStack.pop();
                }
                services.$scope.redoStack = redoStack;
                
                // Update and refresh the canvas
                services.$scope.editor.handleEvents({
                    type: ORYX.CONFIG.EVENT_UNDO_EXECUTE,
                    commands: lastCommands
                });

                // Update
                services.$scope.editor.getCanvas().update();
                services.$scope.editor.updateSelection();
            }

            //标识是否可用
            var toggleUndo = false;
            if (services.$scope.undoStack.length > 0) {
                toggleUndo = true;
            }

            var toggleRedo = false;
            if (services.$scope.redoStack.length > 0) {
                toggleRedo = true;
            }

            if (toggleUndo || toggleRedo) {
                for (var i = 0; i < services.$scope.items.length; i++) {
                    var item = services.$scope.items[i];
                    if (item.action === 'KISBPM.TOOLBAR.ACTIONS.undo') {
                        services.$scope.safeApply(function () {
                            item.enabled = toggleUndo;
                        });
                    }
                    else if (item.action === 'KISBPM.TOOLBAR.ACTIONS.redo') {
                        services.$scope.safeApply(function () {
                            item.enabled = toggleRedo;
                        });
                    }
                }
            }
        },

        cut: function (services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxEditPlugin(services.$scope).editCut();
            for (var i = 0; i < services.$scope.items.length; i++) {
                var item = services.$scope.items[i];
                if (item.action === 'KISBPM.TOOLBAR.ACTIONS.paste') {
                    services.$scope.safeApply(function () {
                        item.enabled = true;
                    });
                }
            }
        },

        copy: function (services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxEditPlugin(services.$scope).editCopy();
            for (var i = 0; i < services.$scope.items.length; i++) {
                var item = services.$scope.items[i];
                if (item.action === 'KISBPM.TOOLBAR.ACTIONS.paste') {
                    services.$scope.safeApply(function () {
                        item.enabled = true;
                    });
                }
            }
        },

        paste: function (services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxEditPlugin(services.$scope).editPaste();
        },

        deleteItem: function (services) {
        	var temp=services.$scope.editor.selection;
        	for(var i=0;i<temp.size();i++)
    		{
        		//新增删除退回线的功能_2017_6-9
        		if(temp[i].getStencil()._jsonStencil.title!="顺序流"&&temp[i].getStencil()._jsonStencil.title!="退回流转线"&&temp[i].getStencil()._jsonStencil.title!="关联"&&temp[i].getStencil()._jsonStencil.title.indexOf("边界")==-1)
        			{
		        		for(var j=0;j<temp[i].incoming.size();j++)
		        			services.$scope.editor.selection.push(temp[i].incoming[j]);
		        		for(var k=0;k<temp[i].outgoing.size();k++)
		        			services.$scope.editor.selection.push(temp[i].outgoing[k]);
        			}
        		for(var j=0;j<temp[i].outgoing.size();j++)
        			{
        				if(temp[i].outgoing[j].getStencil()._jsonStencil.title.indexOf("边界")!=-1)
        					{
        						var outcome=temp[i].outgoing[j];
        						for(var k=0;k<outcome.outgoing.size();k++)
        							services.$scope.editor.selection.push(outcome.outgoing[k]);
        					}
        			}
        		if(temp[i].getStencil()._jsonStencil.title.indexOf("边界")!=-1)
        			{
        				for(var k=0;k<temp[i].outgoing.size();k++)
        					services.$scope.editor.selection.push(temp[i].outgoing[k]);
        			}
        		
    		}
            KISBPM.TOOLBAR.ACTIONS._getOryxEditPlugin(services.$scope).editDelete();
        },

        addBendPoint: function (services) {

            var dockerPlugin = KISBPM.TOOLBAR.ACTIONS._getOryxDockerPlugin(services.$scope);

            var enableAdd = !dockerPlugin.enabledAdd();
            dockerPlugin.setEnableAdd(enableAdd);
            if (enableAdd)
            {
            	dockerPlugin.setEnableRemove(false);
            	document.body.style.cursor = 'pointer';
            }
            else
            {
            	document.body.style.cursor = 'default';
            }
        },

        removeBendPoint: function (services) {

            var dockerPlugin = KISBPM.TOOLBAR.ACTIONS._getOryxDockerPlugin(services.$scope);

            var enableRemove = !dockerPlugin.enabledRemove();
            dockerPlugin.setEnableRemove(enableRemove);
            if (enableRemove)
            {
            	dockerPlugin.setEnableAdd(false);
            	document.body.style.cursor = 'pointer';
            }
            else
            {
            	document.body.style.cursor = 'default';
            }
        },

        /**
         * Helper method: fetches the Oryx Edit plugin from the provided scope,
         * if not on the scope, it is created and put on the scope for further use.
         *
         * It's important to reuse the same EditPlugin while the same scope is active,
         * as the clipboard is stored for the whole lifetime of the scope.
         */
        _getOryxEditPlugin: function ($scope) {
            if ($scope.oryxEditPlugin === undefined || $scope.oryxEditPlugin === null) {
                $scope.oryxEditPlugin = new ORYX.Plugins.Edit($scope.editor);
            }
            return $scope.oryxEditPlugin;
        },

        zoomIn: function (services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxViewPlugin(services.$scope).zoom([1.0 + ORYX.CONFIG.ZOOM_OFFSET]);
        },

        zoomOut: function (services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxViewPlugin(services.$scope).zoom([1.0 - ORYX.CONFIG.ZOOM_OFFSET]);
        },
        
        zoomActual: function (services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxViewPlugin(services.$scope).setAFixZoomLevel(1);
        },
        
        zoomFit: function (services) {
        	KISBPM.TOOLBAR.ACTIONS._getOryxViewPlugin(services.$scope).zoomFitToModel();
        },
        
        alignVertical: function (services) {
        	KISBPM.TOOLBAR.ACTIONS._getOryxArrangmentPlugin(services.$scope).alignShapes([ORYX.CONFIG.EDITOR_ALIGN_MIDDLE]);
        },
        
        alignHorizontal: function (services) {
        	KISBPM.TOOLBAR.ACTIONS._getOryxArrangmentPlugin(services.$scope).alignShapes([ORYX.CONFIG.EDITOR_ALIGN_CENTER]);
        },
        
        sameSize: function (services) {
        	KISBPM.TOOLBAR.ACTIONS._getOryxArrangmentPlugin(services.$scope).alignShapes([ORYX.CONFIG.EDITOR_ALIGN_SIZE]);
        },
        
        closeEditor: function(services) {
        	CloseWebPage(update_time,modelNmae);
        },
        
        /**
         * Helper method: fetches the Oryx View plugin from the provided scope,
         * if not on the scope, it is created and put on the scope for further use.
         */
        _getOryxViewPlugin: function ($scope) {
            if ($scope.oryxViewPlugin === undefined || $scope.oryxViewPlugin === null) {
                $scope.oryxViewPlugin = new ORYX.Plugins.View($scope.editor);
            }
            return $scope.oryxViewPlugin;
        },
        
        _getOryxArrangmentPlugin: function ($scope) {
            if ($scope.oryxArrangmentPlugin === undefined || $scope.oryxArrangmentPlugin === null) {
                $scope.oryxArrangmentPlugin = new ORYX.Plugins.Arrangement($scope.editor);
            }
            return $scope.oryxArrangmentPlugin;
        },

        _getOryxDockerPlugin: function ($scope) {
            if ($scope.oryxDockerPlugin === undefined || $scope.oryxDockerPlugin === null) {
                $scope.oryxDockerPlugin = new ORYX.Plugins.AddDocker($scope.editor);
            }
            return $scope.oryxDockerPlugin;
        }
    }
};

/** Custom controller for the save dialog */
var SaveModelCtrl = [ '$rootScope', '$scope', '$http', '$route', '$location',
    function ($rootScope, $scope, $http, $route, $location) {
	
	//弹出框默认不显示
	$scope.visible = false;
    
	var modelMetaData = $scope.editor.getModelMetaData();

    var description = '';
    if (modelMetaData.description) {
    	description = modelMetaData.description;
    }
    
    var saveDialog = { 'name' : modelMetaData.name,
            'description' : description};
    
    $scope.saveDialog = saveDialog;
    
    var json = $scope.editor.getJSON();
    json = JSON.stringify(json);

    var params = {
        modeltype: modelMetaData.model.modelType,
        json_xml: json,
        name: 'model'
    };

    $scope.status = {
        loading: false
    };

    $scope.close = function () {
    	$scope.$hide();
    };

    $scope.saveAndClose = function () {
    	$scope.save(function() {
    		CloseWebPage(update_time,modelNmae);
    	});
    };
    $scope.save = function (successCallback) {

        if (!$scope.saveDialog.name || $scope.saveDialog.name.length == 0) {
            return;
        }
        if($scope.saveDialog.name.length>80)
        {
        	$scope.wain = "名称字段超长！";
        	return;
    	}
        else if($scope.saveDialog.name.length==0)
        {
        	$scope.wain = "名称字段为空！";
        	return;
    	}
        else
    	{
        	$scope.wain ="";
    	}
        modelNmae=$scope.saveDialog.name;
        // Indicator spinner image
        $scope.status = {
        	loading: true
        };
        
        modelMetaData.name = $scope.saveDialog.name;
        modelMetaData.description = $scope.saveDialog.description;

        var json = $scope.editor.getJSON();
        json = JSON.stringify(json);
        
        var selection = $scope.editor.getSelection();
        $scope.editor.setSelection([]);
        
        // Get the serialized svg image source
        var svgClone = $scope.editor.getCanvas().getSVGRepresentation(true);
        $scope.editor.setSelection(selection);
        if ($scope.editor.getCanvas().properties["oryx-showstripableelements"] === false) {
            var stripOutArray = jQuery(svgClone).find(".stripable-element");
            for (var i = stripOutArray.length - 1; i >= 0; i--) {
            	stripOutArray[i].remove();
            }
        }

        // Remove all forced stripable elements
        var stripOutArray = jQuery(svgClone).find(".stripable-element-force");
        for (var i = stripOutArray.length - 1; i >= 0; i--) {
            stripOutArray[i].remove();
        }

        // Parse dom to string
        var svgDOM = DataManager.serialize(svgClone);

        //add by chouhl
        var regex = /url\(\"[^\)]{0,}\"\)/g;
        var result;
        while((result = regex.exec(svgDOM)) != null){
        	var result1 = result[0].replace(/\"/g, "");
        	svgDOM = svgDOM.replace(result[0], result1);
        }
        
        var isFirstCreate=true;
        if(modelMetaData.modelId!=""){
        	isFirstCreate=false;
        }
        
        /**
         *  ptname:modelMetaData.model.properties.multiinstance_maintablename,//table名称
            field:modelMetaData.model.properties.idfield,//字段名称
            code:modelMetaData.model.properties.process_id//编码
         */
        
        function getTokenId () {
        	/*var current_url = location.search;
        	var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,current_url.indexOf("tokenid") + 48);*/
        	var tokenid = EDITOR.UTIL.getUrlParameter('tokenid');
	     	return tokenid;
        	//return tokenid;
        }
        var tokenid = getTokenId();
        
        var params = {
            json_xml: json,
            svg_xml: svgDOM,
            name: $scope.saveDialog.name,//流程名称
            description: $scope.saveDialog.description,
            modelId:modelMetaData.modelId,
            isFirstCreate:isFirstCreate,
            ajax:"noCache",
            tokenid:tokenid
        };

       
        var setting = {};
        // Update
        $http({    method: 'POST',
            data: params,
            ignoreErrors: true,
            headers: {'Accept': 'application/json',
                      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            },
            //url: KISBPM.URL.putModel(modelMetaData.modelId)
            url: KISBPM.URL.putModelInfo()
        
        })

            .success(function (data, status, headers, config) {
            	console.log("流程编号:"+data.proCode);
                var regInfo=null;
                var regnode=null;
                if(data.responseFlag=="false"){
                	$scope.visible = true;
                	if(data.pidError!=null || data.pNameError!=null || data.mtError!=null || data.idfieldError!=null || data.proCharFormatError!=null || data.proNameFormaterror!=null || data.nullError !=null){
                		regInfo = '流程图主信息错误：' + (data.pidError==null?"":data.pidError+" ")+(data.pNameError==null?"":data.pNameError+" ")
                		+(data.mtError==null?"":data.mtError+" ")+(data.idfieldError==null?"":data.idfieldError+" ")+(data.proCharFormatError==null?"":data.proCharFormatError+" ")
                		+(data.proNameFormaterror==null?"":data.proNameFormaterror+" ")+(data.proCodeError==null?"":data.proCodeError)+(data.nullError==null?"":data.nullError)+" \n ";
                		$scope.error=regInfo;
                		console.log('流程图主信息错误：' + data.pidError+" "+data.pNameError+" "+data.mtError+" "+data.idfieldError);
                		$scope.status.loading = false;
                	}
                	if(data.taskMenuError!=null || data.taskRoleError!=null || data.ormError!=null){
                		regnode="节点角色或菜单属性错误："+(data.taskMenuError==null?"":data.taskMenuError+" ")+(data.taskRoleError==null?"":data.taskRoleError+" ")+(data.ormError==null?"":data.ormError);
                		console.log('流程图主信息错误：' + data.taskMenuError+" "+data.taskRoleError);
                		if(regInfo==null){
                			$scope.error=regnode;
                		}else{
                			$scope.error=regInfo+regnode;
                		}
                		
                		$scope.status.loading = false;
                	}
                	//begin_开始节点内部事务提醒主表信息校验_2017-6-15
	                	if(data.StartNodeError!=null){
	                		regnode="开始节点属性错误："+data.StartNodeError;
	                		console.log('开始节点属性错误：' + data.StartNodeError);
	                		if(regInfo==null){
	                			$scope.error=regnode;
	                		}else{
	                			$scope.error=regInfo+regnode;
	                		}
	                		
	                		$scope.status.loading = false;
	                	}
                	//end_开始节点内部事务提醒主表信息校验_2017-6-15
	                	
	                //begin_正反向流转线上规则、参数、监听类校验_2017-10-23
		            if(data.ruleSequenceFlowMonitorClassError != null || data.ruleSequenceFlowMonitorParameterError != null || data.ruleSequenceFlowError != null){
		                regnode="流转线属性错误："+(data.ruleSequenceFlowMonitorClassError==null?"":data.ruleSequenceFlowMonitorClassError+" ")+(data.ruleSequenceFlowMonitorParameterError==null?"":data.ruleSequenceFlowMonitorParameterError+" ")+(data.ruleSequenceFlowError==null?"":data.ruleSequenceFlowError);
		                console.log('流转线属性错误：' +(data.ruleSequenceFlowMonitorClassError==null?"":data.ruleSequenceFlowMonitorClassError+" ")+(data.ruleSequenceFlowMonitorParameterError==null?"":data.ruleSequenceFlowMonitorParameterError+" ")+(data.ruleSequenceFlowError==null?"":data.ruleSequenceFlowError));
		                if(regInfo==null){
		                	$scope.error=regnode;
		                }else{
		                	$scope.error=regInfo+regnode;
		                }
		                $scope.status.loading = false;
		             }
	                //end_正反向流转线上规则、参数、监听类校验_2017-10-23	
	                	
                	if(data.pCodeError!=null){
                		regnode="保存失败："+(data.pCodeError==null?"":data.pCodeError+" ");
                		console.log('保存失败：' + data.pCodeError);
                		if(regInfo==null){
                			$scope.error=regnode;
                		}else{
                			$scope.error=regInfo+regnode;
                		}
                		$scope.status.loading = false;
                	}
                	if(data.isRepeat!=null){
                		regnode="保存失败："+(data.isRepeat==null?"":data.isRepeat+" ");
                		console.log('保存失败：' + data.isRepeat);
                		if(regInfo==null){
                			$scope.error=regnode;
                		}else{
                			$scope.error=regInfo+regnode;
                		}
                		$scope.status.loading = false;
                	}
                }else{
            		$scope.$hide();
            		parent.window.message("保存成功！","success");
            		parent.window.aaa(data.proCode);
            		
            		//重新加载
            		/*var current_url = location.search;
                	var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,current_url.indexOf("tokenid") + 48);
                	$http({
                		method: 'GET',
                		 headers: {'Accept': 'application/json',
                             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                             url:"/df/wf/treePid?tokenid="+tokenid
                		
                	}).success(function (data, status, headers, config){
                		console.log(data);
                		parent.window.aaa();
                		var treeData=window.parent.document.getElementById('treeTest2');;
                		console.log(treeData);
                		var tree= parent.document.getElementById("tree2");
                		var zTreeNodes = [
                		      		{"wf_code":1, "zpid":0, "name":"test1"},
                		      		{"wf_code":11, "zpid":1, "name":"test11"},
                		      		{"wf_code":12, "zpid":1, "name":"test12"},
                		      		{"wf_code":111, "zpid":11, "name":"test111"}
                		      	];
        				zTreeObj = $.fn.zTree.init(tree, setting, zTreeNodes);
                		
                	});*/
                	
                	
            		
            		
            	}
             })
            .error(function (data, status, headers, config) {
            	$scope.error=data.error;
            });
    };

}];
function ajax(options) {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || "json";
    var params = formatParams(options.data);

    //创建 - 非IE6 - 第一步
    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    } else { //IE6及其以下版本浏览器
        var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    //接收 - 第三步
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var status = xhr.status;
            if (status >= 200 && status < 300) {
                options.success && options.success(xhr.responseText, xhr.responseXML);
            } else {
                options.fail && options.fail(status);
            }
        }
    }

    //连接 和 发送 - 第二步
    if (options.type == "GET") {
        xhr.open("GET", options.url + "?" + params, false);
        xhr.send(null);
    } else if (options.type == "POST") {
        xhr.open("POST", options.url, false);
        //设置表单提交时的内容类型
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);
    }
}
//格式化参数
function formatParams(data) {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace(".",""));
    return arr.join("&");
}
function CloseWebPage(update_time,modelName){
	 if (navigator.userAgent.indexOf("MSIE") > 0) {
	  if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
	   window.opener = null;
	   window.close();
	  } else {
	   window.open('', '_top');
	   window.top.close();
	  }
	 }
	 else if (navigator.userAgent.indexOf("Firefox") > 0) {
	  window.open('', '_parent', '');
	  window.close();
	 }
	 else{
		 window.opener=null;
		 window.open('', '_self');
		  window.close();
	 }
	}
