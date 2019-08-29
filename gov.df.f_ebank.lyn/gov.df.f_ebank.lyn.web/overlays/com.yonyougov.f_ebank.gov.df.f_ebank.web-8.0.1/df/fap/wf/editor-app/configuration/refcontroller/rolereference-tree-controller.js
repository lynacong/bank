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

/*
 * Reference Properties
 */
(function(){
	'use strict';
	
	angular.module('activitiModeler').controller('KisBpmRoleReferenceTreeCtrl', [ '$scope', '$modal', '$timeout', '$translate', function($scope, $modal, $timeout, $translate) {

    // Config for the modal window
    var opts = {
        template:  'editor-app/configuration/properties/reference/roletree/reference-popup.html?version=' + Date.now(),
        scope: $scope
    };

    // Open the dialog
    $modal(opts);
}]);
})();

(function(){
	'use strict';
	
	angular.module('activitiModeler').controller('KisBpmRoleReferenceTreePopupCtrl', ['$scope', '$q', '$translate', '$http', '$timeout', '$element', function($scope, $q, $translate, $http, $timeout, $element) {
		
		var refFields = $scope.property.fields;
		var promises = [];
		var len = refFields.length;
		for(var i = 0; i < len; i++){
			promises[i] = $translate(refFields[i].i18n);
			if(refFields[i].pkField){
				$scope.property.pkField = refFields[i].id;
			}
			if(refFields[i].returnField){
				$scope.property.returnField = refFields[i].id;
			}
		}
		if(!$scope.property.pkField && len > 0){
			$scope.property.pkField = promises[0].field;
		}
		if(!$scope.property.returnField && len > 1){
			$scope.property.returnField = promises[1].field;
		}
		
		$scope.translationsRetrieved = false;
		$scope.params = {};
		//result-grid selected properties
		$scope.resultSelectedProperties = [];
		//result-grid properties
		$scope.refResultData = [];
		if($scope.property.value && $scope.property.value.refResultData){
			$scope.refResultData = $scope.property.value.refResultData.clone();
			var modelId=$scope.modelData.modelId;
			var activityId=$scope.selectedItem.propertyGroups[0].items[0].value;
			var path = (window.location+'').split('/'); 
		    var basePath = path[0]+'//'+path[2]+'/'+path[3];
			for(var x=0;x<$scope.refResultData.length;x++){
				$scope.refResultData[x].orgPk="选择限制部门";
				var roleId=$scope.refResultData[x].id;
				$scope.refResultData[x].orgPkname="选择限制部门";
				var refobj=$scope.refResultData[x].orgobj;
				if(refobj!=undefined){
					var ref_len=$scope.refResultData[x].orgobj.length;
					var deptName="";
					for(var m=0;m<ref_len;m++){
						var limitType=$scope.refResultData[x].orgobj[m].dict_id;
							if("101"==limitType){
								deptName+=$scope.refResultData[x].orgobj[m].name+" ";
								
								$scope.refResultData[x].orgPkname=deptName;
							}else{
								//根据limitType查询对应名字
								var url=basePath+"/service/reference/dept_dict/list";
								   ajax({ 
										type : "post", 
										contentType : "application/json;charset=utf-8",
										url : url,
										success : function(result, textStatus) {
											//判断是否是火狐浏览器
											if(typeof(result)=='string'){
												result=eval('('+result+')');
											}
											for(var k=0;k<result.length;k++){
												var dict_id=result[k].dict_id;
												if(dict_id==limitType){
													var dict_value=result[k].dict_value;
													$scope.refResultData[x].orgPkname=dict_value+"...";
												}
											}
										},
										error:function(err, textStatus, errorThrown){
										}
									});
								
							}
					}
					//查询表数据
			 		var url_list=basePath+"/service/reference/role_info/list";
//			 		ajax({ 
//							type : "post", 
//							 async: false, 
//							url : url_list,
//							data: {modelId:modelId,activityId:activityId,roleId:roleId},
//				 			dataType : "json",
//							success : function(result, textStatus) {
//								//判断是否是火狐浏览器
//								if(typeof(result)=='string'){
//									result=eval('('+result+')');
//								}
//								if(result.length>0){
//									var limitType=result[0].limitType;
//									if("101"==limitType){
//										var deptName="";
//										for(var k=0;k<result.length;k++){
//											deptName+=result[k].name+" ";
//										}
//										
//										$scope.refResultData[x].orgPkname=deptName;
//									}else{
//										//根据limitType查询对应名字
//										var url=basePath+"/service/reference/dept_dict/list";
//										   ajax({ 
//												type : "post", 
//												contentType : "application/json;charset=utf-8",
//												url : url,
//												success : function(result, textStatus) {
//													//判断是否是火狐浏览器
//													if(typeof(result)=='string'){
//														result=eval('('+result+')');
//													}
//													for(var k=0;k<result.length;k++){
//														var dict_id=result[k].dict_id;
//														if(dict_id==limitType){
//															var dict_value=result[k].dict_value;
//															$scope.refResultData[x].orgPkname=dict_value+"...";
//														}
//													}
//												},
//												error:function(err, textStatus, errorThrown){
//												}
//											});
//										
//									}
//									
//								}else{
//									$scope.refResultData[x].orgPkname="选择限制部门";
//								}
//							},
//							error:function(err, textStatus, errorThrown){
//							}
//						});
				}
				
				
		    	
				
			}
			
		}
		
		$q.all(promises).then(function(results) {
			$scope.translationsRetrieved = true;
			
			var getResultColumnDef = function(field){
				return { 
					field: field.id, 
					displayName: field.displayName,
					width: 149,
					visible: false,
					groupable: false,
					cellTemplate:field.cellTemplate
				};
	    	}
        
	        $scope.resultColumnDefs = [];
	        
	        var resultWidth = 0;
	        
	        var lastResultShowIndex = -1;
			var len = results.length;
			for(var i = 0; i < len; i++){
				$scope.property.fields[i].displayName = $scope.property.fields[i].displayName || results[i];
				
				$scope.resultColumnDefs[i] = getResultColumnDef($scope.property.fields[i]);
				
				if($scope.property.fields[i].resultField){
					$scope.resultColumnDefs[i].visible = true;
					resultWidth += $scope.resultColumnDefs[i].width;
					lastResultShowIndex = i;
				}
			}
			
			var resultColumn = getResultColumnDef({id:'orgPk',displayName:'部门',	cellTemplate:'<div class=\"ngCellText\"><a href="" class="selectedDept" title="" ng-mouseover="showSelectedDept(row)" ng-click= "loadById(row)">{{row.getProperty(col.field)}}</a></div>'});
				resultColumn.visible = true;
				$scope.resultColumnDefs.push(resultColumn);
				$scope.showSelectedDept=function(row){
//					var selectedDept=document.getElementById("selectedDept");
					var selectedDept=document.getElementsByClassName("selectedDept");
					var dept=selectedDept[row.rowIndex];
					dept.title=row.selectionProvider.selectedItems[0].orgPkname;
				}
				$scope.loadById=function(row){
					var modelId=$scope.modelData.modelId;
//					var modelId=$scope.selectedItem.properties[0].value;
					var activityId=$scope.selectedItem.propertyGroups[0].items[0].value;
					var viewValue=$scope.property.queryConditions.viewValue;
					var roleId=row.selectionProvider.selectedItems[0].role_id;
					var roleName=row.selectionProvider.selectedItems[0].role_name;
					var url='editor-app/reference-popup-dept2.html?modelId='+modelId+'&activityId='+activityId+'&roleId='+roleId+'&roleName='+roleName+"&viewValue="+viewValue;
					var html='<Iframe src='+url+' width="100%" height="100%" scrolling="[OPTION]" frameborder="x" name="content"></iframe>';
					var mydiv = document.getElementById("selectDept");
					mydiv.innerHTML=html;
					mydiv.style.top="30px";
					mydiv.style.left="100px";
					mydiv.style.width="600px";
					mydiv.style.height="500px";
					mydiv.style.visibility = "visible"; 
				  };
			
			// Config for result-grid
	        $scope.resultGridOptions = {
	            data: 'refResultData',
	            enableRowReordering: true,
	            headerRowHeight: 28,
	            multiSelect: true,
				showSelectionCheckbox : false,
	            keepLastSelected : false,
	            selectedItems: $scope.resultSelectedProperties,
	            
				showFooter: false,
							
	            columnDefs: $scope.resultColumnDefs,
	            
	             i18n: "zh-cn"
	        };
	        
		}, function(e){
    		alert('Translate Error,do not have i18n code : ' + e);
    	});
		
        // Click handler for add button
	    $scope.addProperty = function() {
	    	var selecteds = $scope.params.treeSelecteds;
	    	if(selecteds instanceof Array){
	    		var len = selecteds.length; 
				if (len > 0) {
					for(var i = 0; i < len; i++){
						selecteds[i].orgPk="选择限制部门";
						var modelValue = selecteds[i];
						
						var rule=null;
		        		if(document.getElementById("parentDept").checked) rule="parentDept";
		        		modelValue.rule=rule;
						
						var len1 = $scope.refResultData.length;
			    		var contains = false;
			    		for(var j = 0; j < len1; j++){
			    			var prop = $scope.refResultData[j];

			    			if(prop.id == modelValue.id||prop.pk==modelValue.id){
			    				contains = true;
			    				break;
			    			}
			    		}
			    		
			    		if(!contains){
			    			$scope.refResultData.push(modelValue);
			    		}
					}
		        }
	    	}
	    };
	
	    // Click handler for remove button
	    $scope.removeProperty = function() {
	    	var prop = $scope.resultSelectedProperties.pop();
	    	while(prop){
	    		var index = $scope.refResultData.indexOf(prop);
	        	if(index > -1){
	        		$scope.refResultData.splice(index, 1);
	        	}
	        	prop = $scope.resultSelectedProperties.pop();
	    	}
	    };
	    
	    // Click handler for update button
	    $scope.updateProperty = function(e) {
//	    	var prop = $scope.resultSelectedProperties.pop();
//	    	$scope.refResultData[0].orgPk="999";
//	    	$scope.refResultData.push(e);
//	    	for(var i=0;i<e.length;i++){
//	    		var roleId=e[i].roleId;
//	    		for(var j=0;j<$scope.refResultData.length;j++){
//	    			var r_id=$scope.refResultData[j].id;
//	    			if(roleId==r_id){
//	    				$scope.refResultData[j].orgPk=e[i].dict_id;
//	    				$scope.refResultData[j].orgobj=e;
//	    				var addProp=$scope.refResultData[j];
//	    				var prop=$scope.refResultData[j];
//	    				while(prop){
//	    					var index=$scope.refResultData.indexOf(prop);
//	    					if(index>-1){
//	    						$scope.refResultData.splice(index,1);
//	    					}
//	    					prop=$scope.refResultData[j];
//	    				}
//	    				setTimeout(function(){$scope.refResultData.push(addProp)},5000)
//	    				
//	    			}
//	    		}
//	    	}
	    	var deptName="";
	    	for(var j=0;j<e.length;j++){
	    		var dict_id=e[j].dict_id;
	    		//根据dict_id查询对应名称
	    		if(dict_id=="101"){
					deptName+=e[j].name+" ";
	    		}else{
	    			//根据dict_id查询对应名字
					var url=basePath+"/service/reference/dept_dict/list";
					   ajax({ 
							type : "post", 
							contentType : "application/json;charset=utf-8",
							url : url,
							success : function(result, textStatus) {
								//判断是否是火狐浏览器
								if(typeof(result)=='string'){
									result=eval('('+result+')');
								}
								for(var k=0;k<result.length;k++){
									var limitType=result[k].dict_id;
									if(dict_id==limitType){
										var dict_value=result[k].dict_value;
										deptName+=dict_value+" ";
									}
								}
							},
							error:function(err, textStatus, errorThrown){
							}
						});
	    		}
	    	}
	    	//e为新选择的部门信息,e所有信息对应的roleId是一样的
	    	for(var i=0;i<$scope.refResultData.length;i++){
	    		//循环数据集，找到e对应的角色信息
	    		var ref_roleId=$scope.refResultData[i].id;
	    		var e_roleId=e[0].roleId;
	    		if(ref_roleId==e_roleId){//如果roleId一样则需要赋值
	    			if(e[0].dict_id==""){
	    				$scope.refResultData[i].orgobj=undefined;
	    				$scope.refResultData[i].orgPkname="";
	    			}else{
	    				$scope.refResultData[i].orgobj=e;
		    			$scope.refResultData[i].orgPkname=deptName;
	    			}
	    		}
	    	}
	    };
	
	    // Click handler for up button
	    $scope.movePropertyUp = function() {
	    	var len = $scope.resultSelectedProperties.length;
	        if (len > 0) {
	        	var start = -1, end = -1;
	        	for(var i = 0; i < len; i++){
	        		var prop = $scope.resultSelectedProperties[i];
	        		var index = $scope.refResultData.indexOf(prop);
	        		if(i == 0){
	        			start = index;
	        			end = index;
	        		}
	        		
	        		if(index < start){
	        			start = index;
	        		}
	        		if(index > end){
	        			end = index;
	        		}
	        	}
	        	
	            if (start != 0) {
	                var pre = $scope.refResultData.splice(start - 1, 1);
	               	
	               	$timeout(function(){
	                    $scope.refResultData.splice(end, 0, pre.pop());
	                }, 100);
	            }
	        }
	    };
	
	    // Click handler for down button
	    $scope.movePropertyDown = function() {
	        var len = $scope.resultSelectedProperties.length;
	        if (len > 0) {
	        	var start = -1, end = -1;
	        	for(var i = 0; i < len; i++){
	        		var prop = $scope.resultSelectedProperties[i];
	        		var index = $scope.refResultData.indexOf(prop);
	        		if(i == 0){
	        			start = index;
	        			end = index;
	        		}
	        		
	        		if(index < start){
	        			start = index;
	        		}
	        		if(index > end){
	        			end = index;
	        		}
	        	}
	        	
	            if (end < $scope.refResultData.length - 1) {
	                var pre = $scope.refResultData.splice(end + 1, 1);
	               	
	               	$timeout(function(){
	                    $scope.refResultData.splice(start, 0, pre.pop());
	                }, 100);
	            }
	        }
	    };
        
	    // Click handler for save button
	    $scope.save = function() {
	    	var path = (window.location+'').split('/'); 
		    var basePath = path[0]+'//'+path[2]+'/'+path[3];
	    	var datastr=window.document.getElementById("deptData").value;
	    	//删除表数据
	 		var url_dl=basePath+"/service/reference/role_info/delete";
//	 		ajax({ 
//	 				type : "post", 
//	 				url : url_dl,
//	 				data: "jsonData="+datastr,
//	 	 			dataType : "json",
//	 				success : function(result, textStatus) {
//	 					//保存
//	 					var url=basePath+"/service/reference/role_info/update";
//	 					ajax({ 
//	 							type : "post", 
//	 							url : url,
//	 							data: "jsonData="+datastr,
//	 				 			dataType : "json",
//	 							success : function(result, textStatus) {
//								
//	 							},
//	 							error:function(err, textStatus, errorThrown){
//	 							}
//	 						});
//	 				},
//	 				error:function(err, textStatus, errorThrown){
//	 				}
//	 			});
	    	if($scope.property.multiSelect){
	    		var len = $scope.refResultData.length; 
				if (len > 0) {
					$scope.property.value = {};
		            $scope.property.value.refResultData = $scope.refResultData;
					$scope.property.value.showValue = '';
					for(var i = 0; i < len; i++){
						if(i > 0){
							$scope.property.value.showValue += ',';
						}
						
						var modelValue = $scope.refResultData[i];
						
						$scope.property.value.showValue += modelValue.name || modelValue.code || modelValue.id;
					}
		        }else{
		        	$scope.property.value = null;
		        }
	    	}else{
	    		var selecteds = $scope.params.treeSelecteds;
		    	var len = selecteds.length; 
				if (len > 0) {
					$scope.property.value = {};
					
					var modelValue = selecteds[0];
					
					$scope.property.value.showValue = modelValue.name || modelValue.code || modelValue.id;
					
					var modelValues = [];
					modelValues.push(modelValue);
					
					$scope.property.value.refResultData = modelValues;
		        } else {
					$scope.property.value = null;
		        }
	    	}
	    	if($scope.property.value!=null)
	    	{
		    	for(var i=0;i<$scope.property.value.refResultData.size();i++)
	    		{
			    	var setting = {
			    			async: {
			    				enable: true,
			    				type : 'POST',
			    				url: KISBPM.URL.getReferenceData($scope.property.dataUrl+"2"),
			    				dataType : 'json',
			    				contentType: 'application/json',
			    				otherParam: $scope.property.value.refResultData[i],
			    				autoParam: $scope.property.value.refResultData,
			    				dataFilter: dataFilter
			    			},
			    			check: {
			    				enable: $scope.property.multiSelect,
			    				chkboxType: {"Y":"s","N":""}
			    			},
			    			data: {
			    				simpleData: {
			    					enable: true
			    				}
			    			},
			    			view: {
			    				expandSpeed: ""
			    			},
			    			callback: {
			    				beforeExpand: beforeExpand,
			    				onAsyncSuccess: onAsyncSuccess,
			    				onAsyncError: onAsyncError,
			    				onClick: $scope.property.multiSelect ? null : onClick,
			    				beforeClick: $scope.property.multiSelect ? beforeClick : null,
			    				onCheck: $scope.property.multiSelect ? onCheck : null
			    			}
			    		};
			    	
			    	jQuery.fn.zTree.init(jQuery($element.find("ul")[0]), setting);	
	    		}
	    	}
	        $scope.updatePropertyInModel($scope.property);
	        
	        $scope.close();
	    };
	    
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
	    
	
	    $scope.cancel = function() {
	    	$scope.$hide();
	    	$scope.property.mode = 'read';
	    };
	
	    // Close button handler
	    $scope.close = function() {
	    	$scope.$hide();
	    	$scope.property.mode = 'read';
	    };
	    /*
	    $http.get(KISBPM.URL.getReferenceData($scope.property.dataUrl)).success(function (largeLoad) {
	        $scope.data = largeLoad.results;
	    });*/
    
	    var setting = {
			async: {
				enable: true,
				type : 'POST',
				url: KISBPM.URL.getReferenceData($scope.property.dataUrl),
				dataType : 'json',
				contentType: 'application/json',
				otherParam: $scope.property.queryConditions,
				autoParam: [],
				dataFilter: dataFilter
			},
			check: {
				enable: $scope.property.multiSelect,
				chkboxType: {"Y":"s","N":""}
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			view: {
				expandSpeed: ""
			},
			callback: {
				beforeExpand: beforeExpand,
				onAsyncSuccess: onAsyncSuccess,
				onAsyncError: onAsyncError,
				onClick: $scope.property.multiSelect ? null : onClick,
				beforeClick: $scope.property.multiSelect ? beforeClick : null,
				onCheck: $scope.property.multiSelect ? onCheck : null
			}
		};
	
		var zNodes =[
			{name:"root", id:"root", isParent:true}
		];
		
		var log, className = "dark",
		startTime = 0, endTime = 0, perCount = 20, perTime = 100;
		
		function dataFilter(treeId, parentNode, responseData){
			if(responseData instanceof Array){
				jQuery.each(responseData, function(){
					if("users" == this.objectclass || "USERS" == this.objectclass){
						this.nocheck = false;
						this.icon = KISBPM.URL.getApplicationPath() + "/s/ztree/zTreeStyle/img/diy/user0.png";
					}
				});
			}
			return responseData;
		}
		
		function beforeExpand(treeId, treeNode) {
			if (!treeNode.isAjaxing) {
				if(!treeNode.children || treeNode.children.length == 0){
					jQuery.fn.zTree.getZTreeObj("treeref1_zTree").setting.async.otherParam.pk = treeNode.pk;
					jQuery.fn.zTree.getZTreeObj("treeref1_zTree").setting.async.otherParam.viewValue = treeNode.viewValue;
					jQuery.fn.zTree.getZTreeObj("treeref1_zTree").setting.async.otherParam.nodeType = treeNode.nodeType;
					startTime = new Date();
					treeNode.times = 1;
					ajaxGetNodes(treeNode, "refresh");
				}
				
				return true;
			} else {
				alert("zTree 正在下载数据中，请稍后展开节点。。。");
				return false;
			}
		}
		function onAsyncSuccess(event, treeId, treeNode, msg) {
			var zTree = jQuery.fn.zTree.getZTreeObj("treeref1_zTree");
			if (!(msg instanceof Array && msg.length > 0)) {
				if(treeNode){
					treeNode.icon = "";
					zTree.updateNode(treeNode);
				}
				return;
			}
			var totalCount = 0;
			if(msg[0].totalCount){
				totalCount = msg[0].totalCount;
			}
			if(treeNode){
				if(msg.length == totalCount){
					treeNode.icon = "";
					zTree.updateNode(treeNode);
				}else if (treeNode.children.length < totalCount) {
					setTimeout(function() {ajaxGetNodes(treeNode);}, perTime);
				} else {
					treeNode.icon = "";
					zTree.updateNode(treeNode);
					//zTree.selectNode(treeNode.children[0]);
				}
			}else{
				if(msg.length == totalCount){
					zTree.updateNode(treeNode);
				}else if(zTree.getNodes().length < totalCount){
					setTimeout(function() {ajaxGetNodes(treeNode);}, perTime);
				}else{
					zTree.updateNode(treeNode);
				}
			}
		}
		function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
			var zTree = jQuery.fn.zTree.getZTreeObj("treeref1_zTree");
			alert("异步获取数据出现异常。");
			if(treeNode){
				treeNode.icon = "";
				zTree.updateNode(treeNode);
			}
		}
		function ajaxGetNodes(treeNode, reloadType) {
			var zTree = jQuery.fn.zTree.getZTreeObj("treeref1_zTree");
			if(treeNode){
				if (reloadType == "refresh") {
					treeNode.icon = KISBPM.URL.getApplicationPath() + "/s/ztree/zTreeStyle/img/loading.gif";
					zTree.updateNode(treeNode);
				}
			}
			zTree.reAsyncChildNodes(treeNode, reloadType, true);
		}
		function showLog(str) {
			if (!log) log = jQuery("#log");
			log.append("<li class='"+className+"'>"+str+"</li>");
			if(log.children("li").length > 4) {
				log.get(0).removeChild(log.children("li")[0]);
			}
		}
		function getTime() {
			var now= new Date(),
			h=now.getHours(),
			m=now.getMinutes(),
			s=now.getSeconds(),
			ms=now.getMilliseconds();
			return (h+":"+m+":"+s+ " " +ms);
		}
		
		function onClick(event, treeId, treeNode, clickFlag) {
			if(treeNode && treeNode.canselect){
				if(!$scope.params){
					$scope.params = {};
				}
				$scope.params.treeSelecteds = [];
				$scope.params.treeSelecteds.push(treeNode);
			}
		}
		
		function beforeClick(treeId, treeNode) {
			if(treeNode && treeNode.canselect){
				var zTree = jQuery.fn.zTree.getZTreeObj("treeref1_zTree");
				zTree.checkNode(treeNode, !treeNode.checked, true, true);
			}
			return false;
		}
		
		function onCheck(e, treeId, treeNode) {
			if(treeNode && treeNode.canselect){
				if(!$scope.params){
					$scope.params = {};
				}
				var zTree = jQuery.fn.zTree.getZTreeObj("treeref1_zTree");
				$scope.params.treeSelecteds = zTree.getCheckedNodes();
			}
		}
		
		jQuery.fn.zTree.init(jQuery($element.find("ul")[0]), setting);	
	    
	}]);

})();
