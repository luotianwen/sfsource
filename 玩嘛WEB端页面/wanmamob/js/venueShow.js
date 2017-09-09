$(function(){
    var that=$("#nevueShowTopD");
    var topNum= that.height()+that.offset().top;
    $(window).on("scroll",function(){
        if($(document).scrollTop()>topNum){
            $(".fixedTop").show();
        }else{
            $(".fixedTop").hide();
        }
        if($(document).scrollTop()>$(window).height()){
            $(".goTop").show();
        }else{
            $(".goTop").hide();
        }
    });

    $(".catalogueSpan").on("click",function(){
        var that=$(".tier");
        that.show();
        $(".particularsMenu").stop().animate({"left":"-0"});
        that.on("click",function(e){
                $(".particularsMenu").stop().animate({"left":"-200%"},function(){
                    $(".tier").hide();
                    //$(".green").next().show();
                });
        });
    });

    $(".green").on("click",function(){
        $(this).next(".oUl").toggle();
        return false;
    })

});
