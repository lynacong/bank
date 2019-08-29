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
 * Execution listeners
 */
var KisBpmTextTypeCtrl = [ '$scope', function($scope) {
	
	$scope.items = [
	    {value:"text", text:"纯文本"},           
		{value:"html", text:"html"}];
        
    $scope.textTypeChanged = function() {
    	switch($scope.property.value){
			case "text":
				$scope.property.value = "纯文本";
				break;
			case "html":
				$scope.property.value = "html";
				break;
		}
    	$scope.updatePropertyInModel($scope.property);
		var facade=$scope.editor.selection[0].facade;
		var current=$scope.editor.selection[0];
		facade.setSelection($scope.editor.selection[0].parent);
		facade.setSelection(current);
    };
}];