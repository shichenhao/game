$(function(){
		   
	//分辨率自适应
	$(window).resize(function () {
		loads();
	 })
	loads()
	
	//游戏规则显示隐藏
	$(".PopClose").click(function(){
		$(".moneyP").fadeOut();
	})
	$(".moneyRules").click(function(){
		$(".moneyP").fadeIn();
	})
	
	//获取验证码
	$(".registerYzm1").click(function(){
		$(this).hide();
		$(".registerYzm2").show();
		regdjs();
	})
	
	//游戏演示
	$(".btnYanshi").click(function(){
		$(".yanshi,.bgceng").show();
		$(".yanshi .btn1s").delay(1000).fadeOut()
		$(".bgceng").delay(1200).fadeOut()
		$(".bgceng").delay(2300).fadeIn()
		$(".yanshi .btn1").delay(4000).fadeIn()
	})
})

//验证码倒计时
function regdjs(){
	var djs=$(".registerYzm2 i").html();
	$(".registerYzm2 i").html(djs-1);
	stops=setTimeout("regdjs()",1000);
	stops;
	if(djs==1){
		$(".registerYzm1").show();
		clearTimeout(stops);
		$(".registerYzm2").hide();
		$(".registerYzm2 i").html(60);
	}
}





//分辨率自适应
function loads(){

	if(document.body.clientWidth<=320){
		$("html").css({fontSize:"100px"})
	}
	else if(document.body.clientWidth<=360){
		$("html").css({fontSize:"112.5px"})
	}
	else if(document.body.clientWidth<=375){
		$("html").css({fontSize:"117.1875px"})
	}
	else if(document.body.clientWidth<=384){
		$("html").css({fontSize:"120px"})
	}
	else if(document.body.clientWidth<=400){
		$("html").css({fontSize:"125px"})
	}
	else if(document.body.clientWidth<=414){
		$("html").css({fontSize:"129.375px"})
	}
	else if(document.body.clientWidth<=424){
		$("html").css({fontSize:"132.5px"})
	}
	else if(document.body.clientWidth<=480){
		$("html").css({fontSize:"150px"})
	}
	else if(document.body.clientWidth<=540){
		$("html").css({fontSize:"168.75px"})
	}
	else if(document.body.clientWidth>=640){
		$("html").css({fontSize:"200px"})
	}	
}