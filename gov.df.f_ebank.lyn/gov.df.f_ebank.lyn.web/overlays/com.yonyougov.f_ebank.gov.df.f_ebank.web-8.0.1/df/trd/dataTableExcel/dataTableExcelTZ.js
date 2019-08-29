         var capital = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var digit = [1, 26, 676, 17576];
         var capital_zero = "-0ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        //导出dataTable数据到Excel文件中
        function export2ExcelTZ(dataTable, options, fileName,numThousandFlag) {
           
            options = options || {};
            options.type = options.type === "select" ? options.type : "all";
            options.fieldMap = (options.fieldMap instanceof Array ? options.fieldMap : []);
            fileName = fileName || "导出文件" + getCurrentDate() + ".xlsx";
            if (fileName.slice(-5).toLowerCase() != '.xlsx') {
                fileName = fileName + ".xlsx";
            }

            var sheet = dtData2Sheet(dataTable, options,numThousandFlag);
            if (options && typeof options.onBeforeSave == "function") {
                sheet = options.onBeforeSave(sheet) || sheet;
            }
            saveExcelFile(sheet, fileName);
        }

        //以下载文件的方式保存导出的Excel文件
        function saveExcelFile(sheet, fileName) {
            var wb = {
                SheetNames: ['Sheet1'],
                Sheets: {
                    'Sheet1': sheet
                }
            };
            var wopts = {bookType: 'xlsx', bookSST: false, type: 'binary'};
            var wbout = XLSX.write(wb, wopts);

            saveAs(new Blob([s2ab(wbout)], {type: ""}), fileName);
        }

    

        //将dataTable中数据转为Sheet数据格式
        function dtData2Sheet(dataTable, options,numThousandFlag) {
        	//begin_导出没有小计_2018-04-24
        	   //定义变量
        	       avi_money_total=0.0;
        	       use_money_total=0.0;
        	       pay_money_total=0.0;
        	       payed_money_total=0.0;
        	       plan_money_total=0.0;
        	       canuse_money_total=0.0;
        	       yusuan_total=0.0;
        	//end_导出没有小计_2018-04-24
        	
            //var rows = (options.type === "select" ? dataTable.getSelectedRows() : dataTable.getAllRows());
            var sheet = {};
            var fields = options.fieldMap;
            var exportCodeName = options.exportCodeName;
            var colWidth = [];
            
            for (var h = 0; h < fields.length; h++) {
                if (fields[h] && fields[h].fieldName) {
                	   sheet[index2ColName(h + 1) + "1"] = {"v": (fields[h].title ? fields[h].title : fields[h].fieldName)};
                }
                if(h==0){
                	fields[h].field_width="600";
                	 colWidth.push({
         				wpx: parseInt(fields[h].field_width)
         			});
                }else{
                	 colWidth.push({
          				wpx: parseInt(fields[h].field_width)
          			});
                	
                }
               
            }
            
            
            
            for (var r = 0; r < dataTable.rows.length; r++) {
                for (var c = 0; c < fields.length; c++) {
                    if (fields[c] && fields[c].fieldName) {
                    	//wuchr 功能分类要导出code + name
                    	if(exportCodeName){
                    		for(var q = 0; q < exportCodeName.length; q++){
                    			if(exportCodeName[q].field_name == fields[c].fieldName){
                    				var v = dataTable.rows[r][exportCodeName[q].field_code]+dataTable.rows[r][exportCodeName[q].field_name];
                    				break;
                    			}
                    			var v = dataTable.rows[r][fields[c].fieldName];
                    		}
                    		
                    		//取出每一行的合计项
                  		  if(fields[c].fieldName=="avi_money"){
                  			  v = numThousandFlag==undefined?numThousandBreak(v):v;
                  			  avi_money_total+=parseFloat(v);
                  		  }
                  		  if(fields[c].fieldName=="yusuan"){
                  			  v = numThousandFlag==undefined?numThousandBreak(v):v;
                  			  yusuan_total+=parseFloat(v);
                  		  }
                  		  if(fields[c].fieldName=="use_money"){
                  			  use_money_total+=parseFloat(v); 
                  		  }
                  		  if(fields[c].fieldName=="pay_money"){
                  			  pay_money_total+=parseFloat(v); 
                  		  }
                  		  if(fields[c].fieldName=="plan_money"){
                  			  plan_money_total+=parseFloat(v); 
                  		  }
                  		  if(fields[c].fieldName=="canuse_money"){
                  			  v = numThousandFlag==undefined?numThousandBreak(v):v;
                  			  canuse_money_total+=parseFloat(v); 
                  		  }
                  		  if(fields[c].fieldName=="payed_money"){
                  			  v = numThousandFlag==undefined?numThousandBreak(v):v;
                  			  payed_money_total+=parseFloat(v); 
                  		  }
                  		  if(fields[c].fieldName=="pay_progress"){
                  				  v = parseFloat(v).toFixed(1); 
                  		  }
                  		  if(fields[c].fieldName=="dif_progress"){
                  			  v = parseFloat(v).toFixed(2);
                  		  }
                    		
                    	}else{
                    		//begin_导出没有小计_2018-04-24
                    		  var v = dataTable.rows[r][fields[c].fieldName];
                    		  
                    		  //取出每一行的合计项
                    		  if(fields[c].fieldName=="avi_money"){
                    			  v = numThousandFlag==undefined?numThousandBreak(v):v;
                    			  avi_money_total+=parseFloat(v);
                    		  }
                    		  if(fields[c].fieldName=="yusuan"){
                    			  v = numThousandFlag==undefined?numThousandBreak(v):v;
                    			  yusuan_total+=parseFloat(v);
                    		  }
                    		  if(fields[c].fieldName=="use_money"){
                    			  use_money_total+=parseFloat(v); 
                    		  }
                    		  if(fields[c].fieldName=="pay_money"){
                    			  pay_money_total+=parseFloat(v); 
                    		  }
                    		  if(fields[c].fieldName=="plan_money"){
                    			  plan_money_total+=parseFloat(v); 
                    		  }
                    		  if(fields[c].fieldName=="canuse_money"){
                    			  v = numThousandFlag==undefined?numThousandBreak(v):v;
                    			  canuse_money_total+=parseFloat(v); 
                    		  }
                    		  if(fields[c].fieldName=="payed_money"){
                    			  v = numThousandFlag==undefined?numThousandBreak(v):v;
                    			  payed_money_total+=parseFloat(v); 
                    		  }
                    		  if(fields[c].fieldName=="pay_progress"){
                    			  //if(v!=0){
                    				  v = parseFloat(v).toFixed(1); 
                    			  //}
                    			  //v_per=v;
                    			  //v=v + '%';
                    		  }
                    		  if(fields[c].fieldName=="dif_progress"){
                    			  v = parseFloat(v).toFixed(2);
                    			  //v_per=v;
                    		  }
                    		  
                    		//end_导出没有小计_2018-04-24
                    		
                    	}
                        if (v) {
                        	if(fields[c].type == "decimal"){
                        		//if(c==0){
                        		   if(fields[c].fieldName == "sort_progress"){
                        			   sheet[index2ColName(c + 1) + (r + 2+1)] = {"v": v,"t": "n"};
                        		   }else if(fields[c].fieldName == "pay_progress" || fields[c].fieldName == "dif_progress"){
                        			   if(fields[c].fieldName == "pay_progress"){
                        				   v=v*0.01;
                        				   if(v==0){
                        					   sheet[index2ColName(c + 1) + (r + 3)] = {"v": v,"t": "n", "z": "#,##0.0%"};
                        				   }else{
                        					   sheet[index2ColName(c + 1) + (r + 3)] = {"v": v,"t": "n", "z": "#.0%"};
                        				   }
                        				    
                        			   }else{
                        				   sheet[index2ColName(c + 1) + (r + 2+1)] = {"v": v,"t": "n"}; 
                        			   }
                        		   }else{
                        			   var v= delcommafy(v);
                           			   sheet[index2ColName(c + 1) + (r + 2+1)] = {"v": v,"t": "n", "z": "#,##0.00"}; 
                        		   }
                        		    
                        		//}
                        	}else{
                        		sheet[index2ColName(c + 1) + (r + 2+1)] = {"v": v};
                        	}
                        }
                    }
                }
            }
			          //begin_导出没有小计_2018-04-24
			            for (var c = 0; c < fields.length; c++) {
			            	 if (fields[c] && fields[c].fieldName) {
			            		 
			                 		  if(c==0){
			                 			 v="小计";
			                 		  }else if(fields[c].fieldName=="avi_money"){
			                			  v=dataTable.footer[0].avi_money;
			                			  v = numThousandFlag==undefined?numThousandBreak(v):v;
			                		  }else if(fields[c].fieldName=="yusuan"){
			                			  v=dataTable.footer[0].yusuan;
			                			  v = numThousandFlag==undefined?numThousandBreak(v):v;
			                		  }else if(fields[c].fieldName=="canuse_money"){
			                			  v=dataTable.footer[0].canuse_money; 
			                			  v = numThousandFlag==undefined?numThousandBreak(v):v;
			                		  }else if(fields[c].fieldName=="dif_progress"){
			                			  v=dataTable.footer[0].dif_progress;
			                			  if(v.indexOf("+")>-1){
			                				  v=v.substring(1,v.length);
			                			  }
			                		  }else if(fields[c].fieldName=="pay_progress"){
			                			  v=dataTable.footer[0].pay_progress; 
			                		  }else if(fields[c].fieldName=="payed_money"){
			                			  v=dataTable.footer[0].payed_money;
			                			  v = numThousandFlag==undefined?numThousandBreak(v):v;
			                		  }else{
			                			 v=null; 
			                		  }
			                 	
			            		 if (v) {
			                     	if(fields[c].type == "decimal"){
			                     		//sheet[index2ColName(c + 1) + (dataTable.rows.length + 2)] = {"v": v,"t": "n", "z": "#,##0.00"};
			                     		//if(c==0){
			                     		if(fields[c].fieldName == "pay_progress" || fields[c].fieldName == "dif_progress"){
			                     			if(fields[c].fieldName == "pay_progress"){
			                     				//v=v+'%';
			                     				v = parseFloat(v).toFixed(1);
			                     				v=v*0.01;
			                     				sheet[index2ColName(c + 1) + (2)] = {"v": v,"t": "n", "z": "#.0%"};
			                     			}else{
			                     				sheet[index2ColName(c + 1) + (2)] = {"v": v,"t": "n"}; 
			                     			}
			                     			
			                     		}else{
			                     			var v= delcommafy(v);
			                     			sheet[index2ColName(c + 1) + (2)] = {"v": v,"t": "n", "z": "#,##0.00"};
			                     		}
			                     		    
			                     	//	}
			                     	}else{
			                     		//sheet[index2ColName(c + 1) + (dataTable.rows.length + 2)] = {"v": v};
			                     		sheet[index2ColName(c + 1) + (2)] = {"v": v};
			                     	}
			                     }
			            	 }
			               }
			          //end_导出没有小计_2018-04-24
            
            sheet["!ref"] = "A1:" + index2ColName(Math.max(fields.length, 1)) + (r + 2);
            sheet["!cols"] = colWidth;
            return sheet;
        }
        
        function numThousandBreak (value) {
            if (value == 0) {
                return parseFloat(value).toFixed(2);
            }
            if (value != "") {
           	 value = Number(value)/10000;
                var num = "";
                value = parseFloat(value).toFixed(2);
                if (value.indexOf(".") == -1) {
                    num = value.replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
                        return s + ',';
                    });
                } else {
                    num = value.replace(/(\d)(?=(\d{3})+\.)/g, function (s) {
                        return s + ',';
                    });
                }
            }
            
           	 return num;
       }
       

        //String转换为ArrayBuffer
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i < s.length; ++i) {
                view[i] = s.charCodeAt(i) & 0xFF;
            }
            return buf;
        }

       
        //index转为列名，如：28 转为 AB
        function index2ColName(index) {
            var colName = "";
            var j = 0;
            for (var i = digit.length - 1; i >= 0; i--) {
                j = Math.floor(index / digit[i]);
                if (j > 0) {
                    colName += capital[j - 1];
                    index = index % digit[i];
                } else {
                    if (colName.length > 0) {
                        colName += "0"
                    }
                }
            }
            colName = colName.split("");
            for (var x = colName.length - 1; x >= 0; x--) {
                if (colName[x] == "0") {
                    if (colName.join("").substring(0, x).replace(/0/g, "") != "") { //向高位借位处理0
                        colName[x] = "Z";
                        colName[x - 1] = capital_zero[capital_zero.indexOf(colName[x - 1]) - 1];
                    } else {
                        break;
                    }
                } else if (colName[x] == "-") {  //向高位借位，还低位的借位
                    colName[x] = "Y";
                    colName[x - 1] = capital_zero[capital_zero.indexOf(colName[x - 1]) - 1];
                }
            }
            return colName.join("").replace(/0/g, "");
        }

        function getCurrentDate() {
            var d = new Date();
            return "" + d.getFullYear() +
                (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1) +
                (d.getDate() < 10 ? "0" : "") + d.getDate() +
                (d.getHours() < 10 ? "0" : "") + d.getHours() +
                (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() +
                (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();
        }

        //检测浏览是否是IE9及以下版本
        function isIE9() {
            if (typeof navigator !== "undefined" &&
                /MSIE [1-9]\./.test(navigator.userAgent)) {
                return true;
            } else {
                return false;
            }
        }

        //通过ActiveX控件方式导出数据，用于IE9及以下版本，需要安装了Excel才能使用。
        function export_ActiveX(dataTable, options, fileName) {
            if (!(dataTable instanceof u.DataTable)) {
                ip.ipInfoJump("dataTable参数不正确!", "error");
                return;
            }
            options = options || {};
            options.type = options.type === "select" ? options.type : "all";
            options.fieldMap = (options.fieldMap instanceof Array ? options.fieldMap : []);
            fileName = fileName || "导出文件" + getCurrentDate() + ".xlsx";
            if (fileName.slice(-5).toLowerCase() != '.xlsx') {
                fileName = fileName + ".xlsx";
            }
            var sheet = dtData2Sheet_ActiveX(dataTable, options, fileName);
        }

       //通过ActiveX控件方式将数据写入Excel文件中
        function dtData2Sheet_ActiveX(dataTable, options, fileName) {
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                var oXL;
                try {
                    oXL = new ActiveXObject("Excel.Application"); //创建AX对象excel
                    //oXL.Visible = true;
                } catch (e) {
                    ip.ipInfoJump("无法启动Excel!\n\n请确认电脑已经安装了Excel并且IE安全级别已调整。\n\n具体操作：\n\n" + "工具 → Internet选项 → 安全 → 自定义级别 → 对没有标记为安全的ActiveX进行初始化和脚本运行 → 启用", "error");
                    return false;
                }
                try {
                    var oWB = oXL.Workbooks.Add();
                    var oSheet = oWB.ActiveSheet;

                    var rows = (options.type === "select" ? dataTable.getSelectedRows() : dataTable.getAllRows());
                    var fields = options.fieldMap;
                    for (var h = 0; h < fields.length; h++) {
                        if (fields[h] && fields[h].fieldName) {
                            oSheet.Cells(1, h + 1).value = fields[h].title ? fields[h].title : fields[h].fieldName;
                        }
                    }
                    for (var r = 0; r < rows.length; r++) {
                        for (var c = 0; c < fields.length; c++) {
                            if (fields[c] && fields[c].fieldName) {
                                var v = rows[r].getValue(fields[c].fieldName);
                                if (v) {
                                    oSheet.Cells(r + 2, c + 1).value = v;
                                }
                            }
                        }
                    }

                    oXL.FileDialog(2).InitialFileName = fileName;
                    if (oXL.FileDialog(2).Show() != 0 && oXL.FileDialog(2).SelectedItems.Count > 0) {
                        oWB.SaveAs(oXL.FileDialog(2).SelectedItems.Item(1));
                    }
                    oWB.Close(false);
                } finally {
                    oXL.Quit();
                }
            }


        }
        
        
        
        
        /**
         * 数字格式转换成千分位
         *@param{Object}num
         */
        function commafy(num){
          if((num+"").Trim()==""){
           return"";
          }
          if(isNaN(num)){
           return"";
          }
          num = num+"";
          if(/^.*\..*$/.test(num)){
           varpointIndex =num.lastIndexOf(".");
           varintPart = num.substring(0,pointIndex);
           varpointPart =num.substring(pointIndex+1,num.length);
           intPart = intPart +"";
            var re =/(-?\d+)(\d{3})/
            while(re.test(intPart)){
             intPart =intPart.replace(re,"$1,$2")
            }
           num = intPart+"."+pointPart;
          }else{
           num = num +"";
            var re =/(-?\d+)(\d{3})/
            while(re.test(num)){
             num =num.replace(re,"$1,$2")
            }
          }
          return num;
        }
         
        /**
         * 去除千分位
         *@param{Object}num
         */
         
        function delcommafy(num){
          if((num+"").trim()==""){
           return"";
          }
          num=num.replace(/,/gi,'');
          return num;
        }
        
        

       