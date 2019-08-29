require(['jquery', 'knockout', 'bootstrap', 'uui', 'director', 'tree', 'grid','ip'],
function ($, ko) {
    var viewModelWrite = {
        data: ko.observable({}),
    }
    viewModelWrite.showDemo = function () {
        // 调用的平台信息提示弹窗组件ipInfoJump（在ip.js内可以查看）
		ip.ipInfoJump("hello world!");
        // var gridObj = $("#grid").parent()[0]['u-meta'].grid;
        // $("#delete-region-notice").modal({backdrop: 'static', keyboard: false});
        // $("#delete-region-notice").modal("hide");
		// localStorage.setItem("tokenid", tokenid);
		// var tokenid = localStorage.getItem("tokenid");
    }
    viewModelWrite.printHtml = function () {
        var downPdf = document.getElementById("pdf-wrap");
            downPdf.onclick = function() {
                html2canvas(document.body, {
                    onrendered: function(canvas) {

                        //返回图片dataURL，参数：图片格式和清晰度(0-1)
                        var pageData = canvas.toDataURL('image/jpeg', 1.0);

                        //方向默认竖直，尺寸ponits，格式a4[595.28,841.89]
                        var pdf = new jsPDF('', 'pt', 'a4');

                        //addImage后两个参数控制添加图片的尺寸，此处将页面高度按照a4纸宽高比列进行压缩
                        pdf.addImage(pageData, 'JPEG', 0, 0, 595.28, 592.28 / canvas.width * canvas.height);

                        pdf.save('stone.pdf');

                    }
                })
            }
    }
    $(function () {
		ko.cleanNode($('.demo-continer')[0]);
		app = u.createApp({
			el: '.demo-continer',
			model: viewModelWrite
		});
    });
});
