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
	
	angular.module('activitiModeler').controller('KisBpmReferenceTreeCtrl', [ '$scope', '$modal', '$timeout', '$translate', function($scope, $modal, $timeout, $translate) {

    // Config for the modal window
    var opts = {
        template:  'editor-app/configuration/properties/reference/tree/reference-popup.html?version=' + Date.now(),
        scope: $scope
    };

    // Open the dialog
    $modal(opts);
}]);
})();

(function(){
	'use strict';
	
	angular.module('activitiModeler').controller('KisBpmReferenceTreePopupCtrl', ['$scope', '$q', '$translate', '$http', '$timeout', '$element', function($scope, $q, $translate, $http, $timeout, $element) {
		
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
		$scope.params.treeSelecteds = [];
		//result-grid selected properties
		$scope.resultSelectedProperties = [];
		//result-grid properties
		$scope.refResultData = [];
		if($scope.property.value && $scope.property.value.refResultData){
			
			$scope.refResultData = $scope.property.value.refResultData;
			var zTree = jQuery.fn.zTree.getZTreeObj(jQuery($element.find("ul")[0]));
			
			//begin_选中_2017_04_20
			
			/*jQuery.each($scope.refResultData, function(){
				var codeAndName=this.name;
				var code=codeAndName.split(" ")[0];
				 var treeObj = $.fn.zTree.getZTreeObj("treeref1_zTree");
				   var node =treeObj.getNodesByParam("root", code, null);
				   treeObj.selectNode(node[0]);
				
			});
			  */
			
			//end_选中_2017_04_20
			
			
			
			
		}
		
		$q.all(promises).then(function(results) {
			$scope.translationsRetrieved = true;
			
			var getResultColumnDef = function(field){
				return { 
					field: field.id, 
					displayName: field.displayName,
					width: field.width || 150,
					visible: false,
					groupable: false
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
			
			//reset result grid last show column width
			if(resultWidth < 300){
				$scope.resultColumnDefs[lastResultShowIndex].width = null;
			}
			
			// Config for result-grid
	        $scope.resultGridOptions = {
	            data: 'refResultData',
	            enableRowReordering: true,
	            headerRowHeight: 28,
	            multiSelect: true,
				showSelectionCheckbox : true,
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
					//begin_先清空后增数据_2017-6-15
					$scope.refResultData=[];
					//end_先清空后增数据_2017-6-15
					for(var i = 0; i < len; i++){
						var node = selecteds[i];
						
						var cs = node.getCheckStatus();
						if(!(cs.checked && !cs.half)){
							continue;
						}
						
						/*if(node.getParentNode()){
							var pcs = node.getParentNode().getCheckStatus();
							if(pcs && pcs.checked && !pcs.half){
								continue;
							}							
						}*/
						
						if(node.isParent){
							continue;
						}else{
							
							var len1 = $scope.refResultData.length;
				    		var contains = false;
				    		//begin_先清空后增数据_先注释掉_2017-6-15
					    		/*for(var j = 0; j < len1; j++){
					    			var prop = $scope.refResultData[j];
					    			if(prop.id == node.id||prop.pk==node.id){
					    				contains = true;
					    				break;
					    			}
					    		}先注释掉
					    		
					    		if(!contains){
					    			$scope.refResultData.push(node);
					    		}先注释掉*/
				    		  $scope.refResultData.push(node);
				    		//end_先清空后增数据_先注释掉_2017-6-15
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
    
	    var treeSetting = {/*
			async: {
				enable: true,
				type : 'POST',
				url: KISBPM.URL.getReferenceData($scope.property.dataUrl),
				dataType : 'json',
				contentType: 'application/json',
				otherParam: $scope.property.queryConditions,
				autoParam: [ "id", "name" ],
				dataFilter: dataFilter
			},
			check: {
				enable: $scope.property.multiSelect,
				chkboxType: {"Y":"ps","N":"ps"}
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
		*/
	    		check: {
					enable: true,
					chkboxType: {"Y":"ps","N":"ps"}
				},

				data: {
					simpleData: {
						enable: true,
						idKey: "id",
						pIdKey: "pId"
					}
				},
				view:{
	                showLine:false,
	                selectedMulti:false
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
	
	  //2017-6-14
	    var tokenid = EDITOR.UTIL.getUrlParameter('tokenid');
		$http({method: 'GET', url: KISBPM.URL.getReferenceData($scope.property.dataUrl)+"&tokenid="+tokenid+"&ajax=noCache"}).success(function (data, status, headers, config) {
			
			for(var i=0;i<data.length;i++){
				
				if(data[i].roletype=='0'){
					data[i].isParent=true;
					
				}
			}
			
		    jQuery.fn.zTree.init(jQuery($element.find("ul")[0]),treeSetting, data);
			/*var data_tree_info = jQuery.fn.zTree.getZTreeObj("treeref1_zTree");
			if($scope.refResultData.length!=0){
				for(var j=0;j<$scope.refResultData.length;j++){
					data_tree_info.expandNode($scope.refResultData[j], true, true, true);  
					data_tree_info.selectNode($scope.refResultData[j]);
					
				}
			}*/
			
		     var treeObj = jQuery.fn.zTree.getZTreeObj("treeref1_zTree");
		     if($scope.refResultData.length!=0){
					for(var j=0;j<$scope.refResultData.length;j++){
//						data_tree_info.expandNode($scope.refResultData[j], true, true, true);  
//						data_tree_info.selectNode($scope.refResultData[j]);
						var nodes = treeObj.getNodesByParam("guid", $scope.refResultData[j].guid, null);
					    if(nodes && nodes.length != 0){
					    	treeObj.selectNode(nodes[0]);
					    	treeObj.checkNode(nodes[0], true, true);
					    	treeObj.expandNode(nodes[0], true, true, true);
					    }
						
					}
				}
		});
	    
	    
		/*var zNodes =[
			{name:"root", id:"root", isParent:true}
		];*/
		
		var log, className = "dark",
		startTime = 0, endTime = 0, perCount = 20, perTime = 100;
		
		function dataFilter(treeId, parentNode, responseData){
			if(responseData instanceof Array){
				jQuery.each(responseData, function(){
					if(typeof(this.nodeType) == "string" && "user" == this.nodeType.toLowerCase()){
						this.nocheck = false;
						this.icon = KISBPM.URL.getApplicationPath() + "/fap/wf/s/ztree/zTreeStyle/img/diy/user0.png";
					}
				});
			}
			return responseData;
		}
		
		function beforeExpand(treeId, treeNode) {
			if (!treeNode.isAjaxing) {
				//begin_防止无子集的节点刷新_2017-6-15
				  if(treeNode.children!=undefined){
					  if(!treeNode.children || treeNode.children.length == 0){
							jQuery.fn.zTree.getZTreeObj("treeref1_zTree").setting.async.otherParam.pk = treeNode.pk;
							jQuery.fn.zTree.getZTreeObj("treeref1_zTree").setting.async.otherParam.viewValue = treeNode.viewValue;
							jQuery.fn.zTree.getZTreeObj("treeref1_zTree").setting.async.otherParam.nodeType = treeNode.nodeType;
							jQuery.fn.zTree.getZTreeObj("treeref1_zTree").setting.async.otherParam.orgClass = treeNode.orgClass;
							startTime = new Date();
							treeNode.times = 1;
							ajaxGetNodes(treeNode, "refresh");
						}
				  }
				//end_防止无子集的节点刷新_2017-6-15
				
				
				return true;
			} else {
				alert("zTree 正在下载数据中，请稍后展开节点。。。");
				return false;
			}
		}
		function onAsyncSuccess(event, treeId, treeNode, msg) {
			var zTree = jQuery.fn.zTree.getZTreeObj("treeref1_zTree");
			if (!msg || msg.length == 0) {
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
					treeNode.icon = KISBPM.URL.getApplicationPath() + "/fap/wf/s/ztree/zTreeStyle/img/loading.gif";
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
		
		//var k=jQuery.fn.zTree.init(jQuery($element.find("ul")[0]), setting);
		//alert(k);
		/*treeObj=jQuery.fn.zTree.init(jQuery($element.find("ul")[0]));
		var node =treeObj.getNodesByParam("root","001002006004001");
		treeObj.selectNode(node[0]);*/
	    
	}]);

})();
