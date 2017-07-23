var _gameTimeNum =2000,_gameTime,nun=0,_gameTime,_gameStart = false;
$(function(){
	$(".gameBtn span").on('touchstart',function(){
		gemeXClick();
		event.preventDefault();
	})
	$(".gameBtn font").on('touchstart',function(){
		gemeJClick();
		event.preventDefault();
	})
		   
		   
	//游戏规则显示隐藏
	$(".gz").click(function(){
		$(".gzPop").fadeIn();
	})
	$(".gzPop,.fxPop").click(function(){
		$(".gzPop,.fxPop").fadeOut();
	})
	//分享
	$(".btn3").click(function(){
		$(".fxPop").fadeIn();
	})
	$(".gamePlay").height($(window).height())
	
	
	//首次开始游戏
	$(".btn1").click(function(){
		$(".yanshi").show();
		$(".boxBox").hide();
		$(".yanshiGo").delay(3000).fadeIn();
		
	})
		$(".yanshiGo").click(function(){
			$(".gamePlay").show();
			$(".yanshi").remove();
		})
	
	//再玩一次
	$(".btn5").click(function(){
		$(".gameFs span").html(0);
		$(".gameDate").html('20"00');
		$(".gamePlay").show();
		$(".boxBox").hide();
		_gameStart = false;
		_gameTimeNum = 2000;
	})
	
	//是否提现
	if(cash!=0){
		$(".btn4,.btn1,.box1").hide();
		$(".btn2,.btn5,.box2").show();
	}
	
	//是否玩过
	if(Played!=0){
		$(".btn4,.btn1,.box1").hide();
		$(".btn4,.btn5,.box2").show();
	}
	
	
})


//正确
function zh(){
	$(".gameFs i").show();
	$(".gameFs i").stop(true,true).animate({
		top:'-0.2rem',
		opacity:'0'
	},100,function(){
		$(".gameFs i").css({
			top:'0',
			opacity:'1',
			display:'none'
		});	
	});
	Score(+1);
}

//错误
function cw(){
	$(".gameFs em").show();
	$(".gameFs em").stop(true,true).animate({
		top:'-0.2rem',
		opacity:'0'
	},100,function(){
		$(".gameFs em").css({
			top:'0',
			opacity:'1',
			display:'none'
		});	
	});
	Score(-1);
	
}



//得分
function Score(i){
	if(parseInt($(".gameFs span").html())+parseInt(i)<0){
		return;
	}else{
		$(".gameFs span").html(parseInt($(".gameFs span").html())+parseInt(i));
	}
}

//游戏动画
function gameDown(){
	if( !_gameStart ){
		gameGo();
	}
	var several=parseInt(Math.random()*2);
	var bename=parseInt(Math.random()*2);
	$(".gameBox div").stop(true,true).animate({
		margin:"25% 0 0"					  
	},100,function(){
		$(".gameBox .gameOn").remove();
		$(".gameBox ul:last").addClass("gameOn");
		$(".gameBox div").prepend('<ul><li></li><li></li></ul>');
		$(".gameBox ul:first li").eq(several).addClass("gameZt"+bename);
		$(".gameBox div").css({margin:"0"})
	})
}

//点击按钮
function gemeXClick(){
	if($(".gameOn").find(".gameZt0").length==1){
		zh();
	}
	else{
		cw();
	}
		gameDown();
}
function gemeJClick(){
	if($(".gameOn").find(".gameZt1").length==1){
		zh();
	}
	else{
		cw();	
	}
		gameDown();
}


//开始游戏时间
function gameGo(){
	_gameStart = true;
	_gameTime = setInterval(gameTime, 10);	
}
function creatTimeText( n ){
	var text = (100000+n+'').substr(-4,4);
	text = text.substr(0,2)+"'"+text.substr(2)
	return text;
}

function gameTime(){
	_gameTimeNum --;
	if( _gameTimeNum <= 0){
		gameOver();
	}else{
		$(".gameDate").html(creatTimeText(_gameTimeNum));
	}
}

//游戏结束
function gameOver(){
	clearInterval(_gameTime);
	_nun=$(".gameFs span").html();
	_jl=_nun*10;
	if(_nun >= nun){
		nun=_nun;		
	}
	
	$(".box1,.gamePlay,.btn1").hide();
	$(".boxBox,.box2,.btn4,.btn5").show();
	if(cash!=0){
		$(".gzCont").html('本局正确张数：'+_nun+'张<span>领奖时最高成绩：'+nun+'张<br>已获得'+_jl+'元现金</span>');
	}
	else{
		$(".gzCont").html('本局正确张数：'+_nun+'张<span>领奖时最高成绩：'+nun+'张<br>可获得'+_jl+'元现金</span>');	
	}
}












