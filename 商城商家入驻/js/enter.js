$(document).ready(function(){

    $(".navigation-font").on("click",function(){
        $(".navigation-font").removeClass("red");
        $(this).addClass("red");
        var num=$(this).index();
       // alert(num)
        //var num=2;
        //$("div.one>div).eq(num).show();
        $(".index").hide();
        var index=document.getElementsByClassName("index")[num];
        index.style.display="block";
    })
})
