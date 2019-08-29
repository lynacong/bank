//type:warning||error||success
var ufma = {};
ufma.timeID = 0;
ufma.getTimeID = function()
{
	ufma.timeID += 1;
	return 'timeID'+ufma.timeID;
};
ufma.showTip = function(msg,callback,type)
{
	var topZindex = 0;
	var $topDiv;
	$('div').each(function(){
		var tmpIndex = $(this).css('z-index');
		if(tmpIndex != 'auto'){
			if(topZindex < parseInt(tmpIndex)){
				topZindex = parseInt(tmpIndex);
				$topDiv = $(this);
			}
		}
	});

	if(topZindex == 0) {
		topZindex = 1001;
		$topDiv = $('body');
	}else {
		topZindex = topZindex + 1;
		$topDiv = $topDiv.parent();
	}
	topZindex = topZindex + 1;
	var icon = '<span class="icon icon-warning"></span>';
	var tipType = 'ufma-tip-warning';
	if(type=='success'){
		tipType = 'ufma-tip-success';
		icon = '<span class="icon icon-check-circle ufma-green"></span>';
	}else if(type=='error'){
		tipType = 'ufma-tip-error';
		icon = '<span class="icon icon-warning ufma-red"></span>';
	}else if(type=='warning'){
		tipType = 'ufma-tip-warning';
		icon = '<span class="icon icon-warning ufma-yellow"></span>';
	}
	
	var _tip = $('<div class="ufma-tip '+tipType+'" style="z-index:'+topZindex+';top:40px;"><span class="u-msg-close uf uf-close icon-close"></span>'+icon+msg+'</div>');
	_tip.hide().appendTo($topDiv).fadeIn();
	_tip.css('left',($(window).width() - _tip.outerWidth(true))/2);
	var timeID = ufma.getTimeID();
	ufma[timeID] = setTimeout(function(){
		_tip.remove();0
		if(callback != undefined){
			callback();
		}
		clearTimeout(ufma[timeID]);
	},3000);

	_tip.find('.u-msg-close').on('click',function(){
		_tip.remove();
		clearTimeout(ufma[timeID]);
		if(callback != undefined){
			callback();
		}
	});
};