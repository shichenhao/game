define(function (require) {

    //获取地址栏参数
    var inviterUserId=Js.getParam("user")=="null" ? "" : Js.getParam("user");

    //模拟数据
    var data={
        num:1,
        beat:1,
        activityRecord:{
            pickMoney:1
        }
    }


    var renderErrer = function (txt,type){
        $(".baseLoading").hide();
        $(".alertPop2 .alertTit").hide();
        if(type==1){
            $(".alertPop2 .alertTit").eq(0).show();
            $(".alertBtn2 span").click(function(){
                if(inviterUserId){
                    firendInit();
                }
                else{
                    init();
                }
            })
        }
        else{
            $(".alertPop2 .alertTit").eq(1).show();
        }
        $(".alertPop2").show().find(".alertCont").html(txt);
    }


    //倒计时
    var gameGo = function(){
        var interval = setInterval(function(){
            //console.log(times)
            if(times==0){
                num2=num/100;
                clearInterval(interval);
                $(".baseLoading").show();
                var datas = {
                    method:"countmoney",
                    countMoney:num2
                }
                if(num2<11 && num2>0){
                    beat="60%";
                }
                else if(num2<17 && num2>10){
                    beat="70%";
                }
                else if(num2<33 && num2>17){
                    beat="80%";
                }
                else if(num2<32 && num2>41){
                    beat="90%";
                }
                else if(num2<40 && num2>151){
                    beat="99%";
                }
                else if(num2>150){
                    renderErrer("天啦噜，手太快，成绩冲到外太空了~!",1);
                }
                else{
                    beat="0%";
                }
                if(!inviterUserId){
                    if(!tempData.activityRecord.pickMoney){
                        getAjax(datas, function(data){
                            if(!receives){
                                    receives=true;
                                    data=tempData;
                                    data.activityRecord.score=num,
                                    data.num=num,data.type=(inviterUserId ? 3 : 1),data.beat=beat;
                                    $(".box").html(Js.applyTemplate("initTemplate",data));
                            }
                            else{
                                data=tempData;
                                console.log(data)
                                data.num=num,data.type=(inviterUserId ? 3 : 1),data.beat=beat;
                                $(".box").html(Js.applyTemplate("initTemplate",data));
                            }
                        });
                    }
                }
                else{
                    data.num=num,data.type=(inviterUserId ? 3 : 1),data.beat=beat;
                    $(".box").html(Js.applyTemplate("initTemplate",data));
                }
                $(".baseLoading").hide();
                return;
            }
            times--;
            $("#times").html(times);
            
        },1000)
    }

    //初始化加载
    var gameInit = function(){
            var el = document.querySelector('.gameHb');
            var startPosition, endPosition, deltaX, deltaY, moveLength;
            el.addEventListener('touchstart', function (e) {
                var touch = e.touches[0];
                moveLength=0;
                startPosition = {
                    y: touch.pageY
                }
            });

            el.addEventListener('touchmove', function (e) {
                var touch = e.touches[0];
                endPosition = {
                    y: touch.pageY
                }

                deltaY = endPosition.y - startPosition.y;
                moveLength = startPosition.y-endPosition.y
            });

            el.addEventListener('touchend', function (e) {
                if(moveLength && moveLength>20){
                    if(type==false){
                        type=true;
                        gameGo();
                    }
                    num=num+100;
                    $("#Number").html(num);
                    $(".gameCeng").before('<div class="gameAnimate gameAnimateHover"></div><span class="gameAnimateSpan" style="transform:rotate('+(Math.random()*360)+'deg);left:'+(((Math.random()*2)))+'rem"></span>');
                }
            });

            //监听动画
            $(".gameHb")[0].addEventListener("animationend", gameCheck, false);
            function gameCheck(){
                $(".gameAnimateSpan").eq(0).remove();
                $(".gameAnimateHover").eq(0).remove();
            }
    }

    //领奖
    var receive = function(){
        var datas = {
            method:"award"
        }
        getAjax(datas, function(data){
            tempData = data;
            $(".baseLoading").hide();
            $(".alertPop1").show().find(".alertCont span").html("￥"+num);
            $(".alertPop1 .alertBtn span").eq(1).click(function(){
                init();
            })
        });
    }

    //初始化游戏
    var game = function(){
        num=0, times=8 ,type = false;
        $(".box").html(Js.applyTemplate("gameTemplate",{}));
        gameInit();
    }

    //加载用户信息
    var init = function(){
        var datas = {
            method: "index"
        }

    }

    //加载被邀人信息
    var firendInit = function(){
        var datas = {
            method: "index",
            inviter: inviterUserId
        }
        $(".box").html(Js.applyTemplate("initTemplate",data));
    }

    return{
        run:function(){
            var hashchangeEventFriend = function () {
                if(inviterUserId){
                    firendInit();
                }
                else{
                    init();
                }
                //开始游戏
                $(".box").on("click","#gameGo",function(){
                    game();
                })

                //领奖
                $(".box").on("click","#receive",function(){
                    receive();
                })

                //登录
                $(".box").on("click","#login",function(){
                    window.location.href="login.html?user="+inviterUserId+"&friendCode="+friendCode;
                })

                //被邀人玩游戏
                $(".box").on("click","#firendFirst",function(){
                    window.location.href="index.html?friendCode="+friendCode;
                })
                //被邀人帮忙
                $(".box").on("click","#firendGo",function(){
                    if(tempData.isHelp){
                        renderErrer("您已经帮"+helpName+"数过了不能再帮其他好友数钱啦继续邀好友冲刺排行榜奖励吧！");
                        return false;
                    }
                    if(!$.os.wx){ 
                        renderErrer("请在微信浏览器里帮助好友助力!");
                        return false;
                    } 
                    game();                    
                })
                //被邀人确定成绩
                $(".box").on("click","#firendEnd",function(){
                    $(".baseLoading").show();
                    var datas = {
                        method:"countmoney",
                        inviter: inviterUserId,
                        countMoney:num2
                    }
                    getAjax(datas, function(data){
                        $(".baseLoading").hide();
                        data.type = 4;
                        data.num=num;
                        data.firend=true;
                        $(".box").html(Js.applyTemplate("initTemplate",data));
                    });
                })






                //好友帮忙记录
                $(".box").on("click","#firends",function(){
                    $(".baseLoading").show();
                    var datas = {
                        method:"friendsHelpRecord"
                    }
                    
                    data={
                        num:2000,
                        activityRecordList:[
                            {
                                photoUrl:"https://static.oschina.net/uploads/user/1488/2976815_50.jpg?t=1497580590000",
                                mobile:15921234021,
                                score:2,
                                powerDescription:"哈哈~",
                                createTime:"2017-6-12"
                            },
                            {
                                photoUrl:"https://static.oschina.net/uploads/user/731/1463736_50.jpg?t=1454682553000",
                                mobile:13825748586,
                                score:2,
                                powerDescription:"加油~",
                                createTime:"2017-6-13"
                            },
                            {
                                photoUrl:"https://static.oschina.net/uploads/user/1488/2976815_50.jpg?t=1497580590000",
                                mobile:13539697001,
                                score:2,
                                powerDescription:"哈哈~",
                                createTime:"2017-6-14"
                            }
                        ]
                    }

                    $(".baseLoading").hide();
                    $(".box").html(Js.applyTemplate("firedRecordTemplate",data));

                })

                //分享
                $(".box").on("click","#share",function(){
                    $("#shareFixed").show();
                })
                $(".box").on("click","#goBack",function(){
                    window.location.href="";
                })
                $("#shareFixed").click(function(){
                    $("#shareFixed").hide();
                })

                //规则
                $(".box").on("click","#rule",function(){
                    window.location.href="rule.html"
                })

                //关闭弹层
                $(".alertBtn span").click(function(){
                    $(".alertPop").hide();
                })
                //查看奖励
                $(".alertBtn #lookReward").click(function(){
                    window.location.href="/#path=views/account/coupons";                  
                })

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