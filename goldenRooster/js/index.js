define(function (require) {
    require("../js/base.js");
    var inviterUserId=Js.getParam("user")=="null" ? "" : Js.getParam("user");
    //点亮动画
	var light=function(i){
        $(".JJfirend img").eq(i-1).attr("src","https://static.oschina.net/uploads/user/1488/2976815_50.jpg?t=1497580590000")
        $(".JJjd span").removeClass("hover");
		for(a=0;a<i;a++){
            $(".JJjd span").eq(a).addClass("hover");
			$(".JJphoto img").eq(i).hide();
		}
		if(i<7){
			$(".JJphoto img").eq((i)).show().animate({opacity: 0}, 0, 'ease-out',function(){$(".JJphoto img").eq((i)).show().animate({opacity: 1}, 500, 'ease-out')});
		}
		else{
			$(".JJphotoBg").hide();
		}
	}

    //第一次点亮
    var proint=function(){
        $(".hide").hide();
        $(".myGift").css("display","inline-block");
        $(".JJtit").hide();
        $(".JJtit").eq(0).show();
        $(".JJbox1").show();
        $(".JJphoto").addClass("JJphotos");
        $(".JJphoto").removeClass("JJphoto");
        $(".JJfirend").show();
        light(7);
    }

    var firends=function(cont){
        cont+=1;
        if(cont<7){
            light(cont)
        }
        else{
            proint();
        }
    }


    return{
        run:function(){
            var hashchangeEventFriend = function () {
                setTimeout(function(){
                    $(".baseLoading").hide();
                    $(".JJt1").show();
                },1)
				var login=function(i){
                    $(".JJt1").show();
					$(".JJbox").show();
				}
            	login(0);
            	//分享按钮
				$("#shareBtn,.shareBtn").click(function(){
	            	$("#shareFixed,.cengbg").show();
				})
				$(".JJfirendMe").click(function(){
	            	$("#shareFixed,.cengbg2").show();
				})
				//关闭
	            $("#shareFixed").click(function(){
	            	$("#shareFixed,.cengbg,.cengbg2").hide();
	            })

	            $(".myGifts").click(function(){
	            	$(".JJend1,.JJsuccess1").show();
	            })

                $(".JJcgClose").click(function(){
                    $(".JJend1,.JJsuccess1").hide();
                })

	            $(".JJendGift").click(function(){
		        	location.href="/#path=views/account/index";
	            })

	            $("#myGift2").click(function(){
		        	location.href="/#path=views/account/coupons";	            	
	            })

	            $("#btnTx").click(function(){
		        	location.href="/#path=views/account/coupons";	            	
	            })
	            $("#btnTyj").click(function(){
		        	location.href="/#path=views/experience/index";	            	
	            })

	            $(".alertBtn2").click(function(){
		        	location.href="index.html";
	            })

	            //第一次点亮
	            $("#oneBtn").click(function(){
                    light(1);
                    $(".hide").hide();
                    $(".JJt4").show();
	            })

	            //好友帮忙点亮
	            $("#firendsBtn").click(function(){
					$(".cengbg,.baseFirend").hide();
	            })

				$("#firendLight").click(function(){
			    	firends($(".JJjd .hover").length);
				})

	            //我也要玩
	            $(".myGame").click(function(){
            		$(".JJend2,.cengbg,.JJalert").hide();
					$(".JJbox").show();
	            	//inviterUserId="";
	            	location.href="index.html"
           			//hashchangeEventFriend();
	            })


	        }
            hashchangeEventFriend();
	    }
    }
})