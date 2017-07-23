define(function (require) {
    var inviterUserId=Js.getParam("user")=="null" ? "" : Js.getParam("user");


    return{
        run:function(){
            var hashchangeEventFriend = function () {
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
	        }
            hashchangeEventFriend();
	    }
    }
})