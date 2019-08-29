require(['jquery', 'knockout', 'bootstrap', 'uui', 'grid', 'ip'],
	function($, ko) {
		var viewModel = {
			inputGrid:[],
			data: ko.observable({}),
			dataTable: new u.DataTable({
				meta: {
					"nametimedistancecurrencycatagory":"",
					"nametime":"",
					"distancecurrencycatagory":"",
					"name": "",
					"time": "",
					"distance": "",
					"currency": "",
					"catagory1": "",
					"catagory2": "",
					"catagory3": ""
				}
			}),
			comItems2: [{
				'value': "a",
				'name': "a"
			}, {
				"value": "b",
				"name": "b"
			}, {
				"value": "c",
				"name": "c"
			}, {
				"value": "d",
				"name": "d"
			}]
		};
		//grid表格数据 的定义
		// var data=[];
		var data=[{
			"name": "赵四",
			"time": "2016-05-16",
			"distance": "25",
			"currency": "200.00",
		    "catagory": "类型一"
		},{
			"name": "张三",
			"time": "2016-05-16",
			"distance": "25",
			"currency": "200.00",
		    "catagory": "类型一"
		},{
			"name": "李四",
			"time": "2016-05-16",
			"distance": "25",
			"currency": "200.00",
		    "catagory": "类型一"
		},{
			"name": "王麻子",
			"time": "2016-05-16",
			"distance": "25",
			"currency": "200.00",
		    "catagory": "类型一"
		},{
			"name": "张三",
			"time": "2016-05-16",
			"distance": "25",
			"currency": "200.00",
		    "catagory": "类型一"
		}];
		var datas=[{
			"name": "赵四",
			"time": "2016-05-16",
			"distance": "25",
			"currency": "200.00",
		    "catagory": "类型一"
		}];
		
			/*
			 * 新增一行
			 * 参数1：要添加的数据， 参数2：添加的位置
			 */

		viewModel.addRow = function() {
				var gridObj = $("#grid").parent()[0]['u-meta'].grid;
				console.log(gridObj);
				viewModel.dataTable.addSimpleData([{
					"name": "value1",
					"time": "value2",
					"distance": "value3",
					"currency": "value4"
				}], "new");
				// gridObj.addRows([{
				// 	"name": "value1",
				// 	"time": "value2",
				// 	"distance": "value3",
				// 	"currency": "value4"
				// }], 1);
			}
			/*
			 * 删除行
			 * 参数：要删除的行索引组成的数组
			 */
		viewModel.delRows = function() {
				var gridObj = $("#grid").parent()[0]['u-meta'].grid;
				gridObj.deleteRows([1, 2, 3]);
			}
			/*
			 * 修改行：参数1：被修改行的index
                       参数2： 修改之后的数据信息
			 */
		viewModel.updateRow = function() {
				var gridObj = $("#grid").parent()[0]['u-meta'].grid;
				gridObj.updateRow(0, {
					"name": "value1",
					"time": "value2",
					"distance": "value3",
					"currency": "value4"
				});
			}
			/*
			 * 获取选中行
			 */
		viewModel.getSelectRows = function() {
				// var gridObj = $("#grid").parent()[0]['u-meta'].grid;
				// var select = gridObj.getSelectRows();
				// warnJumpMsg("请在控制台查看打印的选中的对象", "", "");
				// console.log(select);
				app.getComp('grid').setColumnFixed('distance',true);
			}
			/*
			 * 双击表格行事件
			 */ 
		viewModel.onDblClickFun1 = function() {
				alert("我是双击行出来的");
			}
		viewModel.dateFun = function(obj) {
			var code_name = "";
			var html = "";
			if (obj.value != "") {
				var values = obj.value.split("@");
				code_name = values[2] + " " + decodeURI(values[1]);
			} else {
				code_name = "";
			}
			var html = '<div class="input-group modal-input-group"><input type="text" name="show-assit-tree-input" class="form-control" style="margin:2px 0;" value="' + code_name + '">'
					+ '<span class="input-group-btn" name="show-assit-tree-render"><button class="btn btn-default glyphicon glyphicon-option-horizontal controlTreeIcon"  style="margin-top:-2px;"></button></span></div>';
			obj.element.innerHTML = html;
			viewModel.field_name = obj.gridCompColumn.options.field;
			// $("span[name='show-assit-tree-render']").off('click');
			// $('input', $('td')).off('click');
			$("span[name='show-assit-tree-render']").on("click",function(){
				alert("sssssssssssss");
				obj.element.innerHTML = "kkkkkkkkkkkkk";

				showAssitTree(field_name,field_name,0,viewModel.dataTable,0);
			});
		}
			/*
			 * 编辑某列时候的自定义方法
			 */
		editTypeFun1 = function(obj) {
			console.log(obj);
				var code_name = "";
				var html = "";
				if (obj.value != "") {
					var values = obj.value.split("@");
					code_name = values[2] + " " + decodeURI(values[1]);
				} else {
					code_name = "";
				}
				var html = '<div class="input-group modal-input-group"><input name="show-assit-tree-input" type="text" id="' + obj.element.id + '" class="form-control" style="margin:2px 0;" value="' + code_name + '">'
						+ '<span class="input-group-btn" name="show-assit-tree"><button class="btn btn-default glyphicon glyphicon-option-horizontal controlTreeIcon"  style="margin-top:-2px;"></button></span></div>';

				obj.element.innerHTML = html; // 创建编辑时的显示内容
				var field_name = obj.field;
				$("span[name='show-assit-tree']").on("click",function(){
					alert("-----------------");
					obj.element.innerHTML = "kkkkkkkkkkkkk";
					ip.showAssitTree(field_name,field_name,0,viewModel.dataTable,0,obj.field);
				});
				// $("span[name='show-assit-tree']").click();
				// $('input', $('td')).off('keydown');
				// $("input[name='show-assit-tree-input']").off("keydown");
				// $("input[name='show-assit-tree-input']").on("keydown",function(event){
					    // event=document.all?window.event:event;
					// setTimeout(function(event){
					    // if((event.keyCode || event.which)==13){
					    	// alert("----------");
					     	// $("span[name='show-assit-tree']").click();
					    // }
					// },500)
				// });
				// var a = new cusComp($('#ss')); // 创建控件
				// a.setValue(obj.value) // 将当前的数据传入控件


				// neoui-kero中grid
				//   oThis.createDefaultEdit(eType, eOptions, options, viewModel, column);
    //             column.editType = function(obj) {


    //             	// 输入控件的代码
    //             	// https://github.com/iuap-design/neoui-kero/blob/release/src/keroa-string.js
    //             	// blur触发setValue
    //             	// setValue的逻辑
    //             	// https://github.com/iuap-design/neoui-kero-mixin/blob/release/src/valueMixin.js

				// }
				// // 控件代码
				// comp.setValue = function(){
				// 	viewModel.dataTable.setValue(field,value);
				// }

				// current_value["name"] = ele_code;
				// current_value["value"] = id_name_code;
				// viewModel.inputGrid.push(current_value);
			//var gridObj = $("#grid").parent()[0]['u-meta'].grid;
			// alert("aaaaa");
			// console.log(obj);
			// console.log(JSON.stringify(obj.element));
			// var current_value = {};
			// var ele_code = obj.field;
			// // obj.rowObj[ele_code] = "jjjjjjjjj";
			// viewModel.dataTable.setValue(ele_code,"jjjjjjjjj");
			// showAssitTree(ele_code,ele_code,1);
			// var code_name = $("#" + ele_code).val();
			// var id_name_code = $("#" + ele_code + "-h").val();
			// obj.value = code_name;
			// current_value["name"] = ele_code;
			// current_value["value"] = id_name_code;
			// viewModel.inputGrid.push(current_value);
						// setTimeout(function(){
			// 	var code_name = "";
			// 	var html = "";
			// 	if (obj.value != "") {
			// 		var values = obj.value.split("@");
			// 		code_name = values[2] + " " + decodeURI(values[1]);
			// 	} else {
			// 		code_name = "";
			// 	}
			// 	// var html = '<div class="input-group modal-input-group"><input type="text" id="' + obj.element.id + '" class="form-control" style="margin:2px 0;" value="' + code_name + '">'
			// 			// + '<span class="input-group-btn" name="show-assit-tree"><button class="btn btn-default glyphicon glyphicon-option-horizontal controlTreeIcon"  style="margin-top:-2px;"></button></span></div>';
			// 	obj.element.innerHTML = code_name;
			// 	// $("#" + obj.element.id).focus();
			// 	// treeChoice(ele_code,viewModel.accountTree,0,viewModel.gridDataTable,0);
			// 	// viewModel.dataTable.setValue(obj.field,"ssssss");
			// },500);

				// showAssitTree(ele_code,ele_code,1,viewModel.dataTable);

				// var gridObj = $("#grid").parent()[0]['u-meta'].grid;
				// console.log(obj);
				// console.log(JSON.stringify(obj.element));
				// var current_value = {};
				// var ele_code = obj.field;
				// // obj.rowObj[ele_code] = "jjjjjjjjj";
				// viewModel.dataTable.setValue(ele_code,"jjjjjjjjj");
				// var code_name = $("#" + ele_code).val();
				// var id_name_code = $("#" + ele_code + "-h").val();
				// obj.value = code_name;
				// obj.element.innerHTML = 'kkkkkkkk' // 创建编辑时的显示内容

				// viewModel.dataTable.setValue(obj.field,"ssssss");

				// }
		}
		// editTypeFun1 = function(obj){
		// 	obj.element.innerHTML = ''
		// 	// alert("nnnnnnnnnn");
		// }
		viewModel.onBeforeValueChange1 = function(obj){
			console.log(obj);
		}
		viewModel.onValueChange1 = function(obj){
			alert("sadad");
		}
		viewModel.summ = function(obj){
			console.log(obj);
			console.log(viewModel);
			if(obj.gridCompColumn.options.field == "distance"){
				obj.element.parentNode.style.height = 'auto';
				obj.element.parentNode.innerHTML = '<div class = "text-left" style="height:15px; line-height:15px;">总计：500</div><div class = "text-left" style="height:15px; line-height:15px;">小计：' + obj.value + '</div>';
			} else {
				obj.element.parentNode.style.height = 'auto';
				obj.element.parentNode.innerHTML = '<div class = "text-left" style="height:15px; line-height:15px;">总计：1000</div><div class = "text-left" style="height:15px; line-height:15px;">小计：' + obj.value + '</div>';
			}
		}
		viewModel.sortFun = function (field,sort) {
			console.log(field);
			console.log(sort);
			if (sort == undefined) {
				console.log("1111111");
			}
			alert("ssssssssssssssss");
		}
		viewModel.cc = function(){
			viewModel.dataTable.setSimpleData(datas);
		}
		$(function() {
			viewModel.dataTable.setSimpleData(data);
			ko.cleanNode($('.demo-continer')[0]);
			app = u.createApp({
				el: '.demo-continer',
				model: viewModel
			});
			
			combo1Obj = document.getElementById('grid')['u.Combo'];
			console.log(combo1Obj);
			
			// 将数据添加到gird中
			// $("span[name='show-assit-tree-render']").on("click",function(){
			// 	showAssitTree(viewModel.field_name,viewModel.field_name,0,viewModel.dataTable,0);
			// });
		});
	});