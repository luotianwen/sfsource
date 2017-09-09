window.onload=function(){
    var bodyWidth=document.body.clientWidth;
    var Html=document.getElementById("htmlOne");
    Html.style.fontSize=bodyWidth/10+"px";
    if(bodyWidth>=750){Html.style.fontSize="75px";}
    Html.style.overflowX="hidden";

    $(".goBotton").on("click",function(){
        window.history.go(-1);
        window.location.reload();
    });

};
