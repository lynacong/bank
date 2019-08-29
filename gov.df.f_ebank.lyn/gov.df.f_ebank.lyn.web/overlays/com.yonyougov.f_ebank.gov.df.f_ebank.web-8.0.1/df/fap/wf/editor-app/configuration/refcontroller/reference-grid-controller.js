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
 * Grid Reference Controller
 */

var KisBpmReferenceGridCtrl = [ '$scope', '$modal', '$timeout', '$translate', function($scope, $modal, $timeout, $translate) {

    // Config for the modal window
    var opts = {
        template:  'editor-app/configuration/properties/reference/grid/reference-popup.html?version=' + Date.now(),
        scope: $scope
    };

    // Open the dialog
    $modal(opts);
}];

var KisBpmReferenceGridPopupCtrl = ['$scope', '$q', '$translate', '$http', '$timeout', '$cookieStore', function($scope, $q, $translate, $http, $timeout, $cookieStore) {
	
	$scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
	
	//Page config
    $scope.totalServerItems = 0;
    
    $scope.pagingOptions = {
        pageSizes: [5, 10, 15],
        pageSize: $cookieStore.get($scope.property.key + "_pagesize") || 5,
        currentPage: 1
    };
    
	$scope.setPagingData = function(data, page, pageSize, totalServerItems){	
        $scope.gridData = data;
        $scope.totalServerItems = totalServerItems;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
    	if(isNaN(page)){
    		return;
    	}
        setTimeout(function () {
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http({
                	method: 'GET',
                	url: KISBPM.URL.getReferenceData($scope.property.dataUrl),
                	params: {searchText: searchText, pageSize:pageSize, currentPage:page}
                }).success(function (largeLoad) {	
					var data = largeLoad.content;				
                    data = data.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data, page, pageSize, largeLoad.totalCount);
                });            
            } else {
            	$http({
                	method: 'GET',
                	url: KISBPM.URL.getReferenceData($scope.property.dataUrl),
                	params: {pageSize:pageSize, currentPage:page}
                }).success(function (largeLoad) {
                    $scope.setPagingData(largeLoad.content, page, pageSize, largeLoad.totalCount);
                });
            }
        }, 100);
    };
	
    //$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
	
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
    	$cookieStore.put($scope.property.key + "_pagesize", newVal.pageSize);
        if (newVal !== oldVal && (newVal.currentPage !== oldVal.currentPage || newVal.pageSize != oldVal.pageSize)) {
        	if(newVal.pageSize != oldVal.pageSize){
        		//pageSize改变,重新加载第一页数据.
        		$scope.pagingOptions.currentPage = 1;
        	}
        	
        	$scope.pagingOptions.currentPage = parseInt($scope.pagingOptions.currentPage);
        	
        	$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    
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
	//grid selected properties
	$scope.selectedProperties = [];
	//result-grid selected properties
	$scope.resultSelectedProperties = [];
	//result-grid properties
	$scope.refResultData = [];
	if($scope.property.value && $scope.property.value.refResultData){
		$scope.refResultData = $scope.property.value.refResultData.clone();
	}
	
	
    $q.all(promises).then(function(results) {
    	var getColumnDef = function(field){
			return { 
				field: field.id, 
				displayName: field.displayName, 
				width: field.width || 120,
				visible: (typeof($scope.property.fields[i].visible) == "boolean") ? $scope.property.fields[i].visible : true,
				groupable: false
			};
    	}
    	
    	var getResultColumnDef = function(field){
			return { 
				field: field.id, 
				displayName: field.displayName,
				width: 100,
				visible: false,
				groupable: false
			};
    	}
    	
    	var visibleFields = $cookieStore.get($scope.property.key + "_refGridColumns");
    	if(!visibleFields){
    		visibleFields = "";
    	}
    	
        $scope.translationsRetrieved = true;
        
        $scope.columnDefs = [];
        
        $scope.resultColumnDefs = [];
		
        var width = 0;
        var resultWidth = 0;
        
        var lastShowIndex = -1;
        var lastResultShowIndex = -1;
		var len = results.length;
		for(var i = 0; i < len; i++){
			$scope.property.fields[i].displayName = $scope.property.fields[i].displayName || results[i];
			
			$scope.columnDefs[i] = getColumnDef($scope.property.fields[i]);
			$scope.resultColumnDefs[i] = getResultColumnDef($scope.property.fields[i]);
			
			if(visibleFields && visibleFields.length > 0){
				if(visibleFields.indexOf($scope.columnDefs[i].field) != -1){
					$scope.columnDefs[i].visible = true;
				}else{
					$scope.columnDefs[i].visible = false;
				}
			}
			
			if($scope.property.fields[i].resultField){
				$scope.resultColumnDefs[i].visible = true;
				resultWidth += $scope.resultColumnDefs[i].width;
				lastResultShowIndex = i;
			}
			
			if($scope.columnDefs[i].visible){
				width += $scope.columnDefs[i].width;
				lastShowIndex = i;
			}
		}
		
		//reset last show column width
		if(width < 705){
			$scope.columnDefs[lastShowIndex].width = null;
		}
		//reset result grid last show column width
		if(resultWidth < 200){
			$scope.resultColumnDefs[lastResultShowIndex].width = null;
		}
		
    	// Config for grid
        $scope.gridOptions = {
            data: 'gridData',
            enableRowReordering: true,
            headerRowHeight: 28,
            multiSelect: $scope.property.multiSelect,
			showSelectionCheckbox : false,
            keepLastSelected : false,
            selectedItems: $scope.selectedProperties,
			/*Config for pagination*/
			enablePaging : true,
			totalServerItems: 'totalServerItems',
			pagingOptions : $scope.pagingOptions,
			filterOptions: $scope.filterOptions,
			
			showFooter: true,
			showColumnMenu: true,
			showFilter: true,
			
            columnDefs: $scope.columnDefs,
            
            i18n: "zh-cn",
            
            primaryKey: "pk",
            
            init: function(grid, $scope){
            	var a = 0;
            }
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
    
    $scope.$watch('gridOptions.$gridScope.columns', function (newVal, oldVal) {
    	if(newVal && newVal.length > 0){
    		var visible_fields = [];
    		for(var i = 0; i < newVal.length; i++){
    			var val = newVal[i];
    			if(val && val.visible){
    				visible_fields.push(val.field);
    			}
    		}
    		
    		if(visible_fields.length == 0){
    			for(var i = 0; i < oldVal.length; i++){
	    			var val = oldVal[i];
	    			if(val){
	    				newVal[i].visible = val.visible;
		    			if(val.visible){
		    				visible_fields.push(val.field);
		    			}
	    			}
	    		}
    		}
    		
    		$cookieStore.put($scope.property.key + "_refGridColumns", visible_fields);
    	}
    }, true);
    
    // Click handler for add button
    $scope.addProperty = function() {
    	var len = $scope.selectedProperties.length;
    	for(var i = 0; i < len; i++){
    		var prop = $scope.selectedProperties[i];
    		
    		var len1 = $scope.refResultData.length;
    		var contains = false;
    		for(var j = 0; j < len1; j++){
    			var prop1 = $scope.refResultData[j];
    			if(prop1[$scope.property.pkField] == prop[$scope.property.pkField]){
    				contains = true;
    				break;
    			}
    		}
    		
    		if(!contains){
    			$scope.refResultData.push(prop);
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
					$scope.property.value.showValue += $scope.refResultData[i][$scope.property.returnField];
				}
	        }else{
	        	$scope.property.value = null;
	        }
    	}else{
    		var len = $scope.selectedProperties.length;
    		if(len > 0){
    			$scope.property.value = {};
	            $scope.property.value.refResultData = $scope.selectedProperties;
				$scope.property.value.showValue = $scope.property.value.refResultData[0][$scope.property.returnField];
    		}else{
    			$scope.property.value = null;
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

}];
