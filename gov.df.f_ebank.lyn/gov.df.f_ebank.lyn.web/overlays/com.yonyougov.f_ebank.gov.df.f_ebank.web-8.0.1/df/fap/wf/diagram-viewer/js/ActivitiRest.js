var ActivitiRest = {
	options: {},
	getProcessDefinitionByKey: function(processDefinitionKey, callback) {/*
		var url = Lang.sub(this.options.processDefinitionByKeyUrl, {processDefinitionKey: processDefinitionKey});
		
		$.ajax({
			url: url,
			dataType: 'jsonp',
			cache: false,
			async: true,
			success: function(data, textStatus) {
				var processDefinition = data;
				if (!processDefinition) {
					console.error("Process definition '" + processDefinitionKey + "' not found");
				} else {
				  callback.apply({processDefinitionId: processDefinition.id});
				}
			}
		}).done(function(data, textStatus) {
			console.log("ajax done");
		}).fail(function(jqXHR, textStatus, error){
			console.error('Get diagram layout['+processDefinitionKey+'] failure: ', textStatus, 'error: ', error, jqXHR);
		});
	*/
		

		var url =""; //Lang.sub(this.options.processDefinitionByKeyUrl, {processDefinitionKey: processDefinitionKey});
		
		$.ajax({
			url: url,
			dataType: 'jsonp',
			cache: false,
			async: true,
			success: function(data, textStatus) {
				if(navigator.userAgent.indexOf("Firefox")>0)
	              {
	                  if(data instanceof Object && data.activities!=undefined)
	                     var data1=data;
	                  else
	                     var data1=eval('('+arguments[2].responseText+')');
	              }
	               else{
	               if(data instanceof Object && data.activities!=undefined)
	                     var data1=data;
	                  else
	                     var data1=eval('('+data+')');
	               }
	              var processDefinition = data1;
				if (!processDefinition) {
					console.error("Process definition '" + processDefinitionKey + "' not found");
				} else {
				  callback.apply({processDefinitionId: processDefinition.id});
				}
			}
		}).done(function(data, textStatus) {
			console.log("ajax done");
		}).fail(function(jqXHR, textStatus, error){
			return;
			//console.error('Get diagram layout['+processDefinitionKey+'] failure: ', textStatus, 'error: ', error, jqXHR);
		});
	},
	
	/*getProcessDefinition: function(processDefinitionId, callback) {
		var url = Lang.sub(this.options.processDefinitionUrl, {processDefinitionId: processDefinitionId});
		
		$.ajax({
			url: url,
			dataType: 'jsonp',
			cache: false,
			async: true,
			success: function(data, textStatus) {
				var processDefinitionDiagramLayout = data;
				if (!processDefinitionDiagramLayout) {
					console.error("Process definition diagram layout '" + processDefinitionId + "' not found");
					return;
				} else {
					callback.apply({processDefinitionDiagramLayout: processDefinitionDiagramLayout});
				}
			}
		}).done(function(data, textStatus) {
			console.log("ajax done");
		}).fail(function(jqXHR, textStatus, error){
			console.log('Get diagram layout['+processDefinitionId+'] failure: ', textStatus, jqXHR);
		});
	},*/
	
	getProcessDefinition: function(processDefinitionId, processInstanceId, callback) {
		//var path = (window.location+'').split('/'); 
      //	var basePath = path[0]+'//'+path[2]+'/'+path[3];
		getTokenId = function() {
			var current_url = location.search;
			var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8, current_url.indexOf("tokenid") + 48);
			return tokenid;
		}
		var tokenid = getTokenId();
      	var uri="/df/pay/common/query/doWfStatusShow.do?tokenid=" + tokenid;
      	 var obj = {};
      	 obj.processDefinitionId=processDefinitionId;
      	 obj.processInstanceId=processInstanceId;
      	obj.ajax="noCache";
      	var json = eval(obj);
		$.ajax({
			url: uri,
//			dataType: 'jsonp',
			 contentType:'text/json',
			cache: false,
			data: json,
			async: true,
			success: function(data, textStatus) {
				if(navigator.userAgent.indexOf("Firefox")>0)
	              {
	                  if(data instanceof Object && data.activities!=undefined)
	                     var data1=data;
	                  else
	                     var data1=eval('('+arguments[2].responseText+')');
	              }
	               else{
	               if(data instanceof Object && data.activities!=undefined)
	                     var data1=data;
	                  else
	                     var data1=eval('('+data+')');
	               }
	              var processDefinitionDiagramLayout = data1;
				if (!processDefinitionDiagramLayout) {
					console.error("Process definition diagram layout '" + processDefinitionId + "' not found");
					return;
				} else {
					callback.apply({processDefinitionDiagramLayout: processDefinitionDiagramLayout});
				}
			}
		}).done(function(data, textStatus) {
			console.log("ajax done");
		}).fail(function(jqXHR, textStatus, error){
			//console.log('Get diagram layout['+processDefinitionId+'] failure: ', textStatus, jqXHR);
			return;
		});
	},
	
	
	getHighLights: function(processInstanceId,processDefinitionId, callback) {/*
		var url = Lang.sub(this.options.processInstanceHighLightsUrl, {processInstanceId: processInstanceId});
		
		$.ajax({
			url: url,
			dataType: 'jsonp',
			cache: false,
			async: true,
			success: function(data, textStatus) {
				console.log("ajax returned data");
				var highLights = data;
				if (!highLights) {
					console.log("highLights not found");
					return;
				} else {
					callback.apply({highLights: highLights});
				}
			}
		}).done(function(data, textStatus) {
			console.log("ajax done");
		}).fail(function(jqXHR, textStatus, error){
		  console.log('Get HighLights['+processInstanceId+'] failure: ', textStatus, jqXHR);
		});
	*/

		var path = (window.location+'').split('/'); 
      	var basePath = path[0]+'//'+path[2]+'/'+path[3];
      	
      	getTokenId = function() {
			var current_url = location.search;
			var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8, current_url.indexOf("tokenid") + 48);
			return tokenid;
		}
		var tokenid = getTokenId();
      	var uri="/df/pay/common/query/getHighlightsProcessInstance.do?tokenid=" + tokenid;
      	
      	
      	//var uri=basePath+"/poc/settlement/task/highlightsprocessInstance";
      	 var obj = {};
      	 obj.processInstanceId=processInstanceId;
      	 obj.processDefinitionId=processDefinitionId;
      	obj.ajax="noCache";
      	var json = eval(obj);
		$.ajax({
			url: uri,
//			dataType: 'jsonp',
			cache: false,
			 contentType:'text/json',
			data: json,
			async: true,
			success: function(data, textStatus) {
				console.log("ajax returned data");
				if(navigator.userAgent.indexOf("Firefox")>0)
	              {
	                  if(data instanceof Object && data.activities!=undefined)
	                     var data1=data;
	                  else
	                     var data1=eval('('+arguments[2].responseText+')');
	              }
	               else{
	               if(data instanceof Object && data.activities!=undefined)
	                     var data1=data;
	                  else
	                     var data1=eval('('+data+')');
	               }
	              var highLights = data1;
				if (!highLights) {
					console.log("highLights not found");
					return;
				} else {
					callback.apply({highLights: highLights});
				}
			}
		}).done(function(data, textStatus) {
			console.log("ajax done");
		}).fail(function(jqXHR, textStatus, error){
		  //console.log('Get HighLights['+processInstanceId+'] failure: ', textStatus, jqXHR);
			return;
		});
		
	
	}
};