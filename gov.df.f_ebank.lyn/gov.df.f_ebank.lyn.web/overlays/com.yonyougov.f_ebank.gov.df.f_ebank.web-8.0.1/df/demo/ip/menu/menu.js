require(['jquery', 'knockout', 'bootstrap', 'uui', 'director', 'tree', 'grid', 'ip'],
    function ($, ko) {
        var menuViewModel = {
            data: ko.observable({}),
        }
        menuViewModel.getInitData = function () {
			var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8);
            $.ajax({
                url: "/df/login/LoginMessage.do",
                type: 'GET',
                dataType: 'json',
				data: tokenid,
                success: function (data) {
					console.log(data);
                    // initMenu(data.data);
                }
            });
        }
        menuViewModel.initMenu = function (data) {
            var menu_template = '<ul class="fl">';
            for (var i = 0; i < data.length; i++) {
                menu_template += '<li><a href="' + data[i].url + '" class="a">' + data[i].name + '</a>';
                var child_data_two = data[i].child;
                if (child_data_two.length > 0) {
                    menu_template += '<div class="sub_nav sub_nav_1"><div class="in"><div class="clearfix bd">';
                    for (var k = 0; k < child_data_two.length; k++) {
                        menu_template += '<dl class="fl"><dt>' + data[i].child[k].name + '</dt><dd>';
                        var child_data_three = data[i].child[k].child;
                        if (child_data_three.length > 0) {
                            for (var j = 0; j < child_data_three.length; j++) {
                                menu_template += '<a href="' + child_data_three[j].url + '">' + child_data_three[j].name + '</a>';
                            }
                            menu_template += '</dd></dl>';
                        }
                    }
                    menu_template += '</div><div class="ft"><a href="javascript:;"></a></div></div></div>';
                }
                menu_template += '</li>';
            }
            $("#menu-area").append(menu_template);
        }
        $(function () {
            ko.cleanNode($('body')[0]);
            app = u.createApp({
                el: 'body',
                model: menuViewModel
            });
            menuViewModel.getInitData();
        });
    });
