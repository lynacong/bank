
/**
 * 预览附件
 * @param attach_id
 */
var srcPath;
var curtokenid;
function previewFile(dataList,fileName,isVoucher,tokenid,pagesize) {
	curtokenid=tokenid;
	  $.ajax({
		type : 'GET',
		url : '/df/f_ebank/common/report/previewFile.do?ajax=noCache&tokenid=' + tokenid,
		data : {
			"datas" : JSON.stringify(dataList),
			"fileName" : fileName,
			"isVoucher":isVoucher,
			"pagesize":pagesize
		},
		dataType : 'JSON',
		async: true,
		beforeSend: ip.loading(true),
		success : function(result) {
			if (result.errorCode === '0') {
				var mydata = result.data;
				var typeFlag = mydata.typeFlag;
					$('#csof-right-iframe').media({width:"100%",height:540,autoplay: true,src:mydata.htmlString});
					ip.loading(false);
					$('#preview-attach-box').modal({backdrop: 'static'});
				
					
			    srcPath = mydata.srcPath;
			} else {
				ip.ipInfoJump(result.message, "error");
			}
		}
	});
};


function previewFileNew(dataList,fileName,isVoucher,tokenid) {
	curtokenid=tokenid;
	  $.ajax({
		type : 'GET',
		url : '/df/f_ebank/common/report/previewFile.do?ajax=noCache&tokenid=' + tokenid,
		data : {
			"datas" : JSON.stringify(dataList),
			"fileName" : fileName,
			"isVoucher":isVoucher
		},
		dataType : 'JSON',
		async: true,
		beforeSend: ip.loading(true),
		success : function(result) {
			if (result.errorCode === '0') {
				
				var mydata = result.data;
				var typeFlag = mydata.typeFlag;
					
					ip.loading(false);
					//$('#preview-attach-box').modal({backdrop: 'static'});
					sessionStorage.setItem('pdfData', mydata.htmlString);
					var oWin= window.open ("/df/rounte/admin/pages/report/report.html?tokenid="+tokenid, "报表预览", "height=950, width=800, top=300, left=400, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no");
					
			    srcPath = mydata.srcPath;
			} else {
				ip.ipInfoJump(result.message, "error");
			}
		}
	});
};



function isIE8() {
	    if (typeof navigator !== "undefined" &&
	      /MSIE [1-8]\./.test(navigator.userAgent)) {
	      return true;
	    } else {
	      return false;
	    }
	  }

/* 关闭预览 */
function clsoePreview() {
	  $('#preview-attach-box').modal('hide');
	  $('#other').html('');
	  $('#other').html('<div id="csof-right-iframe" style="width:98%;height:430px;overflow-y:auto;"></div>');
	  if (srcPath != '') {
		  $.ajax({
			  type : 'POST',
			  url : '/df/f_ebank/common/report/closePreview.do?tokenid=' + curtokenid,
			  data : {
				  'fileName' : srcPath
			  },
		  	  dataType : 'JSON',
		  	  success : function (result) {
		  		if (result.errorCode == '-1') {
		  		  ip.ipInfoJump(result.message, "error");
		  		}
		  	  },
		  	  error : function (result) {
		  		ip.ipInfoJump("预览关闭出现异常，文件未及时删除," + result.message, "error");
		  	  }
		  });
	  }
};

//导出报表文件
exportTxt=function(dataList,fileName,isVoucher,tokenid,pagesize){
	

	 if (isIE8()) {
		 
		 var datas =JSON.stringify(dataList).replace(/\"/g,"'");
		 var str = '<form id="downloadForm" style="display:none" target="" method="post" action="/df/f_ebank/common/report/download.do?ajax=noCache&tokenid=';
		 str = str+ tokenid+'">'; 
		 str = str+'<input type="hidden" name="datas" value="';
		 str=str+datas+'">';
		 str=str+'<input type="hidden" name="fileName" value="';
		 str=str+fileName+'">';
		 str=str+'<input type="hidden" name="pagesize" value="';
		 str=str+pagesize+'"></form>';
		 var form = $(str);
		  
            $('body').append(form);

            form.submit();
           // $('#downloadForm').submit();
            form.remove();
           // $('#downloadForm').remove();
	    }else{
	    	 var form = $("<form id='downloadForm'>");
	            form.attr('style', 'display:none');
	            form.attr('target', '');
	            form.attr('method', 'post');
	           /* form.attr('type', 'submit');
	            form.attr('enctype', 'multipart/form-data');*/
	            var url = '/df/f_ebank/common/report/download.do?ajax=noCache&tokenid=' + tokenid;
	            form.attr('action', url);
	            var input = $('<input>');
	            input.attr('type', 'hidden');
	            input.attr('name', 'datas');
	            input.attr('value', JSON.stringify(dataList));
	            var input1 = $('<input>');
	            input1.attr('type', 'hidden');
	            input1.attr('name', 'fileName');
	            input1.attr('value', fileName);
	            var input2 = $('<input>');
	            input2.attr('type', 'hidden');
	            input2.attr('name', 'pagesize');
	            input2.attr('value',  pagesize);
	            $('body').append(form);
	            form.append(input);
	            form.append(input1);
	            form.append(input2);
	            //form.submit();
	            $('#downloadForm').submit();
	            //form.remove();
	            $('#downloadForm').remove();	
	            
	    }

};
