$(function(){
	$(".JJgz").click(function(){
		$(".cengbg,.baseGz").show();
	})


	$(".JJalertClose").click(function(){
		$(".cengbg,.JJalert").hide();
	})

	/*$("#firendLight").click(function(){
		$(".cengbg,.baseFirend").show();
	})*/


	function windowAuto(){
		w=$(window).width();
		if(w<720 && w>320){
			$("html,body").css("fontSize",w*0.2777777777+"px")
		}
		else if(w<=320){
			$("html,body").css("fontSize","88.88px")
		}
		else{
			$("html,body").css("fontSize","200px")
		}
	}
	windowAuto();
	$(window).resize(function(){
		windowAuto();
	});

})

