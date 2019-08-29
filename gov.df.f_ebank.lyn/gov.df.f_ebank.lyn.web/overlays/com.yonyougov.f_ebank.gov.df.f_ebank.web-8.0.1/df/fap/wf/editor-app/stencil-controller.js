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

angular.module('activitiModeler')
    .controller('StencilController', ['$rootScope', '$scope', '$http', '$modal', '$timeout','$compile', function ($rootScope, $scope, $http, $modal, $timeout,$compile) {

        // Property window toggle state
        $scope.propertyWindowState = {'collapsed': false};

         $scope.$on('to-parent', function(event,data) {
           $scope.selitems=data;

         });


       
        // Add reference to global header-config
        $scope.headerConfig = KISBPM.HEADER_CONFIG;

        $scope.propertyWindowState.toggle = function () {
            $scope.propertyWindowState.collapsed = !$scope.propertyWindowState.collapsed;
            $timeout(function () {
                
            });
        };
        
        // Code that is dependent on an initialised Editor is wrapped in a promise for the editor
        $scope.editorFactory.promise.then(function () {
        	
            /* Build stencil item list */

            // Build simple json representation of stencil set
            var stencilItemGroups = [];

            // Helper method: find a group in an array
            var findGroup = function (name, groupArray) {
                for (var index = 0; index < groupArray.length; index++) {
                    if (groupArray[index].name === name) {
                        return groupArray[index];
                    }
                }
                return null;
            };

            // Helper method: add a new group to an array of groups
            var addGroup = function (groupName, groupArray) {
                var group = { name: groupName, items: [], paletteItems: [], groups: [], visible: true };
                groupArray.push(group);
                return group;
            };

            /*
             StencilSet items
             */
            var innerTableArray;
            $http({method: 'GET', url: KISBPM.URL.getInnerTable()}).success(function (data, status, headers, config) {
											    innerTableArray=data; 
											 });
            $http({method: 'GET', url: KISBPM.URL.getStencilSet()}).success(function (data, status, headers, config) {
            
                //alert(KISBPM.URL.getStencilSet());

            	var quickMenuDefinition = ['ExtUserTask', 'EndNoneEvent', 'ExclusiveGateway', 
            	                           'CatchTimerEvent', 'ThrowNoneEvent', 'TextAnnotation',
            	                           'SequenceFlow', 'Association','SequenceJumpFlow'];
            	var ignoreForPaletteDefinition = ['MessageFlow', 'DataAssociation','DataStore', 'SendTask'];
            	var quickMenuItems = [];
            	
            	var morphRoles = [];
                for (var i = 0; i < data.rules.morphingRules.length; i++) 
                {
                    var role = data.rules.morphingRules[i].role;
                    var roleItem = {'role': role, 'morphOptions': []};
                    morphRoles.push(roleItem);
                }
            	
                // Check all received items
                for (var stencilIndex = 0; stencilIndex < data.stencils.length; stencilIndex++) 
                {
                	// Check if the root group is the 'diagram' group. If so, this item should not be shown.
                    var currentGroupName = data.stencils[stencilIndex].groups[0];
                    //begin_流程图扩展属性_2017_04_04_暂时注释掉
	                   /* if (currentGroupName === 'Diagram' || currentGroupName === 'Form') {
	                        continue;  // go to next item
	                    }*/
                    //end_流程图扩展属性_2017_04_04_暂时注释掉
                    
                    var removed = false;
                    if (data.stencils[stencilIndex].removed) {
                        removed = true;
                    }

                    var currentGroup = undefined;
                    if (!removed) {
                        // Check if this group already exists. If not, we create a new one

                        if (currentGroupName !== null && currentGroupName !== undefined && currentGroupName.length > 0) {

                            currentGroup = findGroup(currentGroupName, stencilItemGroups); // Find group in root groups array
                            if (currentGroup === null) {
                                currentGroup = addGroup(currentGroupName, stencilItemGroups);
                            }

                            // Add all child groups (if any)
                            for (var groupIndex = 1; groupIndex < data.stencils[stencilIndex].groups.length; groupIndex++) {
                                var childGroupName = data.stencils[stencilIndex].groups[groupIndex];
                                var childGroup = findGroup(childGroupName, currentGroup.groups);
                                if (childGroup === null) {
                                    childGroup = addGroup(childGroupName, currentGroup.groups);
                                }

                                // The current group variable holds the parent of the next group (if any),
                                // and is basically the last element in the array of groups defined in the stencil item
                                currentGroup = childGroup;

                            }

                        }
                    }
                    
                    // Construct the stencil item
                    var stencilItem = {'id': data.stencils[stencilIndex].id,
                    	'name': data.stencils[stencilIndex].title,
                        'description': data.stencils[stencilIndex].title,
                        'icon': data.stencils[stencilIndex].icon,
                        'type': data.stencils[stencilIndex].type,
                        'roles': data.stencils[stencilIndex].roles,
                        'removed': removed,
                        'customIcon': false,
                        'canConnect': false,
                        'canConnectTo': false};
                    
                    if (data.stencils[stencilIndex].customIconId && data.stencils[stencilIndex].customIconId > 0)
                    {
                        stencilItem.customIcon = true;
                        stencilItem.icon = data.stencils[stencilIndex].customIconId;
                    }
                    
                    if (!removed) {
                        if (quickMenuDefinition.indexOf(stencilItem.id) >= 0)
                        {
                        	quickMenuItems[quickMenuDefinition.indexOf(stencilItem.id)] = stencilItem;
                        }
                    }
                    
                    for (var i = 0; i < data.stencils[stencilIndex].roles.length; i++)
                    {
                    	var stencilRole = data.stencils[stencilIndex].roles[i];
                    	if (stencilRole === 'sequence_start')
                    	{
                    		stencilItem.canConnect = true;
                    	}
                    	else if (stencilRole === 'sequence_end')
                    	{
                    		stencilItem.canConnectTo = true;
                    	}
                    	
                    	for (var j = 0; j < morphRoles.length; j++)
                    	{
                    		if (stencilRole === morphRoles[j].role)
                    		{
                    		    if (!removed)
                    		    {
                    			     morphRoles[j].morphOptions.push(stencilItem);
                    			}
                    			stencilItem.morphRole = morphRoles[j].role;
                    			break;
                    		}
                    	}
                    }

                    if (currentGroup)
                    {
	                    // Add the stencil item to the correct group
	                    currentGroup.items.push(stencilItem);
	                    if (ignoreForPaletteDefinition.indexOf(stencilItem.id) < 0)
	                    {
	                    	
	                    	//begin_去掉左侧BPMNDiagram冗余信息2017——04——15
			                        if(stencilItem.id!="BPMNDiagram"){
			                        	currentGroup.paletteItems.push(stencilItem);
			                        }
	                       //end_去掉左侧BPMNDiagram冗余信息2017——04——15
	                    	
	                    }

                    } else
                    {
                        // It's a root stencil element
                        if (!removed) {
                            stencilItemGroups.push(stencilItem);
                        }
                    }
                }
                
                for (var i = 0; i < stencilItemGroups.length; i++) 
                {
                	
                	if (stencilItemGroups[i].paletteItems && stencilItemGroups[i].paletteItems.length == 0)
                	{
                		stencilItemGroups[i].visible = false;
                	}
                }
                
                $scope.stencilItemGroups = stencilItemGroups;

                var containmentRules = [];
                for (var i = 0; i < data.rules.containmentRules.length; i++) 
                {
                    var rule = data.rules.containmentRules[i];
                    containmentRules.push(rule);
                }
                $scope.containmentRules = containmentRules;
                
                // remove quick menu items which are not available anymore due to custom pallette
                var availableQuickMenuItems = [];
                for (var i = 0; i < quickMenuItems.length; i++) 
                {
                    if (quickMenuItems[i]) {
                        availableQuickMenuItems[availableQuickMenuItems.length] = quickMenuItems[i];
                    }
                }
                
                $scope.quickMenuItems = availableQuickMenuItems;
                $scope.morphRoles = morphRoles;
            }).
            
            error(function (data, status, headers, config) {
                console.log('Something went wrong when fetching stencil items:' + JSON.stringify(data));
            });

            /*$http({method: 'GET', url: 'http://localhost:8088/ubpm-webserver-process-center/service/get/innerTable'}).success(function (data, status, headers, config) {
	            $scope.setJsonData(data);
	
       });
       
       var $scope.itemJson=[];
           $scope.setJsonData = function(data){	
		    if(data!=undefined){
		      for (var i=0;i<data.length;i++){
			    $scope.itemJson.push(data[i]);
			  }
		    }
		  };*/


            /*
             * Listen to selection change events: show properties
             */
            $scope.editor.registerOnEvent(ORYX.CONFIG.EVENT_SELECTION_CHANGED, function (event) {
                var shapes = event.elements;
                var canvasSelected = false;
                if (shapes && shapes.length == 0) {
                    shapes = [$scope.editor.getCanvas()];
                    canvasSelected = true;
                }
                if (shapes && shapes.length > 0) {

                    var selectedShape = shapes.first();
                    var stencil = selectedShape.getStencil();
                    
                    if ($rootScope.selectedElementBeforeScrolling && stencil.id().indexOf('BPMNDiagram') !== -1)
                    {
                    	// ignore canvas event because of empty selection when scrolling stops
                    	return;
                    }
                    
                    if ($rootScope.selectedElementBeforeScrolling && $rootScope.selectedElementBeforeScrolling.getId() === selectedShape.getId())
                    {
                    	$rootScope.selectedElementBeforeScrolling = null;
                    	return;
                    }

                    // Store previous selection
                    $scope.previousSelectedShape = $scope.selectedShape;
                    
                    // Only do something if another element is selected (Oryx fires this event multiple times)
                    if ($scope.selectedShape !== undefined && $scope.selectedShape.getId() === selectedShape.getId()) {
                        if ($rootScope.forceSelectionRefresh) {
                            // Switch the flag again, this run will force refresh
                            $rootScope.forceSelectionRefresh = false;
                        } else {
                            // Selected the same element again, no need to update anything
                            return;
                        }
                    }

                    var selectedItem = {'title': '', 'properties': []};

                    if (canvasSelected) {
                        selectedItem.auditData = {
                            'author': $scope.modelData.createdByUser,
                            'createDate': $scope.modelData.createDate
                        };
                    }

                    if(!$scope.stencilIdCount){
                    	$scope.stencilIdCount = new Object();
                    	if($scope.modelData.model.childShapes && $scope.modelData.model.childShapes.length > 0){
                    		for(var n = 0; n < $scope.modelData.model.childShapes.length; n++){
                    			var childShape = $scope.modelData.model.childShapes[n];
                    			if(childShape){
                    				if(!$scope.stencilIdCount[childShape.stencil.id]){
                    					$scope.stencilIdCount[childShape.stencil.id] = 0;
                    				}
                    				
                    				$scope.stencilIdCount[childShape.stencil.id] += 1;
                    			}
                    		}
                    		
                    		//begin_重新设置$scope.stencilIdCount中ApproveUserTask的最大值_20170720
                    		var flagArray=[];
			                    	for(var n = 0; n < $scope.modelData.model.childShapes.length; n++){
			                    		var flagId=$scope.modelData.model.childShapes[n].stencil.id;
			                    		if(flagId=="ApproveUserTask"){
			                    			var overrideidInfo =$scope.modelData.model.childShapes[n].properties.overrideid;
			                    			flagArray.push(parseInt(overrideidInfo.substring("ApproveUserTask".length)));
			                    		}
			                    	}
			                   var maxVal=Math.max.apply(null, flagArray);
			                   $scope.stencilIdCount["ApproveUserTask"]=maxVal;
                    	    //end_重新设置$scope.stencilIdCount中ApproveUserTask的最大值_20170720
                    		
                    		
                    	}
                    }

                    // Gather properties of selected item
                    var properties = stencil.properties();
                    var servicetasktype=null;
                    var texttype=null;
                    var defaultflow=null;
                    var conditionsequenceflow=null;
                    var multiinstance_model=null;
                    var multiinstance_person=null;
                    var multiinstance_personal=null;
                    var multiinstance_nodeflowtype=null;
                    var multiinstance_handletype=null;
                    var multiinstance_outtertrantablename=null;
                    var multiinstance_maintablename=null;
                    var functionauth=null;
                    var conditionsequencejumpflow=null//2017-6-12 退回线选中表达式去掉缺省属性
                    
                    for (var i = 0; i < properties.length; i++) {
                        var property = properties[i];
                        if (property.popular() == false) continue;
                        var key = property.prefix() + "-" + property.id();

                        if (key === 'oryx-name') {
                            selectedItem.title = selectedShape.properties[key];
                            if(selectedItem.title.length>10)
                            	selectedItem.title=selectedItem.title.substring(0,10);
                        }

                        // First we check if there is a config for 'key-type' and then for 'type' alone
                        var propertyConfig = KISBPM.PROPERTY_CONFIG[key + '-' + property.type()];
                        if (propertyConfig === undefined || propertyConfig === null) {
                            propertyConfig = KISBPM.PROPERTY_CONFIG[property.type()];
                        }

                        if (propertyConfig === undefined || propertyConfig === null) {
                            console.log('WARNING: no property configuration defined for ' + key + ' of type ' + property.type());
                        } else {

                            if (selectedShape.properties[key] === 'true') {
                                selectedShape.properties[key] = true;
                            }
                            
                            if (KISBPM.CONFIG.showRemovedProperties == false && property.isHidden())
                            {
                            	continue;
                            }

                            var currentProperty = {
                                'key': key,
                                'title': property.title(),
                                'type': property.type(),
                                'mode': 'read',
                                'hidden': property.isHidden(),
                                'required': property._jsonProp.required,
                                'group' : property.group(),
                                'value': selectedShape.properties[key]
                            };
                            if(key=="oryx-servicetasktype") 
                            	servicetasktype=selectedShape.properties[key];
                            if(key=="oryx-texttype") 
                            	texttype=selectedShape.properties[key];
                            if(key=="oryx-defaultflow") 
                            	defaultflow=selectedShape.properties[key];
                            if(key=="oryx-conditionsequenceflow") 
                            	conditionsequenceflow=selectedShape.properties[key];
                            
                            //begin_退回线选中表达时候，去掉缺省属性_2017-6-12
                            if(key=="oryx-conditionsequencejumpflow") 
                            	conditionsequencejumpflow=selectedShape.properties[key];
                            //end_退回线选中表达时候，去掉缺省属性_2017-6-12
                            
                            if(key=="oryx-multiinstance_model")
                               multiinstance_model=selectedShape.properties[key];
                             if(key=="oryx-multiinstance_nodeflowtype")
                               multiinstance_nodeflowtype=selectedShape.properties[key];
                            	
                                if(key=="oryx-multiinstance_person")
                                    
                                multiinstance_person=selectedShape.properties[key];
                                
                                 if(key=="oryx-multiinstance_personal")
                                    
                                multiinstance_personal=selectedShape.properties[key];
                                
                                if(key=="oryx-multiinstance_handletype"){
                                   multiinstance_handletype=selectedShape.properties[key];
                                }
                                
                                if(key=="oryx-multiinstance_outtertrantablename"){
                                   multiinstance_outtertrantablename=selectedShape.properties[key];
                                }
                                
                                if(key=="oryx-multiinstance_maintablename"){
                                	multiinstance_maintablename=selectedShape.properties[key];
                                 }
                                
                                /*if(key=="oryx-functionauth"){
                                   functionauth=selectedShape.properties[key];
                                }*/
                            
                            if ((currentProperty.type === 'complex' || currentProperty.type === 'multiplecomplex') && currentProperty.value && currentProperty.value.length > 0) {
                                try {
                                    currentProperty.value = JSON.parse(currentProperty.value);
                                } catch (err) {
                                    // ignore
                                }
                            }

                            if (propertyConfig.readModeTemplateUrl !== undefined && propertyConfig.readModeTemplateUrl !== null) {
                                currentProperty.readModeTemplateUrl = propertyConfig.readModeTemplateUrl + '?version=' + $rootScope.staticIncludeVersion;
                            }
                            if (propertyConfig.writeModeTemplateUrl !== null && propertyConfig.writeModeTemplateUrl !== null) {
                            	currentProperty.writeModeTemplateUrl = propertyConfig.writeModeTemplateUrl + '?version=' + $rootScope.staticIncludeVersion;
                            }

                            if (propertyConfig.templateUrl !== undefined && propertyConfig.templateUrl !== null) {
                                currentProperty.templateUrl = propertyConfig.templateUrl + '?version=' + $rootScope.staticIncludeVersion;
                                currentProperty.hasReadWriteMode = false;
                            }
                            else {
                                currentProperty.hasReadWriteMode = true;
                            }
                            
                            if("oryx-multiinstance_type" == currentProperty.key){
                            	if(typeof(currentProperty.value) == "string"){
                            		switch(currentProperty.value){
                            			case "None":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.None;
                            				break;
                            			case "Parallel":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Parallel;
                            				break;
                            			case "Sequential":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Sequential;
                            				break;
                            		}
                            	}
                            }
                            if("oryx-multiinstance_model" == currentProperty.key){
                            	if(typeof(currentProperty.value) == "string"){
                            		switch(currentProperty.value){
                            			case "None":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.None;
                            				break;
                            			case "Sign":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.ModelSign;
                            				break;
                            			case "Grab":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.ModelGrab;
                            				break;
                            			case "Sequential":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.ModelSequential;
                            				break;
                            			case "Parallel":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.ModelParallel;
                            				break;
                            		}
                            	}
                            }
                            if("oryx-multiinstance_person" == currentProperty.key){
                                if(typeof(currentProperty.value) == "string"){
                                    switch(currentProperty.value){
                                    case "None":
                                        currentProperty.showtext = "";
                                        break;
                                    case "tongbu":
                                        currentProperty.showtext = "同步";
                                        break;
                                    
                                    case "yibu":
                                        currentProperty.showtext = "异步";
                                        break;
                                    }
                                }
                            }
                            
                            
                            //内部事物提醒主表名称
                             if("oryx-multiinstance_handletype" == currentProperty.key){
                                  if(typeof(currentProperty.value) == "string"){
                                        if( $scope.selitems!=null){
                                        
                                                for (var w=0;w<$scope.selitems.length;w++)
            								 {
            								   if(currentProperty.value=="luru"){
            								     currentProperty.showtext = "";
            								     break;
            								   }else if(currentProperty.value== $scope.selitems[w].value){
            								     currentProperty.showtext = currentProperty.value+" "+$scope.selitems[w].text;
            								     break;
            								   }
            								 }
                                        }else{
                                             
                                              for (var u=0;u<innerTableArray.length;u++)
            								 {
            								   if(currentProperty.value=="luru"){
            								     currentProperty.showtext = "";
            								     break;
            								   }else if(currentProperty.value== innerTableArray[u].value){
            								     currentProperty.showtext = currentProperty.value+" "+innerTableArray[u].text;
            								     break;
            								   }
            								 }
                                         }
                                     }
                                  }
                                  
                                  //外部事物提醒主表名称
	                                  if("oryx-multiinstance_outtertrantablename" == currentProperty.key){
	                                  if(typeof(currentProperty.value) == "string"){
	                                        if( $scope.selitems!=null){

	                                                for (var w=0;w<$scope.selitems.length;w++)
	            								 {
	            								   if(currentProperty.value=="luru"){
	            								     currentProperty.showtext = "";
	            								     break;
	            								   }else if(currentProperty.value== $scope.selitems[w].value){
	            								     currentProperty.showtext = currentProperty.value+" "+$scope.selitems[w].text;
	            								     break;
	            								   }
	            								 }
	                                        }else{
	                                             
	                                              for (var u=0;u<innerTableArray.length;u++)
	            								 {
	            								   if(currentProperty.value=="luru"){
	            								     currentProperty.showtext = "";
	            								     break;
	            								   }else if(currentProperty.value== innerTableArray[u].value){
	            								     currentProperty.showtext = currentProperty.value+" "+innerTableArray[u].text;
	            								     break;
	            								   }
	            								 }
	                                         }
	                                     }
	                                  }
                                  
	                             //begin_流程图_主表名称_2017_04_04_
	                                  if("oryx-multiinstance_maintablename" == currentProperty.key){
		                                  if(typeof(currentProperty.value) == "string"){
		                                        if( $scope.selitems!=null){

		                                                for (var w=0;w<$scope.selitems.length;w++)
		            								 {
		            								   if(currentProperty.value=="luru"){
		            								     currentProperty.showtext = "";
		            								     break;
		            								   }else if(currentProperty.value== $scope.selitems[w].value){
		            								     currentProperty.showtext = currentProperty.value+" "+$scope.selitems[w].text;
		            								     break;
		            								   }
		            								 }
		                                        }else{
		                                             
		                                              for (var u=0;u<innerTableArray.length;u++)
		            								 {
		            								   if(currentProperty.value=="luru"){
		            								     currentProperty.showtext = "";
		            								     break;
		            								   }else if(currentProperty.value== innerTableArray[u].value){
		            								     currentProperty.showtext = currentProperty.value+" "+innerTableArray[u].text;
		            								     break;
		            								   }
		            								 }
		                                         }
		                                     }
		                                  }
	                             //end_流程图_主表名称_2017_04_04_
	                                  
	                                  
                                  
                                  
                            
                            
                             /*if("oryx-multiinstance_handletype" == currentProperty.key){
                                if(typeof(currentProperty.value) == "string"){
                                    switch(currentProperty.value){
                                    case "None":
                                        currentProperty.showtext = "";
                                        break;
                                  
									case "tiqu":
										currentProperty.showtext = "提取";
										break;
									case "kuajiediantiqu":
										currentProperty.showtext = "跨节点提取";
										break;
						
									case "kuajiedianshanchu":
										currentProperty.showtext = "跨节点删除";
										break;
									case "kuajiedianzuofei":
										currentProperty.showtext = "跨节点作废";
										break;
						
									case "luru":
										currentProperty.showtext = "录入";
										break;
									case "xiugai":
										currentProperty.showtext = "修改";
										break;
						
									case "shenhe":
										currentProperty.showtext = "审核";
										break;
									case "tuihui":
										currentProperty.showtext = "退回";
										break;
						
									case "chexiao":
										currentProperty.showtext = "撤销";
										break;
									case "shanchu":
										currentProperty.showtext = "删除";
										break;
						
									case "zuofei":
										currentProperty.showtext = "作废";
										break;
									case "guaqi":
										currentProperty.showtext = "挂起";
										break;
                                    }
                                }
                            }*/
                            
                            
                            

                            if("oryx-multiinstance_priority" == currentProperty.key){
                            	if(typeof(currentProperty.value) == "string"){
                            		switch(currentProperty.value){
                            			case "5":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority5;
                            				break;
                            			case "15":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority15;
                            				break;
                            			case "20":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority20;
                            				break;
                            			case "25":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority25;
                            				break;
                            			case "30":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority30;
                            				break;
                            			case "35":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority35;
                            				break;
                            			case "40":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority40;
                            				break;
                            			case "45":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority45;
                            				break;
                            			case "50":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority50;
                            				break;
                            			case "55":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority55;
                            				break;
                            			case "60":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority60;
                            				break;
                            			case "65":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority65;
                            				break;
                            			case "70":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority70;
                            				break;
                            			case "75":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority75;
                            				break;
                            			case "80":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority80;
                            				break;
                            			case "85":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority85;
                            				break;
                            			case "90":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority90;
                            				break;
                            			case "95":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority95;
                            				break;
                            			case "100":
                            				currentProperty.showtext = ORYX.I18N.MultiInstance.Priority100;
                            				break;
                            		}
                            	}
                            }
                            if (currentProperty.value === undefined
                                || currentProperty.value === null
                                || currentProperty.value.length == 0) {
                                currentProperty.noValue = true;
                            }
                            
                            if("oryx-overrideid" == currentProperty.key && currentProperty.value == ""){
                            	if(!$scope.stencilIdCount[stencil.idWithoutNs()]){
                            		
                            		if(stencil.idWithoutNs()=="StartNoneEvent" || stencil.idWithoutNs()=="EndNoneEvent"){
                            			$scope.stencilIdCount[stencil.idWithoutNs()] = 0;
                            		}else{
                            			//begin_节点编号从3开始_20170724
                              		       $scope.stencilIdCount[stencil.idWithoutNs()] = 2;
                              		    //begin_节点编号从3开始_20170724
                            		}
                            		
                            		
                            	}
                            	//begin_开始、结束节点的编号固定1、2
                            	if(stencil.idWithoutNs()=="StartNoneEvent" || stencil.idWithoutNs()=="EndNoneEvent"){
                            		$scope.stencilIdCount["StartNoneEvent"]=1;
                            		$scope.stencilIdCount["EndNoneEvent"]=2;
                            	}else{
                            		 $scope.stencilIdCount[stencil.idWithoutNs()] += 1;
                            	}
                            	 
                            	//begin_开始、结束节点的编号固定1、2
                            	
                            	currentProperty.value = stencil.idWithoutNs() + $scope.stencilIdCount[stencil.idWithoutNs()];
                            	$scope.selectedShape = selectedShape;
                            	$scope.updatePropertyInModel(currentProperty);
                            
                            	
                            }
                            
                            if("oryx-name" == currentProperty.key && currentProperty.value == ""&& selectedShape._stencil._jsonStencil.id.indexOf("Gateway")==-1){
                            	switch(stencil.type()){
                            		case "edge":
                            			break;
                            		default:
                            			currentProperty.value = stencil.title();
                            			$scope.selectedShape = selectedShape;
                            			$scope.updatePropertyInModel(currentProperty);
                            			break;
                            	}
                            }
                            
                          	//增加参照扩展属性
                            if(propertyConfig.isReference){                          	
								currentProperty.dataUrl = propertyConfig.dataUrl;
								currentProperty.treeDataUrl = propertyConfig.treeDataUrl;
								currentProperty.fields = propertyConfig.fields;
								currentProperty.multiSelect = propertyConfig.multiSelect;
								currentProperty.treeMultiSelect = propertyConfig.treeMultiSelect;
								currentProperty.isReference = propertyConfig.isReference;
								currentProperty.referenceType = propertyConfig.referenceType;
								if(currentProperty.value && typeof(currentProperty.value.refResultData) == "string"){
									currentProperty.value.refResultData = eval(currentProperty.value.refResultData);
								}
								//参照扩展查询参数
								currentProperty.queryConditions = {};
								switch(currentProperty.key){
									case "oryx-candidatestarterusers":
									case "oryx-assignment":
									case "oryx-candidateusers":
									case "oryx-candidateusers":
									case "oryx-usergroups":
									case "oryx-org":
									case "oryx-user":
										var viewValues = window.location.search.substr(1).match(/(^|&)viewValue=([^&]*)(&|$)/);
										if(viewValues && viewValues.length >= 3){
											currentProperty.queryConditions.viewValue = unescape(viewValues[2]);
										}else{
											currentProperty.queryConditions.viewValue = '';
										}
										break;
									case "oryx-role":
										var search = window.location.search.substr(1);
										var values = search.match(/(^|&)viewValue=([^&]*)(&|$)/);
										if(values && values.length >= 3){
											currentProperty.queryConditions.viewValue = unescape(values[2]);
										}else{
											currentProperty.queryConditions.viewValue = '';
										}
										values = search.match(/(^|&)appValue=([^&]*)(&|$)/);
										if(values && values.length >= 3){
											currentProperty.queryConditions.appValue = unescape(values[2]);
										}else{
											currentProperty.queryConditions.appValue = '';
										}
										values = search.match(/(^|&)viewAppValue=([^&]*)(&|$)/);
										if(values && values.length >= 3){
											currentProperty.queryConditions.viewAppValue = unescape(values[2]);
										}else{
											currentProperty.queryConditions.viewAppValue = '';
										}
										break;
									default:
										break;
								}
							}
							
                            selectedItem.properties.push(currentProperty);
                        }
                    }
                    
                    selectedItem.propertyGroups=new Array();
                    var commonGroup = { expanded:true, name: "常用", items: []};
                    var userGroup = { expanded:true, name: "参与人", items: []};
                    var participantGroup = { expanded:true, name: "实现", items: []};
                    var billGroup = {expanded:false,  name: "表单", items: []};
                    var multipGroup = { expanded:false, name: "多实例", items: []};
                    var serviceGroup = { expanded:false, name: "服务", items: []};
                    var scriptGroup = { expanded:false, name: "脚本", items: []};
                    var mailGroup = { expanded:false, name: "邮件", items: []};
                    var ruleGroup = { expanded:false, name: "规则", items: []};
                    var callGroup = { expanded:false, name: "调用", items: []};
                    var messageGroup = {expanded:false,  name: "消息", items: []};
                    var timerGroup = { expanded:false, name: "定时", items: []};
                    var errorGroup = { expanded:false, name: "错误", items: []};
                    var signalGroup = { expanded:false, name: "信号", items: []};
                    var listenGroup = { expanded:false, name: "监听", items: []};
                    var greatGroup = { expanded:false, name: "高级", items: []};
                    var testGroup = { expanded:false, name: "新增分组测试", items: []};
                    
                    //任务节点分组
	                    var baseInfoGroup = { expanded:true, name: "基本信息", items: []};
	                    var functionAuthGroup = { expanded:false, name: "菜单授权", items: []};
	                    var roleAuthGroup = { expanded:false, name: "角色授权", items: []};
	                    var ruleAuthGroup = { expanded:false, name: "关联规则", items: []};
	                    var handleAuthGroup = { expanded:false, name: "操作记账授权", items: []};
	                    var monitoringRuleGroup = { expanded:false, name: "监控规则", items: []};
	                    
	                    //begin_扩展流程图属性_2017_04_04_
	                     var processInfoGroup = { expanded:true, name: "定义流程信息", items: []};
	                    //end_扩展流程图属性_2017_04_04_
	                
                    
                    

                    for(var i=0;i<selectedItem.properties.size();i++)
                	{
                    	if(selectedItem.properties[i].group=="常用")
                    		commonGroup.items.push(selectedItem.properties[i]);
                    	else if(selectedItem.properties[i].group=="参与人")
                    		{
                    			if(multiinstance_model==null||!(multiinstance_model=="Sign"||multiinstance_model=="Grab")&&selectedItem.properties[i].type!="complex")
                    				userGroup.items.push(selectedItem.properties[i]);
                    			else if((multiinstance_model=="Sign"||multiinstance_model=="Grab")&&!(selectedItem.properties[i].key=="oryx-multiinstance_condition")&&selectedItem.properties[i].type!="complex")
                				{
                    				userGroup.items.push(selectedItem.properties[i]);
                				}
                    		
                    		//begin_临时放开
                             if(multiinstance_person=="USER" && selectedItem.properties[i].key=="oryx-user")
                                { 
                                    userGroup.items.push(selectedItem.properties[i]);  
                                    }
                                else if(multiinstance_person=="USERGROUPS" && selectedItem.properties[i].key=="oryx-usergroups")
                                 {
                                    userGroup.items.push(selectedItem.properties[i]);
                                }else if(multiinstance_person=="DEPTS" && selectedItem.properties[i].key=="oryx-depts")
                                {
                                    userGroup.items.push(selectedItem.properties[i]);
                                }else if(multiinstance_person=="POSTS" && selectedItem.properties[i].key=="oryx-posts"){
                                    userGroup.items.push(selectedItem.properties[i]);
                                }
                           //end_临时放开

                            }
                    	else if(selectedItem.properties[i].group=="实现")
                    		{
                    		if(servicetasktype==null&&!(selectedItem.properties[i].key=="oryx-mailtasktext"||selectedItem.properties[i].key=="oryx-mailtaskhtml"
                    			||selectedItem.properties[i].key=="oryx-conditionsequenceflow"||selectedItem.properties[i].key=="oryx-defaultflow" || selectedItem.properties[i].key=="oryx-conditionsequencejumpflow"))//退回线设置表达式后去掉缺省属性_2017-6-12
                    			participantGroup.items.push(selectedItem.properties[i]);
                    		else if(servicetasktype=="java类"&&!(selectedItem.properties[i].key=="oryx-wsdl"||selectedItem.properties[i].key=="oryx-operation"
                    			||selectedItem.properties[i].key=="oryx-parameters"
    							||selectedItem.properties[i].key=="oryx-returnvalue"
    							||selectedItem.properties[i].key=="oryx-servicetaskexpression"
    							||selectedItem.properties[i].key=="oryx-servicetaskdelegateexpression")
    							&&!(selectedItem.properties[i].key=="oryx-mailtasktext"||selectedItem.properties[i].key=="oryx-mailtaskhtml"
    								||selectedItem.properties[i].key=="oryx-conditionsequenceflow"||selectedItem.properties[i].key=="oryx-defaultflow"))
                    			participantGroup.items.push(selectedItem.properties[i]);
                    		else if(servicetasktype=="表达式"&&!(selectedItem.properties[i].key=="oryx-wsdl"||selectedItem.properties[i].key=="oryx-operation"||selectedItem.properties[i].key=="oryx-parameters"
    							||selectedItem.properties[i].key=="oryx-returnvalue"||selectedItem.properties[i].key=="oryx-servicetaskclass"||selectedItem.properties[i].key=="oryx-servicetaskdelegateexpression")
    							&&!(selectedItem.properties[i].key=="oryx-mailtasktext"||selectedItem.properties[i].key=="oryx-mailtaskhtml"
    								||selectedItem.properties[i].key=="oryx-conditionsequenceflow"||selectedItem.properties[i].key=="oryx-defaultflow"))
                    			participantGroup.items.push(selectedItem.properties[i]);
                    		else if(servicetasktype=="委托表达式"&&!(selectedItem.properties[i].key=="oryx-wsdl"||selectedItem.properties[i].key=="oryx-operation"||selectedItem.properties[i].key=="oryx-parameters"
    							||selectedItem.properties[i].key=="oryx-returnvalue"||selectedItem.properties[i].key=="oryx-servicetaskclass"||selectedItem.properties[i].key=="oryx-servicetaskexpression")
    							&&!(selectedItem.properties[i].key=="oryx-mailtasktext"||selectedItem.properties[i].key=="oryx-mailtaskhtml"
    								||selectedItem.properties[i].key=="oryx-conditionsequenceflow"||selectedItem.properties[i].key=="oryx-defaultflow"))
                    			participantGroup.items.push(selectedItem.properties[i]);
                    		else if(servicetasktype=="WebService"&&!(selectedItem.properties[i].key=="oryx-servicetaskclass"||selectedItem.properties[i].key=="oryx-servicetaskexpression"||selectedItem.properties[i].key=="oryx-servicetaskdelegateexpression"
    							||selectedItem.properties[i].key=="oryx-servicetaskfields"||selectedItem.properties[i].key=="oryx-servicetaskresultvariable")&&!(selectedItem.properties[i].key=="oryx-mailtasktext"||selectedItem.properties[i].key=="oryx-mailtaskhtml"
    								||selectedItem.properties[i].key=="oryx-conditionsequenceflow"||selectedItem.properties[i].key=="oryx-defaultflow"))
    							participantGroup.items.push(selectedItem.properties[i]);
                    		if(texttype=="纯文本"&&selectedItem.properties[i].key=="oryx-mailtasktext")
                    			participantGroup.items.push(selectedItem.properties[i]);
                    		else if(texttype=="html"&&selectedItem.properties[i].key=="oryx-mailtaskhtml")
                    			participantGroup.items.push(selectedItem.properties[i]);
                    		if(!(defaultflow=="true"||defaultflow==true)&&selectedItem.properties[i].key=="oryx-conditionsequenceflow")
                    			participantGroup.items.push(selectedItem.properties[i]);
                    		if((conditionsequenceflow==null||conditionsequenceflow=="")&&selectedItem.properties[i].key=="oryx-defaultflow"){
                    			//begin_退回线选中表达式后，去掉缺省属性选项_2017-6-12
                    			  if(conditionsequencejumpflow==null || conditionsequencejumpflow=="")
                    			    participantGroup.items.push(selectedItem.properties[i]);
                    			//end_退回线选中表达式后，去掉缺省属性选项_2017-6-12
                    		}
                    			
                    			
                    		
                    		//begin_退回线选中表达式后，去掉缺省属性选项_2017-6-12
                    		if(!(defaultflow=="true"||defaultflow==true)&&selectedItem.properties[i].key=="oryx-conditionsequencejumpflow")
                    			participantGroup.items.push(selectedItem.properties[i]);
                    		/*if((conditionsequencejumpflow==null||conditionsequencejumpflow=="")&&selectedItem.properties[i].key=="oryx-defaultflow")
                    			participantGroup.items.push(selectedItem.properties[i]);*/
                    		//end_退回线选中表达式后，去掉缺省属性选项_2017-6-12
                    		
                    		
                    		
                    		
                    		}
                    	else if(selectedItem.properties[i].group=="表单")
                    		billGroup.items.push(selectedItem.properties[i]);
                    	else if(selectedItem.properties[i].group=="多实例")
                    		multipGroup.items.push(selectedItem.properties[i]);
                    	else if(selectedItem.properties[i].group=="服务")
                    		serviceGroup.items.push(selectedItem.properties[i]);
                    	else if(selectedItem.properties[i].group=="脚本")
                    		scriptGroup.items.push(selectedItem.properties[i]);
                    	else if(selectedItem.properties[i].group=="邮件")
                    		mailGroup.items.push(selectedItem.properties[i]);
                    	else if(selectedItem.properties[i].group=="规则")
                    		ruleGroup.items.push(selectedItem.properties[i]);
                    	else if(selectedItem.properties[i].group=="调用")
                    		callGroup.items.push(selectedItem.properties[i]);
                    	
                    	else if(selectedItem.properties[i].group=="消息")
                    		messageGroup.items.push(selectedItem.properties[i]);
                    	else if(selectedItem.properties[i].group=="定时")
                    		timerGroup.items.push(selectedItem.properties[i]);
                    	else if(selectedItem.properties[i].group=="错误")
                    		errorGroup.items.push(selectedItem.properties[i]);
                    	else if(selectedItem.properties[i].group=="信号")
                    		signalGroup.items.push(selectedItem.properties[i]);
                    	else if(selectedItem.properties[i].group=="监听")
                    		listenGroup.items.push(selectedItem.properties[i]);
                    	else if(selectedItem.properties[i].group=="高级")
                    		greatGroup.items.push(selectedItem.properties[i]);
                    	else if(selectedItem.properties[i].group=="新增分组测试")
                    		testGroup.items.push(selectedItem.properties[i]);
                    	else if(selectedItem.properties[i].group=="基本信息"){
                    	
                           baseInfoGroup.items.push(selectedItem.properties[i]);
                          
                          
                          
                           
                          
                    	}
                    	//begin_扩展流程图属性_2017_04_04_
	                    	else if(selectedItem.properties[i].group=="定义流程信息"){
	                    		processInfoGroup.items.push(selectedItem.properties[i]);
	                    	}
                    	//end_扩展流程图属性_2017_04_04_
                    	else if(selectedItem.properties[i].group=="菜单授权")
                    		functionAuthGroup.items.push(selectedItem.properties[i]);
                        else if(selectedItem.properties[i].group=="角色授权")
                    		roleAuthGroup.items.push(selectedItem.properties[i]);
                        else if(selectedItem.properties[i].group=="关联规则")
                        	ruleAuthGroup.items.push(selectedItem.properties[i]);
                    	else if(selectedItem.properties[i].group=="操作记账授权")
                    		handleAuthGroup.items.push(selectedItem.properties[i]);
                    	else if(selectedItem.properties[i].group=="监控规则")
                    		monitoringRuleGroup.items.push(selectedItem.properties[i]);
                    	
                	}
                    if(commonGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(commonGroup);
                    if(participantGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(participantGroup);
                    if(userGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(userGroup);
                    if(billGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(billGroup);
                    if(listenGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(listenGroup);
                    if(multipGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(multipGroup);
                    if(serviceGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(serviceGroup);
                    if(scriptGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(scriptGroup);
                    if(mailGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(mailGroup);
                    if(ruleGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(ruleGroup);
                    if(callGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(callGroup);
                    if(messageGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(messageGroup);
                    if(timerGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(timerGroup);
                    if(errorGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(errorGroup);
                    if(signalGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(signalGroup);
                    if(greatGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(greatGroup);
                    if(testGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(testGroup);
                    	
                    if(baseInfoGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(baseInfoGroup);
                    if(functionAuthGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(functionAuthGroup);
                    if(roleAuthGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(roleAuthGroup);
                    if(ruleAuthGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(ruleAuthGroup);
                    if(handleAuthGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(handleAuthGroup);
                    if(monitoringRuleGroup.items.size()>0)
                    	selectedItem.propertyGroups.push(monitoringRuleGroup);
                  //begin_扩展流程图属性_2017_04_04_
                    if(processInfoGroup.items.size()>0)
                    selectedItem.propertyGroups.push(processInfoGroup);
                  //end_扩展流程图属性_2017_04_04_
                    
                    // Need to wrap this in an $apply block, see http://jimhoskins.com/2012/12/17/angularjs-and-apply.html
                    $scope.safeApply(function () {
                        $scope.selectedItem = selectedItem;
                        $scope.selectedShape = selectedShape;
                    });

                } else {
                    $scope.safeApply(function () {
                        $scope.selectedItem = {};
                        $scope.selectedShape = null;
                    });
                }
            
                //begin_默认选中流程组信息分组
               /* $scope.propertyGroupClicked(0,"定义流程信息",false);
                $scope.propertyGroupClicked(0,"基本信息",false);*/
                //begin_默认选中流程组信息分组
            
            
            });
            
            $scope.editor.registerOnEvent(ORYX.CONFIG.EVENT_SELECTION_CHANGED, function (event) {
            	
            	KISBPM.eventBus.dispatch(KISBPM.eventBus.EVENT_TYPE_HIDE_SHAPE_BUTTONS);
            	var shapes = event.elements;
                
                if (shapes && shapes.length == 1) {

                    var selectedShape = shapes.first();
            	
                    var a = $scope.editor.getCanvas().node.getScreenCTM();
        			
        			var absoluteXY = selectedShape.absoluteXY();
        			
        			absoluteXY.x *= a.a;
        			absoluteXY.y *= a.d;
        			
        			var additionalIEZoom = 1;
        			if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
                        var ua = navigator.userAgent;
                        if (ua.indexOf('MSIE') >= 0) {
                            //IE 10 and below
                            var zoom = Math.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
                            if (zoom !== 100) {
                                additionalIEZoom = zoom / 100
                            }
                        }
                    }
                    
        			if (additionalIEZoom === 1) {
        			     absoluteXY.y = absoluteXY.y - jQuery("#canvasSection").offset().top + 5;
                         absoluteXY.x = absoluteXY.x - jQuery("#canvasSection").offset().left;
        			
        			} else {
        			     var canvasOffsetLeft = jQuery("#canvasSection").offset().left;
        			     var canvasScrollLeft = jQuery("#canvasSection").scrollLeft();
        			     var canvasScrollTop = jQuery("#canvasSection").scrollTop();
        			     
        			     var offset = a.e - (canvasOffsetLeft * additionalIEZoom);
        			     var additionaloffset = 0;
        			     if (offset > 10) {
        			         additionaloffset = (offset / additionalIEZoom) - offset;
        			     }
        			     absoluteXY.y = absoluteXY.y - (jQuery("#canvasSection").offset().top * additionalIEZoom) + 5 + ((canvasScrollTop * additionalIEZoom) - canvasScrollTop);
                         absoluteXY.x = absoluteXY.x - (canvasOffsetLeft * additionalIEZoom) + additionaloffset + ((canvasScrollLeft * additionalIEZoom) - canvasScrollLeft);
                    }
        			
        			var bounds = new ORYX.Core.Bounds(a.e + absoluteXY.x, a.f + absoluteXY.y, a.e + absoluteXY.x + a.a*selectedShape.bounds.width(), a.f + absoluteXY.y + a.d*selectedShape.bounds.height());
        			var shapeXY = bounds.upperLeft();
        			
        			var stencilItem = $scope.getStencilItemById(selectedShape.getStencil().idWithoutNs());
        			var morphShapes = [];
        			if (stencilItem && stencilItem.morphRole)
        			{
            			for (var i = 0; i < $scope.morphRoles.length; i++)
            			{
            				if ($scope.morphRoles[i].role === stencilItem.morphRole)
        					{
        						morphShapes = $scope.morphRoles[i].morphOptions;
        					}
            			}
            	    }
        			
        			if (morphShapes && morphShapes.length > 0)
        			{
        				// In case the element is not wide enough, start the 2 bottom-buttons more to the left
        				// to prevent overflow in the right-menu
	        			  
        				var x = shapeXY.x;
        				if(bounds.width() < 48) {
        					x -= 24;
        				}
        				if(!(stencilItem.id=="EventSubProcess"||stencilItem.id=="SubProcess"||stencilItem.id=="CallActivity"||stencilItem.id=='TextAnnotation'))
        					{
			        			var morphButton = document.getElementById('morph-button');
			        			morphButton.style.display = "block";
			        			morphButton.style.left = x + 24 +'px';
			        			morphButton.style.top = (shapeXY.y+bounds.height() + 2) + 'px';
        					}
	        			
	        			var deleteButton = document.getElementById('delete-button');
	        			deleteButton.style.display = "block";
	        			deleteButton.style.left = x + 'px';
	        			deleteButton.style.top = (shapeXY.y+bounds.height() + 2) + 'px';
        			}
        			
        			if (stencilItem && stencilItem.canConnect)
        			{
	        			var quickButtonCounter = 0;
	        			var quickButtonX = shapeXY.x+bounds.width() + 5;
	        			var quickButtonY = shapeXY.y;
	        			jQuery('.Oryx_button').each(function(i, obj) {
	        				if (obj.id !== 'morph-button' && obj.id != 'delete-button')
	        				{
	        					quickButtonCounter++;
	        					if (quickButtonCounter > 3)
	        					{
	        						quickButtonX = shapeXY.x+bounds.width() + 5;
	        						quickButtonY += 24;
	        						quickButtonCounter = 1;
	        					}
	        					else if (quickButtonCounter > 1)
	        					{
	        						quickButtonX += 24;
	        					}
	        					if(!(stencilItem.id=="EventSubProcess"))
        						{
		        					obj.style.display = "block";
		        					obj.style.left = 5+quickButtonX + 'px';
		        					obj.style.top = quickButtonY + 'px';
        						}
	        				}
	        			});
        			}
                }
            });
	        
            if (!$rootScope.stencilInitialized) {
	            KISBPM.eventBus.addListener(KISBPM.eventBus.EVENT_TYPE_HIDE_SHAPE_BUTTONS, function (event) {
		            jQuery('.Oryx_button').each(function(i, obj) {
		            	obj.style.display = "none";
      				});
	            });

	            /*
	             * Listen to property updates and act upon them
	             */
	            KISBPM.eventBus.addListener(KISBPM.eventBus.EVENT_TYPE_PROPERTY_VALUE_CHANGED, function (event) {
	                if (event.property && event.property.key) {
	                    // If the name property is been updated, we also need to change the title of the currently selected item
	                    if (event.property.key === 'oryx-name' && $scope.selectedItem !== undefined && $scope.selectedItem !== null) {
	                        $scope.selectedItem.title = event.newValue;
	                    }

	                    // Update "no value" flag
	                    event.property.noValue = (event.property.value === undefined
	                        || event.property.value === null
	                        || event.property.value.length == 0);
	                }
	            });
	            
	            $rootScope.stencilInitialized = true;
            }
            
            $scope.morphShape = function() {
            	$scope.safeApply(function () {
            		
            		var shapes = $rootScope.editor.getSelection();
            		if (shapes && shapes.length == 1)
            		{
            			$rootScope.currentSelectedShape = shapes.first();
            			var stencilItem = $scope.getStencilItemById($rootScope.currentSelectedShape.getStencil().idWithoutNs());
            			var morphShapes = [];
            			for (var i = 0; i < $scope.morphRoles.length; i++)
            			{
            				if ($scope.morphRoles[i].role === stencilItem.morphRole)
        					{
        						morphShapes = $scope.morphRoles[i].morphOptions.slice();
        					}
            			}

            			// Method to open shape select dialog (used later on)
                        var showSelectShapeDialog = function()
                        {
                            $rootScope.morphShapes = morphShapes;
                            $modal({
                                backdrop: false,
                                keyboard: true,
                                template: 'editor-app/popups/select-shape.html?version=' + Date.now()
                            });
                        };

                        showSelectShapeDialog();
            		}
            	});
            };
            
            $scope.deleteShape = function() {
              KISBPM.TOOLBAR.ACTIONS.deleteItem({'$scope': $scope});
            };
            
            $scope.quickAddItem = function(newItemId) {
            	$scope.safeApply(function () {
            		
            		var shapes = $rootScope.editor.getSelection();
            		if (shapes && shapes.length == 1)
            		{
            			$rootScope.currentSelectedShape = shapes.first();
            			
            			var containedStencil = undefined;
                    	var stencilSets = $scope.editor.getStencilSets().values();
                    	for (var i = 0; i < stencilSets.length; i++)
                    	{
                    		var stencilSet = stencilSets[i];
                			var nodes = stencilSet.nodes();
                			for (var j = 0; j < nodes.length; j++)
                        	{
                				if (nodes[j].idWithoutNs() === newItemId)
                				{
                					containedStencil = nodes[j];
                					break;
                				}
                        	}
                    	}
                    	
                    	if (!containedStencil) return;
            			
            			var option = {type: $scope.currentSelectedShape.getStencil().namespace() + newItemId, namespace: $scope.currentSelectedShape.getStencil().namespace()};
            			option['connectedShape'] = $rootScope.currentSelectedShape;
            			option['parent'] = $rootScope.currentSelectedShape.parent;
            			option['containedStencil'] = containedStencil;
            		
            			var args = { sourceShape: $rootScope.currentSelectedShape, targetStencil: containedStencil };
            			var targetStencil = $scope.editor.getRules().connectMorph(args);
            			if (!targetStencil){ return; }// Check if there can be a target shape
            			option['connectingType'] = targetStencil.id();

            			var command = new KISBPM.CreateCommand(option, undefined, undefined, $scope.editor);
            		
            			$scope.editor.executeCommands([command]);
	        			$scope.quickMenu = false;
	        			$scope.dragCanContain=false;
            		}
            	});
            };

        }); // end of $scope.editorFactory.promise block

        /* Click handler for clicking a property */
        $scope.propertyClicked = function (groupIndex,itemIndex) {
            if (!$scope.selectedItem.propertyGroups[groupIndex].items[itemIndex].hidden) {
                $scope.selectedItem.propertyGroups[groupIndex].items[itemIndex].mode = "write";
            }
        };

        /* Helper method to retrieve the template url for a property */
        $scope.getPropertyTemplateUrl = function (groupIndex,itemIndex) {
            return $scope.selectedItem.propertyGroups[groupIndex].items[itemIndex].templateUrl;
        };
        $scope.getPropertyReadModeTemplateUrl = function (groupIndex,itemIndex) {
            return $scope.selectedItem.propertyGroups[groupIndex].items[itemIndex].readModeTemplateUrl;
        };
        $scope.getPropertyWriteModeTemplateUrl = function (groupIndex,itemIndex) {
            return $scope.selectedItem.propertyGroups[groupIndex].items[itemIndex].writeModeTemplateUrl;
        };
        
        $scope.propertyGroupClicked = function (groupIndex,groupName,expanded) {
            if (document.getElementsByName(groupName)!=null&&expanded) {
            	for(var i=0;i<document.getElementsByName(groupName).length;i++)
            		document.getElementsByName(groupName)[i].hide();
            	$scope.selectedItem.propertyGroups[groupIndex].expanded=false;
            }
            else if(document.getElementsByName(groupName)!=null&&!expanded) {
            	
            	//begin_属性组选完之后，自动闭合其他的属性组_20171129
	          	  //先获得当前节点的所有属性组,过滤出没选中的属性组中为true
	          	     for(var t=0;t< $scope.selectedItem.propertyGroups.length;t++){
	          	    	 if( $scope.selectedItem.propertyGroups[t].expanded==true){
	          	    		 $scope.selectedItem.propertyGroups[t].expanded=false;
	          	    	 }
	          	     }
    	        //end_属性组选完之后，自动闭合其他的属性组_20171129
            	
            	for(var i=0;i<document.getElementsByName(groupName).length;i++)
                	document.getElementsByName(groupName)[i].show();
            	$scope.selectedItem.propertyGroups[groupIndex].expanded=true;
            }
        };
        /* Method available to all sub controllers (for property controllers) to update the internal Oryx model */
        $scope.updatePropertyInModel = function (property, shapeId) {

            var shape = $scope.selectedShape;
            // Some updates may happen when selected shape is already changed, so when an additional
            // shapeId is supplied, we need to make sure the correct shape is updated (current or previous)
            if (shapeId) {
                if (shape.id != shapeId && $scope.previousSelectedShape && $scope.previousSelectedShape.id == shapeId) {
                    shape = $scope.previousSelectedShape;
                } else {
                    shape = null;
                }
            }

            if (!shape) {
                // When no shape is selected, or no shape is found for the alternative
                // shape ID, do nothing
                return;
            }
            var key = property.key;
            var newValue = property.value;
            var oldValue = shape.properties[key];

            if (newValue != oldValue) {
                var commandClass = ORYX.Core.Command.extend({
                    construct: function () {
                        this.key = key;
                        this.oldValue = oldValue;
                        this.newValue = newValue;
                        this.shape = shape;
                        this.facade = $scope.editor;
                    },
                    execute: function () {
                        this.shape.setProperty(this.key, this.newValue);
                        this.facade.getCanvas().update();
                        this.facade.updateSelection();
                    },
                    rollback: function () {
                        this.shape.setProperty(this.key, this.oldValue);
                        this.facade.getCanvas().update();
                        this.facade.updateSelection();
                    }
                });
                // Instantiate the class
                var command = new commandClass();
                if(command.oldValue==true&&command.key=="oryx-forcompensation")
    			{
    				for(var i=0;i<command.shape.incoming.size();i++)
    				{
    					if(command.shape.incoming[i]._stencil._jsonStencil.id.indexOf("Association")!=-1)
    						{
    							$scope.editor.selection.clear();
    							$scope.editor.selection.push(command.shape.incoming[i]);
    							KISBPM.TOOLBAR.ACTIONS._getOryxEditPlugin($scope).editDelete();
    						}
    						
    				}
    			}
                // Execute the command
                $scope.editor.executeCommands([command]);
                $scope.editor.handleEvents({
                    type: ORYX.CONFIG.EVENT_PROPWINDOW_PROP_CHANGED,
                    elements: [shape],
                    key: key
                });

                // Switch the property back to read mode, now the update is done
                property.mode = 'read';

                // Fire event to all who is interested
                // Fire event to all who want to know about this
                var event = {
                    type: KISBPM.eventBus.EVENT_TYPE_PROPERTY_VALUE_CHANGED,
                    property: property,
                    oldValue: oldValue,
                    newValue: newValue
                };
                KISBPM.eventBus.dispatch(event.type, event);
            } else {
                // Switch the property back to read mode, no update was needed
                property.mode = 'read';
            }

        };

        /**
         * Helper method that searches a group for an item with the given id.
         * If not found, will return undefined.
         */
        $scope.findStencilItemInGroup = function (stencilItemId, group) {

            var item;

            // Check all items directly in this group
            for (var j = 0; j < group.items.length; j++) {
                item = group.items[j];
                if (item.id === stencilItemId) {
                    return item;
                }
            }

            // Check the child groups
            if (group.groups && group.groups.length > 0) {
                for (var k = 0; k < group.groups.length; k++) {
                    item = $scope.findStencilItemInGroup(stencilItemId, group.groups[k]);
                    if (item) {
                        return item;
                    }
                }
            }

            return undefined;
        };

        /**
         * Helper method to find a stencil item.
         */
        $scope.getStencilItemById = function (stencilItemId) {
            for (var i = 0; i < $scope.stencilItemGroups.length; i++) {
                var element = $scope.stencilItemGroups[i];

                // Real group
                if (element.items !== null && element.items !== undefined) {
                    var item = $scope.findStencilItemInGroup(stencilItemId, element);
                    if (item) {
                        return item;
                    }
                } else { // Root stencil item
                    if (element.id === stencilItemId) {
                        return element;
                    }
                }
            }
            return undefined;
        };

        /*
         * DRAG AND DROP FUNCTIONALITY
         */

        $scope.dropCallback = function (event, ui) {
        	
            $scope.editor.handleEvents({
                type: ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
                highlightId: "shapeRepo.attached"
            });
            $scope.editor.handleEvents({
                type: ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
                highlightId: "shapeRepo.added"
            });
            
            $scope.editor.handleEvents({
                type: ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
                highlightId: "shapeMenu"
            });
            
            KISBPM.eventBus.dispatch(KISBPM.eventBus.EVENT_TYPE_HIDE_SHAPE_BUTTONS);

            if ($scope.dragCanContain||$scope.dragCanAttach) {

            	var item = $scope.getStencilItemById(ui.draggable[0].id);
            	
            	var pos = {x: event.pageX, y: event.pageY};
            	
            	var additionalIEZoom = 1;
                if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
                    var ua = navigator.userAgent;
                    if (ua.indexOf('MSIE') >= 0) {
                        //IE 10 and below
                        var zoom = Math.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
                        if (zoom !== 100) {
                            additionalIEZoom = zoom / 100;
                        }
                    }
                }
            	
                var screenCTM = $scope.editor.getCanvas().node.getScreenCTM();

                // Correcting the UpperLeft-Offset
                pos.x -= (screenCTM.e / additionalIEZoom);
                pos.y -= (screenCTM.f / additionalIEZoom);
                // Correcting the Zoom-Factor
                pos.x /= screenCTM.a;
                pos.y /= screenCTM.d;
                
                // Correcting the ScrollOffset
                pos.x -= document.documentElement.scrollLeft;
                pos.y -= document.documentElement.scrollTop;
                
                if(!$scope.dragCanAttach){
	                var parentAbs = $scope.dragCurrentParent.absoluteXY();
	                pos.x -= parentAbs.x;
	                pos.y -= parentAbs.y;
                }
                
            	if ($scope.quickMenu)
            	{
            		var shapes = $scope.editor.getSelection();
            		if (shapes && shapes.length == 1)
            		{
            			var currentSelectedShape = shapes.first();
            		
	            		var containedStencil = undefined;
	                	var stencilSets = $scope.editor.getStencilSets().values();
	                	for (var i = 0; i < stencilSets.length; i++)
	                	{
	                		var stencilSet = stencilSets[i];
	            			var nodes = stencilSet.nodes();
	            			for (var j = 0; j < nodes.length; j++)
	                    	{
	            				if (nodes[j].idWithoutNs() === ui.draggable[0].id)
	            				{
	            					containedStencil = nodes[j];
	            					break;
	            				}
	                    	}
	            			
	            			if (!containedStencil)
	            			{
	            				var edges = stencilSet.edges();
	                			for (var j = 0; j < edges.length; j++)
	                        	{
	                				if (edges[j].idWithoutNs() === ui.draggable[0].id)
	                				{
	                					containedStencil = edges[j];
	                					break;
	                				}
	                        	}
	            			}
	                	}
	                	
	                	if (!containedStencil) return;
	        			
	        			var option = {};
	        			option.type = currentSelectedShape.getStencil().namespace() + ui.draggable[0].id;
	        			option.namespace = currentSelectedShape.getStencil().namespace();
	        			option.connectedShape = currentSelectedShape;
	        			option.parent = $scope.dragCurrentParent;
	        			option.containedStencil = containedStencil;
	        			
	        			// If the ctrl key is not pressed, 
	        			// snapp the new shape to the center 
	        			// if it is near to the center of the other shape
	        			if (!event.ctrlKey){
	        				// Get the center of the shape
	        				var cShape = currentSelectedShape.bounds.center();
	        				// Snapp +-20 Pixel horizontal to the center 
	        				if (20 > Math.abs(cShape.x - pos.x)){
	        					pos.x = cShape.x;
	        				}
	        				// Snapp +-20 Pixel vertical to the center 
	        				if (20 > Math.abs(cShape.y - pos.y)){
	        					pos.y = cShape.y;
	        				}
	        			}
	        			
	        			option.position = pos;
	        		
	        			//新增的退回线快捷方式能拖动_2017_6_9
	        			if (containedStencil.idWithoutNs() !== 'SequenceFlow' && containedStencil.idWithoutNs() !== 'SequenceJumpFlow' && containedStencil.idWithoutNs() !== 'Association' && 
	        			        containedStencil.idWithoutNs() !== 'MessageFlow' && containedStencil.idWithoutNs() !== 'DataAssociation')
	        			{
		        			var args = { sourceShape: currentSelectedShape, targetStencil: containedStencil };
		        			var targetStencil = $scope.editor.getRules().connectMorph(args);
		        			if (!targetStencil){ return; }// Check if there can be a target shape
		        			option.connectingType = targetStencil.id();
	        			}
	        			if(!(option.type.indexOf("Association")!=-1&&($scope.dropTargetElement.properties["oryx-forcompensation"]==false
	        					||$scope.dropTargetElement.properties["oryx-forcompensation"]=="false"||$scope.dropTargetElement.properties["oryx-forcompensation"]==undefined)))
        				{
	        				var command = new KISBPM.CreateCommand(option, $scope.dropTargetElement, pos, $scope.editor);
	        				$scope.editor.executeCommands([command]);
        				}
	        			//add by zhuyjh association can connect textannotation
	        			if(option.type.indexOf("Association")!=-1&&$scope.dropTargetElement._stencil._jsonStencil.id.indexOf("TextAnnotation")!=-1)
	        			{
	        				var command = new KISBPM.CreateCommand(option, $scope.dropTargetElement, pos, $scope.editor);
	        				$scope.editor.executeCommands([command]);
        				}
            		}
            	}
            	else
            	{

	                var option = {};
	                option['type'] = $scope.modelData.model.stencilset.namespace + item.id;
					option['namespace'] = $scope.modelData.model.stencilset.namespace;
					option['position'] = pos;
					if($scope.dragCanAttach)
						option['parent'] = undefined;
					else
						option['parent'] = $scope.dragCurrentParent;
	
	                var commandClass = ORYX.Core.Command.extend({
	                    construct: function (option, currentParent, canAttach, position, facade) {
	                        this.option = option;
	                        this.currentParent = currentParent;
	                        this.canAttach = canAttach;
	                        this.position = position;
	                        this.facade = facade;
	                        this.selection = this.facade.getSelection();
	                        this.shape;
	                        this.parent;
	                    },
	                    execute: function () {
	                        if (!this.shape) {
	                            this.shape = this.facade.createShape(option);
	                            this.parent = this.shape.parent;
	                        } else {
	                            this.parent.add(this.shape);
	                        }
	
	                        if ($scope.dragCanAttach && this.currentParent instanceof ORYX.Core.Node && this.shape.dockers.length > 0) {
	
	                            var docker = this.shape.dockers[0];
	
	                            if (this.currentParent.parent instanceof ORYX.Core.Node) {
	                                this.currentParent.parent.add(docker.parent);
	                            }
	
	                            docker.bounds.centerMoveTo(this.position);
	                            docker.setDockedShape(this.currentParent);
	                            //docker.update();
	                        }
	
	                        this.facade.setSelection([this.shape]);
	                        this.facade.getCanvas().update();
	                        this.facade.updateSelection();
	
	                    },
	                    rollback: function () {
	                        this.facade.deleteShape(this.shape);
	
	                        //this.currentParent.update();
	
	                        this.facade.setSelection(this.selection.without(this.shape));
	                        this.facade.getCanvas().update();
	                        this.facade.updateSelection();
	
	                    }
	                });
	
	                // Update canvas
	                var command = new commandClass(option, $scope.dragCurrentParent, false, pos, $scope.editor);
	                if(!((option.type.indexOf("Boundary")!=-1
	                		&&(command.currentParent._stencil._jsonStencil.id.indexOf("Task")==-1
	                				&&command.currentParent._stencil._jsonStencil.id.indexOf("Process")==-1
	                				&&command.currentParent._stencil._jsonStencil.id.indexOf("CallActivity")==-1
	                				&&command.currentParent._stencil._jsonStencil.id.indexOf("BusinessRule")==-1))||
	                				(option.type.indexOf("StartErrorEvent")!=-1
	            	                		&&(command.currentParent._stencil._jsonStencil.id.indexOf("Task")==-1
	            	                				&&command.currentParent._stencil._jsonStencil.id.indexOf("EventSubProcess")==-1
	            	                				&&command.currentParent._stencil._jsonStencil.id.indexOf("CallActivity")==-1
	            	                				&&command.currentParent._stencil._jsonStencil.id.indexOf("BusinessRule")==-1))||
	            	                ((option.type.indexOf("StartNoneEvent")!=-1||option.type.indexOf("StartTimerEvent")!=-1)
	            	                		&&command.currentParent._stencil._jsonStencil.id.indexOf("EventSubProcess")!=-1)
	                				))
	                $scope.editor.executeCommands([command]);
	
	                // Fire event to all who want to know about this
	                var dropEvent = { 
	                    type: KISBPM.eventBus.EVENT_TYPE_ITEM_DROPPED,
	                    droppedItem: item,
	                    position: pos
	                };
	                KISBPM.eventBus.dispatch(dropEvent.type, dropEvent);
            	}
            }

            $scope.dragCurrentParent = undefined;
            $scope.dragCurrentParentId = undefined;
            $scope.dragCurrentParentStencil = undefined;
            $scope.dragCanContain = undefined;
            $scope.quickMenu = undefined;
            $scope.dropTargetElement = undefined;
        };


        $scope.overCallback = function (event, ui) {
            $scope.dragModeOver = true;
        };

        $scope.outCallback = function (event, ui) {
            $scope.dragModeOver = false;
        };

        $scope.startDragCallback = function (event, ui) {
            $scope.dragModeOver = false;
            $scope.quickMenu = false;
        };
        
        $scope.startDragCallbackQuickMenu = function (event, ui) {
            $scope.dragModeOver = false;
            $scope.quickMenu = true;
        };
        
        $scope.dragCallback = function (event, ui) {
        	
            if ($scope.dragModeOver != false) {
            	
                var coord = $scope.editor.eventCoordinatesXY(event.pageX, event.pageY);
                
                var additionalIEZoom = 1;
                if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
                    var ua = navigator.userAgent;
                    if (ua.indexOf('MSIE') >= 0) {
                        //IE 10 and below
                        var zoom = Math.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
                        if (zoom !== 100) {
                            additionalIEZoom = zoom / 100
                        }
                    }
                }
                
                if (additionalIEZoom !== 1) {
                     coord.x = coord.x / additionalIEZoom;
                     coord.y = coord.y / additionalIEZoom;
                }
                
                var aShapes = $scope.editor.getCanvas().getAbstractShapesAtPosition(coord);
                
                if (aShapes.length <= 0) {
                    if (event.helper) {
                        $scope.dragCanContain = false;
                        return false;
                    }
                }

                if (aShapes[0] instanceof ORYX.Core.Canvas) {
                    $scope.editor.getCanvas().setHightlightStateBasedOnX(coord.x);
                }

                if (aShapes.length == 1 && aShapes[0] instanceof ORYX.Core.Canvas)
                {
                    var parentCandidate = aShapes[0];
                    if(parentCandidate.parent==null&&(event.target.id.indexOf("Boundary")!=-1||event.target.id.indexOf("StartErrorEvent")!=-1)){
                        document.getElementById("canvasHelpWrapper").style.cursor="no-drop";
                    }
                    
                    $scope.dragCanContain = true;
                    $scope.dragCurrentParent = parentCandidate;
                    $scope.dragCurrentParentId = parentCandidate.id;

                    $scope.editor.handleEvents({
                        type: ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
                        highlightId: "shapeRepo.attached"
                    });
                    $scope.editor.handleEvents({
                        type: ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
                        highlightId: "shapeRepo.added"
                    });
                    return false;
                }
                else 
                {
                    var item = $scope.getStencilItemById(event.target.id);
                    
                    var parentCandidate = aShapes.reverse().find(function (candidate) {
                        return (candidate instanceof ORYX.Core.Canvas
                            || candidate instanceof ORYX.Core.Node
                            || candidate instanceof ORYX.Core.Edge);
                    });
                    
                    if (!parentCandidate) {
                        $scope.dragCanContain = false;
                        return false;
                    }
                    
                    if (item.type === "node") {
                        
                        // check if the draggable is a boundary event and the parent an Activity
                        var _canContain = false;
                        var _canAttach=false;
                        var parentStencilId = parentCandidate.getStencil().id();

                        if ($scope.dragCurrentParentId && $scope.dragCurrentParentId === parentCandidate.id) {
                            return false;
                        }

                        var parentItem = $scope.getStencilItemById(parentCandidate.getStencil().idWithoutNs());
                        if (parentItem.roles.indexOf("Activity") > -1||parentItem.roles.indexOf("SubProcessMorph") > -1||parentItem.roles.indexOf("EventSubProcessMorph") > -1) {
                            if (item.roles.indexOf("IntermediateEventOnActivityBoundary") > -1) {
                                _canContain = false;
                                _canAttach = true;
                            }
                        }
                        else if (parentCandidate.getStencil().idWithoutNs() === 'Pool')
                        {
                        	if (item.id === 'Lane')
                        	{
                        		_canContain = true;
                        	}
                        }
                        
                        if (_canContain||_canAttach)
                        {
                        	document.getElementById("canvasHelpWrapper").style.cursor="default";
                        	$scope.editor.handleEvents({
                                type: ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW,
                                highlightId: "shapeRepo.attached",
                                elements: [parentCandidate],
                                style: ORYX.CONFIG.SELECTION_HIGHLIGHT_STYLE_RECTANGLE,
                                color: ORYX.CONFIG.SELECTION_VALID_COLOR
                            });

                            $scope.editor.handleEvents({
                                type: ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
                                highlightId: "shapeRepo.added"
                            });
                        }
                        else
                        {
                            for (var i = 0; i < $scope.containmentRules.length; i++) {
                                var rule = $scope.containmentRules[i];
                                if (rule.role === parentItem.id) {
                                    for (var j = 0; j < rule.contains.length; j++) {
                                        if (item.roles.indexOf(rule.contains[j]) > -1) {
                                        	if(!(item.id=="StartErrorEvent"&&rule.role=="SubProcess")&&!((item.id=="StartNoneEvent"||item.id=="StartTimerEvent")&&rule.role=="EventSubProcess")){
	                                            _canContain = true;
	                                            document.getElementById("canvasHelpWrapper").style.cursor="default";
	                                            break;
                                        	}
                                        }
                                    }

                                    if (_canContain) {
                                        break;
                                    }
                                }
                            }
                            // Show Highlight
                            $scope.editor.handleEvents({
                                type: ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW,
                                highlightId: 'shapeRepo.added',
                                elements: [parentCandidate],
                                color: _canContain ? ORYX.CONFIG.SELECTION_VALID_COLOR : ORYX.CONFIG.SELECTION_INVALID_COLOR
                            });

                            $scope.editor.handleEvents({
                                type: ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
                                highlightId: "shapeRepo.attached"
                            });
                        }
                        $scope.dragCurrentParent = parentCandidate;
                        $scope.dragCurrentParentId = parentCandidate.id;
                        $scope.dragCurrentParentStencil = parentStencilId;
                        $scope.dragCanContain = _canContain;
                        $scope.dragCanAttach = _canAttach;
                    }
                    else 
                    { 
                    	var canvasCandidate = $scope.editor.getCanvas();
                    	var canConnect = false;
                    	
                    	var targetStencil = $scope.getStencilItemById(parentCandidate.getStencil().idWithoutNs());
            			if (targetStencil)
            			{
            				var associationConnect = false;
            				if (window.stencil!=undefined&&stencil!=null&&stencil.idWithoutNs() === 'Association' && curCan.getStencil().idWithoutNs() === 'TextAnnotation')
            				{
            				    associationConnect = true;
            				}
                            else if (window.stencil!=undefined&&stencil!=null&&stencil.idWithoutNs() === 'DataAssociation' && curCan.getStencil().idWithoutNs() === 'DataStore')
                            {
                                associationConnect = true;
                            }
            				
            				if (targetStencil.canConnectTo || associationConnect)
            				{
            					canConnect = true;
            				}
            			}
                    	
                    	//Edge
                    	$scope.dragCurrentParent = canvasCandidate;
                    	$scope.dragCurrentParentId = canvasCandidate.id;
                        $scope.dragCurrentParentStencil = canvasCandidate.getStencil().id();
                        $scope.dragCanContain = canConnect;
                        
                    	// Show Highlight
                        $scope.editor.handleEvents({
                            type: ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW,
                            highlightId: 'shapeRepo.added',
                            elements: [canvasCandidate],
                            color: ORYX.CONFIG.SELECTION_VALID_COLOR
                        });

                        $scope.editor.handleEvents({
                            type: ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
                            highlightId: "shapeRepo.attached"
                        });
        			}
                }
            }
        };

        $scope.dragCallbackQuickMenu = function (event, ui) {
        	
            if ($scope.dragModeOver != false) {
                var coord = $scope.editor.eventCoordinatesXY(event.pageX, event.pageY);
                
                var additionalIEZoom = 1;
                if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
                    var ua = navigator.userAgent;
                    if (ua.indexOf('MSIE') >= 0) {
                        //IE 10 and below
                        var zoom = Math.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
                        if (zoom !== 100) {
                            additionalIEZoom = zoom / 100
                        }
                    }
                }
                
                if (additionalIEZoom !== 1) {
                     coord.x = coord.x / additionalIEZoom;
                     coord.y = coord.y / additionalIEZoom;
                }
                
                var aShapes = $scope.editor.getCanvas().getAbstractShapesAtPosition(coord);
               
                if (aShapes.length <= 0) {
                    if (event.helper) {
                        $scope.dragCanContain = false;
                        return false;
                    }
                }

                if (aShapes[0] instanceof ORYX.Core.Canvas) {
                    $scope.editor.getCanvas().setHightlightStateBasedOnX(coord.x);
                }
                
        		var stencil = undefined;
            	var stencilSets = $scope.editor.getStencilSets().values();
            	for (var i = 0; i < stencilSets.length; i++)
            	{
            		var stencilSet = stencilSets[i];
        			var nodes = stencilSet.nodes();
        			for (var j = 0; j < nodes.length; j++)
                	{
        				if (nodes[j].idWithoutNs() === event.target.id)
        				{
        					stencil = nodes[j];
        					break;
        				}
                	}
        			
        			if (!stencil)
        			{
        				var edges = stencilSet.edges();
            			for (var j = 0; j < edges.length; j++)
                    	{
            				if (edges[j].idWithoutNs() === event.target.id)
            				{
            					stencil = edges[j];
            					break;
            				}
                    	}
        			}
            	}
        		
                var candidate = aShapes.last();
                
                var isValid = false;
                if (stencil.type() === "node") 
                {
    				//check containment rules
    				var canContain = $scope.editor.getRules().canContain({containingShape:candidate, containedStencil:stencil});
    				
    				var parentCandidate = aShapes.reverse().find(function (candidate) {
                        return (candidate instanceof ORYX.Core.Canvas
                            || candidate instanceof ORYX.Core.Node
                            || candidate instanceof ORYX.Core.Edge);
                    });

                    if (!parentCandidate) {
                        $scope.dragCanContain = false;
                        return false;
                    }
    				
    				$scope.dragCurrentParent = parentCandidate;
                    $scope.dragCurrentParentId = parentCandidate.id;
                    $scope.dragCurrentParentStencil = parentCandidate.getStencil().id();
                    $scope.dragCanContain = canContain;
                    $scope.dropTargetElement = parentCandidate;
                    isValid = canContain;
    	
    			} else { //Edge
    			
    				var shapes = $scope.editor.getSelection();
            		if (shapes && shapes.length == 1)
            		{
            			var currentSelectedShape = shapes.first();
            			var curCan = candidate;
            			var canConnect = false;
            			
            			var targetStencil = $scope.getStencilItemById(curCan.getStencil().idWithoutNs());
            			if (targetStencil)
            			{
            				var associationConnect = false;
            				if (stencil.idWithoutNs() === 'Association' && curCan.getStencil().idWithoutNs() === 'TextAnnotation')  
            				{
            					associationConnect = true;
            				}
            				else if (stencil.idWithoutNs() === 'DataAssociation' && curCan.getStencil().idWithoutNs() === 'DataStore')
            				{
            				    associationConnect = true;
            				}
            				
            				if (targetStencil.canConnectTo || associationConnect)
	            			{
		        				while (!canConnect && curCan && !(curCan instanceof ORYX.Core.Canvas))
		        				{
		        					candidate = curCan;
		        					//check connection rules
		        					canConnect = $scope.editor.getRules().canConnect({
		        											sourceShape: currentSelectedShape, 
		        											edgeStencil: stencil, 
		        											targetShape: curCan
		        											});	
		        					curCan = curCan.parent;
		        				}
	            			}
            				//add by zhuyjh Association can connect TextAnnotation
            				if(associationConnect)
            					canConnect=true;
            			}
            			var parentCandidate = $scope.editor.getCanvas();
        				
        				isValid = canConnect;
        				$scope.dragCurrentParent = parentCandidate;
                        $scope.dragCurrentParentId = parentCandidate.id;
                        $scope.dragCurrentParentStencil = parentCandidate.getStencil().id();
        				$scope.dragCanContain = canConnect;
        				$scope.dropTargetElement = candidate;
            		}		
    				
    			}	

                $scope.editor.handleEvents({
					type:		ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW, 
					highlightId:'shapeMenu',
					elements:	[candidate],
					color:		isValid ? ORYX.CONFIG.SELECTION_VALID_COLOR : ORYX.CONFIG.SELECTION_INVALID_COLOR
				});
            }
        };

    }]);

var KISBPM = KISBPM || {};
//create command for undo/redo
KISBPM.CreateCommand = ORYX.Core.Command.extend({
	construct: function(option, currentReference, position, facade){
		this.option = option;
		this.currentReference = currentReference;
		this.position = position;
		this.facade = facade;
		this.shape;
		this.edge;
		this.targetRefPos;
		this.sourceRefPos;
		/*
		 * clone options parameters
		 */
        this.connectedShape = option.connectedShape;
        this.connectingType = option.connectingType;
        this.namespace = option.namespace;
        this.type = option.type;
        this.containedStencil = option.containedStencil;
        this.parent = option.parent;
        this.currentReference = currentReference;
        this.shapeOptions = option.shapeOptions;
	},			
	execute: function(){
		
		if (this.shape) {
			if (this.shape instanceof ORYX.Core.Node) {
				this.parent.add(this.shape);
				if (this.edge) {
					this.facade.getCanvas().add(this.edge);
					this.edge.dockers.first().setDockedShape(this.connectedShape);
					this.edge.dockers.first().setReferencePoint(this.sourceRefPos);
					this.edge.dockers.last().setDockedShape(this.shape);
					this.edge.dockers.last().setReferencePoint(this.targetRefPos);
				}
				
				this.facade.setSelection([this.shape]);
				
			} else if (this.shape instanceof ORYX.Core.Edge) {
				this.facade.getCanvas().add(this.shape);
				this.shape.dockers.first().setDockedShape(this.connectedShape);
				this.shape.dockers.first().setReferencePoint(this.sourceRefPos);
			}
			//resume = true;
		}
		else {
			this.shape = this.facade.createShape(this.option);
			this.edge = (!(this.shape instanceof ORYX.Core.Edge)) ? this.shape.getIncomingShapes().first() : undefined;
		}
		
		if (this.currentReference && this.position) {
			
			if (this.shape instanceof ORYX.Core.Edge) {
			
				if (!(this.currentReference instanceof ORYX.Core.Canvas)) {
					this.shape.dockers.last().setDockedShape(this.currentReference);
					
					if (this.currentReference.getStencil().idWithoutNs() === 'TextAnnotation')
					{
						var midpoint = {};
						midpoint.x = 0;
						midpoint.y = this.currentReference.bounds.height() / 2;
						this.shape.dockers.last().setReferencePoint(midpoint);
					}
					else
					{
						this.shape.dockers.last().setReferencePoint(this.currentReference.bounds.midPoint());
					}
				}
				else {
					this.shape.dockers.last().bounds.centerMoveTo(this.position);
				}
				this.sourceRefPos = this.shape.dockers.first().referencePoint;
				this.targetRefPos = this.shape.dockers.last().referencePoint;
				
			} else if (this.edge){
				this.sourceRefPos = this.edge.dockers.first().referencePoint;
				this.targetRefPos = this.edge.dockers.last().referencePoint;
			}
		} else {
			var containedStencil = this.containedStencil;
			var connectedShape = this.connectedShape;
			var bc = connectedShape.bounds;
			var bs = this.shape.bounds;
			
			var pos = bc.center();
			if(containedStencil.defaultAlign()==="north") {
				pos.y -= (bc.height() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET + (bs.height()/2);
			} else if(containedStencil.defaultAlign()==="northeast") {
				pos.x += (bc.width() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER + (bs.width()/2);
				pos.y -= (bc.height() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER + (bs.height()/2);
			} else if(containedStencil.defaultAlign()==="southeast") {
				pos.x += (bc.width() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER + (bs.width()/2);
				pos.y += (bc.height() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER + (bs.height()/2);
			} else if(containedStencil.defaultAlign()==="south") {
				pos.y += (bc.height() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET + (bs.height()/2);
			} else if(containedStencil.defaultAlign()==="southwest") {
				pos.x -= (bc.width() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER + (bs.width()/2);
				pos.y += (bc.height() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER + (bs.height()/2);
			} else if(containedStencil.defaultAlign()==="west") {
				pos.x -= (bc.width() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET + (bs.width()/2);
			} else if(containedStencil.defaultAlign()==="northwest") {
				pos.x -= (bc.width() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER + (bs.width()/2);
				pos.y -= (bc.height() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER + (bs.height()/2);
			} else {
				pos.x += (bc.width() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET + (bs.width()/2);
			}
			
			// Move shape to the new position
			this.shape.bounds.centerMoveTo(pos);
			
			// Move all dockers of a node to the position
			if (this.shape instanceof ORYX.Core.Node){
				(this.shape.dockers||[]).each(function(docker){
					docker.bounds.centerMoveTo(pos);
				});
			}
			
			//this.shape.update();
			this.position = pos;
			
			if (this.edge){
				this.sourceRefPos = this.edge.dockers.first().referencePoint;
				this.targetRefPos = this.edge.dockers.last().referencePoint;
			}
		}
		
		this.facade.getCanvas().update();
		this.facade.updateSelection();

	},
	rollback: function(){
		this.facade.deleteShape(this.shape);
		if(this.edge) {
			this.facade.deleteShape(this.edge);
		}
		//this.currentParent.update();
		this.facade.setSelection(this.facade.getSelection().without(this.shape, this.edge));
	}
});
