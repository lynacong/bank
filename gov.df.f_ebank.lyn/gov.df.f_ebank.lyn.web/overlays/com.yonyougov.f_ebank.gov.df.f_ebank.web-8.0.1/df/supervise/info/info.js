require(['jquery', 'knockout','/df/supervise/ncrd.js','bootstrap', 'uui', 'tree', 'grid', 'ip'],
function ($, ko,ncrd) {
	window.ko = ko;
	//与后台交互的路径
	var GET_TREE_URL = '/df/csofinfo/getTree.do';
	var GET_TAB_URL ='/df/csofinfo/getdisplaytitle.do';
	var GET_YEAR_URL = '/df/csofinfo/getyear.do';
	var GET_DATA_URL = '/df/csofinfo//getData.do';
	var testURL = '/df/cs/test.do';
	var selInfotreeNode,selPer,selMonth,reportFile;//定义获取报表url的参数
	var libData;//用于切换库获取预算单位的参数
	var infoDate=new Date();//获取当前年度
	var nowyear=infoDate.getFullYear();//默认显示当前年度
	var nowmonth=infoDate.getMonth()+1;//当前月份
	if(nowmonth <10 ){
			nowmonth = "0"+nowmonth;
	}
	var reportData;//用于获取reportFile
	var str;
	var viewModel={
			treeKeyword: ko.observable(""),
			findTree: function () {
		            ncrd.findTreeNode($.fn.zTree.getZTreeObj("infotree1"), viewModel.treeKeyword());
		     },
		     infoTree1Setting: {
	                view:{
	                    showLine: false,
	                    selectedMulti: false,
	                    showIcon: false,
	                    showTitle: true
	                },
	                callback:{
	                    onClick:function(e,id,node){
	                    	selInfotreeNode = node.id;
	                    	selPer = $("#dataPeriod").val();
	                    	var monval = $('.showcolor').val();
	                    	if(monval < 10){
	                    		monval = "0" + monval;
	                    	}
	                    	selMonth = monval;
	                    	getreportFile($(".active").val());
	                    	viewModel.showReport(selInfotreeNode,selPer,selMonth,reportFile);
	                    }
	                }
	            },
	            infoTree1DataTable: new u.DataTable({
	                meta: {
	                	'SET_YEAR':{
		                        'value':""
		                 },    
	                    'CHR_ID': {
	                        'value':""
	                    },
	                    'CHR_CODE':{
	                        'value':""
	                    },
	                    'DISP_CODE': {
	                        'value':""
	                    },
	                    'CHR_NAME':{
	                        'value':""
	                    },
	                    'LEVEL_NUM':{
	                        'value':""
	                    },
	                    'IS_LEAF':{
	                        'value':""
	                    },
	                    'ENABLED':{
	                        'value':""
	                    },
	                    'CREATE_DATE':{
	                        'value':""
	                    },
	                    'CREATE_USER':{
	                        'value':""
	                    },
	                    'LATEST_OP_DATE':{
	                        'value':""
	                    },
	                    'IS_DELETED':{
	                        'value':""
	                    },
	                    'LATEST_OP_USER':{
	                        'value':""
	                    },
	                    'LAST_VER':{
	                        'value':""
	                    },
	                    'RG_CODE':{
	                        'value':""
	                    },
	                    'PARENT_ID': {
	                        'value':""
	                    },
	                    'MOFDEP_ID':{
	                        'value':""
	                    }
	                }
	            })
	};
	//获取树
	viewModel.getInfoTree = function(treeElecode){
		$.ajax({
            type: 'GET',
            url: GET_TREE_URL + "?tokenid=" + ip.getTokenId() + "&ajax=noCache",
            data: {"ele_code": treeElecode},
            dataType: 'JSON',
            async: false,
            success: function (result) {
            	if(result.data.length>0) {
            		var dep_array = [];
            		for(var i=0;i<result.data.length;i++) {
            			if(result.data[i].PARENT_ID == "" || result.data[i].PARENT_ID == null) {
            				result.data[i].PARENT_ID = "000";
            			}
            			var chrName = result.data[i].CHR_CODE + " " +result.data[i].CHR_NAME;
            			var depArray = {
                                "CHR_ID": result.data[i].CHR_ID,
                                "CHR_CODE": result.data[i].CHR_CODE,
                                "DISP_CODE": result.data[i].DISP_CODE,
                                "CHR_NAME": chrName,
                                "LEVEL_NUM": result.data[i].LEVEL_NUM,
                                "IS_LEAF": result.data[i].IS_LEAF,
                                "TYPE": result.data[i].TYPE,
                                "ENABLED": result.data[i].ENABLED,
                                "CREATE_DATE": result.data[i].CREATE_DATE,
                                "CREATE_USER": result.data[i].CREATE_USER,
                                "LATEST_OP_DATE": result.data[i].LATEST_OP_DATE,
                                "IS_DELETED": result.data[i].IS_DELETED,
                                "LATEST_OP_USER": result.data[i].LATEST_OP_USER,
                                "LAST_VER": result.data[i].LAST_VER,
                                "RG_CODE": result.data[i].RG_CODE,
                                "SET_YEAR": result.data[i].SET_YEAR,
                                "PARENT_ID": result.data[i].PARENT_ID,
                            }
            			dep_array.push(depArray);
            		}
            		var depArray = {
                            "CHR_ID": "000",
                            "CHR_CODE": "",
                            "DISP_CODE": "",
                            "CHR_NAME": "全部",
                            "LEVEL_NUM": "",
                            "IS_LEAF": "",
                            "TYPE": "",
                            "ENABLED": "",
                            "CREATE_DATE": "",
                            "CREATE_USER": "",
                            "LATEST_OP_DATE": "",
                            "IS_DELETED": "",
                            "LATEST_OP_USER": "",
                            "LAST_VER": "",
                            "RG_CODE": "",
                            "SET_YEAR": "",
                            "PARENT_ID": "",
                            "OID": ""
                        }
        			dep_array.push(depArray);
            		viewModel.infoTree1DataTable.setSimpleData(dep_array);
            		viewModel.infoTree1DataTable.setSimpleData(dep_array,{unSelect:true});
            		var treeObj = $.fn.zTree.getZTreeObj("infotree1");
                    treeObj.expandAll(true);
            	}
            }, error: function () {
                ip.ipInfoJump("错误", 'error');
            }
        });
	}
	//库列表
	viewModel.getAllLibrary = function(eleCode){
		$.ajax({
          type: 'GET',
          url: GET_DATA_URL + "?tokenid=" + ip.getTokenId() + "&ajax=noCache",
          data: {"ele_code":eleCode},
          dataType: 'JSON',
          async: false,
          success: function (result) {
        	  if(result.data.length>0){
        		  var libraryData = result.data;
        		  libData = result.data;
				  for(var i=0;i<libraryData.length;i++){
  						$("#library").append("<option>"+libraryData[i].CHR_NAME+"</option>");
					}
        		  if(libraryData[0].CHR_ID){
						var index = libraryData[0].ELE_CODE.lastIndexOf("\_");  
        				str  = libraryData[0].ELE_CODE.substring(index + 1, libraryData[0].ELE_CODE.length);
        				viewModel.getInfoTree(libraryData[0].ELE_CODE);
        				viewModel.getTab(libraryData[0].CHR_ID);
        		  }

        	  }
        	  else{
        		  
        	  }
          },
          error: function(){
        	  
          }
		});
	};
	//切换库
	viewModel.method = function(){
		var val=$("#library").val();
		if(libData){
			for(var i=0;i<libData.length;i++){
				if(libData[i].CHR_NAME == val){
					var index = libData[i].ELE_CODE.lastIndexOf("\_");  
					str  = libData[i].ELE_CODE.substring(index + 1, libData[i].ELE_CODE.length);
					viewModel.getInfoTree(libData[i].ELE_CODE);
					viewModel.getTab(libData[i].CHR_ID);
				}
			}
		}
		else{
			
		}
	};

	//获取期间
	viewModel.getALLPeriod = function(){
		$.ajax({
	          type: 'GET',
	          url: GET_YEAR_URL + "?tokenid=" + ip.getTokenId() + "&ajax=noCache",
	          data: {"ele_code":"CSOF_YEAR"},//ele_code对应业务年度
	          dataType: 'JSON',
	          async: false,
	          success: function (result) {
			    if(result.data.length>0){
					var periodData = result.data;
					$("#dataPeriod").append('<option selected>' + nowyear + '</option>');
					for(var i=0;i<periodData.length;i++){
						if( periodData[i].SET_YEAR != nowyear){
							$("#dataPeriod").append("<option>"+periodData[i].SET_YEAR+"</option>");
						}
					}
				}
				else{
					alert("没有查到数据!");
				}
			  },
			  error: function(){
				
			  }
		});
	};
	

	/*
	 * 根据库的CHR_ID去获取页签
	 * 参数chrId
	 */
	viewModel.getTab = function (chrId){
		$.ajax({
	          type: 'GET',
	          url: GET_TAB_URL + "?tokenid=" + ip.getTokenId() + "&ajax=noCache",
	          data: {"chr_id":chrId},
	          dataType: 'JSON',
	          async: false,
	          success: function (result) {
				var tabData = result.data;
				reportData = tabData;
				if(tabData.length>0){
					var secLevel = [];//显示为第二级的页签
					var firLevel = [];//显示为第一级的页签
					for(var j=0;j<tabData.length;j++){
						if(tabData[j].PARENT_ID){
							secLevel.push(tabData[j]);
						}
						else{
							firLevel.push(tabData[j]);
						}
					}
					//通过IS_LEAF去判断能不能点击页签，有子节点则不能点击,去掉href属性
					//先判断默认的第一个
					if(firLevel[0].IS_LEAF == 1){
						//firLevel[0].CHR_ID == 1
						$("#myTab").append("<li id='"+firLevel[0].CHR_ID+"a"+"' value='"+firLevel[0].CHR_ID+"' class='active'><a href='#"+firLevel[0].CHR_ID+"' onclick='getreportFile("+firLevel[0].CHR_ID+")' data-toggle='tab'>"+firLevel[0].DISPLAY_TITLE+"</a></li>");
						$("#myTabContent").append("<div class='tab-pane fade in active' id='"+firLevel[0].CHR_ID +"'></div>");
						viewModel.showReport("",nowyear,nowmonth,firLevel[0].REPORT_FILE);
					}
					else{
						$("#myTab").append("<li id='"+firLevel[0].CHR_ID+"a"+"' value='"+firLevel[0].CHR_ID+"' class='active'><a data-toggle='tab'>"+firLevel[0].DISPLAY_TITLE+"</a></li>");						
					}
					//再判断其他的
					for(var i=1;i<firLevel.length;i++){
						if(firLevel[i].IS_LEAF == 1){
							$("#myTab").append("<li id='"+firLevel[i].CHR_ID+"a"+"' value='"+firLevel[i].CHR_ID+"'><a href='#"+firLevel[i].CHR_ID+"' data-toggle='tab' onclick='getreportFile("+firLevel[i].CHR_ID+")' >"+firLevel[i].DISPLAY_TITLE+"</a></li>");
							$("#myTabContent").append("<div class='tab-pane fade ' id='"+firLevel[i].CHR_ID +"'></div>");
						}
						else{
							$("#myTab").append("<li id='"+firLevel[i].CHR_ID+"a"+"' value='"+firLevel[i].CHR_ID+"'><a  data-toggle='tab'>"+firLevel[i].DISPLAY_TITLE+"</a></li>");
						}
					}
					//将第二级页签放在第一级下面				
					 for (var m = 0;m < secLevel.length; m++) {
			                for (n = 0; n < firLevel.length; n++) {
			                    if (firLevel[n].CHR_ID == secLevel[m].PARENT_ID) {
			                    	$("#myTabContent").append("<div class='tab-pane fade' id='"+secLevel[m].CHR_ID +"'></div>");
			                    	var list = $('#'+firLevel[n].CHR_ID+"a").find("ul");
			                    	//判断对应li下是否已经存在ul
			                    	if(list.length > 0){
			                    		$('#'+firLevel[n].CHR_ID+"a").find("ul").append("<li value='"+secLevel[m].CHR_ID+"'><a href='#"+secLevel[m].CHR_ID+"' onclick='getreportFile("+secLevel[m].CHR_ID+")' tabindex='-1' data-toggle='tab'>"+secLevel[m].DISPLAY_TITLE+"</a></li>");
			                    	}
			                    	else{
			                    		$('#'+firLevel[n].CHR_ID+"a").addClass('dropdown');
			                    		$('#'+firLevel[n].CHR_ID+"a").removeAttr("data-toggle","tab");
			                    		$('#'+firLevel[n].CHR_ID+"a").find("a").attr("id",firLevel[n].CHR_ID);
			                    		$('#'+firLevel[n].CHR_ID+"a").find("a").attr("data-toggle","dropdown");
			                    		$('#'+firLevel[n].CHR_ID+"a").find("a").addClass("dropdown-toggle");
			                    		$('#'+firLevel[n].CHR_ID+"a").find("a").append("<b class='caret'></b>");
			                    		$('#'+firLevel[n].CHR_ID+"a").append(
													"<ul class='dropdown-menu' role='menu' aria-labelledby='"+firLevel[n].CHR_ID+ "'>" +
														"<li value='"+secLevel[m].CHR_ID+"'><a href='#"+secLevel[m].CHR_ID+"' onclick='getreportFile("+secLevel[m].CHR_ID+")' tabindex='-1' data-toggle='tab'>"+secLevel[m].DISPLAY_TITLE+"</a></li>" +
													"</ul>"
										);
			                    	}
			                    }
			                }
			            }	
				}
				else{
					alert("没有查到数据！");
					$("#myTab").html('');
					$('#myTabContent').html('');
				}
			},
			error: function(){
				
			}
		});
	}
	//先突出显示月份
	viewModel.monthshownow = function(){
		$("#a"+nowmonth).addClass('showcolor');
	}
	//拿到report_file
	getreportFile = function(chrid){
		for(var i=0;i<reportData.length;i++){
			if(reportData[i].CHR_ID == chrid){
				reportFile = reportData[i].REPORT_FILE;
			}
		}
		if(selInfotreeNode){
			viewModel.showReport(selInfotreeNode,selPer,selMonth,reportFile);
		}
		else{
			selPer = $("#dataPeriod").val();
        	var monval = $('.showcolor').val();
        	if(monval < 10){
        		monval = "0" + monval;
        	}
        	selMonth = monval;
			viewModel.showReport("",selPer,selMonth,reportFile);
		}
		
	} ;
	//切换年度
	periodChange = function(){
		 var periodVal = $("#dataPeriod").val();
		 selPer = periodVal;
		 if(selInfotreeNode){
			viewModel.showReport(selInfotreeNode,selPer,selMonth,reportFile);
		}
		 else{
			 viewModel.showReport("",selPer,selMonth,reportFile);
		 }
	};
	//点击月份
	changeMonth = function(id){
		var id= id;
		$('#'+id).siblings().removeClass('showcolor');
		$('#'+id).addClass('showcolor');
		var mval=$("#"+id).val();
		if(mval<10){
			mval = "0"+mval;
		}
		if(selInfotreeNode){
			viewModel.showReport(selInfotreeNode,selPer,mval,reportFile);
		}
		else{
			viewModel.showReport("",selPer,mval,reportFile);
		}
	}
	
	/*
	 * 显示报表
	 * 参数，必须有4个，左边预算单位树节点，期间，月份,reportFile(报表)
	 * 分别定义为selInfotreeNode,selPer,selMonth,reportFile;
	 *
	 */
	viewModel.showReport = function(treenode,year,month,file){
		console.log(treenode+year+month+file);
		$.ajax({
			            type: 'GET',
			            url: testURL + "?tokenid=" + ip.getTokenId() + "&ajax=noCache",
			            data: {"rid":file,"bbq":year+month},
			            dataType: 'JSON',
			            async: false,
			            success: function (result) {
			                if (result.data != null) {
			                    var report_url = result.data;
								if(treenode){
									report_url +=  "&"+ str+"_ID=" +treenode;
								}
								else{
									report_url +=  "&"+ str+"_ID=" +null;
								}
			                    console.log(report_url);
			                    for(var i=0;i<reportData.length;i++){
			            			if(file == reportData[i].REPORT_FILE){
			            				 $("div #"+reportData[i].CHR_ID+"").html('');
			            				//$("div #"+reportData[i].CHR_ID+"").append("<iframe style='margin-top:20px;width:90%;height:400px;margin-left:5%;overflow-y:auto;' id='url_iframe'></iframe>");
				            			// $("#url_iframe")[0].src = report_url;
			            				 $("div #"+reportData[i].CHR_ID+"").append("<p style='border:1px solid #ccc;height:200px;'>" +report_url+"</p>");
			            			}
			            		}
			                } else {
			                    ip.ipInfoJump("错误", 'error');
			                }
			            }, 
						error: function () {
			                ip.ipInfoJump("错误", 'error');
			            }
			        });		
	};
	 function init(){
			var app = u.createApp(
					{
						el: document.body,
						model: viewModel
					}
			);
			var url=window.location.href;
			var eleCode = url.split("elecode=")[1].split("&")[0];//获取登录路径参数
			viewModel.getAllLibrary(eleCode);//获取库
			viewModel.getALLPeriod();//获取期间
			viewModel.monthshownow();
	    };

	    init();

});