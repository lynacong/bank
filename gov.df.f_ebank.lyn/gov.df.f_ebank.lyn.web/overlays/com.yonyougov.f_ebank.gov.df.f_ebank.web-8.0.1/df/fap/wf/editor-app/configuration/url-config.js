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
var KISBPM = KISBPM || {};

KISBPM.URL = {

    getModel: function(modelId) {
        return window.location.pathname.substring(0,window.location.pathname.indexOf("/",1))+'/service' + '/model/' + modelId + '/json?version=' + Date.now();
        //return window.location.pathname.substring(0,window.location.pathname.indexOf("/",1))+'/model/json?modelId='+modelId+'&version='+Date.now();

    
    },
    
    getInnerTable: function(modelId) {
        return window.location.pathname.substring(0,window.location.pathname.indexOf("/",1))+'/service' + '/get/innerTable?version=' + Date.now();
    },
    //获得要素/非要素信息 
    getEleValue: function() {
        return window.location.pathname.substring(0,window.location.pathname.indexOf("/",1))+'/service' + '/get/eleValue?version=' + Date.now();
    },
    
    //获得非要素
    getNoEleValue: function() {
        return window.location.pathname.substring(0,window.location.pathname.indexOf("/",1))+'/service' + '/get/getNoElementData?version=' + Date.now();
    },
    
    //保存非要素的常量\变量信息 
    saveParaValue: function() {
        return window.location.pathname.substring(0,window.location.pathname.indexOf("/",1))+'/service' + '/create/saveParaValue?version=' + Date.now();
    },
    
    //删除规则参数
    deleteRuleParam: function() {
        return window.location.pathname.substring(0,window.location.pathname.indexOf("/",1))+'/service' + '/get/deleteRuleParam?version=' + Date.now();
    },
    
  //获得表达式
    getExpBySetting: function() {
        return window.location.pathname.substring(0,window.location.pathname.indexOf("/",1))+'/service' + '/get/getExpBySetting?version=' + Date.now();
    },
    

    getStencilSet: function() {
        return window.location.pathname.substring(0,window.location.pathname.indexOf("/",1))+'/service' + '/editor/stencilset?version=' + Date.now();
    },

    putModel: function(modelId) {
        return window.location.pathname.substring(0,window.location.pathname.indexOf("/",1))+'/service' + '/model/' + modelId + '/save';
    },
    
    putModelInfo: function() {
        return window.location.pathname.substring(0,window.location.pathname.indexOf("/",1))+'/service' + '/model/save';
    },
    
    getReferenceData: function(dataUrl){
		if(dataUrl.indexOf("?") != -1){
			return window.location.pathname.substring(0,window.location.pathname.indexOf("/",1))+'/service' + dataUrl + '&version=' + Date.now();
		}else{
			return window.location.pathname.substring(0,window.location.pathname.indexOf("/",1))+'/service' + dataUrl + '?version=' + Date.now();
		}
	},
	
	getApplicationPath: function(){
		return window.location.pathname.substring(0,window.location.pathname.indexOf("/",1));
	}
	
};