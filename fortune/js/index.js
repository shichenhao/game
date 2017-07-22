
    function initial(){
		$(".cyBox").html($("#fortuneTemplate").html()).show();
		$("#btnGo").click(function(){
			initialTo()
		})
    }
    function initialTo(){
		$(".cyBox").html($("#fortunebtnTemplate").html());

		$(".cyForm ul li b,.cyForm ul li span").click(function(){
			$(".cengPop").show();
		})

		$(".cengClose").click(function(){
			$(".cengPop").hide();
		})

		$(".cengPop span").click(function(){
			starsignHtml=$(this).find("b").html();
			$(".cengPop .hover").removeClass("hover");
			$(this).addClass("hover");
			$(".cengPop").hide();
			$(".cyForm ul li span").html(starsignHtml).attr("data-starsign",$(this).attr("data-starsign"))
		})

		$(".peoBor").click(function(){
			$(".cyPeople .hover").removeClass("hover");
			$(this).addClass("hover");		
		})

		$("#btn").click(function(){
			var t1=$("input").val(),
				t2=$(".cyForm ul li span").html(),
				t3=$(".cyPeople .hover").length;

			if(t1==""){
				cengAlert("请填写阁下的姓名！");
				return false;
			}
			if(t2.length==7){
				cengAlert("请选择阁下的星座！");
				return false;
			}
			else{
				//$(".cengAlert").addClass("cengAlertb").find("span").html("你长的太丑，把程序员吓坏了，程序逃跑了！");
				names=$(".names").val(),
				sex=$(".hover .cyPeopleoTop").attr("data-sex"),
				starsign=$(".starsign").attr("data-starsign"),
				Go()
				return false;
			}
		})
    }

    function cengAlert(str){
		$(".cengAlert").addClass("cengAlertb").find("span").html(str);
		times();
    }

	function times(){
		setTimeout(function(){$(".cengAlert").removeClass("cengAlertb")},1000)
	}

	function Go(){
		$(".baseLoading").show();
		setTimeout(function(){
			$(".baseLoading").hide();
		},3000)

		/*
		 Js.ajaxPost({
            url: "/appapi/fortuneTelling",
            showload: true,
            data: {
                name: names,
                sex: sex,
                starsign: starsign
            },
            success: function (data) {
            	if(data.resultCode==0){
					$(".baseLoading").hide();
        			$(".cyBox").html($("#overTemplate").html()).show();
	            	$(".again").click(function(){
	        			initialTo();
	            	})

            	}
            }
        })*/
	}

	initial();

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