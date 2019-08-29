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

var KisBpmMultiInstancePriorityCtrl = [ '$scope', function($scope) {
	
	$scope.items = [
	    {value:"5",  text:ORYX.I18N.MultiInstance.Priority5},         
		{value:"10", text:ORYX.I18N.MultiInstance.Priority10},
		{value:"15", text:ORYX.I18N.MultiInstance.Priority15},           
		{value:"20", text:ORYX.I18N.MultiInstance.Priority20},
		{value:"25", text:ORYX.I18N.MultiInstance.Priority25},           
		{value:"30", text:ORYX.I18N.MultiInstance.Priority30},
		{value:"35", text:ORYX.I18N.MultiInstance.Priority35},           
		{value:"40", text:ORYX.I18N.MultiInstance.Priority40},
		{value:"45", text:ORYX.I18N.MultiInstance.Priority45},           
		{value:"50", text:ORYX.I18N.MultiInstance.Priority50},
		{value:"55", text:ORYX.I18N.MultiInstance.Priority55},           
		{value:"60", text:ORYX.I18N.MultiInstance.Priority60},
		{value:"65", text:ORYX.I18N.MultiInstance.Priority65},           
		{value:"70", text:ORYX.I18N.MultiInstance.Priority70},
		{value:"75", text:ORYX.I18N.MultiInstance.Priority75},           
		{value:"80", text:ORYX.I18N.MultiInstance.Priority80},
		{value:"85", text:ORYX.I18N.MultiInstance.Priority85},           
		{value:"90", text:ORYX.I18N.MultiInstance.Priority90},
		{value:"95", text:ORYX.I18N.MultiInstance.Priority95},           
		{value:"100", text:ORYX.I18N.MultiInstance.Priority100}];
        
    $scope.multiInstancePriorityChanged = function() {
    	switch($scope.property.value){
			case "5":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority5;
				break;
			case "15":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority15;
				break;
			case "20":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority20;
				break;
			case "25":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority25;
				break;
			case "30":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority30;
				break;
			case "35":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority35;
				break;
			case "40":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority40;
				break;
			case "45":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority45;
				break;
			case "50":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority50;
				break;
			case "55":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority55;
				break;
			case "60":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority60;
				break;
			case "65":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority65;
				break;
			case "70":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority70;
				break;
			case "75":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority75;
				break;
			case "80":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority80;
				break;
			case "85":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority85;
				break;
			case "90":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority90;
				break;
			case "95":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority95;
				break;
			case "100":
				$scope.property.showtext = ORYX.I18N.MultiInstance.Priority100;
				break;
		}
    	$scope.updatePropertyInModel($scope.property);
    };
}];